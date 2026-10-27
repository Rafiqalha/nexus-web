# Working in `nexus-web`

Version: 1.0  
Planning baseline: 2026-10-26

This file instructs coding agents working in this repository. Build useful, working product increments. Do not substitute repeated audits, speculative abstractions, or long progress documents for implementation.

## 1. Read first and understand the boundary

Read [PRD.md](./PRD.md), [DESIGN.md](./DESIGN.md), the existing README, and any applicable directory-level instructions before editing. Inspect the current source and package scripts rather than assuming this is a new repository.

- PRD owns scope, user behavior, modes, and acceptance criteria.
- DESIGN owns tokens, layout, content presentation, and interaction behavior.
- AGENTS owns implementation practices and verification.
- The user's explicit task determines the authorized scope. Record a material conflict before resolving it; do not silently rewrite these documents to make an implementation pass.

Nexus Web contains the public website and customer console. The Rust SDK, enrollment/issuer implementation, native bindings, and mobile applications remain in their own repositories. Do not copy Rust, C++, Kotlin, Gradle projects, model files, APKs, or private issuer material into this repo.

The product mission concerns human-verified interactions, but device integrity and a valid signature alone are not proof of a human. Preserve the distinction in code, labels, examples, and demonstrations.

## 2. Working principles

1. Inspect the current state, choose the next complete user workflow, implement it, and verify it.
2. Prefer a working landing page and request-detail flow over ten partially implemented screens.
3. Finish authorized, reversible work without repeatedly requesting permission for routine choices.
4. When an external dependency blocks a feature, isolate that dependency and continue independent work. Never replace the dependency with fake success.
5. Keep documentation proportionate: update contracts and decisions that changed. Avoid a new giant report for every UI patch.
6. Do not claim a test, build, deployment, integration, or security check passed unless you ran it or can point to exact corresponding evidence.
7. Do not change unrelated repositories or user edits. Never run destructive Git cleanup to obtain a clean tree.
8. Do not launch additional agents unless the user or applicable instructions explicitly authorize delegation.

## 3. Initial repository inspection

Before bootstrapping or making broad edits:

- Check working directory, Git branch/status, existing files, scripts, lockfile, and framework version.
- Identify unfinished work and preserve it. Use `rg` and targeted file reads before broad refactors.
- Inspect environment-variable names without printing secret values.
- Determine whether the task is public-site, demo-console, or connected-console work.
- Identify the relevant PRD acceptance IDs and DESIGN patterns.

For a genuinely new project, use Next.js App Router with TypeScript. Select mutually compatible current stable versions from official documentation at implementation time, pin the runtime/package-manager versions, and commit the lockfile. Do not copy version numbers from the native Rust project. If an existing compatible stack is present, evolve it rather than replacing it unnecessarily.

## 4. Stack and structure

Preferred stack:

| Concern | Choice or rule |
| --- | --- |
| Framework | Next.js App Router, TypeScript with strict checking |
| Styling | Tailwind CSS with the semantic tokens in DESIGN.md |
| Accessible primitives | shadcn/ui components, reviewed and owned in this repo |
| Icons | Lucide React; explicit imports and consistent stroke |
| Fonts | Geist Sans and Geist Mono through `next/font` or verified local assets |
| Motion | CSS first; Motion only where a real interaction needs orchestration |
| Schema validation | A maintained typed schema library when boundary validation needs it |
| Component/unit tests | Existing runner; otherwise Vitest and Testing Library where appropriate |
| Browser tests | Playwright for critical user workflows |
| Charts | Add a chart library only when actual chart requirements justify it |
| Authentication | Choose through a recorded integration decision; no homemade cryptographic session system |

Do not install every potential library on day one. Use the repository's existing package manager. For a new repo without one, npm is the default; keep a single authoritative lockfile and use reproducible CI installs.

Suggested structure, adapted to existing conventions:

```text
src/
  app/
    (marketing)/
    (auth)/
    (console)/app/
    (demo)/demo/
    api/                       # Only actual web/BFF routes implemented here
    globals.css
  components/
    ui/
    marketing/
    console/
    evidence/
  lib/
    server/                    # Authentication, authorization, upstream clients
    contracts/                 # Validated boundary schemas and view models
    adapters/                  # Explicit mapping to presentation contracts
    demo/                      # Synthetic data, isolated from live adapters
    format/                    # Safe dates, numbers, labels
  content/                     # Reviewed marketing/documentation content
tests/
  unit/
  integration/
  e2e/
public/
docs/
  decisions/
  integration-contract.md
```

