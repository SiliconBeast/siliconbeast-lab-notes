import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { C, FONT } from "./ink.tsx"

// ---- cover designs (kept in this file: the published build drops this component when it imports them) ----

// Cover designs for the notebook opening. Every texture is CSS or inline SVG noise, so nothing loads.
const svg = (body: string, size = 240) =>
    `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${body}</svg>`)}")`

// fine grain: dark speckles at low alpha
const GRAIN = svg(`<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 -0.1'/></filter><rect width='100%' height='100%' filter='url(#n)'/>`, 160)
// leather mottling: soft light and dark patches
const MOTTLE = svg(`<filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.035' numOctaves='4' seed='7' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 -0.35'/></filter><rect width='100%' height='100%' filter='url(#m)'/>`, 320)
// black and white composition-book marbling
const MARBLE = svg(`<filter id='c' color-interpolation-filters='sRGB'><feTurbulence type='turbulence' baseFrequency='0.045' numOctaves='2' seed='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncR type='discrete' tableValues='1 0 1 0 0 1'/><feFuncG type='discrete' tableValues='1 0 1 0 0 1'/><feFuncB type='discrete' tableValues='1 0 1 0 0 1'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(#c)'/>`, 260)
// endpaper marbling, tinted
const ENDPAPER = svg(`<filter id='e'><feTurbulence type='turbulence' baseFrequency='0.02 0.06' numOctaves='3' seed='11' stitchTiles='stitch'/><feColorMatrix values='0.55 0 0 0 0.25  0.35 0 0 0 0.22  0.2 0 0 0 0.35  0 0 0 0 1'/></filter><rect width='100%' height='100%' filter='url(#e)'/>`, 300)
// kraft fibres
const FIBRE = svg(`<filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.02 0.6' numOctaves='2' seed='5' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0 0.05  0 0 0 0.5 -0.15'/></filter><rect width='100%' height='100%' filter='url(#f)'/>`, 240)

type CoverStyle = "leather" | "composition" | "kraft" | "lab" | "blueprint"
const COVER_OPTIONS: CoverStyle[] = ["leather", "composition", "kraft", "lab", "blueprint"]
const COVER_TITLES = ["Leather-bound", "Composition book", "Kraft cardboard", "Lab notebook", "Blueprint"]

type F = { mono: string; scrawl: string; serif: string; hand: string }
type Args = { lines: string[]; subtitle: string; owner: string; font: F; chip: React.ReactNode }

const abs = (s: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...s })

