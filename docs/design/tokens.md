# Tfke design tokens — editorial (makingsoftware.com family)

Reference: makingsoftware.com (Dan Hollick) — paper-white, near-black serif prose,
one electric-blue accent, a pixel display face, mono technical labels, dotted-tick
rules, generous whitespace. No gradients, glass, or glow.

Source of truth: `src/index.css` `@theme`. This file is the human-readable spec.

## Palette
| Token | Value | Use |
|---|---|---|
| bg | `#fbfbf8` | page (warm paper white) |
| surface | `#ffffff` | cards / fields |
| text | `#15161a` | ink (near-black) |
| text-2 | `#5f6066` | secondary prose |
| text-3 | `#9a9ba1` | mono labels / faint |
| border | `rgba(20,21,26,0.12)` | hairlines |
| accent | `#2d4bff` | electric blue (wordmark, links, primary) |
| accent-2 | `#1f38e0` | accent pressed |
| success / error | `#0a8f5b` / `#d23b3b` | states |

## Type
- **Display / wordmark** — `Silkscreen` (pixel), electric blue. Wordmark + hero eyebrow only.
- **Serif** — `Newsreader` (editorial). Headings + prose. Body default.
- **Mono** — `IBM Plex Mono`. Small uppercase labels (`FIG · …`) and payment values.
- **Sans** — system-ui. UI controls (inputs, buttons, nav).

## Primitives (`src/index.css`)
`.wordmark`, `.display`, `.label-mono`, `.mono`, `.rule` (dotted-tick divider),
`.card` (≡ legacy `.glass`, now light), `.btn-primary`, `.btn-ghost`, `.field`.

## Anti-slop removal (done)
indigo→violet gradients, glass/backdrop-blur, blurred glow blobs (`animate-glow-pulse`
disabled), `gradient-text` (now solid blue), per-platform glow shadows, the icon-in-circle
feature grid (replaced with FIG-labelled cards).

## Status
Applied to the live surfaces: Landing, Navbar, and the ephemeral flow (Create /
Success / View). The mock-backed pages (Login, Register, Dashboard, PublicProfile)
inherit the light theme but are finished in Unit 9 when they are rewired to the API
(polishing them now would be wasted — they are being replaced).
