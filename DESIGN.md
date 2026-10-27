# Nexus Web — Design System and UX Specification

Version: 1.0  
Planning baseline: 2026-10-26  
Applies to: public website, simulated console, and connected customer console

## 1. Design intent

Nexus should feel precise, approachable, and technically credible. A buyer should understand the value quickly; a developer should find the integration path; an analyst should understand why a request received a decision.

“YC-quality” is an aspiration for clarity and product execution, not an official YC design standard and not a claim that Nexus is YC-backed.

The current visual direction follows the owner's 2026-10-27 request for Linear's neutral appearance: a near-black canvas, gray layered surfaces, Inter Variable typography, white/gray actions, and a wide original product illustration. All UI accents, focus rings, and statuses are neutral; status text and icons distinguish decisions and errors. This supersedes the original light marketing direction and the first violet-accent revision; see the [design decision](./docs/decisions/2026-10-27-marketing-design.md). Let the product itself provide the visual interest. Avoid hacker-movie styling, excessive gradients, decorative code, glowing shields, or an all-card layout.

[PRD.md](./PRD.md) defines scope and claim boundaries. [AGENTS.md](./AGENTS.md) defines implementation rules. These tokens and layouts are design decisions for Nexus, not measured copies of another company's website.

## 2. References and interpretation