function coverFront(style: CoverStyle, a: Args): { face: React.CSSProperties; content: React.ReactNode } {
    const { lines, subtitle, owner, font } = a
    if (style === "leather") {
        const gold: React.CSSProperties = {
            backgroundImage: "linear-gradient(175deg, #F6E3A1 0%, #C99A3B 45%, #F2D27A 60%, #9C7224 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 1px 0 rgba(0,0,0,.55)) drop-shadow(0 -1px 0 rgba(255,230,180,.15))",
        }
        return {
            face: {
                backgroundColor: "#5A2F1B",
                backgroundImage: `${GRAIN}, ${MOTTLE}, radial-gradient(120% 90% at 30% 20%, #8A4B2C 0%, #5A2F1B 55%, #3A1D10 100%)`,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,.4), inset 0 0 40px rgba(0,0,0,.55), 0 30px 50px -25px rgba(0,0,0,.6)",
                borderRadius: "4px 12px 12px 4px",
                color: "#F2D27A",
            },
            content: (
                <>
                    {/* spine with raised bands */}
                    <div style={abs({ left: 0, top: 0, bottom: 0, width: "12%", borderRadius: "4px 0 0 4px", background: "linear-gradient(90deg, rgba(0,0,0,.45), rgba(0,0,0,.15) 70%, rgba(255,255,255,.06))" })} />
                    {[18, 38, 62, 82].map((t) => (
                        <div key={t} style={abs({ left: 0, width: "12%", top: `${t}%`, height: 6, background: "linear-gradient(rgba(255,255,255,.12), rgba(0,0,0,.4))", borderRadius: 2 })} />
                    ))}
                    {/* stitched border */}
                    <div style={abs({ inset: "5% 5% 5% 16%", border: "2px dashed rgba(236,205,160,.55)", borderRadius: 6 })} />
                    {/* blind-tooled frame */}
                    <div style={abs({ inset: "9% 9% 9% 20%", border: "1px solid rgba(0,0,0,.35)", boxShadow: "0 1px 0 rgba(255,220,170,.12), inset 0 1px 0 rgba(255,220,170,.12)", borderRadius: 3 })} />
                    <div style={abs({ left: "20%", right: "9%", top: "24%", textAlign: "center" })}>
                        <div style={{ ...gold, fontFamily: font.serif, fontSize: "clamp(24px, 6.6vw, 34px)", lineHeight: 1.02, letterSpacing: ".01em" }}>
                            {lines.map((l, i) => (
                                <div key={i}>{l}</div>
                            ))}
                        </div>
                        <div style={{ ...gold, margin: "12px auto 0", width: "56%", height: 1.5, backgroundClip: "border-box", WebkitBackgroundClip: "border-box" }} />
                        <div style={{ ...gold, marginTop: 10, fontFamily: font.mono, fontSize: 8.5, letterSpacing: ".22em", textTransform: "uppercase" }}>{subtitle}</div>
                    </div>
                    <div style={abs({ left: "20%", right: "9%", bottom: "17%", textAlign: "center", fontFamily: font.scrawl, fontSize: 22, color: "rgba(242,210,122,.85)", textShadow: "0 1px 0 rgba(0,0,0,.6)" })}>{owner}</div>
                    {/* elastic band and ribbon bookmark */}
                    <div style={abs({ right: "13%", top: -2, bottom: -2, width: 9, background: "linear-gradient(90deg, #1B1B1B, #3A3A3A 50%, #141414)", boxShadow: "1px 0 2px rgba(0,0,0,.6)" })} />
                    <div style={abs({ left: "30%", bottom: -22, width: 10, height: 30, background: "linear-gradient(90deg, #7E1B1B, #B23131, #7E1B1B)", clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)" })} />
                </>
            ),
        }
    }
    if (style === "composition") {
        return {
            face: {
                backgroundColor: "#111",
                backgroundImage: `${GRAIN}, ${MARBLE}`,
                backgroundSize: "auto, 260px 260px",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,.6), inset 0 0 30px rgba(0,0,0,.35), 0 30px 50px -25px rgba(0,0,0,.6)",
                borderRadius: "2px 8px 8px 2px",
                color: "#111",
            },
            content: (
                <>
                    <div style={abs({ left: 0, top: 0, bottom: 0, width: "13%", background: `${GRAIN}, linear-gradient(90deg, #050505, #1E1E1E)`, boxShadow: "1px 0 0 rgba(255,255,255,.08)" })} />
                    <div style={abs({ left: "22%", right: "10%", top: "17%", padding: "12px 12px 10px", background: "#FBFAF4", borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,.45)" })}>
                        <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: "clamp(14px, 4.4vw, 18px)", lineHeight: 1.1, textAlign: "center", letterSpacing: "-.01em" }}>
                            {lines.join(" ")}
                        </div>
                        {[
                            ["NAME", owner],
                            ["SUBJECT", subtitle.replace(/^Vol\. 1 · /, "")],
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8, borderBottom: "1px solid #9AA4B6" }}>
                                <span style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: ".12em" }}>{k}</span>
                                <span style={{ fontFamily: font.scrawl, fontSize: 18, color: "#1F3A93", lineHeight: 1 }}>{v}</span>
                            </div>
                        ))}
                    </div>
                </>
            ),
        }
    }
    if (style === "kraft") {
        return {
            face: {
                backgroundColor: "#B88A5A",
                backgroundImage: `${GRAIN}, ${FIBRE}, linear-gradient(160deg, #C79C6B, #A87A4C)`,
                boxShadow: "inset 0 0 0 1px rgba(80,50,20,.4), inset 0 0 26px rgba(80,50,20,.35), 0 30px 50px -25px rgba(0,0,0,.5)",
                borderRadius: "3px 10px 10px 3px",
                color: "#2B1D10",
            },
            content: (
                <>
                    <div style={abs({ left: 0, top: 0, bottom: 0, width: "9%", background: "repeating-linear-gradient(transparent 0 10px, rgba(60,40,20,.55) 10px 13px)", opacity: 0.8 })} />
                    <div style={abs({ left: "18%", right: "11%", top: "14%", padding: "12px 10px", background: "#F7F4EA", transform: "rotate(-1.5deg)", boxShadow: "0 1px 2px rgba(0,0,0,.35)" })}>
                        <div style={{ fontFamily: font.hand, fontSize: "clamp(20px, 5.6vw, 26px)", lineHeight: 1.05, textAlign: "center", color: "#1F3A93" }}>
                            {lines.map((l, i) => (
                                <div key={i}>{l}</div>
                            ))}
                        </div>
                    </div>
                    <div style={abs({ left: "18%", right: "11%", top: "50%", textAlign: "center", transform: "rotate(-6deg)" })}>
                        <span style={{ display: "inline-block", padding: "4px 10px", border: "2px solid rgba(178,40,40,.8)", borderRadius: 4, fontFamily: font.mono, fontWeight: 700, fontSize: 11, letterSpacing: ".18em", color: "rgba(178,40,40,.85)", textTransform: "uppercase" }}>
                            {subtitle.replace(/^Vol\. 1 · /, "")}
                        </span>
                    </div>
                    <div style={abs({ left: "18%", right: "11%", bottom: "13%", textAlign: "center", fontFamily: font.scrawl, fontSize: 24, color: "#2B1D10" })}>{owner}</div>
                    <div style={abs({ left: -2, right: -2, top: "70%", height: 9, background: "linear-gradient(#1B1B1B, #3A3A3A 50%, #141414)", boxShadow: "0 1px 2px rgba(0,0,0,.5)" })} />
                </>
            ),
        }
    }
    if (style === "lab") {
        return {
            face: {
                backgroundColor: "#1F4A36",
                backgroundImage: `${GRAIN}, linear-gradient(160deg, #285C44, #183A2A)`,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,.4), inset 0 0 30px rgba(0,0,0,.4), 0 30px 50px -25px rgba(0,0,0,.6)",
                borderRadius: "3px 8px 8px 3px",
                color: "#E8D9A8",
            },
            content: (
                <>
                    <div style={abs({ left: 0, top: 0, bottom: 0, width: "13%", background: `${GRAIN}, linear-gradient(90deg, #0E0E0E, #2A2A2A)` })} />
                    <div style={abs({ right: 0, top: 0, width: "22%", aspectRatio: "1", background: `${GRAIN}, #161616`, clipPath: "polygon(0 0, 100% 0, 100% 100%)", borderTopRightRadius: 8 })} />
                    <div style={abs({ right: 0, bottom: 0, width: "22%", aspectRatio: "1", background: `${GRAIN}, #161616`, clipPath: "polygon(100% 0, 100% 100%, 0 100%)", borderBottomRightRadius: 8 })} />
                    <div style={abs({ left: "20%", right: "8%", top: "12%", textAlign: "center", fontFamily: font.mono, fontWeight: 700, fontSize: 11, letterSpacing: ".24em" })}>LABORATORY NOTEBOOK</div>
                    <div style={abs({ left: "22%", right: "10%", top: "26%", padding: "12px 10px", background: "#F4EFDE", color: "#1C2A22", borderRadius: 2, boxShadow: "0 1px 2px rgba(0,0,0,.4)", backgroundImage: "repeating-linear-gradient(transparent 0 19px, rgba(30,80,60,.25) 19px 20px)" })}>
                        <div style={{ fontFamily: font.mono, fontWeight: 500, fontSize: "clamp(15px, 4.6vw, 20px)", lineHeight: 1.15, textAlign: "center" }}>
                            {lines.map((l, i) => (
                                <div key={i}>{l}</div>
                            ))}
                        </div>
                        <div style={{ marginTop: 8, textAlign: "center", fontFamily: font.scrawl, fontSize: 19, color: "#1F3A93" }}>{owner}</div>
                    </div>
                    <div style={abs({ left: "20%", right: "8%", bottom: "12%", textAlign: "center", fontFamily: font.mono, fontSize: 8.5, letterSpacing: ".2em", textTransform: "uppercase", opacity: 0.85 })}>{subtitle}</div>
                </>
            ),
        }
    }
    // blueprint
    return {
        face: {
            backgroundColor: "#1C4F8A",
            backgroundImage: "linear-gradient(rgba(255,255,255,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.13) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            boxShadow: "0 30px 50px -25px rgba(0,0,0,.5)",
            borderRadius: "3px 9px 9px 3px",
            color: "#EAF2FC",
        },
        content: (
            <>
                <div style={abs({ left: 0, top: 0, bottom: 0, width: "11%", background: "rgba(0,0,0,.3)", boxShadow: "inset -2px 0 3px rgba(0,0,0,.3)" })} />
                <div style={abs({ left: "20%", right: "10%", top: "15%", padding: "14px 12px", background: "#EAF2FC", color: "#14243A", borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,.3)", textAlign: "center", backgroundImage: "repeating-linear-gradient(transparent 0 19px, rgba(70,120,200,.2) 19px 20px)" })}>
                    <div style={{ fontFamily: font.mono, fontWeight: 500, fontSize: "clamp(17px, 5.2vw, 24px)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                        {lines.map((l, i) => (
                            <div key={i}>{l}</div>
                        ))}
                    </div>
                    <div style={{ marginTop: 8, fontFamily: font.mono, fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.75 }}>{subtitle}</div>
                </div>
                <div style={abs({ left: "20%", right: "10%", top: "50%", textAlign: "center", fontFamily: font.scrawl, fontSize: 26, lineHeight: 1.1 })}>{owner}</div>
                <div style={abs({ left: "38%", bottom: "11%", width: "34%" })}>{a.chip}</div>
            </>
        ),
    }
}

