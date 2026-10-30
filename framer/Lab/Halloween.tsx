import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

// Seasonal pencil-drawn decorations: a cobweb on the sheet, a spider on a thread under the top bar,
// a pumpkin by the name, bats that fly past once, a ghost peeking from behind the TL;DR note and a
// candy-corn pin. On only between the start and end dates (add ?halloween to the URL to preview).
// The decorations attach to frames by their Framer layer names, and re-attach after page changes.
// Self-contained on purpose: no imports from other code files.

const tok = (id: string, fallback: string) => `var(--token-${id}, ${fallback})`
const INK = tok("cZ5PgjUQu", "#22252B")
const PENCIL = tok("zpsiQwqDy", "#5A5D63")
const PAPER = tok("aIWxwfzWH", "#FBFAF4")

const CSS = `
.hw-web { position: absolute; left: 0; top: 0; width: 120px; height: 120px; pointer-events: none; z-index: 2; }
.hw-web path { fill: none; stroke: ${PENCIL}; stroke-opacity: .6; stroke-width: 1.1; stroke-linecap: round; }
.hw-spider { position: fixed; right: 22%; top: 52px; width: 30px; transform-origin: 50% 0; animation: hw-dangle 5s ease-in-out infinite; z-index: 50; cursor: pointer; }
.hw-spider .hw-thread { width: 1px; height: 70px; margin: 0 auto; background: ${PENCIL}; opacity: .6; transition: height .6s cubic-bezier(.3,.7,.3,1.2); }
.hw-spider:hover .hw-thread { height: 18px; }
.hw-spider svg { display: block; width: 30px; height: 26px; }
@keyframes hw-dangle { 50% { transform: rotate(5deg); } }
.hw-pumpkin { position: absolute; right: 0; bottom: 6px; width: 46px; height: 40px; pointer-events: none; }
.hw-bats { position: fixed; left: 0; right: 0; top: 8px; height: 40px; pointer-events: none; overflow: hidden; z-index: 60; }
.hw-bats svg { position: absolute; width: 26px; height: 14px; left: -40px; animation: hw-fly 7s ease-in-out .8s 1 forwards; }
.hw-bats svg:nth-child(2) { top: 18px; width: 18px; height: 10px; animation-delay: 1.3s; }
.hw-bats svg:nth-child(3) { top: 6px; width: 20px; height: 11px; animation-delay: 1.8s; }
@keyframes hw-fly { 0% { transform: translate(0, 10px); } 25% { transform: translate(28vw, -2px); } 50% { transform: translate(55vw, 12px); } 75% { transform: translate(80vw, 0); } 100% { transform: translate(115vw, 8px); } }
.hw-ghost { position: absolute; width: 40px; height: 48px; pointer-events: none; animation: hw-peek 6s ease-in-out infinite; }
@keyframes hw-peek { 0%, 70%, 100% { transform: translateX(-20px) rotate(-2deg); } 80%, 92% { transform: translateX(0) rotate(6deg); } }
.hw-candy { position: absolute; left: 50%; top: 50%; width: 18px; height: 22px; margin: -14px 0 0 -9px; filter: drop-shadow(0 2px 1px rgba(0,0,0,.3)); }
[data-hw-pin] { background: transparent !important; box-shadow: none !important; }
@media (prefers-reduced-motion: reduce) { .hw-spider, .hw-ghost { animation: none; } .hw-bats { display: none; } }
@media print { .hw-web, .hw-spider, .hw-pumpkin, .hw-bats, .hw-ghost, .hw-candy { display: none; } }
`

