import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C } from "./ink.tsx"

// Background ruling for a layer: graph paper for sheets, a cutting-mat grid for the desk.
// Transparent itself, so the parent's fill shows through.

interface Props {
    pattern: "graph" | "mat" | "lined"
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Paper({ pattern, style }: Props) {
    let bg: React.CSSProperties
    if (pattern === "mat")
        bg = {
            backgroundImage: `linear-gradient(${C.matLine} 1px, transparent 1px), linear-gradient(90deg, ${C.matLine} 1px, transparent 1px), linear-gradient(${C.matLine} 1px, transparent 1px), linear-gradient(90deg, ${C.matLine} 1px, transparent 1px)`,
            backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
        }
    else if (pattern === "lined")
        bg = {
            backgroundImage: `repeating-linear-gradient(transparent 0 27px, ${C.gridMajor} 27px 28px)`,
            backgroundPosition: "0 10px",
        }
    else
        bg = {
            backgroundImage: `linear-gradient(${C.gridMajor} 1px, transparent 1px), linear-gradient(90deg, ${C.gridMajor} 1px, transparent 1px), linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
            backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
        }
    return <div aria-hidden="true" style={{ ...style, ...bg, pointerEvents: "none" }} />
}

addPropertyControls(Paper, {
    pattern: {
        type: ControlType.Enum,
        title: "Pattern",
        options: ["graph", "mat", "lined"],
        optionTitles: ["Graph paper", "Cutting mat", "Index card lines"],
        defaultValue: "graph",
    },
})