This is an ownership map, not an instruction to create empty folders. Do not make a root-level `app/` inside `src/app/` accidentally when using route groups. Check the actual generated URLs.

## 5. Rendering and component boundaries

- Default to Server Components for marketing pages, authenticated server reads, and static structure.
- Use Client Components for stateful browser interactions only. Do not place `use client` at the root to avoid understanding the boundary.
- Keep server-only upstream clients and credentials behind an explicit server-only import boundary.
- Build reusable components where behavior repeats. Avoid a generic schema-driven page builder for a handful of different screens.
- Keep display models separate from raw evidence documents. UI transformations must not change signed bytes or invent trust semantics.
- Use semantic HTML, meaningful headings, real links, and buttons for actions.
- Use URL state for shareable non-sensitive filters; local state for transient UI; server state for authoritative account and security information.
- Avoid redundant client fetching when server rendering already provides the needed data. Revalidation must preserve tenant and permission boundaries.

## 6. Demo and connected behavior

### Demo

Demo runs without privileged credentials. All records are synthetic and stable enough for reproducible tests. Include fresh/accepted-under-policy, expired, rejected, unavailable-evidence, and upstream-error scenarios.

Show “Simulated data” persistently in the shell and detail pages. Label copied/exported demo content. Demo actions may update an isolated session state but must not pretend to modify a real device or account. Make reset behavior explicit.

### Connected

Do not enable connected mode until there is a verified authentication and management API contract. Create and maintain `docs/integration-contract.md` with source links/version, schemas, supported operations, authorization requirements, and failure semantics.

The current enrollment service's device endpoints are not a public management API. Do not guess paths such as an admin list endpoint, expose the loopback service, or shell out to an operator CLI from a web request.

Missing upstream configuration is a configuration error. Missing capability is unavailable. Timeout is an error. None of these conditions is a successful empty dataset or a reason to return demo fixtures.

If upstream management capabilities are missing, implement the UI and adapter interface in demo mode and document the exact missing contract. Do not fabricate an HTTP server to make an end-to-end security claim.

## 7. Security-critical implementation rules

### Identity, tenancy, and permissions

- Verify identity and session state on the server. User-controlled headers, hidden form fields, local storage, and route IDs cannot establish membership or roles.
- Enforce resource ownership and operation permissions on every read and mutation, including Server Actions and route handlers. Hidden buttons are not authorization.
- The upstream management service must also authorize operations; the web layer cannot compensate for an unauthenticated privileged service.
- Scope queries and caches by tenant, project, environment, and authorization context. Never publicly cache authenticated data.
- Use validated relative redirects or an explicit trusted-origin allowlist. Do not accept arbitrary return URLs.
- Treat authorization denials consistently without disclosing another tenant's resource details.

### Secrets and sensitive evidence

- Never commit `.env` secrets, signing keys, seed files, credential-bearing URLs, database copies, or customer payloads.
- `.env.example` contains variable names and non-secret examples only. Document public versus server-only variables.
- `NEXT_PUBLIC_*` is public by definition. Only deliberate public configuration belongs there.
- Do not expose private signing operations through this console. Production roots and issuer keys belong to the separately controlled backend infrastructure.
- Redact logs and error reporting. Avoid raw evidence blobs and authorization headers in traces.
- Do not collect camera frames, face images, identity documents, or raw attestation certificates for this web scope.
- Add credential reveal/copy flows only after a real backend contract exists. Never store real secret values in local storage or a shared query cache.

### Input and mutation safety

- Validate external data at trust boundaries, including upstream responses where their shape affects security/UI decisions.
- Render user-controlled content as text by default. Sanitize any deliberately supported HTML/Markdown.
- Use documented idempotency mechanisms for retriable mutations; do not blindly retry an uncertain write.
- Use expected revisions/conditional updates where the backend supports them. A concurrent policy change must produce a conflict state rather than silently overwriting it.
- Require confirmation for consequential actions and show the actual scope. Success requires backend confirmation; a local state update is insufficient.
- Protect public forms against abuse with bounded payloads and server-side controls. Apply CSRF/origin protections appropriate to the selected authentication design.
- No `eval`, arbitrary URL proxy, arbitrary filesystem access, or subprocess bridge for operator commands.

