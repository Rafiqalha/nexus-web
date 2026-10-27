import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { compareEvidence } from "@/lib/adapters/request-comparison";
import { requests } from "@/lib/demo/fixtures";

const pair = "/demo/requests/compare?left=req_demo_001&right=req_demo_002";

test("compare, swap, filter, and reopen a shareable investigation", async ({
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
    if (request.method() !== "GET" || request.url().includes("/api/"))
      writes.push(request.url());
  });
  await page.goto("/demo/requests/req_demo_001");
  await page.getByRole("link", { name: "Compare this request" }).click();
  await expect(page).toHaveURL(pair);
  await expect(
    page.getByRole("heading", { name: "Compare requests", exact: true }),
  ).toBeVisible();
  const a = page.getByRole("article", { name: "Request A context" });
  const b = page.getByRole("article", { name: "Request B context" });
  await expect(a).toContainText("Accepted under policy");
  await expect(b).toContainText("Expired");
  await expect(page.getByRole("status")).toContainText(
    "3 of 5 evidence checks have different details · 5 shown",
  );
  await page
    .getByLabel("Show only different evidence", { exact: true })
    .check();
  await page.getByRole("button", { name: "Compare selected requests" }).click();
  await expect(page).toHaveURL(/differences=1/);
  await expect(
    page.getByRole("heading", { name: "Camera provenance", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("3 shown");
  await page.getByRole("button", { name: "Swap requests" }).click();
  await expect(page).toHaveURL(
    /left=req_demo_002&right=req_demo_001&differences=1/,
  );
  await expect(a).toContainText("req_demo_002");
  await expect(b).toContainText("req_demo_001");
  await expect(
    page.getByLabel("Show only different evidence", { exact: true }),
  ).toBeChecked();
  const url = page.url();
  await page.reload();
  await expect(page).toHaveURL(url);
  await expect(page.getByLabel("Request A", { exact: true })).toHaveValue(
    "req_demo_002",
  );
  await a.getByRole("link", { name: "req_demo_002", exact: true }).click();
  await expect(page).toHaveURL(/\/demo\/requests\/req_demo_002$/);
  await expect(
    page.getByRole("heading", { name: "req_demo_002", exact: true, level: 1 }),
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(url);
  await page.getByRole("link", { name: "All requests", exact: true }).click();
  await page
    .getByRole("link", { name: "Compare requests", exact: true })
    .click();
  await expect(page.getByLabel("Request A", { exact: true })).toHaveValue(
    "req_demo_001",
  );
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  expect(writes).toEqual([]);
});

test("comparison preserves unknown decisions, transport errors, absent metrics, and actual zero", async ({
  page,
}) => {
  await page.goto(
    "/demo/requests/compare?left=req_demo_004&right=req_demo_007",
  );
  const capture = page.getByRole("region", {
    name: "Capture measurement",
    exact: true,
  });
  await expect(
    capture.getByRole("group", { name: "Request A evidence" }),
  ).toContainText("Reported quality scoreUnavailable");
  await expect(
    capture.getByRole("group", { name: "Request B evidence" }),
  ).toContainText("0 (0–1)");
  await expect(
    capture.getByRole("group", { name: "Request B evidence" }),
  ).toContainText("Simulated · Models: Client reported");
  await page
    .getByLabel("Request A", { exact: true })
    .selectOption("req_demo_006");
  await page
    .getByLabel("Request B", { exact: true })
    .selectOption("req_demo_005");
  await page.getByRole("button", { name: "Compare selected requests" }).click();
  await expect(
    page.getByRole("article", { name: "Request A context" }),
  ).toContainText("Unknown decision");
  await expect(
    page.getByRole("article", { name: "Request A context" }),
  ).toContainText("policy_indeterminate_v2");
  await expect(
    page.getByRole("article", { name: "Request B context" }),
  ).toContainText("Request timed out · No service decision");
  const key = page.getByRole("region", { name: "Key signature", exact: true });
  await expect(
    key.getByRole("group", { name: "Request A evidence" }),
  ).toContainText("Unknown evaluation");
  await expect(
    key.getByRole("group", { name: "Request A evidence" }),
  ).toContainText("future_check_pending");
  await expect(
    page.getByRole("article", { name: "Request B context" }),
  ).not.toContainText("Rejected");
});

test("invalid comparison URLs do not silently substitute records", async ({
  page,
}) => {
  for (const query of [
    "left=req_demo_001&right=missing",
    "left=req_demo_001",
    "left=&right=req_demo_002",
    "left=req_demo_001&right=req_demo_002&left=req_demo_003",
    "left=req_demo_001&right=req_demo_001",
  ]) {
    await page.goto(`/demo/requests/compare?${query}`);
    await expect(page.getByRole("main").getByRole("alert")).toBeVisible();
    await expect(
      page.getByRole("article", { name: "Request A context" }),
    ).toHaveCount(0);
    await page.getByRole("link", { name: "Use example pair" }).click();
    await expect(
      page.getByRole("heading", { name: "Evidence comparison", exact: true }),
    ).toBeVisible();
  }
});

test("comparison follows demo recovery, stale, loading, empty, and reset boundaries", async ({
  page,
}) => {
  await page.goto(pair);
  for (const [state, action] of [
    ["error", "Retry demo read"],
    ["denied", "Restore demo access"],
    ["expired-session", "Restore demo session"],
    ["loading", "Restore demo data"],
  ]) {
    await page.getByLabel("Demo state", { exact: true }).selectOption(state);
    await expect(
      page.getByRole("article", { name: "Request A context" }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: action, exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Evidence comparison", exact: true }),
    ).toBeVisible();
  }
  await page.getByLabel("Demo state", { exact: true }).selectOption("empty");
  await expect(
    page.getByRole("heading", {
      name: "Two requests are needed to compare",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("article", { name: "Request A context" }),
  ).toHaveCount(0);
  await page.getByLabel("Demo state", { exact: true }).selectOption("stale");
  await expect(
    page.getByRole("status").filter({ hasText: "Stale simulated data" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Evidence comparison", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reset demo session", exact: true })
    .click();
  await expect(page).toHaveURL(/\/demo$/);
});

test("evidence alignment uses check identity and distinguishes absence, zero, and unknown values", () => {
  const base = requests[0];
  const reordered = { ...base, evidence: [...base.evidence].reverse() };
  expect(
    compareEvidence(base, reordered).every((item) => !item.different),
  ).toBe(true);
  const omitted = {
    ...base,
    evidence: base.evidence.filter((item) => item.checkId !== "key-signature"),
  };
  const absent = compareEvidence(base, omitted).find(
    (item) => item.checkId === "key-signature",
  )!;
  expect(absent.different).toBe(true);
  expect(absent.right).toBeUndefined();
  const missing = requests[3];
  const changed = {
    ...missing,
    evidence: missing.evidence.map((item) =>
      item.metric ? { ...item, metric: { ...item.metric, value: 0 } } : item,
    ),
  };
  expect(
    compareEvidence(missing, changed).find(
      (item) => item.checkId === "capture-quality",
    )?.different,
  ).toBe(true);
  const unknown = {
    ...base,
    evidence: base.evidence.map((item) =>
      item.checkId === "key-signature"
        ? { ...item, evaluation: "new_value_v3" }
        : item,
    ),
  };
  expect(
    compareEvidence(base, unknown).find(
      (item) => item.checkId === "key-signature",
    )?.different,
  ).toBe(true);
});

for (const theme of ["dark", "light"] as const) {
  test(`comparison supports keyboard, mobile reflow, text zoom, and accessibility in ${theme}`, async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: "nexus-demo-theme",
        value: theme,
        domain: "127.0.0.1",
        path: "/demo",
      },
    ]);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pair);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${theme}: ${width}`,
      ).toBe(true);
      if (width === 390 || width === 1440) {
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(result.violations).toEqual([]);
      }
    }
    await page.getByLabel("Request A", { exact: true }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Request B", { exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Compare selected requests" }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      page.getByLabel("Show only different evidence", { exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Space");
    await page
      .getByRole("button", { name: "Compare selected requests" })
      .focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/differences=1/);
    await page.setViewportSize({ width: 320, height: 900 });
    await page.addStyleTag({
      content:
        ".console-content { font-size: 200%; } .console-content :is(p, dd, dt, label, select, button) { font-size: 1em !important; }",
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page
        .locator(".console-topbar")
        .getByText("Simulated data", { exact: true }),
    ).toBeVisible();
  });
}