| Reference | Useful principle | Nexus application |
| --- | --- | --- |
| [WorkOS](https://workos.com/) | Explain infrastructure through clear business value and developer entry points | Pair a concise proposition with a concrete integration path |
| [Clerk](https://clerk.com/) | Show product workflows and developer-facing detail | Use understandable setup steps and actual interface previews |
| [Fingerprint](https://fingerprint.com/) | Connect security signals to investigation workflows | Explain evidence and request decisions without copying unsupported claims |
| [Linear](https://linear.app/) | Controlled hierarchy and interaction polish | Use consistent density, alignment, and restrained transitions |
| [Vercel Geist](https://vercel.com/font) | A coherent sans/monospace type family | Use Geist Sans for UI and Geist Mono for identifiers/code |

Linear's rendered palette, font family, heading metrics, navigation height, and horizontal alignment were measured at 1440px and 390px on 2026-10-27, as recorded in the design decision. Other references remain directional. No conversion performance was measured. Do not reproduce protected assets or testimonials.

## 3. Brand and content voice

Use `Nexus` as the public brand. The owner-provided `public/icon/Interlocking Nexus N emblem.png` replaces the provisional line monogram. Keep the original source intact; its presentation frame removes excess canvas without redrawing the emblem. Pair it with an uppercase, widely spaced Inter wordmark, consistent optical sizing, and generous clear space. The mark is white on dark surfaces and inverted on light console surfaces. Mobile headers use a smaller lockup while retaining the accessible home-link name. Favicon, Apple icon, and social preview use the same supplied emblem. This does not assert trademark registration, a legal entity, or domain ownership.

Voice: confident, concrete, concise. Prefer “Inspect the evidence behind a request” to “Revolutionary next-generation human trust platform.” Explain specialized terms when they first matter.

Recommended hero:

> Security for human-verified interactions.

Supporting text:

> Nexus connects device integrity, session evidence, and server-side verification to help applications evaluate sensitive requests.

Use “Request developer access” as the primary action. Use “Explore the architecture” as the secondary action. Show the actual preview/staging availability near these actions, without making it the dominant message.

Do not call an accepted session “Human verified” unless a future validated capability explicitly supports that conclusion. Prefer “Accepted under policy,” with the policy and evidence scope nearby.

English is the initial public UI language for international developer and buyer audiences. Keep content organized for later Indonesian localization, but do not introduce a nonfunctional language switcher. Use sentence case for interface labels.

## 4. Color system

Define semantic CSS variables in the global theme. Components consume semantic tokens rather than hard-coded palette values.

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `--color-bg` | `#FAFAF8` | `#08090A` | Page canvas |
| `--color-surface` | `#FFFFFF` | `#0F1011` | Panels, menus, table surfaces |
| `--color-surface-subtle` | `#F3F5F8` | `#0B0C0D` | Grouped controls, subdued regions |
| `--color-surface-raised` | — | `#191A1B` | Selected controls and inset notes |
| `--color-text` | `#171A21` | `#F7F8F8` | Primary text |
| `--color-text-muted` | `#596273` | `#8A8F98` | Secondary text, captions |
| `--color-border` | `#E2E5EA` | `#23252A` | Decorative separators |
| `--color-control-border` | `#788396` | `#717378` | Essential control boundaries |
| `--color-brand` | `#2457E6` | `#D0D0D0` | Links and accent text |
| `--color-brand-soft` | `#EEF3FF` | `#1C1C1F` | Active/selected background |
| `--color-action-bg` | `#2457E6` | `#E5E5E6` | Primary button background |
| `--color-action-text` | `#FFFFFF` | `#08090A` | Primary button label |
| `--color-focus` | `#2457E6` | `#D0D0D0` | Keyboard focus ring |
| `--color-success` | `#167348` | `#E4E4E7` | Accepted label, accompanied by check and text |
| `--color-success-soft` | `#EAF7F0` | `#1B1C1D` | Status surface |
| `--color-warning` | `#9A5B00` | `#C5C5C8` | Expiry label, accompanied by clock and text |
| `--color-warning-soft` | `#FFF4DE` | `#1C1C1F` | Status surface |
| `--color-danger` | `#B42318` | `#E4E4E7` | Rejection/error label, accompanied by icon and text |
| `--color-danger-soft` | `#FDEEEB` | `#1C1C1F` | Error surface |
| `--color-header` | — | `rgb(8 9 10 / 88%)` | Translucent sticky navigation |
| `--color-ambient` | — | `rgb(255 255 255 / 4%)` | Restrained neutral illustration illumination |

Marketing uses the approved dark palette. The M2 console supports dark (default), light, and system preference; the initial choice is read server-side from a non-secret appearance cookie and OS preference is resolved by CSS. The light column above records the original marketing palette, while the console's neutral light tokens are defined in `src/app/console.css`: canvas `#FAFAFA`, surface `#FFFFFF`, primary text `#171819`, secondary text `#575B63`, border `#DEDFE2`, control border `#77797F`, and inverse action `#242527` with white text. Statuses and focus remain neutral. Do not use color to distinguish staging from production without a text label.

Text contrast targets: at least 4.5:1 for normal text and 3:1 for qualifying large text. Essential controls and focus indicators require appropriate non-text contrast. The pale decorative border token is not sufficient as the sole boundary of an essential input. Validate actual rendered combinations, including hover, disabled, selected, and dark states.

## 5. Typography

Use the officially distributed Inter Variable 4.1 for headings, prose, controls, and tables, loaded through `next/font/local`. It replaces Geist Sans following direct measurement of Linear's typography. Keep Geist Mono for identifiers, digests, endpoint examples, and code. Font files and licenses are verified local assets; do not add a runtime third-party font dependency.

| Role | Desktop | Mobile | Weight / line height |
| --- | --- | --- | --- |
| Hero | 64px maximum, responsive | 38px | 510 / 1 desktop, 1.1 mobile |
| Page title | 60px maximum, responsive | 32–44px, responsive | 500 / 1.15 |
| Section title | 48px maximum, responsive | 28px | 510 / 1 |
| Panel title | 20px | 20px | 600 / 1.3 |
| Marketing body | 18px | 17px | 400 / 1.65 |
| Console body | 14–16px | 14–16px | 400 / 1.5 |
| Label / button | 14px | 14px | 500 / 1.4 |
| Metadata | 12–13px | 12–13px | 400 / 1.5 |
| Identifier / code | 12–14px | 12–14px | 400 / 1.6 |

Use no more than three main font weights in a typical view. Prefer 400, 510, and 600; reserve 700 for rare emphasis. Hero and section tracking is -0.022em, as measured in Linear. Apply tabular numerals to metric values, timestamps, and numeric table columns. Body prose should normally stay within 60–75 characters per line. Avoid all-caps paragraphs and excessive negative letter spacing.

Use responsive `clamp()` sizing where helpful. Long headings and translated strings must wrap naturally; never force a headline into a fixed line count with clipping.

## 6. Spacing, layout, and surfaces

Base spacing scale in pixels: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 112`.

- Marketing container: outer maximum 1344px; side padding 24px on phones/tablets and 32px on desktop. This gives 80px content offsets at a 1440px viewport. The homepage preview extends 20px past the desktop text edge; mobile remains within its container.
- Marketing sections: 80–112px vertical spacing on desktop; 48–64px on mobile.
- Marketing grid: up to 12 columns desktop, 6 tablet, 4 mobile. Do not force every section into a card grid.
- Console sidebar: 240px desktop. Collapse to a labeled accessible navigation drawer at smaller widths.
- Console top bar: approximately 64px; content padding 24–32px desktop and 16–20px mobile.
- Form content: normally 480–640px maximum width. Avoid full-width text fields on a large monitor.

Radius tokens: controls 8px, standard panels 12px, prominent product preview 16px. Use a pill radius for compact status badges and the header access action, matching the measured navigation treatment. Avoid rounding every container into a capsule.

Shadow tokens:

```css
--shadow-panel: 0 1px 2px rgb(0 0 0 / 0.2);
--shadow-popover: 0 16px 48px rgb(0 0 0 / 0.4);
--shadow-feature: 0 24px 96px rgb(0 0 0 / 0.4);
```

Dark mode should use borders and surface separation first; keep shadows subtle. Borders, background changes, and whitespace should establish hierarchy before visual effects.

## 7. Icons and components

Use the original Nexus SVG family in `src/components/ui/icons.tsx`, following the owner's request for distinctive icons. This supersedes the initial Lucide direction. The family uses open geometry on a 24px grid, restrained secondary fills, and consistent 1.5px strokes. Symbols represent application, session, key statement, policy, and trust boundaries; utility arrows and controls follow the same construction. Icons inherit the neutral theme.

- Navigation icons: 18–20px.
- Feature illustrations: 24px icons inside purposeful diagrams, not oversized decorative badges.
- Stroke: 1.5px on the 24px design grid, consistent within a view.
- Icon-only controls require accessible names and adequate targets.
- Decorative icons use `aria-hidden`.

### Buttons and inputs

Primary button: solid action background and matching action-text token, 44px default minimum height, 16px horizontal padding. Secondary button: surface background and essential boundary. Tertiary action: text with a clear hover/focus state.

Inputs: 44px default height, visible label, optional helper text, and a persistent error message linked to the field. Placeholder text supplements a label; it does not replace it. Password/secret reveal states require explicit interaction and accessible labels.

Console rows may be 48px high. A compact visual control may be smaller, but maintain a comfortable hit area where possible. Nexus targets 44×44px for common touch actions; WCAG 2.2 AA has a different minimum target criterion with exceptions, so do not present 44px as its universal requirement.

### Status badges

| Status | Presentation | Required context |
| --- | --- | --- |
| Accepted under policy | Success color + check icon + text | Policy reference and scope |
| Rejected | Danger color + clear label | Safe reason code/explanation |
| Expired | Warning color + clock | Expiry time and relevant contract |
| Not evaluated | Neutral muted label | Check not performed |
| Unavailable | Neutral label + optional help | Missing capability or evidence |
| Error | Danger or warning according to impact | Operation failed; not an evaluation verdict |
| Simulated | Persistent neutral/blue outlined label | Synthetic source; never a real verification claim |

Do not use green for an unknown state. Do not merge “rejected by policy” with “server unavailable.” Status must remain understandable in grayscale.

## 8. Public page composition

### 8.1 Navigation

Desktop: wordmark at left; Product, Developers, Security, Company in the center or following the wordmark; access CTA at right. Add Sign in only when a genuine auth route is available. A demo link must say Demo.

A sticky header is acceptable if it does not obscure focused controls or anchor destinations. Mobile menu opens with a named button, traps focus only when modal, closes on Escape, and restores focus to the trigger.

### 8.2 Hero

Use a spacious left-aligned headline and a wide product illustration beneath the copy and actions. The illustration has original Nexus navigation, interactive synthetic evidence, and a scope panel; simplify the panels on narrow screens while retaining the simulation label and evidence controls. Keep primary content visible without forcing a full-height viewport section.

The illustration should show the relationship between application evidence, policy checks, and a scoped server decision. An interactive sample may switch between fresh, expired, and rejected synthetic scenarios. Label it “Illustrative demo” and show meaningful changes in evidence rows, not random animated counters.

Do not depict a green human icon as the automatic output of a cryptographic signature check. Do not animate fake camera scans.

### 8.3 Product and architecture

Use a compact SVG or HTML diagram with meaningful labels and an accessible text equivalent. Show the application/SDK boundary, server verification boundary, and where policy is applied. Do not draw a trusted path from the physical sensor unless that path is actually established.

Follow the diagram with concrete capability sections. Each section should include a user problem, what Nexus contributes, and a relevant limitation or prerequisite. Put evidence details close to the claim instead of hiding them in a footer disclaimer.

### 8.4 Proof and credibility

Use actual project milestones, public source links, and supported test summaries. If using the Wreck IT award, verify wording/date against the official source and style it as an award rather than a customer logo strip.

Do not insert generic “99.9%,” millions-of-requests metrics, Fortune 500 logos, or anonymous testimonials as visual filler. If there is no measured metric, use an explanatory diagram or real product screenshot.

### 8.5 Developers, security, and company

Developers: clear platform support table, integration steps, versioned links, and verified code examples. Code blocks need a language label, copy feedback, and horizontal scrolling within the block on narrow screens.

Security: organize by trust boundary, evidence handling, deployment scope, and reporting contact. Use explicit statements about current capabilities instead of vague compliance seals.

Company: explain the team's motivation and actual achievements. Publish personal information only when approved. Keep founder biographies concise and relevant.

### 8.6 Footer

Group product, developers, company, and legal links. Every displayed destination must exist or point to an approved external resource. Avoid placeholder social links and unapproved legal assurances. Include copyright naming only after the correct entity/brand is confirmed.

## 9. Console composition and workflows

### 9.1 Persistent shell

Sidebar: Overview, Requests, Enrollments, Policies, Integrations, Audit log, Settings. Hide or explicitly disable unavailable connected capabilities. Do not make an unavailable page look like an empty account.

Top bar: workspace context, environment label, optional time range where relevant, and account menu. Keep “Simulated data” visible in demo. Avoid broad search until there is a real search capability.

Do not show staging and production as identical subtle chips. Their text, explanatory copy, and available actions must make the distinction clear.

### 9.2 Overview

Prioritize an onboarding checklist until a real request exists. Afterwards show a compact summary and recent requests. Use at most four genuinely useful top-level metrics. Every metric needs units, time range, and source context.

Show trends only when data is available. An empty chart says “No requests in this range.” A failed query says “Unable to load requests.” Neither should draw a flat zero line implying successful measurement.

### 9.3 Requests table and detail

Desktop table columns: time, request ID, decision, reason, environment, policy revision when available. Keep numeric values and timestamps aligned. Use stable sorting, pagination, and a result count if the backend supports a reliable count.

Mobile: retain the most useful fields in a compact list or intentionally scrollable table with clear labels. Do not shrink all columns to unreadable text or make the entire page scroll horizontally.

Detail structure:

1. Request identity, environment, timestamp, and scoped decision.
2. An evidence summary explaining coverage and unknowns.
3. Evidence rows with check, evaluation, origin, scope, and observation/expiry times.
4. Related enrollment and policy references.
5. Actual event timeline and safe diagnostic information.

Provide a full detail page as the durable destination. A side drawer is optional for quick inspection and must have a shareable full-page link, keyboard handling, and correct focus restoration.

Long identifiers may be shortened visually while retaining a copy control for their full safe value. Do not assume digests or identifiers are harmless to expose publicly; follow access control and redaction rules.

Request comparison is available from the request list and detail. Show two explicitly identified synthetic requests side by side on desktop and in paired blocks on narrow screens. Match evidence by check identity; retain unknown values, missing observations, metrics, source, scope, and expiry. Different details do not imply a better decision or security equivalence. Selection, side order, and the differences filter use the URL. Invalid pairs have an explicit recovery state. Keep the shared motion/reduced-motion behavior and persistent simulation label.

### 9.4 Policies and consequential actions

Default to read-only policy views until real management support exists. A future policy change flow is: edit draft → compare with active version → review scope and conflicts → confirm → await backend result → show updated version and audit reference.

Do not update the active policy optimistically before backend success. If an operation times out after submission, show an uncertain/pending state and reconcile using the documented operation identifier. Do not invite blind repeated clicks.

Revocation confirmation must describe the exact affected enrollment and the known lease behavior. Do not promise that all previously issued offline evidence disappears immediately.

## 10. State design

| State | Display | Behavior |
| --- | --- | --- |
| Loading | Stable skeleton matching the final layout | No fabricated metric values; preserve headings |
| Empty | Specific reason and useful next step | Distinguish first run from filtered empty results |
| Permission denied | Concise access explanation | No leaking names/details of another tenant |
| Session expired | Clear sign-in recovery | Preserve only safe return location |
| Upstream error | Error message, correlation ID if safe, retry | No fallback to synthetic data |
| Stale data | Last successful update and stale badge | Do not present old information as current |
| Unsupported capability | Neutral explanation and available alternative | Do not imply a completed check |
| Mutation pending | Disabled duplicate action and progress | Do not show success before confirmation |
| Mutation conflict | Explain that state changed | Offer reload/compare; do not silently overwrite |

Use polite live regions for status updates; assertive announcements only for urgent, relevant errors. Avoid repeated screen-reader announcements during polling. Preserve focus and scroll position when refreshing rows.

## 11. Motion specification

Motion clarifies change; it must not delay access to information.

| Token | Duration | Use |
| --- | --- | --- |
| `--motion-fast` | 120ms | Button hover, small color transitions |
| `--motion-standard` | 180ms | Tabs, selection, popovers |
| `--motion-panel` | 240ms | Drawer/dialog entry where appropriate |
| `--motion-reveal` | 320ms | Optional one-time section reveal |
| `--motion-arrive` | 560ms | One-time translated viewport entry; text stays fully opaque |
| `--motion-route` | 280ms | Lateral page crossfade |
| `--motion-stagger` | 55ms | Entry spacing between related elements, capped at three steps |
| `--motion-signal` | 850ms | One-time illustrative path drawing, tracked with the entry animations |

Default easing: `cubic-bezier(0.2, 0, 0, 1)`. Use opacity and small translation, generally 4–12px. Avoid animating layout dimensions on dense tables. A section reveal must not leave meaningful content inaccessible if JavaScript fails.

Use CSS for hover and simple transitions. Add Motion only for interactions needing coordination. Respect `prefers-reduced-motion` in CSS and Motion configuration; remove nonessential movement and auto-play. Do not use particles, infinite scanning loops, cursor-following glows, auto-scrolling logo strips, or parallax as default decoration.

The current implementation uses React View Transitions for page changes and a shared scenario-selection indicator, CSS for hover/press/menu feedback, and one IntersectionObserver with the Web Animations API for viewport entries. A thin reading-progress line follows native scrolling, using a CSS scroll timeline with a passive frame-scheduled fallback. Same-page anchor navigation updates the URL, respects the header offset, and focuses the destination. Content remains visible without JavaScript; reduced motion cancels active entry animations and disables nonessential movement. See the [interaction decision](./docs/decisions/2026-10-27-motion-and-icons.md).

Charts should not continually animate incoming data. Pause decorative work when not visible. Never make a rejected/accepted decision wait for a theatrical animation.

The homepage product illustration is a four-page Nexus playbook: request inspection,
evidence flow, integration guide, and trust boundaries. Offset, subtly rotated panels
remain visible behind the active page. Mouse drag, touch swipe, chapter buttons,
previous/next controls, and focused arrow/Home/End keys select the page. Vertical
touch scrolling remains native. Inactive pages are inert and hidden from assistive
technology; each active page retains its simulation label and a real destination.
CSS transforms provide the stack motion, with immediate changes under reduced motion.

## 12. Accessibility and responsive requirements

- Include skip navigation, semantic landmarks, an ordered heading hierarchy, and visible keyboard focus.
- Associate input errors and help text programmatically; do not rely on red borders alone.
- Dialogs need correct focus entry, containment when modal, Escape behavior, and focus restoration.
- Tables need headers and accessible sorting controls. Charts need an accessible textual summary or data table.
- Ensure 200% text zoom and reflow at the equivalent of 320 CSS pixels without loss of essential functionality. Two-dimensional tables/code may scroll within their region.
- Test at approximately 360, 390, 768, 1024, and 1440px widths; use content needs rather than device names to set breakpoints.
- Do not obscure focus with sticky bars. Respect safe areas on mobile where relevant.
- Touch, keyboard, and pointer users must reach the same critical actions. Hover cannot be the only way to reveal required information.

Automated accessibility tools assist but do not replace keyboard, zoom, contrast, and screen-reader spot checks.

## 13. Charts, diagrams, and screenshots

Use charts when a time series, composition, or comparison helps an actual decision. Prefer request volume over time, decision distribution, or latency distribution with clearly defined units and sources. A fixed sample dataset must carry a simulation label.

Differentiate series with labels and line styles where possible. Do not hide important information in hover-only tooltips. Dates must specify or inherit a visible timezone; client formatting must not change the underlying event ordering.

Use code-native SVG/HTML for precise architecture diagrams. Keep text selectable or provide equivalent descriptions. Do not use generated raster art to depict exact security relationships or numerical evidence.

Screenshot assets must use synthetic or explicitly approved data. Label product mockups. Capture real UI once available instead of maintaining a misleading image of nonexistent functionality.

## 14. Performance and implementation guidance

- Render public content on the server; make above-the-fold explanation usable before interactive code loads.
- Use explicit image dimensions and responsive sizes. Prefer efficient image formats for raster assets; use SVG for simple diagrams.
- Avoid autoplay video in the hero. A video may be user-initiated with poster, controls, and accessible alternatives.
- Load only necessary font weights and components. Lazy-load noncritical charts and advanced editors.
- Start with a proposed first-load first-party JavaScript budget of 200 KiB compressed per main route, measured consistently. Record a justified exception if framework or product requirements exceed it; this is a planning budget, not an observed result.
- Target the PRD Core Web Vitals thresholds. Report measurement method, page, device/network assumptions, and whether values are lab or field data.
- Avoid visual redesigns that introduce layout shift during font loading, skeleton replacement, or late banners.

## 15. Design acceptance checklist

| Check | Related PRD criteria |
| --- | --- |
| Hero explains the product; each CTA has a real destination | P01, P02 |
| Demo labeling persists through navigation, detail, and copied content | P03 |
| Evidence status, origin, scope, and unknowns are distinguishable | P04, P14 |
| Long names, empty data, denied access, timeouts, and stale states render correctly | P07, P13 |
| Keyboard, mobile, zoom, reduced motion, contrast, and focus pass review | P08 |
| Unsupported management features do not appear operational | P09, P11 |
| Request-access confirmation reflects actual acceptance | P10 |
| Staging/production and web/SDK readiness are not conflated | P12 |

For each major screen, inspect desktop and mobile screenshots plus relevant loading/error states. For the console, inspect both themes. For changed interactions, verify actual behavior in a browser, not just static screenshots. A visually polished screen with false data semantics fails design acceptance.

## 16. Primary technical references

- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js font optimization](https://nextjs.org/docs/app/getting-started/fonts)
- [Geist font family](https://vercel.com/font)
- [Lucide React](https://lucide.dev/guide/react)
- [shadcn/ui documentation](https://ui.shadcn.com/docs)
- [Motion reduced-motion support](https://motion.dev/docs/react-use-reduced-motion)
- [WCAG contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Core Web Vitals](https://web.dev/articles/vitals)
- [Official Wreck IT achievement reference](https://informatika.uin-malang.ac.id/id/1st-winner-hackathon-wreck-it-7-0/)

Check current versions and actual asset licenses during implementation. These links support design and engineering choices; they are not endorsements of Nexus.
