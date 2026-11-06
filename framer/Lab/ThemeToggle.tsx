import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { C, FONT } from "./ink.tsx"

// Light paper / blueprint switch. Framer only switches colour styles with the OS setting,
// so this writes both palettes as rules keyed on data-sb-theme (on <html> and <body>) and
// reveals the new theme with an ink-spread circle from the button.
// Keep TOKENS in sync with the Lab/* colour styles: [token id, light, dark].

const TOKENS: [string, string, string][] = [
    ["rc69XzrUB", "#D9E3DA", "#071426"],
    ["dFRBeVWFN", "rgba(28, 82, 60, 0.13)", "rgba(217, 230, 247, 0.06)"],
    ["aIWxwfzWH", "#FBFAF4", "#123358"],
    ["uUxKv9cIR", "#FFFEF9", "#17406A"],
    ["xcJfNafyX", "rgba(70, 120, 200, 0.10)", "rgba(217, 230, 247, 0.08)"],
    ["IqnO4kgmh", "rgba(70, 120, 200, 0.19)", "rgba(217, 230, 247, 0.16)"],
    ["PDiw8VoFN", "#74777D", "#A4BAD4"],
    ["D4Tx6iP8v", "#B6B8BD", "#5D7EA5"],
    ["XXMTG9jYN", "#1F3A93", "#F2F6FC"],
    ["cZ5PgjUQu", "#22252B", "#F2F6FC"],
    ["zpsiQwqDy", "#5A5D63", "#BFD0E4"],
    ["wa_Q6vFvM", "#C8322B", "#FF8B7D"],
    ["FVL3JU7cj", "#1E7F4E", "#7BE3A6"],
    ["WYU3SllcG", "rgba(250, 226, 70, 0.72)", "rgba(255, 224, 80, 0.32)"],
    ["qMpOp90tJ", "rgba(120, 235, 140, 0.55)", "rgba(110, 240, 150, 0.26)"],
    ["ObeHdPdlB", "rgba(120, 190, 255, 0.5)", "rgba(120, 190, 255, 0.3)"],
    ["kJeLW6oBk", "rgba(255, 125, 185, 0.5)", "rgba(255, 110, 180, 0.3)"],
    ["dRtH1yc5l", "rgba(255, 170, 90, 0.55)", "rgba(255, 170, 90, 0.3)"],
    ["W0igZrzGd", "#FCE77A", "#E3D05C"],
    ["hSuficCUj", "#2A2416", "#2A2416"],
    ["AOjZQVCD3", "rgba(236, 226, 190, 0.82)", "rgba(217, 230, 247, 0.22)"],
    ["J0CVpHEeJ", "#ECEEF1", "#3C4552"],
    ["Hu6PYuvEx", "#C5C9CF", "#262C35"],
    ["ANkbjAwk7", "#2C2F35", "#DCE4EE"],
    ["tNOaMypFO", "#8C9198", "#A9B6C6"],
    ["gqLBp4xDR", "#275D38", "#9AD9AE"],
    ["YMTFSeGC3", "rgba(242, 205, 0, 0.6)", "rgba(255, 220, 60, 0.35)"],
    ["vLc0w5apD", "#1C4F8A", "#1C4F8A"],
    ["nhRuzuU3X", "#EAF2FC", "#EAF2FC"],
    ["xVJ_exQfM", "rgba(25, 35, 25, 0.42)", "rgba(0, 0, 0, 0.6)"],
]

const KEY = "sb-theme"

