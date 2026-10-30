import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, FONT } from "./ink.tsx"

// Today's date in handwriting, like the date line on a lab sheet. Set Text to show a fixed
// value instead (the header uses it for the graduation date), with an optional highlighter stroke.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const fmt = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`

interface Props {
    text: string
    highlight: boolean
    fallback: string
    fontSize: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function LiveDate({ text: fixed, highlight, fallback, fontSize, style }: Props) {
    const [text, setText] = React.useState(fallback)
    React.useEffect(() => setText(fmt(new Date())), [])
    const marker: React.CSSProperties = highlight
        ? {
              padding: "0.08em 0.3em",
              margin: "0 -0.1em",
              borderRadius: "0.3em 0.15em 0.35em 0.2em",
              backgroundImage: `linear-gradient(100deg, transparent 0.15em, ${C.hl} 0.3em, ${C.hl} calc(100% - 0.3em), transparent calc(100% - 0.12em))`,
              WebkitBoxDecorationBreak: "clone",
              boxDecorationBreak: "clone",
          }
        : {}
    return (
        <p style={{ ...style, margin: 0, fontFamily: FONT.scrawl, fontWeight: 500, fontSize, lineHeight: 1, color: C.ink, whiteSpace: "nowrap" }}>
            {fixed ? (
                <span style={marker}>{fixed}</span>
            ) : (
                <time dateTime={new Date().toISOString().slice(0, 10)} suppressHydrationWarning style={marker}>
                    {text}
                </time>
            )}
        </p>
    )
}

addPropertyControls(LiveDate, {
    text: { type: ControlType.String, title: "Text", defaultValue: "", description: "Leave empty to show today's date" },
    highlight: { type: ControlType.Boolean, title: "Highlight", defaultValue: false },
    fallback: { type: ControlType.String, title: "Fallback", defaultValue: "Oct 29, 2026" },
    fontSize: { type: ControlType.Number, title: "Size", defaultValue: 27, min: 12, max: 60, step: 1 },
})
