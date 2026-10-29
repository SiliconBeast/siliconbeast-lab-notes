import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, FONT, Pen } from "./ink.tsx"
import { PencilSvg, PENCIL_CSS, useUid } from "./pencil.tsx"

// "What I'm interested in": notebook divider tabs, each with index cards. Hover, focus or tap a
// card to pin a "why it interests me" note to it.
// Data:
//   ## Tab name | one-line description
//   ### Card title {icon-key} | why it interests me
//   - Where it shows up | slug, /path, #anchor or https://…
// Icon keys are tech logos (see icons.ts) or d:plane, d:bird, d:book, d:tv, d:paddle, d:pan doodles.
// A reference can start with {logo:office}, {logo:parks} or {logo:modern} for a pseudo-logo.

const TABS = [C.hl, C.hlB, C.hlG, C.hlP, C.hlO]

const CSS = `
.in-tabs { display: flex; gap: 4px; padding-left: 10px; position: relative; z-index: 2; flex-wrap: wrap; }
.in-tab { all: unset; box-sizing: border-box; cursor: pointer; padding: 9px 16px 8px; border: 1.5px solid ${C.printLine}; border-bottom: 0; border-radius: 9px 9px 0 0; font-family: ${FONT.mono}; font-size: 11.5px; letter-spacing: .12em; text-transform: uppercase; color: ${C.inkk}; transform: translateY(5px); transition: transform .25s cubic-bezier(.3,.7,.3,1.3), filter .2s; filter: saturate(.7); }
.in-tab:hover { transform: translateY(1px); }
.in-tab[aria-selected="true"] { transform: translateY(1.5px); filter: none; }
.in-tab:focus-visible { outline: 2px dashed ${C.ink}; outline-offset: 2px; }
.in-card { position: relative; z-index: 1; border: 1.5px solid ${C.printLine}; border-radius: 3px 10px 10px 10px; padding: 22px 22px 24px; background-color: ${C.card}; background-image: linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px); background-size: 18px 18px; box-shadow: 0 18px 30px -24px ${C.shadow}; }
.in-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; margin-top: 18px; }
.in-tile { all: unset; box-sizing: border-box; position: relative; display: flex; flex-direction: column; gap: 8px; min-height: 118px; padding: 12px 12px 10px; cursor: pointer; background: ${C.paper}; border: 1px solid ${C.printLine}; border-radius: 4px 7px 6px 5px; box-shadow: 0 6px 12px -10px ${C.shadow}; transition: transform .25s cubic-bezier(.3,.7,.3,1.4), box-shadow .25s; animation: in-deal .45s cubic-bezier(.3,.7,.3,1.2) backwards; animation-delay: calc(var(--i) * 60ms); }
.in-tile:nth-child(odd) { --r: -1.2deg; } .in-tile:nth-child(even) { --r: 1deg; }
.in-tile:hover, .in-tile[aria-expanded="true"] { transform: translateY(-3px) rotate(var(--r)); box-shadow: 0 14px 20px -14px ${C.shadow}; }
.in-tile:focus-visible { outline: 2px dashed ${C.ink}; outline-offset: 3px; }
.in-band { position: absolute; left: -1px; right: -1px; top: -1px; height: 7px; border-radius: 4px 7px 0 0; }
@keyframes in-deal { from { opacity: 0; transform: translateY(10px) rotate(var(--r)); } }
.in-pop { position: absolute; top: calc(100% + 12px); z-index: 30; width: min(320px, calc(100vw - 48px)); padding: 18px 18px 16px 30px; text-align: left; cursor: auto; background-color: ${C.card}; background-image: repeating-linear-gradient(transparent 0 25px, ${C.grid} 25px 26px), linear-gradient(90deg, transparent 18px, ${C.red} 18px 19.5px, transparent 19.5px); border: 1px solid ${C.printLine}; border-radius: 3px; box-shadow: 0 24px 40px -20px ${C.shadow}; transform-origin: top left; animation: in-pop .28s cubic-bezier(.3,.7,.3,1.3) backwards; }
.in-pop[data-align="right"] { transform-origin: top right; }
.in-pop::before { content: ""; position: absolute; top: -11px; left: 40%; width: 74px; height: 22px; background: ${C.tape}; transform: rotate(-4deg); }
@keyframes in-pop { from { opacity: 0; transform: translateY(-6px) scale(.96) rotate(-1deg); } }
.in-ref { font-family: ${FONT.hand}; color: ${C.ink}; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
.in-ref:hover { text-decoration-style: wavy; }
@media (max-width: 640px) { .in-card { padding: 16px 14px 18px; } .in-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; } .in-tab { padding: 8px 11px 7px; font-size: 10.5px; } }
@media (prefers-reduced-motion: reduce) { .in-tile, .in-pop { animation: none; } .in-tile, .in-tab { transition: none; } }
`

