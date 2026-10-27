import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const titles = [
  "Request inspection",
  "Evidence flow",
  "Integration guide",
  "Trust boundaries",
];
const deck = (page: Page) =>
  page.getByRole("region", { name: "Nexus playbook", exact: true });
const surface = (page: Page) =>
  page.getByRole("group", { name: /^Playbook cards\./ });

test("chapters, paging, and keyboard navigation select one accessible page", async ({
  page,
}) => {
  await page.goto("/");
  const book = deck(page);
  await expect(book.getByRole("article")).toHaveCount(1);
  for (let index = 0; index < titles.length; index++) {
    await book.getByRole("button", { name: new RegExp(titles[index]) }).click();
    await expect(book.getByRole("article")).toHaveAttribute(
      "aria-label",
      `${index + 1} of 4: ${titles[index]}`,
    );
    await expect(book.getByRole("status")).toContainText(`0${index + 1} / 04`);
    await expect(
      book.getByRole("button", { name: new RegExp(titles[index]) }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(book.getByRole("article")).toContainText("Simulated data");
  }
  await book.getByRole("button", { name: "Next playbook card" }).click();
  await expect(book.getByRole("article")).toHaveAttribute(
    "aria-label",
    "1 of 4: Request inspection",
  );
  await surface(page).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(book.getByRole("article")).toHaveAttribute(
    "aria-label",
    "4 of 4: Trust boundaries",
  );
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowRight");
  await expect(book.getByRole("article")).toHaveAttribute(
    "aria-label",
    "2 of 4: Evidence flow",
  );
  await page.keyboard.press("End");
  await expect(
    book.getByRole("link", { name: "Read the trust boundaries", exact: true }),
  ).toHaveAttribute("href", "/security");
  await book.getByRole("button", { name: "Previous playbook card" }).click();
  await expect(
    book.getByRole("link", { name: "Read the developer guide" }),
  ).toHaveAttribute("href", "/developers");
});

test("mouse drag changes the stack; short and cancelled drags preserve selection", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await surface(page).evaluate((el) =>
    el.scrollIntoView({ block: "start", behavior: "instant" }),
  );
  const box = (await surface(page).boundingBox())!;
  const start = { x: box.x + box.width * 0.55, y: box.y + 90 };
  for (const [distance, chapter] of [
    [-200, "Evidence flow"],
    [12, "Evidence flow"],
    [200, "Request inspection"],
  ] as const) {
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x + distance, start.y, { steps: 12 });
    await page.mouse.up();
    await expect(deck(page).getByRole("article")).toHaveAttribute(
      "aria-label",
      new RegExp(chapter),
    );
  }
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x - 160, start.y, { steps: 8 });
  await surface(page).dispatchEvent("pointercancel", {
    pointerId: 1,
    clientX: start.x - 160,
    clientY: start.y,
  });
  await page.mouse.up();
  await expect(deck(page).getByRole("article")).toHaveAttribute(
    "aria-label",
    /Request inspection/,
  );
  await deck(page)
    .getByRole("button", { name: "Expired", exact: true })
    .click();
  await expect(
    deck(page).getByText("Lease expired", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("native touch swipes change cards while vertical gestures scroll the page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setTouchEmulationEnabled", {
    enabled: true,
    maxTouchPoints: 1,
  });
  await page.goto("/");
  await surface(page).evaluate((el) =>
    el.scrollIntoView({ block: "start", behavior: "instant" }),
  );
  const box = (await surface(page).boundingBox())!;
  const y = box.y + 65;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 300, y }],
  });
  for (let step = 1; step <= 10; step++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 300 - step * 22, y }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(deck(page).getByRole("article")).toHaveAttribute(
    "aria-label",
    /Evidence flow/,
  );
  const before = await page.evaluate(() => scrollY);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 150, y: 500 }],
  });
  for (let step = 1; step <= 10; step++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 150, y: 500 - step * 22 }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(before + 40);
  await expect(deck(page).getByRole("article")).toHaveAttribute(
    "aria-label",
    /Evidence flow/,
  );
  await cdp.detach();
});

test("reduced motion removes stack transitions and page links remain usable without JavaScript", async ({
  page,
  browser,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await deck(page).getByRole("button", { name: "Next playbook card" }).click();
  await expect(deck(page).getByRole("article")).toHaveAttribute(
    "aria-label",
    /Evidence flow/,
  );
  expect(
    await deck(page)
      .getByRole("article")
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("http://127.0.0.1:3100/");
  await expect(deck(staticPage).getByRole("article")).toContainText(
    "Accepted under policy",
  );
  await deck(staticPage)
    .getByRole("link", { name: "Open the demo", exact: true })
    .click();
  await expect(staticPage).toHaveURL(/\/demo$/);
  await context.close();
});

for (const width of [320, 390, 768, 1440]) {
  test(`all playbook pages remain within the viewport at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const title of titles) {
      await deck(page)
        .getByRole("button", { name: new RegExp(title) })
        .click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}

test("each playbook page passes accessibility checks on desktop and mobile", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const title of titles) {
      await deck(page)
        .getByRole("button", { name: new RegExp(title) })
        .click();
      const result = await new AxeBuilder({ page })
        .include(".product-playbook")
        .analyze();
      expect(result.violations, `${title} at ${width}px`).toEqual([]);
    }
  }
});
