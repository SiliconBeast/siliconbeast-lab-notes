import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { C, FONT, Pen, DRAW_CSS, useDrawOn, useSize } from "./ink.tsx"

// Hand-drawn figures for the notebook: block diagrams (fixed 440 × 250 drawing)
// and charts (drawn at the real width so labels stay readable on phones).

type Ctx = { p: Pen; W: number; H: number; now?: number | null }

function node(p: Pen, x: number, y: number, w: number, h: number, label: string, o: any = {}) {
    p.rect(x, y, w, h, {
        stroke: o.stroke ?? C.ink,
        sw: 1.4,
        rough: 1.4,
        seed: label.length * 31 + x,
        fill: o.fill,
        gap: 6,
        fw: 0.9,
        dash: o.dash,
    })
    const lines = label.split("\n")
    lines.forEach((ln, i) =>
        p.text(x + w / 2, y + h / 2 + 5 + (i - (lines.length - 1) / 2) * 18, ln, { size: o.size ?? 15, fill: o.text ?? C.inkk })
    )
}

function arrow(p: Pen, x1: number, y1: number, x2: number, y2: number, o: any = {}) {
    const c = o.stroke ?? C.ink
    const seed = Math.round(x1 * 3 + y1 * 7 + x2 + y2)
    p.line(x1, y1, x2, y2, { stroke: c, sw: 1.4, rough: 1.1, seed, dash: o.dash })
    const a = Math.atan2(y2 - y1, x2 - x1)
    const L = 10
    p.lines(
        [
            [x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45)],
            [x2, y2],
            [x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45)],
        ],
        { stroke: c, sw: 1.4, rough: 0.6, seed: seed + 1 }
    )
    if (o.label)
        p.text((x1 + x2) / 2 + (o.dx ?? 0), (y1 + y2) / 2 - 8 + (o.dy ?? 0), o.label, {
            size: 16,
            fill: o.lc ?? C.pencil,
            font: FONT.scrawl,
        })
}

function note(p: Pen, x: number, y: number, s: string, fill: string, o: any = {}) {
    p.text(x, y, s, { size: o.size ?? 17, fill, font: FONT.scrawl, anchor: o.anchor ?? "middle" })
}

