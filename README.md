# SiliconBeast Lab Notes

The source behind my portfolio site: a computer engineering portfolio laid out as a lab notebook.
The site is built in [Framer](https://www.framer.com). This repo holds the parts written as code,
which is everything hand-drawn or animated, plus the project write-ups.

## What's here

| Path | What it is |
| --- | --- |
| `framer/Lab/` | The Framer code components, written in React and TypeScript |
| `content/projects.json` | The project write-ups from the site's CMS |
| `preview/notebook-opening.html` | A standalone page that plays the notebook-cover opening, with a picker for all five cover styles |

### Components

- **ink.tsx / pencil.tsx**: the shared palette, fonts and a seeded "rough pen" that draws wobbly SVG lines, so every figure looks hand-drawn. Figures draw themselves on as they scroll into view.
- **Sketch.tsx**: the hand-drawn charts and system diagrams on each project page, plus the experience timeline.
- **NotebookOpening.tsx / covers.tsx**: the closed notebook the site opens on. It swings open on its spine in 3D and zooms into page one. There are five covers (kraft, leather-bound, composition, lab notebook, blueprint), all drawn with CSS and SVG noise, so no images load.
- **ThemeToggle.tsx**: switches between light paper and the dark blueprint theme. An ink circle spreads out from the button, then a scan line or a lamp flicker plays.
- **Signature.tsx**: draws a signature stroke by stroke, timed to how it was actually written.
- **Interests.tsx, NowList.tsx, Stickers.tsx, SkillsIndex.tsx, Calc.tsx, Mark.tsx**: the hobbies board, the "doing right now" list, award stickers, the skills index, the worked-calculation margin notes and small hand-drawn logos.
- **icons.ts**: tech logo paths from [Simple Icons](https://simpleicons.org) (CC0).

These files are made for Framer: they import from `"framer"` and use Framer's colour tokens, so they don't run as a standalone app.
