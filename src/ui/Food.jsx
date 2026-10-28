// Flock & Flame's food, drawn in code as one flat sticker language: no outlines, a base colour, one
// darker shade on the underside, one highlight on top, and texture marks (crumb, grill lines, char,
// herbs). Each piece sits in a 200 × 200 box so every tile and hero can scale it. These stand in for
// food photography until the shop's own photos are taken; see docs/recap.md for the photo slots.

const C = {
  crumb: '#E9A23B', glaze: '#9A3A12', crumbDark: '#B86A14', crumbLight: '#F8CF72',
  grill: '#B9582A', grillDark: '#7A3016', grillLight: '#DE8A4E', char: '#2B1710',
  bone: '#F4E8D4', boneShade: '#D8C7AC',
  mayo: '#F7ECD0', mayoShade: '#E3CF9E',
  herb: '#5E9B3B', herbDark: '#3D6E25', chili: '#DA3B2B', pepper: '#F2A531', onion: '#EBD7E8',
  bun: '#D99A4E', bunDark: '#A9682B', sesame: '#FBEFD5', lettuce: '#86BC4A',
  bowl: '#1F1B18', bowlRim: '#3A332D', rice: '#FBF6EA', paper: '#F1E4C8', paperShade: '#D6C29A',
  corn: '#F5C43D', cornDark: '#D79A1E', husk: '#9CB65A', board: '#8A5A33', boardDark: '#5E3A1E',
}

// Seeded scatter so crumbs and specks look hand made but never change between renders.
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
function Specks({ seed, n, box, r = [2, 4], fill }) {
  const rand = rng(seed)
  const [x, y, w, h] = box
  return Array.from({ length: n }, (_, i) => <ellipse key={i} cx={x + rand() * w} cy={y + rand() * h} rx={r[0] + rand() * (r[1] - r[0])} ry={r[0] * 0.7 + rand() * (r[1] - r[0]) * 0.6} transform="" fill={fill} opacity={0.55 + rand() * 0.4} />)
}

