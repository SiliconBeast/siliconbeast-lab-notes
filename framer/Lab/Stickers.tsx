import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { FONT, hash, rnd } from "./ink.tsx"

// Awards as die-cut stickers stuck onto the sheet. One sticker per line:
//   Kicker | Title | Footer | shape (burst, circle or tag) | colour

const CSS = `
.stk { list-style: none; margin: 0; padding: 4px; display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: center; justify-content: center; }
.stk li { transition: transform .3s cubic-bezier(.3,.7,.3,1.4), filter .3s; filter: drop-shadow(0 1px .5px rgba(0,0,0,.22)) drop-shadow(0 3px 4px rgba(0,0,0,.08)); }
.stk li:hover { transform: rotate(0deg) scale(1.05) translateY(-1px) !important; filter: drop-shadow(0 2px 1px rgba(0,0,0,.22)) drop-shadow(0 6px 8px rgba(0,0,0,.1)); }
@media (prefers-reduced-motion: reduce) { .stk li { transition: none; } }
`

const INK = "#1E2430"

function burstPath(cx: number, cy: number, r: number, n: number) {
    let d = ""
    for (let i = 0; i < n * 2; i++) {
        const a = (i * Math.PI) / n - Math.PI / 2
        const rr = i % 2 ? r * 0.88 : r
        d += `${i ? "L" : "M"}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`
    }
    return d + "Z"
}

type Item = { kicker: string; title: string; foot: string; shape: string; color: string }

function parse(items: string): Item[] {
    return (items || "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
            const [kicker = "", title = "", foot = "", shape = "circle", color = "#F2C94C"] = l.split("|").map((s) => s.trim())
            return { kicker, title, foot, shape: shape.toLowerCase(), color }
        })
}

function Sticker({ item, size, seed }: { item: Item; size: number; seed: number }) {
    const tag = item.shape === "tag"
    const w = tag ? Math.round(size * 1.45) : size
    const h = tag ? Math.round(size * 0.72) : size
    const c = size / 2
    let shape: React.ReactNode
    let ring: React.ReactNode
    if (tag) {
        const d = `M10 4H${w - 10}Q${w - 4} 4 ${w - 4} 10V${h - 10}Q${w - 4} ${h - 4} ${w - 10} ${h - 4}H10Q4 ${h - 4} 4 ${h - 10}V10Q4 4 10 4Z`
        shape = <path d={d} />
        ring = <rect x={11} y={11} width={w - 22} height={h - 22} rx={4} />
    } else if (item.shape === "burst") {
        shape = <path d={burstPath(c, c, c - 4, 14)} strokeLinejoin="round" />
        ring = <circle cx={c} cy={c} r={c - 15} />
    } else {
        shape = <circle cx={c} cy={c} r={c - 4} />
        ring = <circle cx={c} cy={c} r={c - 11} />
    }
    const r = rnd(seed)
    const rot = ((r() - 0.5) * 14).toFixed(1)
    return (
        <li style={{ transform: `rotate(${rot}deg)` }}>
            <div style={{ position: "relative", width: w, height: h }}>
                <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                    <g fill={item.color} stroke="#fff" strokeWidth={5}>
                        {shape}
                    </g>
                    <g fill="none" stroke={INK} strokeOpacity={0.35} strokeWidth={1} strokeDasharray="3 3">
                        {ring}
                    </g>
                    <ellipse cx={w * 0.32} cy={h * 0.24} rx={w * 0.2} ry={h * 0.08} fill="#fff" opacity={0.1} transform={`rotate(-25 ${w * 0.32} ${h * 0.24})`} />
                </svg>
                <div
                    style={{
                        position: "absolute",
                        inset: tag ? "12px 16px" : `${Math.round(size * 0.2)}px ${Math.round(size * 0.17)}px`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        color: INK,
                        gap: 2,
                    }}
                >
                    {item.kicker && <span style={{ fontFamily: FONT.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", lineHeight: 1.1 }}>{item.kicker}</span>}
                    <span style={{ fontFamily: FONT.hand, fontSize: tag ? 14 : 13, lineHeight: 1.08 }}>{item.title}</span>
                    {item.foot && <span style={{ fontFamily: FONT.mono, fontSize: 8.5, letterSpacing: ".08em", lineHeight: 1.1, opacity: 0.8 }}>{item.foot}</span>}
                </div>
            </div>
        </li>
    )
}

interface Props {
    items: string
    size: number
    label: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Stickers({ items, size, label, style }: Props) {
    const list = parse(items)
    return (
        <ul className="stk" aria-label={label} style={{ ...style }}>
            <style>{CSS}</style>
            {list.map((it, i) => (
                <Sticker key={it.title + i} item={it} size={size} seed={hash(it.title) + i * 7} />
            ))}
        </ul>
    )
}

addPropertyControls(Stickers, {
    items: {
        type: ControlType.String,
        title: "Stickers",
        displayTextArea: true,
        defaultValue: "UASU | Outstanding Innovation Award | 2026 | burst | #F7D154",
        description: "Kicker | Title | Footer | burst, circle or tag | colour",
    },
    size: { type: ControlType.Number, title: "Size", defaultValue: 112, min: 70, max: 180, step: 1 },
    label: { type: ControlType.String, title: "Label", defaultValue: "Awards" },
})
