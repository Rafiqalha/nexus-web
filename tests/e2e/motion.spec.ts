import { expect, test, type Page } from "@playwright/test";

test("early scroll effects preserve server markup during slow page hydration", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.addInitScript(() => {
    const changes: string[] = [];
    Object.defineProperty(window, "__heroAttributeChanges", { value: changes });
    new MutationObserver((records) => {
      for (const record of records) {
        if (
          record.target instanceof Element &&
          record.target.matches(".hero-copy > h1, .hero-summary, .hero-visual")
        )
          changes.push(`${record.target.tagName}:${record.attributeName}`);
      }
    }).observe(document, { attributes: true, subtree: true });
  });
  // Let the root effects load before the interactive page chunk, as can happen
  // during streamed hydration on a slower connection.
  await page.route("**/_next/static/chunks/*.js", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    if (body.includes("Lease expired")) {
      await new Promise((resolve) => setTimeout(resolve, 450));
    }
    await route.fulfill({ response, body });
  });
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  for (let load = 0; load < 2; load++) {
    await page.goto("/");
    await page.getByRole("button", { name: "Expired", exact: true }).click();
    await expect(
      page.getByText("Lease expired", { exact: true }),
    ).toBeVisible();
    const changes = await page.evaluate(
      () =>
        (
          window as typeof window & {
            __heroAttributeChanges: string[];
          }
        ).__heroAttributeChanges,
    );
    expect(changes).toEqual([]);
  }
  expect(consoleErrors).toEqual([]);
  await session.detach();
});

async function observeMotion(page: Page, action: () => Promise<unknown>) {
  const sample = page.evaluate(
    () =>
      new Promise<{
        names: string[];
        translated: boolean;
      }>((resolve) => {
        const names = new Set<string>();
        let translated = false;
        const until = performance.now() + 1400;
        function frame() {
          for (const animation of document.getAnimations()) {
            if (animation instanceof CSSAnimation)
              names.add(animation.animationName);
            if (animation.effect instanceof KeyframeEffect) {
              translated ||= animation.effect
                .getKeyframes()
                .some(
                  (keyframe) =>
                    typeof keyframe.translate === "string" &&
                    keyframe.translate !== "0 0",
                );
            }
          }
          if (performance.now() < until) requestAnimationFrame(frame);
          else resolve({ names: [...names], translated });
        }
        frame();
      }),
  );
  await action();
  return sample;
}

test("navigation animates the content while keeping the header anchored", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const headerBefore = await page.locator(".site-header").boundingBox();
  const motion = await observeMotion(page, () =>
    page
      .getByRole("navigation", { name: "Main navigation", exact: true })
      .getByRole("link", { name: "Product", exact: true })
      .click(),
  );
  await expect(page).toHaveURL(/\/product$/);
  expect(motion.names).toContain("route-fade-in");
  expect(motion.names).toContain("route-fade-out");
  expect((await page.locator(".site-header").boundingBox())?.y).toBe(
    headerBefore?.y,
  );
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/demo/walkthrough");
  await page.getByRole("button", { name: "Expired", exact: true }).click();
  await expect(page.getByText("Lease expired", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Rejected", exact: true }).click();
  await expect(page.getByText("Failed", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await expect(
    page.getByText("Accepted under policy", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("native scrolling reveals content and same-page anchors preserve URL and focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const progress = page.locator(".reading-progress > span");
  const initialProgress = await progress.evaluate(
    (el) => getComputedStyle(el).transform,
  );
  const motion = await observeMotion(page, () => page.mouse.wheel(0, 1200));
  expect(motion.translated).toBe(true);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(500);
  expect(
    await progress.evaluate((el) => getComputedStyle(el).transform),
  ).not.toBe(initialProgress);
  await expect(
    page.getByRole("heading", { name: /From application context/ }),
  ).toBeVisible();
  await page.goto("/developers");
  await page.getByRole("link", { name: /Integration overview Follow/ }).click();
  await expect(page).toHaveURL(/\/developers#integration$/);
  await expect(page.locator("#integration")).toBeFocused();
  await expect
    .poll(async () => (await page.locator("#integration").boundingBox())!.y)
    .toBeLessThan(110);
  expect((await page.locator("#integration").boundingBox())!.y).toBeGreaterThan(
    60,
  );
  await page.goBack();
  await expect(page).toHaveURL(/\/developers$/);
});

test("reduced motion cancels running reveals and keeps actions immediate", async ({
  page,
}) => {
  await page.goto("/");
  await page.mouse.wheel(0, 1000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".reading-progress")).toBeHidden();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => animation.playState === "running").length,
      ),
    )
    .toBe(0);
  await page.goto("/demo/walkthrough");
  await page.getByRole("button", { name: "Server error" }).click();
  await expect(page.getByText("No decision", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === "running").length,
    ),
  ).toBe(0);
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await expect(
    page.getByText("Accepted under policy", { exact: true }),
  ).toBeVisible();
});

test("navigation and demo remain functional without native view transitions", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(document, "startViewTransition", {
      value: undefined,
      configurable: true,
    });
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("link", { name: "Demo", exact: true }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await page
    .getByRole("link", { name: "Evidence walkthrough", exact: true })
    .click();
  const preview = page.getByRole("region", {
    name: "Interactive evidence walkthrough",
  });
  await page.getByRole("button", { name: "Missing evidence" }).click();
  await expect(preview.getByText("Unavailable", { exact: true })).toHaveCount(
    4,
  );
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await expect(
    preview.getByText("Accepted under policy", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
