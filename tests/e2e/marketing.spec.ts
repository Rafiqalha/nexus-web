import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
const routes = [
  "/",
  "/product",
  "/developers",
  "/security",
  "/company",
  "/request-access",
  "/demo",
  "/demo/walkthrough",
];

for (const width of [320, 360, 390, 768, 1024, 1440]) {
  test(`all public pages reflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/Nexus/);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        route,
      ).toBe(true);
      if (width === 390 || width === 1440) {
        await page.screenshot({
          path: `test-results/visual/${route === "/" ? "home" : route.slice(1)}-${width}.png`,
          fullPage: true,
        });
      }
    }
    expect(errors).toEqual([]);
  });
}

test("navigation and every internal link reach a real page or anchor", async ({
  page,
  request,
}) => {
  const links = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    for (const href of await page
      .locator('a[href^="/"], a[href^="#"]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("href")!),
      )) {
      links.add(href.startsWith("#") ? `${route}${href}` : href);
    }
  }
  for (const href of links) {
    const url = new URL(href, "http://127.0.0.1:3100");
    expect((await request.get(url.pathname)).status(), href).toBe(200);
    if (url.hash) {
      await page.goto(href);
      await expect(page.locator(url.hash)).toHaveCount(1);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: "Product", exact: true })
    .click();
  await expect(page).toHaveURL(/\/product$/);
  await expect(
    page.getByRole("link", { name: "Product", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

test("keyboard skip link and mobile menu work with Escape focus restoration", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const toggle = page.getByText("Menu", { exact: true });
  await toggle.click();
  const nav = page.getByRole("navigation", {
    name: "Mobile navigation",
    exact: true,
  });
  await expect(nav).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    nav.getByRole("link", { name: "Product", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
  await expect(page.locator("summary")).toBeFocused();
  await page.keyboard.press("Enter");
  await nav.getByRole("link", { name: "Developers", exact: true }).click();
  await expect(page).toHaveURL(/\/developers$/);
  await expect(nav).toBeHidden();
});

test("synthetic scenarios preserve trust boundaries and reset without live services", async ({
  page,
}) => {
  await page.goto("/demo/walkthrough");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await expect(page.getByText("Simulated data")).toHaveCount(2);
  const preview = page.getByRole("region", {
    name: "Interactive evidence walkthrough",
  });
  await expect(
    preview.getByText("Accepted under policy", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Expired", exact: true }).click();
  await expect(
    preview.getByText("Lease expired", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Rejected", exact: true }).click();
  await expect(preview.getByText("Failed", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Missing evidence" }).click();
  await expect(preview.getByText("Unavailable", { exact: true })).toHaveCount(
    4,
  );
  await page.getByRole("button", { name: "Server error" }).click();
  await expect(preview.getByText("No decision", { exact: true })).toBeVisible();
  await expect(
    preview.getByText("Request timed out", { exact: true }),
  ).toBeVisible();
  await expect(preview.getByText("Unverified", { exact: true })).toBeVisible();
  await expect(preview.getByText("Simulated", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await expect(
    preview.getByText("Accepted under policy", { exact: true }),
  ).toBeVisible();
  expect(
    requests.filter((url) => !url.startsWith("http://127.0.0.1:3100/")),
  ).toEqual([]);
  expect(requests.filter((url) => url.includes("/api/"))).toEqual([]);
});

test("access draft validates, downloads honestly, preserves values, and never submits data", async ({
  page,
}) => {
  await page.goto("/request-access");
  const writes: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") writes.push(request.url());
  });
  await expect(page.getByText("Access intake is not open yet")).toBeVisible();
  await page.getByRole("button", { name: "Download local draft" }).click();
  await expect(page.getByLabel("Name", { exact: false }).first()).toBeFocused();
  await expect(page.getByText("Enter your name.")).toBeVisible();
  await page
    .getByLabel("Name", { exact: false })
    .first()
    .fill("Sample Developer");
  await page.getByLabel("Work email").fill("invalid");
  await page
    .getByLabel("Organization")
    .fill(
      "Synthetic Example Organization with a deliberately long name for form verification",
    );
  await page.getByLabel("Role").fill("Engineer");
  await page
    .getByLabel("Intended integration")
    .selectOption("Android staging evaluation");
  await page.getByRole("button", { name: "Download local draft" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await page.getByLabel("Work email").fill("developer@example.test");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download local draft" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("nexus-access-request-draft.txt");
  const draft = await readFile((await download.path())!, "utf-8");
  expect(draft).toContain("LOCAL DRAFT");
  expect(draft).toContain("Not submitted.");
  expect(draft).toContain("developer@example.test");
  await expect(page.getByRole("status")).toContainText(
    "has not been submitted",
  );
  await expect(page.getByLabel("Organization")).toHaveValue(
    /Synthetic Example/,
  );
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
});

test("all pages pass automated accessibility checks on mobile and desktop", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(result.violations, `${route} at ${width}px`).toEqual([]);
    }
  }
});

test("reduced motion and 200 percent text scaling preserve content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto("/");
  expect(
    await page
      .locator(".hero-visual")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  expect(
    await page
      .locator("html")
      .evaluate((el) => getComputedStyle(el).scrollBehavior),
  ).toBe("auto");
  // Real computed text sizes are doubled to exercise text-only zoom independently of viewport reflow.
  await page.evaluate(() => {
    const sizes = [...document.querySelectorAll<HTMLElement>("body *")].map(
      (el) => [el, parseFloat(getComputedStyle(el).fontSize)] as const,
    );
    for (const [el, size] of sizes) el.style.fontSize = `${size * 2}px`;
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("server-rendered navigation remains usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/");
  await page.getByText("Menu", { exact: true }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Product", exact: true })
    .click();
  await expect(page).toHaveURL(/\/product$/);
  await page.goto("http://127.0.0.1:3100/request-access");
  await expect(
    page.getByRole("button", { name: "Download local draft" }),
  ).toBeDisabled();
  await expect(page.getByLabel("Work email")).toBeDisabled();
  await context.close();
});
