import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { C, FONT, useDrawOn } from "./ink.tsx"

// A signature that writes itself when it scrolls into view, one pen stroke after another.
// Paste a real signature as SVG path data (one "d" string per stroke, separated by |, in pen order).
// Timing ("start:duration" per stroke, in seconds) replays the pen's real pace; Duration rescales it.

const CSS = `
.sig-arm .sig-p { stroke-dasharray: 1 2; stroke-dashoffset: 1.05; opacity: 0; }
.sig-on .sig-p { stroke-dasharray: 1 2; stroke-dashoffset: 1.05; opacity: 0; animation: sig-stroke var(--t, 1s) cubic-bezier(.3, .05, .6, .95) forwards; animation-delay: var(--d, 0s); }
.sig-arm .sig-t { stroke-dasharray: 380; stroke-dashoffset: 380; fill-opacity: 0; }
.sig-on .sig-t { stroke-dasharray: 380; stroke-dashoffset: 380; fill-opacity: 0; animation: sig-stroke 2.4s cubic-bezier(.45,.1,.3,1) forwards, sig-fill .7s 1.9s ease forwards; }
@keyframes sig-stroke { from { opacity: 1; } to { opacity: 1; stroke-dashoffset: 0; } }
@keyframes sig-fill { to { fill-opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .sig-arm .sig-t, .sig-on .sig-t, .sig-arm .sig-p, .sig-on .sig-p { animation: none; stroke-dasharray: none; fill-opacity: 1; opacity: 1; } }
`

// Rough length of a path from its coordinates (deterministic, so server and client agree).
function approxLength(d: string) {
    const n = (d.match(/-?\d*\.?\d+/g) || []).map(Number)
    let len = 0
    for (let i = 2; i + 1 < n.length; i += 2) len += Math.hypot(n[i] - n[i - 2], n[i + 1] - n[i - 1])
    return len
}

interface Props {
    name: string
    paths: string
    viewBox: string
    timing: string
    color: "ink" | "red"
    duration: number
    strokeWidth: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Signature({ name, paths, viewBox, timing: timingSpec, color, duration, strokeWidth, style }: Props) {
    const ref = React.useRef<HTMLDivElement>(null)
    const draw = useDrawOn(ref, RenderTarget.current() !== RenderTarget.canvas)
    const ink = color === "red" ? C.red : C.ink
    const list = (paths || "")
        .split("|")
        .map((d) => d.trim())
        .filter(Boolean)
    const real = (timingSpec || "")
        .split(",")
        .map((t) => t.split(":").map(Number))
        .filter((t) => t.length === 2 && t.every((n) => isFinite(n)))
    let timing: { d: number; t: number }[]
    if (real.length === list.length && list.length) {
        const total = Math.max(...real.map(([a, b]) => a + b)) || 1
        const k = duration > 0 ? duration / total : 1
        timing = real.map(([a, b]) => ({ d: a * k, t: Math.max(0.08, b * k) }))
    } else {
        // Without a recording, each stroke gets a share of the time by length, with a pen lift between.
        const lens = list.map(approxLength)
        const total = lens.reduce((a, b) => a + b, 0) || 1
        const lift = 0.2
        const writing = Math.max(0.5, duration - lift * (list.length - 1))
        let at = 0
        timing = lens.map((l) => {
            const t = Math.max(0.18, (l / total) * writing)
            const out = { d: at, t }
            at += t + lift
            return out
        })
    }
    return (
        <div ref={ref} className={draw === "idle" ? undefined : `sig-${draw}`} style={{ ...style }}>
            <style>{CSS}</style>
            {list.length ? (
                <svg viewBox={viewBox || "0 0 340 80"} role="img" aria-label={`Signature: ${name}`} style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}>
                    {list.map((d, i) => (
                        <path
                            key={i}
                            className="sig-p"
                            d={d}
                            pathLength={1}
                            fill="none"
                            style={{ stroke: ink, ["--d" as any]: `${timing[i].d.toFixed(2)}s`, ["--t" as any]: `${timing[i].t.toFixed(2)}s` }}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}
                </svg>
            ) : (
                <svg viewBox="0 0 340 80" role="img" aria-label={`Signature: ${name}`} style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}>
                    <text className="sig-t" x="6" y="60" transform="rotate(-3 170 40)" fontFamily={FONT.scrawl} fontSize={58} style={{ fill: ink, stroke: ink }} strokeWidth={0.8}>
                        {name}
                    </text>
                </svg>
            )}
        </div>
    )
}

addPropertyControls(Signature, {
    name: { type: ControlType.String, title: "Name", defaultValue: "Suvir Duggal" },
    paths: { type: ControlType.String, title: "Signature paths", defaultValue: "", displayTextArea: true, description: "SVG path data per stroke, separated by |" },
    viewBox: { type: ControlType.String, title: "ViewBox", defaultValue: "0 0 340 80" },
    timing: { type: ControlType.String, title: "Timing", defaultValue: "", description: "start:duration per stroke, from a recording" },
    color: { type: ControlType.Enum, title: "Pen", options: ["ink", "red"], optionTitles: ["Blue ink", "Red pen"], defaultValue: "red" },
    duration: { type: ControlType.Number, title: "Duration (s)", defaultValue: 3.2, min: 1, max: 8, step: 0.1 },
    strokeWidth: { type: ControlType.Number, title: "Stroke", defaultValue: 2.6, min: 0.5, max: 6, step: 0.1 },
})
