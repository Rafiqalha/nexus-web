import { expect, test } from "@playwright/test";

const routes = ["/", "/request-access", "/demo", "/demo/requests/req_demo_001"];

test("production responses enforce the public/demo browser boundary", async ({
  request,
}) => {
  for (const route of [...routes, "/nonexistent-release-route"]) {
    const response = await request.get(route);
    expect(response.status()).toBe(route.includes("nonexistent") ? 404 : 200);
    const headers = response.headers();
    expect(headers["x-powered-by"]).toBeUndefined();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("no-referrer");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["permissions-policy"]).toContain("microphone=()");
    const csp = headers["content-security-policy"];
    expect(csp).toContain("connect-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("script-src-attr 'none'");
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toContain(" ws:");
  }
});

test("normal page loads make no external calls and cause no CSP violations", async ({
  page,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:3100") {
      external.push(request.url());
    }
  });
  for (const route of routes) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
  }
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("CSP blocks an outbound connection before sending a request", async ({
  page,
}) => {
  let contacted = false;
  await page.route("https://blocked.example.invalid/**", (route) => {
    contacted = true;
    return route.fulfill({ status: 200, body: "must not be fetched" });
  });
  await page.goto("/demo");
  const result = await page.evaluate(async () => {
    const violations: string[] = [];
    const listener = (event: SecurityPolicyViolationEvent) => {
      violations.push(event.effectiveDirective);
    };
    document.addEventListener("securitypolicyviolation", listener);
    let rejected = false;
    try {
      await fetch("https://blocked.example.invalid/payload");
    } catch {
      rejected = true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    document.removeEventListener("securitypolicyviolation", listener);
    return { rejected, violations };
  });
  expect(result.rejected).toBe(true);
  expect(result.violations).toContain("connect-src");
  expect(contacted).toBe(false);
});

test("connected routes remain unavailable despite browser-supplied authority", async ({
  request,
}) => {
  for (const path of ["/app", "/app/requests/req_demo_001", "/sign-in"]) {
    const response = await request.get(
      `${path}?mode=connected&role=administrator`,
      {
        headers: {
          "x-tenant-id": "tenant-forged",
          "x-user-role": "administrator",
          cookie: "mode=connected; role=administrator; session=forged",
        },
      },
    );
    expect(response.status()).toBe(404);
    const html = await response.text();
    expect(html).not.toContain("Enrolled key statement only");
    expect(html).not.toContain("tenant-forged");
  }
});
