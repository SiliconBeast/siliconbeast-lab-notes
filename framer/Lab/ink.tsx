import * as React from "react"

// Shared hand-drawn renderer for the lab-notebook components.
// Every stroke is seeded, so server and client render the same wobble.

const tok = (id: string, fallback: string) => `var(--token-${id}, ${fallback})`

export const C = {
    mat: tok("rc69XzrUB", "#D9E3DA"),
    matLine: tok("dFRBeVWFN", "rgba(28, 82, 60, 0.13)"),
    paper: tok("aIWxwfzWH", "#FBFAF4"),
    card: tok("uUxKv9cIR", "#FFFEF9"),
    grid: tok("xcJfNafyX", "rgba(70, 120, 200, 0.10)"),
    gridMajor: tok("IqnO4kgmh", "rgba(70, 120, 200, 0.19)"),
    print: tok("PDiw8VoFN", "#74777D"),
    printLine: tok("D4Tx6iP8v", "#B6B8BD"),
    ink: tok("XXMTG9jYN", "#1F3A93"),
    inkk: tok("cZ5PgjUQu", "#22252B"),
    pencil: tok("zpsiQwqDy", "#5A5D63"),
    red: tok("wa_Q6vFvM", "#C8322B"),
    green: tok("FVL3JU7cj", "#1E7F4E"),
    hl: tok("WYU3SllcG", "rgba(250, 226, 70, 0.72)"),
    hlG: tok("qMpOp90tJ", "rgba(120, 235, 140, 0.55)"),
    hlB: tok("ObeHdPdlB", "rgba(120, 190, 255, 0.5)"),
    hlP: tok("kJeLW6oBk", "rgba(255, 125, 185, 0.5)"),
    hlO: tok("dRtH1yc5l", "rgba(255, 170, 90, 0.55)"),
    sticky: tok("W0igZrzGd", "#FCE77A"),
    stickyInk: tok("hSuficCUj", "#2A2416"),
    tape: tok("AOjZQVCD3", "rgba(236, 226, 190, 0.82)"),
    steelTop: tok("J0CVpHEeJ", "#ECEEF1"),
    steelBottom: tok("Hu6PYuvEx", "#C5C9CF"),
    steelInk: tok("ANkbjAwk7", "#2C2F35"),
    clip: tok("tNOaMypFO", "#8C9198"),
    ua: tok("gqLBp4xDR", "#275D38"),
    uaGold: tok("YMTFSeGC3", "rgba(242, 205, 0, 0.6)"),
    cover: tok("vLc0w5apD", "#1C4F8A"),
    coverLabel: tok("nhRuzuU3X", "#EAF2FC"),
    shadow: tok("xVJ_exQfM", "rgba(25, 35, 25, 0.42)"),
}

export const FONT = {
    hand: '"Architects Daughter", "Architects Daughter Placeholder", "Comic Sans MS", cursive',
    scrawl: '"Caveat", "Caveat Placeholder", cursive',
    mono: '"JetBrains Mono", "JetBrains Mono Placeholder", ui-monospace, monospace',
    serif: '"Instrument Serif", "Instrument Serif Placeholder", Georgia, serif',
}

// Theme selectors used by ThemeToggle (data-sb-theme on <body>) plus the OS setting.
export const DARK = {
    media: '@media (prefers-color-scheme: dark) { body:not([data-sb-theme="light"]) ',
    attr: 'body[data-sb-theme="dark"] ',
}

export function rnd(seed: number) {
    let s = (Math.abs(Math.floor(seed)) % 2147483646) + 1
    return () => {
        s = (s * 16807) % 2147483647
        return (s - 1) / 2147483646
    }
}

export function hash(str: string) {
    let h = 11
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 99991
    return h + 1
}

export type Opt = {
    stroke?: string
    sw?: number
    rough?: number
    seed?: number
    fill?: string
    fillStyle?: "hachure" | "solid"
    gap?: number
    fw?: number
    dash?: string
    opacity?: number
}

type TextOpt = { size?: number; fill?: string; font?: string; anchor?: "start" | "middle" | "end"; weight?: number }

