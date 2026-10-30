import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { C, FONT } from "./ink.tsx"

// A small paper tab that slides in once you have scrolled down and takes you back to the top.
// Portaled to <body> so it stays fixed to the window, even inside transformed Framer layouts.

const CSS = `
.btt { position: fixed; right: max(16px, env(safe-area-inset-right)); bottom: max(18px, env(safe-area-inset-bottom)); z-index: 9000; display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px 8px; border: 1.5px solid ${C.ink}; border-radius: 6px 9px 7px 10px; background: ${C.paper}; color: ${C.ink}; font-family: ${FONT.scrawl}; font-size: 19px; line-height: 1; cursor: pointer; box-shadow: 2px 3px 0 ${C.shadow}; transform: translateY(14px) rotate(-2deg); opacity: 0; pointer-events: none; transition: opacity .25s ease, transform .3s cubic-bezier(.3,.7,.3,1.3), background .2s; }
.btt[data-on="true"] { opacity: 1; transform: translateY(0) rotate(-2deg); pointer-events: auto; }
.btt:hover { background: ${C.hl}; transform: translateY(-2px) rotate(0deg); }
.btt:focus-visible { outline: 2px dashed ${C.ink}; outline-offset: 3px; }
.btt-arrow { display: inline-block; transition: transform .25s ease; }
.btt:hover .btt-arrow { transform: translateY(-3px); }
@media (prefers-reduced-motion: reduce) { .btt, .btt-arrow { transition: opacity .2s ease; } }
@media print { .btt { display: none; } }
`

interface Props {
    label: string
    threshold: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function BackToTop({ label = "top", threshold = 700, style }: Props) {
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [on, setOn] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        if (isCanvas) return
        const check = () => setOn(window.scrollY > threshold)
        check()
        window.addEventListener("scroll", check, { passive: true })
        return () => window.removeEventListener("scroll", check)
    }, [threshold])

    const toTop = () => {
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
    }

    const button = (
        <button type="button" className="btt" data-on={isCanvas || on} onClick={toTop} aria-label="Back to the top of the page" style={isCanvas ? { position: "static", opacity: 1, transform: "none" } : undefined}>
            <style>{CSS}</style>
            <span className="btt-arrow" aria-hidden="true">
                ↑
            </span>
            {label}
        </button>
    )

    // the canvas shows the tab in place so it can be found and styled
    if (isCanvas) return <div style={style}>{button}</div>
    if (!mounted) return null
    return createPortal(button, document.body)
}

addPropertyControls(BackToTop, {
    label: { type: ControlType.String, title: "Label", defaultValue: "top" },
    threshold: { type: ControlType.Number, title: "Show after (px)", defaultValue: 700, min: 0, max: 3000, step: 50 },
})
