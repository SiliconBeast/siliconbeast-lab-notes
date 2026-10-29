import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { C, FONT } from "./ink.tsx"
import { PencilSvg, PENCIL_CSS, label, useUid } from "./pencil.tsx"

// A row of coloured-pencil tech logos with labels, from a comma-separated list of keys.
// Keys: c, cplusplus, python, go, openjdk, javascript, sql, verilog, vhdl, cuda, matlab,
// stmicroelectronics, jetson, nxp, raspberrypi, arduino, riscv, fpga, kicad, vivado, cadence, ltspice,
// docker, grpc, gnmi, redis, influxdb, grafana, aws, googlecloud, linux, openwrt, rest,
// git, github, jira, claude, tensorflow, cicd, agile, devpost

interface Props {
    keys: string
    iconSize: number
    minColumn: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function TechIcons({ keys, iconSize, minColumn, style }: Props) {
    const uid = useUid()
    const list = (keys || "")
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean)
    if (!list.length) return <div style={{ ...style, minHeight: 1 }} />
    return (
        <div style={{ ...style }}>
            <style>{PENCIL_CSS}</style>
            <ul
                style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "grid",
                    gridTemplateColumns: `repeat(auto-fill, minmax(${minColumn}px, 1fr))`,
                    gap: "12px 8px",
                }}
            >
                {list.map((k, i) => (
                    <li key={k + i} className="pi-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textAlign: "center" }}>
                        <PencilSvg name={k} uid={`${uid}${i}`} size={iconSize} />
                        <span style={{ fontFamily: FONT.hand, fontSize: 14, lineHeight: 1.15, color: C.inkk }}>{label(k)}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

addPropertyControls(TechIcons, {
    keys: { type: ControlType.String, title: "Keys", defaultValue: "c,cplusplus,python,go", displayTextArea: true },
    iconSize: { type: ControlType.Number, title: "Icon size", defaultValue: 44, min: 16, max: 96, step: 1 },
    minColumn: { type: ControlType.Number, title: "Min column", defaultValue: 78, min: 40, max: 200, step: 1 },
})