const f = (n: number) => n.toFixed(1)

export class Pen {
    els: React.ReactElement[] = []
    private k = 0
    private n = 0

    private wob(pts: number[][], o: Opt) {
        const r = rnd(o.seed ?? 7)
        const amp = (o.rough ?? 1) * 1.1
        let d = ""
        for (let pass = 0; pass < 2; pass++) {
            for (let i = 0; i < pts.length - 1; i++) {
                const a = pts[i]
                const b = pts[i + 1]
                const len = Math.hypot(b[0] - a[0], b[1] - a[1])
                const j = Math.min(amp, len / 12) + 0.3
                const q = () => (r() - 0.5) * 2 * j
                d += `M${f(a[0] + q())} ${f(a[1] + q())}Q${f((a[0] + b[0]) / 2 + q() * 1.4)} ${f((a[1] + b[1]) / 2 + q() * 1.4)} ${f(b[0] + q())} ${f(b[1] + q())}`
            }
        }
        return d
    }

    private push(d: string, o: Opt, color: string, width: number) {
        const i = this.n++
        this.els.push(
            <path
                key={this.k++}
                d={d}
                fill="none"
                style={{ stroke: color, ["--d" as any]: `${Math.min(i * 0.025, 0.9).toFixed(3)}s` }}
                strokeWidth={width}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={o.dash}
                className={o.dash ? "sk-dash" : "sk-draw"}
                pathLength={o.dash ? undefined : 1}
                opacity={o.opacity}
            />
        )
    }

    line(x1: number, y1: number, x2: number, y2: number, o: Opt = {}) {
        this.push(this.wob([[x1, y1], [x2, y2]], o), o, o.stroke ?? C.ink, o.sw ?? 1.4)
    }

    lines(pts: number[][], o: Opt = {}) {
        this.push(this.wob(pts, o), o, o.stroke ?? C.ink, o.sw ?? 1.4)
    }

    curve(pts: number[][], o: Opt = {}) {
        const r = rnd(o.seed ?? 5)
        let d = ""
        for (let pass = 0; pass < 2; pass++) {
            const p = pts.map(([x, y]) => [x + (r() - 0.5) * 0.9, y + (r() - 0.5) * 0.9])
            d += `M${f(p[0][0])} ${f(p[0][1])}`
            for (let i = 1; i < p.length - 1; i++) {
                const mx = (p[i][0] + p[i + 1][0]) / 2
                const my = (p[i][1] + p[i + 1][1]) / 2
                d += `Q${f(p[i][0])} ${f(p[i][1])} ${f(mx)} ${f(my)}`
            }
            const last = p[p.length - 1]
            d += `L${f(last[0])} ${f(last[1])}`
        }
        this.push(d, o, o.stroke ?? C.ink, o.sw ?? 1.4)
    }

    rect(x: number, y: number, w: number, h: number, o: Opt = {}) {
        if (o.fill && o.fillStyle === "solid") {
            this.els.push(<rect key={this.k++} x={x} y={y} width={w} height={h} style={{ fill: o.fill }} />)
        } else if (o.fill) {
            const gap = o.gap ?? 6
            const r = rnd((o.seed ?? 3) + 99)
            let d = ""
            for (let c = -h; c < w; c += gap) {
                const t0 = Math.max(0, -c)
                const t1 = Math.min(h, w - c)
                if (t1 <= t0) continue
                const q = () => (r() - 0.5) * 1.2
                d += `M${f(x + c + t0 + q())} ${f(y + h - t0 + q())}L${f(x + c + t1 + q())} ${f(y + h - t1 + q())}`
            }
            this.push(d, {}, o.fill, o.fw ?? 1)
        }
        if (o.stroke !== "none") this.lines([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], o)
    }

