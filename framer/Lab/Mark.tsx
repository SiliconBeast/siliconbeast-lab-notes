import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, FONT, Pen } from "./ink.tsx"

// Small hand-drawn marks: the University of Alberta shield (a generic sketch, not the
// official crest), the SiliconBeast chip, a pencil arrow, a pushpin and a paper clip.

// Small UofA-style shield used at the left of the UAlberta org sketches.
function shield(p: Pen, g: string) {
    p.raw("M5 4 H35 V20 C35 31 28 38 20 42 C12 38 5 31 5 20 Z", { stroke: g, sw: 1.6 })
    p.rect(6, 16, 28, 9, { stroke: "none", fill: C.uaGold, gap: 2.4, fw: 1.6, seed: 40 })
    p.text(20, 35, "UA", { size: 9, fill: g, font: FONT.mono, weight: 700 })
}

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
    // Org sketches for the experience list. Pencil impressions with the name lettered in,
    // not the organisations' real logos.
    ualberta: {
        vb: [132, 46],
        label: "University of Alberta (hand-drawn)",
        draw: (p) => {
            const g = C.ua
            shield(p, g)
            p.text(84, 31, "UAlberta", { size: 21, fill: g, font: FONT.hand, weight: 700 })
            p.curve([[44, 39], [70, 41], [100, 38], [126, 40]], { stroke: g, sw: 1.1, seed: 41 })
        },
    },
    uaeng: {
        vb: [132, 46],
        label: "Faculty of Engineering, University of Alberta (hand-drawn)",
        draw: (p) => {
            const g = C.ua
            shield(p, g)
            p.text(84, 19, "UAlberta", { size: 13, fill: g, font: FONT.mono })
            p.text(84, 38, "Engineering", { size: 17, fill: g, font: FONT.hand, weight: 700 })
        },
    },
    ecocar: {
        vb: [132, 46],
        label: "UAlberta EcoCar (hand-drawn)",
        draw: (p) => {
            const g = C.green
            p.raw("M3 33 L8 25 C12 20 18 17 26 18 C31 19 34 22 38 26 L42 27 C44 28 44 31 43 33 Z", { stroke: C.inkk, sw: 1.5 })
            p.line(17, 21, 19, 26, { stroke: C.inkk, sw: 1, rough: 0.3, seed: 43 })
            p.ellipse(13, 34, 9, 9, { stroke: C.inkk, sw: 1.4, fill: C.card, seed: 44 })
            p.ellipse(35, 34, 9, 9, { stroke: C.inkk, sw: 1.4, fill: C.card, seed: 45 })
            p.raw("M30 12 C28 6 32 2 39 2 C39 8 36 12 30 12 Z", { stroke: g, sw: 1.2, fill: C.hlG })
            p.text(89, 32, "EcoCar", { size: 24, fill: g, font: FONT.hand, weight: 700 })
            p.curve([[52, 39], [76, 41], [104, 38], [126, 40]], { stroke: g, sw: 1.1, seed: 46 })
        },
    },
    compe: {
        vb: [132, 46],
        label: "UAlberta Computer Engineering Club (hand-drawn)",
        draw: (p) => {
            const w = C.ink
            p.rect(9, 10, 24, 24, { stroke: w, sw: 1.6, rough: 0.7, fill: C.hlB, seed: 51 })
            for (let i = 0; i < 3; i++) {
                const t = 15 + i * 7
                p.line(3, t, 9, t, { stroke: w, sw: 1.1, rough: 0.4, seed: 52 + i })
                p.line(33, t, 39, t, { stroke: w, sw: 1.1, rough: 0.4, seed: 55 + i })
                p.line(t, 4, t, 10, { stroke: w, sw: 1.1, rough: 0.4, seed: 58 + i })
                p.line(t, 34, t, 40, { stroke: w, sw: 1.1, rough: 0.4, seed: 61 + i })
            }
            p.text(21, 26, "CE", { size: 10, fill: w, font: FONT.mono, weight: 700 })
            p.text(88, 20, "CompE", { size: 20, fill: w, font: FONT.hand, weight: 700 })
            p.text(88, 38, "CLUB", { size: 11, fill: C.pencil, font: FONT.mono })
        },
    },
    ess: {
        vb: [132, 46],
        label: "Engineering Students' Society (hand-drawn)",
        draw: (p) => {
            const r = C.red
            for (let i = 0; i < 8; i++) {
                const a = (i * Math.PI) / 4
                p.line(21 + Math.cos(a) * 12, 23 + Math.sin(a) * 12, 21 + Math.cos(a) * 18, 23 + Math.sin(a) * 18, { stroke: r, sw: 3, rough: 0.3, seed: 70 + i })
            }
            p.ellipse(21, 23, 26, 26, { stroke: r, sw: 1.6, fill: C.card, seed: 79 })
            p.ellipse(21, 23, 9, 9, { stroke: r, sw: 1.2, seed: 80 })
            p.text(86, 33, "ESS", { size: 28, fill: r, font: FONT.hand, weight: 700 })
            p.curve([[56, 40], [80, 42], [104, 39], [120, 41]], { stroke: r, sw: 1.1, seed: 81 })
        },
    },
    selp: {
        vb: [132, 46],
        label: "Student Engagement Leadership Program (hand-drawn)",
        draw: (p) => {
            p.raw("M22 40 C8 30 3 22 6 14 C9 7 18 7 22 15 C26 7 35 7 38 14 C41 22 36 30 22 40 Z", { stroke: C.red, sw: 1.5, fill: C.hlP })
            p.ellipse(16, 19, 5, 5, { stroke: C.inkk, sw: 1.1, seed: 82 })
            p.ellipse(28, 19, 5, 5, { stroke: C.inkk, sw: 1.1, seed: 83 })
            p.raw("M11 30 C12 25 20 25 21 30 M23 30 C24 25 32 25 33 30", { stroke: C.inkk, sw: 1.1 })
            p.text(88, 26, "SELP", { size: 24, fill: C.ink, font: FONT.hand, weight: 700 })
            p.text(88, 40, "ENG · UALBERTA", { size: 8.5, fill: C.pencil, font: FONT.mono })
        },
    },
    mentorness: {
        vb: [132, 46],
        label: "Mentorness (hand-drawn)",
        draw: (p) => {
            const o = C.inkk
            p.raw("M20 6 C11 6 7 13 8 19 C9 24 13 26 14 30 H26 C27 26 31 24 32 19 C33 13 29 6 20 6 Z", { stroke: o, sw: 1.5, fill: C.hl })
            p.line(15, 34, 25, 34, { stroke: o, sw: 1.3, rough: 0.3, seed: 85 })
            p.line(16, 38, 24, 38, { stroke: o, sw: 1.3, rough: 0.3, seed: 86 })
            p.raw("M17 22 L20 16 L23 22", { stroke: o, sw: 1 })
            p.text(86, 30, "mentorness", { size: 18, fill: C.ink, font: FONT.hand, weight: 700 })
            p.curve([[46, 37], [72, 39], [100, 36], [126, 38]], { stroke: C.ink, sw: 1, seed: 87 })
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

export const MARK_NAMES = () => Object.keys(MARKS)

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
        options: ["ua", "telus", "ualberta", "uaeng", "ecocar", "compe", "ess", "selp", "mentorness", "chip", "chipInk", "arrowUp", "arrowRight", "check"],
        optionTitles: ["UofA shield", "TELUS (sketch)", "UAlberta (sketch)", "UofA Engineering (sketch)", "EcoCar (sketch)", "CompE Club (sketch)", "ESS (sketch)", "SELP (sketch)", "Mentorness (sketch)", "Chip (light)", "Chip (ink)", "Arrow up-left", "Arrow right", "Check"],
        defaultValue: "ua",
    },
})
