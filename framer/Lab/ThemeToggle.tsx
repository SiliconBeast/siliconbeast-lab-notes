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

// Run as soon as this module loads, before React hydrates, so a dark-mode system doesn't flash
// the blueprint palette first.
if (typeof document !== "undefined" && document.body && RenderTarget.current() !== RenderTarget.canvas) {
    applyStart()
    setFavicon()
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