const SVG = {
    web: `<svg class="hw-web" viewBox="0 0 120 120" aria-hidden="true"><path d="M0 0 L118 18 M0 0 L92 58 M0 0 L58 92 M0 0 L18 118"/><path d="M20 3c-2 6-5 11-11 13 M2 20c6-2 11-5 14-12"/><path d="M44 7c-4 10-6 19-17 25-8 5-14 7-24 9"/><path d="M70 11c-5 14-9 26-23 34-12 7-26 15-38 17"/><path d="M96 15c-8 18-13 34-30 45-15 10-34 22-52 26"/></svg>`,
    spider: `<div class="hw-thread"></div><svg viewBox="0 0 30 26"><g stroke="${INK}" stroke-width="1.4" fill="none" stroke-linecap="round"><path d="M10 11 3 6M10 13 2 13M10 15 3 21M11 17 6 24M20 11l7-5M20 13h8M20 15l7 6M19 17l5 7"/></g><ellipse cx="15" cy="14" rx="6" ry="7" fill="${INK}"/><circle cx="15" cy="7" r="3.5" fill="${INK}"/><circle cx="13.7" cy="6.5" r=".9" fill="${PAPER}"/><circle cx="16.3" cy="6.5" r=".9" fill="${PAPER}"/></svg>`,
    pumpkin: `<svg class="hw-pumpkin" viewBox="0 0 46 40" aria-hidden="true"><path d="M23 9c-2-5 1-8 4-8" fill="none" stroke="#2E6B3A" stroke-width="2.4" stroke-linecap="round"/><path d="M27 6c4-2 8 0 9 3-3 1-7 0-9-3z" fill="#2E6B3A"/><ellipse cx="14" cy="24" rx="11" ry="13" fill="#B4531A"/><ellipse cx="32" cy="24" rx="11" ry="13" fill="#B4531A"/><ellipse cx="23" cy="24" rx="11" ry="14" fill="#E8782A"/><path d="M16 21l4-4 3 4zM26 21l4-4 3 4zM15 28c3 3 13 3 16 0l-3 1-2-2-2 2-3-2-2 2z" fill="#2A2416"/><g fill="none" stroke="#2A2416" stroke-width="1.2" opacity=".4"><path d="M23 10c-4 4-4 24 0 28M23 10c4 4 4 24 0 28"/></g></svg>`,
    bat: `<svg viewBox="0 0 26 14"><path d="M13 5c1-2 2-2 3-1 2-3 6-3 9-1-3 0-4 2-4 4-2-1-3 0-4 2-1-1-3-2-4-1-1-1-3 0-4 1-1-2-2-3-4-2 0-2-1-4-4-4 3-2 7-2 9 1 1-1 2-1 3 1z" fill="${INK}"/></svg>`,
    ghost: `<svg class="hw-ghost" viewBox="0 0 40 48" aria-hidden="true"><path d="M20 2C10 2 4 10 4 20v24l5-4 5 4 6-4 6 4 5-4 5 4V20C36 10 30 2 20 2z" fill="#FBFAF4" stroke="#5A5D63" stroke-width="1.6" stroke-linejoin="round"/><ellipse cx="15" cy="19" rx="2.2" ry="3" fill="#2A2416"/><ellipse cx="25" cy="19" rx="2.2" ry="3" fill="#2A2416"/><ellipse cx="20" cy="28" rx="3" ry="3.6" fill="#2A2416"/></svg>`,
    candy: `<svg class="hw-candy" viewBox="0 0 18 22" aria-hidden="true"><path d="M9 1 C12 7 16 14 17 20 C12 22 6 22 1 20 C2 14 6 7 9 1 Z" fill="#FBFAF4"/><path d="M4.2 11 C7 10.2 11 10.2 13.8 11 L17 20 C12 22 6 22 1 20 Z" fill="#F29A2E"/><path d="M1.6 17.4 C6 18.5 12 18.5 16.4 17.4 L17 20 C12 22 6 22 1 20 Z" fill="#F6D24A"/></svg>`,
}

// month-day as a number, e.g. Oct 20 → 1020
const md = (s: string) => {
    const [m, d] = (s || "").split("-").map((n) => parseInt(n, 10))
    return (m || 0) * 100 + (d || 0)
}

