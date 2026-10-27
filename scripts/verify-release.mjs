import { spawn, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { measureWeb } from "./measure-web.mjs";

async function sourceFingerprint() {
  // Git's own ignore rules keep real environment files and build outputs out.
  const files = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { encoding: "utf8" },
  )
    .split("\0")
    .filter(Boolean)
    .sort();
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(file).update("\0");
    try {
      hash.update(await readFile(file));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      hash.update("<deleted>");
    }
    hash.update("\0");
  }
  return hash.digest("hex");
}

async function run(script) {
  const startedAt = new Date().toISOString();
  await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [process.env.npm_execpath, "run", script],
      {
        stdio: "inherit",
        windowsHide: true,
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      },
    );
    child.once("error", reject);
    child.once("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${script} failed (${code})`)),
    );
  });
  return {
    script,
    startedAt,
    finishedAt: new Date().toISOString(),
    passed: true,
  };
}

const report = {
  startedAt: new Date().toISOString(),
  node: process.version,
  mode: "static public site and synthetic console; no live management service",
  checks: [],
  passed: false,
};
try {
  if (!process.env.npm_execpath)
    throw new Error("Run with npm run verify:release");
  report.revision = execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  report.dirty = !!execFileSync("git", ["status", "--porcelain"], {
    encoding: "utf8",
  }).trim();
  report.sourceSha256 = await sourceFingerprint();
  for (const script of [
    "audit:production",
    "lint",
    "typecheck",
    "build",
    "test:e2e",
  ])
    report.checks.push(await run(script));
  const lab = await measureWeb();
  report.buildId = lab.buildId;
  const browser = JSON.parse(
    await readFile("test-results/e2e-report.json", "utf8"),
  );
  report.browserTests = browser.stats;
  report.javascriptBudgetPassed = lab.budgetPassed;
  if (
    browser.stats.unexpected ||
    browser.stats.flaky ||
    browser.stats.skipped
  ) {
    throw new Error(
      "Release evidence requires all browser tests to pass without skips or flakes",
    );
  }
  if (report.sourceSha256 !== (await sourceFingerprint()))
    throw new Error(
      "Source changed during verification; rerun for a consistent snapshot",
    );
  report.passed = true;
} catch (error) {
  report.failure = error.message;
  console.error(error.message);
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  await mkdir("test-results/release", { recursive: true });
  await writeFile(
    "test-results/release/verification.json",
    JSON.stringify(report, null, 2),
  );
  console.log(
    `Release evidence: test-results/release/verification.json (${report.passed ? "passed" : "failed"})`,
  );
}
