import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { SERVICES } from '../data/services.js'
import { PORTS, CITIES } from '../data/site.js'
import * as I from '../ui/icons.jsx'

const STEPS = [{ ar: 'الشحنة', en: 'Cargo' }, { ar: 'المسار', en: 'Route' }, { ar: 'التوقيت', en: 'Timing' }, { ar: 'بياناتك', en: 'Contact' }]
const TERMS = [
  ['EXW', { ar: 'نستلم من مصنع المورّد', en: 'We collect at the supplier’s door' }],
  ['FOB', { ar: 'المورّد يسلّم على السفينة', en: 'The supplier loads it on board' }],
  ['CIF', { ar: 'المورّد يدفع الشحن والتأمين حتى الميناء السعودي', en: 'The supplier pays freight and insurance to the Saudi port' }],
  ['DAP', { ar: 'المورّد يوصل حتى الوجهة دون التخليص', en: 'The supplier delivers to the destination, not cleared' }],
]
const KEY = 'darb-quotes-v1'

export default function Quote() {
  const { t, n, date } = useLang()
  const q = new URLSearchParams(useLocation().search)
  const [step, setStep] = useState(0)
  const [sent, setSent] = useState(null)
  const [errs, setErrs] = useState({})
  const [f, setF] = useState({
    service: q.get('service') || 'sea', what: '', size: '40', count: 1, weight: '', chilled: false, dg: false, oversize: false,
    origin: '', port: q.get('port') || 'jeddah', city: q.get('city') || 'riyadh',
    ready: '', term: 'FOB', customs: true, insurance: false, storage: false,
    company: '', name: '', email: '', mobile: '', cr: '', consent: false,
  })
  const set = (k) => (e) => setF({ ...f, [k]: e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e })
  const sea = f.service === 'sea' || f.service === 'project'

  const check = (s) => {
    const e = {}
    if (s === 0) {
      if (f.what.trim().length < 3) e.what = { ar: 'صف البضاعة في كلمات قليلة، مثل: أدوات منزلية.', en: 'Describe the goods in a few words, such as: household goods.' }
      if (!sea && !(+f.weight > 0)) e.weight = { ar: 'أدخل الوزن التقريبي بالكيلوغرام.', en: 'Enter the approximate weight in kilograms.' }
    }
    if (s === 1 && f.origin.trim().length < 2) e.origin = { ar: 'من أي مدينة أو ميناء تبدأ الشحنة؟', en: 'Which city or port does it start from?' }
    if (s === 2 && !f.ready) e.ready = { ar: 'اختر تاريخًا تقريبيًا لجاهزية البضاعة.', en: 'Choose a rough date when the goods are ready.' }
    if (s === 3) {
      if (f.name.trim().length < 2) e.name = { ar: 'اكتب اسمك.', en: 'Enter your name.' }
      if (f.company.trim().length < 2) e.company = { ar: 'اكتب اسم المنشأة.', en: 'Enter the company name.' }
      if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = { ar: 'البريد الإلكتروني غير مكتمل.', en: 'This email address looks incomplete.' }
      if (!/^5\d{8}$/.test(f.mobile.replace(/\s/g, ''))) e.mobile = { ar: 'رقم الجوال تسعة أرقام يبدأ بـ ٥، مثل ٥٥ ١٢٣ ٤٥٦٧.', en: 'A mobile number is nine digits starting with 5, like 55 123 4567.' }
      if (f.cr && !/^\d{10}$/.test(f.cr)) e.cr = { ar: 'السجل التجاري عشرة أرقام.', en: 'A commercial registration number has ten digits.' }
      if (!f.consent) e.consent = { ar: 'نحتاج موافقتك لنتواصل معك بشأن هذا الطلب.', en: 'We need your consent to contact you about this request.' }
    }
    setErrs(e)
    if (Object.keys(e).length) { setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 0); return false }
    return true
  }
  const next = () => { if (check(step)) setStep(step + 1) }
  const submit = (e) => {
    e.preventDefault()
    if (step < 3) return next()
    if (!check(3)) return
    const ref = `DRB-Q-${String(Math.floor(1000 + Math.random() * 9000))}`
    try { const list = JSON.parse(localStorage.getItem(KEY) || '[]'); list.unshift({ ref, at: Date.now(), ...f }); localStorage.setItem(KEY, JSON.stringify(list.slice(0, 10))) } catch { /* storage off */ }
    setSent(ref); window.scrollTo({ top: 0 })
  }
  const svc = SERVICES.find((s) => s.id === f.service)
  const port = PORTS.find((p) => p.id === f.port); const city = CITIES.find((c) => c.id === f.city)
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const Err = ({ k }) => (errs[k] ? <span className="err" id={`${k}-err`}>{t(errs[k])}</span> : null)
  const inv = (k) => ({ 'aria-invalid': !!errs[k], 'aria-describedby': errs[k] ? `${k}-err` : undefined })

  if (sent) return (
    <div className="page">
      <section className="done wrap" data-reveal>
        <I.Ok aria-hidden="true" className="done-ic" />
        <h1 className="h-big">{t({ ar: 'وصلنا طلبك', en: 'We have your request' })}</h1>
        <p className="lead">{t({ ar: 'رقم الطلب', en: 'Request number' })} <b dir="ltr">{sent}</b>. {t({ ar: 'يراجعه فريق المبيعات ويرد عليك خلال يوم عمل، من الأحد إلى الخميس.', en: 'Our sales team reviews it and replies within a working day, Sunday to Thursday.' })}</p>
        <dl className="sum">
          <div><dt>{t({ ar: 'الخدمة', en: 'Service' })}</dt><dd>{t(svc.name)}</dd></div>
          <div><dt>{t({ ar: 'البضاعة', en: 'Goods' })}</dt><dd>{f.what}{sea ? ` · ${n(f.count)} × ${n(+f.size)} ${t({ ar: 'قدم', en: 'ft' })}` : ` · ${n(+f.weight)} ${t({ ar: 'كغ', en: 'kg' })}`}</dd></div>
          <div><dt>{t({ ar: 'المسار', en: 'Route' })}</dt><dd>{f.origin} <I.Fwd className="tiny" /> {t(port.name)} <I.Fwd className="tiny" /> {t(city.name)}</dd></div>
          <div><dt>{t({ ar: 'الجاهزية', en: 'Ready' })}</dt><dd>{date(new Date(f.ready))} · {f.term}</dd></div>
        </dl>
        <div className="row-btns"><Link to="/" className="btn">{t({ ar: 'الصفحة الرئيسية', en: 'Home' })}</Link><Link to="/insights/saber-shipment-certificate" className="btn is-accent">{t({ ar: 'جهّز شهادات سابر', en: 'Prepare your SABER certificates' })} <I.Fwd /></Link></div>
      </section>
    </div>
  )

  return (
    <div className="page">
      <header className="page-head wrap" data-reveal>
        <h1 className="h-big">{t({ ar: 'اطلب عرض سعر', en: 'Get a quote' })}</h1>
        <p className="lead">{t({ ar: 'أربع خطوات قصيرة. كلما كانت التفاصيل أدق، كان السعر أقرب لما ستدفعه.', en: 'Four short steps. The more precise the details, the closer the price is to what you will pay.' })}</p>
      </header>
      <form className="qform wrap" onSubmit={submit} noValidate>
        <ol className="qsteps" aria-label={t({ ar: 'خطوات الطلب', en: 'Request steps' })}>
          {STEPS.map((s, i) => <li key={s.en} className={i === step ? 'is-now' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
            {i < step ? <button type="button" onClick={() => setStep(i)}>{t(s)}</button> : <span>{t(s)}</span>}
          </li>)}
        </ol>

        {step === 0 && (
          <fieldset>
            <legend className="h-mid">{t({ ar: 'ماذا تشحن؟', en: 'What are you shipping?' })}</legend>
            <div className="radios" role="radiogroup" aria-label={t({ ar: 'الخدمة', en: 'Service' })}>
              {SERVICES.map((s) => <label key={s.id} className={f.service === s.id ? 'is-on' : ''}><input type="radio" name="service" value={s.id} checked={f.service === s.id} onChange={set('service')} />{t(s.name)}</label>)}
            </div>
            <label className="field"><span>{t({ ar: 'وصف البضاعة', en: 'Description of the goods' })}</span><input value={f.what} onChange={set('what')} {...inv('what')} placeholder={t({ ar: 'أدوات منزلية، قطع غيار، مواد غذائية…', en: 'Household goods, spare parts, food…' })} /><Err k="what" /></label>
            {sea ? (
              <div className="two">
                <label className="field"><span>{t({ ar: 'مقاس الحاوية', en: 'Container size' })}</span><span className="select"><select value={f.size} onChange={set('size')}><option value="20">{t({ ar: '٢٠ قدمًا', en: '20 ft' })}</option><option value="40">{t({ ar: '٤٠ قدمًا', en: '40 ft' })}</option><option value="45">{t({ ar: '٤٠ قدمًا عالية', en: '40 ft high cube' })}</option></select><I.Down aria-hidden="true" /></span></label>
                <label className="field"><span>{t({ ar: 'عدد الحاويات', en: 'Number of containers' })}</span><input type="number" min="1" max="99" value={f.count} onChange={set('count')} inputMode="numeric" /></label>
              </div>
            ) : (
              <label className="field"><span>{t({ ar: 'الوزن الإجمالي (كغ)', en: 'Total weight (kg)' })}</span><input type="number" min="1" value={f.weight} onChange={set('weight')} inputMode="numeric" {...inv('weight')} /><Err k="weight" /></label>
            )}
            <div className="checks">
              <label><input type="checkbox" checked={f.chilled} onChange={set('chilled')} />{t({ ar: 'تحتاج تبريدًا', en: 'Needs to stay chilled' })}</label>
              <label><input type="checkbox" checked={f.dg} onChange={set('dg')} />{t({ ar: 'مواد خطرة', en: 'Dangerous goods' })}</label>
              <label><input type="checkbox" checked={f.oversize} onChange={set('oversize')} />{t({ ar: 'أكبر من الحاوية', en: 'Larger than a container' })}</label>
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="h-mid">{t({ ar: 'من أين وإلى أين؟', en: 'From where to where?' })}</legend>
            <label className="field"><span>{t({ ar: 'مدينة أو ميناء التحميل', en: 'City or port of loading' })}</span><input value={f.origin} onChange={set('origin')} {...inv('origin')} placeholder={t({ ar: 'شنغهاي، الصين', en: 'Shanghai, China' })} /><Err k="origin" /></label>
            <div className="two">
              <label className="field"><span>{t({ ar: 'ميناء الوصول', en: 'Port of entry' })}</span><span className="select"><select value={f.port} onChange={set('port')}>{PORTS.map((p) => <option key={p.id} value={p.id}>{t(p.name)}</option>)}</select><I.Down aria-hidden="true" /></span></label>
              <label className="field"><span>{t({ ar: 'مدينة التسليم', en: 'Delivery city' })}</span><span className="select"><select value={f.city} onChange={set('city')}>{CITIES.map((c) => <option key={c.id} value={c.id}>{t(c.name)}</option>)}</select><I.Down aria-hidden="true" /></span></label>
            </div>
            <p className="fine">{t({ ar: 'لست متأكدًا من الميناء؟ اترك الاختيار ونقترح الأنسب في عرض السعر.', en: 'Not sure about the port? Leave it and we suggest the best one in the quote.' })}</p>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="h-mid">{t({ ar: 'متى، وبأي شروط؟', en: 'When, and on which terms?' })}</legend>
            <label className="field"><span>{t({ ar: 'تاريخ جاهزية البضاعة', en: 'Date the goods are ready' })}</span><input type="date" min={minDate} value={f.ready} onChange={set('ready')} {...inv('ready')} /><Err k="ready" /></label>
            <div className="radios is-terms" role="radiogroup" aria-label={t({ ar: 'شروط التسليم', en: 'Delivery terms' })}>
              {TERMS.map(([k, d]) => <label key={k} className={f.term === k ? 'is-on' : ''}><input type="radio" name="term" value={k} checked={f.term === k} onChange={set('term')} /><b dir="ltr">{k}</b><small>{t(d)}</small></label>)}
            </div>
            <div className="checks">
              <label><input type="checkbox" checked={f.customs} onChange={set('customs')} />{t({ ar: 'التخليص الجمركي وشهادات سابر', en: 'Customs clearance and SABER certificates' })}</label>
              <label><input type="checkbox" checked={f.insurance} onChange={set('insurance')} />{t({ ar: 'تأمين على البضاعة', en: 'Cargo insurance' })}</label>
              <label><input type="checkbox" checked={f.storage} onChange={set('storage')} />{t({ ar: 'تخزين بعد الوصول', en: 'Storage after arrival' })}</label>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="h-mid">{t({ ar: 'إلى من نرسل العرض؟', en: 'Who should we send it to?' })}</legend>
            <div className="two">
              <label className="field"><span>{t({ ar: 'الاسم', en: 'Name' })}</span><input value={f.name} onChange={set('name')} autoComplete="name" {...inv('name')} /><Err k="name" /></label>
              <label className="field"><span>{t({ ar: 'المنشأة', en: 'Company' })}</span><input value={f.company} onChange={set('company')} autoComplete="organization" {...inv('company')} /><Err k="company" /></label>
            </div>
            <div className="two">
              <label className="field"><span>{t({ ar: 'البريد الإلكتروني', en: 'Email' })}</span><input type="email" dir="ltr" value={f.email} onChange={set('email')} autoComplete="email" {...inv('email')} /><Err k="email" /></label>
              <label className="field"><span>{t({ ar: 'الجوال', en: 'Mobile' })}</span><span className="tel" dir="ltr"><b>+966</b><input type="tel" inputMode="numeric" value={f.mobile} onChange={set('mobile')} autoComplete="tel-national" placeholder="5X XXX XXXX" {...inv('mobile')} /></span><Err k="mobile" /></label>
            </div>
            <label className="field"><span>{t({ ar: 'رقم السجل التجاري (اختياري)', en: 'Commercial registration number (optional)' })}</span><input dir="ltr" inputMode="numeric" value={f.cr} onChange={set('cr')} {...inv('cr')} /><Err k="cr" /></label>
            <label className="consent"><input type="checkbox" checked={f.consent} onChange={set('consent')} {...inv('consent')} /><span>{t({ ar: 'أوافق على أن تستخدم درب بياناتي للرد على هذا الطلب فقط، وفق نظام حماية البيانات الشخصية.', en: 'I agree that Darb uses my details only to answer this request, under the Personal Data Protection Law.' })}</span></label>
            <Err k="consent" />
          </fieldset>
        )}

        <div className="qnav">
          {step > 0 && <button type="button" className="btn" onClick={() => { setErrs({}); setStep(step - 1) }}><I.Back /> {t({ ar: 'السابق', en: 'Back' })}</button>}
          <button type="submit" className="btn is-accent">{step < 3 ? <>{t({ ar: 'التالي', en: 'Next' })} <I.Fwd /></> : t({ ar: 'أرسل الطلب', en: 'Send request' })}</button>
        </div>
      </form>
    </div>
  )
}
