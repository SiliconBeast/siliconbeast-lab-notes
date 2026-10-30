import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { C, FONT, Pen, DRAW_CSS, useDrawOn } from "./ink.tsx"

// Awards as hand-drawn objects on a shelf: a trophy for a win, a medal for a placing, a framed
// certificate, a scholarship scroll, a hardware parcel, a ribbon rosette. One award per line:
//   object | Title | Who gave it | year or note
// Objects: trophy, medal, medal1, certificate, scroll, parcel, rosette. They draw themselves in on
// scroll like the other figures; on narrow screens the shelf scrolls sideways.

const CSS = `
.aw-wrap { container-type: inline-size; }
.aw-head { margin: 0 0 6px; font: 500 11px/1.2 ${FONT.mono}; letter-spacing: .14em; text-transform: uppercase; color: ${C.print}; }
.aw { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; row-gap: 18px; }
.aw li { flex: 1 1 0; min-width: 96px; max-width: 150px; display: grid; justify-items: center; align-content: start; text-align: center; }
.aw-obj { width: 66px; height: 66px; transition: transform .35s cubic-bezier(.3,.7,.3,1.4); transform-origin: 50% 100%; }
.aw li:hover .aw-obj { transform: translateY(-5px) rotate(-4deg); }
.aw-plank { display: block; width: 100%; height: 12px; margin-top: -2px; }
.aw-title { padding: 0 6px; margin-top: 8px; font-family: ${FONT.hand}; font-size: 15px; line-height: 1.2; color: ${C.inkk}; }
.aw-org { padding: 0 6px; margin-top: 3px; font: 500 9.5px/1.3 ${FONT.mono}; letter-spacing: .08em; text-transform: uppercase; color: ${C.print}; }
@container (max-width: 560px) {
  .aw { flex-wrap: nowrap; justify-content: flex-start; overflow-x: auto; scroll-snap-type: x proximity; padding-bottom: 6px; }
  .aw li { flex: 0 0 116px; max-width: none; scroll-snap-align: start; }
}
@media (prefers-reduced-motion: reduce) { .aw-obj { transition: none; } }
`

type Draw = (p: Pen, fills: React.ReactNode[], key: string) => void

const fill = (fills: React.ReactNode[], key: string, d: string, color: string) =>
    fills.push(<path key={key + fills.length} d={d} style={{ fill: color }} />)

const star = (cx: number, cy: number, r: number) => {
    let d = ""
    for (let i = 0; i < 10; i++) {
        const a = (i * Math.PI) / 5 - Math.PI / 2
        const rr = i % 2 ? r * 0.45 : r
        d += `${i ? "L" : "M"}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`
    }
    return d + "Z"
}

