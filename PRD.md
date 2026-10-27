# Nexus Web — Product Requirements Document

Version: 1.0  
Planning baseline: 2026-10-26  
Target repository: `nexus-web`  
Document status: implementation specification; not a claim of completed functionality

## 1. Purpose and document ownership

Build the public website and customer console for Nexus, a security SDK and verification infrastructure project. The website must make Nexus understandable to a buyer, useful to an integrating developer, and inspectable by a security team.

This document owns product scope, workflows, milestones, and acceptance criteria. [DESIGN.md](./DESIGN.md) owns visual and interaction specifications. [AGENTS.md](./AGENTS.md) owns implementation workflow and engineering constraints. Read all three before implementation. Record material decisions in a short ADR rather than silently changing a requirement.

The immediate deliverable is a working web product: a credible public website, a complete simulated console, and an explicit adapter boundary for authenticated customer operations. Connected features follow verified backend contracts. These phases allow useful delivery without inventing security capabilities or waiting for unrelated native SDK work.

## 2. Product definition

### 2.1 Mission

Make sensitive digital interactions easier to trust by connecting device integrity, session evidence, and server-side verification.

The long-term positioning is infrastructure for human-verified interactions across applications. The initial commercial audience is fintech engineering teams and e-KYC vendors. Gaming and browser applications are expansion markets, not claims of currently supported SDK integrations.

Nexus Web is a marketing and control-plane product. It is not a biometric classifier, an identity verification service, or a browser implementation of the Rust SDK. No AI model is required for this scope.

### 2.2 Claim boundaries

Keep these distinctions throughout copy, diagrams, metrics, and support material:

- A valid device key is evidence about a key and its enrollment context; it does not prove the person operating it is human.
- A server-accepted receipt means the specified verification policy accepted that receipt. It is not automatic proof of liveness, camera provenance, or transaction authorization.
- Different frame fingerprints establish different bytes, not distinct live humans.
- Hardware-backed, software-backed, unsupported, and unverified evidence must remain distinguishable.
- An automated request can originate from a real device. Do not equate “physical device” with “human.”
- A production web deployment does not promote a staging SDK or service to production.

Use ambitious language for the mission and exact language for available features. Do not publish “100% human,” “unhackable,” “blocks every bot,” “bank certified,” or a detection rate without supporting evidence and a defined evaluation scope.

### 2.3 Current integration baseline

The following describes README evidence reviewed on the planning date, not an independent execution audit:

| Component | Observed baseline | Consequence for this web project |
| --- | --- | --- |
| `nexus-sdk` | Rust core and native C ABI; frame quality, session/capture lifecycle, trust and checkpoint operations | Explain the native architecture; do not imply an existing JavaScript, Flutter, or Swift package without checking release artifacts |
| `nexus-sdk` | Production enrollment remains denied; staging and fixture domains are explicit | Display environment and capability status accurately |
| `nexus-enrollment` | Separate staging Android enrollment service; loopback listener | Do not expose it directly to the public internet from this project |
| `nexus-enrollment` | Device enrollment/capture protocol exists; HTTP administration endpoints are absent | A customer management API is a dependency to specify, not an API to guess |
| `nexus-enrollment` | Trusted operator CLI manages privileged operations | Never make a web route execute privileged CLI commands as a shortcut |
| `nexus-enrollment` | Revocation affects future operations; previously issued offline evidence has bounded leases | Explain revocation timing from the actual lease contract; do not promise instant invalidation of all offline evidence |