    ellipse(cx: number, cy: number, w: number, h: number, o: Opt = {}) {
        const r = rnd(o.seed ?? 3)
        const pts: number[][] = []
        const n = 28
        const start = r() * 6
        for (let i = 0; i <= n + 2; i++) {
            const t = start + (i / n) * Math.PI * 2
            const k = 1 + (r() - 0.5) * 0.06
            pts.push([cx + (Math.cos(t) * w * k) / 2, cy + (Math.sin(t) * h * k) / 2])
        }
        if (o.fill) this.els.push(<ellipse key={this.k++} cx={cx} cy={cy} rx={w / 2} ry={h / 2} style={{ fill: o.fill }} />)
        this.curve(pts, { ...o, fill: undefined })
    }

    arc(cx: number, cy: number, w: number, h: number, a0: number, a1: number, o: Opt = {}) {
        const pts: number[][] = []
        for (let i = 0; i <= 20; i++) {
            const t = a0 + ((a1 - a0) * i) / 20
            pts.push([cx + (Math.cos(t) * w) / 2, cy + (Math.sin(t) * h) / 2])
        }
        this.curve(pts, o)
    }

    raw(d: string, o: Opt = {}) {
        this.push(d, o, o.stroke ?? C.ink, o.sw ?? 1.4)
        this.push(d, { ...o, opacity: 0.55 }, o.stroke ?? C.ink, (o.sw ?? 1.4) * 0.6)
    }

    text(x: number, y: number, s: string, o: TextOpt = {}) {
        this.els.push(
            <text
                key={this.k++}
                x={x}
                y={y}
                textAnchor={o.anchor ?? "middle"}
                fontFamily={o.font ?? FONT.hand}
                fontSize={o.size ?? 15}
                fontWeight={o.weight}
                style={{ fill: o.fill ?? C.inkk }}
            >
                {s}
            </text>
        )
    }
}

// Pencil draws itself: paths get pathLength=1. "sk-arm" hides them (dash of 1) while the figure
// waits below the fold or under the notebook cover; "sk-on" draws them in.
export const DRAW_CSS = `
.sk-arm .sk-draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
.sk-arm .sk-dash { opacity: 0; }
.sk-on .sk-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: sk-draw .7s ease forwards; animation-delay: var(--d, 0s); }
.sk-on .sk-dash { opacity: 0; animation: sk-fade .5s ease forwards; animation-delay: .5s; }
@keyframes sk-draw { to { stroke-dashoffset: 0; } }
@keyframes sk-fade { to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .sk-arm .sk-draw, .sk-on .sk-draw, .sk-arm .sk-dash, .sk-on .sk-dash { animation: none; stroke-dasharray: none; opacity: 1; } }
`

export type DrawState = "idle" | "arm" | "on"

// Hides a figure's strokes once mounted, then plays the drawing when it scrolls into view.
// Figures under the notebook cover wait until the cover has opened.
export function useDrawOn(ref: React.RefObject<Element>, enabled: boolean): DrawState {
    const [state, setState] = React.useState<DrawState>("idle")
    React.useEffect(() => {
        const el = ref.current
        if (!enabled || !el || typeof IntersectionObserver === "undefined") return
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        setState("arm")
        let io: IntersectionObserver | null = null
        const watch = () => {
            io = new IntersectionObserver(
                (entries) => {
                    if (entries.some((e) => e.isIntersecting)) {
                        setState("on")
                        io?.disconnect()
                    }
                },
                { rootMargin: "0px 0px -12% 0px" }
            )
            io.observe(el)
        }
        if ((window as any).__sbCover) window.addEventListener("sb-cover-gone", watch, { once: true })
        else watch()
        return () => {
            io?.disconnect()
            window.removeEventListener("sb-cover-gone", watch)
        }
    }, [enabled])
    return state
}

// Tracks an element's rendered size; falls back to the given size before layout.
export function useSize(ref: React.RefObject<Element>, fallback: { w: number; h: number }) {
    const [size, setSize] = React.useState(fallback)
    React.useEffect(() => {
        const el = ref.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(([entry]) => {
            const w = Math.round(entry.contentRect.width)
            const h = Math.round(entry.contentRect.height)
            if (w > 0) setSize((s) => (s.w === w && s.h === h ? s : { w, h }))
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])
    return size
}