// Hobby doodles, drawn on a 40 × 40 grid.
const DOODLES: Record<string, (p: Pen) => void> = {
    plane: (p) => {
        p.curve([[2, 37], [10, 34], [16, 36], [22, 33]], { stroke: C.pencil, sw: 1, dash: "2 3", seed: 1 })
        p.ellipse(20, 20, 32, 7, { fill: C.hlB, stroke: "none", seed: 2 })
        p.raw("M4 20 Q20 15 37 19 Q20 25 4 20 Z", { stroke: C.ink, sw: 1.3 })
        p.lines([[17, 19], [23, 5], [26, 5], [23, 19]], { stroke: C.ink, sw: 1.2, seed: 3 })
        p.lines([[17, 21], [23, 35], [26, 35], [23, 21]], { stroke: C.ink, sw: 1.2, seed: 4 })
        p.lines([[7, 19], [3, 12], [6, 12], [10, 19]], { stroke: C.ink, sw: 1.1, seed: 5 })
        p.lines([[7, 21], [3, 28], [6, 28], [10, 21]], { stroke: C.ink, sw: 1.1, seed: 6 })
    },
    bird: (p) => {
        p.line(6, 35, 37, 36, { stroke: C.pencil, sw: 1.4, seed: 7 })
        p.ellipse(19, 24, 20, 13, { fill: C.hlO, seed: 8, sw: 1.3 })
        p.ellipse(29, 16, 9, 9, { fill: C.hlO, seed: 9, sw: 1.3 })
        p.lines([[33, 15], [38, 16], [33, 18]], { stroke: C.ink, sw: 1.1, seed: 10 })
        p.ellipse(30, 15, 1.6, 1.6, { fill: C.inkk, stroke: "none", seed: 11 })
        p.lines([[10, 23], [2, 19], [4, 26], [10, 27]], { stroke: C.ink, sw: 1.1, seed: 12 })
        p.curve([[13, 22], [19, 20], [24, 25]], { stroke: C.ink, sw: 1, seed: 13 })
        p.line(18, 30, 17, 35, { stroke: C.ink, sw: 1, seed: 14 })
        p.line(22, 30, 23, 35, { stroke: C.ink, sw: 1, seed: 15 })
    },
    book: (p) => {
        p.raw("M20 9 Q12 6 3 8 L3 32 Q12 30 20 33 Z", { stroke: C.ink, sw: 1.2 })
        p.raw("M20 9 Q28 6 37 8 L37 32 Q28 30 20 33 Z", { stroke: C.ink, sw: 1.2 })
        for (let i = 0; i < 4; i++) {
            p.line(6, 13 + i * 4.5, 17, 14 + i * 4.5, { stroke: C.pencil, sw: 0.8, seed: 20 + i })
            p.line(23, 14 + i * 4.5, 34, 13 + i * 4.5, { stroke: C.pencil, sw: 0.8, seed: 30 + i })
        }
        p.raw("M30 26 Q32 30 30 33 Q28 30 30 26 Z", { stroke: C.red, sw: 1.2 })
    },
    tv: (p) => {
        p.line(15, 11, 10, 3, { stroke: C.ink, sw: 1.1, seed: 40 })
        p.line(20, 11, 26, 3, { stroke: C.ink, sw: 1.1, seed: 41 })
        p.rect(4, 11, 32, 21, { stroke: C.ink, sw: 1.3, rough: 0.8, seed: 42 })
        p.rect(7, 14, 19, 15, { stroke: C.ink, sw: 1, fill: C.hlB, gap: 3, seed: 43 })
        p.ellipse(31, 18, 3.5, 3.5, { seed: 44, sw: 1 })
        p.ellipse(31, 25, 3.5, 3.5, { seed: 45, sw: 1 })
        p.line(9, 32, 7, 37, { stroke: C.ink, sw: 1.1, seed: 46 })
        p.line(31, 32, 33, 37, { stroke: C.ink, sw: 1.1, seed: 47 })
    },
    paddle: (p) => {
        p.lines([[21, 23], [30, 34], [33, 31], [24, 21]], { stroke: C.ink, sw: 1.2, seed: 50 })
        p.ellipse(16, 16, 22, 22, { fill: C.red, seed: 51, sw: 1.3 })
        p.ellipse(33, 9, 6, 6, { fill: C.hlO, seed: 52, sw: 1.1 })
        p.curve([[25, 13], [28, 11], [30, 10]], { stroke: C.pencil, sw: 0.8, dash: "2 2", seed: 53 })
    },
    pan: (p) => {
        for (let i = 0; i < 3; i++) p.curve([[11 + i * 6, 18], [13 + i * 6, 14], [10 + i * 6, 10], [12 + i * 6, 5]], { stroke: C.pencil, sw: 1, seed: 60 + i })
        p.ellipse(17, 26, 26, 10, { fill: C.hlO, seed: 63, sw: 1.3 })
        p.lines([[29, 25], [39, 21]], { stroke: C.ink, sw: 2, seed: 64 })
    },
}

