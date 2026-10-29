import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, FONT, Pen } from "./ink.tsx"

// Small hand-drawn marks: the University of Alberta shield (a generic sketch, not the
// official crest), the SiliconBeast chip, a pencil arrow, a pushpin and a paper clip.

const MARKS: Record<string, { vb: [number, number]; draw: (p: Pen) => void; label: string }> = {
    ua: {
        vb: [100, 112],
        label: "Hand-drawn University of Alberta shield",
        draw: (p) => {
            const g = C.ua
            p.raw("M10 8 L90 8 L90 50 C90 78 72 94 50 104 C28 94 10 78 10 50 Z", { stroke: g, sw: 1.8 })
            p.raw("M17 15 L83 15 L83 50 C83 74 68 87 50 96 C32 87 17 74 17 50 Z", { stroke: g, sw: 0.9 })
            p.rect(18, 40, 64, 22, { stroke: "none", fill: C.uaGold, gap: 3, fw: 2.2, seed: 14 })
            p.curve([[30, 30], [40, 25], [50, 30]], { stroke: g, sw: 1.2, seed: 15 })
            p.curve([[50, 30], [60, 25], [70, 30]], { stroke: g, sw: 1.2, seed: 16 })
            p.line(50, 30, 50, 22, { stroke: g, sw: 1, rough: 0.4, seed: 17 })
            p.text(50, 58, "U of A", { size: 15, fill: g })
            p.text(50, 82, "1908", { size: 9, fill: g, font: FONT.mono })
        },
    },
    telus: {
        vb: [132, 46],
        label: "TELUS (hand-drawn)",
        draw: (p) => {
            const purple = "#7B4FB8"
            const green = "#3E9E45"
            // leaf sprig
            p.curve([[8, 40], [12, 28], [20, 16], [30, 8]], { stroke: green, sw: 1.6, seed: 31 })
            p.raw("M14 30 C8 26 6 18 10 12 C16 16 18 24 14 30 Z", { stroke: green, sw: 1.2, fill: "none" })
            p.raw("M21 20 C20 12 25 5 32 4 C33 11 28 18 21 20 Z", { stroke: green, sw: 1.2, fill: "none" })
            p.rect(9, 13, 6, 14, { stroke: "none", fill: green, gap: 2.4, fw: 1, seed: 33 })
            p.text(84, 34, "TELUS", { size: 27, fill: purple, font: FONT.hand, weight: 700 })
            p.curve([[42, 41], [70, 43], [100, 40], [128, 42]], { stroke: purple, sw: 1.3, seed: 34 })
        },
    },
    chip: {
        vb: [120, 60],
        label: "SiliconBeast chip mark",
        draw: (p) => {
            const w = C.coverLabel
            p.rect(40, 8, 40, 40, { stroke: w, sw: 1.8, rough: 0.8, seed: 2 })
            for (let i = 0; i < 4; i++) {
                const y = 14 + i * 9
                p.line(30, y, 40, y, { stroke: w, sw: 1.2, rough: 0.5, seed: 10 + i })
                p.line(80, y, 90, y, { stroke: w, sw: 1.2, rough: 0.5, seed: 20 + i })
            }
            p.text(60, 33, "SB", { size: 12, fill: w, font: FONT.mono })
        },
    },
    chipInk: {
        vb: [120, 60],
        label: "SiliconBeast chip mark",
        draw: (p) => {
            const w = C.ink
            p.rect(40, 8, 40, 40, { stroke: w, sw: 1.8, rough: 0.8, seed: 2 })
            for (let i = 0; i < 4; i++) {
                const y = 14 + i * 9
                p.line(30, y, 40, y, { stroke: w, sw: 1.2, rough: 0.5, seed: 10 + i })
                p.line(80, y, 90, y, { stroke: w, sw: 1.2, rough: 0.5, seed: 20 + i })
            }
            p.text(60, 33, "SB", { size: 12, fill: w, font: FONT.mono })
        },
    },
    arrowUp: {
        vb: [46, 26],
        label: "",
        draw: (p) => {
            const c = C.pencil
            p.curve([[44, 22], [26, 22], [10, 12], [6, 2]], { stroke: c, sw: 1.4, seed: 3 })
            p.lines([[1, 9], [6, 2], [12, 7]], { stroke: c, sw: 1.4, rough: 0.4, seed: 4 })
        },
    },
    arrowRight: {
        vb: [60, 24],
        label: "",
        draw: (p) => {
            const c = C.pencil
            p.curve([[2, 16], [20, 8], [40, 12], [56, 10]], { stroke: c, sw: 1.4, seed: 5 })
            p.lines([[49, 4], [56, 10], [49, 16]], { stroke: c, sw: 1.4, rough: 0.4, seed: 6 })
        },
    },
    check: {
        vb: [30, 26],
        label: "",
        draw: (p) => p.lines([[3, 14], [11, 22], [28, 2]], { stroke: C.green, sw: 2.4, rough: 1.2, seed: 9 }),
    },
}

interface Props {
    mark: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Mark({ mark, style }: Props) {
    const m = MARKS[mark] ?? MARKS.ua
    const p = new Pen()
    m.draw(p)
    return (
        <div style={{ ...style }}>
            <svg
                viewBox={`0 0 ${m.vb[0]} ${m.vb[1]}`}
                role={m.label ? "img" : undefined}
                aria-label={m.label || undefined}
                aria-hidden={m.label ? undefined : true}
                style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}
            >
                {p.els}
            </svg>
        </div>
    )
}

addPropertyControls(Mark, {
    mark: {
        type: ControlType.Enum,
        title: "Mark",
        options: ["ua", "telus", "chip", "chipInk", "arrowUp", "arrowRight", "check"],
        optionTitles: ["UofA shield", "TELUS (sketch)", "Chip (light)", "Chip (ink)", "Arrow up-left", "Arrow right", "Check"],
        defaultValue: "ua",
    },
})