function css() {
    const vars = (i: 1 | 2) => TOKENS.map((t) => `--token-${t[0]}: ${t[i]} !important;`).join(" ")
    // The universal selector beats any element that re-declares the tokens further down the tree.
    const sel = (th: string) => `html[data-sb-theme="${th}"], html[data-sb-theme="${th}"] body, html[data-sb-theme="${th}"] body *`
    return (
        `${sel("dark")} { ${vars(2)} }\n` +
        `${sel("light")} { ${vars(1)} }\n` +
        `html[data-sb-theme="dark"] { color-scheme: dark; } html[data-sb-theme="light"] { color-scheme: light; }\n` +
        `::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }\n` +
        `::view-transition-new(root) { z-index: 2147483646; }\n` +
        // blueprint scan line sweeping down after switching to dark
        `.sb-scan { position: fixed; left: 0; right: 0; top: -30vh; height: 30vh; z-index: 2147483647; pointer-events: none; background: linear-gradient(transparent, rgba(120,190,255,.10) 70%, rgba(170,215,255,.55) 98%, transparent); animation: sb-scan .9s cubic-bezier(.5,0,.3,1) forwards; }\n` +
        `.sb-scan::after { content: ""; position: absolute; inset: 0; background-image: linear-gradient(rgba(217,230,247,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(217,230,247,.25) 1px, transparent 1px); background-size: 24px 24px; mask-image: linear-gradient(transparent, #000); -webkit-mask-image: linear-gradient(transparent, #000); }\n` +
        `@keyframes sb-scan { to { transform: translateY(160vh); } }\n` +
        // desk-lamp flicker after switching to light
        `.sb-flick { position: fixed; inset: 0; z-index: 2147483647; pointer-events: none; background: radial-gradient(circle at 50% 0%, rgba(255,246,200,.9), rgba(255,246,200,0) 70%); opacity: 0; animation: sb-flick .7s steps(1) forwards; }\n` +
        `@keyframes sb-flick { 0% { opacity: .55 } 12% { opacity: 0 } 24% { opacity: .4 } 34% { opacity: .05 } 46% { opacity: .3 } 100% { opacity: 0 } }\n` +
        `.sb-tt-ico { display: inline-block; transform-origin: 50% 0; }\n` +
        `.sb-tt-swing .sb-tt-ico { animation: sb-swing .8s cubic-bezier(.3,.7,.3,1.3); }\n` +
        `@keyframes sb-swing { 0% { transform: rotate(0) } 25% { transform: rotate(28deg) } 50% { transform: rotate(-18deg) } 75% { transform: rotate(8deg) } 100% { transform: rotate(0) } }\n` +
        `@media (prefers-reduced-motion: reduce) { .sb-scan, .sb-flick { display: none; } .sb-tt-swing .sb-tt-ico { animation: none; } }`
    )
}

function inject() {
    if (document.getElementById("sb-theme-css")) return
    const style = document.createElement("style")
    style.id = "sb-theme-css"
    style.textContent = css()
    document.head.appendChild(style)
}

// A one-off overlay that removes itself when its animation ends.
function flourish(theme: "light" | "dark") {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = document.createElement("div")
    el.className = theme === "dark" ? "sb-scan" : "sb-flick"
    el.setAttribute("aria-hidden", "true")
    el.addEventListener("animationend", () => el.remove())
    document.body.appendChild(el)
    window.setTimeout(() => el.remove(), 1500)
}

function systemDark() {
    return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
}

function currentDark() {
    const t = document.documentElement.getAttribute("data-sb-theme")
    return t ? t === "dark" : systemDark()
}

function apply(theme: "light" | "dark", remember = true) {
    inject()
    for (const el of [document.documentElement, document.body]) {
        el.setAttribute("data-sb-theme", theme)
        el.setAttribute("data-framer-theme", theme)
    }
    if (remember)
        try {
            localStorage.setItem(KEY, theme)
        } catch {}
    window.dispatchEvent(new CustomEvent("sb-theme", { detail: theme }))
}

// Light paper is the default; blueprint only if the visitor picked it before. Always pin a theme
// so the palette never depends on how Framer emits its dark rules.
function applyStart() {
    let saved: string | null = null
    try {
        saved = localStorage.getItem(KEY)
    } catch {}
    apply(saved === "dark" ? "dark" : "light", false)
}

// The S-trace chip favicon. Set from code so it replaces Framer's default icon on every page
// without depending on Site Settings.
const FAVICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g stroke="#1C4F8A" stroke-width="2.6" stroke-linecap="round"><path d="M11 2v4M16 2v4M21 2v4M11 26v4M16 26v4M21 26v4M2 11h4M2 16h4M2 21h4M26 11h4M26 16h4M26 21h4"/></g><rect x="6" y="6" width="20" height="20" rx="3.5" fill="#1C4F8A"/><path d="M20.5 11h-8v5h7v5h-8" fill="none" stroke="#EAF2FC" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20.5" cy="11" r="1.9" fill="#FCE77A"/><circle cx="11.5" cy="21" r="1.9" fill="#FCE77A"/></svg>'