function Doodle({ name, size }: { name: string; size: number }) {
    const draw = DOODLES[name]
    if (!draw) return null
    const p = new Pen()
    draw(p)
    return (
        <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
            {p.els}
        </svg>
    )
}

// Pencil pseudo-logos for the sitcom references: sketches, not the shows' real marks.
function PseudoLogo({ name }: { name: string }) {
    const base: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 3, marginRight: 7, verticalAlign: "middle", lineHeight: 1.2 }
    if (name === "office")
        return <span style={{ ...base, background: "#1E1E1E", color: "#fff", fontFamily: FONT.mono, fontSize: 10, padding: "1px 6px", transform: "rotate(-2deg)", border: "1px solid #fff" }}>the office</span>
    if (name === "parks")
        return (
            <span style={{ ...base, background: "#2F7D3A", color: "#fff", fontFamily: FONT.hand, fontSize: 11, padding: "1px 7px", borderRadius: 3, border: "2px solid #7A5230", transform: "rotate(1.5deg)" }}>
                Parks &amp; Rec
            </span>
        )
    if (name === "modern")
        return (
            <span style={{ ...base, fontFamily: FONT.serif, fontSize: 14, color: C.inkk, transform: "rotate(-1deg)" }}>
                <svg viewBox="0 0 14 12" width={14} height={12} aria-hidden="true">
                    <path d="M1 6 L7 1 L13 6 M3 5 V11 H11 V5" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" />
                </svg>
                modern family
            </span>
        )
    return null
}

type Ref = { text: string; href: string; logo?: string }
type Tile = { title: string; icon: string; why: string; refs: Ref[] }
type Tab = { name: string; desc: string; tiles: Tile[] }

