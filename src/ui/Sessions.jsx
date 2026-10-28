import { useEffect, useState } from 'react'
import { SESSIONS, hhmm, sessionNow } from '../data/sessions.js'

// The live thing: the trading day across the four financial centres, with a marker at this
// minute. It reads the visitor's real clock, so it is different for every visit.
export function useNow(ms = 30000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const id = setInterval(() => setNow(new Date()), ms); return () => clearInterval(id) }, [ms])
  return now
}

const segs = (s) => (s.open < s.close ? [[s.open, s.close]] : [[s.open, 24], [0, s.close]])

export default function Sessions({ compact = false }) {
  const now = useNow()
  const info = sessionNow(now)
  const pct = (h) => `${(h / 24) * 100}%`
  const local = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return (
    <figure className={`sessions ${compact ? 'compact' : ''}`} data-ui aria-label="Trading sessions today">
      <figcaption className="ses-now">
        <span className="ses-time num">{hhmm(info.h)} UTC <span className="muted">· {local} your time</span></span>
        <span className="ses-line">{info.line}</span>
      </figcaption>
      <div className="ses-grid">
        {SESSIONS.map((s) => {
          const on = info.open.includes(s)
          return (
            <div key={s.id} className={`ses-row ${on ? 'on' : ''}`}>
              <span className="ses-city">{s.city}<small className="num">{hhmm(s.open)} to {hhmm(s.close)}</small></span>
              <span className="ses-track">
                {segs(s).map(([a, b]) => <i key={a} style={{ left: pct(a), width: pct(b - a) }} />)}
              </span>
              <span className="ses-state">{on ? 'Open' : info.fx && info.next?.s === s ? `Opens in ${Math.floor(info.next.wait)}h ${String(Math.round((info.next.wait % 1) * 60)).padStart(2, '0')}m` : 'Closed'}</span>
            </div>
          )
        })}
        <span className="ses-marker" style={{ left: `calc(var(--lab) + (100% - var(--lab) - var(--st)) * ${info.h / 24})` }} aria-hidden="true" />
        <div className="ses-hours num" aria-hidden="true">{(compact ? [0, 12, 24] : [0, 6, 12, 18, 24]).map((h) => <span key={h} style={{ left: pct(h) }}>{hhmm(h)}</span>)}</div>
      </div>
    </figure>
  )
}
