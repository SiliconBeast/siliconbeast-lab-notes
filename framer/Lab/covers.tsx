import * as React from "react"

// Cover designs for the notebook opening. Every texture is CSS or inline SVG noise, so nothing loads.
const svg = (body: string, size = 240) =>
    `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${body}</svg>`)}")`

// fine grain: dark speckles at low alpha
const GRAIN = svg(`<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 -0.1'/></filter><rect width='100%' height='100%' filter='url(#n)'/>`, 160)
// leather mottling: soft light and dark patches
const MOTTLE = svg(`<filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.035' numOctaves='4' seed='7' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 -0.35'/></filter><rect width='100%' height='100%' filter='url(#m)'/>`, 320)
// black and white composition-book marbling
const MARBLE = svg(`<filter id='c' color-interpolation-filters='sRGB'><feTurbulence type='turbulence' baseFrequency='0.045' numOctaves='2' seed='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncR type='discrete' tableValues='1 0 1 0 0 1'/><feFuncG type='discrete' tableValues='1 0 1 0 0 1'/><feFuncB type='discrete' tableValues='1 0 1 0 0 1'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(#c)'/>`, 260)
// endpaper marbling, tinted
const ENDPAPER = svg(`<filter id='e'><feTurbulence type='turbulence' baseFrequency='0.02 0.06' numOctaves='3' seed='11' stitchTiles='stitch'/><feColorMatrix values='0.55 0 0 0 0.25  0.35 0 0 0 0.22  0.2 0 0 0 0.35  0 0 0 0 1'/></filter><rect width='100%' height='100%' filter='url(#e)'/>`, 300)
// kraft fibres
const FIBRE = svg(`<filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.02 0.6' numOctaves='2' seed='5' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0 0.05  0 0 0 0.5 -0.15'/></filter><rect width='100%' height='100%' filter='url(#f)'/>`, 240)

export type CoverStyle = "leather" | "composition" | "kraft" | "lab" | "blueprint"
export const COVER_OPTIONS: CoverStyle[] = ["leather", "composition", "kraft", "lab", "blueprint"]
export const COVER_TITLES = ["Leather-bound", "Composition book", "Kraft cardboard", "Lab notebook", "Blueprint"]

type F = { mono: string; scrawl: string; serif: string; hand: string }
type Args = { lines: string[]; subtitle: string; owner: string; font: F; chip: React.ReactNode }

const abs = (s: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...s })