function toHref(s: string, basePath: string) {
    if (!s) return ""
    return /^(\/|#|https?:|mailto:)/.test(s) ? s : `${basePath}${s}`
}

function parse(data: string, basePath: string): Tab[] {
    const tabs: Tab[] = []
    for (const raw of (data || "").replace(/\r/g, "").split("\n")) {
        const line = raw.trim()
        if (!line) continue
        if (line.startsWith("###")) {
            const [head, ...why] = line.slice(3).split("|")
            const m = head.match(/\{([^}]+)\}/)
            tabs[tabs.length - 1]?.tiles.push({ title: head.replace(/\{[^}]+\}/, "").trim(), icon: m ? m[1].trim().toLowerCase() : "", why: why.join("|").trim(), refs: [] })
        } else if (line.startsWith("##")) {
            const [name, ...desc] = line.slice(2).split("|")
            tabs.push({ name: name.trim(), desc: desc.join("|").trim(), tiles: [] })
        } else if (line.startsWith("-")) {
            const tiles = tabs[tabs.length - 1]?.tiles
            const tile = tiles?.[tiles.length - 1]
            const [raw, target] = line.slice(1).split("|").map((s) => s.trim())
            const m = raw.match(/\{logo:([a-z]+)\}/)
            tile?.refs.push({ text: raw.replace(/\{logo:[a-z]+\}\s*/, ""), href: toHref(target || "", basePath), logo: m ? m[1] : undefined })
        }
    }
    return tabs
}

