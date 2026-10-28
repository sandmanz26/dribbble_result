import { SESSIONS, hhmm, sessionNow } from '../data/sessions.js'
import { useNow } from './Sessions.jsx'

// The world-time dial: GlobalTrade's four trading sessions drawn the way a world-timer watch
// shows the hours of distant cities. A 24-hour ring in UTC, one arc per financial centre (lit in
// gold while that market is open) and a single hand at this minute. It reads the visitor's clock.
const C = 200
const pt = (r, h) => { const a = ((h / 24) * 360 - 90) * (Math.PI / 180); return [C + r * Math.cos(a), C + r * Math.sin(a)] }
const f = (n) => n.toFixed(2)
function arc(r, from, to, back = false) {
  const span = ((to - from + 24) % 24) || 24
  const [x1, y1] = pt(r, from)
  const [x2, y2] = pt(r, from + span)
  // Drawn backwards for labels in the lower half, so their letters stay upright.
  if (back) return `M${f(x2)} ${f(y2)}A${r} ${r} 0 ${span > 12 ? 1 : 0} 0 ${f(x1)} ${f(y1)}`
  return `M${f(x1)} ${f(y1)}A${r} ${r} 0 ${span > 12 ? 1 : 0} 1 ${f(x2)} ${f(y2)}`
}
// One ring per centre, the city's name engraved on its own arc.
const RADII = [136, 120, 104, 88]

export default function Dial({ size }) {
  const now = useNow(20000)
  const info = sessionNow(now)
  const h = info.h
  const [hx, hy] = pt(158, h)
  const [tx, ty] = pt(-26, h)
  return (
    <figure className="dial" style={size ? { width: size, maxWidth: "100%" } : undefined} data-ui>
      <svg viewBox="0 0 400 400" role="img" aria-label={`World-time dial at ${hhmm(h)} UTC. ${info.open.length ? `${info.open.map((s) => s.city).join(' and ')} open.` : 'No session open.'}`}>
        <circle cx={C} cy={C} r="196" className="d-case" />
        <circle cx={C} cy={C} r="184" className="d-face" />
        {/* minute track: a mark every quarter hour, longer each hour */}
        {Array.from({ length: 96 }, (_, i) => {
          const hr = i / 4
          const long = i % 4 === 0
          const [a, b] = pt(long ? 166 : 171, hr)
          const [c, d] = pt(178, hr)
          return <line key={i} x1={f(a)} y1={f(b)} x2={f(c)} y2={f(d)} className={long ? 'd-tick big' : 'd-tick'} />
        })}
        {Array.from({ length: 8 }, (_, i) => {
          const hr = i * 3
          const [x, y] = pt(154, hr)
          return <text key={hr} x={f(x)} y={f(y)} className="d-num" textAnchor="middle" dominantBaseline="central">{hr === 0 ? '24' : hr}</text>
        })}
        {SESSIONS.map((s, i) => {
          const on = info.open.includes(s)
          const r = RADII[i]
          const mid = (s.open + 3) % 24
          const back = mid > 6 && mid < 18
          return (
            <g key={s.id} className={on ? 'd-ses on' : 'd-ses'}>
              <path d={arc(r, 0, 24)} className="d-track" />
              <path d={arc(r, s.open, s.close)} className="d-arc" />
              <path id={`city-${s.id}`} d={arc(r, s.open + 0.4, s.open + 6, back)} fill="none" />
              <text className="d-city" dominantBaseline="central"><textPath href={`#city-${s.id}`} startOffset={back ? '100%' : '0'} textAnchor={back ? 'end' : 'start'}>{s.city}</textPath></text>
            </g>
          )
        })}
        <text x={C} y={C + 46} textAnchor="middle" className="d-brand">GLOBALTRADE</text>
        <text x={C} y={C + 62} textAnchor="middle" className="d-sub">World time, UTC</text>
        <line x1={f(tx)} y1={f(ty)} x2={f(hx)} y2={f(hy)} className="d-hand" />
        <circle cx={C} cy={C} r="7" className="d-cap" />
        <circle cx={C} cy={C} r="2.2" className="d-pin" />
      </svg>
      <figcaption className="sr-only">{info.line}</figcaption>
    </figure>
  )
}