export function coverFront(style: CoverStyle, a: Args): { face: React.CSSProperties; content: React.ReactNode } {
    const { lines, subtitle, owner, font } = a
    if (style === "leather") {
        const gold: React.CSSProperties = {
            backgroundImage: "linear-gradient(175deg, #F6E3A1 0%, #C99A3B 45%, #F2D27A 60%, #9C7224 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 1px 0 rgba(0,0,0,.55)) drop-shadow(0 -1px 0 rgba(255,230,180,.15))",
        }
        return {
            face: {
                backgroundColor: "#5A2F1B",
                backgroundImage: `${GRAIN}, ${MOTTLE}, radial-gradient(120% 90% at 30% 20%, #8A4B2C 0%, #5A2F1B 55%, #3A1D10 100%)`,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,.4), inset 0 0 40px rgba(0,0,0,.55), 0 30px 50px -25px rgba(0,0,0,.6)",
                borderRadius: "4px 12px 12px 4px",
                color: "#F2D27A",
            },
            content: (
                <>
                    {/* spine with raised bands */}
                    <div style={abs({ left: 0, top: 0, bottom: 0, width: "12%", borderRadius: "4px 0 0 4px", background: "linear-gradient(90deg, rgba(0,0,0,.45), rgba(0,0,0,.15) 70%, rgba(255,255,255,.06))" })} />
                    {[18, 38, 62, 82].map((t) => (
                        <div key={t} style={abs({ left: 0, width: "12%", top: `${t}%`, height: 6, background: "linear-gradient(rgba(255,255,255,.12), rgba(0,0,0,.4))", borderRadius: 2 })} />
                    ))}
                    {/* stitched border */}
                    <div style={abs({ inset: "5% 5% 5% 16%", border: "2px dashed rgba(236,205,160,.55)", borderRadius: 6 })} />
                    {/* blind-tooled frame */}
                    <div style={abs({ inset: "9% 9% 9% 20%", border: "1px solid rgba(0,0,0,.35)", boxShadow: "0 1px 0 rgba(255,220,170,.12), inset 0 1px 0 rgba(255,220,170,.12)", borderRadius: 3 })} />
                    <div style={abs({ left: "20%", right: "9%", top: "24%", textAlign: "center" })}>
                        <div style={{ ...gold, fontFamily: font.serif, fontSize: "clamp(24px, 6.6vw, 34px)", lineHeight: 1.02, letterSpacing: ".01em" }}>
                            {lines.map((l, i) => (
                                <div key={i}>{l}</div>
                            ))}
                        </div>
                        <div style={{ ...gold, margin: "12px auto 0", width: "56%", height: 1.5, backgroundClip: "border-box", WebkitBackgroundClip: "border-box" }} />
                        <div style={{ ...gold, marginTop: 10, fontFamily: font.mono, fontSize: 8.5, letterSpacing: ".22em", textTransform: "uppercase" }}>{subtitle}</div>
                    </div>
                    <div style={abs({ left: "20%", right: "9%", bottom: "17%", textAlign: "center", fontFamily: font.scrawl, fontSize: 22, color: "rgba(242,210,122,.85)", textShadow: "0 1px 0 rgba(0,0,0,.6)" })}>{owner}</div>
                    {/* elastic band and ribbon bookmark */}
                    <div style={abs({ right: "13%", top: -2, bottom: -2, width: 9, background: "linear-gradient(90deg, #1B1B1B, #3A3A3A 50%, #141414)", boxShadow: "1px 0 2px rgba(0,0,0,.6)" })} />
                    <div style={abs({ left: "30%", bottom: -22, width: 10, height: 30, background: "linear-gradient(90deg, #7E1B1B, #B23131, #7E1B1B)", clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)" })} />
                </>
            ),
        }
    }
    if (style === "composition") {
        return {
            face: {
                backgroundColor: "#111",
                backgroundImage: `${GRAIN}, ${MARBLE}`,
                backgroundSize: "auto, 260px 260px",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,.6), inset 0 0 30px rgba(0,0,0,.35), 0 30px 50px -25px rgba(0,0,0,.6)",
                borderRadius: "2px 8px 8px 2px",
                color: "#111",
            },
            content: (
                <>
                    <div style={abs({ left: 0, top: 0, bottom: 0, width: "13%", background: `${GRAIN}, linear-gradient(90deg, #050505, #1E1E1E)`, boxShadow: "1px 0 0 rgba(255,255,255,.08)" })} />
                    <div style={abs({ left: "22%", right: "10%", top: "17%", padding: "12px 12px 10px", background: "#FBFAF4", borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,.45)" })}>
                        <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: "clamp(14px, 4.4vw, 18px)", lineHeight: 1.1, textAlign: "center", letterSpacing: "-.01em" }}>
                            {lines.join(" ")}
                        </div>
                        {[
                            ["NAME", owner],
                            ["SUBJECT", subtitle.replace(/^Vol\. 1 · /, "")],
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8, borderBottom: "1px solid #9AA4B6" }}>
                                <span style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: ".12em" }}>{k}</span>
                                <span style={{ fontFamily: font.scrawl, fontSize: 18, color: "#1F3A93", lineHeight: 1 }}>{v}</span>
                            </div>
                        ))}
                    </div>
                </>
            ),
        }
    }
    if (style === "kraft") {
        return {
            face: {
                backgroundColor: "#B88A5A",
                backgroundImage: `${GRAIN}, ${FIBRE}, linear-gradient(160deg, #C79C6B, #A87A4C)`,
                boxShadow: "inset 0 0 0 1px rgba(80,50,20,.4), inset 0 0 26px rgba(80,50,20,.35), 0 30px 50px -25px rgba(0,0,0,.5)",
                borderRadius: "3px 10px 10px 3px",
                color: "#2B1D10",
            },
            content: (
                <>
                    <div style={abs({ left: 0, top: 0, bottom: 0, width: "9%", background: "repeating-linear-gradient(transparent 0 10px, rgba(60,40,20,.55) 10px 13px)", opacity: 0.8 })} />
                    <div style={abs({ left: "18%", right: "11%", top: "14%", padding: "12px 10px", background: "#F7F4EA", transform: "rotate(-1.5deg)", boxShadow: "0 1px 2px rgba(0,0,0,.35)" })}>
                        <div style={{ fontFamily: font.hand, fontSize: "clamp(20px, 5.6vw, 26px)", lineHeight: 1.05, textAlign: "center", color: "#1F3A93" }}>
                            {lines.map((l, i) => (
                                <div key={i}>{l}</div>
                            ))}
                        </div>
                    </div>
                    <div style={abs({ left: "18%", right: "11%", top: "50%", textAlign: "center", transform: "rotate(-6deg)" })}>
                        <span style={{ display: "inline-block", padding: "4px 10px", border: "2px solid rgba(178,40,40,.8)", borderRadius: 4, fontFamily: font.mono, fontWeight: 700, fontSize: 11, letterSpacing: ".18em", color: "rgba(178,40,40,.85)", textTransform: "uppercase" }}>
                            {subtitle.replace(/^Vol\. 1 · /, "")}
                        </span>
                    </div>
                    <div style={abs({ left: "18%", right: "11%", bottom: "13%", textAlign: "center", fontFamily: font.scrawl, fontSize: 24, color: "#2B1D10" })}>{owner}</div>
                    <div style={abs({ left: -2, right: -2, top: "70%", height: 9, background: "linear-gradient(#1B1B1B, #3A3A3A 50%, #141414)", boxShadow: "0 1px 2px rgba(0,0,0,.5)" })} />
                </>
            ),
        }
    }
    if (style === "lab") {
        return {
            face: {
                backgroundColor: "#1F4A36",
                backgroundImage: `${GRAIN}, linear-gradient(160deg, #285C44, #183A2A)`,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,.4), inset 0 0 30px rgba(0,0,0,.4), 0 30px 50px -25px rgba(0,0,0,.6)",
                borderRadius: "3px 8px 8px 3px",
                color: "#E8D9A8",
            },
            content: (
                <>
                    <div style={abs({ left: 0, top: 0, bottom: 0, width: "13%", background: `${GRAIN}, linear-gradient(90deg, #0E0E0E, #2A2A2A)` })} />
                    <div style={abs({ right: 0, top: 0, width: "22%", aspectRatio: "1", background: `${GRAIN}, #161616`, clipPath: "polygon(0 0, 100% 0, 100% 100%)", borderTopRightRadius: 8 })} />
                    <div style={abs({ right: 0, bottom: 0, width: "22%", aspectRatio: "1", background: `${GRAIN}, #161616`, clipPath: "polygon(100% 0, 100% 100%, 0 100%)", borderBottomRightRadius: 8 })} />
                    <div style={abs({ left: "20%", right: "8%", top: "12%", textAlign: "center", fontFamily: font.mono, fontWeight: 700, fontSize: 11, letterSpacing: ".24em" })}>LABORATORY NOTEBOOK</div>
                    <div style={abs({ left: "22%", right: "10%", top: "26%", padding: "12px 10px", background: "#F4EFDE", color: "#1C2A22", borderRadius: 2, boxShadow: "0 1px 2px rgba(0,0,0,.4)", backgroundImage: "repeating-linear-gradient(transparent 0 19px, rgba(30,80,60,.25) 19px 20px)" })}>
                        <div style={{ fontFamily: font.mono, fontWeight: 500, fontSize: "clamp(15px, 4.6vw, 20px)", lineHeight: 1.15, textAlign: "center" }}>
                            {lines.map((l, i) => (
                                <div key={i}>{l}</div>
                            ))}
                        </div>
                        <div style={{ marginTop: 8, textAlign: "center", fontFamily: font.scrawl, fontSize: 19, color: "#1F3A93" }}>{owner}</div>
                    </div>
                    <div style={abs({ left: "20%", right: "8%", bottom: "12%", textAlign: "center", fontFamily: font.mono, fontSize: 8.5, letterSpacing: ".2em", textTransform: "uppercase", opacity: 0.85 })}>{subtitle}</div>
                </>
            ),
        }
    }
    // blueprint
    return {
        face: {
            backgroundColor: "#1C4F8A",
            backgroundImage: "linear-gradient(rgba(255,255,255,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.13) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            boxShadow: "0 30px 50px -25px rgba(0,0,0,.5)",
            borderRadius: "3px 9px 9px 3px",
            color: "#EAF2FC",
        },
        content: (
            <>
                <div style={abs({ left: 0, top: 0, bottom: 0, width: "11%", background: "rgba(0,0,0,.3)", boxShadow: "inset -2px 0 3px rgba(0,0,0,.3)" })} />
                <div style={abs({ left: "20%", right: "10%", top: "15%", padding: "14px 12px", background: "#EAF2FC", color: "#14243A", borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,.3)", textAlign: "center", backgroundImage: "repeating-linear-gradient(transparent 0 19px, rgba(70,120,200,.2) 19px 20px)" })}>
                    <div style={{ fontFamily: font.mono, fontWeight: 500, fontSize: "clamp(17px, 5.2vw, 24px)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                        {lines.map((l, i) => (
                            <div key={i}>{l}</div>
                        ))}
                    </div>
                    <div style={{ marginTop: 8, fontFamily: font.mono, fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.75 }}>{subtitle}</div>
                </div>
                <div style={abs({ left: "20%", right: "10%", top: "50%", textAlign: "center", fontFamily: font.scrawl, fontSize: 26, lineHeight: 1.1 })}>{owner}</div>
                <div style={abs({ left: "38%", bottom: "11%", width: "34%" })}>{a.chip}</div>
            </>
        ),
    }
}

// The inside of the front cover: marbled endpaper for the bound books, plain stock for the rest.
export function coverInside(style: CoverStyle): React.CSSProperties {
    if (style === "leather") return { backgroundColor: "#6E5A8C", backgroundImage: ENDPAPER, backgroundSize: "300px 300px" }
    if (style === "kraft") return { backgroundColor: "#C9A57A", backgroundImage: `${GRAIN}, ${FIBRE}` }
    if (style === "composition" || style === "lab") return { backgroundColor: "#F1EEE4", backgroundImage: GRAIN }
    return {}
}
