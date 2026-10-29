import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, FONT } from "./ink.tsx"

// "What I'm doing right now": a numbered list with index-tab colours that expands like a lab log.
// Data: blocks separated by a blank line.
//   Label | Title           → first line of a block
//   any other line          → a paragraph in the expanded entry
//   -> /path | link text    → a link at the bottom of the entry

const TABS = [C.hl, C.hlB, C.hlG, C.hlP, C.hlO]

const CSS = `
.nl { list-style: none; margin: 0; padding: 0; border-top: 1.5px solid ${C.printLine}; }
.nl-row { border-bottom: 1px dashed ${C.printLine}; }
.nl-btn { all: unset; box-sizing: border-box; width: 100%; display: grid; grid-template-columns: 8px 40px 1fr 26px; align-items: center; column-gap: 14px; padding: 14px 4px 14px 0; cursor: pointer; }
.nl-btn:focus-visible { outline: 2px dashed ${C.ink}; outline-offset: 2px; }
.nl-tab { align-self: stretch; border-radius: 2px 5px 5px 2px; transition: transform .25s ease; transform-origin: left center; }
.nl-btn:hover .nl-tab, .nl-btn[aria-expanded="true"] .nl-tab { transform: scaleX(1.6); }
.nl-title { background-image: linear-gradient(100deg, transparent 1%, var(--hl) 3%, var(--hl) 97%, transparent 99%); background-size: 0% 70%; background-position: 0 80%; background-repeat: no-repeat; transition: background-size .4s cubic-bezier(.3,.7,.3,1); padding: 0 .1em; }
.nl-btn:hover .nl-title, .nl-btn[aria-expanded="true"] .nl-title { background-size: 100% 70%; }
.nl-plus { position: relative; width: 18px; height: 18px; justify-self: end; transition: transform .35s cubic-bezier(.3,.7,.3,1.3); }
.nl-plus::before, .nl-plus::after { content: ""; position: absolute; left: 50%; top: 50%; width: 16px; height: 2px; margin: -1px 0 0 -8px; border-radius: 2px; background: ${C.ink}; }
.nl-plus::after { transform: rotate(90deg) scaleX(.94); }
.nl-btn[aria-expanded="true"] .nl-plus { transform: rotate(135deg); }
.nl-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .45s cubic-bezier(.3,.7,.3,1); }
.nl-panel[data-open="true"] { grid-template-rows: 1fr; }
.nl-inner { overflow: hidden; min-height: 0; }
.nl-body { padding: 0 40px 18px 76px; opacity: 0; transform: translateY(-6px); transition: opacity .3s ease, transform .35s ease; }
.nl-panel[data-open="true"] .nl-body { opacity: 1; transform: none; transition-delay: .1s; }
.nl-body p { margin: 0 0 8px; }
.nl-link { font-family: ${FONT.hand}; color: ${C.ink}; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; margin-right: 18px; display: inline-block; }
.nl-link:hover { text-decoration-style: wavy; }
@media (max-width: 640px) {
  .nl-btn { grid-template-columns: 6px 28px 1fr 22px; column-gap: 10px; }
  .nl-body { padding: 0 8px 16px 54px; }
}
@media (prefers-reduced-motion: reduce) { .nl-panel, .nl-body, .nl-plus, .nl-tab, .nl-title { transition: none; } }
`

type Entry = { label: string; title: string; body: string[]; links: { href: string; text: string }[] }

function parse(data: string): Entry[] {
    return (data || "")
        .replace(/\r/g, "")
        .split(/\n\s*\n/)
        .map((block) => block.split("\n").map((l) => l.trim()).filter(Boolean))
        .filter((lines) => lines.length)
        .map((lines) => {
            const [label, ...rest] = lines[0].split("|").map((s) => s.trim())
            const entry: Entry = { label: rest.length ? label : "", title: rest.length ? rest.join(" | ") : label, body: [], links: [] }
            for (const l of lines.slice(1)) {
                if (l.startsWith("->")) {
                    const [href, text] = l.slice(2).split("|").map((s) => s.trim())
                    entry.links.push({ href, text: text || href })
                } else entry.body.push(l)
            }
            return entry
        })
}

interface Props {
    data: string
    openCount: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function NowList({ data, openCount, style }: Props) {
    const entries = parse(data)
    const [open, setOpen] = React.useState<boolean[]>(() => entries.map((_, i) => i < openCount))
    const uid = String((React as any).useId ? (React as any).useId() : "nl").replace(/[^a-zA-Z0-9_-]/g, "")
    const toggle = (i: number) => setOpen((o) => entries.map((_, k) => (k === i ? !o[k] : !!o[k])))
    return (
        <ol className="nl" style={{ ...style }}>
            <style>{CSS}</style>
            {entries.map((e, i) => {
                const isOpen = !!open[i]
                const tab = TABS[i % TABS.length]
                return (
                    <li key={i} className="nl-row">
                        <button type="button" className="nl-btn" aria-expanded={isOpen} aria-controls={`${uid}-p${i}`} id={`${uid}-b${i}`} onClick={() => toggle(i)}>
                            <span className="nl-tab" style={{ background: tab }} aria-hidden="true" />
                            <span style={{ fontFamily: FONT.mono, fontSize: 13, color: C.pencil, fontVariantNumeric: "tabular-nums" }}>{String(i + 1).padStart(2, "0")}</span>
                            <span style={{ minWidth: 0 }}>
                                {e.label && (
                                    <span style={{ display: "block", fontFamily: FONT.mono, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: C.print, marginBottom: 2 }}>{e.label}</span>
                                )}
                                <span className="nl-title" style={{ ["--hl" as any]: tab, fontFamily: FONT.hand, fontSize: "clamp(17px, 2.2vw, 21px)", lineHeight: 1.35, color: C.inkk }}>
                                    {e.title}
                                </span>
                            </span>
                            <span className="nl-plus" aria-hidden="true" />
                        </button>
                        <div className="nl-panel" data-open={isOpen} id={`${uid}-p${i}`} role="region" aria-labelledby={`${uid}-b${i}`}>
                            <div className="nl-inner">
                                <div className="nl-body" style={{ fontFamily: FONT.hand, fontSize: 16.5, lineHeight: 1.55, color: C.ink }}>
                                    {e.body.map((p, k) => (
                                        <p key={k}>{p}</p>
                                    ))}
                                    {e.links.length > 0 && (
                                        <div style={{ marginTop: 4 }}>
                                            {e.links.map((l, k) => (
                                                <a key={k} className="nl-link" href={l.href} tabIndex={isOpen ? 0 : -1}>
                                                    {l.text} →
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </li>
                )
            })}
        </ol>
    )
}

addPropertyControls(NowList, {
    data: {
        type: ControlType.String,
        title: "Entries",
        displayTextArea: true,
        defaultValue: "Building | SignalScout, a pocket RF tool\nLoRa, GNSS, NFC and an RF detector on a custom UNO Q shield.\n-> /projects/signalscout | Project sheet",
    },
    openCount: { type: ControlType.Number, title: "Open at start", defaultValue: 1, min: 0, max: 10, step: 1 },
})