function setFavicon() {
    if (document.getElementById("sb-favicon")) return
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach((l) => l.remove())
    const link = document.createElement("link")
    link.id = "sb-favicon"
    link.rel = "icon"
    link.type = "image/svg+xml"
    link.href = "data:image/svg+xml," + encodeURIComponent(FAVICON)
    document.head.appendChild(link)
}

// ---- Seasonal decorations ----
// Pencil-drawn Halloween touches (cobweb, spider, pumpkin, bats, ghost, candy-corn pin), on only from
// Oct 20 to Nov 1, or with ?halloween in the URL. They live in this module because it loads on every
// page and reliably ships in the published build.
const HW_START = "10-20"
const HW_END = "11-01"

const hwTok = (id: string, fallback: string) => `var(--token-${id}, ${fallback})`
const HW_INK = hwTok("cZ5PgjUQu", "#22252B")
const HW_PENCIL = hwTok("zpsiQwqDy", "#5A5D63")
const HW_PAPER = hwTok("aIWxwfzWH", "#FBFAF4")

const HW_CSS = `
.hw-web { position: absolute; left: 0; top: 0; width: 120px; height: 120px; pointer-events: none; z-index: 2; }
.hw-web path { fill: none; stroke: ${HW_PENCIL}; stroke-opacity: .6; stroke-width: 1.1; stroke-linecap: round; }
.hw-spider { position: fixed; right: 22%; top: 52px; width: 30px; transform-origin: 50% 0; animation: hw-dangle 5s ease-in-out infinite; z-index: 50; cursor: pointer; }
.hw-spider .hw-thread { width: 1px; height: 70px; margin: 0 auto; background: ${HW_PENCIL}; opacity: .6; transition: height .6s cubic-bezier(.3,.7,.3,1.2); }
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

const HW_SVG = {
    web: `<svg class="hw-web" viewBox="0 0 120 120" aria-hidden="true"><path d="M0 0 L118 18 M0 0 L92 58 M0 0 L58 92 M0 0 L18 118"/><path d="M20 3c-2 6-5 11-11 13 M2 20c6-2 11-5 14-12"/><path d="M44 7c-4 10-6 19-17 25-8 5-14 7-24 9"/><path d="M70 11c-5 14-9 26-23 34-12 7-26 15-38 17"/><path d="M96 15c-8 18-13 34-30 45-15 10-34 22-52 26"/></svg>`,
    spider: `<div class="hw-thread"></div><svg viewBox="0 0 30 26"><g stroke="${HW_INK}" stroke-width="1.4" fill="none" stroke-linecap="round"><path d="M10 11 3 6M10 13 2 13M10 15 3 21M11 17 6 24M20 11l7-5M20 13h8M20 15l7 6M19 17l5 7"/></g><ellipse cx="15" cy="14" rx="6" ry="7" fill="${HW_INK}"/><circle cx="15" cy="7" r="3.5" fill="${HW_INK}"/><circle cx="13.7" cy="6.5" r=".9" fill="${HW_PAPER}"/><circle cx="16.3" cy="6.5" r=".9" fill="${HW_PAPER}"/></svg>`,
    pumpkin: `<svg class="hw-pumpkin" viewBox="0 0 46 40" aria-hidden="true"><path d="M23 9c-2-5 1-8 4-8" fill="none" stroke="#2E6B3A" stroke-width="2.4" stroke-linecap="round"/><path d="M27 6c4-2 8 0 9 3-3 1-7 0-9-3z" fill="#2E6B3A"/><ellipse cx="14" cy="24" rx="11" ry="13" fill="#B4531A"/><ellipse cx="32" cy="24" rx="11" ry="13" fill="#B4531A"/><ellipse cx="23" cy="24" rx="11" ry="14" fill="#E8782A"/><path d="M16 21l4-4 3 4zM26 21l4-4 3 4zM15 28c3 3 13 3 16 0l-3 1-2-2-2 2-3-2-2 2z" fill="#2A2416"/><g fill="none" stroke="#2A2416" stroke-width="1.2" opacity=".4"><path d="M23 10c-4 4-4 24 0 28M23 10c4 4 4 24 0 28"/></g></svg>`,
    bat: `<svg viewBox="0 0 26 14"><path d="M13 5c1-2 2-2 3-1 2-3 6-3 9-1-3 0-4 2-4 4-2-1-3 0-4 2-1-1-3-2-4-1-1-1-3 0-4 1-1-2-2-3-4-2 0-2-1-4-4-4 3-2 7-2 9 1 1-1 2-1 3 1z" fill="${HW_INK}"/></svg>`,
    ghost: `<svg class="hw-ghost" viewBox="0 0 40 48" aria-hidden="true"><path d="M20 2C10 2 4 10 4 20v24l5-4 5 4 6-4 6 4 5-4 5 4V20C36 10 30 2 20 2z" fill="#FBFAF4" stroke="#5A5D63" stroke-width="1.6" stroke-linejoin="round"/><ellipse cx="15" cy="19" rx="2.2" ry="3" fill="#2A2416"/><ellipse cx="25" cy="19" rx="2.2" ry="3" fill="#2A2416"/><ellipse cx="20" cy="28" rx="3" ry="3.6" fill="#2A2416"/></svg>`,
    candy: `<svg class="hw-candy" viewBox="0 0 18 22" aria-hidden="true"><path d="M9 1 C12 7 16 14 17 20 C12 22 6 22 1 20 C2 14 6 7 9 1 Z" fill="#FBFAF4"/><path d="M4.2 11 C7 10.2 11 10.2 13.8 11 L17 20 C12 22 6 22 1 20 Z" fill="#F29A2E"/><path d="M1.6 17.4 C6 18.5 12 18.5 16.4 17.4 L17 20 C12 22 6 22 1 20 Z" fill="#F6D24A"/></svg>`,
}

// month-day as a number, e.g. Oct 20 → 1020
const md = (s: string) => {
    const [m, d] = (s || "").split("-").map((n) => parseInt(n, 10))
    return (m || 0) * 100 + (d || 0)
}

function inSeason(start: string, end: string, flag = "halloween") {
    if (new RegExp(`[?&#]${flag}\\b`).test(location.search + location.hash)) return true
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
        add(sheet, HW_SVG.web, "web")
    }
    for (const field of named("Field Name").filter(visible)) {
        relative(field)
        add(field, HW_SVG.pumpkin, "pumpkin")
    }
    for (const note of named("TL;DR sticky").filter(visible)) {
        const parent = note.parentElement
        if (!parent) continue
        relative(parent)
        if (getComputedStyle(note).position === "static") note.style.position = "relative"
        note.style.zIndex = "1"
        add(parent, HW_SVG.ghost, "ghost")
        const ghost = parent.querySelector(':scope > [data-hw="ghost"]') as HTMLElement | null
        if (ghost) {
            ghost.style.left = `${note.offsetLeft + note.offsetWidth - 22}px`
            ghost.style.top = `${note.offsetTop + note.offsetHeight - 80}px`
        }
        const pin = note.querySelector('[data-framer-name="Pin"]') as HTMLElement | null
        if (pin) {
            pin.setAttribute("data-hw-pin", "")
            relative(pin)
            add(pin, HW_SVG.candy, "candy")
        }
    }
    if (!document.querySelector('body > [data-hw="spider"]')) {
        const ruler = named("Ruler nav").find(visible)
        const spider = document.createElement("div")
        spider.className = "hw-spider"
        spider.setAttribute("data-hw", "spider")
        spider.setAttribute("aria-hidden", "true")
        spider.style.top = `${ruler ? Math.round(ruler.getBoundingClientRect().height) : 52}px`
        spider.innerHTML = HW_SVG.spider
        document.body.appendChild(spider)
    }
    // the bats fly past once per visit, not each time decorations re-attach
    if (!(window as any).__hwBats) {
        ;(window as any).__hwBats = true
        const bats = document.createElement("div")
        bats.className = "hw-bats"
        bats.setAttribute("data-hw", "bats")
        bats.setAttribute("aria-hidden", "true")
        bats.innerHTML = HW_SVG.bat + HW_SVG.bat + HW_SVG.bat
        document.body.appendChild(bats)
        window.setTimeout(() => bats.remove(), 10000)
    }
}

