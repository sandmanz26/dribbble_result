// Tend's one picture: a cyanotype. A sun print is exposed by the day's light, so the weather
// someone gives in the check-in sets how deep the blue goes, and the herb in today's cup is
// printed on it as a white silhouette. Each plant is drawn from its real habit (opposite toothed
// leaves for the mints, daisy heads and feathery leaves for chamomile, a jointed rhizome for
// ginger, needle leaves for rooibos), seeded so the same day always prints the same sheet.

function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const f = (n) => n.toFixed(1)
const rad = (d) => (d * Math.PI) / 180

// A leaf from its base along an angle: width swells and narrows, teeth alternate on the margin.
function leaf(x, y, deg, len, wid, teeth = 0, tip = 0.9) {
  const a = rad(deg)
  const N = 22
  const L = []
  const R = []
  for (let i = 0; i <= N; i++) {
    const t = i / N
    let h = wid * Math.pow(Math.sin(Math.PI * Math.pow(t, tip)), 0.85) * (1 - 0.2 * t)
    if (teeth && i > 2 && i < N - 1) h *= i % 2 ? 1 + teeth : 1 - teeth * 0.3
    const along = t * len
    const p = (s) => [x + along * Math.cos(a) - s * h * Math.sin(a), y + along * Math.sin(a) + s * h * Math.cos(a)]
    L.push(p(1))
    R.unshift(p(-1))
  }
  return 'M' + [...L, ...R].map(([px, py]) => `${f(px)} ${f(py)}`).join('L') + 'Z'
}
const rib = (x, y, deg, len) => `M${f(x)} ${f(y)}L${f(x + len * 0.8 * Math.cos(rad(deg)))} ${f(y + len * 0.8 * Math.sin(rad(deg)))}`