const DIAGRAMS: Record<string, (c: Ctx) => void> = {
    telus: ({ p }) => {
        note(p, 220, 16, "rolled out to every device by parallel SSH", C.pencil, { size: 16 })
        node(p, 8, 30, 118, 64, "OpenWrt\ndevices (arm64)")
        node(p, 160, 30, 120, 64, "Go gNMI\nagent", { fill: C.hl })
        node(p, 314, 30, 118, 64, "gRPC\nstream")
        arrow(p, 126, 62, 158, 62)
        arrow(p, 280, 62, 312, 62, { label: "push", lc: C.green })
        node(p, 314, 136, 118, 64, "collector\n+ ML anomaly")
        node(p, 160, 136, 120, 64, "Grafana\n35+ metrics")
        arrow(p, 373, 95, 373, 134)
        arrow(p, 313, 168, 282, 168)
        note(p, 8, 150, "before: every", C.red, { anchor: "start" })
        note(p, 8, 170, "30+ min ✗", C.red, { anchor: "start" })
        note(p, 8, 198, "after: ~5 s ✓", C.green, { anchor: "start" })
        note(p, 296, 236, "plus 6,500+ API tests guarding it", C.pencil, { size: 16 })
    },
    wingman: ({ p }) => {
        node(p, 8, 24, 96, 56, "camera")
        node(p, 140, 24, 160, 56, "Jetson GPU\nperception", { fill: C.hl })
        note(p, 372, 46, "CUDA Kalman", C.pencil, { size: 16 })
        note(p, 372, 66, "tracker bank", C.pencil, { size: 16 })
        arrow(p, 104, 52, 138, 52)
        arrow(p, 220, 82, 220, 148, { label: "UDP + CRC-16", dx: 60, dy: 6 })
        node(p, 140, 150, 160, 60, "i.MX RT1170\nsafety MCU")
        node(p, 336, 150, 96, 60, "driver\nalerts")
        arrow(p, 300, 180, 334, 180)
        note(p, 8, 118, "GPU hangs?", C.red, { anchor: "start" })
        note(p, 8, 140, "failsafe ≤ 100 ms", C.red, { anchor: "start" })
        note(p, 220, 236, "Zephyr RTOS state machine", C.pencil, { size: 16 })
    },
    rf: ({ p }) => {
        note(p, 56, 18, "car sensors", C.pencil, { size: 16 })
        ;["speed", "battery V", "GPS"].forEach((l, i) => {
            node(p, 8, 28 + i * 58, 96, 40, l, { size: 14 })
            arrow(p, 104, 48 + i * 58, 140, 110)
        })
        node(p, 142, 78, 112, 64, "STM32\nfirmware (C)", { fill: C.hl })
        node(p, 290, 30, 120, 60, "RF PCB\n(KiCad)")
        arrow(p, 254, 96, 288, 70)
        const w: number[][] = []
        for (let i = 0; i <= 12; i++) w.push([350 + (i % 2 ? 9 : -9), 94 + i * 6])
        p.lines(w, { stroke: C.ink, sw: 1.3, rough: 0.6, seed: 41 })
        note(p, 398, 138, "radio", C.pencil, { size: 16 })
        node(p, 290, 172, 120, 52, "pit laptop\nlive data")
        note(p, 8, 232, "validated while driving ✓", C.green, { anchor: "start" })
    },
    scout: ({ p }) => {
        ;["LoRa", "GNSS", "NFC", "RF detect"].forEach((l, i) => {
            node(p, 8, 12 + i * 50, 96, 38, l, { size: 14 })
            arrow(p, 104, 31 + i * 50, 166, 108)
        })
        node(p, 168, 76, 124, 64, "STM32WL\nfirmware", { fill: C.hl })
        node(p, 330, 76, 100, 64, "power\ngating")
        arrow(p, 292, 108, 328, 108)
        note(p, 300, 196, "target: week-long standby", C.green)
        note(p, 300, 222, "custom Arduino UNO Q shield", C.pencil, { size: 16 })
    },
    riscv: ({ p }) => {
        p.rect(6, 6, 428, 206, { stroke: C.pencil, sw: 1.1, rough: 1, seed: 77, dash: "7 6" })
        node(p, 22, 24, 124, 58, "RV32I core\n(VHDL)")
        node(p, 296, 24, 124, 58, "Mandelbrot\nGPU", { fill: C.hl })
        note(p, 221, 48, "20 hardware", C.pencil, { size: 16 })
        note(p, 221, 66, "multipliers →", C.pencil, { size: 16 })
        p.line(30, 120, 412, 120, { stroke: C.ink, sw: 2.2, rough: 0.8, seed: 5 })
        note(p, 221, 112, "memory-mapped bus", C.pencil, { size: 15 })
        p.line(84, 82, 84, 120, { stroke: C.ink, sw: 1.3, rough: 0.8, seed: 6 })
        p.line(358, 82, 358, 120, { stroke: C.ink, sw: 1.3, rough: 0.8, seed: 7 })
        ;(
            [
                ["C firmware\n(ROM/RAM)", 22],
                ["HDMI\nvideo", 159],
                ["PWM\naudio", 296],
            ] as [string, number][]
        ).forEach(([label, x], i) => {
            p.line(x + 62, 120, x + 62, 146, { stroke: C.ink, sw: 1.3, rough: 0.8, seed: 9 + i })
            node(p, x, 148, 124, 50, label, { size: 14 })
        })
        note(p, 220, 238, "all on a Tang Nano 9K FPGA", C.pencil, { size: 17 })
    },
    bio: ({ p }) => {
        node(p, 8, 30, 104, 46, "temperature", { size: 14 })
        node(p, 8, 96, 104, 46, "humidity", { size: 14 })
        note(p, 60, 166, "one AM2320 sensor", C.pencil, { size: 16 })
        node(p, 146, 52, 112, 70, "STM32\nfirmware", { fill: C.hl })
        arrow(p, 112, 53, 144, 76)
        arrow(p, 112, 119, 144, 98)
        arrow(p, 258, 87, 296, 87, { label: "Bridge", lc: C.pencil })
        node(p, 298, 14, 136, 56, "GRU forecaster\nanomaly check")
        node(p, 298, 104, 136, 56, "biogas process\nmodel")
        node(p, 298, 186, 136, 44, "LEDs + dashboard", { size: 14 })
        arrow(p, 366, 72, 366, 102)
        arrow(p, 366, 162, 366, 184)
        node(p, 146, 186, 112, 44, "gas sensor", { size: 14, dash: "5 5", stroke: C.red, text: C.red })
        p.line(150, 190, 254, 226, { stroke: C.red, sw: 2, rough: 1, seed: 3 })
        p.line(254, 190, 150, 226, { stroke: C.red, sw: 2, rough: 1, seed: 4 })
        note(p, 202, 246, "not needed", C.red)
    },
    site: ({ p }) => {
        node(p, 8, 24, 124, 56, "CMS content\n(projects, roles)")
        node(p, 8, 150, 124, 56, "Framer layouts\n3 screen sizes")
        node(p, 166, 82, 128, 72, "React + TS\ncode components", { fill: C.hl })
        arrow(p, 132, 52, 164, 100)
        arrow(p, 132, 178, 164, 136)
        node(p, 330, 20, 104, 52, "rough-pen\nSVG figures")
        node(p, 330, 96, 104, 52, "3D cover +\ntheme switch")
        node(p, 330, 172, 104, 52, "signature\nreplay")
        arrow(p, 294, 100, 328, 50)
        arrow(p, 294, 118, 328, 122)
        arrow(p, 294, 136, 328, 196)
        note(p, 220, 246, "no image files in any figure", C.green, { size: 16 })
    },

}

