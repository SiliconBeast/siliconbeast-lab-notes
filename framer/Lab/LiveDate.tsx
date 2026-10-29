import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, FONT } from "./ink.tsx"

// Today's date in handwriting, like the date line on a lab sheet.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const fmt = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`

interface Props {
    fallback: string
    fontSize: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function LiveDate({ fallback, fontSize, style }: Props) {
    const [text, setText] = React.useState(fallback)
    React.useEffect(() => setText(fmt(new Date())), [])
    return (
        <p style={{ ...style, margin: 0, fontFamily: FONT.scrawl, fontWeight: 500, fontSize, lineHeight: 1, color: C.ink, whiteSpace: "nowrap" }}>
            <time dateTime={new Date().toISOString().slice(0, 10)} suppressHydrationWarning>
                {text}
            </time>
        </p>
    )
}

addPropertyControls(LiveDate, {
    fallback: { type: ControlType.String, title: "Fallback", defaultValue: "Oct 29, 2026" },
    fontSize: { type: ControlType.Number, title: "Size", defaultValue: 27, min: 12, max: 60, step: 1 },
})
