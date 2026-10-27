# M2 console demo

The owner requested the next milestone after the public-site design and motion
work. PRD M2 is implemented independently of the unavailable M1 intake provider
and M3 authentication/management integration.

## Workflow and state

- `/demo` is the overview and exploration checklist.
- `/demo/requests` supports URL search, decision filters, stable sorting, and
  six-record pages. `/demo/requests/[id]` preserves decision scope, transport,
  evidence origin/coverage, observation/expiry, missing metrics, references, and
  explicit fixture events. Unknown identifiers show a record-not-found view.
- `/demo/enrollments` and detail views separate status, stable identity, security
  level/revision, history, and bounded lease limitations.
- `/demo/policies` and detail views inspect exact fixture revisions and rules.
  No signed digest is invented and no mutation action is enabled.
- `/demo/integrations` explains staging availability and the exploration flow.
- `/demo/audit` filters the fixed synthetic administrative history.
- `/demo/settings` edits only the session label and appearance preference.
- The earlier five-scenario illustration remains at `/demo/walkthrough`.

The shell persistently labels simulated data. Record scenarios include accepted,
expired, rejected, missing evidence, transport errors, and unknown enum values.
Workspace scenarios cover records, empty, service error, denied, expired session,
stale data, and loading. Recovery restores only synthetic data. Errors do not
render zero-filled or successfully empty results.

Session controls, label, and checklist live in the provider, separately for each
tab. Reload starts a new session. Reset restores default records, label,
checklist, and URL filters and returns to the overview; it preserves appearance.
The dark/light/system preference is a non-secret `/demo` cookie. Its initial
value is read server-side within Suspense; OS preference is resolved by CSS.
It cannot grant a role or enable production.

## Data and integration

The fixed snapshot has 18 synthetic requests, four enrollments, two policy
revisions, and five audit events. Overview counts and measured-latency median
are derived from that same dataset. Missing metrics are excluded rather than
zero-filled. A zero quality-score example remains zero, without implying a
passing quality/liveness check. Exports and copied summaries identify synthetic
origin. Clipboard failures have a visible download alternative.

The adapter and normalization boundary are typed presentation contracts. No
server endpoint, issuer implementation, credential, privileged action, or live
network integration is added. See [integration-contract.md](../integration-contract.md)
for exact missing management capabilities and the prior source-review baseline.

Acceptance: P03, P04, P07, P08, P12, P13, P14. P05 connected tenant authorization
and P11 actual backend mutations are not claimed by a public synthetic demo.

## Verification

Validated locally on 2026-10-27 with `npm run lint`, `npm run typecheck`,
and `npm run build` (build ID `37UgUNQg_aRGPUmwENT6G`). The production browser
suite passed all 37 tests, covering console workflows, failure recovery,
session isolation, theme persistence, keyboard access, accessibility in both
themes, responsive layouts, and the existing marketing/motion/hydration checks.

Forty desktop/mobile screenshots were captured across ten console routes in
dark and light themes, with no browser console or page errors. Visual review
included the route contact sheets and full request detail. This validates the
synthetic web workflow; no deployment or connected security integration is claimed.

The restored development preview on port 3000 also passed overview, decision
filter, request detail, and direct reload at 1440 px and 390 px with no console
or page errors, including no hydration warnings.
