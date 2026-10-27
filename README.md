# Nexus Web

The Nexus public website, built with the existing Next.js App Router, TypeScript, and Tailwind CSS setup. Read [PRD.md](./PRD.md), [DESIGN.md](./DESIGN.md), and [AGENTS.md](./AGENTS.md) before editing.

## Local development

Use Node 22.22.1 (`nvm use`) and npm. Preserve `package-lock.json`.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Public routes are `/`, `/product`, `/developers`, `/security`, `/company`, and `/request-access`. `/demo` has a separate, persistently labeled synthetic walkthrough with five resettable scenarios. Full M2 console workflows are not implemented.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Browser tests start the production server on `127.0.0.1:3100` and use installed Google Chrome. Install Chrome or adjust the Playwright channel for your environment. Build first. Tests cover public routes, internal links/anchors, mobile keyboard navigation, synthetic decisions and errors, local-draft validation/download, no submission, axe accessibility, reduced motion, text scaling, and reflow from 320 to 1440 CSS pixels. Screenshots are ignored under `test-results/visual/`; failure traces remain local.

## Data and configuration

This release uses public static content and synthetic walkthrough records. No connected API, authentication, payment, or issuer operation exists. The access form downloads a browser-local draft and clearly states that it is **not submitted**. No form data is sent to Nexus, saved to browser storage, or recorded in analytics.

Optional `SITE_URL` is server-only, non-secret build configuration: set it to the approved public origin before building for a real domain. See [.env.example](./.env.example). Without it, canonical URLs and sitemap entries are omitted. No `NEXT_PUBLIC_*` variable or privileged credential is required. Social preview generation is at `/opengraph-image`; its origin defaults to localhost in unconfigured local builds.

Access delivery requires a real provider/persistence contract, approved contact and privacy terms, server validation, bounded payloads, rate limiting, and verified delivery/error behavior. Security reporting requires an approved monitored channel. Details and claim sources are in [docs/content-sources.md](./docs/content-sources.md).

## Framework references

The original Create Next App stack and configuration are retained. Official Geist fonts are served locally and optimized through Next.js. Useful framework references:

- [Next.js documentation](https://nextjs.org/docs)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js font optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)

For this installed framework version, consult `node_modules/next/dist/docs/` first, as required by the generated AGENTS instructions.
