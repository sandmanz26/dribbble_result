import { useId } from 'react'

// Deterministic pseudo-random so scenes don't shift between renders.
const rng = (seed) => {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}
const hash = (str) => [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 2147483647, 7) || 1

const ridge = (r, base, amp, steps = 9, w = 800) => {
  const pts = [[0, 500]]
  for (let i = 0; i <= steps; i++) pts.push([(w / steps) * i, base - r() * amp])
  pts.push([w, 500])
  return pts.map((p) => p.join(',')).join(' ')
}

function Sun({ cx, cy, r, color }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 1.9} fill={color} opacity=".14" />
      <circle cx={cx} cy={cy} r={r * 1.4} fill={color} opacity=".22" />
      <circle cx={cx} cy={cy} r={r} fill={color} />
    </g>
  )
}

function Mountains({ p, r }) {
  return (
    <>
      <Sun cx={560} cy={150} r={46} color={p[1]} />
      <polygon points={ridge(r, 300, 150)} fill={p[2]} />
      <polygon points={ridge(r, 360, 130, 7)} fill={p[3]} />
      <polygon points={ridge(r, 430, 90, 6)} fill={p[4]} />
    </>
  )
}

function Coast({ p, r }) {
  return (
    <>
      <Sun cx={400} cy={250} r={54} color={p[1]} />
      <rect y="280" width="800" height="220" fill={p[3]} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={120 + r() * 200} y={300 + i * 30} width={180 + r() * 340} height="3" fill={p[0]} opacity=".5" />
      ))}
      <polygon points="0,500 0,330 120,310 260,360 330,500" fill={p[2]} />
      <polygon points="800,500 800,360 690,340 600,420 560,500" fill={p[4]} />
      <polygon points="470,380 470,320 520,380" fill={p[0]} />
      <polygon points="470,384 525,384 505,398 480,398" fill={p[4]} />
    </>
  )
}

function Desert({ p, r }) {
  const dune = (y, a) => `M0,500 L0,${y} C 200,${y - a} 330,${y + a * 0.6} 520,${y - a * 0.4} S 740,${y - a} 800,${y} L800,500 Z`
  return (
    <>
      <Sun cx={250} cy={210} r={62} color={p[1]} />
      <path d={dune(310, 60)} fill={p[2]} />
      <path d={dune(370, 70)} fill={p[3]} />
      <path d={dune(440, 50)} fill={p[4]} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} fill={p[4]}>
          <rect x={470 + i * 26} y={346 - (i % 2) * 4} width="5" height="14" />
          <circle cx={472.5 + i * 26} cy={342 - (i % 2) * 4} r="4" />
        </g>
      ))}
    </>
  )
}

function City({ p, r }) {
  const row = (base, color, minH, maxH, w0) => {
    const els = []
    let x = -10
    while (x < 810) {
      const w = w0 + r() * w0
      const h = minH + r() * (maxH - minH)
      els.push(<rect key={`${base}-${x}`} x={x} y={base - h} width={w} height={h + 500 - base} fill={color} />)
      x += w + 2
    }
    return els
  }
  const windows = []
  for (let i = 0; i < 46; i++)
    windows.push(<rect key={i} x={10 + r() * 780} y={360 + r() * 110} width="5" height="7" fill={p[1]} opacity=".85" />)
  return (
    <>
      <Sun cx={520} cy={220} r={58} color={p[1]} />
      {row(380, p[2], 60, 170, 40)}
      {row(430, p[3], 40, 130, 46)}
      {row(500, p[4], 20, 90, 60)}
      {windows}
    </>
  )
}

function Forest({ p, r }) {
  const trees = (base, color, size, count) =>
    Array.from({ length: count }, (_, i) => {
      const x = (800 / count) * i + r() * 40
      const s = size * (0.7 + r() * 0.7)
      return (
        <g key={`${base}-${i}`} fill={color}>
          <polygon points={`${x},${base - s * 1.6} ${x - s * 0.55},${base - s * 0.5} ${x + s * 0.55},${base - s * 0.5}`} />
          <polygon points={`${x},${base - s} ${x - s * 0.75},${base} ${x + s * 0.75},${base}`} />
          <rect x={x - 3} y={base} width="6" height="500" />
        </g>
      )
    })
  return (
    <>
      <Sun cx={620} cy={140} r={40} color={p[1]} />
      <polygon points={ridge(r, 310, 80, 8)} fill={p[2]} />
      {trees(360, p[3], 50, 12)}
      {trees(440, p[4], 78, 9)}
    </>
  )
}

function Lake({ p, r }) {
  return (
    <>
      <Sun cx={400} cy={170} r={50} color={p[1]} />
      <polygon points={ridge(r, 270, 100, 8)} fill={p[2]} />
      <polygon points={ridge(r, 320, 80, 7)} fill={p[3]} />
      <rect y="330" width="800" height="170" fill={p[4]} />
      <rect x="370" y="334" width="60" height="4" fill={p[1]} opacity=".7" />
      <rect x="350" y="352" width="100" height="4" fill={p[1]} opacity=".5" />
      <rect x="320" y="372" width="160" height="4" fill={p[1]} opacity=".35" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={60 + r() * 640} y={400 + i * 22} width={80 + r() * 120} height="3" fill={p[0]} opacity=".25" />
      ))}
    </>
  )
}

const SCENES = { mountains: Mountains, coast: Coast, desert: Desert, city: City, forest: Forest, lake: Lake }

export default function Scene({ type = 'mountains', palette, seed = 'x', className = '', label }) {
  const uid = useId().replace(/:/g, '')
  const r = rng(hash(seed + type))
  const Layer = SCENES[type] || Mountains
  return (
    <svg
      className={`scene ${className}`}
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <filter id={`grain-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
        </filter>
      </defs>
      <rect width="800" height="500" fill={palette[0]} />
      <Layer p={palette} r={r} />
      <rect width="800" height="500" filter={`url(#grain-${uid})`} opacity=".35" style={{ mixBlendMode: 'multiply' }} />
    </svg>
  )
}