function startHalloween() {
    const w = window as any
    if (w.__hwStarted || !inSeason(HW_START, HW_END)) return
    w.__hwStarted = true
    const css = document.createElement("style")
    css.id = "hw-css"
    css.textContent = HW_CSS
    document.head.appendChild(css)
    let raf = 0
    const run = () => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(decorate)
    }
    run()
    // pages change without a reload, and the ghost follows the note when the layout moves
    new MutationObserver(run).observe(document.body, { childList: true, subtree: true })
    window.addEventListener("resize", run)
}

// ---- Christmas ----
// Fairy lights strung under the ruler nav, a light pencil snowfall, snow on the top edge of the
// notebook sheets, a Santa hat on the TL;DR note, holly on its pin and a wrapped gift by the name.
// On from Nov 6 to Jan 6, or with ?xmas in the URL.
const XM_START = "11-06"
const XM_END = "01-06"
const XM_BULBS = ["#E5483B", "#F2C230", "#3E9E5A", "#3D7DD8", "#E86FB0"]

const XM_CSS = `
.xm-lights { position: fixed; left: 0; right: 0; height: 26px; display: flex; justify-content: center; pointer-events: none; z-index: 49; overflow: hidden; }
.xm-seg { position: relative; flex: 0 0 64px; height: 14px; border-bottom: 1.3px solid ${HW_PENCIL}; border-radius: 0 0 50% 50%; opacity: .9; }
.xm-bulb { position: absolute; left: 50%; bottom: -10px; width: 7px; height: 11px; margin-left: -3.5px; border-radius: 50% 50% 46% 46%; background: var(--c); box-shadow: 0 0 6px 1px var(--c); animation: xm-twinkle 2.4s ease-in-out infinite; animation-delay: var(--d); }
.xm-bulb::before { content: ""; position: absolute; left: 1.5px; top: -3px; width: 4px; height: 3px; border-radius: 1px; background: ${HW_PENCIL}; }
@keyframes xm-twinkle { 0%, 100% { opacity: 1; } 50% { opacity: .35; box-shadow: none; } }
.xm-snow { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 48; }
.xm-flake { position: absolute; top: -20px; color: #9DB4CC; font-size: var(--s); line-height: 1; opacity: .75; animation: xm-fall var(--t) linear infinite, xm-sway calc(var(--t) / 4) ease-in-out infinite alternate; animation-delay: var(--d); }
body[data-sb-theme="dark"] .xm-flake { color: #EAF2FC; opacity: .6; }
@keyframes xm-fall { to { transform: translateY(110vh); } }
@keyframes xm-sway { from { margin-left: -14px; } to { margin-left: 14px; } }
.xm-cap { position: absolute; left: 6px; right: 6px; top: -9px; height: 16px; pointer-events: none; z-index: 3; }
.xm-cap svg { display: block; width: 100%; height: 100%; }
.xm-hat { position: absolute; width: 54px; height: 44px; pointer-events: none; z-index: 2; transform: rotate(14deg); }
.xm-gift { position: absolute; right: 0; bottom: 6px; width: 34px; height: 36px; pointer-events: none; }
.xm-holly { position: absolute; left: 50%; top: 50%; width: 26px; height: 20px; margin: -12px 0 0 -13px; filter: drop-shadow(0 2px 1px rgba(0,0,0,.25)); }
[data-xm-pin] { background: transparent !important; box-shadow: none !important; }
@media (prefers-reduced-motion: reduce) { .xm-snow { display: none; } .xm-bulb { animation: none; } }
@media print { .xm-lights, .xm-snow, .xm-cap, .xm-hat, .xm-gift, .xm-holly { display: none; } }
`