const CHARTS: Record<string, { h: number | ((W: number) => number); draw: (c: Ctx) => void }> = {
    latency: {
        h: 200,
        draw: ({ p, W, H }) => {
            const x0 = 74
            const x1 = W - 16
            const base = H - 34
            const sc = (t: number) => x0 + ((x1 - x0) * t) / 1800
            const o = { stroke: C.ink, sw: 1.3, rough: 1.2, seed: 5 }
            p.line(x0, 14, x0, base + 6, o)
            p.line(x0 - 6, base, x1 + 6, base, { ...o, seed: 6 })
            p.text(x0 - 10, 66, "before", { anchor: "end", size: 15 })
            p.text(x0 - 10, 134, "after", { anchor: "end", size: 15 })
            p.rect(x0, 42, x1 - x0, 38, { stroke: C.ink, sw: 1.3, rough: 1.4, fill: C.red, gap: 5, seed: 8 })
            p.rect(x0, 110, Math.max(2.4, sc(5) - x0), 38, { stroke: C.green, sw: 2, rough: 0.8, seed: 9 })
            note(p, x1 - 4, 34, "30+ min = 1800 s", C.red, { anchor: "end" })
            note(p, x0 + 16, 136, "5 s ← yes, that sliver", C.green, { anchor: "start", size: 19 })
            const step = W < 560 ? 600 : 300
            for (let t = 0; t <= 1800; t += step) {
                const x = sc(t)
                p.line(x, base, x, base + 6, { ...o, seed: 10 + t })
                p.text(x, base + 22, `${t} s`, { size: 11, fill: C.print, font: FONT.mono })
            }
        },
    },
    speedups: {
        h: 190,
        draw: ({ p, W, H }) => {
            const x0 = 18
            const x1 = W - 70
            const base = H - 30
            const lx = (v: number) => x0 + ((x1 - x0) * Math.log10(v)) / 3
            const rows: [string, number, string][] = [
                ["TELUS telemetry: 30+ min → 5 s", 360, C.ink],
                ["Onboarding bot: 4 h → 30 s", 480, C.green],
            ]
            rows.forEach(([label, v, fill], i) => {
                const y = 36 + i * 62
                p.text(x0, y, label, { anchor: "start", size: 15 })
                p.rect(x0, y + 8, lx(v) - x0, 24, { stroke: C.ink, sw: 1.2, rough: 1.2, fill, gap: 5, seed: 20 + i })
                note(p, lx(v) + 8, y + 28, `${v}×`, C.green, { anchor: "start", size: 24 })
            })
            p.line(x0, base, x1, base, { stroke: C.ink, sw: 1.2, rough: 0.8, seed: 30 })
            ;[1, 10, 100, 1000].forEach((t, i) => {
                const x = lx(t)
                p.line(x, base - 4, x, base + 5, { stroke: C.ink, sw: 1.2, rough: 0.5, seed: 31 + i })
                p.text(x, base + 20, `${t}×`, { size: 11, fill: C.print, font: FONT.mono, anchor: i === 0 ? "start" : "middle" })
            })
            note(p, x1, 18, "log scale: each tick is 10× more", C.pencil, { anchor: "end", size: 16 })
        },
    },
    timeline: {
        // four lanes instead of one row per role, so the chart stays readable when roles overlap
        h: (W) => (W < 560 ? 376 : 312),
        draw: ({ p, W, H, now }) => {
            const narrow = W < 560
            const m0 = 5
            const m1 = 49
            const x0 = narrow ? 8 : 104
            const x1 = W - 10
            const base = H - 30
            const mx = (m: number) => x0 + ((x1 - x0) * (m - m0)) / (m1 - m0)
            const today = now ?? 34.9
            // months count from Jan 2024; end null = still going; "long|short" labels, short used on phones
            type Bar = { label: string; a0: number; b0: number | null; fill?: string; kind?: "squiggle" | "plan"; sub?: number }
            const lanes: { name: string; bars: Bar[] }[] = [
                {
                    name: "Work",
                    bars: [
                        { label: "Data analyst|Analyst", a0: 5, b0: 8, fill: C.hlP },
                        { label: "Research assistant|Research", a0: 9, b0: 13, fill: C.hlB },
                        { label: "Instructor & TA|Instructor", a0: 16, b0: 20, fill: C.hlG },
                        { label: "TELUS SWE intern|TELUS", a0: 24, b0: 32, fill: C.hl },
                        { label: "TA", a0: 32, b0: null, fill: C.hlP },
                    ],
                },
                {
                    name: "Leadership",
                    bars: [
                        { label: "ESS coordinator|ESS", a0: 6, b0: 16, fill: C.hlO },
                        { label: "VP External · CompE Club|VP External", a0: 16, b0: 29, fill: C.hlB },
                        { label: "Engineering Leader|Eng. Leader", a0: 27, b0: null, fill: C.hlO, sub: 1 },
                    ],
                },
                { name: "EcoCar", bars: [{ label: "PCB, RF + firmware|RF + firmware", a0: 26, b0: null, kind: "squiggle" }] },
                { name: "Next co-op", bars: [{ label: "your team? · 4 or 8 months|your team? · 4–8 mo", a0: 40, b0: 48, kind: "plan" }] },
            ]
            const ROW = 46
            let y = 6
            lanes.forEach((lane, li) => {
                if (narrow) {
                    p.text(x0, y + 10, lane.name.toUpperCase(), { anchor: "start", size: 9.5, fill: C.print, font: FONT.mono })
                    y += 16
                }
                const subs = Math.max(...lane.bars.map((b) => b.sub ?? 0)) + 1
                if (!narrow) p.text(x0 - 14, y + 30, lane.name.toUpperCase(), { anchor: "end", size: 10, fill: C.print, font: FONT.mono })
                for (let s = 0; s < subs; s++) {
                    const top = y + s * ROW
                    // label slots above and below the bars of this sub-row; a label takes the first free one
                    const used: [number, number][][] = [[], []]
                    lane.bars
                        .filter((b) => (b.sub ?? 0) === s)
                        .forEach((bar, bi) => {
                            const [long, short] = bar.label.split("|")
                            const label = narrow && short ? short : long
                            const a = mx(bar.a0)
                            const b = mx(bar.b0 ?? today)
                            const plan = bar.kind === "plan"
                            const size = plan ? 16 : 13
                            const tw = label.length * (plan ? 6.4 : 6.6)
                            const lx = Math.max(x0, Math.min(a, x1 - tw))
                            const slot = used.findIndex((u) => u.every(([u0, u1]) => lx > u1 + 8 || lx + tw < u0 - 8))
                            if (slot >= 0) {
                                used[slot].push([lx, lx + tw])
                                p.text(lx, slot === 0 ? top + 12 : top + 44, label, {
                                    anchor: "start",
                                    size,
                                    fill: plan ? C.pencil : C.inkk,
                                    font: plan ? FONT.scrawl : FONT.hand,
                                })
                            }
                            const seed = 50 + li * 10 + s * 5 + bi
                            if (bar.kind === "squiggle") {
                                const pts: number[][] = []
                                for (let x = a; x <= b; x += 4) pts.push([x, top + 24 + Math.sin((x - a) / 4.2) * 5])
                                p.curve(pts, { stroke: C.green, sw: 2, seed })
                            } else if (plan) {
                                p.rect(a, top + 17, b - a, 14, { stroke: C.pencil, sw: 1.2, rough: 1, seed, dash: "4 4" })
                                // the 8-month option gets a tick where the 4-month one would end
                                if (bar.b0 !== null && bar.b0 - bar.a0 > 4) {
                                    const t = mx(bar.a0 + 4)
                                    p.line(t, top + 19, t, top + 29, { stroke: C.pencil, sw: 1, rough: 0.3, seed: seed + 1, dash: "2 3" })
                                }
                            } else {
                                p.rect(a, top + 17, Math.max(3, b - a), 14, { stroke: C.ink, sw: 1.2, rough: 1.1, fill: bar.fill, fillStyle: "solid", seed })
                            }
                            if (bar.b0 === null) {
                                // still going: a dashed arrow past today
                                const yy = top + 24
                                p.line(b + 2, yy, b + 18, yy, { stroke: C.pencil, sw: 1.1, rough: 0.4, seed: seed + 2, dash: "3 3" })
                                p.lines([[b + 13, yy - 4], [b + 19, yy], [b + 13, yy + 4]], { stroke: C.pencil, sw: 1.1, rough: 0.3, seed: seed + 3 })
                            }
                        })
                }
                y += subs * ROW + 8
            })
            p.line(x0, base, x1, base, { stroke: C.ink, sw: 1.2, rough: 0.8, seed: 60 })
            ;(
                [
                    [12, "2025"],
                    [24, "2026"],
                    [36, "2027"],
                    [48, "2028"],
                ] as [number, string][]
            ).forEach(([m, label], i) => {
                const x = mx(m)
                p.line(x, base - 5, x, base + 5, { stroke: C.ink, sw: 1.2, rough: 0.4, seed: 61 + i })
                p.text(x, base + 20, label, { size: 11.5, fill: C.print, font: FONT.mono })
            })
            if (now !== null && now > m0 && now < m1) {
                const nx = mx(now)
                p.line(nx, 4, nx, base, { stroke: C.red, sw: 1.1, rough: 0.5, seed: 70, dash: "3 4" })
                note(p, nx + 4, base - 6, "today", C.red, { anchor: "start", size: 16 })
            }
        },
    },
    timing: {
        h: 220,
        draw: ({ p, W, H }) => {
            const lx = 96
            const x1 = W - 12
            const tc = lx + (x1 - lx) * 0.46
            const tf = tc + Math.min(90, (x1 - lx) * 0.2)
            const rowsY = [44, 104, 164]
            const hi = 22
            ;["heartbeat", "perception", "failsafe"].forEach((label, i) => p.text(lx - 12, rowsY[i] - 4, label, { anchor: "end", size: 14 }))
            const hb: number[][] = [[lx, rowsY[0]]]
            let x = lx
            while (x + 30 < tc) {
                x += 22
                hb.push([x, rowsY[0]], [x, rowsY[0] - hi], [x + 8, rowsY[0] - hi], [x + 8, rowsY[0]])
                x += 8
            }
            hb.push([x1, rowsY[0]])
            p.lines(hb, { stroke: C.ink, sw: 1.5, rough: 0.5, seed: 80 })
            for (let k = 1; k <= 3; k++) {
                const mx2 = x + k * 30
                if (mx2 < x1 - 8) note(p, mx2, rowsY[0] - 6, "✗", C.red, { size: 18 })
            }
            p.lines(
                [
                    [lx, rowsY[1] - hi],
                    [tc, rowsY[1] - hi],
                    [tc, rowsY[1]],
                    [x1, rowsY[1]],
                ],
                { stroke: C.ink, sw: 1.5, rough: 0.5, seed: 81 }
            )
            note(p, tc + 8, rowsY[1] - 6, "GPU hangs", C.red, { anchor: "start", size: 17 })
            p.lines(
                [
                    [lx, rowsY[2]],
                    [tf, rowsY[2]],
                    [tf, rowsY[2] - hi],
                    [x1, rowsY[2] - hi],
                ],
                { stroke: C.green, sw: 2, rough: 0.5, seed: 82 }
            )
            note(p, Math.min(x1, tf + 10), rowsY[2] - hi - 8, "alerts keep running ✓", C.green, { anchor: "start", size: 17 })
            ;[tc, tf].forEach((xx, i) => p.line(xx, 14, xx, H - 34, { stroke: C.pencil, sw: 1, rough: 0.4, seed: 83 + i, dash: "3 4" }))
            const yd = H - 22
            p.line(tc, yd, tf, yd, { stroke: C.red, sw: 1.4, rough: 0.4, seed: 85 })
            p.lines([[tc + 7, yd - 4], [tc, yd], [tc + 7, yd + 4]], { stroke: C.red, sw: 1.4, rough: 0.3, seed: 86 })
            p.lines([[tf - 7, yd - 4], [tf, yd], [tf - 7, yd + 4]], { stroke: C.red, sw: 1.4, rough: 0.3, seed: 87 })
            note(p, tf + 8, yd + 6, "≤ 100 ms", C.red, { anchor: "start", size: 20 })
        },
    },
    packet: {
        h: 170,
        draw: ({ p, W }) => {
            const x0 = 8
            const x1 = W - 8
            const y = 34
            const h = 48
            const fields: [string, number, string][] = [
                ["speed", 0.3, C.hlB],
                ["battery V", 0.32, C.hlG],
                ["GPS position", 0.38, C.hl],
            ]
            let x = x0
            note(p, x0, 22, "one telemetry update", C.pencil, { anchor: "start", size: 17 })
            fields.forEach(([label, share, fill], i) => {
                const w = (x1 - x0) * share
                p.rect(x, y, w, h, { stroke: C.ink, sw: 1.3, rough: 1.1, fill, gap: 6, seed: 90 + i })
                p.text(x + w / 2, y + h / 2 + 5, label, { size: 15 })
                x += w
            })
            const wy = y + h + 26
            const pts: number[][] = []
            for (let i = 0; i <= 10; i++) pts.push([x0 + 14 + i * 9, wy + (i % 2 ? -7 : 7)])
            p.lines(pts, { stroke: C.ink, sw: 1.3, rough: 0.5, seed: 95 })
            note(p, x0 + 118, wy + 6, W < 470 ? "over RF to the pit, live ✓" : "over RF, from STM32 to the pit laptop, live ✓", C.green, {
                anchor: "start",
                size: 17,
            })
        },
    },
    tools: {
        h: 210,
        draw: ({ p, W, H }) => {
            const gw = Math.min(260, W * 0.52)
            const bw = (gw - 12) / 2
            const bh = 46
            const gx = 8
            const gy = 34
            note(p, gx, 22, "4+ separate field tools", C.red, { anchor: "start", size: 17 })
            ;["LoRa radio", "GPS unit", "NFC reader", "RF detector"].forEach((label, i) => {
                const x = gx + (i % 2) * (bw + 12)
                const y = gy + Math.floor(i / 2) * (bh + 12)
                node(p, x, y, bw, bh, label, { size: W < 460 ? 11.5 : 14, stroke: C.pencil })
            })
            const ax = gx + gw + 8
            const bx = Math.max(ax + 40, W - Math.min(170, W * 0.34) - 8)
            arrow(p, ax, gy + bh + 6, bx - 4, gy + bh + 6, { stroke: C.green })
            node(p, bx, gy + 6, W - 8 - bx, bh * 2 - 12, "SignalScout\none pocket", { fill: C.hl, size: W < 460 ? 13 : 15 })
            note(p, W - 8, H - 12, "target: a week on standby", C.green, { anchor: "end", size: 17 })
        },
    },
    mults: {
        h: 190,
        draw: ({ p, W }) => {
            const per = W < 560 ? 10 : 20
            const gap = 6
            const sq = Math.min(30, (W - 16 - gap * (per - 1)) / per)
            const cols = [C.hlB, C.hlG, C.hl, C.hlP, C.hlO, C.hlB]
            const y0 = 30
            note(p, 8, 20, "20 hardware multipliers on the FPGA", C.pencil, { anchor: "start", size: 17 })
            for (let i = 0; i < 20; i++) {
                const x = 8 + (i % per) * (sq + gap)
                const y = y0 + Math.floor(i / per) * (sq + gap)
                const spare = i >= 18
                if (spare) p.rect(x, y, sq, sq, { stroke: C.pencil, sw: 1.1, rough: 1, seed: 100 + i, dash: "3 3" })
                else p.rect(x, y, sq, sq, { stroke: C.ink, sw: 1.1, rough: 1, fill: cols[Math.floor(i / 3)], fillStyle: "solid", seed: 100 + i })
                p.text(x + sq / 2, y + sq / 2 + 4, spare ? "–" : "×", { size: 12, fill: spare ? C.pencil : C.inkk, font: FONT.mono })
            }
            const yb = y0 + (20 / per) * (sq + gap) + 22
            note(p, 8, yb, "each colour = one Mandelbrot step (3 multiplies)", C.inkk, { anchor: "start", size: 17 })
            note(p, 8, yb + 24, "6 steps × 3 = 18 ≤ 20, 2 spare", C.green, { anchor: "start", size: 19 })
        },
    },
}