function inSeason(start: string, end: string) {
    if (/[?&#]halloween\b/.test(location.search + location.hash)) return true
    const now = new Date()
    const t = (now.getMonth() + 1) * 100 + now.getDate()
    const a = md(start)
    const b = md(end)
    return a <= b ? t >= a && t <= b : t >= a || t <= b
}

const named = (name: string) => Array.from(document.querySelectorAll(`[data-framer-name="${name}"]`)) as HTMLElement[]
const visible = (el: HTMLElement) => el.offsetParent !== null || getComputedStyle(el).position === "fixed"

function relative(el: HTMLElement) {
    if (getComputedStyle(el).position === "static") el.style.position = "relative"
}

function add(parent: HTMLElement, html: string, key: string) {
    if (parent.querySelector(`:scope > [data-hw="${key}"]`)) return
    const wrap = document.createElement("div")
    wrap.innerHTML = html
    const el = wrap.firstElementChild as HTMLElement
    el.setAttribute("data-hw", key)
    parent.appendChild(el)
}

// attach everything that is missing; safe to call repeatedly
function decorate() {
    for (const sheet of named("Index sheet").concat(named("Project sheet")).filter(visible)) {
        relative(sheet)
        add(sheet, SVG.web, "web")
    }
    for (const field of named("Field Name").filter(visible)) {
        relative(field)
        add(field, SVG.pumpkin, "pumpkin")
    }
    for (const note of named("TL;DR sticky").filter(visible)) {
        const parent = note.parentElement
        if (!parent) continue
        relative(parent)
        if (getComputedStyle(note).position === "static") note.style.position = "relative"
        note.style.zIndex = "1"
        add(parent, SVG.ghost, "ghost")
        const ghost = parent.querySelector(':scope > [data-hw="ghost"]') as HTMLElement | null
        if (ghost) {
            ghost.style.left = `${note.offsetLeft + note.offsetWidth - 22}px`
            ghost.style.top = `${note.offsetTop + note.offsetHeight - 80}px`
        }
        const pin = note.querySelector('[data-framer-name="Pin"]') as HTMLElement | null
        if (pin) {
            pin.setAttribute("data-hw-pin", "")
            relative(pin)
            add(pin, SVG.candy, "candy")
        }
    }
    if (!document.querySelector('body > [data-hw="spider"]')) {
        const ruler = named("Ruler nav").find(visible)
        const spider = document.createElement("div")
        spider.className = "hw-spider"
        spider.setAttribute("data-hw", "spider")
        spider.setAttribute("aria-hidden", "true")
        spider.style.top = `${ruler ? Math.round(ruler.getBoundingClientRect().height) : 52}px`
        spider.innerHTML = SVG.spider
        document.body.appendChild(spider)
    }
    // the bats fly past once per visit, not each time decorations re-attach
    if (!(window as any).__hwBats) {
        ;(window as any).__hwBats = true
        const bats = document.createElement("div")
        bats.className = "hw-bats"
        bats.setAttribute("data-hw", "bats")
        bats.setAttribute("aria-hidden", "true")
        bats.innerHTML = SVG.bat + SVG.bat + SVG.bat
        document.body.appendChild(bats)
        window.setTimeout(() => bats.remove(), 10000)
    }
}

interface Props {
    start: string
    end: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function Halloween({ start = "10-20", end = "11-01", style }: Props) {
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    React.useEffect(() => {
        if (isCanvas || !inSeason(start, end)) return
        if (!document.getElementById("hw-css")) {
            const css = document.createElement("style")
            css.id = "hw-css"
            css.textContent = CSS
            document.head.appendChild(css)
        }
        let raf = 0
        const run = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(decorate)
        }
        run()
        // pages change without a reload, and the ghost follows the note when the layout moves
        const mo = new MutationObserver(run)
        mo.observe(document.body, { childList: true, subtree: true })
        window.addEventListener("resize", run)
        return () => {
            mo.disconnect()
            window.removeEventListener("resize", run)
            cancelAnimationFrame(raf)
            document.querySelectorAll("[data-hw]").forEach((el) => el.remove())
        }
    }, [start, end])

    if (isCanvas)
        return (
            <div style={{ ...style, padding: "4px 8px", font: "12px/1.3 sans-serif", color: "#B4531A", border: "1px dashed #B4531A", borderRadius: 4 }}>
                Halloween decorations ({start} to {end})
            </div>
        )
    return null
}

addPropertyControls(Halloween, {
    start: { type: ControlType.String, title: "From (MM-DD)", defaultValue: "10-20" },
    end: { type: ControlType.String, title: "Until (MM-DD)", defaultValue: "11-01" },
})
