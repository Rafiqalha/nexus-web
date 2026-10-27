import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const origin = "http://127.0.0.1:3101";
const routes = ["/", "/demo", "/demo/requests/req_demo_001"];
const profiles = [
  { name: "desktop", width: 1440, height: 900, latency: 40, mbps: 10, cpu: 1 },
  { name: "mobile", width: 390, height: 844, latency: 150, mbps: 1.6, cpu: 4 },
];

async function startServer() {
  const server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3101",
    ],
    {
      env: {
        ...process.env,
        NODE_ENV: "production",
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Measurement server startup timed out")),
        30_000,
      );
      const done = (error) => {
        clearTimeout(timer);
        if (error) reject(error);
        else resolve();
      };
      server.once("error", done);
      server.once("exit", (code) =>
        done(
          new Error(
            `Measurement server exited (${code}); port 3101 must be free`,
          ),
        ),
      );
      server.stdout.on("data", (data) => {
        if (data.toString().includes("Ready in")) done();
      });
    });
    return server;
  } catch (error) {
    server.kill();
    throw error;
  }
}

export async function measureWeb() {
  const buildId = (await readFile(".next/BUILD_ID", "utf8")).trim();
  const server = await startServer();
  let browser;
  const samples = [];
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true });
    for (const profile of profiles) {
      for (const route of routes) {
        for (let run = 1; run <= 3; run++) {
          const context = await browser.newContext({
            viewport: { width: profile.width, height: profile.height },
            deviceScaleFactor: 1,
            reducedMotion: "no-preference",
          });
          try {
            const page = await context.newPage();
            const errors = [];
            page.on("pageerror", (error) => errors.push(error.message));
            page.on("console", (message) => {
              if (message.type() === "error") errors.push(message.text());
            });
            const cdp = await context.newCDPSession(page);
            await cdp.send("Network.enable");
            await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
            await cdp.send("Network.emulateNetworkConditions", {
              offline: false,
              latency: profile.latency,
              downloadThroughput: (profile.mbps * 1_000_000) / 8,
              uploadThroughput: 750_000 / 8,
            });
            await cdp.send("Emulation.setCPUThrottlingRate", {
              rate: profile.cpu,
            });
            await page.addInitScript(() => {
              window.__webLab = { lcp: null, shifts: [], blockingMs: 0 };
              for (const type of [
                "largest-contentful-paint",
                "layout-shift",
                "longtask",
              ]) {
                new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    if (type === "largest-contentful-paint")
                      window.__webLab.lcp = entry.startTime;
                    if (type === "layout-shift" && !entry.hadRecentInput) {
                      window.__webLab.shifts.push({
                        time: entry.startTime,
                        value: entry.value,
                      });
                    }
                    if (type === "longtask")
                      window.__webLab.blockingMs += Math.max(
                        0,
                        entry.duration - 50,
                      );
                  }
                }).observe({ type, buffered: true });
              }
            });
            const response = await page.goto(`${origin}${route}`, {
              waitUntil: "networkidle",
              timeout: 60_000,
            });
            if (response?.status() !== 200)
              throw new Error(`${route} did not return 200`);
            await page.evaluate(() => document.fonts.ready);
            const result = await page.evaluate(() => {
              const lab = window.__webLab;
              let cls = 0,
                windowValue = 0,
                first = 0,
                previous = 0;
              for (const shift of lab.shifts) {
                if (shift.time - previous > 1000 || shift.time - first > 5000) {
                  windowValue = 0;
                  first = shift.time;
                }
                windowValue += shift.value;
                previous = shift.time;
                cls = Math.max(cls, windowValue);
              }
              const scripts = performance
                .getEntriesByType("resource")
                .filter(
                  (entry) =>
                    new URL(entry.name).origin === location.origin &&
                    new URL(entry.name).pathname.endsWith(".js"),
                );
              return {
                lcpMs: lab.lcp,
                cls,
                longTaskBlockingMs: lab.blockingMs,
                javascriptEncodedBytes: scripts.reduce(
                  (sum, entry) => sum + entry.encodedBodySize,
                  0,
                ),
                javascriptDecodedBytes: scripts.reduce(
                  (sum, entry) => sum + entry.decodedBodySize,
                  0,
                ),
                scriptCount: scripts.length,
              };
            });
            if (errors.length)
              throw new Error(`${route}: ${errors.join("; ")}`);
            if (!result.lcpMs || !result.javascriptEncodedBytes)
              throw new Error(`${route}: incomplete browser measurements`);
            samples.push({ profile: profile.name, route, run, ...result });
          } finally {
            await context.close();
          }
        }
        console.log(`Measured ${profile.name} ${route} (3 cold loads)`);
      }
    }
    const report = {
      generatedAt: new Date().toISOString(),
      buildId,
      browser: browser.version(),
      mode: "synthetic public/demo",
      profiles,
      runsPerRoute: 3,
      method:
        "Cold Chrome contexts, cache disabled, CDP network/CPU emulation, default motion; observe until network idle and fonts ready. Encoded first-party JS includes speculative loads during this window. LCP/CLS and long-task blocking are lab diagnostics; INP and field p75 are not measured.",
      javascriptBudgetBytes: 200 * 1024,
      budgetPassed: samples.every(
        (sample) => sample.javascriptEncodedBytes <= 200 * 1024,
      ),
      samples,
    };
    await mkdir("test-results/release", { recursive: true });
    await writeFile(
      "test-results/release/web-lab.json",
      JSON.stringify(report, null, 2),
    );
    if (!report.budgetPassed)
      throw new Error(
        "First-load compressed JavaScript exceeds 200 KiB; see web-lab.json",
      );
    return report;
  } finally {
    await browser?.close();
    server.kill();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  measureWeb().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
