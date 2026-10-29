import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { PencilSvg, PENCIL_CSS, useUid } from "./pencil.tsx"

// A single coloured-pencil logo (used inside buttons and links).

interface Props {
    name: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function PencilIcon({ name, style }: Props) {
    const uid = useUid()
    return (
        <div className="pi-wrap" style={{ ...style }}>
            <style>{PENCIL_CSS}</style>
            <PencilSvg name={(name || "github").toLowerCase()} uid={uid} size="100%" />
        </div>
    )
}

addPropertyControls(PencilIcon, {
    name: { type: ControlType.String, title: "Logo key", defaultValue: "github" },
})
