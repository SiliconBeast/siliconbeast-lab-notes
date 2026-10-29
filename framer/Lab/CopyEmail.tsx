import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, FONT } from "./ink.tsx"

// Email address as a mailto link, with a pencil "copy" button beside it.

interface Props {
    email: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function CopyEmail({ email, style }: Props) {
    const [state, setState] = React.useState<"idle" | "copied" | "select">("idle")
    const textRef = React.useRef<HTMLAnchorElement>(null)
    React.useEffect(() => {
        if (state === "idle") return
        const t = window.setTimeout(() => setState("idle"), 1800)
        return () => window.clearTimeout(t)
    }, [state])
    const select = () => {
        const el = textRef.current
        if (!el) return
        const r = document.createRange()
        r.selectNodeContents(el)
        const s = window.getSelection()
        s?.removeAllRanges()
        s?.addRange(r)
        setState("select")
    }
    const copy = () => {
        try {
            navigator.clipboard.writeText(email).then(() => setState("copied"), select)
        } catch {
            select()
        }
    }
    return (
        <span style={{ ...style, display: "inline-flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <a
                ref={textRef}
                href={`mailto:${email}`}
                style={{ fontFamily: FONT.hand, fontSize: 18, color: C.ink, textDecoration: "underline", textUnderlineOffset: 4, textDecorationThickness: 1 }}
            >
                {email}
            </a>
            <button
                type="button"
                onClick={copy}
                style={{ fontFamily: FONT.scrawl, fontSize: 18, color: C.pencil, background: "none", border: 0, padding: "0 4px", cursor: "pointer", textDecoration: "underline dotted" }}
            >
                {state === "copied" ? "copied ✓" : state === "select" ? "selected, press ⌘C" : "copy"}
            </button>
        </span>
    )
}

addPropertyControls(CopyEmail, {
    email: { type: ControlType.String, title: "Email", defaultValue: "suvir1@ualberta.ca" },
})
