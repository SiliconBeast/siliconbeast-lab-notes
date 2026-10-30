import * as React from "react"
import { C, DARK } from "./ink.tsx"
import { PATHS, META } from "./icons.ts"

// Coloured-pencil logo renderer shared by PencilIcon and TechIcons.
// Each logo is drawn twice (a light-paper and a blueprint pencil colour); CSS shows the right one.

function hexRgb(h: string) {
    const s = h.replace("#", "")
    return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16))
}
function lum(c: number[]) {
    return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255
}
function mix(c: number[], t: number[], k: number) {
    return `rgb(${c.map((x, i) => Math.round(x + (t[i] - x) * k)).join(",")})`
}
function pen(hex: string, dark: boolean) {
    const c = hexRgb(hex)
    const L = lum(c)
    if (dark) return L < 0.45 ? mix(c, [255, 255, 255], 0.6 - L * 0.6) : mix(c, [255, 255, 255], 0.1)
    return L > 0.62 ? mix(c, [0, 0, 0], 0.28) : hex
}

export const PENCIL_CSS = `
.pi-d { display: none; }
${DARK.attr}.pi-d { display: inline; } ${DARK.attr}.pi-l { display: none; }
.pi-wrap:hover .pi-svg { transform: rotate(-6deg) scale(1.08); }
.pi-svg { transition: transform .25s cubic-bezier(.3,.7,.3,1.4); }
`

export function label(key: string) {
    return META[key]?.[0] ?? key
}

export function PencilSvg({ name, uid, size }: { name: string; uid: string; size?: number | string }) {
    const meta = META[name] ?? [name, "#5A5D63"]
    const d = PATHS[meta[2] ?? name]
    const filter = `sk-${uid}`
    const layer = (dark: boolean) => {
        const col = pen(meta[1], dark)
        const pid = `hp-${uid}-${dark ? "d" : "l"}`
        if (d)
            return (
                <g className={dark ? "pi-d" : "pi-l"}>
                    <defs>
                        <pattern id={pid} width="1.25" height="1.25" patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
                            <line x1="0" y1="0" x2="0" y2="1.25" stroke={col} strokeWidth="0.8" />
                        </pattern>
                    </defs>
                    <path d={d} fill={col} opacity={0.28} />
                    <path d={d} fill={`url(#${pid})`} />
                    <path d={d} fill="none" stroke={col} strokeWidth={0.35} transform="translate(.4 -.3)" />
                </g>
            )
        const text = meta[0].split(" ")[0]
        const fs = text.length > 5 ? 4.2 : text.length > 3 ? 5 : 6
        return (
            <g className={dark ? "pi-d" : "pi-l"}>
                <defs>
                    <pattern id={pid} width="1.25" height="1.25" patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
                        <line x1="0" y1="0" x2="0" y2="1.25" stroke={col} strokeWidth="0.8" />
                    </pattern>
                </defs>
                <rect x="2.5" y="5.5" width="19" height="13" rx="1.2" fill={`url(#${pid})`} />
                <rect x="2.5" y="5.5" width="19" height="13" rx="1.2" fill={col} opacity={0.22} />
                <text x="12" y="13.9" textAnchor="middle" fontFamily='"JetBrains Mono", ui-monospace, monospace' fontWeight={700} fontSize={fs} style={{ fill: C.inkk }}>
                    {text}
                </text>
            </g>
        )
    }
    const pins = []
    if (!d)
        for (let i = 0; i < 4; i++) {
            const x = 6.5 + i * 3.7
            pins.push(<path key={i} d={`M${x} 5.5 V3 M${x} 18.5 V21`} style={{ stroke: C.inkk }} strokeWidth={0.7} strokeLinecap="round" />)
        }
    return (
        <svg className="pi-svg" viewBox="-1.5 -1.5 27 27" width={size} height={size} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
            <defs>
                <filter id={filter} x="-10%" y="-10%" width="120%" height="120%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={4} result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="0.8" result="d" />
                    <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves={1} seed={9} result="g" />
                    <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1 1.4" result="m" />
                    <feComposite in="d" in2="m" operator="in" />
                </filter>
            </defs>
            <g filter={`url(#${filter})`}>
                {pins}
                {layer(false)}
                {layer(true)}
                {d ? (
                    <path d={d} fill="none" style={{ stroke: C.inkk }} strokeWidth={0.5} strokeLinejoin="round" opacity={0.85} />
                ) : (
                    <rect x="2.5" y="5.5" width="19" height="13" rx="1.2" fill="none" style={{ stroke: C.inkk }} strokeWidth={0.55} />
                )}
            </g>
        </svg>
    )
}

export function useUid() {
    const id = (React as any).useId ? (React as any).useId() : String(Math.random())
    return String(id).replace(/[^a-zA-Z0-9_-]/g, "")
}