interface Props {
    data: string
    basePath: string
    whyLabel: string
    refsLabel: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Interests({ data, basePath, whyLabel, refsLabel, style }: Props) {
    const tabs = parse(data, basePath)
    const uid = useUid()
    const [sel, setSel] = React.useState(0)
    const [openTile, setOpenTile] = React.useState<{ i: number; pinned: boolean; align: "left" | "right" } | null>(null)
    const gridRef = React.useRef<HTMLDivElement>(null)
    const closeTimer = React.useRef<number | undefined>(undefined)
    const tab = tabs[Math.min(sel, tabs.length - 1)]

    const show = (i: number, pinned: boolean, el: HTMLElement) => {
        window.clearTimeout(closeTimer.current)
        const grid = gridRef.current?.getBoundingClientRect()
        const r = el.getBoundingClientRect()
        const popW = Math.min(320, window.innerWidth - 48)
        const align = grid && r.left + popW > Math.min(grid.right + 24, window.innerWidth - 12) ? "right" : "left"
        setOpenTile((o) => (pinned && o && o.i === i && o.pinned ? null : { i, pinned, align }))
    }
    const hide = () => {
        window.clearTimeout(closeTimer.current)
        closeTimer.current = window.setTimeout(() => setOpenTile((o) => (o && !o.pinned ? null : o)), 160)
    }

    React.useEffect(() => {
        if (!openTile?.pinned) return
        const onDown = (e: PointerEvent) => {
            if (!(e.target as Element)?.closest?.(`[data-in="${uid}"]`)) setOpenTile(null)
        }
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenTile(null)
        document.addEventListener("pointerdown", onDown)
        document.addEventListener("keydown", onKey)
        return () => {
            document.removeEventListener("pointerdown", onDown)
            document.removeEventListener("keydown", onKey)
        }
    }, [openTile?.pinned, uid])

    const onTabKey = (e: React.KeyboardEvent) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
        e.preventDefault()
        const next = (sel + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length
        setSel(next)
        setOpenTile(null)
        document.getElementById(`${uid}-t${next}`)?.focus()
    }

    if (!tab) return <div style={{ ...style, minHeight: 1 }} />
    const color = TABS[sel % TABS.length]

    return (
        <div style={{ ...style }} data-in={uid}>
            <style>{CSS + PENCIL_CSS}</style>
            <div className="in-tabs" role="tablist" aria-label="Interests" onKeyDown={onTabKey}>
                {tabs.map((t, i) => (
                    <button
                        key={t.name}
                        type="button"
                        role="tab"
                        id={`${uid}-t${i}`}
                        className="in-tab"
                        aria-selected={i === sel}
                        aria-controls={`${uid}-panel`}
                        tabIndex={i === sel ? 0 : -1}
                        style={{ background: i === sel ? C.card : TABS[i % TABS.length], boxShadow: i === sel ? `inset 0 4px 0 ${TABS[i % TABS.length]}` : undefined }}
                        onClick={() => {
                            setSel(i)
                            setOpenTile(null)
                        }}
                    >
                        {t.name}
                    </button>
                ))}
            </div>
            <div className="in-card" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-t${sel}`}>
                <p style={{ margin: 0, maxWidth: "60ch", fontFamily: FONT.hand, fontSize: "clamp(17px, 2.1vw, 20px)", lineHeight: 1.5, color: C.ink }}>{tab.desc}</p>
                <div className="in-grid" ref={gridRef} key={sel}>
                    {tab.tiles.map((t, i) => {
                        const isOpen = openTile?.i === i
                        return (
                            <div key={t.title} style={{ position: "relative", ["--i" as any]: i }} onMouseEnter={(e) => show(i, false, e.currentTarget)} onMouseLeave={hide}>
                                <button
                                    type="button"
                                    className="in-tile"
                                    style={{ ["--i" as any]: i, width: "100%", height: "100%" }}
                                    aria-expanded={isOpen}
                                    aria-controls={`${uid}-w${i}`}
                                    onClick={(e) => show(i, true, e.currentTarget.parentElement as HTMLElement)}
                                    onFocus={(e) => show(i, false, e.currentTarget.parentElement as HTMLElement)}
                                >
                                    <span className="in-band" style={{ background: color }} aria-hidden="true" />
                                    {t.icon && (
                                        <span style={{ width: 34, height: 34, marginTop: 4 }} aria-hidden="true">
                                            {t.icon.startsWith("d:") ? <Doodle name={t.icon.slice(2)} size={36} /> : <PencilSvg name={t.icon} uid={`${uid}-${sel}-${i}`} size={34} />}
                                        </span>
                                    )}
                                    <span style={{ fontFamily: FONT.hand, fontSize: 17, lineHeight: 1.3, color: C.inkk, marginTop: t.icon ? 0 : 8 }}>{t.title}</span>
                                    <span style={{ marginTop: "auto", fontFamily: FONT.mono, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: C.print }}>why? ↗</span>
                                </button>
                                {isOpen && (
                                    <div
                                        className="in-pop"
                                        id={`${uid}-w${i}`}
                                        role="note"
                                        data-align={openTile?.align}
                                        style={openTile?.align === "right" ? { right: 0 } : { left: 0 }}
                                        onMouseEnter={() => window.clearTimeout(closeTimer.current)}
                                    >
                                        {t.icon.startsWith("d:") && (
                                            <div style={{ float: "right", margin: "0 0 4px 10px", transform: "rotate(-4deg)" }}>
                                                <Doodle name={t.icon.slice(2)} size={64} />
                                            </div>
                                        )}
                                        <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: C.red }}>{whyLabel}</div>
                                        <div style={{ fontFamily: FONT.scrawl, fontSize: 28, lineHeight: 1.05, color: C.ink, margin: "2px 0 6px" }}>{t.title}</div>
                                        <p style={{ margin: 0, fontFamily: FONT.hand, fontSize: 15.5, lineHeight: "26px", color: C.inkk }}>{t.why}</p>
                                        {t.refs.length > 0 && (
                                            <>
                                                <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: C.print }}>{refsLabel}</div>
                                                <ul style={{ margin: "4px 0 0", padding: 0, listStyle: "none", fontSize: 15.5, lineHeight: "26px" }}>
                                                    {t.refs.map((r) => (
                                                        <li key={r.text} style={{ marginBottom: 2 }}>
                                                            {r.logo && <PseudoLogo name={r.logo} />}
                                                            {r.href ? (
                                                                <a className="in-ref" href={r.href}>
                                                                    {r.text} →
                                                                </a>
                                                            ) : (
                                                                <span style={{ fontFamily: FONT.hand, color: C.inkk }}>{r.text}</span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

addPropertyControls(Interests, {
    data: {
        type: ControlType.String,
        title: "Tabs & cards",
        displayTextArea: true,
        defaultValue: "## Embedded | Small computers with hard deadlines.\n### RTOS & failsafes {nxp} | Why this card is on the board.\n- Wingman | wingman",
    },
    basePath: { type: ControlType.String, title: "Project path", defaultValue: "/projects/" },
    whyLabel: { type: ControlType.String, title: "Why label", defaultValue: "Why it interests me" },
    refsLabel: { type: ControlType.String, title: "Refs label", defaultValue: "Where it shows up" },
})
