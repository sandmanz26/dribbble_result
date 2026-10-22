import { useEffect, useRef, useState } from 'react'
import { bezier, FPS, MOTION, spring } from '../data/motion.js'
import { Defs } from '../panel/Defs.jsx'
import { M } from '../panel/materials.js'
import { KnobArt, KnobTicks, SelectorArt, SelectorScale } from '../panel/parts.jsx'
import { VU_BALLISTICS } from '../panel/Plugin.jsx'

// Small plot of an easing curve or spring response, from the same numbers as the table.
function Curve({ m }) {
  let pts = null
  const e = m.easing
  if (/^[\d.]+, [-\d.]+, [\d.]+, [-\d.]+$/.test(e)) {
    const f = bezier(...e.split(',').map(Number))
    pts = Array.from({ length: 41 }, (_, i) => [i / 40, f(i / 40)])
  } else if (m.id === 'vu') {
    const s = spring(VU_BALLISTICS.zeta, VU_BALLISTICS.omega, 0.6)
    pts = s.map((y, i) => [i / (s.length - 1), y])
  } else if (m.id === 'cable') {
    const s = spring(0.5, 22, 0.6)
    pts = s.map((y, i) => [i / (s.length - 1), y])
  } else if (m.id === 'crt' || m.id === 'led-on') {
    pts = Array.from({ length: 41 }, (_, i) => [i / 40, 1 - Math.pow(0.78, i / 4)])
  } else if (e === 'linear') {
    pts = [[0, 0], [1, 1]]
  }
  if (!pts) return <span className="muted small">n/a</span>
  const W = 96
  const H = 52
  const y = (v) => H - 6 - v * (H - 16)
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="curve" aria-hidden>
      <line x1={4} y1={y(0)} x2={W - 4} y2={y(0)} stroke="currentColor" strokeOpacity={0.25} />
      <line x1={4} y1={y(1)} x2={W - 4} y2={y(1)} stroke="currentColor" strokeOpacity={0.25} strokeDasharray="2 2" />
      <polyline points={pts.map(([px, py]) => `${4 + px * (W - 8)},${y(py)}`).join(' ')} fill="none" stroke={M.accent} strokeWidth={2} />
    </svg>
  )
}

// Live demo: a knob reset and a selector detent, animated with the spec values.
function Demo() {
  const [knob, setKnob] = useState(0.15)
  const [sel, setSel] = useState(0)
  const [selAngle, setSelAngle] = useState(0)
  const raf = useRef(0)
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

  const tween = (from, to, frames, curve, set) => {
    cancelAnimationFrame(raf.current)
    if (reduce) return set(to)
    const f = bezier(...curve)
    const start = performance.now()
    const dur = (frames / FPS) * 1000
    const loop = (now) => {
      const t = Math.min(1, (now - start) / dur)
      set(from + (to - from) * f(t))
      if (t < 1) raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <div className="demo">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden><Defs p="mo" /></svg>
      <figure>
        <svg viewBox="-75 -75 150 150" width="150" role="img" aria-label="Knob reset demo">
          <rect x={-75} y={-75} width={150} height={150} fill={M.enamel} />
          <KnobTicks r={46} p="mo" />
          <KnobArt id="demo" r={46} value={knob} p="mo" scale={false} />
        </svg>
        <figcaption>
          <button type="button" className="btn" onClick={() => tween(knob, knob > 0.5 ? 0.15 : 0.92, 12, [0.33, 1, 0.68, 1], setKnob)}>Double-click reset</button>
          <span className="muted small">12 frames, ease-out cubic</span>
        </figcaption>
      </figure>
      <figure>
        <svg viewBox="-60 -60 120 120" width="150" role="img" aria-label="Selector detent demo">
          <rect x={-60} y={-60} width={120} height={120} fill={M.enamel} />
          <SelectorScale index={sel} p="mo" options={['Cut', 'Bits', 'Gate', 'Time']} />
          <g transform={`rotate(${selAngle})`}>
            <SelectorArt id="demo-sel" index={0} p="mo" options={['', '', '', '']} labels={false} />
          </g>
        </svg>
        <figcaption>
          <button
            type="button"
            className="btn"
            onClick={() => {
              const next = (sel + 1) % 4
              const angles = [0, 65, 135, 200]
              setSel(next)
              tween(selAngle, angles[next], 6, [0.34, 1.56, 0.64, 1], setSelAngle)
            }}
          >
            Next detent
          </button>
          <span className="muted small">6 frames, about 4 degrees overshoot</span>
        </figcaption>
      </figure>
    </div>
  )
}

export default function Motion() {
  const groups = [...new Set(MOTION.map((m) => m.group))]
  return (
    <section className="page wrap">
      <div className="page-head">
        <h1 className="h-lg">Motion spec</h1>
        <p className="lede">Frame counts at 60 fps, easing as cubic-bezier control points, and the physics for the meter. The hatch, screws, LEDs, meter and scope in the live panel already run these numbers.</p>
      </div>
      <Demo />
      {groups.map((g) => (
        <div key={g} className="rule stack">
          <h2 className="h-md">{g}</h2>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr><th scope="col">Motion</th><th scope="col">Frames</th><th scope="col">ms</th><th scope="col">Easing</th><th scope="col">Curve</th><th scope="col">Behaviour</th></tr>
              </thead>
              <tbody>
                {MOTION.filter((m) => m.group === g).map((m) => (
                  <tr key={m.id}>
                    <th scope="row">{m.name}</th>
                    <td className="mono">{m.frames ?? '-'}</td>
                    <td className="mono">{m.frames ? Math.round((m.frames / FPS) * 1000) : '-'}</td>
                    <td className="mono">{m.easing}</td>
                    <td><Curve m={m} /></td>
                    <td>{m.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <div className="rule two">
        <h2 className="h-md">Reduced motion</h2>
        <ul className="dash">
          <li>When the host or OS asks for reduced motion, reveals and tweens jump to their end state in one frame.</li>
          <li>The meter keeps its ballistics and the scope keeps drawing: they are measurements, not decoration. Phosphor persistence drops to zero so the trace does not smear.</li>
        </ul>
      </div>
    </section>
  )
}
