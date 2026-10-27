# Marketing design direction

The owner requested a redesign as close as practical to Linear on 27 October
2026. This explicitly supersedes DESIGN.md's light marketing default, blue
action palette, and two-column homepage hero for this implementation.

The owner's follow-up explicitly rejects violet and asks for neutral gray and a
closer match to Linear. Use a near-black canvas, neutral layered surfaces,
Inter Variable, white/gray actions, compact navigation, and a wide original
Nexus interface illustration below the hero. Share these semantic tokens across
all existing public pages, the synthetic walkthrough, favicon, and social card.
Keep accessible contrast, responsive reflow, reduced motion, and evidence
semantics. Status labels and icons remain distinct in the monochrome palette.

Direct browser measurements of [Linear](https://linear.app/) on 2026-10-27:

| Property | 1440px viewport | 390px viewport |
| --- | --- | --- |
| Font | Inter Variable, weight 510 for headings | Same |
| Hero text | 64px / 64px, tracking -1.408px | 38px / 41.8px, tracking -0.836px |
| Header | 72px content height | 64px content height |
| Horizontal text offset | 80px | 24px |
| Canvas / primary text | `#08090A` / `#F7F8F8` | Same |
| Secondary text / inverse action | `#8A8F98` / `#E5E5E6` | Same |

These measurements replace estimates from the initial revision. The primary
heading and preview use the measured desktop scale/alignment; Nexus content
length and its functional evidence illustration determine remaining wrapping
and component heights. This is not a claim of identical pixels across products.
Inter is independently obtained from its official open-source distribution;
see the asset/license record. Geist Mono remains for identifiers.

Linear is a visual reference only. No Linear source, logos, screenshots, copy,
customer claims, or other product assets ship in Nexus. The homepage interface
remains an explicitly labeled illustration, not a claim of a connected console.
The access form still downloads a local draft; intake remains unavailable.

Relevant acceptance criteria: P01 (navigation), P03 (simulation labels), P08
(keyboard, reflow, reduced motion), and P12 (preview/staging status).

Local validation: lint, type checking, and production build passed. All 13
existing Chrome browser tests passed, including seven routes at six viewport
widths, automated accessibility, keyboard navigation, reduced motion, text
scaling, no-JavaScript navigation, scenario/reset behavior, and local draft
downloads. Desktop and mobile screenshots were inspected. No live integration
or deployment was performed.
