// Small SVG charts drawn from the data. One question per chart, 3 to 5 faint gridlines, no y-axis
// line, round ticks above the maximum, straight segments, the AI's own figures in selvedge red.
import { useEffect, useRef, useState } from 'react'

function useWidth(min = 280) {
  const ref = useRef(null)
  const [w, setW] = useState(320)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.max(min, Math.round(e.contentRect.width))))
    ro.observe(el); return () => ro.disconnect()
  }, [min])
  return [ref, w]
}
export function ticks(max, n = 4, int = false) {
  const raw = max / n; const mag = 10 ** Math.floor(Math.log10(raw))
  let step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)
  if (int) step = Math.max(1, Math.ceil(step))
  const top = Math.ceil((max * 1.04) / step) * step
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step)
}

// Running total for the month against the plan, with the AI's landing forecast.
export function MonthLine({ days, fmt, endLabel }) {
  const [ref, w] = useWidth()
  const h = 250; const L = 44; const R = w < 520 ? 96 : 150; const T = 14; const B = 26
  let a = 0; let p = 0; let f = 0
  const pts = days.map((d) => {
    p += d.plan
    if (d.actual != null) { a += d.actual; f = a }
    else f += d.forecast
    return { day: d.day, plan: p, actual: d.actual != null ? a : null, fc: d.actual == null || d.day === 28 ? f : null }
  })
  const max = Math.max(p, f)
  const ys = ticks(max, 4)
  const x = (day) => L + ((day - 1) / 30) * (w - L - R)
  const y = (v) => T + (1 - v / ys[ys.length - 1]) * (h - T - B)
  const path = (k) => pts.filter((q) => q[k] != null).map((q, i) => `${i ? 'L' : 'M'}${x(q.day).toFixed(1)},${y(q[k]).toFixed(1)}`).join('')
  const last = pts[pts.length - 1]
  return (
    <div ref={ref} className="chart">
      <div className="legend"><span><i style={{ background: 'var(--text)' }} />Sold</span><span><i className="dash" />Plan</span><span className="is-ai"><i className="dash is-ai" />Forecast</span></div>
      <svg width={w} height={h} role="img" aria-label={`Sales so far this month against the plan. ${endLabel}`}>
        {ys.map((v) => <g key={v}><line x1={L} x2={w - R} y1={y(v)} y2={y(v)} stroke="var(--grid)" /><text x={L - 8} y={y(v) + 4} textAnchor="end" className="tick">{fmt(v)}</text></g>)}
        {(w < 520 ? [1, 15, 29] : [1, 8, 15, 22, 29]).map((d) => <text key={d} x={x(d)} y={h - 6} textAnchor="middle" className="tick">{d} Oct</text>)}
        <line x1={x(29)} x2={x(29)} y1={T} y2={h - B} stroke="var(--control)" />
        <text x={x(29) - 6} y={T + 10} textAnchor="end" className="tick">Today</text>
        <path d={path('plan')} fill="none" stroke="#9b968e" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d={path('actual')} fill="none" stroke="var(--text)" strokeWidth="2" />
        <path d={path('fc')} fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="5 3" />
        {(() => {
          // Keep the two end labels at least 16px apart, the forecast on its own side of the plan.
          let yf = y(last.fc); let yp = y(last.plan)
          if (Math.abs(yf - yp) < 16) { const mid = (yf + yp) / 2; const up = last.fc >= last.plan; yf = mid + (up ? -8 : 8); yp = mid + (up ? 8 : -8) }
          return <>
            <text x={x(31) + 8} y={yf + 4} className="end is-ai">{endLabel}</text>
            <text x={x(31) + 8} y={yp + 4} className="end">Plan {fmt(last.plan, true)}</text>
          </>
        })()}
      </svg>
    </div>
  )
}

