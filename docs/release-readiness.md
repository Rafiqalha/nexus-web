# Public/demo release verification

Scope approved 2026-10-27: prepare the public website and M2 synthetic console
for release while authentication and management contracts remain unavailable.
This is the independent M5 verification slice, not completion of M3/M4 or a
deployment. M1 intake delivery, approved privacy/terms, monitored reporting,
and an approved canonical origin remain publication dependencies.

## Reproduce

Use `.nvmrc`, `npm ci`, and installed Google Chrome. Ports 3100 and 3101 must be
free; the development preview may continue on port 3000.

```sh
npm run verify:release
```

This runs the production dependency audit (high/critical advisories fail),
lint, type checking, a fresh production build, the browser suite, and
the web lab. A stale server is never reused. Checks stop on failure and the
final report records failure rather than silently treating a missing check as
success. `test-results/release/verification.json` records the Git revision,
dirty status, SHA-256 of tracked/unignored source files, build ID, actual Node
version, browser results, and JavaScript budget. Source changes during the run
invalidate the report. Uncommitted results are not evidence for the base commit.

`npm run measure:web` can rerun the lab against the existing production build.
It owns a local server, uses three cold Chrome loads for each of three routes
in desktop/mobile profiles, and writes `test-results/release/web-lab.json`.
The profiles specify viewport, network, and CPU emulation. Encoded first-party
JavaScript must stay within the DESIGN 200 KiB planning budget per load.
LCP, CLS, and long-task blocking are local diagnostics. Long-task blocking is
not INP. Field p75 Core Web Vitals require real-user evidence after deployment.

## Browser boundary

The enforced CSP limits network calls and assets to this origin, blocks frames,
plugins, base overrides, and inline event attributes. Camera, microphone,
geolocation, payment, and USB permissions are disabled. Responses use nosniff,
no-referrer, and frame denial; the framework signature header is disabled.

Inline scripts/styles remain allowed for Next.js PPR and React-generated styles.
This is not a strict script-injection defense or a customer-data security review.
`unsafe-eval` and WebSocket allowances exist only in development. Reassess the
policy and rendering boundary before connected mode. The installed Next guide
documents nonce/PPR incompatibility and the static CSP alternative:
[Next.js CSP](https://nextjs.org/docs/app/guides/content-security-policy).
HSTS and HTTPS redirects belong to the verified deployment origin/TLS boundary.

The release tests check actual CSP blocking before an outbound request is sent,
normal loads without violations/external calls, response headers including 404s,
and unavailable connected routes even with forged client role/session hints.
The last check does not prove tenant authorization in an unimplemented backend.

## CI and publication

`.github/workflows/web-checks.yml` runs the same command with Node from `.nvmrc`,
`npm ci`, and Chrome, using a read-only repository token. Evidence is named for
the checked-out SHA; failure screenshots/traces and JSON reports expire after
seven days. CI configuration is not proof of a successful hosted run.
See [Playwright CI](https://playwright.dev/docs/ci) for the browser installation
and worker model.

No credentials, domains, infrastructure, publication, or connected services are
enabled by this check. Before publishing, review the exact source/evidence,
configure the approved origin, verify deployment headers/TLS, and retain the
published capability limits. M3/M4 require the missing verified contracts in
[integration-contract.md](./integration-contract.md).