// The inside of the front cover: marbled endpaper for the bound books, plain stock for the rest.
function coverInside(style: CoverStyle): React.CSSProperties {
    if (style === "leather") return { backgroundColor: "#6E5A8C", backgroundImage: ENDPAPER, backgroundSize: "300px 300px" }
    if (style === "kraft") return { backgroundColor: "#C9A57A", backgroundImage: `${GRAIN}, ${FIBRE}` }
    if (style === "composition" || style === "lab") return { backgroundColor: "#F1EEE4", backgroundImage: GRAIN }
    return {}
}

// ---- the opening ----

// The notebook cover that swings open when the site first loads, then zooms into the page.
// Server-rendered so the cover is there from the first paint; after mount it moves into a
// portal on <body> so no transformed ancestor can trap the fixed layer. Tap, scroll or press
// a key to open it early. Plays once per page load, not on in-site navigation; add ?cover to
// the URL to replay it.

// Framer can render one copy per breakpoint and remount them while the page hydrates, so the
// sequence lives on window: every copy follows the same clock, and a remount picks up where the
// opening is instead of skipping it.
type Seq = { start: number; openAt: number | null; done: boolean; live: number; goneSent: boolean; overflow: string | null }

function seq(): Seq {
    const w = window as any
    if (!w.__sbCoverSeq) w.__sbCoverSeq = { start: performance.now(), openAt: null, done: false, live: 0, goneSent: false, overflow: null }
    return w.__sbCoverSeq
}