const XM_SVG = {
    cap: `<div class="xm-cap" aria-hidden="true"><svg viewBox="0 0 400 16" preserveAspectRatio="none"><path d="M0 12 C8 2 22 3 30 9 C38 1 56 2 64 10 C74 3 90 4 98 11 C108 2 126 3 134 9 C144 1 160 3 168 10 C178 2 194 4 202 11 C212 3 228 2 236 9 C246 1 262 3 270 10 C280 2 296 4 304 11 C314 3 330 2 338 9 C348 1 364 3 372 10 C382 3 394 4 400 9 V16 H0 Z" fill="#FFFFFF" stroke="#9DB4CC" stroke-width="1.2" vector-effect="non-scaling-stroke"/></svg></div>`,
    hat: `<svg class="xm-hat" viewBox="0 0 54 44" aria-hidden="true"><path d="M8 34 C10 20 18 8 32 6 C42 5 48 12 46 22 C44 18 40 16 37 18 C40 24 41 30 40 34 Z" fill="#D8382E" stroke="#7A1E18" stroke-width="1.2" stroke-linejoin="round"/><circle cx="45" cy="24" r="5" fill="#FFFFFF" stroke="#9DB4CC" stroke-width="1.1"/><path d="M4 33 C16 30 32 30 44 33 C45 36 45 39 44 41 C32 38 16 38 4 41 C3 38 3 36 4 33 Z" fill="#FFFFFF" stroke="#9DB4CC" stroke-width="1.1"/></svg>`,
    gift: `<svg class="xm-gift" viewBox="0 0 34 36" aria-hidden="true"><rect x="3" y="14" width="28" height="20" rx="1.5" fill="#3E9E5A" stroke="${HW_INK}" stroke-width="1.2"/><rect x="1" y="9" width="32" height="7" rx="1.5" fill="#4FB06B" stroke="${HW_INK}" stroke-width="1.2"/><path d="M15 9 V34 M19 9 V34" stroke="#D8382E" stroke-width="2.4"/><path d="M17 9 C11 2 5 4 8 8 C10 10 14 9 17 9 C20 9 24 10 26 8 C29 4 23 2 17 9 Z" fill="#E5483B" stroke="#7A1E18" stroke-width="1"/></svg>`,
    holly: `<svg class="xm-holly" viewBox="0 0 26 20" aria-hidden="true"><path d="M13 11 C9 6 4 7 1 4 C3 8 1 10 3 12 C6 11 9 13 13 11 Z" fill="#2E7D47" stroke="#1B4F2C" stroke-width=".8"/><path d="M13 11 C17 6 22 7 25 4 C23 8 25 10 23 12 C20 11 17 13 13 11 Z" fill="#2E7D47" stroke="#1B4F2C" stroke-width=".8"/><circle cx="11" cy="13" r="2.6" fill="#D8382E"/><circle cx="15.2" cy="13.4" r="2.6" fill="#E5483B"/><circle cx="13" cy="9.8" r="2.4" fill="#C62F26"/></svg>`,
}

