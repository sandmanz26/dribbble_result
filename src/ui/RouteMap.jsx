import map from '../data/map.json'
import { useLang } from '../i18n.jsx'

// The Kingdom drawn from Natural Earth outlines (projected once at build time; see docs/strategy.md).
// `stops` is a list of point ids from map.json; the route is drawn through them in order.
const LABEL = {
  jeddah: { ar: 'جدة', en: 'Jeddah' }, riyadh: { ar: 'الرياض', en: 'Riyadh' }, dammam: { ar: 'الدمام', en: 'Dammam' }, jubail: { ar: 'الجبيل', en: 'Jubail' },
  madinah: { ar: 'المدينة', en: 'Madinah' }, buraydah: { ar: 'بريدة', en: 'Buraydah' }, hail: { ar: 'حائل', en: 'Hail' }, tabuk: { ar: 'تبوك', en: 'Tabuk' },
  abha: { ar: 'أبها', en: 'Abha' }, rabigh: { ar: 'رابغ', en: 'Rabigh' }, batha: { ar: 'البطحاء', en: 'Al Batha' }, causeway: { ar: 'الجسر', en: 'Causeway' },
}

function curve(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]; const [x1, y1] = pts[i]
    const mx = (x0 + x1) / 2; const my = (y0 + y1) / 2; const k = 0.12
    d += ` Q${mx - (y1 - y0) * k},${my + (x1 - x0) * k} ${x1},${y1}`
  }
  return d
}

export default function RouteMap({ stops = [], marks = [], progress = null, label, className = '', ports = [] }) {
  const { t } = useLang()
  const P = map.pts
  const pts = stops.map((s) => P[s])
  const path = pts.length > 1 ? curve(pts) : null
  const shown = [...new Set([...marks, ...stops])]
  return (
    <svg className={`rmap ${className}`} viewBox="0 -80 1000 980" role="img" aria-label={label}>
      <path className="rmap-near" d={map.near} />
      <path className="rmap-land" d={map.sa} />
      {path && <path key={path} className="rmap-route" d={path} pathLength="1" />}
      {path && progress != null && <path className="rmap-done" d={path} pathLength="1" style={{ strokeDasharray: `${progress} 1` }} />}
      {shown.map((id) => {
        const [x, y] = P[id]; const isPort = ports.includes(id); const end = stops[stops.length - 1] === id; const start = stops[0] === id
        const left = x > 640
        return (
          <g key={id} className={`rmap-pt ${start || end ? 'is-key' : ''} ${isPort ? 'is-port' : ''}`}>
            {isPort ? <rect x={x - 9} y={y - 9} width="18" height="18" /> : <circle cx={x} cy={y} r={start || end ? 9 : 6} />}
            <text x={left ? x - 18 : x + 18} y={y + 9} textAnchor={left ? 'end' : 'start'} direction="ltr" unicodeBidi="plaintext">{t(LABEL[id])}</text>
          </g>
        )
      })}
    </svg>
  )
}
