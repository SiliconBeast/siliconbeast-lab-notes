import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, FONT, Pen, useSize } from "./ink.tsx"

// Handwritten calculations. Blocks are separated by a blank line.
//   ? question        → pencil heading
//   ~ note            → pencil scrawl
//   anything else     → ink row
//   [[answer]]        → boxed in red pen
//   ✓                 → green tick
//   t_{after}         → subscript

const CSS = `
.calc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px 40px; }
`

function Boxed({ children }: { children: React.ReactNode }) {
    const ref = React.useRef<HTMLSpanElement>(null)
    const { w, h } = useSize(ref, { w: 80, h: 30 })
    const p = new Pen()
    p.rect(1, 1, Math.max(4, w - 2), Math.max(4, h - 2), { stroke: C.red, sw: 1.5, rough: 1.5, seed: w + h })
    return (
        <span ref={ref} style={{ position: "relative", display: "inline-block", padding: "1px 10px", margin: "0 4px" }}>
            <svg aria-hidden="true" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
                {p.els}
            </svg>
            {children}
        </span>
    )
}

function inline(text: string, key: string): React.ReactNode[] {
    const out: React.ReactNode[] = []
    const re = /\[\[(.+?)\]\]|✓|_\{(.+?)\}/g
    let last = 0
    let m: RegExpExecArray | null
    let i = 0
    while ((m = re.exec(text))) {
        if (m.index > last) out.push(text.slice(last, m.index))
        if (m[1] !== undefined) out.push(<Boxed key={`${key}b${i++}`}>{inline(m[1], `${key}i${i}`)}</Boxed>)
        else if (m[2] !== undefined) out.push(<sub key={`${key}s${i++}`}>{m[2]}</sub>)
        else
            out.push(
                <span key={`${key}c${i++}`} style={{ fontFamily: FONT.scrawl, fontSize: 28, lineHeight: 0, marginLeft: 8, color: C.green }}>
                    ✓
                </span>
            )
        last = re.lastIndex
    }
    if (last < text.length) out.push(text.slice(last))
    return out
}

interface Props {
    content: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Calc({ content, style }: Props) {
    const blocks = (content || "")
        .replace(/\r/g, "")
        .split(/\n\s*\n/)
        .map((b) => b.split("\n").filter((l) => l.trim()))
        .filter((b) => b.length)
    return (
        <div className="calc-grid" style={{ ...style }}>
            <style>{CSS}</style>
            {blocks.map((lines, bi) => (
                <div key={bi} style={{ minWidth: 0, fontFamily: FONT.hand, fontSize: 19, lineHeight: 1.55, color: C.ink }}>
                    {lines.map((raw, li) => {
                        const line = raw.trim()
                        const k = `${bi}-${li}`
                        if (line.startsWith("?"))
                            return (
                                <div key={k} style={{ fontSize: 16.5, color: C.pencil, marginBottom: 4 }}>
                                    {inline(line.slice(1).trim(), k)}
                                </div>
                            )
                        if (line.startsWith("~"))
                            return (
                                <div key={k} style={{ paddingLeft: 18, fontFamily: FONT.scrawl, fontSize: 21, color: C.pencil }}>
                                    {inline(line.slice(1).trim(), k)}
                                </div>
                            )
                        return (
                            <div key={k} style={{ paddingLeft: 18 }}>
                                {inline(line, k)}
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}

addPropertyControls(Calc, {
    content: {
        type: ControlType.String,
        title: "Calculations",
        displayTextArea: true,
        defaultValue: "? a) speed-up\nt_{before} = 30+ min ≥ 1800 s\nt_{after} = 5 s\n1800 / 5 = [[360× faster]] ✓",
    },
})