// A lumpy crumb outline around an ellipse, for anything fried.
function crumbPath(cx, cy, rx, ry, seed, lumps = 18) {
  const rand = rng(seed)
  let d = ''
  for (let i = 0; i <= lumps; i++) {
    const a = (i / lumps) * Math.PI * 2
    const k = 1 + (rand() - 0.5) * 0.12
    const x = cx + Math.cos(a) * rx * k
    const y = cy + Math.sin(a) * ry * k
    d += i === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : ` Q${(cx + Math.cos(a - Math.PI / lumps) * rx * 1.08).toFixed(1)} ${(cy + Math.sin(a - Math.PI / lumps) * ry * 1.08).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d + 'Z'
}

function Drumstick({ seed = 3, x = 0, y = 0, s = 1, r = -35 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r} 100 100) translate(100 100) scale(${s}) translate(-100 -100)`}>
      <rect x="128" y="88" width="46" height="18" rx="9" fill={C.bone} />
      <circle cx="176" cy="88" r="12" fill={C.bone} /><circle cx="178" cy="108" r="12" fill={C.bone} />
      <circle cx="181" cy="110" r="6" fill={C.boneShade} />
      <path d={crumbPath(88, 100, 62, 46, seed)} fill={C.crumbDark} transform="translate(0 6)" />
      <path d={crumbPath(88, 100, 62, 46, seed)} fill={C.crumb} />
      <ellipse cx="74" cy="82" rx="34" ry="14" fill={C.crumbLight} opacity="0.7" />
      <Specks seed={seed * 7} n={26} box={[34, 66, 108, 66]} fill={C.crumbDark} r={[1.6, 3.4]} />
      <Specks seed={seed * 11} n={12} box={[40, 70, 80, 30]} fill="#FFE4A0" r={[1.4, 2.6]} />
    </g>
  )
}
function Wing({ seed = 5, x = 0, y = 0, s = 1, r = 10 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r} 100 100) translate(100 100) scale(${s}) translate(-100 -100)`}>
      <path d={crumbPath(78, 104, 44, 34, seed)} fill={C.crumbDark} transform="translate(0 5)" />
      <path d={crumbPath(78, 104, 44, 34, seed)} fill={C.crumb} />
      <path d={crumbPath(128, 92, 36, 28, seed + 1)} fill={C.crumbDark} transform="translate(0 5)" />
      <path d={crumbPath(128, 92, 36, 28, seed + 1)} fill={C.glaze} opacity="0.9" />
      <path d={crumbPath(78, 104, 44, 34, seed)} fill={C.glaze} opacity="0.5" />
      <ellipse cx="70" cy="92" rx="20" ry="8" fill="#F7B26A" opacity="0.55" />
      <Specks seed={seed * 3} n={18} box={[42, 76, 116, 52]} fill="#8E1E14" r={[1.4, 3]} />
      <Specks seed={seed * 9} n={10} box={[50, 80, 100, 30]} fill={C.sesame} r={[1.2, 2]} />
    </g>
  )
}
function Tenders({ seed = 9 }) {
  return (
    <g>
      {[[62, 120, -18], [100, 104, -8], [138, 96, 4]].map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <path d={crumbPath(x, y, 24, 58, seed + i, 16)} fill={C.crumbDark} transform="translate(0 5)" />
          <path d={crumbPath(x, y, 24, 58, seed + i, 16)} fill={C.crumb} />
          <ellipse cx={x - 6} cy={y - 26} rx="8" ry="20" fill={C.crumbLight} opacity="0.65" />
          <Specks seed={(seed + i) * 5} n={12} box={[x - 20, y - 50, 40, 100]} fill={C.crumbDark} r={[1.4, 3]} />
        </g>
      ))}
    </g>
  )
}
function Burger({ seed = 4 }) {
  return (
    <g>
      <ellipse cx="100" cy="150" rx="66" ry="14" fill={C.bunDark} />
      <rect x="34" y="128" width="132" height="24" rx="12" fill={C.bun} />
      <path d={crumbPath(100, 112, 76, 22, seed, 22)} fill={C.crumbDark} transform="translate(0 5)" />
      <path d={crumbPath(100, 112, 76, 22, seed, 22)} fill={C.crumb} />
      <Specks seed={seed * 3} n={20} box={[36, 98, 128, 26]} fill={C.crumbDark} r={[1.4, 3]} />
      <path d="M30 96 q10 -10 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 v10 h-140z" fill={C.lettuce} />
      <path d="M38 92 q4 -58 62 -58 q58 0 62 58 z" fill={C.bunDark} transform="translate(0 4)" />
      <path d="M38 92 q4 -58 62 -58 q58 0 62 58 z" fill={C.bun} />
      <path d="M58 60 q20 -18 46 -18" stroke="#F0BE7A" strokeWidth="8" strokeLinecap="round" fill="none" />
      <Specks seed={seed * 13} n={14} box={[56, 44, 92, 36]} fill={C.sesame} r={[2.2, 3.2]} />
      <path d="M48 98 q26 8 52 0 q26 -8 52 0" stroke={C.mayo} strokeWidth="6" strokeLinecap="round" fill="none" />
    </g>
  )
}
// Grill marks clipped to a shape.
function Marks({ id, d, n = 5, gap = 22, angle = -28 }) {
  return (
    <>
      <clipPath id={id}><path d={d} /></clipPath>
      <g clipPath={`url(#${id})`} transform={`rotate(${angle} 100 100)`}>
        {Array.from({ length: n + 4 }, (_, i) => <rect key={i} x={-20 + i * gap} y="-20" width="7" height="240" rx="3.5" fill={C.char} opacity="0.85" />)}
      </g>
    </>
  )
}
function HalfChicken({ id = 'hc' }) {
  const body = 'M40 118 C34 76 70 46 110 50 C150 54 172 84 166 116 C160 148 128 162 98 160 C66 158 44 146 40 118Z'
  return (
    <g>
      <path d={body} fill={C.grillDark} transform="translate(0 7)" />
      <path d={body} fill={C.grill} />
      <path d="M150 128 C172 132 184 146 180 158 C176 168 162 168 156 160 C150 150 146 140 150 128Z" fill={C.grill} />
      <circle cx="178" cy="164" r="8" fill={C.bone} />
      <ellipse cx="96" cy="78" rx="38" ry="14" fill={C.grillLight} opacity="0.75" />
      <Marks id={id} d={body} />
      <Specks seed={21} n={16} box={[52, 64, 100, 80]} fill={C.herb} r={[1.6, 3.2]} />
      <Specks seed={27} n={10} box={[56, 70, 90, 70]} fill={C.chili} r={[1.2, 2.4]} />
    </g>
  )
}
function WholeChicken() {
  const body = 'M36 124 C30 82 64 56 100 56 C136 56 170 82 164 124 C158 156 130 168 100 168 C70 168 42 156 36 124Z'
  return (
    <g>
      <path d="M60 70 C44 46 54 28 66 30 C78 32 80 50 74 64Z" fill={C.grill} /><circle cx="64" cy="28" r="8" fill={C.bone} />
      <path d="M140 70 C156 46 146 28 134 30 C122 32 120 50 126 64Z" fill={C.grill} /><circle cx="136" cy="28" r="8" fill={C.bone} />
      <path d={body} fill={C.grillDark} transform="translate(0 7)" />
      <path d={body} fill={C.grill} />
      <ellipse cx="88" cy="86" rx="36" ry="14" fill={C.grillLight} opacity="0.75" />
      <Marks id="wc" d={body} n={6} gap={20} angle={-20} />
      <Specks seed={33} n={18} box={[50, 76, 100, 80]} fill={C.herb} r={[1.6, 3.2]} />
      <path d="M30 172 q70 16 140 0" stroke={C.herbDark} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6" />
    </g>
  )
}
function Skewer({ kind = 'chicken' }) {
  const pieces = kind === 'beef'
    ? [C.grillDark, '#8E4220', C.grillDark, '#8E4220']
    : [C.grill, C.pepper, C.grill, C.chili, C.grill]
  return (
    <g transform="rotate(-32 100 100)">
      <rect x="6" y="97" width="188" height="6" rx="3" fill="#C9A06A" />
      {pieces.map((c, i) => {
        const x = 34 + i * (kind === 'beef' ? 38 : 30)
        return (
          <g key={i}>
            <rect x={x - 15} y="76" width="30" height="50" rx="10" fill={c === C.pepper || c === C.chili ? c : C.grillDark} transform="translate(0 4)" />
            <rect x={x - 15} y="76" width="30" height="50" rx="10" fill={c} />
            {c !== C.pepper && c !== C.chili && <><rect x={x - 12} y="86" width="24" height="5" rx="2.5" fill={C.char} opacity="0.8" /><rect x={x - 12} y="104" width="24" height="5" rx="2.5" fill={C.char} opacity="0.8" /></>}
            {kind === 'beef' && <Specks seed={i * 17 + 3} n={8} box={[x - 13, 78, 26, 44]} fill="#E2502F" r={[1.2, 2.2]} />}
          </g>
        )
      })}
    </g>
  )
}
function Wrap() {
  return (
    <g transform="rotate(-24 100 100)">
      <rect x="22" y="70" width="156" height="66" rx="33" fill={C.paperShade} transform="translate(0 6)" />
      <rect x="22" y="70" width="156" height="66" rx="33" fill="#EBD3A0" />
      <ellipse cx="168" cy="103" rx="22" ry="33" fill={C.grill} />
      <ellipse cx="168" cy="103" rx="14" ry="24" fill={C.lettuce} />
      <circle cx="166" cy="96" r="6" fill={C.chili} /><circle cx="172" cy="112" r="5" fill={C.mayo} />
      <Marks id="wr" d="M22 103 a33 33 0 0 1 33 -33 h90 v66 h-90 a33 33 0 0 1 -33 -33z" n={6} gap={26} angle={60} />
      <rect x="60" y="68" width="38" height="70" fill={C.paper} opacity="0.95" />
    </g>
  )
}
function Bowl({ topping = 'chicken', rice = false }) {
  return (
    <g>
      <path d={rice ? 'M44 96 C50 54 150 54 156 96Z' : 'M40 98 C40 62 160 62 160 98Z'} fill={rice ? C.rice : C.mayo} />
      {!rice && <Specks seed={41} n={14} box={[56, 70, 90, 24]} fill={C.mayoShade} r={[3, 6]} />}
      {topping === 'chicken' && [[72, 74], [98, 66], [124, 76], [88, 84], [114, 86]].map(([x, y], i) => <rect key={i} x={x - 11} y={y - 8} width="22" height="16" rx="5" fill={i % 2 ? C.grill : C.crumb} transform={`rotate(${i * 23 - 30} ${x} ${y})`} />)}
      <path d="M58 80 q14 -10 28 0 t28 0 t28 0" stroke={C.mayo} strokeWidth="5" strokeLinecap="round" fill="none" />
      <Specks seed={43} n={14} box={[56, 62, 90, 28]} fill={C.herb} r={[1.6, 3]} />
      <Specks seed={47} n={6} box={[60, 64, 80, 22]} fill={C.chili} r={[1.4, 2.4]} />
      <path d="M30 96 h140 c-4 40 -34 62 -70 62 c-36 0 -66 -22 -70 -62z" fill={C.bowl} />
      <rect x="26" y="92" width="148" height="10" rx="5" fill={C.bowlRim} />
      <path d="M70 128 q30 12 60 0" stroke="#D9622B" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9" />
    </g>
  )
}
function Roll() {
  return (
    <g transform="rotate(18 100 100)">
      <path d="M70 40 h60 l-12 128 h-36z" fill="#EBD3A0" />
      <ellipse cx="100" cy="42" rx="32" ry="16" fill={C.grill} />
      <ellipse cx="94" cy="38" rx="14" ry="6" fill={C.lettuce} /><circle cx="110" cy="40" r="6" fill={C.chili} />
      <path d="M78 46 q22 10 44 0" stroke={C.mayo} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M66 96 h68 l-10 76 h-48z" fill={C.paper} />
      <path d="M66 96 h68 l-2 14 h-64z" fill={C.paperShade} />
      <rect x="84" y="128" width="32" height="18" rx="4" fill={C.chili} />
    </g>
  )
}
function Slaw() {
  return (
    <g>
      <path d="M52 86 C54 52 146 52 148 86Z" fill="#F4F0DC" />
      <Specks seed={51} n={26} box={[60, 58, 80, 26]} fill="#C8D98A" r={[2, 5]} />
      <Specks seed={53} n={14} box={[60, 60, 80, 22]} fill="#F09A3E" r={[1.4, 3]} />
      <Specks seed={57} n={10} box={[60, 60, 80, 22]} fill="#B9579E" r={[1.4, 3]} />
      <path d="M48 84 h104 l-12 82 h-80z" fill={C.chili} />
      <path d="M48 84 h104 l-2 12 h-100z" fill="#B42A1E" />
      <rect x="64" y="116" width="72" height="22" rx="6" fill={C.sesame} />
    </g>
  )
}
function Fries() {
  return (
    <g>
      {[[64, -14], [80, -6], [96, 2], [112, -4], [128, 8], [72, 10], [104, 12], [120, -12]].map(([x, r], i) => <rect key={i} x={x} y="34" width="12" height="96" rx="4" fill={i % 3 ? C.crumbLight : C.crumb} transform={`rotate(${r} ${x + 6} 120)`} />)}
      <path d="M56 70 q14 10 22 -2 t24 4 t24 -6 t22 6" stroke={C.mayo} strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M50 92 h100 l-12 76 h-76z" fill={C.chili} />
      <path d="M50 92 q50 22 100 0" fill="#B42A1E" />
      <circle cx="100" cy="134" r="14" fill={C.sesame} /><path d="M94 134 l12 0 M100 128 l0 12" stroke={C.chili} strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}
function Chops() {
  return (
    <g>
      {[[0, -10], [26, 14]].map(([dx, r], i) => (
        <g key={i} transform={`translate(${dx} ${i * 10}) rotate(${r} 100 100)`}>
          <rect x="112" y="94" width="58" height="12" rx="6" fill={C.bone} />
          <path d={crumbPath(80, 100, 44, 36, 61 + i, 14)} fill={C.grillDark} transform="translate(0 6)" />
          <path d={crumbPath(80, 100, 44, 36, 61 + i, 14)} fill="#A9472B" />
          <ellipse cx="72" cy="90" rx="22" ry="9" fill="#C9694A" />
          <rect x="44" y="84" width="72" height="5" rx="2.5" fill={C.char} transform="rotate(-24 80 100)" />
          <rect x="44" y="104" width="72" height="5" rx="2.5" fill={C.char} transform="rotate(-24 80 100)" />
        </g>
      ))}
      <Specks seed={67} n={10} box={[50, 70, 80, 70]} fill={C.herb} r={[1.6, 3]} />
    </g>
  )
}
function Corn() {
  return (
    <g transform="rotate(-30 100 100)">
      <path d="M20 100 q30 -46 54 -30 l-6 30 l6 30 q-24 16 -54 -30z" fill={C.husk} />
      <rect x="54" y="74" width="126" height="52" rx="26" fill={C.cornDark} transform="translate(0 5)" />
      <rect x="54" y="74" width="126" height="52" rx="26" fill={C.corn} />
      {Array.from({ length: 9 }, (_, i) => Array.from({ length: 3 }, (_, j) => <rect key={`${i}${j}`} x={66 + i * 12} y={80 + j * 14} width="9" height="11" rx="4" fill="#FFDA6B" />))}
      <rect x="84" y="74" width="8" height="52" fill={C.char} opacity="0.55" /><rect x="128" y="74" width="8" height="52" fill={C.char} opacity="0.55" />
    </g>
  )
}
function Platter() {
  return (
    <g>
      <ellipse cx="100" cy="122" rx="92" ry="54" fill={C.boardDark} transform="translate(0 6)" />
      <ellipse cx="100" cy="122" rx="92" ry="54" fill={C.board} />
      <g transform="translate(-36 4) scale(0.62)" transform-origin="100 100"><HalfChicken id="pl" /></g>
      <g transform="translate(40 18) scale(0.55)" transform-origin="100 100"><Skewer /></g>
      <g transform="translate(34 -18) scale(0.5)" transform-origin="100 100"><Corn /></g>
      <g transform="translate(-30 30) scale(0.45)" transform-origin="100 100"><Drumstick seed={8} r={-10} /></g>
    </g>
  )
}

export const ART = {
  drumstick: () => <><Drumstick x={-6} y={8} /><Drumstick seed={7} x={18} y={-22} r={-60} s={0.86} /></>,
  bucket: () => <><Drumstick x={-24} y={14} s={0.8} /><Drumstick seed={7} x={22} y={-14} r={-70} s={0.8} /><Wing x={-10} y={-38} s={0.62} r={-6} seed={12} /></>,
  wings: () => <><Wing x={-20} y={14} s={0.86} /><Wing x={26} y={-14} seed={14} r={-26} s={0.8} /></>,
  tenders: () => <Tenders />,
  burger: () => <Burger />,
  quarter: () => <g transform="scale(0.92) translate(8 8)"><HalfChicken id="qc" /></g>,
  half: () => <HalfChicken />,
  whole: () => <WholeChicken />,
  wrap: () => <Wrap />,
  skewer: () => <><Skewer /><g transform="translate(10 26)"><Skewer /></g></>,
  salad: () => <Bowl />,
  ricebowl: () => <Bowl rice />,
  roll: () => <Roll />,
  slaw: () => <Slaw />,
  fries: () => <Fries />,
  platter: () => <Platter />,
  suya: () => <><Skewer kind="beef" /><g transform="translate(12 28)"><Skewer kind="beef" /></g></>,
  chops: () => <Chops />,
  corn: () => <Corn />,
}

// The art on its own: an SVG with a soft floor shadow. `label` is the dish name, for screen readers.
export default function Food({ art, label, className = '', heat = 0 }) {
  const Draw = ART[art] || ART.drumstick
  return (
    <svg viewBox="0 0 200 200" className={`food ${className}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <ellipse cx="100" cy="176" rx="70" ry="10" fill="#000" opacity="0.28" />
      <Draw />
      {heat > 0 && <g className="steam" aria-hidden="true">{Array.from({ length: heat }, (_, i) => <path key={i} d={`M${70 + i * 22} 40 q-8 -12 0 -24 q8 -12 0 -24`} stroke="#fff" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" fill="none" style={{ animationDelay: `${i * 0.35}s` }} />)}</g>}
    </svg>
  )
}
