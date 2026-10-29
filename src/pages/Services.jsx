import { Link, useParams } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { SERVICES, serviceOf } from '../data/services.js'
import * as I from '../ui/icons.jsx'
import NotFound from './NotFound.jsx'

export default function Services() {
  const { t } = useLang()
  return (
    <div className="page">
      <header className="page-head wrap" data-reveal>
        <h1 className="h-big">{t({ ar: 'الخدمات', en: 'Services' })}</h1>
        <p className="lead">{t({ ar: 'ست خدمات تغطي رحلة البضاعة كاملة، ويمكن طلب كل منها وحدها.', en: 'Six services that cover the whole journey of your goods. Each can be booked on its own.' })}</p>
      </header>
      <ol className="svc-list wrap">
        {SERVICES.map((s) => {
          const Icon = I.SERVICE_ICON[s.icon]
          return (
            <li key={s.id} data-reveal>
              <Link to={`/services/${s.id}`} className="svc-row">
                <img src={`photos/${s.photo}.webp`} alt="" width="640" height="480" loading="lazy" />
                <span className="svc-text">
                  <span className="svc-name"><Icon aria-hidden="true" />{t(s.name)}</span>
                  <span className="svc-short">{t(s.short)}</span>
                </span>
                <span className="svc-go">{t({ ar: 'التفاصيل', en: 'Details' })} <I.Fwd /></span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function Service() {
  const { id } = useParams()
  const { t } = useLang()
  const s = serviceOf(id)
  if (!s) return <NotFound />
  const others = SERVICES.filter((x) => x.id !== s.id)
  return (
    <article className="page">
      <header className="svc-head wrap">
        <div data-reveal>
          <Link to="/services" className="crumb"><I.Back /> {t({ ar: 'الخدمات', en: 'Services' })}</Link>
          <h1 className="h-big">{t(s.name)}</h1>
          <p className="lead">{t(s.lead)}</p>
          <Link to={`/quote?service=${s.id}`} className="btn is-accent">{t({ ar: 'اطلب عرض سعر', en: 'Get a quote' })} <I.Fwd /></Link>
        </div>
        <img data-reveal-img src={`photos/${s.photo}.webp`} alt={t(s.name)} width="1024" height="768" />
      </header>

      <section className="svc-body wrap">
        <div className="svc-inc" data-reveal>
          <h2 className="h-small">{t({ ar: 'ما تشمله الخدمة', en: 'What it includes' })}</h2>
          <ul className="ticks">{t(s.includes).map((x) => <li key={x}><I.Ok aria-hidden="true" />{x}</li>)}</ul>
        </div>
        <div className="slip is-flat" data-reveal>
          <h2 className="h-small">{t({ ar: 'المراحل والمدد', en: 'Stages and times' })}</h2>
          {s.steps.map((x) => <p key={x.en} className="slip-row"><span>{t(x)}</span><i aria-hidden="true" /><span>{t(x.d)}</span></p>)}
          <p className="fine">{t({ ar: 'مدد تقديرية، نؤكدها في عرض السعر.', en: 'Indicative times, confirmed in your quote.' })}</p>
        </div>
        <div className="svc-docs" data-reveal>
          <h2 className="h-small">{t({ ar: 'المستندات المطلوبة', en: 'Documents we need' })}</h2>
          <ul>{t(s.docs).map((x) => <li key={x}><I.Doc aria-hidden="true" />{x}</li>)}</ul>
          <Link to="/insights/saber-shipment-certificate" className="link">{t({ ar: 'دليل شهادات سابر', en: 'Guide to SABER certificates' })}</Link>
        </div>
      </section>

      <nav className="svc-more wrap" aria-labelledby="more-h">
        <h2 id="more-h" className="h-small">{t({ ar: 'خدمات أخرى', en: 'Other services' })}</h2>
        <ul>{others.map((x) => <li key={x.id}><Link to={`/services/${x.id}`}>{t(x.name)} <I.Fwd /></Link></li>)}</ul>
      </nav>
    </article>
  )
}
