import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { C } from "./ink.tsx"

// Steel-ruler background for the navigation bar: brushed gradient, tick marks,
// and a red cursor that slides along the ruler as the page scrolls.

interface Props {
    showCursor: boolean
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Ruler({ showCursor, style }: Props) {
    const cursor = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {
        if (!showCursor || RenderTarget.current() === RenderTarget.canvas) return
        let raf = 0
        const update = () => {
            raf = 0
            const el = cursor.current
            if (!el) return
            const max = document.documentElement.scrollHeight - window.innerHeight
            const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
            const w = el.parentElement ? el.parentElement.clientWidth : window.innerWidth
            el.style.transform = `translateX(${p * (w - 2)}px)`
        }
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update)
        }
        update()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
            if (raf) cancelAnimationFrame(raf)
        }
    }, [showCursor])

    const tick = (every: number) => `repeating-linear-gradient(90deg, ${C.steelInk} 0 1px, transparent 1px ${every}px)`
    return (
        <div aria-hidden="true" style={{ position: "relative", ...style, overflow: "hidden", pointerEvents: "none", background: `linear-gradient(${C.steelTop}, ${C.steelBottom})` }}>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.6,
                    backgroundImage: `${tick(60)}, ${tick(30)}, ${tick(6)}`,
                    backgroundSize: "100% 20px, 100% 13px, 100% 7px",
                    backgroundRepeat: "repeat-x",
                }}
            />
            {showCursor && (
                <div ref={cursor} style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 2, background: "#E0362B", willChange: "transform" }}>
                    <div style={{ position: "absolute", top: 0, left: -5, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "7px solid #E0362B" }} />
                </div>
            )}
        </div>
    )
}

addPropertyControls(Ruler, {
    showCursor: { type: ControlType.Boolean, title: "Scroll cursor", defaultValue: true },
})
