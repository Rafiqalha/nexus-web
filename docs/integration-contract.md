# Console integration boundary

Status: connected mode unavailable. Updated 2026-10-27 for the M2 synthetic
console. This document describes dependencies, not an approved management API.

## Evidence baseline

The source review recorded in [content-sources.md](./content-sources.md) covers:

- [SDK README](https://github.com/Rafiqalha/nexus-sdk/blob/main/README.md), reviewed
  blob `e33591636cc3549107c4c59497af956ac0a87e39`.
- [Capture receipt ABI 2.11](https://github.com/Rafiqalha/nexus-sdk/blob/main/docs/api/CAPTURE_RECEIPT_ABI_2_11.md),
  reviewed blob `9b4b8dfbbba3b360f540971ccaa9ab5d1948b038`.
- [Enrollment README](https://github.com/Rafiqalha/nexus-enrollment/blob/main/README.md),
  reviewed blob `9728b49decd96c9c2dc86680a50bc8ecec5042c5`.

These are the earlier source-review snapshots, not a fresh execution or upstream
availability check in M2. Repository access may be required. Reverify versions
and permissions before connected work. Device enrollment/capture protocols and
the operator CLI are not a customer management API.

## Missing connected operations

| Capability | Status | Required contract before enabling |
| --- | --- | --- |
| Identity and session | Unavailable | Authentication provider, verified session, expiry, safe redirects, CSRF/origin protection |
| Workspace/project/environment | Unavailable | Server-derived tenant membership, resource scope, environment eligibility |
| Request list and detail | Unavailable | Authorized schema, filtering, stable order, pagination/count semantics, timestamps, evidence origin and coverage |
| Enrollment list and detail | Unavailable | Stable identity versus security revision, security-level origin, revocation and offline-lease semantics |
| Policy revisions | Unavailable | Exact version/digest, signatures/origin, effective state and applicability |
| Administrative audit | Unavailable | Server-recorded actor, operation, timestamp, resource scope, authorized retrieval |
| Credentials and management writes | Unavailable | Permissions, step-up where needed, idempotency, conditional updates, uncertainty/conflict reconciliation, audit confirmation |

No HTTP endpoint URL, credential format, session scheme, or upstream host is
invented by this project. No enrollment service is exposed or invoked. The web
application has no operator subprocess bridge.

## Implemented presentation contracts

`src/lib/contracts/console.ts` defines request/evidence, enrollment, policy,
audit, snapshot, read-state, query, and pagination view models. These models do
not replace native receipt bytes or ABI schemas. `src/lib/adapters/evidence.ts`
maps unrecognized decision/evaluation values to explicit unknown labels and
preserves diagnostics. Nullable observations, expiries, revisions, digests, and
metrics display as unavailable. Numeric zero remains a numeric zero.

`src/lib/demo/service.ts` exposes only a `mode: "demo"` adapter. Its stable
fixtures are local and synthetic. Every evidence row has simulated origin and
separately identifies the kind of source it illustrates; a client-reported
measurement is not promoted to server verification. The fixed evaluation clock
is `2026-10-27T09:00:00Z`, with a visible one-hour aggregation range. Browser time
and randomness do not create security decisions.

The console cannot enable connected mode through a query string, cookie, theme,
workspace label, or environment selector. Scenario controls affect one React
session. Only the non-secret appearance preference is persisted in a cookie
scoped to `/demo`; it grants no identity, role, or environment eligibility.

## Required future failure behavior

Missing configuration is a configuration error; missing capability is
unavailable. Transport timeout is an error without a policy decision. Permission
denials and expired sessions must not expose resource details or load fixtures.
Connected caches must include tenant/project/environment/authorization scope.
Use explicit deadlines; do not retry uncertain writes without the documented
idempotency/reconciliation mechanism. No success may be inferred from local
state changes. The simulated recovery buttons are not connected retry flows.

M2 exports only a bounded, labeled presentation summary of synthetic fields.
Raw evidence/payload export, credential reveal, revocation, and policy writes
remain unavailable.