const OBJECTS: Record<string, Draw> = {
    trophy: (p, fills, k) => {
        const cup = "M16 8 H48 V20 C48 33 41 40 32 40 C23 40 16 33 16 20 Z"
        fill(fills, k, cup, C.hl)
        fill(fills, k, "M20 50 H44 V56 H20 Z M16 56 H48 V63 H16 Z", C.hl)
        p.raw(cup, { stroke: C.ink, sw: 1.5, seed: 3 })
        p.raw("M16 12 C6 12 6 27 19 29 M48 12 C58 12 58 27 45 29", { stroke: C.ink, sw: 1.3, seed: 4 })
        p.raw("M29 40 V50 M35 40 V50", { stroke: C.ink, sw: 1.3, seed: 5 })
        p.rect(20, 50, 24, 6, { stroke: C.ink, sw: 1.3, rough: 0.5, seed: 6 })
        p.rect(16, 56, 32, 7, { stroke: C.ink, sw: 1.3, rough: 0.5, seed: 7 })
        p.raw(star(32, 21, 6), { stroke: C.ink, sw: 1.1, seed: 8 })
    },
    medal: (p, fills, k) => {
        fill(fills, k, "M18 2 H28 L36 27 H27 Z", C.hlB)
        fill(fills, k, "M46 2 H36 L28 27 H37 Z", C.hlP)
        p.raw("M18 2 H28 L36 27 M46 2 H36 L28 27", { stroke: C.ink, sw: 1.3, seed: 3 })
        p.ellipse(32, 44, 32, 32, { stroke: C.ink, sw: 1.5, fill: C.hl, seed: 4 })
        p.ellipse(32, 44, 22, 22, { stroke: C.ink, sw: 1, seed: 5 })
        p.raw(star(32, 44, 7), { stroke: C.ink, sw: 1.1, seed: 6 })
    },
    medal1: (p, fills, k) => {
        OBJECTS.medal(p, fills, k)
        p.els.pop()
        p.els.pop()
        p.text(32, 50, "1st", { size: 13, fill: C.ink, font: FONT.scrawl, weight: 700 })
    },
    certificate: (p, fills, k) => {
        p.raw("M24 62 L29 44 M40 62 L35 44 M32 64 V46", { stroke: C.pencil, sw: 1.3, seed: 3 })
        fill(fills, k, "M9 6 H55 V46 H9 Z", C.card)
        p.rect(9, 6, 46, 40, { stroke: C.ink, sw: 1.6, rough: 0.7, seed: 4 })
        p.rect(13, 10, 38, 32, { stroke: C.ink, sw: 0.9, rough: 0.5, seed: 5 })
        p.line(19, 18, 45, 18, { stroke: C.ink, sw: 1.4, rough: 0.4, seed: 6 })
        p.line(19, 25, 41, 25, { stroke: C.pencil, sw: 1, rough: 0.4, seed: 7 })
        p.line(19, 31, 37, 31, { stroke: C.pencil, sw: 1, rough: 0.4, seed: 8 })
        p.ellipse(44, 36, 10, 10, { stroke: C.ink, sw: 1.1, fill: C.hl, seed: 9 })
    },
    scroll: (p, fills, k) => {
        fill(fills, k, "M10 24 H54 V46 H10 Z", C.card)
        p.rect(10, 24, 44, 22, { stroke: C.ink, sw: 1.5, rough: 0.6, seed: 3 })
        p.ellipse(10, 35, 8, 24, { stroke: C.ink, sw: 1.4, fill: C.card, seed: 4 })
        p.ellipse(54, 35, 8, 24, { stroke: C.ink, sw: 1.4, fill: C.card, seed: 5 })
        p.line(18, 31, 44, 31, { stroke: C.pencil, sw: 1, rough: 0.4, seed: 6 })
        p.line(18, 37, 38, 37, { stroke: C.pencil, sw: 1, rough: 0.4, seed: 7 })
        fill(fills, k, "M36 46 L32 62 L37 58 L41 62 L42 46 Z", C.hlP)
        p.raw("M36 46 L32 62 L37 58 L41 62 L42 46", { stroke: C.ink, sw: 1.1, seed: 8 })
        p.ellipse(39, 46, 12, 12, { stroke: C.ink, sw: 1.2, fill: C.hlP, seed: 9 })
    },
    parcel: (p, fills, k) => {
        fill(fills, k, "M10 28 H44 V62 H10 Z", C.hlO)
        fill(fills, k, "M10 28 L20 17 H54 L44 28 Z", C.hl)
        fill(fills, k, "M44 28 L54 17 V51 L44 62 Z", C.hlO)
        p.raw("M10 28 H44 V62 H10 Z M10 28 L20 17 H54 L44 28 M54 17 V51 L44 62", { stroke: C.ink, sw: 1.5, seed: 3 })
        p.raw("M27 28 V62 M27 28 L37 17", { stroke: C.ink, sw: 2.4, seed: 4, opacity: 0.55 })
        p.text(18, 52, "↑↑", { size: 10, fill: C.ink, font: FONT.mono })
    },
    rosette: (p, fills, k) => {
        fill(fills, k, "M26 34 L19 63 L26 58 L31 63 L32 36 Z", C.hlB)
        fill(fills, k, "M38 34 L45 63 L38 58 L33 63 L32 36 Z", C.hlB)
        p.raw("M26 34 L19 63 L26 58 L31 63 L32 36 M38 34 L45 63 L38 58 L33 63 L32 36", { stroke: C.ink, sw: 1.1, seed: 3 })
        let d = ""
        for (let i = 0; i < 24; i++) {
            const a = (i * Math.PI) / 12
            const r = i % 2 ? 15 : 19
            d += `${i ? "L" : "M"}${(32 + Math.cos(a) * r).toFixed(1)} ${(24 + Math.sin(a) * r).toFixed(1)}`
        }
        fill(fills, k, d + "Z", C.hlG)
        p.raw(d + "Z", { stroke: C.ink, sw: 1.2, seed: 4 })
        p.ellipse(32, 24, 16, 16, { stroke: C.ink, sw: 1.1, fill: C.card, seed: 5 })
        p.raw(star(32, 24, 5), { stroke: C.ink, sw: 1, seed: 6 })
    },
}

type Award = { object: string; title: string; org: string; note: string }

function parse(data: string): Award[] {
    return (data || "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
            const [object = "trophy", title = "", org = "", note = ""] = l.split("|").map((s) => s.trim())
            return { object: object.toLowerCase(), title, org, note }
        })
}

function Item({ a, i }: { a: Award; i: number }) {
    const p = new Pen()
    const fills: React.ReactNode[] = []
    ;(OBJECTS[a.object] || OBJECTS.trophy)(p, fills, "f" + i)
    const plank = new Pen()
    plank.line(0, 4, 120, 4, { stroke: C.ink, sw: 1.6, rough: 0.5, seed: 30 + i })
    plank.line(0, 9, 120, 9, { stroke: C.pencil, sw: 1, rough: 0.4, seed: 40 + i })
    return (
        <li>
            <svg className="aw-obj" viewBox="0 0 64 66" aria-hidden="true" style={{ overflow: "visible" }}>
                {fills}
                {p.els}
            </svg>
            <svg className="aw-plank" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true">
                {plank.els}
            </svg>
            <div className="aw-title">{a.title}</div>
            <div className="aw-org">{[a.org, a.note].filter(Boolean).join(" · ")}</div>
        </li>
    )
}

interface Props {
    data: string
    heading: string
    animate: boolean
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function AwardsShelf({ data, heading, animate, style }: Props) {
    const ref = React.useRef<HTMLDivElement>(null)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const draw = useDrawOn(ref, animate !== false && !isCanvas)
    const awards = parse(data)
    return (
        <div ref={ref} className={`aw-wrap${draw === "idle" ? "" : ` sk-${draw}`}`} style={{ ...style }}>
            <style>{CSS + DRAW_CSS}</style>
            {heading && <h3 className="aw-head">{heading}</h3>}
            <ul className="aw" aria-label={heading || "Awards"}>
                {awards.map((a, i) => (
                    <Item key={i} a={a} i={i} />
                ))}
            </ul>
        </div>
    )
}

addPropertyControls(AwardsShelf, {
    data: {
        type: ControlType.String,
        title: "Awards",
        displayTextArea: true,
        defaultValue: "trophy | Outstanding Innovation Award | UASU | 2026",
        description: "object | Title | Who gave it | year or note. Objects: trophy, medal, medal1, certificate, scroll, parcel, rosette",
    },
    heading: { type: ControlType.String, title: "Heading", defaultValue: "Awards & recognition" },
    animate: { type: ControlType.Boolean, title: "Draw on", defaultValue: true },
})
