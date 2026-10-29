import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, Pen, useSize } from "./ink.tsx"

// A hand-drawn outline that fills its parent: boxes, underlines, circles,
// checkboxes and rubber stamps. Place it absolutely behind or over a layer.

const COLORS: Record<string, string> = {
    ink: C.ink,
    inkBlack: C.inkk,
    pencil: C.pencil,
    red: C.red,
    green: C.green,
    print: C.print,
    printLine: C.printLine,
}

interface Props {
    shape: "box" | "underline" | "circle" | "dashCircle" | "checkbox" | "checked" | "stamp" | "rule"
    color: string
    weight: number
    roughness: number
    seed: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Hand(props: Props) {
    const { shape, color, weight, roughness, seed, style } = props
    const ref = React.useRef<HTMLDivElement>(null)
    const { w, h } = useSize(ref, { w: 200, h: 48 })
    const stroke = COLORS[color] ?? C.ink
    const o = { stroke, sw: weight, rough: roughness, seed }
    const p = new Pen()
    const W = Math.max(4, w)
    const H = Math.max(4, h)

    if (shape === "box") p.rect(1.5, 1.5, W - 3, H - 3, o)
    else if (shape === "underline") p.line(1, H / 2, W - 1, H / 2, o)
    else if (shape === "rule") p.line(0, H - 1, W, H - 1, { ...o, rough: roughness * 0.6 })
    else if (shape === "circle") p.ellipse(W / 2, H / 2, W - 4, H - 4, o)
    else if (shape === "dashCircle") p.ellipse(W / 2, H / 2, W - 4, H - 4, { ...o, dash: "4 5" })
    else if (shape === "stamp") {
        p.ellipse(W / 2, H / 2, W - 4, H - 4, { ...o, sw: weight * 1.6 })
        p.ellipse(W / 2, H / 2, W - 14, H - 14, { ...o, seed: seed + 1, sw: weight * 0.7 })
    } else {
        const s = Math.min(W, H)
        p.rect(2, (H - s) / 2 + 3, s - 6, s - 6, { stroke: C.print, sw: 1.2, rough: 1, seed })
        if (shape === "checked")
            p.lines(
                [
                    [s * 0.2, H / 2],
                    [s * 0.42, H / 2 + s * 0.26],
                    [s * 0.98, H / 2 - s * 0.62],
                ],
                { stroke, sw: weight * 1.5, rough: 1.2, seed: seed + 3 }
            )
    }

    return (
        <div ref={ref} style={{ ...style, pointerEvents: "none" }} aria-hidden="true">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}>
                {p.els}
            </svg>
        </div>
    )
}

addPropertyControls(Hand, {
    shape: {
        type: ControlType.Enum,
        title: "Shape",
        options: ["box", "underline", "rule", "circle", "dashCircle", "checkbox", "checked", "stamp"],
        optionTitles: ["Box", "Underline", "Rule (bottom)", "Circle", "Dashed circle", "Checkbox", "Checked box", "Stamp"],
        defaultValue: "box",
    },
    color: {
        type: ControlType.Enum,
        title: "Ink",
        options: ["ink", "inkBlack", "pencil", "red", "green", "print", "printLine"],
        optionTitles: ["Blue pen", "Black pen", "Pencil", "Red pen", "Green pen", "Print", "Print line"],
        defaultValue: "ink",
    },
    weight: { type: ControlType.Number, title: "Weight", defaultValue: 1.4, min: 0.5, max: 4, step: 0.1 },
    roughness: { type: ControlType.Number, title: "Roughness", defaultValue: 1.3, min: 0, max: 3, step: 0.1 },
    seed: { type: ControlType.Number, title: "Seed", defaultValue: 7, min: 1, max: 999, step: 1 },
})