const LABELS: Record<string, string> = {
    telus: "Block diagram: OpenWrt devices stream through a Go gNMI agent and gRPC to an ML collector and Grafana; latency fell from 30+ minutes to about 5 seconds",
    wingman: "Block diagram: camera feeds Jetson GPU perception, which talks over UDP with CRC-16 to an i.MX RT1170 safety MCU that drives the alerts",
    rf: "Block diagram: speed, battery voltage and GPS go into STM32 firmware, out through an RF PCB over radio to a pit laptop",
    scout: "Block diagram: LoRa, GNSS, NFC and an RF detector feed STM32WL firmware with power gating",
    riscv: "Block diagram: RV32I core and a Mandelbrot GPU share a memory-mapped bus with firmware, HDMI video and PWM audio on a Tang Nano 9K FPGA",
    bio: "Block diagram: an AM2320 temperature and humidity sensor feeds STM32 firmware, which passes readings over Bridge to a GRU anomaly forecaster and a biogas process model on the Linux side; results show on LEDs and a dashboard. No gas sensor is needed",
    site: "Block diagram: CMS content and Framer layouts for three screen sizes feed React and TypeScript code components, which draw the SVG figures, the 3D cover and theme switch, and the signature replay",
    latency: "Bar chart: telemetry latency was 1800 seconds before and 5 seconds after",
    speedups: "Log-scale chart: telemetry 360 times faster, onboarding 480 times faster",
    timeline: "Timeline in four lanes. Work: data analyst Jun to Aug 2024, research assistant Oct 2024 to Jan 2025, instructor and TA May to Aug 2025, TELUS software engineer intern Jan to Aug 2026, teaching assistant since Sep 2026. Leadership: ESS coordinator Jul 2024 to Apr 2025, VP External of the Computer Engineering Club May 2025 to May 2026, Engineering Leader since Apr 2026. EcoCar club since Mar 2026. Next: a 4 or 8 month co-op from May 2027",
    timing: "Timing diagram: when the GPU stops sending heartbeats, the failsafe takes over within 100 milliseconds",
    packet: "Each radio update carries speed, battery voltage and GPS position",
    tools: "Four separate field tools replaced by one pocket device",
    mults: "Twenty hardware multipliers: six Mandelbrot steps of three multiplies each, two spare",
}

