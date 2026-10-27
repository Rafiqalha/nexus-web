import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

const routes = [
  "/demo",
  "/demo/requests",
  "/demo/requests/req_demo_001",
  "/demo/enrollments",
  "/demo/enrollments/enr_demo_revoked_03",
  "/demo/policies",
  "/demo/policies/demo-policy-v1",
  "/demo/integrations",
  "/demo/audit",
  "/demo/settings",
  "/demo/walkthrough",
];
const nav = (page: Page) =>
  page.getByRole("navigation", { name: "Demo navigation", exact: true });

test("investigate an unknown decision through enrollment and policy without live calls", async ({
  page,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  const writes: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:3100/"))
      external.push(request.url());
    if (request.method() !== "GET")
      writes.push(`${request.method()} ${request.url()}`);
    if (request.url().includes("/api/")) writes.push(request.url());
  });
  await page.goto("/demo");
  await expect(
    page.getByRole("heading", { name: "Evidence, in context." }),
  ).toBeVisible();
  await nav(page).getByRole("link", { name: "Requests", exact: true }).click();
  await page.getByLabel("Decision", { exact: true }).selectOption("unknown");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL(/decision=unknown/);
  await expect(page.getByRole("status")).toContainText("3 matching requests");
  await page.getByRole("link", { name: "req_demo_006", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "req_demo_006", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator(".console-decision-panel:visible")
      .getByText("Unknown decision", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("policy_indeterminate_v2", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Unknown evaluation", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("future_check_pending", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Request evidence", exact: true }),
  ).toContainText("Models: Server verified");
  await expect(
    page
      .locator(".console-topbar")
      .getByText("Simulated data", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "enr_demo_unknown_04", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Unclassified evidence source",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "A session expiring does not establish enrollment revocation.",
      { exact: false },
    ),
  ).toBeVisible();
  await nav(page).getByRole("link", { name: "Policies", exact: true }).click();
  await page.getByRole("link", { name: "demo-policy-v1", exact: true }).click();
  await expect(
    page.getByText("Unavailable · No signed policy artifact", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Policy rules", exact: true }),
  ).toContainText("not camera provenance");
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  expect(writes).toEqual([]);
});

test("request filters, pagination, sorting, and deep links are reproducible from the URL", async ({
  page,
}) => {
  await page.goto("/demo/requests");
  await expect(page.getByRole("status")).toContainText("18 matching requests");
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(7);
  await page
    .getByRole("navigation", { name: "Request pages" })
    .getByRole("link", { name: "Next", exact: true })
    .click();
  await expect(page).toHaveURL(/page=2/);
  await expect(
    page.getByRole("link", { name: "req_demo_007", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Sort requests").selectOption("latency");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL(/sort=latency/);
  await expect(page.getByRole("table").getByRole("row").nth(1)).toContainText(
    "req_demo_018",
  );
  await page.getByLabel("Search requests").fill("req_demo_007");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.getByRole("status")).toContainText("1 matching requests");
  const url = page.url();
  await page.reload();
  await expect(page).toHaveURL(url);
  await expect(page.getByLabel("Search requests")).toHaveValue("req_demo_007");
  await page.getByRole("link", { name: "req_demo_007", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "req_demo_007", exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(url);
  await page.getByLabel("Search requests").fill("does-not-exist");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(
    page.getByRole("heading", { name: "No requests match these filters" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Clear request filters", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("18 matching requests");
});

test("missing metrics stay unavailable and a real zero remains zero", async ({
  page,
}) => {
  await page.goto("/demo/requests/req_demo_004");
  const missing = page.getByRole("row", { name: /Capture measurement/ });
  await expect(missing).toContainText("Reported quality score: Unavailable");
  await expect(missing).not.toContainText("0 (0–1)");
  await page.goto("/demo/requests/req_demo_007");
  await expect(
    page.getByRole("row", { name: /Capture measurement/ }),
  ).toContainText("Reported quality score: 0 (0–1)");
  await expect(
    page.getByRole("row", { name: /Capture measurement/ }),
  ).toContainText("Not evaluated");
  await page.goto("/demo/requests/req_demo_005");
  await expect(page.getByText("No decision", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Request timed out · No service decision", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Rejected", { exact: true })).toHaveCount(0);
  await page.goto("/demo/requests/req_demo_002");
  await page
    .getByRole("link", { name: "enr_demo_software_02", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Software-backed evaluation device",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator(".console-facts:visible")).toContainText("active");
  await expect(page.locator(".console-facts:visible")).not.toContainText(
    "revoked",
  );
});

test("summary downloads are labeled simulated and clipboard failure stays honest", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: () => Promise.reject(new Error("Clipboard denied for test")),
      },
      configurable: true,
    }),
  );
  await page.goto("/demo/requests/req_demo_001");
  await page.getByRole("button", { name: "Copy summary", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Copy is unavailable");
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download summary", exact: true })
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(
    "req_demo_001-simulated-summary.txt",
  );
  const text = await readFile((await download.path())!, "utf8");
  expect(text).toContain("SIMULATED DATA");
  expect(text).toContain("Not a live verification result");
  expect(text).toContain("Enrolled key statement only");
  expect(text).toContain("origin: Simulated");
  expect(text).toContain("Production eligibility is not established");
});

for (const state of [
  {
    value: "error",
    title: "Unable to load demo data",
    recovery: "Retry demo read",
  },
  {
    value: "denied",
    title: "Access denied in this scenario",
    recovery: "Restore demo access",
  },
  {
    value: "expired-session",
    title: "Demo session expired",
    recovery: "Restore demo session",
  },
]) {
  test(`${state.value} replaces records and recovers without a successful empty dataset`, async ({
    page,
  }) => {
    await page.goto("/demo/requests");
    await page
      .getByLabel("Demo state", { exact: true })
      .selectOption(state.value);
    await expect(
      page.getByRole("heading", { name: state.title, exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("table")).toHaveCount(0);
    await page
      .getByRole("button", { name: state.recovery, exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "18 matching requests",
    );
  });
}

test("empty, stale, loading, and reset scenarios retain accurate states", async ({
  page,
}) => {
  await page.goto("/demo/requests");
  await page.getByLabel("Demo state", { exact: true }).selectOption("empty");
  await expect(
    page.getByRole("heading", {
      name: "No requests in this scenario",
      exact: true,
    }),
  ).toBeVisible();
  await page.getByLabel("Demo state", { exact: true }).selectOption("stale");
  await expect(
    page.getByRole("status").filter({ hasText: "Stale simulated data" }),
  ).toContainText("not a current service response");
  await expect(page.getByRole("table")).toBeVisible();
  await page.getByLabel("Demo state", { exact: true }).selectOption("loading");
  await expect(
    page.getByRole("region", { name: "Loading demo records", exact: true }),
  ).toHaveAttribute("aria-busy", "true");
  await expect(page.getByRole("table")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Restore demo data", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reset demo session", exact: true })
    .click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(
    page.getByRole("heading", { name: "Evidence, in context." }),
  ).toBeVisible();
});

test("demo session changes stay isolated and reset preserves appearance", async ({
  page,
  context,
}) => {
  await page.goto("/demo");
  await page
    .getByRole("button", { name: "Mark explored", exact: true })
    .first()
    .click();
  await expect(
    page.getByText("1 of 3 marked explored · Session-only progress", {
      exact: true,
    }),
  ).toBeVisible();
  await nav(page).getByRole("link", { name: "Settings", exact: true }).click();
  const longName =
    "Example organization with a deliberately long workspace label for responsive verification";
  await page
    .getByLabel("Workspace label · This session", { exact: true })
    .fill(longName);
  await page
    .getByRole("button", { name: "Update session label", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Demo session label updated",
  );
  await page.getByLabel("Console theme", { exact: true }).selectOption("light");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  const another = await context.newPage();
  await another.goto("/demo");
  await expect(
    another.getByText("0 of 3 marked explored · Session-only progress", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(another.locator(".console-shell")).toHaveAttribute(
    "data-theme",
    "light",
  );
  await expect(another.locator(".console-breadcrumb")).not.toContainText(
    longName,
  );
  await another.close();
  await page
    .getByRole("button", { name: "Reset demo session", exact: true })
    .click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(
    page.getByText("0 of 3 marked explored · Session-only progress", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator(".console-shell")).toHaveAttribute(
    "data-theme",
    "light",
  );
  await expect(page.locator(".console-breadcrumb")).toContainText(
    "Nexus example workspace",
  );
});

test("theme is server-resolved on reload and system preference follows the device", async ({
  page,
  browser,
  context,
}) => {
  await page.goto("/demo/settings");
  await page.getByLabel("Console theme", { exact: true }).selectOption("light");
  const response = await page.reload();
  expect(await response!.text()).toContain('data-theme="light"');
  await expect(page.getByLabel("Console theme", { exact: true })).toHaveValue(
    "light",
  );
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    storageState: await context.storageState(),
  });
  const staticPage = await noJs.newPage();
  await staticPage.goto("/demo/settings");
  expect(
    await staticPage
      .locator(".console-shell")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(250, 250, 250)");
  await noJs.close();
  await page
    .getByLabel("Console theme", { exact: true })
    .selectOption("system");
  await page.emulateMedia({ colorScheme: "light" });
  expect(
    await page
      .locator(".console-shell")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(250, 250, 250)");
  await page.emulateMedia({ colorScheme: "dark" });
  expect(
    await page
      .locator(".console-shell")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(8, 9, 10)");
});

test("enrollment, policy, audit filters, and unknown IDs have useful destinations", async ({
  page,
}) => {
  await page.goto("/demo/enrollments?status=revoked");
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);
  await page
    .getByRole("link", { name: "Revoked staging device", exact: true })
    .click();
  await expect(
    page.getByText(
      /Previously issued offline evidence may remain usable within its bounded lease/,
    ),
  ).toBeVisible();
  await page.goto("/demo/audit?event=policy");
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);
  await page
    .getByRole("link", { name: "Inspect context", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "demo-policy-v1", exact: true }),
  ).toBeVisible();
  for (const route of [
    "/demo/requests/not-a-demo-id",
    "/demo/enrollments/not-a-demo-id",
    "/demo/policies/not-a-demo-id",
  ]) {
    await page.goto(route);
    await expect(
      page.getByRole("heading", {
        name: "This demo record does not exist.",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page
        .locator(".console-topbar")
        .getByText("Simulated data", { exact: true }),
    ).toBeVisible();
  }
});

test("mobile console navigation supports keyboard, Escape, and focus restoration", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const toggle = page.getByText("Menu", { exact: true });
  await toggle.click();
  const mobile = page.getByRole("navigation", {
    name: "Mobile demo navigation",
    exact: true,
  });
  await expect(mobile).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    mobile.getByRole("link", { name: "Overview", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(mobile).toBeHidden();
  await expect(page.locator("summary")).toBeFocused();
  await page.keyboard.press("Enter");
  await mobile.getByRole("link", { name: "Requests", exact: true }).click();
  await expect(page).toHaveURL(/\/demo\/requests$/);
  await expect(mobile).toBeHidden();
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`console routes reflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(
        page
          .locator(".console-topbar")
          .getByText("Simulated data", { exact: true }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

for (const theme of ["dark", "light"] as const) {
  test(`console accessibility in ${theme} theme at desktop and mobile widths`, async ({
    page,
    context,
  }) => {
    test.setTimeout(180_000);
    await context.addCookies([
      {
        name: "nexus-demo-theme",
        value: theme,
        domain: "127.0.0.1",
        path: "/demo",
      },
    ]);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(route);
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(result.violations, `${theme}: ${route} at ${width}`).toEqual([]);
      }
    }
  });
}
