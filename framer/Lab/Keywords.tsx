import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, FONT } from "./ink.tsx"

// Highlighter-marked keywords from a comma-separated list. The highlighter colour cycles.

const PENS = [C.hl, C.hlG, C.hlB, C.hlP, C.hlO]

interface Props {
    words: string
    fontSize: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Keywords({ words, fontSize, style }: Props) {
    const list = (words || "")
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean)
    return (
        <ul style={{ ...style, listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "6px 10px" }}>
            {list.map((w, i) => (
                <li
                    key={w + i}
                    style={{
                        fontFamily: FONT.hand,
                        fontSize,
                        lineHeight: 1.4,
                        color: C.inkk,
                        padding: "0 .15em",
                        borderRadius: ".3em .1em .4em .15em",
                        backgroundImage: `linear-gradient(100deg, transparent 2%, ${PENS[i % PENS.length]} 4%, ${PENS[i % PENS.length]} 96%, transparent 98%)`,
                        backgroundSize: "100% 72%",
                        backgroundPosition: "0 75%",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    {w}
                </li>
            ))}
        </ul>
    )
}

addPropertyControls(Keywords, {
    words: { type: ControlType.String, title: "Words", defaultValue: "streaming telemetry, distributed systems, test automation" },
    fontSize: { type: ControlType.Number, title: "Size", defaultValue: 16.5, min: 10, max: 32, step: 0.5 },
})