function xmAdd(parent: HTMLElement, html: string, key: string) {
    if (parent.querySelector(`:scope > [data-xm="${key}"]`)) return
    const wrap = document.createElement("div")
    wrap.innerHTML = html
    const el = wrap.firstElementChild as HTMLElement
    el.setAttribute("data-xm", key)
    parent.appendChild(el)
}

function decorateXmas() {
    const ruler = named("Ruler nav").find(visible)
    const top = ruler ? Math.round(ruler.getBoundingClientRect().height) - 6 : 46
    let lights = document.querySelector('body > [data-xm="lights"]') as HTMLElement | null
    const count = Math.ceil(window.innerWidth / 64) + 1
    if (!lights || lights.childElementCount !== count) {
        lights?.remove()
        lights = document.createElement("div")
        lights.className = "xm-lights"
        lights.setAttribute("data-xm", "lights")
        lights.setAttribute("aria-hidden", "true")
        let html = ""
        for (let i = 0; i < count; i++)
            html += `<div class="xm-seg"><span class="xm-bulb" style="--c:${XM_BULBS[i % XM_BULBS.length]};--d:${((i * 0.37) % 2.4).toFixed(2)}s"></span></div>`
        lights.innerHTML = html
        document.body.appendChild(lights)
    }
    lights.style.top = `${top}px`
    if (!document.querySelector('body > [data-xm="snow"]')) {
        const snow = document.createElement("div")
        snow.className = "xm-snow"
        snow.setAttribute("data-xm", "snow")
        snow.setAttribute("aria-hidden", "true")
        let html = ""
        for (let i = 0; i < 22; i++) {
            const left = (i * 47.3) % 100
            const size = 9 + ((i * 7) % 9)
            const t = 11 + ((i * 5) % 9)
            const d = -((i * 3.1) % t)
            html += `<span class="xm-flake" style="left:${left.toFixed(1)}%;--s:${size}px;--t:${t}s;--d:${d.toFixed(1)}s">${i % 3 ? "✻" : "❄"}</span>`
        }
        snow.innerHTML = html
        document.body.appendChild(snow)
    }
    for (const sheet of named("Index sheet").concat(named("Project sheet")).filter(visible)) {
        relative(sheet)
        sheet.style.overflow = "visible"
        xmAdd(sheet, XM_SVG.cap, "cap")
    }
    for (const field of named("Field Name").filter(visible)) {
        relative(field)
        xmAdd(field, XM_SVG.gift, "gift")
    }
    for (const note of named("TL;DR sticky").filter(visible)) {
        const parent = note.parentElement
        if (!parent) continue
        relative(parent)
        xmAdd(parent, XM_SVG.hat, "hat")
        const hat = parent.querySelector(':scope > [data-xm="hat"]') as HTMLElement | null
        if (hat) {
            hat.style.left = `${note.offsetLeft + note.offsetWidth - 40}px`
            hat.style.top = `${note.offsetTop - 30}px`
        }
        const pin = note.querySelector('[data-framer-name="Pin"]') as HTMLElement | null
        if (pin) {
            pin.setAttribute("data-xm-pin", "")
            relative(pin)
            xmAdd(pin, XM_SVG.holly, "holly")
        }
    }
}

