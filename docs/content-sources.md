# Public content provenance

Reviewed 2026-10-27. Source review only; no native code or device tests were run in this repository.

| Public claim | Source | Reviewed file blob |
| --- | --- | --- |
| Rust core, C ABI 2.11, frame measurements, developer preview, production enrollment denied | [SDK README](https://github.com/Rafiqalha/nexus-sdk/blob/main/README.md) | `e33591636cc3549107c4c59497af956ac0a87e39` |
| Signed device-key statement; capture claims do not establish sensor origin, liveness, or product eligibility | [Capture receipt ABI 2.11](https://github.com/Rafiqalha/nexus-sdk/blob/main/docs/api/CAPTURE_RECEIPT_ABI_2_11.md) | `9b4b8dfbbba3b360f540971ccaa9ab5d1948b038` |
| Isolated Android staging, no public deployment or HTTP management API, client-reported capture metrics, bounded offline leases | [Enrollment README](https://github.com/Rafiqalha/nexus-enrollment/blob/main/README.md) | `9728b49decd96c9c2dc86680a50bc8ecec5042c5` |

The repositories were read through the authorized GitHub connector. Public source links explicitly note repository access requirements. Detailed private operational instructions are not reproduced. ABI links identify the contract version; main-branch links are mutable. Platform packages not verified in these sources are labeled “not verified as available.” The website does not advertise download packages or invented SDK APIs.

The [UIN Malang WrecK-IT report](https://informatika.uin-malang.ac.id/id/1st-winner-hackathon-wreck-it-7-0/) was checked. It establishes a team award but does not identify Nexus as the awarded product. No Nexus award claim or personal biography is published without a confirmed connection and approval.

## M0/M1 decisions and dependencies

- Preserve existing Next.js 16.4.3 / React 19.3.0 / Tailwind 4 configuration and npm lockfile. Restore the original generated Next.js AGENTS block alongside the user's Nexus instructions.
- Public content uses English, semantic DESIGN tokens, server-rendered pages, and a separate synthetic `/demo` layout. The walkthrough is the M0 demo shell and M1 illustration, not the full M2 console.
- No delivery provider, approved recipient/contact, rate-limit storage, or approved privacy/retention policy exists in the supplied configuration. Therefore access intake is explicitly unavailable. The form validates only a browser-local text-file draft; it does not POST, persist remotely, or grant access. Server validation, abuse limits, provider-confirmed success, and failure handling are required before enabling delivery.
- No monitored security channel is invented. Security reporting availability is explicit. Legal routes are omitted until actual policies are approved; footer data-handling information describes only this implementation.
- SITE_URL is optional server build configuration for the approved canonical origin. Until configured, canonical URLs and sitemap entries are omitted. A generated social preview is available; no domain ownership is assumed.
- No connected console, authentication, payment, or upstream administration is introduced.

## Verification — 2026-10-27

Local uncommitted implementation, production build ID `Hj_HpqhgoND0Dker80zt-` (not a CI/deployment claim):

- `npm run lint`, `npm run typecheck`, and `npm run build`: passed.
- `npm run test:e2e`: 13 passed, Chrome, production server, 16.1 seconds.
- All seven routes checked at 320, 360, 390, 768, 1024, and 1440 CSS pixels; desktop/mobile screenshots inspected. Internal links and anchors resolve. No browser page errors observed by the route tests.
- axe checks passed on all pages at 390 and 1440 px. Keyboard skip navigation, mobile Escape/focus restoration, reduced motion, homepage 200% text scaling, and no-JavaScript navigation verified. This is not a full screen-reader or cross-browser certification.
- Five synthetic scenarios and reset verified. Form validation, actual local draft download, retained values, zero POSTs, no local storage, and disabled pre-hydration/no-JavaScript controls verified.
- The first browser run found a transient contrast failure from entry opacity; animation now uses translation only. Earlier build failures from Google Fonts access and a sandbox worker-port error were resolved with local Geist and an unrestricted local build after preserving the old generated cache in `/tmp`.
- Data mode: static public content plus synthetic illustrations; no live upstream calls or delivery provider. No native SDK tests, field Core Web Vitals, deployment, or security-product certification claimed.
