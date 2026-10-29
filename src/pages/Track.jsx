import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { SHIPMENTS, PORTS } from '../data/site.js'
import RouteMap from '../ui/RouteMap.jsx'
import * as I from '../ui/icons.jsx'

const STATE = {
  road: { ar: 'على الطريق', en: 'On the road' },
  hold: { ar: 'متوقفة، تنتظر مستندًا', en: 'Held, waiting for a document' },
  done: { ar: 'تم التسليم', en: 'Delivered' },
}

export default function Track() {
  const { t } = useLang()
  const loc = useLocation(); const nav = useNavigate()
  const q = new URLSearchParams(loc.search).get('id') || ''
  const [val, setVal] = useState(q)
  const [st, setSt] = useState(q ? 'loading' : 'idle')
  useEffect(() => {
    if (!q) { setSt('idle'); return }
    setSt('loading'); setVal(q)
    const id = setTimeout(() => setSt(SHIPMENTS[q.toUpperCase()] ? 'found' : 'missing'), 650)
    return () => clearTimeout(id)
  }, [q])
  const submit = (e) => {
    e.preventDefault()
    const v = val.trim().toUpperCase().replace(/\s+/g, '')
    if (!v) { setSt('empty'); return }
    nav(`/track?id=${encodeURIComponent(v)}`)
  }
  const s = SHIPMENTS[q.toUpperCase()]
  return (
    <div className="page">
      <header className="page-head wrap" data-reveal>
        <h1 className="h-big">{t({ ar: 'تتبع شحنة', en: 'Track a shipment' })}</h1>
        <p className="lead">{t({ ar: 'أدخل رقم الشحنة الذي يبدأ بـ DRB. يظهر كل حدث، والخطوة التالية، وما إذا كان شيء ينتظر منك.', en: 'Enter the shipment number that starts with DRB. You see every event, the next step, and whether anything is waiting on you.' })}</p>
      </header>

      <form className="track-form wrap" onSubmit={submit} role="search">
        <label htmlFor="trk" className="sr">{t({ ar: 'رقم الشحنة', en: 'Shipment number' })}</label>
        <input id="trk" dir="ltr" value={val} onChange={(e) => setVal(e.target.value)} placeholder="DRB-240117" autoComplete="off" spellCheck="false"
          aria-invalid={st === 'empty' || st === 'missing'} aria-describedby="trk-help" />
        <button className="btn is-accent" type="submit"><I.Search aria-hidden="true" /> {t({ ar: 'تتبع', en: 'Track' })}</button>
        <p id="trk-help" className="fine">
          {st === 'empty' ? <span className="err">{t({ ar: 'اكتب رقم الشحنة أولًا.', en: 'Type a shipment number first.' })}</span> : t({ ar: 'للتجربة:', en: 'Try:' })}{' '}
          {Object.keys(SHIPMENTS).map((k) => <Link key={k} to={`/track?id=${k}`} className="chip-link" dir="ltr">{k}</Link>)}
        </p>
      </form>

      <div className="wrap track-out" aria-live="polite" aria-busy={st === 'loading'}>
        {st === 'loading' && <div className="track-skel" role="status"><span /><span /><span /><span className="sr">{t({ ar: 'جارٍ البحث', en: 'Looking up' })}</span></div>}
        {st === 'missing' && (
          <div className="notice is-err">
            <I.Warn aria-hidden="true" />
            <div>
              <h2>{t({ ar: 'لم نجد هذا الرقم', en: 'We could not find this number' })} <bdi dir="ltr">{q}</bdi></h2>
              <p>{t({ ar: 'تأكد من الحروف والأرقام كما وردت في رسالة التأكيد. أرقام الحاويات مثل MSKU تتبعها مع خط الملاحة، أو أرسلها لنا.', en: 'Check the letters and digits against your confirmation message. Container numbers such as MSKU are tracked with the carrier, or send it to us.' })}</p>
              <Link to="/contact" className="link">{t({ ar: 'اسأل فريق العمليات', en: 'Ask the operations team' })}</Link>
            </div>
          </div>
        )}
        {st === 'found' && s && <Result id={q.toUpperCase()} s={s} />}
      </div>
    </div>
  )
}

function Result({ id, s }) {
  const { t, n, date, hijri, time } = useLang()
  const [copied, setCopied] = useState(false)
  const port = PORTS.find((p) => p.id === s.port)
  const done = s.events.filter((e) => e.done).length
  const progress = s.state === 'done' ? 1 : s.state === 'hold' ? 0.42 : 0.82
  const copy = async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* no clipboard */ } }
  return (
    <article className="trk">
      <header className="trk-head">
        <div>
          <p className="trk-id" dir="ltr">{id}</p>
          <h2 className="h-mid">{t(s.from)} <I.Fwd className="tiny" /> {t(s.to)}</h2>
          <p>{t(s.goods)} · <bdi dir="ltr">{s.ref}</bdi></p>
        </div>
        <div className={`trk-state is-${s.state}`}>
          <b>{t(STATE[s.state])}</b>
          {s.eta && <span>{s.state === 'done' ? t({ ar: 'سُلّمت في', en: 'Delivered on' }) : t({ ar: 'الوصول المتوقع', en: 'Expected' })} {date(new Date(s.eta))}<small>{hijri(new Date(s.eta))}</small></span>}
          <button className="link" onClick={copy}><I.Copy aria-hidden="true" /> {copied ? t({ ar: 'تم نسخ الرابط', en: 'Link copied' }) : t({ ar: 'انسخ رابط التتبع', en: 'Copy tracking link' })}</button>
        </div>
      </header>
      {s.hold && <div className="notice is-warn"><I.Warn aria-hidden="true" /><div><h3>{t({ ar: 'مطلوب منك', en: 'Needed from you' })}</h3><p>{t(s.hold)}</p><Link to="/contact?topic=customs" className="btn is-accent">{t({ ar: 'أرسل التقرير', en: 'Send the report' })}</Link></div></div>}
      <div className="trk-body">
        <ol className="events">
          {s.events.map((e, i) => (
            <li key={i} className={`${e.done ? 'is-done' : ''} ${e.now ? 'is-now' : ''} ${e.warn ? 'is-warn' : ''}`}>
              <span className="ev-dot" aria-hidden="true" />
              <p className="ev-what">{t(e.what)}</p>
              <p className="ev-when">{e.at ? <>{date(new Date(e.at), { day: 'numeric', month: 'short' })} · {time(new Date(e.at))}</> : t({ ar: 'لاحقًا', en: 'Later' })}</p>
            </li>
          ))}
        </ol>
        <figure className="trk-map">
          <RouteMap stops={[port.pt, s.dest === port.pt ? port.pt : s.dest].filter((v, i, a) => a.indexOf(v) === i)} marks={[port.pt]} ports={[port.pt]} progress={progress}
            label={t({ ar: `المسار من ${t(port.name)} إلى ${t(s.to)}`, en: `Route from ${t(port.name)} to ${t(s.to)}` })} />
          <figcaption>{t({ ar: `${n(done)} من ${n(s.events.length)} مراحل مكتملة · وصول عبر ${t(port.name)}`, en: `${done} of ${s.events.length} stages done · entry through ${t(port.name)}` })}</figcaption>
        </figure>
      </div>
    </article>
  )
}