## 8. Trust semantics in presentation

Never collapse these dimensions into a single green badge:

1. Transport outcome: did the service respond?
2. Verification decision: what did the applicable policy decide?
3. Evidence origin: server verified, client reported, simulated, or unknown?
4. Capability coverage: which checks were not evaluated or unavailable?
5. Security eligibility: staging or production, as established by the service contract?

If an enum is unknown, display an unknown/unavailable state and retain a safe diagnostic identifier. Do not default to success. Do not infer humanity from completion, biometrics from quality scores, or sensor provenance from signatures. Expiry and revocation displays follow the upstream contract, including lease limitations.

## 9. Design implementation rules

- Use DESIGN.md tokens; do not scatter arbitrary hex colors, spacing scales, fonts, or radii across components.
- Keep actual interactions fast. Do not delay security feedback for animation.
- Use reduced-motion support in both CSS and JavaScript animation paths.
- Add visible focus and accessible names. Icon-only controls need labels; decorative icons are hidden from assistive technology.
- Test errors, long organization names, unknown data, zero results, and high-density tables, not just attractive sample content.
- Use actual illustrations/diagrams related to evidence flow. Avoid unrelated shield clip art, cyberpunk backgrounds, and decorative terminal spam.
- Do not copy competitor logos, screenshots, testimonials, or proprietary layouts as Nexus assets.
- Verify asset licenses and retain required attribution in an asset/license record.

## 10. Testing and verification

Choose checks that demonstrate behavior and risk coverage. Do not add brittle tests that only repeat implementation details or chase an arbitrary coverage percentage.

Priority scenarios:

| Area | Required evidence when implemented |
| --- | --- |
| Marketing | Navigation, real CTA destinations, responsive layout, form validation and delivery failure |
| Demo | Persistent simulation label, reset, detail navigation, no calls to live services |
| Request detail | Origin/scope preserved; unknown checks and missing metrics cannot become passing/zero values |
| Connected reads | Valid session works; expired session fails; cross-tenant identifier changes are denied |
| Mutations | Unauthorized action denied server-side; conflict/error does not show success; idempotency semantics respected |
| Secrets | No real secrets in client bundles, URLs, fixtures, screenshots, or test output |
| Accessibility | Keyboard navigation, dialog focus, forms, contrast, reduced motion, zoom and narrow widths |

Define and document scripts for lint, type checking, unit/integration tests, production build, and browser tests as the project grows. Run the scripts actually present in `package.json`; do not claim a nonexistent `next lint` command or assume the current framework bundles one.

For an implementation milestone, run relevant targeted tests plus type checking, lint, and production build. Run browser checks for the affected critical flows and visually inspect mobile/desktop states. Broaden testing when new failures or changed boundaries justify it.

Keep CI artifacts small and useful: test summaries and screenshots/traces for failures, with secrets redacted. Tie reports to the tested commit. CI configuration is not proof that CI has passed, and a green web build is not security-product certification.

## 11. Delivery workflow

1. State the workflow being implemented and its relevant acceptance IDs.
2. Inspect the smallest set of files needed; confirm contracts before connected calls.
3. Implement the full slice, including failure states and responsive behavior.
4. Run appropriate checks and inspect the rendered result.
5. Fix findings, update changed contracts/decisions, and summarize remaining dependencies.
6. Commit, push, or deploy when authorized by the current task or established session instructions. Never force-push or overwrite unrelated work to simplify delivery.

Do not add deployment credentials, purchase domains, send messages, or enable public security services merely because these documents exist. Keep preview infrastructure and production security eligibility distinct.

When finished, report: what now works, what was actually tested, which data mode was used, and any specific upstream blocker. Include exact commit/CI links only when they exist. Avoid percentage-complete claims without an agreed, evidence-backed rubric.

## 12. Definition of done

A feature is done when its intended user can complete the workflow, its data/authorization boundary is honest, its visual and accessibility states meet DESIGN.md, and the relevant PRD acceptance criteria have evidence.

A button that only shows a success toast, a live-looking dashboard backed by unlabeled fixtures, or a management action checked only in the browser is not complete. A deliberately labeled, functional demo is a legitimate deliverable; a fabricated live integration is not.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
