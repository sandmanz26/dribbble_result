import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { OFFICES, HOURS } from '../data/site.js'
import RouteMap from '../ui/RouteMap.jsx'
import * as I from '../ui/icons.jsx'

// Riyadh time decides whether the offices are open: Sunday to Thursday, 8 to 17.
function riyadhNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Riyadh', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date())
  const get = (k) => parts.find((p) => p.type === k)?.value
  return { day: get('weekday'), h: +get('hour'), m: +get('minute') }
}

export default function Network() {
  const { t, time } = useLang()
  const [now, setNow] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(id) }, [])
  const r = riyadhNow()
  const work = !['Fri', 'Sat'].includes(r.day)
  const open = work && r.h >= 8 && r.h < 17
  return (
    <div className="page">
      <header className="page-head wrap" data-reveal>
        <h1 className="h-big">{t({ ar: 'ثلاث مدن، بحران، ومنفذان', en: 'Three cities, two seas, two borders' })}</h1>
        <p className="lead">{t({ ar: 'مكاتبنا عند الموانئ التي تدخل منها بضاعتك، وعند المدينة التي تتجه إليها أغلب الشحنات.', en: 'Our offices sit at the ports your goods come through, and in the city most of them are going to.' })}</p>
      </header>

      <section className="net wrap">
        <figure className="net-map" data-reveal>
          <RouteMap stops={[]} marks={['jeddah', 'riyadh', 'dammam', 'rabigh', 'batha']} ports={['jeddah', 'dammam', 'rabigh']}
            label={t({ ar: 'خريطة الفروع والموانئ والمنافذ', en: 'Map of offices, ports and border crossings' })} />
          <figcaption><span className="key is-port" />{t({ ar: 'ميناء', en: 'Port' })} <span className="key" />{t({ ar: 'مكتب أو منفذ بري', en: 'Office or border crossing' })}</figcaption>
        </figure>
        <div className="net-now" data-reveal>
          <h2 className="h-small">{t({ ar: 'الآن في الرياض', en: 'Now in Riyadh' })}</h2>
          <p className="net-clock" aria-live="off">{time(now)}</p>
          <p className={`net-open ${open ? 'is-open' : ''}`}><I.Clock aria-hidden="true" />{open ? t({ ar: 'المكاتب مفتوحة', en: 'Offices are open' }) : t({ ar: 'المكاتب مغلقة الآن', en: 'Offices are closed now' })}</p>
          <p>{t(HOURS.office)}.</p>
          <p>{t(HOURS.ops)}.</p>
        </div>
      </section>

      <section className="offices wrap" aria-labelledby="off-h">
        <h2 id="off-h" className="sr">{t({ ar: 'المكاتب', en: 'Offices' })}</h2>
        {OFFICES.map((o) => (
          <article key={o.id} id={o.id} className="office" data-reveal>
            <img src={`photos/${o.photo}.webp`} alt="" width="800" height="600" loading="lazy" />
            <div>
              <h3 className="h-mid">{t(o.city)}</h3>
              <p className="strong">{t(o.role)}</p>
              <p><I.Pin aria-hidden="true" className="tiny" /> {t(o.addr)}</p>
              <Link to={`/contact?office=${o.id}`} className="link-arrow">{t({ ar: `راسل مكتب ${t(o.city)}`, en: `Write to the ${t(o.city)} office` })} <I.Fwd /></Link>
            </div>
          </article>
        ))}
      </section>

      <section className="borders wrap" aria-labelledby="b-h" data-reveal>
        <h2 id="b-h" className="h-mid">{t({ ar: 'العبور البري إلى الخليج', en: 'Crossing to the Gulf by road' })}</h2>
        <dl>
          <div><dt>{t({ ar: 'منفذ البطحاء', en: 'Al Batha' })}</dt><dd>{t({ ar: 'إلى الإمارات. شاحنات يومية من جبل علي إلى الدمام والرياض.', en: 'To the UAE. Daily trucks from Jebel Ali to Dammam and Riyadh.' })}</dd></div>
          <div><dt>{t({ ar: 'جسر الملك فهد', en: 'King Fahd Causeway' })}</dt><dd>{t({ ar: 'إلى البحرين. عبور خلال يوم مع التخليص.', en: 'To Bahrain. A crossing within a day, clearance included.' })}</dd></div>
        </dl>
        <img src="photos/causeway-dhow.webp" alt={t({ ar: 'مركب شراعي عند الغروب قرب جسر في البحرين', en: 'A dhow at sunset by a causeway in Bahrain' })} width="1024" height="683" loading="lazy" />
      </section>
    </div>
  )
}
