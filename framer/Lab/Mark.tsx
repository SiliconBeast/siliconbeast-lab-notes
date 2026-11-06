import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, FONT, Pen } from "./ink.tsx"

// Small hand-drawn marks: the University of Alberta shield (a generic sketch, not the
// official crest), the SiliconBeast chip, a pencil arrow, a pushpin and a paper clip.

// The University of Alberta shield, taken from the university's 2021 logo (wordmark removed).
// Filled with the UofA green token so it stays readable on the blueprint theme.
const UA_SHIELD = [
    "M41.21,9.31l-.65-.26a13.64,13.64,0,0,0-5-.89,13.79,13.79,0,0,0-4.63.76,13.89,13.89,0,0,0-4.64-.76,13.64,13.64,0,0,0-5,.89l-.65.26v1.44H19V21.91H42.82V10.75H41.21Zm-11.32,10a15.33,15.33,0,0,0-7.21,0V10.73a13.37,13.37,0,0,1,7.21,0Zm9.26,0a15.33,15.33,0,0,0-7.21,0V10.73a13.37,13.37,0,0,1,7.21,0Z",
    "M59,6l-.85-.41C50.34,1.78,41.68,0,30.92,0S11.5,1.78,3.66,5.59L2.81,6,0,7.37V39.64C0,45,1.15,58.57,11.76,67.75A56.35,56.35,0,0,0,28.82,77.9s1.95.71,2.1.71S33,77.9,33,77.9a56.12,56.12,0,0,0,17-10.15C60.68,58.57,61.83,45,61.83,39.64V7.38ZM22.27,67.29l-1.18,1.18c-1-.62-2-1.31-3-2.07l3.1-3.1,1.1,1.1Zm0-8-1.83,1.83L17.9,63.63l-2.54-2.54-1.83-1.83V56.38l1.1-1.1,3.27,3.27,3.27-3.27,1.1,1.1Zm0-8L17.9,55.61l-4.37-4.37V48.36l1.1-1.1,3.27,3.27,3.27-3.27,1.1,1.1Zm13,16.05-1.83,1.83-2.54,2.54-2.55-2.54-1.83-1.83V64.4l1.11-1.1,3.27,3.27,3.26-3.27,1.11,1.1Zm0-8-1.83,1.83-2.54,2.54-2.55-2.54-1.83-1.83V56.38l1.11-1.1,3.27,3.27,3.26-3.27,1.11,1.1Zm0-8-4.37,4.37-4.38-4.37V48.36l1.11-1.1,3.27,3.27,3.26-3.27,1.11,1.1Zm4.27,16.05V64.4l1.1-1.1,3.1,3.1c-1,.76-2,1.45-3,2.07Zm8.74-8-1.83,1.83-2.54,2.54-2.54-2.54-1.83-1.83V56.38l1.1-1.1,3.27,3.27,3.27-3.27,1.1,1.1Zm0-8-4.37,4.37-4.37-4.37V48.36l1.1-1.1,3.27,3.27,3.27-3.27,1.1,1.1Zm8.24-6.87A11.32,11.32,0,0,1,52.34,43a7,7,0,0,0-6.94,0,11.26,11.26,0,0,1-11,0,7,7,0,0,0-6.93,0,11.26,11.26,0,0,1-11,0,7,7,0,0,0-6.94,0,11.32,11.32,0,0,1-4.2,1.36A37.64,37.64,0,0,1,5,40.19a7.51,7.51,0,0,0,2.45-.84,11.21,11.21,0,0,1,11,0,7,7,0,0,0,6.94,0,11.19,11.19,0,0,1,11,0,7,7,0,0,0,6.94,0,11.21,11.21,0,0,1,11,0,7.51,7.51,0,0,0,2.45.84A37.64,37.64,0,0,1,56.54,44.37Zm.3-8.33-7.81-8-7.36,7.42-10.75-11L20.16,35.49l-7.35-7.42L5,36V10.5l.85-.42C13,6.61,21,5,30.92,5S48.86,6.61,56,10.08l.85.42Z",
]

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
    if (mark === "uashield")
        return (
            <div style={{ ...style }}>
                <svg viewBox="0 0 61.83 78.61" role="img" aria-label="University of Alberta shield" style={{ display: "block", width: "100%", height: "auto" }}>
                    {UA_SHIELD.map((d, i) => (
                        <path key={i} d={d} style={{ fill: C.ua }} />
                    ))}
                </svg>
            </div>
        )
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
        options: ["uashield", "ua", "telus", "chip", "chipInk", "arrowUp", "arrowRight", "check"],
        optionTitles: ["UofA shield (official)", "UofA shield (sketch)", "TELUS (sketch)", "Chip (light)", "Chip (ink)", "Arrow up-left", "Arrow right", "Check"],
        defaultValue: "ua",
    },
})
