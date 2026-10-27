# Motion and original Nexus icons

The owner approved the neutral design and requested animation for clicking,
scrolling, and a more distinctive icon family. This supersedes the initial
Lucide presentation while retaining the approved palette and product content.

| Interaction | Behavior |
| --- | --- |
| Public route navigation, including demo | Short lateral crossfade; header/footer stay anchored |
| Demo scenario selection | Shared selection indicator moves between buttons; current decision updates without a staged delay |
| Native scrolling | One-time translated entries, short stagger, and reading-progress line |
| Same-page anchor | Smooth native scroll, real hash/history entry, focused destination below the header |
| Hover, press, focus, mobile menu | Small control/icon responses, layered diagram hover, menu entry |

The audit found static public routes and local scenario state, without async
data/Suspense, sortable lists, or list-to-detail navigation. Route fades express
lateral navigation; the selection indicator is the shared visual element. No
directional page hierarchy or loading state is invented.

Use the installed React 19.3 / Next.js 16.4.3 ViewTransition APIs, one client
observer, native scrolling, and CSS. No animation package or new dependency is
added. Entry animations keep text opaque and content visible by default. Focused
controls cancel their entry motion. Reduced motion also cancels active Web
Animations; unsupported view-transition browsers and no-JavaScript navigation
retain working content and controls.

Original SVG glyphs use a 24px grid, 1.5px strokes, quiet secondary fills, and
the neutral semantic palette. They replace UI icon imports across all routes.
No live verification, access delivery, or management capability is introduced.

Local verification on 2026-10-27: lint, type checking, and production build
passed. All 17 Chrome browser tests passed in 21.9 seconds, including actual
route animations, native scroll, hash/history/focus, active-animation
cancellation, unsupported View Transitions, the existing demo/form flows,
keyboard, mobile, no-JavaScript navigation, and automated accessibility.
Desktop/mobile interaction screenshots were inspected, including moving
scenario controls; labels are isolated above the traveling indicator.

The initial homepage script files totaled 182.2 KiB when gzipped locally from
the production output referenced by the page (Chrome at 390px). This excludes
CSS, fonts, later prefetches, and response overhead; it is a build-artifact
budget check rather than a field performance or frame-rate measurement.

Hydration follow-up: a root effect can run before streamed page siblings finish
hydrating. Reveal bookkeeping now uses a WeakSet instead of adding attributes
to page elements. Header scroll state is rendered by its own hydrated component;
progress fallback styles stay on that component. Anchor focusability is declared
in server markup. Signal strokes use tracked Web Animations instead of a
DOM-marker-driven CSS animation. No hydration-warning suppression is used.
The slow-hydration regression test detected the three hero attribute mutations
in the previous build and passes with this fix. The updated production suite
passed all 18 browser tests in 24.3 seconds, alongside lint, types, and build.
