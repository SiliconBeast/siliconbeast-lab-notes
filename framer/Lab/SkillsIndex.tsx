import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, FONT } from "./ink.tsx"

// Appendix A: every skill, grouped, with circled project numbers that link to the project sheets.
// Rows use the format  Skill name: 1, 3  and categories start with  # Category name.
// "also:" lines list extra skills without project links.

const DEFAULT = `# Languages
C: 3, 4, 5
C++: 2
Go: 1
Python: 2
CUDA: 2
VHDL: 5
also: Java · SQL · JavaScript · MATLAB · Verilog
# Embedded & firmware
STM32 microcontrollers: 3, 4
Zephyr RTOS: 2
Bare-metal C drivers (memory-mapped I/O): 5
Low-power design (power gating): 4
CAN bus: 3
Safety state machines: 2
# Hardware & PCB
PCB design in KiCad: 3, 4
Soldering and board bring-up: 3
FPGA (Gowin, Xilinx): 5
RTL design: 5
RF: LoRa, GNSS, NFC: 3, 4
NVIDIA Jetson: 2
also: Vivado · Cadence · LTspice · Raspberry Pi
# Software & cloud
Docker: 1
gRPC / gNMI streaming: 1
Grafana dashboards: 1
Linux (OpenWrt, arm64): 1
also: Redis · InfluxDB · AWS · GCP · REST APIs · Git · CI/CD
# Testing & systems
Property-based API testing: 1
Load and stress testing: 1
Distributed systems: 1
ML anomaly detection: 1, 6
GPU memory optimization: 2
Fixed-point pipelines: 5
# Ways of working
Agile and Jira: 1
Code and design reviews: 1
Docs and incident runbooks: 1
AI-assisted development (Claude Code): 4`

// refs are project-sheet numbers, or "work" for something used on the job (links to the experience section)
type Row = { name: string; refs: (number | "work")[] } | { also: string }
type Cat = { title: string; rows: Row[] }

