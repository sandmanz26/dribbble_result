import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { PORTS, CITIES, VIA, plan } from '../data/site.js'
import RouteMap from './RouteMap.jsx'
import * as I from './icons.jsx'

// Pick the port of entry and the destination; the road, the distance and the days follow.
export default function RoutePlanner({ initialPort = 'jeddah', initialCity = 'riyadh' }) {
  const { t, n } = useLang()
  const [port, setPort] = useState(initialPort)
  const [city, setCity] = useState(initialCity)
  const p = PORTS.find((x) => x.id === port)
  const c = CITIES.find((x) => x.id === city)
  const r = plan(port, city)
  const stops = [p.pt, ...(VIA[`${port}-${city}`] || []), city].filter((v, i, a) => a.indexOf(v) === i)
  const range = ([a, b]) => (a === b ? n(a) : `${n(a)} ${t({ ar: 'إلى', en: 'to' })} ${n(b)}`)
  const best = PORTS.map((x) => ({ id: x.id, total: plan(x.id, city).total })).sort((a, b) => a.total[1] - b.total[1] || a.total[0] - b.total[0])[0]

  return (
    <section className="planner" aria-labelledby="planner-h">
      <div className="planner-plate" data-reveal>
        <RouteMap stops={stops} marks={PORTS.map((x) => x.pt)} ports={PORTS.map((x) => x.pt)} className="on-field"
          label={t({ ar: `خريطة المملكة، المسار من ${t(p.name)} إلى ${t(c.name)}`, en: `Map of the Kingdom, route from ${t(p.name)} to ${t(c.name)}` })} />
      </div>
      <div className="planner-side">
        <div className="tabs" role="tablist" aria-label={t({ ar: 'ميناء الوصول', en: 'Port of entry' })}>
          {PORTS.map((x) => (
            <button key={x.id} role="tab" aria-selected={port === x.id} onClick={() => setPort(x.id)}>{t(x.name)}</button>
          ))}
        </div>
        <div className="planner-mid">
          <h2 id="planner-h" className="h-mid">{t({ ar: 'من الرصيف إلى', en: 'From the quay to' })} {t(c.name)}</h2>
          <label className="dest">
            <span>{t({ ar: 'الوجهة', en: 'Destination' })}</span>
            <span className="select">
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                {CITIES.map((x) => <option key={x.id} value={x.id}>{t(x.name)}</option>)}
              </select>
              <I.Down aria-hidden="true" />
            </span>
          </label>
          <dl className="planner-facts" aria-live="polite">
            <div><dt>{t({ ar: 'على الطريق', en: 'By road' })}</dt><dd>{n(r.km)} {t({ ar: 'كم', en: 'km' })}</dd></div>
            <div><dt>{t({ ar: 'التخليص', en: 'Clearance' })}</dt><dd>{range(r.clear)} {t({ ar: 'أيام', en: 'days' })}</dd></div>
            <div><dt>{t({ ar: 'النقل', en: 'Trucking' })}</dt><dd>{r.road[1] === 0 || (r.road[0] === 0 && r.road[1] === 1) ? t({ ar: 'نفس اليوم', en: 'Same day' }) : `${range(r.road)} ${t({ ar: 'أيام', en: 'days' })}`}</dd></div>
          </dl>
          <p className="planner-total">{t({ ar: 'من رسو السفينة إلى بابك في', en: 'From berth to your door in' })} <b>{range(r.total)} {t({ ar: 'أيام', en: 'days' })}</b></p>
          <p className="planner-note">
            {t(p.note)}{' '}
            {best.id !== port && <button className="link" onClick={() => setPort(best.id)}>{t({ ar: `إلى ${t(c.name)}، ${t(PORTS.find((x) => x.id === best.id).name)} أسرع.`, en: `For ${t(c.name)}, ${t(PORTS.find((x) => x.id === best.id).name)} is faster.` })}</button>}
          </p>
          <p className="fine">{t({ ar: 'مدد تقديرية تبدأ من رسو السفينة. نؤكدها في عرض السعر.', en: 'Indicative times from the ship’s berthing. Confirmed in your quote.' })}</p>
        </div>
        <div className="cells">
          <Link className="cell is-ink" to={`/quote?port=${port}&city=${city}`}>{t({ ar: 'عرض سعر لهذا المسار', en: 'Quote this route' })} <I.Fwd /></Link>
          <Link className="cell" to="/track">{t({ ar: 'تتبع شحنة', en: 'Track a shipment' })} <I.Fwd /></Link>
        </div>
      </div>
    </section>
  )
}
