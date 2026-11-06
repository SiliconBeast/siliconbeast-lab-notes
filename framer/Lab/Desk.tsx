// @ts-nocheck
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

// The lived-in desk: hand-drawn, top-down objects on the cutting mat beside the notebook sheet
// (boarding pass, to-do, chai, bench polaroids, bench crumbs, tic-tac-toe, notes for Suvir, and a
// bug to squash). Objects anchor beside named sections of the home page, scale to the margin, and
// hide when the margin is too narrow. Shadows fall away from the cursor; everything can be dragged.

const MONO = "B612 Mono, monospace";
const rnd = (s: number) => { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

function mug() {
  // a clay kulhad of chai, seen from straight above, on a jute coaster
  const text = "CHAI-POWERED CO-OP STUDENT · CHAI-POWERED CO-OP STUDENT · ";
  return `<svg width="190" height="170" viewBox="0 0 190 170" aria-label="Kulhad of chai on a coaster, seen from above"><defs>
    <radialGradient id="jute" cx=".45" cy=".42"><stop offset="0" stop-color="#D8C08E"/><stop offset="1" stop-color="#B89A62"/></radialGradient>
    <radialGradient id="clay" cx=".4" cy=".35"><stop offset=".7" stop-color="#C8643A"/><stop offset=".88" stop-color="#A84B26"/><stop offset="1" stop-color="#7E3418"/></radialGradient>
    <radialGradient id="wallg" cx=".5" cy=".5"><stop offset=".8" stop-color="#B85A33"/><stop offset="1" stop-color="#8E3B1E"/></radialGradient>
    <radialGradient id="cof" cx=".42" cy=".4"><stop offset="0" stop-color="#E2BC8C"/><stop offset=".6" stop-color="#C99A68"/><stop offset="1" stop-color="#9E6E42"/></radialGradient>
    <path id="coaster-ring" d="M85 85 m-66 0 a66 66 0 1 1 132 0 a66 66 0 1 1 -132 0"/></defs>
    <circle cx="85" cy="85" r="78" fill="url(#jute)"/>${Array.from({ length: 9 }, (_, i) => `<circle cx="85" cy="85" r="${30 + i * 6}" fill="none" stroke="#9C7E48" stroke-width="1.6" stroke-dasharray="3 2" opacity=".5"/>`).join("")}
    <text font-family="${MONO}" font-size="7.2" font-weight="700" letter-spacing="1.5" fill="#6b4f22"><textPath href="#coaster-ring">${text}</textPath></text>
    <g class="mugbody">
      <circle cx="85" cy="85" r="48" fill="url(#clay)"/>${Array.from({ length: 22 }, (_, i) => `<circle cx="${(85 + Math.cos(i * 2.7) * (40 + (i % 4) * 2)).toFixed(1)}" cy="${(85 + Math.sin(i * 2.7) * (40 + (i % 4) * 2)).toFixed(1)}" r=".9" fill="#7E3418" opacity=".5"/>`).join("")}
      <circle cx="85" cy="85" r="48" fill="none" stroke="#6E2C12" stroke-width="1"/>
      <circle class="wall" cx="85" cy="85" r="40" fill="url(#wallg)"/>
      <circle class="coffee" cx="85" cy="85" r="37" fill="url(#cof)"/>
      <g class="crema"><path d="M66 80 C74 72 92 74 96 84 C99 94 86 100 78 96" fill="none" stroke="#F1DABB" stroke-width="2.4" stroke-linecap="round" opacity=".8"/><circle cx="98" cy="70" r="2.2" fill="#F1DABB" opacity=".7"/><circle cx="70" cy="96" r="1.6" fill="#F1DABB" opacity=".7"/><circle cx="92" cy="98" r="1.2" fill="#F1DABB" opacity=".7"/>
        <g transform="rotate(-28 100 90)"><ellipse cx="100" cy="90" rx="6.5" ry="3.6" fill="#7E9A4A" stroke="#5B7434" stroke-width=".7"/><path d="M94 90 H106 M97 88 L103 92" stroke="#5B7434" stroke-width=".5"/></g></g>
      <path d="M46 64 A48 48 0 0 1 70 40" stroke="#E9935F" stroke-width="2.6" opacity=".7" fill="none" stroke-linecap="round"/>
      <g class="steam"><path d="M80 78 C70 60 96 56 86 38" /><path d="M92 84 C104 70 82 58 98 44"/><path d="M74 90 C60 80 70 62 62 52"/></g>
    </g></svg>`;
}

function parts() {
  const spool = range(14).map((i) => `<path d="M${36 + i * 2.6} 26 V68" stroke="#B9BEC5" stroke-width="1.4" opacity="${.5 + (i % 2) * .4}"/>`).join("");
  return `<svg width="200" height="170" viewBox="0 0 200 170" aria-label="Solder spool, tweezers and loose parts"><defs><linearGradient id="sp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7E848C"/><stop offset=".5" stop-color="#E7EAEE"/><stop offset="1" stop-color="#7E848C"/></linearGradient></defs>
    <g><circle cx="52" cy="48" r="34" fill="#2C2F35"/><circle cx="52" cy="48" r="34" fill="none" stroke="#4A4F57" stroke-width="2"/><circle cx="52" cy="48" r="28" fill="url(#sp)"/>${range(8).map((i) => `<circle cx="52" cy="48" r="${14 + i * 1.8}" fill="none" stroke="#9AA0A8" stroke-width=".5" opacity=".7"/>`).join("")}<circle cx="52" cy="48" r="13" fill="#F2C230"/><circle cx="52" cy="48" r="5.5" fill="#D9E3DA" stroke="#2C2F35" stroke-width="1.4"/><text x="52" y="40" text-anchor="middle" font-family="${MONO}" font-size="4.2" fill="#22252B">Sn63Pb37</text><text x="52" y="59" text-anchor="middle" font-family="${MONO}" font-size="3.6" fill="#22252B">0.8mm</text><path class="strand" d="M80 48 C100 46 110 60 132 54" stroke="#C5C9CF" stroke-width="1.4" fill="none"/></g>
    <g transform="rotate(-24 140 40)"><path d="M100 36 L176 32 L176 35 L104 40 Z M100 44 L176 44 L176 47 L104 46 Z" fill="url(#sp)" stroke="#7E848C" stroke-width=".5"/><rect x="128" y="30" width="20" height="20" rx="2" fill="#3D7DD8" opacity=".85"/></g>
    <g transform="rotate(14 60 110)"><g class="res"><path d="M14 110 H42" stroke="#A9AEB5" stroke-width="1.6"/><rect x="42" y="104" width="34" height="12" rx="5.5" fill="#E9D4A2" stroke="#C9B07A" stroke-width=".5"/><rect x="48" y="104" width="3.4" height="12" fill="#C8322B"/><rect x="55" y="104" width="3.4" height="12" fill="#C8322B"/><rect x="62" y="104" width="3.4" height="12" fill="#8B4513"/><rect x="70" y="104" width="2.4" height="12" fill="#C9A227"/><path d="M76 110 H104" stroke="#A9AEB5" stroke-width="1.6"/></g></g>
    <g transform="rotate(-18 140 130)"><path d="M104 130 H130" stroke="#A9AEB5" stroke-width="1.6"/><rect x="130" y="124" width="32" height="12" rx="5.5" fill="#86B6E8"/><rect x="136" y="124" width="3" height="12" fill="#3D7DD8"/><rect x="143" y="124" width="3" height="12" fill="#111"/><rect x="150" y="124" width="3" height="12" fill="#E5483B"/><path d="M162 130 H188" stroke="#A9AEB5" stroke-width="1.6"/></g>
    <g transform="translate(150 70)" class="pled"><circle class="pglow" cx="3" cy="10" r="13" fill="#7BE3A6"/><circle cx="3" cy="10" r="7.4" fill="#4FB06B"/><circle cx="3" cy="10" r="6" fill="#7BE3A6"/><circle cx="1" cy="8" r="1.6" fill="#fff" opacity=".8"/><path d="M8.6 6 V14" stroke="#4FB06B" stroke-width="1.4"/></g>
    <path d="M20 150 C20 134 50 134 50 146 V158 C50 168 32 168 32 158 V142" fill="none" stroke="#9AA5AE" stroke-width="2.6"/>
    ${range(14).map((i) => `<path d="M${84 + rnd(i) * 50} ${148 + rnd(i + 5) * 16} q2 -2 4 0" stroke="#F7B3CF" stroke-width="1.4" fill="none"/>`).join("")}
    <rect x="120" y="150" width="34" height="14" rx="2" fill="#F7B3CF" transform="rotate(-8 137 157)"/><rect x="120" y="150" width="12" height="14" rx="2" fill="#3D7DD8" transform="rotate(-8 137 157)"/></svg>`;
}

const polaroid = (inner, cap, date, rot, tapeCls, x, y) => `<div class="pol" style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${rot}deg)"><div class="tape${tapeCls}"></div><div class="ph">${inner}<span class="stamp">${date}</span></div>${cap}</div>`;

const OBJ = [
  { name: "Boarding pass", side: "l", anchor: "Head", dy: 30, k: -0.04, html: `<div class="lift"><div class="pass"><div class="main"><div class="band"><span><svg width="9" height="9" viewBox="0 0 10 10" style="vertical-align:-1px"><rect x="2" y="2" width="6" height="6" fill="none" stroke="#EAF2FC"/><path d="M0 4h2M0 6h2M8 4h2M8 6h2M4 0v2M6 0v2M4 8v2M6 8v2" stroke="#EAF2FC"/></svg> SILICONBEAST AIR</span><span>BOARDING PASS</span></div><div class="route"><div>YEG<small>EDMONTON</small></div><svg width="34" height="14" viewBox="0 0 34 14"><path d="M1 7 H33" stroke="#B6B8BD" stroke-dasharray="2 2"/><path class="plane" d="M13 7 l-4 -5 h2 l6 5 l-6 5 h-2 z M17 6 h8 l3 -3 h2 l-2 4 l2 4 h-2 l-3 -3 h-8 z" fill="#1C4F8A"/></svg><div>???<small>YOUR CITY</small></div></div><div class="meta"><span>PASSENGER<b>DUGGAL/SUVIR</b></span><span>FLIGHT<b>SB2027</b></span><span>DEPARTS<b>MAY 2027</b></span><span>SEAT<b>1A · window</b></span><span>GATE<b>Summer ’27</b></span><span>GROUP<b>1 · co-op</b></span></div><div class="stampco">CO-OP</div><div class="boarded">BOARDED ✓</div></div><div class="stub"><span>SB2027</span><span>1A</span><div class="bar"></div><span>YEG→???</span></div></div></div>` },
  { name: "To-do sticky", side: "r", anchor: "Abstract", dy: 0, k: 0.03, html: `<div class="lift"><div class="todo"><div class="tape"></div><h5>TODO · THIS TERM <span>NOV ’26</span></h5><ul><li class="done" tabindex="0">fix LoRa driver bugs</li><li class="done" tabindex="0">ship the lab notes site</li><li tabindex="0">HDMI timing on the Nano</li><li tabindex="0">find a Summer ’27 co-op</li><li tabindex="0">tape-out (someday)</li></ul><svg class="doodle" width="40" height="30" viewBox="0 0 40 30"><rect x="10" y="6" width="18" height="18" fill="none" stroke="#6b5f2a" stroke-width="1.2"/><path d="M6 10h4M6 15h4M6 20h4M28 10h4M28 15h4M28 20h4" stroke="#6b5f2a"/><text x="19" y="18" text-anchor="middle" font-family="${MONO}" font-size="6" fill="#6b5f2a">:)</text></svg><div class="curl"></div></div><svg class="pencil" width="120" height="20" viewBox="0 0 120 20"><polygon points="0,10 14,4 14,16" fill="#E8C58F"/><polygon points="0,10 5,8 5,12" fill="#3a3d42"/><rect x="14" y="4" width="84" height="12" fill="#F2C230"/><rect x="14" y="4" width="84" height="4" fill="#F7D560"/><rect x="98" y="3" width="8" height="14" fill="#B9BEC5"/><rect x="106" y="3" width="11" height="14" rx="3" fill="#F7B3CF"/><text x="56" y="13" text-anchor="middle" font-family="${MONO}" font-size="5" fill="#6b5f2a">HB · 2</text></svg></div>` },
  { name: "Chai", side: "l", anchor: "Experience", dy: 60, k: -0.03, html: `<div class="ring" style="width:92px;height:92px;left:96px;top:110px"></div><div class="ring" style="width:60px;height:60px;left:-14px;top:150px;opacity:.6"></div><div class="lift">${mug()}</div>` },
  { name: "Bench polaroids", side: "r", anchor: "Impact", dy: 20, k: 0.03, html: `<div class="lift" style="position:relative;width:230px;height:220px">${polaroid(`<svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#3b3226"/><rect x="10" y="22" width="74" height="54" rx="3" fill="#1E6B3E"/><rect x="38" y="38" width="18" height="18" fill="#1B1D21"/><path d="M10 32 H38 M56 48 H84 M28 76 V60 H38 M60 22 V36" stroke="#D7B654" stroke-width="1.4" fill="none"/><rect x="80" y="40" width="12" height="8" fill="#D7B654"/><path d="M92 44 H98 L98 10" stroke="#2C2F35" stroke-width="3"/>${range(6).map((i) => `<rect x="${16 + i * 9}" y="64" width="5" height="3" fill="#E9D4A2"/>`).join("")}<circle cx="20" cy="28" r="2.4" fill="#E5483B"/></svg>`, "RF board v2", "11 26 ’26", -7, "", 0, 10)}${polaroid(`<svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#26303a"/><rect x="0" y="70" width="100" height="30" fill="#4a3a2a"/><rect x="10" y="28" width="62" height="44" rx="3" fill="#C5C9CF"/><rect x="14" y="32" width="40" height="30" fill="#0b1210"/>${range(5).map((i) => `<path d="M${14 + i * 10} 32 V62 M14 ${32 + i * 7.5} H54" stroke="#1d3a2e" stroke-width=".5"/>`).join("")}<path d="M14 54 L20 54 L20 40 L28 40 L28 54 L36 54 L36 40 L44 40 L44 54 L54 54" stroke="#7BE3A6" stroke-width="1.3" fill="none"/>${range(6).map((i) => `<circle cx="${60 + (i % 2) * 7}" cy="${38 + Math.floor(i / 2) * 9}" r="2.6" fill="#3a3d42"/>`).join("")}<path d="M72 60 C86 66 84 82 96 88" stroke="#2C2F35" stroke-width="2" fill="none"/><circle cx="82" cy="80" r="7" fill="#E8D3A0"/><path d="M78 78 h8" stroke="#8a5a30"/></svg>`, "scope, first light", "11 03 ’26", 6, " b", 92, 70)}</div>` },
  { name: "Bench crumbs", side: "l", anchor: "From the bench", dy: 40, k: -0.03, html: `<div class="lift">${parts()}<div class="cap">bench crumbs</div></div>` },
  { name: "Note pad", side: "l", anchor: "Contact", dy: 20, k: 0.02, html: `<div class="lift"><div class="notepad" tabindex="0" role="button" aria-label="Write Suvir a note"><div class="pg p3"></div><div class="pg p2"></div><div class="pg p1"><b>notes for Suvir</b><span>click to write one ✎</span></div></div></div>` },
  { name: "Tic-tac-toe", side: "r", anchor: "Interests", dy: 0, k: 0.03, html: `<div class="lift"><div class="ttt"><svg viewBox="0 0 230 230"><path class="draw" d="M85 25 C83 90 87 150 84 205" stroke="#2C2F35" stroke-width="2"/><path class="draw" d="M146 24 C148 92 144 150 147 206" stroke="#2C2F35" stroke-width="2" style="animation-delay:.1s"/><path class="draw" d="M26 85 C90 83 150 87 206 84" stroke="#2C2F35" stroke-width="2" style="animation-delay:.2s"/><path class="draw" d="M25 146 C92 148 150 144 206 147" stroke="#2C2F35" stroke-width="2" style="animation-delay:.3s"/><g class="marks"></g></svg><div class="msg"></div><button class="tttreset" type="button">new game</button></div></div>` }
];

const DESK_CSS = `.sbdesk { position: absolute; left: 0; top: 0; width: 100%; height: 0; z-index: 6; pointer-events: none; --f-hand: "Architects Daughter", "Comic Sans MS", cursive; --f-scrawl: "Caveat", cursive; --f-serif: "Instrument Serif", Georgia, serif; --f-mono: "B612 Mono", ui-monospace, monospace; }
.sbdesk .obj { position: absolute; pointer-events: auto; }
.sbdesk .obj .sc { width: max-content; }
.sbdesk .stuck { pointer-events: auto; }
.sbdesk .stuck .send { display: block; margin-top: 6px; font: 400 8px/1 var(--f-mono); letter-spacing: .06em; color: #1F3A93; text-decoration: underline; }
.sbdesk .bug { pointer-events: auto; }
@media print { .sbdesk { display: none; } }
.sbdesk .obj { position: absolute; z-index: 3; will-change: transform; }
.sbdesk .obj .sc { width: max-content; }
.sbdesk .obj .lift { transition: transform .25s cubic-bezier(.3,.7,.3,1.4), filter .25s; filter: drop-shadow(0 3px 4px rgba(0,0,0,.25)); }
.sbdesk .obj:hover .lift { transform: translateY(-4px) rotate(-1deg); filter: drop-shadow(0 8px 8px rgba(0,0,0,.22)); }
.sbdesk .cap { font-family: var(--f-scrawl); font-size: 16px; color: #2C4A3A; margin-top: 6px; line-height: 1.1; }
.sbdesk button.plain { all: unset; cursor: pointer; }
.sbdesk button.plain:focus-visible, .sbdesk .todo li:focus-visible { outline: 2px solid #C8322B; outline-offset: 2px; }
.sbdesk .pass { width: 200px; display: flex; background: #fff; border-radius: 6px; overflow: hidden; font-family: var(--f-mono); color: #22252B; transform: rotate(-6deg); }
.sbdesk .pass .main { flex: 1; padding: 0 0 8px; }
.sbdesk .pass .band { background: #1C4F8A; color: #EAF2FC; font-size: 8px; letter-spacing: .16em; padding: 5px 8px; display: flex; justify-content: space-between; }
.sbdesk .pass .route { display: flex; align-items: baseline; justify-content: space-between; padding: 6px 8px 2px; font-size: 20px; font-weight: 700; }
.sbdesk .pass .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 8px; padding: 2px 8px; font-size: 7px; letter-spacing: .08em; color: #74777D; }
.sbdesk .pass .meta b { display: block; font-size: 10px; color: #22252B; letter-spacing: 0; }
.sbdesk .pass .stub { width: 44px; border-left: 2px dashed #B6B8BD; padding: 6px 4px; font-size: 7px; color: #74777D; display: grid; align-content: space-between; transition: transform .35s cubic-bezier(.3,.7,.3,1.3); transform-origin: 0 100%; background: #fff; }
.sbdesk .pass .bar { height: 26px; background: repeating-linear-gradient(90deg, #22252B 0 1px, transparent 1px 3px, #22252B 3px 5px, transparent 5px 6px); }
.sbdesk .obj:hover .pass .stub { transform: rotate(8deg) translateX(4px); }
.sbdesk .todo { width: 172px; background: #FCE77A; padding: 18px 14px 14px; transform: rotate(3deg); font-family: var(--f-scrawl); font-size: 18px; color: #2A2416; position: relative; }
.sbdesk .todo h5 { margin: 0 0 6px; font: 400 9px/1 var(--f-mono); letter-spacing: .14em; color: #6b5f2a; }
.sbdesk .todo ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.sbdesk .todo li { cursor: pointer; display: flex; gap: 6px; align-items: baseline; line-height: 1.05; }
.sbdesk .todo li::before { content: ""; flex: 0 0 12px; height: 12px; border: 1.5px solid #2A2416; border-radius: 2px; transform: translateY(2px); }
.sbdesk .todo li.done { text-decoration: line-through; text-decoration-color: #C8322B; text-decoration-thickness: 2px; color: #6b5f2a; }
.sbdesk .todo li.done::before { background: linear-gradient(135deg, transparent 42%, #C8322B 42% 58%, transparent 58%), linear-gradient(45deg, transparent 42%, #C8322B 42% 58%, transparent 58%); }
.sbdesk .tape { position: absolute; left: 50%; top: -9px; width: 56px; height: 18px; margin-left: -28px; background: rgba(236,226,190,.85); transform: rotate(-4deg); }
.sbdesk .tape.b { background: repeating-linear-gradient(45deg, rgba(120,190,255,.7) 0 6px, rgba(255,255,255,.7) 6px 12px); }
.sbdesk .card { width: 190px; background: #fff; background-image: linear-gradient(transparent 26px, #E5483B 26px 27px, transparent 27px), repeating-linear-gradient(transparent 0 17px, rgba(61,125,216,.35) 17px 18px); background-size: 100% 100%, 100% 18px; background-position: 0 0, 0 10px; padding: 7px 12px 10px; font-family: var(--f-scrawl); font-size: 16px; line-height: 18px; color: #22252B; position: relative; }
.sbdesk .card h5 { margin: 0 0 6px; font-family: var(--f-hand); font-size: 14px; font-weight: 400; line-height: 20px; }
.sbdesk .card ol { margin: 0; padding-left: 16px; }
.sbdesk .steam path { fill: none; stroke: #9AA5AE; stroke-width: 2; stroke-linecap: round; opacity: 0; animation: steam 3.2s ease-in-out infinite; }
.sbdesk .steam path:nth-child(2) { animation-delay: 1s; }
.sbdesk .steam path:nth-child(3) { animation-delay: 2s; }
.sbdesk .ring { position: absolute; border-radius: 50%; border: 5px solid rgba(120,74,30,.22); box-shadow: inset 0 0 0 2px rgba(120,74,30,.12); }
.sbdesk .pol { position: relative; background: #fff; padding: 7px 7px 26px; width: 128px; font-family: var(--f-scrawl); font-size: 15px; text-align: center; color: #22252B; }
.sbdesk .pol .ph { width: 100%; aspect-ratio: 1; position: relative; overflow: hidden; }
.sbdesk .pass { width: 236px; background: linear-gradient(180deg,#fff,#F6F4EE); box-shadow: inset 0 0 0 1px rgba(0,0,0,.06); position: relative; }
.sbdesk .pass::after { content: ""; position: absolute; left: 0; right: 44px; top: 54%; height: 1px; background: rgba(0,0,0,.06); }
.sbdesk .pass .band { font-size: 7px; letter-spacing: .14em; align-items: center; }
.sbdesk .pass .route { font-size: 21px; align-items: center; padding: 7px 9px 3px; }
.sbdesk .pass .route small { display: block; font-size: 5.5px; letter-spacing: .14em; color: #74777D; font-weight: 400; }
.sbdesk .pass .meta { grid-template-columns: 1fr 1fr 1fr; padding: 3px 9px 2px; }
.sbdesk .pass .meta b { font-size: 8.5px; }
.sbdesk .pass .stub { width: 50px; text-align: center; background-image: radial-gradient(circle at 0 6px, #D9E3DA 2px, transparent 2.5px); background-size: 4px 9px; background-repeat: repeat-y; background-color: #fff; }
.sbdesk .pass .stub .bar { height: 46px; width: 22px; margin: 0 auto; background: repeating-linear-gradient(#22252B 0 1px, transparent 1px 3px, #22252B 3px 5px, transparent 5px 6px, #22252B 6px 6.5px, transparent 6.5px 8px); }
.sbdesk .stampco { position: absolute; right: 58px; bottom: 12px; font: 700 13px/1 var(--f-mono); letter-spacing: .1em; color: rgba(200,50,43,.75); border: 2px solid rgba(200,50,43,.7); border-radius: 4px; padding: 3px 6px; transform: rotate(-14deg); mix-blend-mode: multiply; }
.sbdesk .todo { width: 190px; background: linear-gradient(170deg, #FDEB86, #F7DC5E); box-shadow: 0 1px 0 rgba(0,0,0,.05); }
.sbdesk .todo h5 { display: flex; justify-content: space-between; }
.sbdesk .todo .doodle { position: absolute; right: 10px; bottom: 8px; transform: rotate(-8deg); opacity: .8; }
.sbdesk .todo .curl { position: absolute; right: 0; bottom: 0; width: 26px; height: 26px; background: linear-gradient(135deg, transparent 50%, #E2C548 50%, #F6E7A6 80%); box-shadow: -2px -2px 3px rgba(0,0,0,.08); }
.sbdesk .pencil { position: absolute; left: -30px; bottom: -14px; transform: rotate(-18deg); filter: drop-shadow(0 2px 2px rgba(0,0,0,.25)); }
.sbdesk .card .fn { display: grid; font-size: 15px; line-height: 18px; }
.sbdesk .card .fn b { font-weight: 400; letter-spacing: 1px; }
.sbdesk .card .tiny { float: right; font-family: var(--f-mono); font-size: 9px; color: #C8322B; }
.sbdesk .splat { position: absolute; border-radius: 48% 52% 40% 60% / 55% 45% 55% 45%; filter: blur(.4px); mix-blend-mode: multiply; }
.sbdesk .pol .stamp { position: absolute; right: 5px; bottom: 4px; font: 700 8px/1 var(--f-mono); color: #FF9A3C; text-shadow: 0 0 3px rgba(255,120,30,.8); letter-spacing: .05em; }
.sbdesk .pol .ph::after { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,.18), transparent 40%); }
.sbdesk .obj .sc { transition: opacity .5s ease-out, translate .8s cubic-bezier(.3,1.5,.5,1), rotate .8s cubic-bezier(.3,1.5,.5,1); }
.sbdesk .obj:not(.in) .sc { opacity: 0; translate: 0 -22px; rotate: var(--tilt, -4deg); }
.sbdesk .lift, .sbdesk .todo li, .sbdesk .card { position: relative; }
.sbdesk .mugbody { transform-box: fill-box; transform-origin: 50% 50%; }
.sbdesk .mugbody { transform-origin: 30% 100%; }
.sbdesk .obj:hover .tail { animation: tailflick .5s ease-in-out 2; }
.sbdesk .steam path { animation: steam 3.2s ease-in-out infinite; }
.sbdesk .obj:hover .steam path { animation: steamcurl 1.8s ease-in-out infinite; }
.sbdesk .pass .stub { transition: transform .45s cubic-bezier(.3,1.5,.5,1), box-shadow .45s; }
.sbdesk .obj:hover .pass .stub { transform: rotate(11deg) translate(6px, 3px); box-shadow: -3px 2px 6px rgba(0,0,0,.18); }
.sbdesk .boarded { position: absolute; left: 40px; top: 38px; font: 700 15px/1 var(--f-mono); letter-spacing: .08em; color: rgba(30,127,78,.8); border: 2.5px solid rgba(30,127,78,.75); border-radius: 5px; padding: 4px 8px; transform: rotate(9deg) scale(2.4); opacity: 0; pointer-events: none; mix-blend-mode: multiply; }
.sbdesk .boarded.on { animation: stamp .55s cubic-bezier(.2,1.6,.4,1) forwards; }
.sbdesk .todo li { transition: color .3s; }
.sbdesk .todo li::after { content: ""; position: absolute; left: 16px; right: 0; top: 55%; height: 2px; border-radius: 2px; background: #C8322B; transform: scaleX(0) rotate(-1.5deg); transform-origin: 0 50%; transition: transform .45s cubic-bezier(.6,.1,.3,1); }
.sbdesk .todo li.done { text-decoration: none; }
.sbdesk .todo li.done::after { transform: scaleX(1) rotate(-1.5deg); }
.sbdesk .todo li::before { transition: background .3s .25s; }
.sbdesk .todo li:hover { color: #1F3A93; }
.sbdesk .pol { transition: transform .45s cubic-bezier(.3,1.5,.5,1); cursor: pointer; }
.sbdesk .obj:hover .pol:first-of-type { transform: rotate(-13deg) translate(-12px, -6px) !important; }
.sbdesk .obj:hover .pol:last-of-type { transform: rotate(11deg) translate(10px, 8px) !important; }
.sbdesk .pol .flash { position: absolute; inset: 0; background: #fff; }
.sbdesk .pglow { opacity: 0; filter: blur(5px); transition: opacity .3s; }
.sbdesk .obj:hover .pglow { opacity: .7; }
.sbdesk .res { transform-box: fill-box; transform-origin: center; transition: transform .6s cubic-bezier(.3,1.4,.5,1); }
.sbdesk .obj:hover .res { transform: translateX(12px) rotate(8deg); }
.sbdesk .obj:hover .strand { animation: wiggle .5s ease-in-out infinite alternate; }
.sbdesk .puff { position: absolute; z-index: 9; pointer-events: none; font-family: var(--f-scrawl); font-size: 18px; color: #1F3A93; white-space: nowrap; }
.sbdesk .puff.red { color: #C8322B; }
.sbdesk .puff.note { font-size: 20px; color: #22252B; }
.sbdesk .puff.zap { font-size: 18px; }
.sbdesk .puff.tok { font-family: var(--f-mono); font-size: 10px; color: #5A5D63; }
.sbdesk .puff.sip { color: #7a5534; }
.sbdesk .obj { touch-action: none; user-select: none; -webkit-user-select: none; cursor: grab; }
.sbdesk .obj.held { cursor: grabbing; z-index: 8; }
.sbdesk .obj.moved { z-index: 6; }
.sbdesk .obj .lift { filter: drop-shadow(0 1px 1px rgba(0,0,0,.22)) drop-shadow(var(--sx, 3px) var(--sy, 5px) var(--sb, 6px) rgba(20,30,25,var(--so, .26))); transition: transform .3s cubic-bezier(.3,1.5,.5,1), filter .25s; }
.sbdesk .obj:hover .lift { transform: translateY(-3px); filter: drop-shadow(0 1px 1px rgba(0,0,0,.18)) drop-shadow(calc(var(--sx, 3px) * 1.4) calc(var(--sy, 5px) * 1.4) calc(var(--sb, 6px) * 1.3) rgba(20,30,25,var(--so, .26))); }
.sbdesk .obj.held .lift { transform: scale(1.05) translateY(-6px); transition: transform .2s cubic-bezier(.3,1.5,.5,1); }
.sbdesk .todo::after, .sbdesk .card::after, .sbdesk .pol::after, .sbdesk .pass .main::after { content: ""; position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .42 0 0 0 0 .38 0 0 0 0 .32 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E"); opacity: .28; mix-blend-mode: multiply; pointer-events: none; border-radius: inherit; }
.sbdesk .pass .main { position: relative; }
.sbdesk .bug { all: unset; position: absolute; left: 0; top: 0; z-index: 7; width: 26px; height: 26px; cursor: pointer; filter: drop-shadow(1px 2px 1px rgba(0,0,0,.3)); }
.sbdesk .bug .legs { animation: legs .18s steps(2) infinite; transform-box: fill-box; transform-origin: center; }
.sbdesk .bug.stop .legs { animation: none; }
.sbdesk .bug.squashed svg { transform: scale(1.5, .25); transition: transform .12s ease-out; }
.sbdesk .bug.squashed::after { content: ""; position: absolute; left: -8px; top: 6px; width: 42px; height: 18px; border-radius: 50%; background: radial-gradient(rgba(34,37,43,.55), rgba(34,37,43,0) 70%); }
.sbdesk .bug:focus-visible { outline: 2px solid #C8322B; outline-offset: 3px; border-radius: 50%; }
.sbdesk .puff.green { color: #1E7F4E; font-size: 19px; }
.sbdesk .steam { transition: transform .4s ease-out; transform-box: fill-box; transform-origin: 50% 100%; }
.sbdesk .route > div:last-child { display: inline-block; min-width: 46px; text-align: right; }
.sbdesk .route > div.flip { animation: flapf .11s steps(2); }
.sbdesk .route > div.landed { color: #1E7F4E; }
.sbdesk .obj.swimming .duck { animation: bob 2.2s ease-in-out infinite; }
.sbdesk .notepad { position: relative; width: 170px; height: 150px; cursor: pointer; }
.sbdesk .notepad .pg { position: absolute; inset: 0; background: linear-gradient(170deg, #9EE6B8, #7FD39E); border-radius: 2px; }
.sbdesk .notepad .p3 { transform: translate(5px, 6px) rotate(3deg); filter: brightness(.88); }
.sbdesk .notepad .p2 { transform: translate(2px, 3px) rotate(1.5deg); filter: brightness(.94); }
.sbdesk .notepad .p1 { display: grid; align-content: start; gap: 6px; padding: 14px; font-family: var(--f-scrawl); font-size: 18px; color: #1d3b2a; }
.sbdesk .notepad .p1 b { font: 400 9px/1 var(--f-mono); letter-spacing: .14em; text-transform: uppercase; color: #2c5a3f; }
.sbdesk .notepad textarea { all: unset; font-family: var(--f-scrawl); font-size: 18px; line-height: 1.15; color: #1d3b2a; height: 82px; white-space: pre-wrap; overflow-wrap: anywhere; }
.sbdesk .notepad .hintk { font: 400 8px/1 var(--f-mono); color: #2c5a3f; }
.sbdesk .notepad:focus-visible { outline: 2px solid #C8322B; outline-offset: 3px; }
.sbdesk .stuck { position: absolute; z-index: 6; width: 150px; min-height: 90px; padding: 12px; background: linear-gradient(170deg, #9EE6B8, #7FD39E); font-family: var(--f-scrawl); font-size: 18px; line-height: 1.15; color: #1d3b2a; box-shadow: 0 2px 2px rgba(0,0,0,.12), 3px 8px 12px rgba(20,30,25,.22); overflow-wrap: anywhere; }
.sbdesk .stuck::before { content: "for Suvir"; display: block; font: 400 8px/1 var(--f-mono); letter-spacing: .14em; text-transform: uppercase; color: #2c5a3f; margin-bottom: 6px; }
.sbdesk .pol { transform-style: preserve-3d; }
.sbdesk .pol .back { position: absolute; inset: 0; background: #F4F1E8; transform: rotateY(180deg); backface-visibility: hidden; display: grid; place-items: center; padding: 14px; font-family: var(--f-scrawl); font-size: 17px; color: #1F3A93; text-align: center; }
.sbdesk .pol > .ph, .sbdesk .pol > .tape { backface-visibility: hidden; }
.sbdesk .obj .pol.flipped, .sbdesk .obj:hover .pol.flipped { transform: rotateY(180deg) rotate(4deg) !important; transition: transform .6s cubic-bezier(.3,1.4,.5,1); }
.sbdesk .obj:not(.in) .sc { opacity: 0; translate: none; rotate: var(--tilt, -4deg); scale: 1.14; }
.sbdesk .obj .sc { transition: opacity .45s ease-out, scale .7s cubic-bezier(.3,1.3,.5,1), rotate .7s cubic-bezier(.3,1.3,.5,1); }
.sbdesk .obj:hover .lift { transform: scale(1.018); }
.sbdesk .obj.held .lift { transform: scale(1.06); }
.sbdesk .pol { transform-style: flat; }
.sbdesk .pol .back { backface-visibility: visible; transform: none; opacity: 0; transition: opacity .1s .25s; }
.sbdesk .obj .pol.flipped, .sbdesk .obj:hover .pol.flipped { transform: rotate(4deg) scaleX(-1) !important; transition: transform .5s cubic-bezier(.3,1.2,.5,1); }
.sbdesk .pol.flipped .back { opacity: 1; transform: scaleX(-1); }
.sbdesk .mugbody .steam path { fill: none; stroke: #fff; stroke-width: 3.2; stroke-linecap: round; opacity: 0; filter: blur(1.4px); transform-box: view-box; transform-origin: 85px 85px; animation: steamtop 3.8s ease-in-out infinite; }
.sbdesk .mugbody .steam path:nth-child(2) { animation-delay: 1.25s; }
.sbdesk .mugbody .steam path:nth-child(3) { animation-delay: 2.5s; }
.sbdesk .obj:hover .mugbody .steam path { animation: steamtop 2.2s ease-in-out infinite; }
.sbdesk .steam { transition: transform .5s ease-out; transform-origin: 50% 50%; }
.sbdesk .mugbody { transform-origin: 45% 50%; }
.sbdesk .coffee { transition: r .6s ease-in-out; }
.sbdesk .crema { transition: opacity .6s; }
.sbdesk .ttt { position: relative; width: 230px; height: 252px; background: #FFFEF9; transform: rotate(-3deg); background-image: repeating-linear-gradient(transparent 0 21px, rgba(61,125,216,.25) 21px 22px); }
.sbdesk .ttt::before { content: ""; position: absolute; left: 30px; top: 0; bottom: 0; width: 1px; background: rgba(229,72,59,.5); }
.sbdesk .ttt::after { content: ""; position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .42 0 0 0 0 .38 0 0 0 0 .32 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E"); opacity: .25; mix-blend-mode: multiply; pointer-events: none; }
.sbdesk .ttt svg { position: absolute; left: 0; top: 0; width: 230px; height: 230px; }
.sbdesk .ttt .cell { position: absolute; width: 60px; height: 60px; cursor: pointer; z-index: 2; }
.sbdesk .ttt .msg { position: absolute; left: 10px; right: 70px; bottom: 4px; font-family: var(--f-scrawl); font-size: 16px; line-height: 1.05; color: #C8322B; }
.sbdesk .ttt .tttreset { all: unset; position: absolute; right: 8px; bottom: 6px; z-index: 3; font: 400 8px/1 var(--f-mono); letter-spacing: .06em; color: #2C4A3A; border: 1px solid rgba(44,74,58,.35); border-radius: 999px; padding: 5px 7px; cursor: pointer; }
.sbdesk .draw { fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 200; stroke-dashoffset: 200; animation: drawit .45s ease-out forwards; }
.sbdesk .pop { animation: popin .35s cubic-bezier(.3,1.6,.5,1) both; transform-box: fill-box; }
@keyframes steam { 0% { opacity: 0; transform: translateY(8px); } 30% { opacity: .7; } 100% { opacity: 0; transform: translateY(-14px); } }
@keyframes tailflick { 50% { transform: rotate(-12deg); } }
@keyframes flow { to { stroke-dashoffset: -22.8; } }
@keyframes steamcurl { 0% { opacity: 0; transform: translateY(8px) skewX(0); } 40% { opacity: .85; transform: translateY(-4px) skewX(14deg); } 100% { opacity: 0; transform: translateY(-20px) skewX(-12deg); } }
@keyframes stamp { 0% { opacity: 0; transform: rotate(9deg) scale(2.4); } 60% { opacity: 1; transform: rotate(9deg) scale(.92); } 100% { opacity: .9; transform: rotate(9deg) scale(1); } }
@keyframes wiggle { from { d: path("M82 47 C100 46 110 60 132 54"); } to { d: path("M82 47 C98 56 114 48 132 58"); } }
@keyframes legs { 50% { transform: scaleY(.85) rotate(4deg); } }
@keyframes flapf { 0% { transform: scaleY(1); } 50% { transform: scaleY(.15); filter: brightness(.7); } 100% { transform: scaleY(1); } }
@keyframes imp { from { transform: translate(-50%, -50%) rotate(var(--rot)) scale(1.25); opacity: 0; } }
@keyframes bob { 50% { transform: translateY(-4px) rotate(3deg); } }
@keyframes flick { 50% { opacity: .92; } }
@keyframes steamtop { 0% { opacity: 0; transform: rotate(0) scale(.7); } 35% { opacity: .6; } 100% { opacity: 0; transform: rotate(70deg) scale(1.2); } }
@keyframes drawit { to { stroke-dashoffset: 0; } }
@keyframes popin { from { opacity: 0; scale: .2; } }
@media (prefers-reduced-motion: reduce) {.sbdesk .obj .sc { transition: none; }.sbdesk .obj:not(.in) .sc { opacity: 1; translate: none; rotate: none; }.sbdesk .obj:hover .steam path, .sbdesk .obj:hover .strand, .sbdesk .obj:hover .tail { animation: none; }}
@media (prefers-reduced-motion: reduce) {.sbdesk .bug { display: none; }.sbdesk .steam { transition: none; }}
@media (prefers-reduced-motion: reduce) {.sbdesk .draw, .sbdesk .pop { animation: none; stroke-dashoffset: 0; }}
@media (prefers-reduced-motion: reduce) {.sbdesk .steam path { animation: none; }.sbdesk .steam path { opacity: .5; }}`;

// ---------- runtime ----------
function startDesk(opts) {
  const w = window;
  if (w.__sbDesk) return w.__sbDesk;
  const reduce = () => !!(w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const spring = "cubic-bezier(.3,1.5,.5,1)";
  const css = document.createElement("style"); css.id = "sbdesk-css"; css.textContent = DESK_CSS; document.head.appendChild(css);
  const root = document.createElement("div"); root.className = "sbdesk"; root.setAttribute("aria-label", "Desk"); document.body.appendChild(root);

  // objects
  const placed = OBJ.map((o, i) => {
    const el = document.createElement("div");
    el.className = "obj"; el.innerHTML = `<div class="sc">${o.html}</div>`;
    el._o = o; el._p = { x: 0, y: 0, r: 0 };
    el.style.setProperty("--tilt", `${(i % 2 ? 1 : -1) * (3 + (i % 3))}deg`);
    root.appendChild(el);
    return el;
  });

  // ---- layout: beside named sections of the notebook sheet, scaled to fit the margin ----
  const sheetEl = () => document.querySelector('[data-framer-name="Index sheet"]');
  let active = false;
  function layout() {
    const sh = sheetEl();
    const r = sh && sh.getBoundingClientRect();
    const docW = document.documentElement.clientWidth;
    const left = r ? r.left : 0, right = r ? docW - r.right : 0;
    const margin = Math.min(left, right);
    active = !!sh && sh.offsetParent !== null && margin >= opts.minMargin;
    root.style.display = active ? "" : "none";
    if (!active) return;
    root.style.height = document.documentElement.scrollHeight + "px";
    placed.forEach((el) => {
      const o = el._o, a = document.querySelector(`[data-framer-name="${o.anchor}"]`);
      if (!a) { el.style.display = "none"; return; }
      el.style.display = "";
      const ar = a.getBoundingClientRect();
      const sc = el.firstElementChild; sc.style.transform = "none";
      const wd = sc.scrollWidth, room = (o.side === "l" ? left : right) - 28;
      const s = Math.max(.55, Math.min(1, room / wd));
      sc.style.transformOrigin = o.side === "l" ? "0 0" : "100% 0";
      sc.style.transform = `scale(${s.toFixed(3)})`;
      const off = Math.max(8, (room - wd * s) / 2 + 10);
      el.style.left = el.style.right = "";
      el.style[o.side === "l" ? "left" : "right"] = `${off}px`;
      el.style.top = `${ar.top + w.scrollY + o.dy}px`;
    });
    place(); light();
  }
  let lt = 0;
  const relayout = () => { cancelAnimationFrame(lt); lt = requestAnimationFrame(layout); };

  // ---- motion: a gentle drift tied to each object's place on screen, plus where it was dragged ----
  function place() {
    const vh = w.innerHeight;
    placed.forEach((el) => {
      if (el.style.display === "none") return;
      const top = parseFloat(el.style.top) - w.scrollY;
      const drift = reduce() ? 0 : (top - vh / 2) * (el._o.k || 0);
      el.style.transform = `translate(${el._p.x.toFixed(1)}px, ${(el._p.y + drift).toFixed(1)}px) rotate(${el._p.r.toFixed(2)}deg)`;
    });
  }
  // ---- lighting: shadows fall away from the cursor, like a desk lamp ----
  let Lx = w.innerWidth * .2, Ly = 0;
  function light() {
    placed.forEach((el) => {
      if (el.style.display === "none") return;
      const b = el.getBoundingClientRect(); if (b.bottom < -200 || b.top > w.innerHeight + 200) return;
      const dx = b.left + b.width / 2 - Lx, dy = b.top + b.height / 2 - Ly, d = Math.hypot(dx, dy) || 1;
      const len = Math.min(16, 3 + d / 80) * (el.classList.contains("held") ? 2.6 : 1);
      el.style.setProperty("--sx", `${(dx / d * len).toFixed(1)}px`); el.style.setProperty("--sy", `${(dy / d * len).toFixed(1)}px`); el.style.setProperty("--sb", `${(4 + len * .6).toFixed(1)}px`);
    });
  }
  const onMove = (e) => { Lx = e.clientX; Ly = e.clientY; if (active) light(); };
  const onScroll = () => { if (active) { place(); light(); } };

  // ---- settle onto the desk when they scroll into view ----
  const io = "IntersectionObserver" in w ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" }) : null;
  placed.forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

  // ---- drag & toss with momentum ----
  let dragged = false;
  placed.forEach((el) => {
    let sx = 0, sy = 0, ox = 0, oy = 0, vx = 0, vy = 0, t = 0, px = 0, py = 0, on = false, id = null;
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest("textarea, a, .nodrag")) return;
      sx = px = e.clientX; sy = py = e.clientY; ox = el._p.x; oy = el._p.y; t = performance.now(); vx = vy = 0; on = false; id = e.pointerId; dragged = false;
      cancelAnimationFrame(el._raf);
    });
    el.addEventListener("pointermove", (e) => {
      if (id !== e.pointerId) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!on && Math.hypot(dx, dy) > 7) { on = true; dragged = true; el.setPointerCapture(id); el.classList.add("held", "moved"); }
      if (!on) return;
      const now = performance.now(), dt = Math.max(8, now - t);
      vx = (e.clientX - px) / dt * 16; vy = (e.clientY - py) / dt * 16; px = e.clientX; py = e.clientY; t = now;
      el._p.x = ox + dx; el._p.y = oy + dy; el._p.r = Math.max(-14, Math.min(14, vx * .9));
      place(); light();
    });
    const end = (e) => {
      if (id !== e.pointerId) return; id = null;
      if (!on) return;
      el.classList.remove("held");
      if (reduce()) { el._p.r = 0; place(); light(); return; }
      const glide = () => { vx *= .9; vy *= .9; el._p.x += vx; el._p.y += vy; el._p.r *= .86; place(); light(); if (Math.hypot(vx, vy) > .3 || Math.abs(el._p.r) > .2) el._raf = requestAnimationFrame(glide); };
      el._raf = requestAnimationFrame(glide);
    };
    el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
    el.addEventListener("click", (e) => { if (dragged) { e.stopPropagation(); e.preventDefault(); dragged = false; } }, true);
  });

  // ---- floating text puffs ----
  function puff(host, text, x, y, cls = "") {
    if (reduce()) return;
    const p = document.createElement("span"); p.className = "puff " + cls; p.textContent = text; p.style.left = x + "px"; p.style.top = y + "px";
    host.appendChild(p);
    p.animate([{ opacity: 0, transform: "translate(-50%, 0) scale(.6)" }, { opacity: 1, transform: "translate(-50%, -14px) scale(1)", offset: .25 }, { opacity: 0, transform: "translate(-50%, -42px) scale(1.05)" }], { duration: 1100, easing: "ease-out" }).finished.then(() => p.remove());
  }
  const local = (host, e) => { const r = host.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };

  // ---- boarding pass: departures board + takeoff + BOARDED stamp ----
  const CITIES = ["YYZ", "YVR", "SFO", "SEA", "AUS", "YUL", "NYC", "BOS", "???"];
  root.querySelectorAll(".pass").forEach((pass) => {
    pass.style.cursor = "pointer";
    pass.addEventListener("click", () => {
      const plane = pass.querySelector(".plane"), st = pass.querySelector(".boarded"), dest = pass.querySelector(".route > div:last-child");
      if (!reduce()) plane.animate([{ transform: "translate(0,0) rotate(0)" }, { transform: "translate(8px,-1px) rotate(-6deg)", offset: .3 }, { transform: "translate(26px,-9px) rotate(-14deg)", opacity: 0, offset: .7 }, { transform: "translate(-12px,0)", opacity: 0, offset: .71 }, { transform: "translate(0,0)", opacity: 1 }], { duration: 1400, easing: "ease-in-out" });
      if (dest && !dest._busy) {
        dest._busy = true; const small = dest.querySelector("small"); let i = 0;
        const step = () => {
          if (i < CITIES.length && !reduce()) { dest.firstChild.textContent = CITIES[i++]; dest.classList.remove("flip"); void dest.offsetWidth; dest.classList.add("flip"); setTimeout(step, 110); }
          else { dest.firstChild.textContent = "YOU"; small.textContent = "YOUR TEAM?"; dest.classList.add("landed"); setTimeout(() => (dest._busy = false), 500); }
        };
        step();
      }
      st.classList.remove("on"); setTimeout(() => { void st.offsetWidth; st.classList.add("on"); }, reduce() ? 0 : 1500);
    });
  });

  // ---- to-do: pencil strike-through; tape-out wriggles free ----
  root.querySelectorAll(".todo li").forEach((li) => {
    const go = () => {
      if (li.textContent.startsWith("tape-out")) { if (!reduce()) li.animate([{ transform: "none" }, { transform: "translateX(-4px) rotate(-2deg)" }, { transform: "translateX(5px) rotate(2deg)" }, { transform: "none" }], { duration: 420 }); puff(li, "not yet!", li.offsetWidth * .55, -4, "red"); return; }
      li.classList.toggle("done");
    };
    li.addEventListener("click", go); li.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  // ---- chai: lift for a sip; steam drifts away from the cursor ----
  root.querySelectorAll(".mugbody").forEach((m) => {
    const svg = m.closest("svg"), cof = m.querySelector(".coffee"), crema = m.querySelector(".crema"), steam = svg.querySelector(".steam");
    let level = 0; svg.style.cursor = "pointer";
    svg.addEventListener("click", () => {
      if (!reduce()) m.animate([{ transform: "none" }, { transform: "translate(-8px, -12px) scale(1.14) rotate(-8deg)", offset: .35 }, { transform: "translate(-8px, -12px) scale(1.14) rotate(-8deg)", offset: .6 }, { transform: "none" }], { duration: 1000, easing: "ease-in-out" });
      level = (level + 1) % 5;
      setTimeout(() => { cof.setAttribute("r", String(37 - level * 3.2)); crema.style.opacity = level ? String(Math.max(0, .8 - level * .2)) : ".8"; }, 500);
      puff(svg.parentElement, level === 0 ? "more chai 🫖" : "ahh", 90, 20, "sip");
    });
    w.addEventListener("pointermove", (e) => {
      const r = svg.getBoundingClientRect(); const dx = e.clientX - (r.left + r.width * .45), dy = e.clientY - (r.top + r.height * .5);
      const near = Math.max(0, 1 - Math.hypot(dx, dy) / 200);
      steam.style.transform = `translate(${(-dx / 8 * near).toFixed(1)}px, ${(-dy / 8 * near).toFixed(1)}px)`;
    }, { passive: true });
  });

  // ---- polaroids: flash & develop; double-click to read the back ----
  const BACKS = ["first board that worked on the first try", "the trace that found the bug"];
  root.querySelectorAll(".pol").forEach((p, i) => {
    const back = document.createElement("div"); back.className = "back"; back.textContent = BACKS[i % 2]; p.appendChild(back);
    p.addEventListener("click", (e) => {
      e.stopPropagation(); if (reduce()) return;
      const ph = p.querySelector(".ph"); const f = document.createElement("span"); f.className = "flash"; ph.appendChild(f);
      f.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, easing: "ease-out" }).finished.then(() => f.remove());
      ph.animate([{ filter: "brightness(2.2) sepia(1) saturate(.3) blur(1.5px)" }, { filter: "brightness(1.4) sepia(.8) saturate(.6) blur(.6px)", offset: .3 }, { filter: "none" }], { duration: 2400, easing: "ease-out" });
    });
    p.addEventListener("dblclick", (e) => { e.stopPropagation(); p.classList.toggle("flipped"); });
  });

  // ---- notes for Suvir: write, tear off, stick; offer to email it ----
  root.querySelectorAll(".notepad").forEach((pad) => {
    const open = () => {
      if (pad.querySelector("textarea")) return;
      const p1 = pad.querySelector(".p1");
      p1.innerHTML = `<b>note for Suvir</b><textarea maxlength="160" placeholder="Great site! Let’s chat about…" aria-label="Your note"></textarea><span class="hintk">Enter to stick it</span>`;
      const ta = p1.querySelector("textarea"); ta.focus();
      ta.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" || e.shiftKey) return;
        e.preventDefault(); const text = ta.value.trim(); if (!text) return;
        tear(text); p1.innerHTML = `<b>notes for Suvir</b><span>click to write one ✎</span>`;
      });
    };
    pad.addEventListener("click", () => { if (!dragged) open(); });
    pad.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target === pad) open(); });
    function tear(text) {
      const r = pad.getBoundingClientRect(), d = root.getBoundingClientRect();
      const n = document.createElement("div"); n.className = "stuck";
      const mail = `mailto:${opts.email}?subject=${encodeURIComponent("A note from your portfolio")}&body=${encodeURIComponent(text)}`;
      n.innerHTML = `<span class="tx"></span><a class="send nodrag" href="${mail}">send it to Suvir ✉</a>`; n.querySelector(".tx").textContent = text;
      n.style.left = (r.left - d.left + 10) + "px"; n.style.top = (r.top - d.top) + "px";
      root.appendChild(n);
      const tx = 40 + Math.random() * 60, ty = -150 - Math.random() * 90, rot = Math.random() * 14 - 7;
      if (reduce()) { n.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`; return; }
      n.animate([{ transform: "translate(0,0) rotate(0) scale(1)" }, { transform: `translate(${tx * .4}px, ${ty * .3}px) rotate(${rot - 18}deg) scale(1.08)`, offset: .4 }, { transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(1)` }], { duration: 900, easing: "cubic-bezier(.3,.7,.3,1.1)", fill: "forwards" });
    }
  });

  // ---- tic-tac-toe on scrap paper ----
  root.querySelectorAll(".ttt").forEach((board) => {
    const marks = board.querySelector(".marks"), msg = board.querySelector(".msg");
    let B, over;
    const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    const cc = (i) => [24 + (i % 3) * 61 + 30, 24 + Math.floor(i / 3) * 61 + 30];
    const win = (b) => { for (const l of LINES) if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return l; return null; };
    const mark = (i, p) => {
      const [x, y] = cc(i), j = () => (Math.random() - .5) * 4;
      marks.insertAdjacentHTML("beforeend", p === "X"
        ? `<path class="draw" d="M${x - 17 + j()} ${y - 17 + j()} L${x + 17 + j()} ${y + 17 + j()}" stroke="#1F3A93" stroke-width="3"/><path class="draw" d="M${x + 17 + j()} ${y - 17 + j()} L${x - 17 + j()} ${y + 17 + j()}" stroke="#1F3A93" stroke-width="3" style="animation-delay:.15s"/>`
        : `<path class="draw" d="M${x + 2} ${y - 19} C${x + 24} ${y - 18} ${x + 22} ${y + 20} ${x} ${y + 19} C${x - 22} ${y + 18} ${x - 22} ${y - 18} ${x + 5} ${y - 17}" stroke="#2C2F35" stroke-width="2.6"/>`);
    };
    const minimax = (b, me) => {
      const ww = win(b); if (ww) return { s: b[ww[0]] === "O" ? 1 : -1 }; if (b.every(Boolean)) return { s: 0 };
      let best = { s: me === "O" ? -2 : 2 };
      b.forEach((v, i) => { if (v) return; b[i] = me; const r = minimax(b, me === "O" ? "X" : "O"); b[i] = null; if ((me === "O" && r.s > best.s) || (me === "X" && r.s < best.s)) best = { s: r.s, i }; });
      return best;
    };
    const check = () => {
      const ww = win(B);
      if (ww) { const a = cc(ww[0]), c = cc(ww[2]); marks.insertAdjacentHTML("beforeend", `<path class="draw" d="M${a[0] - 14} ${a[1] - 6} L${c[0] + 14} ${c[1] + 6}" stroke="#C8322B" stroke-width="3"/>`); over = true; msg.textContent = B[ww[0]] === "X" ? "ok, you win. you’d ace the interview too." : "pencil wins. rematch?"; return true; }
      if (B.every(Boolean)) { over = true; msg.textContent = "a draw. great minds."; return true; }
      return false;
    };
    const reset = () => { B = Array(9).fill(null); over = false; marks.innerHTML = ""; msg.textContent = ""; };
    reset();
    for (let i = 0; i < 9; i++) {
      const c = document.createElement("div"); c.className = "cell"; const [x, y] = cc(i); c.style.left = (x - 30) + "px"; c.style.top = (y - 30) + "px";
      c.addEventListener("click", (e) => {
        e.stopPropagation(); if (over || B[i]) return; B[i] = "X"; mark(i, "X"); if (check()) return;
        setTimeout(() => { const free = B.map((v, k) => (v ? null : k)).filter((k) => k !== null); const pick = Math.random() < .22 ? free[Math.floor(Math.random() * free.length)] : minimax(B, "O").i; B[pick] = "O"; mark(pick, "O"); check(); }, 450);
      });
      board.appendChild(c);
    }
    board.querySelector(".tttreset").addEventListener("click", (e) => { e.stopPropagation(); reset(); });
  });

  // ---- the bug: crawls across now and then; squash it to fix it ----
  let bugT = 0;
  function spawnBug() {
    if (reduce() || !active || document.hidden) { bugT = w.setTimeout(spawnBug, 15000); return; }
    const bug = document.createElement("button");
    bug.className = "bug"; bug.type = "button"; bug.setAttribute("aria-label", "A bug. Click to fix it.");
    bug.innerHTML = `<svg viewBox="0 0 30 30" width="26" height="26"><g class="legs" stroke="#22252B" stroke-width="1.3" stroke-linecap="round"><path d="M10 11 L4 7 M9 15 L3 15 M10 19 L4 23 M20 11 L26 7 M21 15 L27 15 M20 19 L26 23"/></g><ellipse cx="15" cy="16" rx="7" ry="9" fill="#2C2F35"/><path d="M15 7 V25" stroke="#55595F"/><circle cx="15" cy="6" r="4" fill="#22252B"/><path d="M13 3 L10 0 M17 3 L20 0" stroke="#22252B" stroke-width="1"/><circle cx="12" cy="13" r="1.4" fill="#E5483B"/><circle cx="18" cy="18" r="1.4" fill="#E5483B"/></svg>`;
    const W = document.documentElement.clientWidth, top0 = w.scrollY + 90, H = w.innerHeight - 180;
    const fromLeft = Math.random() < .5;
    let x = fromLeft ? -30 : W + 10, y = top0 + Math.random() * H;
    const tx = fromLeft ? W + 30 : -40, ty = top0 + Math.random() * H, ang0 = Math.atan2(ty - y, tx - x);
    root.appendChild(bug);
    let alive = true, t = 0, last = performance.now(), pause = 0;
    const walk = (now) => {
      if (!alive) return;
      const dt = Math.min(.05, (now - last) / 1000); last = now; t += dt;
      if (pause > 0) { pause -= dt; bug.classList.add("stop"); }
      else { bug.classList.remove("stop"); const ang = ang0 + Math.sin(t * 1.7) * .6; x += Math.cos(ang) * 46 * dt; y += Math.sin(ang) * 46 * dt; bug.style.transform = `translate(${x}px, ${y}px) rotate(${ang * 180 / Math.PI + 90}deg)`; if (Math.random() < .006) pause = .6 + Math.random(); }
      if ((fromLeft && x > W + 40) || (!fromLeft && x < -60)) { bug.remove(); bugT = w.setTimeout(spawnBug, 25000 + Math.random() * 20000); return; }
      requestAnimationFrame(walk);
    };
    requestAnimationFrame(walk);
    bug.addEventListener("click", (e) => {
      e.stopPropagation(); if (!alive) return; alive = false; bug.classList.add("squashed");
      const d = root.getBoundingClientRect(); puff(root, "bug fixed ✓", e.clientX - d.left, e.clientY - d.top - 10, "green");
      w.setTimeout(() => bug.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1200, fill: "forwards" }).finished.then(() => bug.remove()), 1600);
      bugT = w.setTimeout(spawnBug, 20000 + Math.random() * 20000);
    });
  }
  bugT = w.setTimeout(spawnBug, 6000);

  // ---- keep in step with the page ----
  w.addEventListener("resize", relayout); w.addEventListener("scroll", onScroll, { passive: true }); w.addEventListener("pointermove", onMove, { passive: true });
  const ro = "ResizeObserver" in w ? new ResizeObserver(relayout) : null; ro && ro.observe(document.body);
  const mo = new MutationObserver((recs) => { if (recs.some((r) => !root.contains(r.target))) relayout(); });
  mo.observe(document.body, { childList: true, subtree: true });
  document.fonts && document.fonts.ready.then(relayout);
  relayout(); w.setTimeout(relayout, 800); w.setTimeout(relayout, 2500);

  const api = { stop() { w.clearTimeout(bugT); ro && ro.disconnect(); mo.disconnect(); io && io.disconnect(); w.removeEventListener("resize", relayout); w.removeEventListener("scroll", onScroll); w.removeEventListener("pointermove", onMove); root.remove(); css.remove(); w.__sbDesk = null; } };
  w.__sbDesk = api;
  return api;
}


interface Props { minMargin: number; email: string }

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function Desk({ minMargin, email }: Props) {
    React.useEffect(() => {
        if (RenderTarget.current() === RenderTarget.canvas) return
        const d = startDesk({ minMargin: minMargin ?? 150, email: email || "suvir1@ualberta.ca" })
        return () => d && d.stop()
    }, [])
    return <div aria-hidden="true" style={{ width: 1, height: 1, pointerEvents: "none" }} />
}

addPropertyControls(Desk, {
    minMargin: { type: ControlType.Number, title: "Min margin", defaultValue: 150, min: 60, max: 400, unit: "px" },
    email: { type: ControlType.String, title: "Email", defaultValue: "suvir1@ualberta.ca" },
})
