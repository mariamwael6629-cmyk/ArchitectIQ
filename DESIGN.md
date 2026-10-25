# Design — ArchitectIQ

**World: the whiteboard.** System design is learnt and tested at a whiteboard: boxes, arrows, four marker colours, and notes in the margin. ArchitectIQ now looks like that room. It has a bright board, ink rules, a marker-sketched architecture in the hero (drawn with a turbulence filter so the lines wobble like a real marker), a highlighter stroke on the key words, and a dotted grid on the builder canvas. The dark navy, neon gradients, Syne and DM Mono, glass panels and grid-line backgrounds are gone.

## Tokens (`architectiq.html` `:root`)

| Token | Value | Role |
|---|---|---|
| `--bg` / `--bg2` / `--bg4` / `--bg5` | `#F7F8F7` / `#FFFFFF` / `#F1F3F1` / `#E6E9E6` | board, panels, wells |
| `--border` / `--border2` | ink at 12% / 26% | rules, card edges |
| `--text` / `--text2` / `--text3` | `#1B1D21` / `#4B5059` / `#6B7079` | text levels |
| `--accent` | `#1F57C3` blue marker | links, active underline, focus |
| `--em` / `--am` / `--rose` / `--violet` / `--cyan` | `#1C7A45` / `#9A6A00` / `#C2352B` / `#7A3E9D` / `#0E6F86` | marker colours for diagram layers and difficulty tags |
| highlighter | `#FFE58A` | selection, "New" badge, emphasised words, selected canvas node |

Diagram layer colours: edge/entry in black, services in green, data stores in blue, streams in red.

### Type
- **Familjen Grotesk** 500–700 for headings (`clamp(40px, 5.4vw, 72px)` hero, tracking −0.035em).
- **Albert Sans** for body (15.5px).
- **JetBrains Mono** only inside code blocks.
- **Caveat** only for the handwriting on the whiteboard sketch and its caption.

### Shape
Radii 6 / 8 / 10px. Cards have a 1.5px ink-tinted border. On hover they gain a small offset shadow, like a sheet lifted off the board.

## Components
- **Icons:** a shared emoji-to-SVG swapper (inline script at the end of the file) redraws interface emoji as line icons, including the ones rendered by JS. Data such as builder node `data-e` attributes is untouched.
- **Nav:** a 2px ink rule underneath; the active link is underlined in blue marker.
- **Buttons:** primary is ink fill and turns blue on hover; secondary is a 2px ink outline that fills on hover.
- **Stats strip:** a ruled row, left-aligned, no cards.
- **Code blocks:** a dark slate panel, the one dark surface.

## Motion
The hero's arrows draw themselves in three beats. Cards stop jumping on hover. Reduced motion is respected.