Sources: [SDK README](https://github.com/Rafiqalha/nexus-sdk/blob/main/README.md), [enrollment README](https://github.com/Rafiqalha/nexus-enrollment/blob/main/README.md). Recheck these contracts before connected implementation. This document does not assume an existing `nexus-web` checkout is empty.

## 3. Users and desired outcomes

| User | Main question | Successful outcome |
| --- | --- | --- |
| Buyer or founder | What does Nexus protect, and where does it fit? | Understands the product and requests developer access or a pilot conversation |
| Integrating engineer | How do I connect a supported app and verify its result? | Finds versioned instructions, environment requirements, and a first-request workflow |
| Security or fraud analyst | Why did this request receive this decision? | Inspects verified evidence, reported evidence, policy revision, and limitations |
| Workspace administrator | Who can access this project and change its configuration? | Uses authenticated, tenant-scoped administration with traceable changes |

Do not optimize the first release for enterprise procurement dashboards, consumer account management, identity-document storage, or a large billing suite.

## 4. Delivery modes and environments

Treat data mode and security environment as separate axes.

| Axis | Values | Meaning |
| --- | --- | --- |
| Console data mode | `demo`, `connected` | Synthetic scenario data versus responses from an authenticated management service |
| Security environment | `staging`, `production`, `unknown` | Environment reported by a verified service contract, not inferred from the website hostname |

Rules:

1. Demo is conspicuously labeled “Simulated data” on every console page and export. It needs no security credentials.
2. Connected mode requires configured authentication and a verified management API contract. Missing configuration returns an honest unavailable state.
3. Connected mode must never fall back to fixtures after an error, timeout, or permission denial.
4. A client query parameter cannot enable production, change tenant membership, or turn simulated data into verified data.
5. If production is unavailable, show an explanatory disabled state or omit the option. Do not create a working-looking production selector.
6. Public demonstrations cannot call a live tenant backend. Public demo mutations only change an isolated synthetic session and can be reset.
7. Real customer data never enters a shared demo session, fixture file, screenshot seed, or analytics event.

## 5. Scope and release phases

### 5.1 Public website — release first

- Responsive home, product, developers, security, company, and request-access pages.
- A labeled interactive product walkthrough using synthetic scenarios.
- Accurate platform availability and integration status.
- Contact/request-access flow with a real delivery mechanism when configured.
- Search metadata, social previews, accessible navigation, and essential legal information approved for publication.

### 5.2 Console — useful independently of live infrastructure

- Complete demo workflows for overview, requests, request detail, enrollment detail, policy inspection, integration setup, audit history, and settings.
- Filtering, sorting, pagination, deep links, loading/empty/error states, and resettable scenarios.
- A typed service adapter that keeps demonstration data separate from connected data.
- Read-only connected workflows before privileged management features.

### 5.3 Deferred scope

- Payment collection, automatic invoicing, and pay-per-use billing calculations.
- Publicly accessible production enrollment, issuer, or signing services.
- Native SDK changes, biometric models, human detection in JavaScript, camera collection, and app bindings.
- Claims of universal browser, game engine, iOS, or Flutter support without corresponding supported releases.
- SSO/SCIM, custom role builders, multi-region administration, and rule marketplaces.
- Autonomous policy changes, automatic risk scoring, and automatic customer blocking based on invented heuristics.

## 6. Information architecture

Implement a single Next.js application initially. Keep marketing and console layouts separate through route groups. The following are web routes, not backend API endpoint promises.

| Route | Purpose | Availability |
| --- | --- | --- |
| `/` | Explain value, show product, invite access | Public |
| `/product` | Architecture, evidence flow, supported capabilities | Public |
| `/developers` | Integration overview and verified documentation links | Public |
| `/security` | Trust boundaries, data handling, reporting contact | Public |
| `/company` | Team and independently supported milestones | Public |
| `/request-access` | Pilot/developer access request | Public; delivery status explicit |
| `/demo` | Labeled, isolated console demonstration | Public |
| `/demo/requests/[id]` | Synthetic request inspection | Public, synthetic identifiers only |
| `/sign-in` | Real console authentication | Enable when real authentication exists |
| `/app` | Authenticated overview and onboarding | Connected mode |
| `/app/requests`, `/app/requests/[id]` | Request investigation | Connected mode |
| `/app/enrollments`, `/app/enrollments/[id]` | Enrollment inspection | Connected mode |
| `/app/policies`, `/app/policies/[id]` | Policy versions and later authorized edits | Connected mode |
| `/app/integrations` | Supported setup instructions and credentials workflow | Connected mode |
| `/app/audit` | Server-recorded administrative history | Connected mode |
| `/app/settings` | Organization, membership, environment settings | Connected mode |
| `/privacy`, `/terms` | Actual approved policies | Publish when content is approved |

Demo may reuse console components with equivalent nested routes. Keep separate layouts or entry guards so data mode cannot become ambiguous. Use a configurable canonical site origin; no domain name is treated as purchased. Separate marketing and console domains can be introduced later without changing tenancy rules.

## 7. Public website requirements

### 7.1 Messaging and home page

Recommended hero:

> Security for human-verified interactions.
>
> Nexus connects device integrity, session evidence, and server-side verification to help applications evaluate sensitive requests.

Primary CTA: **Request developer access**. Secondary CTA: **Explore the architecture**. A tertiary text link can open the simulated console. Place a concise availability label near the CTA, such as “Developer preview · Android staging integration.” Confirm the label against release evidence before publication.

Required home-page sequence:

1. Clear hero and a compact annotated product illustration.
2. The problem: sensitive actions need contextual evidence beyond a client-side success flag.
3. How Nexus fits between an application and its verification backend.
4. Three capability groups: session integrity, evidence verification, and policy visibility.
5. An actual console preview or a clearly labeled simulation.
6. Developer integration entry point, supported platforms, and next steps.
7. Supported project milestones and an honest access CTA.

Do not present partners, prospects, hackathon judges, or technology vendors as paying customers. A verified competition award may appear as an award with its source and date. Do not use a YC-backed badge unless acceptance has occurred and its use is permitted.

### 7.2 Developers and security content

- Explain the application → native SDK → evidence → backend verification relationship without claiming cryptographic proof of the camera sensor.
- Use real, versioned integration snippets only after checking the relevant contract. Otherwise use a clearly labeled conceptual sequence, not copyable fictional SDK methods.
- Document supported versus planned platforms separately.
- Explain what is measured, what is cryptographically verified, and what remains unverified.
- Describe actual data handling and retention. Do not claim “zero personal data,” “SOC 2 compliant,” “GDPR compliant,” or “nothing ever leaves the device” by default.
- Security reporting contact must be an approved, monitored channel. Do not invent an email address on an unowned domain.

### 7.3 Request access

Minimum fields: name, work email, organization, role, intended integration, and optional message. Avoid phone numbers and biometric or identity-document uploads.

Validate on the server, limit size and submission rate, and provide accessible error messages. A success message requires confirmed persistence or confirmed acceptance by the configured delivery provider. No simulated “message sent” notification. If delivery is not configured, offer a real approved contact link or explain availability without discarding submitted data silently. Log only minimal non-sensitive operational information.

## 8. Console workflows

### 8.1 First-run onboarding

The connected workflow is: authenticate → select an authorized workspace → select an available environment → select a supported integration → configure credentials through the approved contract → send the first request → inspect its evidence.

Each step has a persistent state only where a real service supports it. “First request received” must be derived from a server record. Demo onboarding uses explicitly simulated progress. An empty workspace should show actionable setup instructions, not empty charts everywhere.

### 8.2 Overview

Show request volume, verification decisions, errors, and latency only where supported by the data contract. Include time range, timezone, environment, aggregation basis, and last updated time. Missing metrics display “Unavailable,” not zero. Do not label accepted requests “humans verified,” or rejected requests “fraud prevented.”

### 8.3 Request investigation

Provide filterable, paginated requests with timestamp, opaque request identifier, environment, decision, reason, and policy revision when available. Detail view contains:

- Decision and its explicitly stated scope.
- Evidence-by-evidence evaluation, origin, and observation time.
- Enrollment and policy references where authorized.
- Freshness, expiry, and relevant server timestamps.
- Verification or transport errors separately from policy denials.
- An event timeline based on actual events, not an invented processing history.

Filters should be URL-addressable when their values are non-sensitive. Never put secrets or raw attestation material in query strings. Raw payload access and export are deferred unless redaction, authorization, size limits, and audit requirements are implemented.

### 8.4 Enrollments and policies

Read-only enrollment views distinguish current status, historical enrollment events, and device security level. Stable enrollment identity and security revision are distinct fields. Do not derive revocation state from an expired session alone.

Policy views show the exact version, digest, effective state, and origin when provided. Editing and revocation are later features. They require backend authorization, concurrency protection, a preview of impact, confirmation, and a server-recorded audit event. The web application must not mint security policy signatures or rewrite durable trust state locally.

### 8.5 Roles and membership

The following is a proposed management permission model, not an assertion that the backend already implements these roles:

| Operation | Viewer | Developer | Administrator |
| --- | --- | --- | --- |
| Read permitted project requests and policies | Yes | Yes | Yes |
| View setup instructions | Yes | Yes | Yes |
| Manage permitted integration credentials | No | Yes, if explicitly granted | Yes |
| Change active policy or revoke enrollment | No | No by default | Yes, with step-up where required |
| Manage members and billing | No | No | Yes |

Enforcement belongs to the management service as well as server-side web checks. The browser cannot grant itself a role. Role names and capabilities must be reconciled with the actual backend contract before activation.

## 9. Data and integration contracts

### 9.1 Web view models

Create typed view models for workspace context, environment capabilities, request summaries, evidence items, enrollment summaries, policy revisions, audit events, and paginated responses. These are presentation contracts, not replacements for the SDK evidence schema.

An evidence item should preserve at least:

| Field | Meaning |
| --- | --- |
| `checkId`, `label` | Stable check identity and human-readable description |
| `evaluation` | Proposed normalized values: `passed`, `failed`, `not_evaluated`, `unavailable`, `error` |
| `origin` | Proposed values: `server_verified`, `client_reported`, `simulated`, `unknown` |
| `scope` | What the evaluation actually establishes |
| `observedAt`, `expiresAt` | Server-supported timestamps; nullable when unknown |
| `reasonCode`, `reasonText` | Structured reason and safe display explanation |

Unknown upstream enum values map to an explicit unknown/unavailable presentation, never a passing result. A verified signature cannot automatically turn every client-reported field into a server-verified fact. Retain this distinction during normalization.

### 9.2 Management API dependency

Before connected work, create `docs/integration-contract.md` recording the upstream source/version, authentication method, tenant derivation, available operations, schemas, timeouts, pagination, error mappings, and deployment boundary. Do not invent REST paths to make the UI appear connected.

Required capabilities include current identity/workspaces, environment availability, request listing/detail, enrollment listing/detail, policy listing/detail, and audit retrieval. Mark each as implemented, unavailable, or requiring upstream work. These capability names do not define endpoint URLs.

Existing device endpoints such as `/v1/enroll` and `/v1/capture-receipt` are not a dashboard administration API. Frontend implementation must not repurpose them for privileged management.

### 9.3 Server boundary

- Use server-only modules for upstream credentials and authenticated management calls.
- Derive tenant membership from verified server-side identity. Validate resource ownership on every read and mutation.
- Scope cache keys by tenant, project, environment, authorization context, and query where caching is appropriate. Never share authenticated HTML or JSON through public caching.
- Do not automatically retry non-idempotent mutations. Use the documented operation identifier and idempotency contract where available.
- Apply explicit deadlines and bounded payload sizes. An upstream outage is not a successful empty result.
- Keep production signing keys, enrollment roots, and issuer secrets outside this web project and browser bundles.
- Do not proxy arbitrary URLs or accept a browser-supplied backend host.

## 10. Non-functional requirements

### Security and privacy

Use a real session/authentication implementation, secure cookies where applicable, CSRF protection appropriate to the authentication model, server-side authorization, validated redirect destinations, rate limits for public forms, and sanitized display of untrusted content. Plan CSP around actual framework needs; do not advertise a policy that has not been tested.

Collect no face images, raw camera frames, identity documents, or attestation certificates in product analytics. Avoid session replay analytics on the console. Secrets must never appear in URLs, client logs, exception reports, screenshots, or exported fixtures. Real secret material is never stored in `NEXT_PUBLIC_*` variables.

### Accessibility and performance

Target WCAG 2.2 AA and the detailed requirements in DESIGN.md. Keyboard use, focus management, forms, dialogs, contrast, reduced motion, and status messages are release requirements.

Target field Core Web Vitals at the 75th percentile: LCP ≤ 2.5 seconds, INP ≤ 200 milliseconds, CLS ≤ 0.1. These are goals until field measurements exist. Use lab measurements as diagnostics, not proof of real-user performance. Keep marketing content server-rendered and client JavaScript limited to necessary interactions.

### Reliability and observability

Record redacted correlation identifiers and operation failures, not sensitive request bodies. Show last-update time and stale-data states. Important UI actions must acknowledge input promptly and provide recovery instructions on failure. Do not silently retry destructive actions.

## 11. Milestones and acceptance criteria

Complete vertical slices with behavior, responsive states, and relevant verification. Do not produce documentation-only milestones while core screens remain nonfunctional.

| Milestone | Deliverable | Exit evidence |
| --- | --- | --- |
| M0 — Foundation | Routes, tokens, typography, layouts, mode separation, scripts | Build works; marketing and demo shells usable on mobile and desktop |
| M1 — Public product | Complete public pages, architecture explanation, working access path | All CTA destinations work; copy and claim provenance reviewed |
| M2 — Console demo | Resettable synthetic workflows, request detail, filters, state coverage | End-to-end demo works without live credentials; every screen labels simulation |
| M3 — Connected reads | Real auth, tenant context, supported read operations | Successful real request inspection and negative authorization tests |
| M4 — Authorized management | Only backend-supported credentials/policy/membership operations | Server-enforced permissions, race/error handling, and real audit events |
| M5 — Web release | Accessibility, performance, security, deployment checks for chosen scope | Release evidence tied to exact source; unresolved capability limits published |

M1 and M2 may be released before M3. M4 is not required for an honest read-only staging console. External blockers should stop dependent operations, not independent delivery.

| ID | Acceptance requirement |
| --- | --- |
| P01 | A visitor can explain Nexus's purpose and navigate to access or developer material without a dead CTA |
| P02 | Public claims match evidence; no fabricated customers, benchmark numbers, compliance badges, or human-detection guarantees |
| P03 | Every demo screen and export is labeled synthetic; connected failures never load fixtures |
| P04 | Request detail separates decision, evidence origin, scope, and unavailable checks |
| P05 | A user from tenant A cannot read or mutate tenant B resources by changing identifiers, routes, or request bodies |
| P06 | Secrets and sensitive evidence are absent from client bundles, URLs, analytics, and default logs |
| P07 | Loading, empty, denied, expired-session, upstream-failure, and stale-data states have accurate recovery behavior |
| P08 | Supported workflows work by keyboard, at mobile widths, with reduced motion, and at browser zoom |
| P09 | Connected operations reference a verified API contract; unavailable capabilities remain unavailable |
| P10 | Public form success corresponds to actual accepted delivery or persistence |
| P11 | A policy/credential mutation requires real permission and backend success; uncertainty is not shown as success |
| P12 | Release evidence distinguishes web readiness, service readiness, and SDK security eligibility |
| P13 | Chart values, counts, and time ranges are reproducible from their stated data source; missing values are not zero-filled |
| P14 | Revocation and expiry displays respect upstream lease/revision semantics instead of inventing immediate global invalidation |

## 12. Measurement and open decisions

Track qualified access requests, visits to integration documentation, demo completion, and time to first real staging request where collection is consented and technically supported. Define denominators and exclude team/demo traffic. Establish numeric conversion targets after an initial baseline; do not invent existing adoption.

Decisions to resolve when needed:

- Owned domain, approved logo, legal entity/contact details, and approved public team information.
- Authentication provider and management-service authorization contract.
- Which connected environment and endpoints are actually deployed and reachable.
- Approved retention and privacy notices, analytics choice, and operational support channel.
- Any future pricing model and billable event definition; no public price calculation until agreed.

Record a decision owner, impact, and dependent milestone for each unresolved item. Continue independent implementation using safe local defaults and clearly marked demo data.

## 13. Reference material

- [SDK source and capability baseline](https://github.com/Rafiqalha/nexus-sdk)
- [Enrollment service and trust boundaries](https://github.com/Rafiqalha/nexus-enrollment)
- [Next.js server and client components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Core Web Vitals](https://web.dev/articles/vitals)

Visual references and implementation details are in DESIGN.md. These references inform the design; they do not imply a partnership, endorsement, or production certification.