interface Props {
    figure: string
    animate: boolean
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Sketch(props: Props) {
    const { figure, animate, style } = props
    const ref = React.useRef<HTMLDivElement>(null)
    const key = (figure || "").trim().toLowerCase()
    const chart = CHARTS[key]
    const { w } = useSize(ref, { w: 640, h: 0 })
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const draw = useDrawOn(ref, animate && !isCanvas)
    // "today" marker on the timeline is set after mount so server and client markup match
    const [now, setNow] = React.useState<number | null>(null)
    React.useEffect(() => {
        const d = new Date()
        setNow((d.getFullYear() - 2024) * 12 + d.getMonth() + d.getDate() / 31)
    }, [])

    const p = new Pen()
    let vw = 440
    let vh = 250
    if (chart) {
        vw = Math.max(280, w)
        vh = typeof chart.h === "function" ? chart.h(vw) : chart.h
        chart.draw({ p, W: vw, H: vh, now })
    } else if (DIAGRAMS[key]) {
        DIAGRAMS[key]({ p, W: vw, H: vh })
    }
    if (!chart && !DIAGRAMS[key]) return <div ref={ref} style={{ ...style, minHeight: 1 }} aria-hidden="true" />

    return (
        <div ref={ref} style={{ ...style, width: "100%" }} className={draw === "idle" ? undefined : `sk-${draw}`}>
            <style>{DRAW_CSS}</style>
            <svg
                viewBox={`0 0 ${vw} ${vh}`}
                width="100%"
                role="img"
                aria-label={LABELS[key]}
                style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}
            >
                {p.els}
            </svg>
        </div>
    )
}

addPropertyControls(Sketch, {
    figure: {
        type: ControlType.String,
        title: "Figure",
        defaultValue: "telus",
        description: "telus, wingman, rf, scout, riscv, bio, site, latency, speedups, timeline, timing, packet, tools, mults",
    },
    animate: { type: ControlType.Boolean, title: "Draw on", defaultValue: true },
})
