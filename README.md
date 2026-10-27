# Nexus Web

The Nexus public website, built with the existing Next.js App Router, TypeScript, and Tailwind CSS setup. Read [PRD.md](./PRD.md), [DESIGN.md](./DESIGN.md), and [AGENTS.md](./AGENTS.md) before editing.

## Local development

Use Node 22.22.1 (`nvm use`) and npm. Preserve `package-lock.json`.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Public routes are `/`, `/product`, `/developers`, `/security`, `/company`, and `/request-access`.

M2 console demo starts at `/demo`, with requests and request detail, enrollments and enrollment detail, policies and policy detail, integrations, audit log, and settings. Request filters, search, sort, and pagination use shareable URLs. The original five-scenario illustration is at `/demo/walkthrough`. Every console screen is explicitly synthetic. The shell offers empty, error, denied, expired-session, stale, and loading examples with working recovery. Reset returns to default fixtures and clears session label/checklist/filter state. Theme preference persists as a non-secret cookie; no real account changes occur.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run verify:release
```

Browser tests start the production server on `127.0.0.1:3100` and use installed Google Chrome. Install Chrome or adjust the Playwright channel for your environment. Build first. Tests cover public routes, internal links/anchors, mobile keyboard navigation, synthetic decisions and errors, local-draft validation/download, no submission, axe accessibility, reduced motion, text scaling, and reflow from 320 to 1440 CSS pixels. Screenshots are ignored under `test-results/visual/`; failure traces remain local.

Motion checks also exercise real route crossfades, native scrolling and reading progress, anchor history/focus, cancellation when reduced motion is enabled, operation without native View Transitions, and consistent server markup during slow page hydration. Original Nexus SVG icons and interaction decisions are recorded in [docs/decisions/2026-10-27-motion-and-icons.md](./docs/decisions/2026-10-27-motion-and-icons.md).

Console tests cover deep-link investigation, normalization of unknown values, missing metrics versus zero, filter/pagination reproducibility, scenario recovery, isolated sessions/reset, labeled summary downloads and clipboard failure, server-resolved themes, keyboard navigation, five viewport widths, and accessibility in both themes. See the [M2 decision](./docs/decisions/2026-10-27-console-demo.md).

`verify:release` runs fresh checks and a three-run desktop/mobile web lab, producing source-linked JSON evidence under ignored `test-results/release/`. It needs free ports 3100 and 3101; no existing production server is reused. `measure:web` reruns only the lab against the current build. GitHub Actions is configured for the same verification without deployment credentials. See [release readiness](./docs/release-readiness.md) for measurement limits, browser policy, and publication dependencies.

## Data and configuration

This release uses public static content and synthetic walkthrough records. No connected API, authentication, payment, or issuer operation exists. The access form downloads a browser-local draft and clearly states that it is **not submitted**. No form data is sent to Nexus, saved to browser storage, or recorded in analytics.

Console records and the evaluation clock are fixed to 27 October 2026, 09:00 UTC. Presentation contracts, normalization, and the demo adapter are under `src/lib/contracts`, `src/lib/adapters`, and `src/lib/demo`. Current management dependencies are recorded in [docs/integration-contract.md](./docs/integration-contract.md); connected mode cannot be enabled through browser controls.

Optional `SITE_URL` is server-only, non-secret build configuration: set it to the approved public origin before building for a real domain. See [.env.example](./.env.example). Without it, canonical URLs and sitemap entries are omitted. No `NEXT_PUBLIC_*` variable or privileged credential is required. Social preview generation is at `/opengraph-image`; its origin defaults to localhost in unconfigured local builds.

Access delivery requires a real provider/persistence contract, approved contact and privacy terms, server validation, bounded payloads, rate limiting, and verified delivery/error behavior. Security reporting requires an approved monitored channel. Details and claim sources are in [docs/content-sources.md](./docs/content-sources.md).

## Framework references

The original Create Next App stack and configuration are retained. Official Inter Variable and Geist Mono fonts are served locally and optimized through Next.js. Sources and license notices are recorded in [docs/asset-licenses.md](./docs/asset-licenses.md). Useful framework references:

- [Next.js documentation](https://nextjs.org/docs)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js font optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)

For this installed framework version, consult `node_modules/next/dist/docs/` first, as required by the generated AGENTS instructions.
