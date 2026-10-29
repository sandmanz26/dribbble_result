import { useRef } from 'react'
import { W, H, project, unproject, scaleAt, groundCircle, groundRect, poly } from '../lib/geo.js'

// What the AI found in each photo, drawn when the coach asks "What did it see?".
export const SEEN = {
  putting: [{ type: 'dot', x: 488, y: 580, r: 22, label: 'Hole' }, { type: 'arrow', from: [1000, 430], to: [780, 470], label: 'Falls this way, estimate', anchor: 'end' }, { type: 'edge', pts: [[0, 178], [400, 172], [800, 178], [1200, 196]], label: 'Fringe' }],
  chipping: [{ type: 'dot', x: 190, y: 415, r: 20, label: 'Near hole' }, { type: 'dot', x: 735, y: 172, r: 14, label: 'Far hole' }, { type: 'box', x: 470, y: 120, w: 620, h: 130, label: 'Practice balls, left out' }],
  range: [{ type: 'quad', pts: [[490, 722], [780, 722], [995, 900], [215, 900]], label: 'Mat, 1.5 m' }, { type: 'arrow', from: [650, 640], to: [650, 215], label: 'Target line' }],
  pitching: [{ type: 'dot', x: 515, y: 640, r: 20, label: 'Tee marker' }, { type: 'box', x: 860, y: 485, w: 310, h: 250, label: 'Golf bag, kept clear' }],
}

export default function Overlay({ area, photo, cam, markers = [], seen, overrides = {}, onMove, numbers = true, interactive = false }) {
  const svg = useRef(null)
  const drag = useRef(null)
  const pos = (m, i) => overrides[i] || m.at
  const toSvg = (e) => {
    const pt = svg.current.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY
    return pt.matrixTransform(svg.current.getScreenCTM().inverse())
  }
  const down = (i) => (e) => { if (!interactive) return; e.preventDefault(); drag.current = i; e.currentTarget.setPointerCapture?.(e.pointerId) }
  const move = (e) => { if (drag.current == null) return; const p = toSvg(e); const g = unproject(cam, p.x, Math.max(cam.yh + 30, Math.min(H - 4, p.y))); onMove?.(drag.current, g) }
  const up = () => { drag.current = null }
  const seenShapes = seen ? SEEN[area] || [] : []
  const badges = []
  const seenN = new Set()

  const drawn = markers.map((m, i) => {
    const key = `${m.kind}-${i}`
    if (m.kind === 'line') {
      const a = project(cam, (overrides[0] || m.from).X, (overrides[0] || m.from).Z); const bZ = Math.max(m.to.Z, 1.2); const b = project(cam, m.to.X, bZ)
      return <line key={key} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="mk-line" />
    }
    if (m.kind === 'ring') {
      if (m.n && !seenN.has(m.n)) { seenN.add(m.n); const c = project(cam, m.c.X, m.c.Z); badges.push({ n: m.n, x: c.x, y: c.y }) }
      return <polygon key={key} points={poly(groundCircle(cam, m.c, m.r))} className={m.avoid ? 'mk-avoid' : m.solid ? 'mk-hoop' : 'mk-circle'} />
    }
    if (m.kind === 'zone') return <polygon key={key} points={poly(m.pts.map((p) => project(cam, p.X, p.Z)))} className="mk-zone" />
    if (m.kind === 'towel') return <polygon key={key} points={poly(groundRect(cam, m.c, m.w, m.d, m.along))} className="mk-towel" />
    if (m.kind === 'stick') {
      const a = project(cam, m.from.X, m.from.Z); const b = project(cam, m.to.X, m.to.Z); const w = Math.max(7, scaleAt(cam, (m.from.Z + m.to.Z) / 2) * 0.016)
      if (m.n && !seenN.has(m.n)) { seenN.add(m.n); badges.push({ n: m.n, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }) }
      return <g key={key}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="mk-stick-o" strokeWidth={w + 4} /><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="mk-stick" strokeWidth={w} /></g>
    }
    const at = pos(m, i); const p = project(cam, at.X, at.Z); const s = scaleAt(cam, at.Z)
    if (m.n && !seenN.has(m.n)) { seenN.add(m.n); badges.push({ n: m.n, x: p.x, y: p.y }) }
    const handlers = interactive ? { onPointerDown: down(i), style: { cursor: 'grab', touchAction: 'none' } } : {}
    if (m.kind === 'ball') { const r = Math.max(10, s * 0.0214); return <g key={key} {...handlers}><ellipse cx={p.x} cy={p.y + r * 0.6} rx={r * 1.2} ry={r * 0.4} className="mk-shadow" /><circle cx={p.x} cy={p.y} r={r} className="mk-ball" />{interactive && <circle cx={p.x} cy={p.y} r={22} className="mk-hit" />}</g> }
    if (m.kind === 'tee') { const r = Math.max(11, s * 0.022); const hgt = Math.max(18, s * 0.05); return <g key={key} {...handlers}><line x1={p.x} y1={p.y} x2={p.x} y2={p.y - hgt} className="mk-peg-o" /><line x1={p.x} y1={p.y} x2={p.x} y2={p.y - hgt} className="mk-peg" /><circle cx={p.x} cy={p.y - hgt} r={r} className="mk-tee" />{interactive && <circle cx={p.x} cy={p.y - hgt / 2} r={22} className="mk-hit" />}</g> }
    if (m.kind === 'cone') { const b = Math.max(22, s * 0.22); const hgt = Math.max(24, s * 0.23); return <g key={key} {...handlers}><polygon points={`${p.x - b / 2},${p.y} ${p.x + b / 2},${p.y} ${p.x},${p.y - hgt}`} className="mk-cone" />{interactive && <circle cx={p.x} cy={p.y - hgt / 2} r={22} className="mk-hit" />}</g> }
    if (m.kind === 'upright') { const hgt = s * 1.0; const w = Math.max(7, s * 0.016); return <g key={key} {...handlers}><line x1={p.x} y1={p.y} x2={p.x} y2={p.y - hgt} className="mk-stick-o" strokeWidth={w + 4} /><line x1={p.x} y1={p.y} x2={p.x} y2={p.y - hgt} className="mk-stick" strokeWidth={w} />{interactive && <circle cx={p.x} cy={p.y - hgt / 2} r={24} className="mk-hit" />}</g> }
    return null
  })

  return (
    <div className="ov">
      {photo ? <img src={photo.startsWith('data:') || photo.startsWith('blob:') ? photo : `img/${photo}.webp`} alt="" draggable="false" /> : <div className="ov-empty" />}
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" onPointerMove={move} onPointerUp={up} onPointerCancel={up} role="img" aria-label={markers.length ? `${markers.filter((m) => m.n).length} markers placed on the photo` : 'Photo'}>
        {seenShapes.map((sh, i) => <Seen key={i} sh={sh} />)}
        {drawn}
        {numbers && placeBadges(badges).map((b) => (
          <g key={`b${b.n}-${b.x}`} className="mk-badge">
            <line x1={b.x} y1={b.y} x2={b.bx} y2={b.by} className="mk-leader" />
            <g transform={`translate(${b.bx} ${b.by})`}><circle r="34" /><text dy="13">{b.n}</text></g>
          </g>
        ))}
      </svg>
    </div>
  )
}

