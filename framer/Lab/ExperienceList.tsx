import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, FONT } from "./ink.tsx"
import Mark from "./Mark.tsx"

// The experience section as a scannable list: grouped roles, short bullets, and highlighter
// marks on the numbers a recruiter looks for. The marks sweep in when the list scrolls into view.
// Data: blocks separated by a blank line.
//   ## Group name                      → starts a group
//   Dates | Organisation | Title | tag → first line of a role (tag: telus, plan)
//   - a bullet, with [[highlighted]] words
//   -> /#contact | link text           → a link under the role

const CSS = `
.xl { container-type: inline-size; display: grid; gap: 34px; }
.xl-group h3 { margin: 0 0 6px; padding-bottom: 8px; border-bottom: 1.5px solid ${C.printLine}; font: 500 11px/1.2 ${FONT.mono}; letter-spacing: .14em; text-transform: uppercase; color: ${C.print}; }
.xl-list { list-style: none; margin: 0; padding: 0; }
.xl-item { display: grid; grid-template-columns: 170px 1fr; column-gap: 24px; padding: 16px 0; border-bottom: 1px dashed ${C.printLine}; }
.xl-when { font: 500 11.5px/1.5 ${FONT.mono}; letter-spacing: .06em; text-transform: uppercase; color: ${C.pencil}; padding-top: 5px; }
.xl-mark { width: 74px; margin-top: 8px; }
.xl-title { margin: 0; font-family: ${FONT.hand}; font-size: 21px; line-height: 1.3; color: ${C.ink}; }
.xl-org { display: block; font-family: ${FONT.hand}; font-size: 15.5px; line-height: 1.4; color: ${C.pencil}; }
.xl-body { margin: 8px 0 0; padding: 0; list-style: none; display: grid; gap: 5px; font-family: ${FONT.hand}; font-size: 16px; line-height: 1.55; color: ${C.inkk}; }
.xl-body li { position: relative; padding-left: 18px; }
.xl-body li::before { content: ""; position: absolute; left: 2px; top: .72em; width: 8px; height: 1.5px; border-radius: 2px; background: ${C.ink}; transform: rotate(-8deg); }
.xl-body.one li { padding-left: 0; }
.xl-body.one li::before { display: none; }
.xl-hl { color: inherit; background-color: transparent; padding: 0 .2em; margin: 0 -.05em; border-radius: .3em .15em .35em .2em; background-image: linear-gradient(100deg, transparent .1em, ${C.hl} .25em, ${C.hl} calc(100% - .25em), transparent calc(100% - .08em)); background-repeat: no-repeat; background-size: 0% 100%; -webkit-box-decoration-break: clone; box-decoration-break: clone; transition: background-size .7s cubic-bezier(.3,.7,.3,1); }
.xl[data-in="true"] .xl-hl { background-size: 100% 100%; }
.xl-plan .xl-title { color: ${C.pencil}; }
.xl-plan .xl-body { font-family: ${FONT.scrawl}; font-size: 19px; color: ${C.pencil}; }
.xl-plan { border-bottom: 0; }
.xl-link { display: inline-block; margin-top: 6px; font-family: ${FONT.scrawl}; font-size: 19px; color: ${C.ink}; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
.xl-link:hover { text-decoration-style: wavy; }
@container (max-width: 560px) {
  .xl-item { grid-template-columns: 1fr; row-gap: 2px; padding: 14px 0; }
  .xl-when { padding-top: 0; }
  .xl-mark { width: 62px; margin: 4px 0 2px; }
  .xl-title { font-size: 19px; }
}
@media (prefers-reduced-motion: reduce) { .xl-hl { transition: none; background-size: 100% 100%; } }
`

type Role = { when: string; org: string; title: string; tag: string; lines: string[]; links: { href: string; text: string }[] }
type Group = { name: string; roles: Role[] }

function parse(data: string): Group[] {
    const groups: Group[] = []
    const blocks = (data || "").replace(/\r/g, "").split(/\n\s*\n/)
    for (const block of blocks) {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean)
        while (lines.length && lines[0].startsWith("## ")) groups.push({ name: lines.shift()!.slice(3).trim(), roles: [] })
        if (!lines.length) continue
        if (!groups.length) groups.push({ name: "", roles: [] })
        const [when = "", org = "", title = "", tag = ""] = lines[0].split("|").map((s) => s.trim())
        const role: Role = { when, org, title, tag: tag.toLowerCase(), lines: [], links: [] }
        for (const l of lines.slice(1)) {
            if (l.startsWith("->")) {
                const [href, text] = l.slice(2).split("|").map((s) => s.trim())
                role.links.push({ href, text: text || href })
            } else role.lines.push(l.replace(/^[-•]\s*/, ""))
        }
        groups[groups.length - 1].roles.push(role)
    }
    return groups
}

// [[words]] become highlighter marks
function ink(text: string) {
    return text.split(/(\[\[.+?\]\])/g).map((part, i) =>
        part.startsWith("[[") ? (
            <mark key={i} className="xl-hl" style={{ transitionDelay: `${0.15 + (i % 7) * 0.12}s` }}>
                {part.slice(2, -2)}
            </mark>
        ) : (
            part
        )
    )
}

interface Props {
    data: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ExperienceList({ data, style }: Props) {
    const groups = parse(data)
    const ref = React.useRef<HTMLDivElement>(null)
    const [seen, setSeen] = React.useState(false)
    React.useEffect(() => {
        const el = ref.current
        if (!el || typeof IntersectionObserver === "undefined") return setSeen(true)
        const io = new IntersectionObserver(
            (es) => {
                if (es.some((e) => e.isIntersecting)) {
                    setSeen(true)
                    io.disconnect()
                }
            },
            { rootMargin: "0px 0px -15% 0px" }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    return (
        <div ref={ref} className="xl" data-in={seen} style={{ ...style }}>
            <style>{CSS}</style>
            {groups.map((g, gi) => (
                <section key={gi} className="xl-group" aria-label={g.name || undefined}>
                    {g.name && <h3>{g.name}</h3>}
                    <ol className="xl-list">
                        {g.roles.map((r, ri) => (
                            <li key={ri} className={`xl-item${r.tag === "plan" ? " xl-plan" : ""}`}>
                                <div>
                                    <div className="xl-when">{r.when}</div>
                                    {r.tag === "telus" && (
                                        <div className="xl-mark">
                                            <Mark mark="telus" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="xl-title">{r.title}</h4>
                                    {r.org && <span className="xl-org">{r.org}</span>}
                                    {r.lines.length > 0 && (
                                        <ul className={`xl-body${r.lines.length === 1 ? " one" : ""}`}>
                                            {r.lines.map((l, k) => (
                                                <li key={k}>{ink(l)}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {r.links.map((l, k) => (
                                        <a key={k} className="xl-link" href={l.href}>
                                            {l.text} →
                                        </a>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>
            ))}
        </div>
    )
}

addPropertyControls(ExperienceList, {
    data: {
        type: ControlType.String,
        title: "Roles",
        displayTextArea: true,
        defaultValue: "## Work experience\nJan – Aug 2026 | TELUS Communications | Software Engineer Intern | telus\n- Telemetry [[360× faster]]",
        description: "## Group, then: Dates | Organisation | Title | tag (telus, plan), bullets with [[highlights]]",
    },
})
