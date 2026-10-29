import { Link, useParams } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { ARTICLES, articleOf } from '../data/insights.js'
import * as I from '../ui/icons.jsx'
import NotFound from './NotFound.jsx'

export default function Insights() {
  const { t, date } = useLang()
  const [lead, ...rest] = ARTICLES
  return (
    <div className="page">
      <header className="page-head wrap" data-reveal>
        <h1 className="h-big">{t({ ar: 'أدلة الاستيراد', en: 'Import guides' })}</h1>
        <p className="lead">{t({ ar: 'ما نشرحه لعملائنا كل أسبوع، مكتوبًا مرة واحدة.', en: 'What we explain to customers every week, written down once.' })}</p>
      </header>
      <section className="guides wrap">
        <Link to={`/insights/${lead.id}`} className="guide-lead" data-reveal>
          <img src={`photos/${lead.photo}.webp`} alt="" width="1024" height="768" loading="lazy" />
          <span><time>{date(new Date(lead.date))}</time><b className="h-mid">{t(lead.title)}</b><span>{t(lead.dek)}</span></span>
        </Link>
        <ul className="guide-list">
          {rest.map((a) => (
            <li key={a.id} data-reveal><Link to={`/insights/${a.id}`}><time>{date(new Date(a.date))}</time><b>{t(a.title)}</b><span>{t(a.dek)}</span><I.Fwd /></Link></li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export function Article() {
  const { id } = useParams()
  const { t, date, hijri } = useLang()
  const a = articleOf(id)
  if (!a) return <NotFound />
  return (
    <article className="page art">
      <header className="art-head wrap" data-reveal>
        <Link to="/insights" className="crumb"><I.Back /> {t({ ar: 'أدلة الاستيراد', en: 'Import guides' })}</Link>
        <h1 className="h-big">{t(a.title)}</h1>
        <p className="lead">{t(a.dek)}</p>
        <p className="fine"><time>{date(new Date(a.date))}</time> · {hijri(new Date(a.date))}</p>
      </header>
      <img className="art-img" src={`photos/${a.photo}.webp`} alt="" width="1600" height="900" />
      <div className="art-body wrap">
        {t(a.body).map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
        {a.sources.length > 0 && (
          <aside className="art-src">
            <h2 className="h-small">{t({ ar: 'المصادر', en: 'Sources' })}</h2>
            <ul>{a.sources.map(([l, u]) => <li key={u}><a href={u} target="_blank" rel="noreferrer" dir="ltr">{l}</a></li>)}</ul>
          </aside>
        )}
        <Link to="/quote" className="btn is-accent">{t({ ar: 'اطلب عرض سعر', en: 'Get a quote' })} <I.Fwd /></Link>
      </div>
    </article>
  )
}
