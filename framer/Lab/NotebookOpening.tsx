import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { C, FONT } from "./ink.tsx"
import { coverFront, coverInside, COVER_OPTIONS, COVER_TITLES, CoverStyle } from "./covers.tsx"

// The notebook cover that swings open when the site first loads, then zooms into the page.
// Server-rendered so the cover is there from the first paint; after mount it moves into a
// portal on <body> so no transformed ancestor can trap the fixed layer. Tap, scroll or press
// a key to open it early. Plays once per page load, not on in-site navigation; add ?cover to
// the URL to replay it.

let played = false

function forced() {
    return typeof location !== "undefined" && /(^|[?&#])cover/.test(location.search + location.hash)
}

const CSS = `
.sbc { position: fixed; inset: 0; z-index: 2147483000; display: grid; place-items: center; perspective: 1800px; cursor: pointer; transition: opacity .55s ease 1.05s; }
.sbc[data-phase="open"] { opacity: 0; pointer-events: none; }
.sbc-stage { position: relative; width: min(74vw, 340px); aspect-ratio: 3 / 4; transform-style: preserve-3d; transition: transform .9s cubic-bezier(.6, 0, .4, 1) .55s; }
.sbc[data-phase="open"] .sbc-stage { transform: scale(2.6) translateY(4%); }
.sbc-cover { position: absolute; inset: 0; transform-origin: 0 50%; transform-style: preserve-3d; }
.sbc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 3px 9px 9px 3px; }
.sbc-back { transform: rotateY(180deg); }
.sbc[data-phase="open"] .sbc-cover { animation: sbc-swing 1.1s cubic-bezier(.55, .05, .3, 1) forwards; }
@keyframes sbc-swing { from { transform: rotateY(0deg); } to { transform: rotateY(-168deg); } }
.sbc-hint { transition: opacity .3s; }
.sbc[data-phase="open"] .sbc-hint { opacity: 0; }
.sbc-closed .sbc-cover { animation: sbc-breathe 2.4s ease-in-out infinite; }
@keyframes sbc-breathe { 50% { transform: rotateY(-7deg); } }
@media (prefers-reduced-motion: reduce) {
  .sbc-stage, .sbc-cover { transition: none !important; animation: none !important; }
  .sbc[data-phase="open"] .sbc-stage, .sbc[data-phase="open"] .sbc-cover { transform: none; }
  .sbc { transition: opacity .4s ease; }
}
`

function Chip() {
    const pins = []
    for (let i = 0; i < 4; i++) {
        const x = 30 + i * 13
        pins.push(<path key={"t" + i} d={`M${x} 18 V8 M${x} 82 V92`} />, <path key={"s" + i} d={`M18 ${x} H8 M82 ${x} H92`} />)
    }
    return (
        <svg viewBox="0 0 100 100" width="100%" style={{ display: "block", overflow: "visible" }} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
            {pins}
            <rect x="18" y="18" width="64" height="64" rx="4" />
            <rect x="32" y="32" width="36" height="36" rx="2" strokeWidth={2} />
            <text x="50" y="56" textAnchor="middle" fontSize="15" fontFamily={FONT.mono} fill="currentColor" stroke="none">SB</text>
        </svg>
    )
}

interface Props {
    coverStyle: CoverStyle
    title: string
    subtitle: string
    owner: string
    hold: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function NotebookOpening({ coverStyle, title, subtitle, owner, hold, style }: Props) {
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [phase, setPhase] = React.useState<"closed" | "open" | "gone">(isCanvas || (played && !forced()) ? "gone" : "closed")
    const [mounted, setMounted] = React.useState(false)
    const open = React.useCallback(() => setPhase((p) => (p === "closed" ? "open" : p)), [])

    React.useEffect(() => {
        setMounted(true)
        if (isCanvas || phase === "gone") return
        played = true
        const w = window as any
        w.__sbCover = true
        const root = document.documentElement
        const prevOverflow = root.style.overflow
        root.style.overflow = "hidden"
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const t = window.setTimeout(open, (reduce ? 0.8 : hold) * 1000)
        // Scrolling or a key opens it early, but not in the first moments (stray momentum scrolls).
        const opts = { passive: true } as AddEventListenerOptions
        const arm = window.setTimeout(() => {
            window.addEventListener("wheel", open, opts)
            window.addEventListener("touchmove", open, opts)
            window.addEventListener("keydown", open)
        }, 700)
        return () => {
            window.clearTimeout(t)
            window.clearTimeout(arm)
            window.removeEventListener("wheel", open)
            window.removeEventListener("touchmove", open)
            window.removeEventListener("keydown", open)
            root.style.overflow = prevOverflow
            if (w.__sbCover) {
                w.__sbCover = false
                window.dispatchEvent(new Event("sb-cover-gone"))
            }
        }
    }, [])

    React.useEffect(() => {
        if (phase !== "open") return
        const w = window as any
        document.documentElement.style.overflow = ""
        // Let figures start drawing while the page zooms in.
        const t1 = window.setTimeout(() => {
            w.__sbCover = false
            window.dispatchEvent(new Event("sb-cover-gone"))
        }, 900)
        const t2 = window.setTimeout(() => setPhase("gone"), 1700)
        return () => {
            window.clearTimeout(t1)
            window.clearTimeout(t2)
        }
    }, [phase])

    const placeholder = <div style={{ ...style, pointerEvents: "none" }} aria-hidden="true" />
    if (phase === "gone") return placeholder
    const lines = (title || "").split("|")
    const front = coverFront(coverStyle || "leather", { lines, subtitle, owner, font: FONT, chip: <Chip /> })
    const inside = coverInside(coverStyle || "leather")
    // on marbled endpapers the "property of" note sits on a pasted label
    const label = (coverStyle || "leather") === "leather" || coverStyle === "kraft"

    const cover = (
        <div className={`sbc${phase === "closed" ? " sbc-closed" : ""}`} data-phase={phase} onClick={open} aria-hidden="true" style={{ background: C.mat }}>
            <style>{CSS}</style>
            <div className="sbc-stage">
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "2px 8px 8px 2px",
                        background: C.paper,
                        backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
                        backgroundSize: "16px 16px",
                        boxShadow: `0 30px 50px -25px ${C.shadow}`,
                        display: "grid",
                        placeItems: "center",
                        fontFamily: FONT.scrawl,
                        fontSize: 26,
                        color: C.ink,
                    }}
                >
                    Index, page 1 →
                </div>
                <div className="sbc-cover">
                <div className="sbc-face" style={front.face}>
                    {front.content}
                </div>
                <div
                    className="sbc-face sbc-back"
                    style={{
                        background: C.paper,
                        backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
                        backgroundSize: "14px 14px",
                        ...inside,
                        boxShadow: `inset -10px 0 18px -10px ${C.shadow}`,
                        display: "grid",
                        placeContent: "center",
                        textAlign: "center",
                        gap: 4,
                        fontFamily: FONT.scrawl,
                        fontSize: 22,
                        color: C.ink,
                    }}
                >
                    <div style={label ? { background: "#FBFAF4", color: "#1F3A93", padding: "10px 14px", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,.35)", display: "grid", gap: 2 } : { display: "grid", gap: 4 }}>
                        Property of {owner}
                        <span style={{ fontSize: 16, color: label ? "#5A5D63" : C.pencil }}>if found, please return (or hire)</span>
                    </div>
                </div>
                </div>
                <div className="sbc-hint" style={{ position: "absolute", left: 0, right: 0, bottom: -44, textAlign: "center", fontFamily: FONT.scrawl, fontSize: 21, color: C.pencil }}>
                    opening the notebook…
                </div>
            </div>
        </div>
    )

    if (!mounted) return cover
    return (
        <>
            {placeholder}
            {createPortal(cover, document.body)}
        </>
    )
}

addPropertyControls(NotebookOpening, {
    coverStyle: { type: ControlType.Enum, title: "Cover", options: COVER_OPTIONS, optionTitles: COVER_TITLES, defaultValue: "leather" },
    title: { type: ControlType.String, title: "Title", defaultValue: "SiliconBeast|Lab Notes", description: "Use | for a line break" },
    subtitle: { type: ControlType.String, title: "Subtitle", defaultValue: "Vol. 1 · Computer Engineering" },
    owner: { type: ControlType.String, title: "Owner", defaultValue: "Suvir Duggal" },
    hold: { type: ControlType.Number, title: "Hold (s)", defaultValue: 1.4, min: 0, max: 3, step: 0.1 },
})
