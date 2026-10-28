import { useEffect, useMemo, useRef, useState } from 'react'
import { fmt } from '../data/market.js'

// A price line drawn in SVG to the app rules: a 1.5px line in the one accent, a faint flat area,
// four price ticks in their own lane on the right, three or four time labels, the last price marked.
const nice = (min, max, n = 4) => {
  const span = max - min || max * 0.001
  const raw = span / n
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)
  const lo = Math.floor(min / step) * step
  const ticks = []
  for (let v = lo; v <= max + step * 0.01; v += step) if (v >= min - step * 0.01) ticks.push(v)
  return ticks
}
const time = (t) => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })

// The chart measures its box so text is never stretched: the SVG is drawn at its real pixel size.
function useWidth() {
  const ref = useRef(null)
  const [box, setBox] = useState([800, 360])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setBox([Math.max(200, Math.round(e.contentRect.width)), Math.round(e.contentRect.height)]))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, ...box]
}

// `height` is a number of pixels, or 'fill' to take the height of its container.
export default function Chart({ id, data, height = 360, axes = true, area = true, lane = 76, label, className = '' }) {
  const [ref, w, boxH] = useWidth()
  const h = height === 'fill' ? Math.max(120, boxH) : height
  const m = useMemo(() => {
    const ps = data.map((d) => d.p)
    let min = Math.min(...ps)
    let max = Math.max(...ps)
    const pad = (max - min) * 0.12 || max * 0.0005
    min -= pad
    max += pad
    const pw = w - (axes ? lane : 0)
    const ph = h - (axes ? 28 : 0)
    const x = (i) => (i / (data.length - 1)) * pw
    const y = (p) => ph - ((p - min) / (max - min)) * ph
    const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d.p).toFixed(1)}`).join('')
    const fill = `${line}L${pw} ${ph}L0 ${ph}Z`
    const ticks = nice(min, max).filter((v) => v > min && v < max)
    const times = [0, 0.33, 0.66, 1].map((f) => Math.round(f * (data.length - 1)))
    const last = data[data.length - 1]
    return { line, fill, ticks, times, x, y, pw, ph, last }
  }, [data, w, h, axes, lane])

  return (
    <div ref={ref} className={`chartbox ${className}`} style={{ height: height === 'fill' ? '100%' : height }}>
    <svg className="chart" width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label || `${id} price chart, demo data`}>
      {axes && m.ticks.map((v) => (
        <g key={v}>
          <line x1="0" x2={m.pw} y1={m.y(v)} y2={m.y(v)} className="grid" />
          <text x={m.pw + 10} y={m.y(v) + 4} className="tick">{fmt(id, v)}</text>
        </g>
      ))}
      {area && <path d={m.fill} className="area" />}
      <path d={m.line} className="line" />
      <circle cx={m.x(data.length - 1)} cy={m.y(m.last.p)} r="3.5" className="dot" />
      {axes && (
        <>
          <rect x={m.pw + 4} y={m.y(m.last.p) - 11} width={lane - 6} height="22" className="lastbox" />
          <text x={m.pw + 10} y={m.y(m.last.p) + 4} className="lasttext">{fmt(id, m.last.p)}</text>
          {m.times.map((i, k) => <text key={k} x={Math.min(m.x(i), m.pw - 40)} y={h - 6} className="tick">{time(data[i].t)}</text>)}
        </>
      )}
    </svg>
    </div>
  )
}
