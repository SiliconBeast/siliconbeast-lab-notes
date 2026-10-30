# SiliconBeast Lab Notes

The source behind my portfolio site: a computer engineering portfolio laid out as a lab notebook.
The site is built in [Framer](https://www.framer.com). This repo holds the parts written as code,
which is everything hand-drawn or animated, plus the project write-ups.

## What's here

| Path | What it is |
| --- | --- |
| `framer/Lab/` | The Framer code components, written in React and TypeScript |
| `content/projects.json` | The project write-ups from the site's CMS |
| `content/experience.txt` | The experience list, in the format `ExperienceList.tsx` reads |
| `preview/notebook-opening.html` | A standalone page that plays the notebook-cover opening, with a picker for all five cover styles |

### Components

- **ink.tsx / pencil.tsx**: the shared palette, fonts and a seeded "rough pen" that draws wobbly SVG lines, so every figure looks hand-drawn. Figures draw themselves on as they scroll into view.
- **Sketch.tsx**: the hand-drawn charts and system diagrams on each project page, plus the experience timeline (four lanes: work, leadership, EcoCar, next co-op).
- **ExperienceList.tsx**: the experience section as a grouped, scannable list, with highlighter marks that sweep across the key numbers as it scrolls into view.
- **NotebookOpening.tsx**: the closed notebook the site opens on. It swings open on its spine in 3D and zooms into page one. There are five covers (kraft, leather-bound, composition, lab notebook, blueprint), all drawn with CSS and SVG noise, so no images load. (covers.tsx is the earlier standalone copy of the cover designs; the component now carries them itself.)
- **ThemeToggle.tsx**: switches between light paper and the dark blueprint theme. It also sets the chip favicon and runs the seasonal Halloween decorations (Oct 20 to Nov 1). An ink circle spreads out from the button, then a scan line or a lamp flicker plays.
- **Signature.tsx**: draws a signature stroke by stroke, timed to how it was actually written.
- **Interests.tsx, NowList.tsx, SkillsIndex.tsx, Calc.tsx, Mark.tsx**: the hobbies board, the "doing right now" list, the skills index, the worked-calculation margin notes and small hand-drawn logos.
- **AwardsShelf.tsx**: awards as hand-drawn objects on a shelf (trophies, a medal, a certificate, a scroll, a parcel, a rosette) that draw themselves in.
- **Halloween.tsx**: the standalone version of the seasonal decorations. The live site runs the same code from ThemeToggle.tsx, because Framer's build left this component out.
- **BackToTop.tsx**: a small paper "↑ top" tab that slides in once you scroll down.
- **icons.ts**: tech logo paths from [Simple Icons](https://simpleicons.org) (CC0).

These files are made for Framer: they import from `"framer"` and use Framer's colour tokens, so they don't run as a standalone app.

## Copyright

© 2026 Suvir Duggal. All rights reserved. This code and content are shared to view only,
not to reuse. See [LICENSE](LICENSE) for details and the one exception (the Simple Icons path data).