function startXmas() {
    const w = window as any
    if (w.__xmStarted || !inSeason(XM_START, XM_END, "xmas")) return
    w.__xmStarted = true
    const css = document.createElement("style")
    css.id = "xm-css"
    css.textContent = XM_CSS
    document.head.appendChild(css)
    let raf = 0
    const run = () => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(decorateXmas)
    }
    run()
    new MutationObserver((records) => {
        // ignore our own additions so the observer doesn't loop
        if (records.every((r) => Array.from(r.addedNodes).every((n) => n instanceof HTMLElement && (n.hasAttribute("data-xm") || n.closest("[data-xm]"))))) return
        run()
    }).observe(document.body, { childList: true, subtree: true })
    window.addEventListener("resize", run)
}

// Run as soon as this module loads, before React hydrates, so a dark-mode system doesn't flash
// the blueprint palette first.
if (typeof document !== "undefined" && document.body && RenderTarget.current() !== RenderTarget.canvas) {
    applyStart()
    setFavicon()
    startHalloween()
    startXmas()
}

interface Props {
    lightLabel: string
    darkLabel: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function ThemeToggle({ lightLabel, darkLabel, style }: Props) {
    const [dark, setDark] = React.useState(false)
    const [swing, setSwing] = React.useState(0)
    React.useEffect(() => {
        if (RenderTarget.current() === RenderTarget.canvas) return
        applyStart()
        setFavicon()
        startHalloween()
        startXmas()
        setDark(currentDark())
        const onTheme = () => setDark(currentDark())
        window.addEventListener("sb-theme", onTheme)
        return () => window.removeEventListener("sb-theme", onTheme)
    }, [])

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const next = currentDark() ? "light" : "dark"
        setSwing((n) => n + 1)
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const doc = document as any
        inject()
        if (!doc.startViewTransition || reduce) {
            apply(next)
            flourish(next)
            return
        }
        const rect = e.currentTarget.getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top + rect.height / 2
        const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
        const vt = doc.startViewTransition(() => apply(next))
        vt.ready
            .then(() => {
                document.documentElement.animate(
                    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
                    { duration: 750, easing: "cubic-bezier(.6, 0, .3, 1)", pseudoElement: "::view-transition-new(root)" }
                )
            })
            .catch(() => {})
        vt.finished
            .then(() => flourish(next))
            .catch(() => {})
    }

    // The sun or moon at the end of the label swings like a pull-cord lamp when clicked.
    const raw = dark ? lightLabel : darkLabel
    const m = raw.match(/^(.*?)([☾☀☼])$/u)
    const label = m ? { text: m[1], icon: m[2] } : { text: raw, icon: "" }

    return (
        <button
            type="button"
            className={swing ? "sb-tt-swing" : undefined}
            onClick={onClick}
            aria-label={dark ? "Switch to light paper" : "Switch to blueprint (dark) theme"}
            aria-pressed={dark}
            style={{
                ...style,
                font: "inherit",
                fontFamily: FONT.hand,
                fontSize: 15,
                lineHeight: 1.2,
                color: C.steelInk,
                background: "none",
                border: 0,
                borderLeft: "1px solid rgba(127,127,127,.45)",
                padding: "2px 4px 2px 12px",
                cursor: "pointer",
                whiteSpace: "nowrap",
            }}
        >
            {label.text}
            {label.icon && (
                <span key={swing} className="sb-tt-ico" aria-hidden="true">
                    {label.icon}
                </span>
            )}
        </button>
    )
}

addPropertyControls(ThemeToggle, {
    darkLabel: { type: ControlType.String, title: "To dark", defaultValue: "blueprint ☾" },
    lightLabel: { type: ControlType.String, title: "To light", defaultValue: "lights on ☀" },
})