const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`

// Mints: a square stem with leaves in opposite pairs on short stalks. Every other pair turns
// towards the viewer, so it reads shorter. Peppermint is narrower and ends in a flower spike.
function mint(r, spike) {
  const fill = []
  const cut = []
  const stems = ['M100 270C99 220 102 150 100 60']
  const nodes = [238, 202, 168, 136, 108, 84, 64]
  nodes.forEach((y, i) => {
    const facing = i % 2 === 1
    const len = (50 - i * 5.5 + r() * 3) * (facing ? 0.72 : 1)
    const wid = len * (spike ? 0.24 : 0.33)
    const lean = 12 + i * 7 + (facing ? 14 : 0)
    ;[-180 + lean, -lean].forEach((d) => {
      const a = rad(d)
      const px = 100 + 7 * Math.cos(a)
      const py = y + 7 * Math.sin(a)
      stems.push(`M100 ${y}L${f(px)} ${f(py)}`)
      fill.push(leaf(px, py, d, len, wid, 0.09))
      cut.push(rib(px, py, d, len))
    })
  })
  if (spike) {
    for (let k = 0; k < 8; k++) {
      const y = 56 - k * 6
      const n = k < 6 ? 3 : 2
      for (let j = 0; j < n; j++) fill.push(dot(100 + (j - (n - 1) / 2) * (6.2 - k * 0.4), y, 2.6 - k * 0.12))
    }
  } else {
    fill.push(leaf(100, 62, -96, 16, 4))
    fill.push(leaf(100, 62, -76, 13, 3.4))
  }
  return { stems, fill, cut }
}

function chamomile(r) {
  const fill = []
  const stems = []
  const heads = [[70, 62], [118, 40], [150, 92], [96, 104], [48, 118]]
  heads.forEach(([hx, hy]) => {
    stems.push(`M100 268C100 220 ${f(hx + (100 - hx) * 0.4)} ${f(hy + 80)} ${hx} ${hy + 10}`)
    const petals = 13
    for (let p = 0; p < petals; p++) {
      const a = (p / petals) * 360 + r() * 8
      fill.push(leaf(hx, hy, a, 14, 4.4, 0, 1.15))
    }
    fill.push(`M${hx - 6} ${hy}a6 6 0 1 0 12 0a6 6 0 1 0 -12 0Z`)
  })
  // Feathery leaves: a thread with short side ticks.
  const threads = []
  ;[[100, 232, -150, 46], [100, 214, -30, 42], [100, 190, -160, 34], [98, 176, -20, 30]].forEach(([x, y, d, len]) => {
    const a = rad(d)
    const ex = x + len * Math.cos(a)
    const ey = y + len * Math.sin(a)
    threads.push(`M${x} ${y}L${f(ex)} ${f(ey)}`)
    for (let s = 4; s < len; s += 4.5) {
      const px = x + s * Math.cos(a)
      const py = y + s * Math.sin(a)
      ;[-55, 55].forEach((o) => threads.push(`M${f(px)} ${f(py)}l${f(6 * Math.cos(a + rad(o)))} ${f(6 * Math.sin(a + rad(o)))}`))
    }
  })
  return { stems: [...stems, ...threads], fill, cut: heads.map(([hx, hy]) => `M${hx - 6} ${hy}a6 6 0 1 0 12 0a6 6 0 1 0 -12 0`) }
}

function ginger(r) {
  const fill = []
  const cut = []
  const lobes = [[58, 222, 30, 17, -8], [100, 214, 26, 16, 4], [140, 226, 28, 16, 10], [84, 240, 16, 10, 0], [122, 198, 12, 9, -20]]
  lobes.forEach(([x, y, rx, ry, d]) => {
    fill.push(`M${x - rx} ${y}a${rx} ${ry} ${d} 1 0 ${rx * 2} 0a${rx} ${ry} ${d} 1 0 ${-rx * 2} 0Z`)
    for (let k = -1; k <= 1; k++) cut.push(`M${f(x + k * rx * 0.5)} ${f(y - ry * 0.7)}q3 ${f(ry * 0.7)} 0 ${f(ry * 1.4)}`)
  })
  const shoots = [[96, 200, -96, 150], [104, 202, -82, 170], [124, 194, -70, 120], [60, 208, -112, 110], [140, 212, -60, 92]]
  shoots.forEach(([x, y, d, len]) => {
    fill.push(leaf(x, y, d, len, 7 + r() * 2, 0, 0.8))
    cut.push(rib(x, y, d, len))
  })
  return { stems: [], fill, cut }
}

function rooibos(r) {
  const stems = []
  const fill = []
  const twig = (x, y, d, len, depth) => {
    const a = rad(d)
    const ex = x + len * Math.cos(a)
    const ey = y + len * Math.sin(a)
    stems.push(`M${f(x)} ${f(y)}L${f(ex)} ${f(ey)}`)
    for (let s = 6; s < len; s += 5) {
      const px = x + s * Math.cos(a)
      const py = y + s * Math.sin(a)
      ;[-38, 38].forEach((o) => fill.push(leaf(px, py, d + o, 10 + r() * 3, 1.3, 0, 1)))
    }
    if (depth > 0) {
      twig(ex, ey, d - 24 - r() * 10, len * 0.72, depth - 1)
      twig(ex, ey, d + 22 + r() * 10, len * 0.68, depth - 1)
    }
  }
  twig(100, 268, -90, 70, 3)
  return { stems, fill, cut: [] }
}

const DRAW = { lemonbalm: (r) => mint(r, false), peppermint: (r) => mint(r, true), chamomile, ginger, rooibos }

export function Plant({ herb = 'chamomile', seed = 7, className = '' }) {
  const d = (DRAW[herb] || chamomile)(rng(seed))
  return (
    <svg className={`plant ${className}`} viewBox="0 0 200 270" aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      <g className="plant-stem">{d.stems.map((p, i) => <path key={i} d={p} />)}</g>
      <g className="plant-fill">{d.fill.map((p, i) => <path key={i} d={p} />)}</g>
      <g className="plant-cut">{d.cut.map((p, i) => <path key={i} d={p} />)}</g>
    </svg>
  )
}

// The brushed edge of the emulsion: a rectangle whose sides waver by a pixel or two.
function edge(seed) {
  const r = rng(seed * 31 + 3)
  const pts = []
  const j = () => (r() - 0.5) * 1.6
  for (let x = 0; x <= 100; x += 5) pts.push([x, 1 + j()])
  for (let y = 5; y <= 100; y += 5) pts.push([99 + j(), y])
  for (let x = 95; x >= 0; x -= 5) pts.push([x, 99 + j()])
  for (let y = 95; y > 0; y -= 5) pts.push([1 + j(), y])
  return 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z'
}

export function Print({ mood, herb, seed = 7, size = 'hero', label, children, className = '', ...rest }) {
  return (
    <div className={`print ex-${mood || 'none'} print-${size} ${className}`} role={label ? 'img' : undefined} aria-label={label} {...rest}>
      <svg className="print-ground" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d={edge(seed)} /></svg>
      {herb && <Plant herb={herb} seed={seed} />}
      {children && <div className="print-copy">{children}</div>}
    </div>
  )
}
