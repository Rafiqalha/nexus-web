import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  timeout: 90_000,
  globalTimeout: 10 * 60 * 1000,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/e2e-report.json" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:3100",
    channel: "chrome",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    // A release check must exercise the build it just produced.
    reuseExistingServer: false,
  },
});