// Numbered badges sit beside their marker and never on top of each other.
function placeBadges(list) {
  const tries = [[46, -58], [-46, -58], [56, 30], [-56, 30], [104, -20], [-104, -20], [0, -112], [110, -100], [-110, -100]]
  const placed = []
  for (const b of list) {
    let pos = null
    for (const [dx, dy] of tries) {
      const x = Math.min(W - 40, Math.max(40, b.x + dx)); const y = Math.min(H - 40, Math.max(40, b.y + dy))
      if (placed.every((p) => Math.hypot(p.bx - x, p.by - y) > 74)) { pos = { bx: x, by: y }; break }
    }
    placed.push({ ...b, ...(pos || { bx: b.x + 46, by: b.y - 58 }) })
  }
  return placed
}

function Seen({ sh }) {
  if (sh.type === 'dot') return <g className="seen"><circle cx={sh.x} cy={sh.y} r={sh.r} /><text x={sh.x + sh.r + 10} y={sh.y + 8}>{sh.label}</text></g>
  if (sh.type === 'box') return <g className="seen"><rect x={sh.x} y={sh.y} width={sh.w} height={sh.h} rx="10" /><text x={sh.x + 12} y={sh.y - 12}>{sh.label}</text></g>
  if (sh.type === 'quad') return <g className="seen"><polygon points={sh.pts.map((p) => p.join(',')).join(' ')} /><text x={sh.pts[0][0]} y={sh.pts[0][1] - 14}>{sh.label}</text></g>
  if (sh.type === 'edge') return <g className="seen"><polyline points={sh.pts.map((p) => p.join(',')).join(' ')} fill="none" /><text x={sh.pts[1][0]} y={sh.pts[1][1] - 14}>{sh.label}</text></g>
  if (sh.type === 'arrow') {
    const [x1, y1] = sh.from; const [x2, y2] = sh.to; const a = Math.atan2(y2 - y1, x2 - x1)
    return <g className="seen"><line x1={x1} y1={y1} x2={x2} y2={y2} /><polygon points={`${x2},${y2} ${x2 - 26 * Math.cos(a - 0.4)},${y2 - 26 * Math.sin(a - 0.4)} ${x2 - 26 * Math.cos(a + 0.4)},${y2 - 26 * Math.sin(a + 0.4)}`} className="seen-head" /><text x={sh.anchor === 'end' ? Math.max(x1, x2) : (x1 + x2) / 2 + 14} y={Math.min(y1, y2) - 18} textAnchor={sh.anchor || 'start'}>{sh.label}</text></g>
  }
  return null
}
