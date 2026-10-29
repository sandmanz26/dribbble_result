import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { OFFICES, HOURS, JOBS } from '../data/site.js'
import * as I from '../ui/icons.jsx'

const TOPICS = [
  ['quote', { ar: 'عرض سعر', en: 'A quote' }], ['shipment', { ar: 'شحنة قائمة', en: 'An existing shipment' }], ['customs', { ar: 'التخليص وسابر', en: 'Clearance and SABER' }],
  ['careers', { ar: 'وظيفة', en: 'A job' }], ['other', { ar: 'موضوع آخر', en: 'Something else' }],
]

export default function Contact() {
  const { t } = useLang()
  const q = new URLSearchParams(useLocation().search)
  const role = JOBS.find((j) => j.id === q.get('role'))
  const [f, setF] = useState({ topic: q.get('topic') || 'quote', office: q.get('office') || 'jeddah', name: '', email: '', msg: role ? t({ ar: `أرغب في التقديم على وظيفة ${t(role.title)}.`, en: `I would like to apply for the ${t(role.title)} role.` }) : '' })
  const [errs, setErrs] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const x = {}
    if (f.name.trim().length < 2) x.name = { ar: 'اكتب اسمك.', en: 'Enter your name.' }
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = { ar: 'البريد الإلكتروني غير مكتمل.', en: 'This email address looks incomplete.' }
    if (f.msg.trim().length < 10) x.msg = { ar: 'اكتب رسالتك في سطر على الأقل.', en: 'Write at least a line.' }
    setErrs(x)
    if (Object.keys(x).length) { setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 0); return }
    setSent(true)
  }
  const inv = (k) => ({ 'aria-invalid': !!errs[k], 'aria-describedby': errs[k] ? `${k}-err` : undefined })
  const office = OFFICES.find((o) => o.id === f.office)
  return (
    <div className="page">
      <header className="page-head wrap" data-reveal>
        <h1 className="h-big">{t({ ar: 'تواصل معنا', en: 'Contact' })}</h1>
        <p className="lead">{t({ ar: 'نرد خلال يوم عمل. لشحنة قائمة، اذكر رقمها الذي يبدأ بـ DRB.', en: 'We reply within a working day. For an existing shipment, include its DRB number.' })}</p>
      </header>
      <section className="contact wrap">
        {sent ? (
          <div className="notice is-ok" role="status"><I.Ok aria-hidden="true" /><div><h2>{t({ ar: 'وصلت رسالتك', en: 'Your message is with us' })}</h2><p>{t({ ar: `يرد عليك مكتب ${t(office.city)} خلال يوم عمل.`, en: `The ${t(office.city)} office replies within a working day.` })}</p><button className="link" onClick={() => { setSent(false); setF({ ...f, msg: '' }) }}>{t({ ar: 'رسالة أخرى', en: 'Another message' })}</button></div></div>
        ) : (
          <form className="cform" onSubmit={submit} noValidate>
            <fieldset>
              <legend className="h-small">{t({ ar: 'عن ماذا تكتب؟', en: 'What is it about?' })}</legend>
              <div className="radios">{TOPICS.map(([k, l]) => <label key={k} className={f.topic === k ? 'is-on' : ''}><input type="radio" name="topic" value={k} checked={f.topic === k} onChange={set('topic')} />{t(l)}</label>)}</div>
            </fieldset>
            <div className="two">
              <label className="field"><span>{t({ ar: 'الاسم', en: 'Name' })}</span><input value={f.name} onChange={set('name')} autoComplete="name" {...inv('name')} />{errs.name && <span className="err" id="name-err">{t(errs.name)}</span>}</label>
              <label className="field"><span>{t({ ar: 'البريد الإلكتروني', en: 'Email' })}</span><input type="email" dir="ltr" value={f.email} onChange={set('email')} autoComplete="email" {...inv('email')} />{errs.email && <span className="err" id="email-err">{t(errs.email)}</span>}</label>
            </div>
            <label className="field"><span>{t({ ar: 'المكتب', en: 'Office' })}</span><span className="select"><select value={f.office} onChange={set('office')}>{OFFICES.map((o) => <option key={o.id} value={o.id}>{t(o.city)}</option>)}</select><I.Down aria-hidden="true" /></span></label>
            <label className="field"><span>{t({ ar: 'الرسالة', en: 'Message' })}</span><textarea rows="6" value={f.msg} onChange={set('msg')} {...inv('msg')} />{errs.msg && <span className="err" id="msg-err">{t(errs.msg)}</span>}</label>
            <button className="btn is-accent" type="submit">{t({ ar: 'أرسل', en: 'Send' })} <I.Fwd /></button>
          </form>
        )}
        <aside className="contact-side" data-reveal>
          <h2 className="h-small">{t({ ar: 'المكاتب', en: 'Offices' })}</h2>
          <ul>{OFFICES.map((o) => <li key={o.id}><b>{t(o.city)}</b><span>{t(o.addr)}</span></li>)}</ul>
          <p>{t(HOURS.office)}.</p>
          <p className="fine">{t({ ar: 'العناوين وأرقام التواصل تُضاف من بيانات الشركة.', en: 'Addresses and phone numbers come from the company’s own details.' })}</p>
          <Link to="/track" className="link-arrow">{t({ ar: 'تتبع شحنة', en: 'Track a shipment' })} <I.Fwd /></Link>
        </aside>
      </section>
    </div>
  )
}