function sendGone(s: Seq) {
    if (s.goneSent) return
    s.goneSent = true
    ;(window as any).__sbCover = false
    window.dispatchEvent(new Event("sb-cover-gone"))
}

function forced() {
    return typeof location !== "undefined" && /(^|[?&#])cover(\b|$)/.test(location.search + location.hash)
}

const CSS = `
.sbc { position: fixed; inset: 0; z-index: 2147483000; display: grid; place-items: center; perspective: 1800px; cursor: pointer; --skip: 0s; }
.sbc[data-phase="open"] { pointer-events: none; animation: sbc-fade .55s ease calc(1.05s - var(--skip)) forwards; }
@keyframes sbc-fade { to { opacity: 0; } }
.sbc-stage { position: relative; width: min(74vw, 340px); aspect-ratio: 3 / 4; transform-style: preserve-3d; }
.sbc[data-phase="open"] .sbc-stage { animation: sbc-zoom .9s cubic-bezier(.6, 0, .4, 1) calc(.55s - var(--skip)) forwards; }
@keyframes sbc-zoom { to { transform: scale(2.6) translateY(4%); } }
.sbc-cover { position: absolute; inset: 0; transform-origin: 0 50%; transform-style: preserve-3d; }
.sbc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 3px 9px 9px 3px; }
.sbc-back { transform: rotateY(180deg); }
.sbc[data-phase="open"] .sbc-cover { animation: sbc-swing 1.1s cubic-bezier(.55, .05, .3, 1) calc(0s - var(--skip)) forwards; }
@keyframes sbc-swing { from { transform: rotateY(0deg); } to { transform: rotateY(-168deg); } }
.sbc-hint { transition: opacity .3s; }
.sbc[data-phase="open"] .sbc-hint { opacity: 0; }
.sbc-closed .sbc-cover { animation: sbc-breathe 2.4s ease-in-out infinite; }
@keyframes sbc-breathe { 50% { transform: rotateY(-7deg); } }
/* reduced motion: still a short swing on the spine, but no breathing and no zoom into the page */
@media (prefers-reduced-motion: reduce) {
  .sbc-closed .sbc-cover { animation: none; }
  .sbc[data-phase="open"] .sbc-stage { animation: none; }
  .sbc[data-phase="open"] .sbc-cover { animation-duration: .9s; }
  .sbc[data-phase="open"] { animation-duration: .45s; animation-delay: calc(.85s - var(--skip)); }
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
    // a copy mounted after the opening began (a Framer remount) joins it where it is
    const known: Seq | undefined = typeof window !== "undefined" ? (window as any).__sbCoverSeq : undefined
    const replay = forced()
    const [phase, setPhase] = React.useState<"closed" | "open" | "gone">(
        isCanvas || (known?.done && !replay) ? "gone" : known?.openAt != null && !known.done ? "open" : "closed"
    )
    const skip = React.useRef<number | null>(null)
    if (phase === "open" && skip.current === null) skip.current = known?.openAt != null ? Math.max(0, (performance.now() - known.openAt) / 1000) : 0
    const [mounted, setMounted] = React.useState(false)
    const open = React.useCallback(() => setPhase((p) => (p === "closed" ? "open" : p)), [])

    React.useEffect(() => {
        setMounted(true)
        if (isCanvas || phase === "gone") return
        const s = seq()
        if (s.done) {
            if (!forced()) return setPhase("gone")
            Object.assign(s, { start: performance.now(), openAt: null, done: false, goneSent: false })
        }
        const root = document.documentElement
        if (s.live++ === 0) {
            // remember the page's own setting once, not the lock a previous copy left behind
            if (s.overflow === null) s.overflow = root.style.overflow
            root.style.overflow = "hidden"
        }
        ;(window as any).__sbCover = !s.goneSent
        const t = window.setTimeout(open, Math.max(0, (hold ?? 0) * 1000 - (performance.now() - s.start)))
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
            // the last copy to leave mid-sequence hands the page back, unless a remount takes over
            if (--s.live === 0 && !s.done)
                window.setTimeout(() => {
                    if (s.live > 0 || s.done) return
                    root.style.overflow = s.overflow ?? ""
                    sendGone(s)
                }, 120)
        }
    }, [])

    React.useEffect(() => {
        if (phase !== "open") return
        const s = seq()
        if (s.openAt === null) s.openAt = performance.now()
        const past = (skip.current ?? 0) * 1000
        document.documentElement.style.overflow = s.overflow ?? ""
        // Let figures start drawing while the page zooms in.
        const t1 = window.setTimeout(() => sendGone(s), Math.max(0, 900 - past))
        const t2 = window.setTimeout(() => {
            s.done = true
            setPhase("gone")
        }, Math.max(0, 1700 - past))
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
        <div className={`sbc${phase === "closed" ? " sbc-closed" : ""}`} data-phase={phase} onClick={open} aria-hidden="true" style={{ background: C.mat, ["--skip" as any]: `${skip.current ?? 0}s` }}>
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
    hold: { type: ControlType.Number, title: "Hold (s)", defaultValue: 0, min: 0, max: 3, step: 0.1, description: "How long the closed cover waits before opening" },
})