function parse(src: string): Cat[] {
    const cats: Cat[] = []
    for (const raw of src.split("\n")) {
        const line = raw.trim()
        if (!line) continue
        if (line.startsWith("#")) {
            cats.push({ title: line.replace(/^#+\s*/, ""), rows: [] })
            continue
        }
        if (!cats.length) cats.push({ title: "Skills", rows: [] })
        const cat = cats[cats.length - 1]
        if (/^also:/i.test(line)) {
            cat.rows.push({ also: line.replace(/^also:\s*/i, "") })
            continue
        }
        const m = /^(.*):\s*((?:\d+|work)(?:\s*,\s*(?:\d+|work))*)$/i.exec(line)
        if (m)
            cat.rows.push({
                name: m[1].trim(),
                refs: m[2]
                    .split(",")
                    .map((n) => n.trim().toLowerCase())
                    .map((n) => (n === "work" ? "work" : parseInt(n, 10)))
                    .filter((n) => n === "work" || !isNaN(n)) as (number | "work")[],
            })
        else cat.rows.push({ name: line, refs: [] })
    }
    return cats
}

const CSS = `
.sbx details { border-bottom: 1.5px solid ${C.printLine}; }
.sbx summary { list-style: none; display: grid; grid-template-columns: minmax(0, 1fr) auto 30px; gap: 14px; align-items: baseline; padding: 12px 4px; cursor: pointer; }
.sbx summary::-webkit-details-marker { display: none; }
.sbx summary:hover h3 { text-decoration: underline wavy ${C.hl}; text-decoration-thickness: 3px; text-underline-offset: 6px; }
.sbx .pm::before { content: "+"; } .sbx details[open] .pm::before { content: "–"; }
.sbx a.ref { display: inline-grid; place-items: center; width: 31px; height: 29px; font-family: ${FONT.scrawl}; font-size: 17px; font-weight: 600; text-decoration: none; color: ${C.ink}; border: 1.6px solid ${C.ink}; border-radius: 52% 46% 55% 44% / 48% 56% 44% 52%; transform: rotate(-4deg); transition: background .2s, transform .2s; }
.sbx a.ref.work { width: auto; padding: 0 9px; font-size: 15px; }
.sbx a.ref:nth-child(2n) { transform: rotate(5deg); border-radius: 46% 54% 44% 56% / 55% 45% 53% 47%; }
.sbx a.ref:hover, .sbx a.ref:focus-visible { background: ${C.hl}; transform: rotate(0) scale(1.08); }
.sbx a.ref:focus-visible, .sbx summary:focus-visible { outline: 2px dashed ${C.ink}; outline-offset: 3px; }
`

interface Props {
    data: string
    slugs: string
    titles: string
    openCount: number
    basePath: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function SkillsIndex({ data, slugs, titles, openCount, basePath, style }: Props) {
    const cats = parse(data || DEFAULT)
    const slugList = slugs.split(",").map((s) => s.trim())
    const titleList = titles.split(",").map((s) => s.trim())
    return (
        <div className="sbx" style={{ ...style, borderTop: `1.5px solid ${C.printLine}` }}>
            <style>{CSS}</style>
            {cats.map((cat, ci) => {
                const count = cat.rows.reduce((n, r) => n + ("also" in r ? r.also.split("·").length : 1), 0)
                return (
                    <details key={cat.title} open={ci < openCount}>
                        <summary>
                            <h3 style={{ margin: 0, fontFamily: FONT.hand, fontWeight: 400, fontSize: 22, color: C.inkk }}>{cat.title}</h3>
                            <span style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: C.print }}>{count} skills</span>
                            <span className="pm" aria-hidden="true" style={{ fontFamily: FONT.scrawl, fontSize: 30, lineHeight: 0, textAlign: "center", color: C.ink }} />
                        </summary>
                        <ul style={{ listStyle: "none", margin: 0, padding: "0 4px 14px 22px" }}>
                            {cat.rows.map((r, ri) =>
                                "also" in r ? (
                                    <li key={ri} style={{ padding: "6px 0", fontFamily: FONT.hand, fontSize: 15.5, color: C.pencil }}>
                                        also: {r.also}
                                    </li>
                                ) : (
                                    <li
                                        key={ri}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: 14,
                                            padding: "5px 0",
                                            borderBottom: `1px dashed ${C.gridMajor}`,
                                            fontFamily: FONT.hand,
                                            fontSize: 17.5,
                                            color: C.ink,
                                        }}
                                    >
                                        <span>{r.name}</span>
                                        <span style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end", flex: "none" }}>
                                            {r.refs.map((n) => {
                                                if (n === "work")
                                                    return (
                                                        <a key="work" className="ref work" href="/#experience" title="Used at work: see the experience section" aria-label="Used at work: see the experience section">
                                                            work
                                                        </a>
                                                    )
                                                const slug = slugList[n - 1]
                                                const t = titleList[n - 1] || `project ${n}`
                                                return slug ? (
                                                    <a key={n} className="ref" href={`${basePath}${slug}`} title={`Open ${t}`} aria-label={`Project ${n}: ${t}`}>
                                                        {n}
                                                    </a>
                                                ) : null
                                            })}
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    </details>
                )
            })}
        </div>
    )
}

addPropertyControls(SkillsIndex, {
    data: { type: ControlType.String, title: "Skills", defaultValue: DEFAULT, displayTextArea: true },
    slugs: { type: ControlType.String, title: "Project slugs", defaultValue: "telus-streaming-telemetry,wingman,rf-telemetry-board,signalscout,risc-v-soc-gpu,biotherma-ai", description: "In project-number order" },
    titles: { type: ControlType.String, title: "Project titles", defaultValue: "TELUS streaming telemetry,Wingman,RF telemetry board,SignalScout,RISC-V SoC + GPU,BioTherma-AI" },
    basePath: { type: ControlType.String, title: "Base path", defaultValue: "/projects/" },
    openCount: { type: ControlType.Number, title: "Open groups", defaultValue: 2, min: 0, max: 10, step: 1 },
})