// Vertical bars, one series. `mark` is the index where something happened; `fc` bars are forecasts.
export function Bars({ data, unit = '', mark, markLabel, height = 170, fc = 0, label }) {
  const [ref, w] = useWidth(240)
  const h = height; const L = 34; const R = 8; const T = markLabel ? 26 : 10; const B = 24
  const vals = data.map((d) => d[1])
  const ys = ticks(Math.max(...vals, 1), 3, unit === '')
  const top = ys[ys.length - 1]
  const n = data.length; const slot = (w - L - R) / n; const bw = Math.min(28, slot * 0.6)
  const y = (v) => T + (1 - v / top) * (h - T - B)
  return (
    <div ref={ref} className="chart">
      <svg width={w} height={h} role="img" aria-label={label || `Chart, ${n} values`}>
        {ys.map((v) => <g key={v}><line x1={L} x2={w - R} y1={y(v)} y2={y(v)} stroke="var(--grid)" /><text x={L - 6} y={y(v) + 4} textAnchor="end" className="tick">{v}{unit}</text></g>)}
        {data.map(([k, v], i) => {
          const cx = L + slot * i + slot / 2; const isFc = i >= n - fc
          return (
            <g key={k + i}>
              <rect x={cx - bw / 2} y={y(v)} width={bw} height={Math.max(0, y(0) - y(v))} fill={isFc ? 'var(--accent-soft)' : i >= (mark ?? n) ? 'var(--text)' : '#b9b4ab'} stroke={isFc ? 'var(--accent)' : 'none'} strokeDasharray={isFc ? '3 2' : undefined} />
              {(slot >= 34 || i % 2 === 0) && <text x={cx} y={h - 6} textAnchor="middle" className="tick">{k}</text>}
            </g>
          )
        })}
        {mark != null && <g><line x1={L + slot * mark} x2={L + slot * mark} y1={T - 6} y2={h - B} stroke="var(--text)" /><text x={L + slot * mark + 6} y={T - 10} className="tick is-ink">{markLabel}</text></g>}
      </svg>
    </div>
  )
}

// Two series side by side per period: the ink one is the subject, the grey one the comparison.
export function PairBars({ a, b, labels }) {
  const [ref, w] = useWidth(240)
  const h = 150; const L = 26; const R = 8; const T = 8; const B = 24
  const ys = ticks(Math.max(...a.data, ...b.data, 1), 2, true)
  const top = ys[ys.length - 1]; const n = a.data.length; const slot = (w - L - R) / n; const bw = Math.min(12, slot * 0.28)
  const y = (v) => T + (1 - v / top) * (h - T - B)
  return (
    <div ref={ref} className="chart">
      <div className="legend"><span><i style={{ background: 'var(--text)' }} />{a.label}</span><span><i style={{ background: '#b9b4ab' }} />{b.label}</span></div>
      <svg width={w} height={h} role="img" aria-label={`${a.label} against ${b.label}, units per week`}>
        {ys.map((v) => <g key={v}><line x1={L} x2={w - R} y1={y(v)} y2={y(v)} stroke="var(--grid)" /><text x={L - 6} y={y(v) + 4} textAnchor="end" className="tick">{v}</text></g>)}
        {a.data.map((v, i) => {
          const cx = L + slot * i + slot / 2
          return (
            <g key={i}>
              <rect x={cx - bw - 1} y={y(v)} width={bw} height={y(0) - y(v)} fill="var(--text)" />
              <rect x={cx + 1} y={y(b.data[i])} width={bw} height={y(0) - y(b.data[i])} fill="#b9b4ab" />
              {labels[i] && <text x={cx} y={h - 6} textAnchor="middle" className="tick">{labels[i]}</text>}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// Progress against a target: both ends labelled, the fill is the true ratio.
export function Bullet({ value, target, max = 1, label }) {
  return (
    <div className="bullet" role="img" aria-label={label}>
      <span className="bullet-fill" style={{ width: `${(value / max) * 100}%` }} />
      <span className="bullet-tick" style={{ left: `${(target / max) * 100}%` }} />
    </div>
  )
}
