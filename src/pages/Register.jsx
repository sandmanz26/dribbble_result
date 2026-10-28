import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Checkmark, CheckmarkFilled, Document, Upload, Warning } from '@carbon/icons-react'
import { useStore } from '../store.jsx'
import { AuthSide, CODE } from './Login.jsx'

// Sign-up in four steps: the account, the person, an experience check, and identity.
// The experience check is the kind brokers are usually required to run; a wrong answer is
// explained, never blocked, and the account then shows extra risk notes.
const STEPS = ['Account', 'About you', 'Experience', 'Identity']
const COUNTRIES = ['Germany', 'Spain', 'France', 'Italy', 'Poland', 'Portugal', 'Sweden', 'Japan', 'Singapore', 'South Africa', 'Brazil', 'Other']
const RULES = [
  [(p) => p.length >= 10, 'At least 10 characters'],
  [(p) => /\d/.test(p), 'A number'],
  [(p) => /[A-Za-z]/.test(p) && /[^A-Za-z0-9]/.test(p), 'A letter and a symbol'],
]
const age = (iso) => {
  const d = new Date(iso)
  if (Number.isNaN(+d)) return 0
  const now = new Date('2026-10-28')
  return now.getFullYear() - d.getFullYear() - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0)
}

export default function Register() {
  const { set } = useStore()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [f, setF] = useState({ email: '', password: '', country: 'Germany', terms: false, first: '', last: '', dob: '', address: '', exp: '', lev: '', amount: '', doc: null, selfie: false })
  const [errs, setErrs] = useState({})
  const up = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const check = () => {
    const e = {}
    if (step === 0) {
      if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter an email address like name@example.com.'
      if (!RULES.every(([t]) => t(f.password))) e.password = 'The password needs all three items below.'
      if (!f.terms) e.terms = 'Please accept the client agreement to continue.'
    }
    if (step === 1) {
      if (!f.first.trim()) e.first = 'Enter your first name as it appears on your ID.'
      if (!f.last.trim()) e.last = 'Enter your last name as it appears on your ID.'
      if (!f.dob) e.dob = 'Enter your date of birth.'
      else if (age(f.dob) < 18) e.dob = 'You need to be 18 or older to open an account.'
      if (f.address.trim().length < 8) e.address = 'Enter your home address. We match it against your proof of address.'
    }
    if (step === 2) {
      if (!f.exp) e.exp = 'Choose one.'
      if (!f.lev) e.lev = 'Choose one.'
      if (!f.amount) e.amount = 'Choose one.'
    }
    if (step === 3) {
      if (!f.doc) e.doc = 'Add a photo of your passport or ID card.'
      if (!f.selfie) e.selfie = 'Take the selfie check so we can match it to your document.'
    }
    setErrs(e)
    return Object.keys(e).length === 0
  }
  const next = (e) => {
    e.preventDefault()
    if (!check()) return
    if (step < 3) { setStep(step + 1); window.scrollTo(0, 0); return }
    set({ signup: { email: f.email.trim(), password: f.password, name: `${f.first.trim()} ${f.last.trim()}`, country: f.country, extraRisk: f.lev !== 'lose' }, who: 'new' })
    setStep(4)
  }
  const field = (k, label, props = {}, hint) => (
    <label className={`afield ${errs[k] ? 'bad' : ''}`}>{label}<input value={f[k]} onChange={up(k)} aria-invalid={!!errs[k]} {...props} />
      {errs[k] ? <span className="err">{errs[k]}</span> : hint && <span className="hint">{hint}</span>}
    </label>
  )
  const radio = (k, q, opts) => (
    <fieldset className="choice-list" style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="qlabel" style={{ marginBottom: 8 }}>{q}</legend>
      {opts.map(([v, l]) => <label key={v}><input type="radio" name={k} value={v} checked={f[k] === v} onChange={up(k)} />{l}</label>)}
      {errs[k] && <span className="err" style={{ color: 'var(--neg)', fontSize: 13 }}>{errs[k]}</span>}
    </fieldset>
  )

  if (step === 4) {
    return (
      <div className="auth">
        <AuthSide line="Your account is open. A person checks your documents next." />
        <main className="auth-main">
          <div className="auth-form">
            <CheckmarkFilled size={32} style={{ color: 'var(--accent)' }} />
            <h1>Thanks, {f.first.trim()}.</h1>
            <p>We are checking your documents. Most checks are done within one business day, and we will email {f.email.trim()} when yours is. You can log in and look around now; deposits open once you are verified.</p>
            {f.lev !== 'lose' && <p className="notice"><Warning size={16} />One of your answers suggests leverage is new to you. Your account will show a short note on margin before your first trade.</p>}
            <div className="row-btns">
              <button className="btn gold" onClick={() => nav('/login')}>Log in</button>
              <Link to="/" className="abtn quiet">Back to the website</Link>
            </div>
            <p className="muted" style={{ fontSize: 13 }}>Prototype: log in with the email and password you just chose. The second step asks for the code {CODE}.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="auth">
      <AuthSide line="Opening an account takes about five minutes. Have your passport or ID card ready." />
      <main className="auth-main">
        <form className="auth-form" onSubmit={next} noValidate>
          <div className="steps-bar" aria-label={`Step ${step + 1} of 4: ${STEPS[step]}`}>{STEPS.map((s, i) => <span key={s} className={i <= step ? 'on' : ''}>{s}</span>)}</div>
          {step === 0 && (
            <>
              <h1>Create your account</h1>
              {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
              <label className={`afield ${errs.password ? 'bad' : ''}`}>Password<input type="password" autoComplete="new-password" value={f.password} onChange={up('password')} aria-describedby="pwrules" />
                {errs.password && <span className="err">{errs.password}</span>}
              </label>
              <ul className="checks" id="pwrules">{RULES.map(([t, l]) => <li key={l} className={t(f.password) ? 'ok' : ''}><Checkmark size={14} />{l}</li>)}</ul>
              <label className="afield">Country you live in<select value={f.country} onChange={up('country')}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select><span className="hint">Leverage limits and some products depend on your country.</span></label>
              <label className="choice-list"><span style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15 }}><input type="checkbox" checked={f.terms} onChange={up('terms')} /> I have read the client agreement and the risk disclosure.</span></label>
              {errs.terms && <span className="err" style={{ color: 'var(--neg)', fontSize: 13 }}>{errs.terms}</span>}
            </>
          )}
          {step === 1 && (
            <>
              <h1>About you</h1>
              {field('first', 'First name', { autoComplete: 'given-name' })}
              {field('last', 'Last name', { autoComplete: 'family-name' })}
              {field('dob', 'Date of birth', { type: 'date', max: '2026-10-28' })}
              {field('address', 'Home address', { autoComplete: 'street-address' }, 'The address on your bill or bank statement.')}
            </>
          )}
          {step === 2 && (
            <>
              <h1>Your experience</h1>
              <p>Three questions so we can show the right warnings. There is no wrong way to answer the first and last.</p>
              {radio('exp', 'Have you traded forex, metals or crypto before?', [['none', 'No, never'], ['some', 'A few times in the last year'], ['often', 'Regularly, for more than a year']])}
              {radio('lev', 'You open a $10,000 position with $500 of your money. The price falls 5%. What happens?', [['lose', 'I lose about $500, all of the money I put in'], ['small', 'I lose about $25, which is 5% of my $500'], ['none', 'Nothing, until I close the trade']])}
              {f.lev && f.lev !== 'lose' && <p className="notice"><Warning size={16} />Close, but on margin you gain or lose on the full $10,000. A 5% fall is $500, all of the money you put in. That is why we show the margin you use on every trade.</p>}
              {radio('amount', 'How much do you plan to deposit in your first month?', [['low', 'Under $500'], ['mid', '$500 to $5,000'], ['high', 'More than $5,000']])}
            </>
          )}
          {step === 3 && (
            <>
              <h1>Show us it is you</h1>
              <p>We match your document and a selfie. Photos are used only for this check.</p>
              <label className="filedrop" style={{ position: 'relative' }}>
                <input type="file" accept="image/*,.pdf" onChange={(e) => setF({ ...f, doc: e.target.files[0]?.name || null })} />
                {f.doc ? <Document size={20} /> : <Upload size={20} />}
                <span>{f.doc ? <><b>{f.doc}</b> added. Tap to change.</> : <><b>Passport or ID card.</b> A clear photo of the page with your picture.</>}</span>
              </label>
              {!f.doc && <button type="button" className="abtn quiet" style={{ justifySelf: 'start' }} onClick={() => setF({ ...f, doc: 'passport-sample.jpg' })}>Use a sample document for this demo</button>}
              {errs.doc && <span className="err" style={{ color: 'var(--neg)', fontSize: 13 }}>{errs.doc}</span>}
              <div className="filedrop">
                {f.selfie ? <CheckmarkFilled size={20} style={{ color: 'var(--pos)' }} /> : <Upload size={20} />}
                <span>{f.selfie ? <b>Selfie taken.</b> : <><b>Selfie check.</b> Look at the camera and turn your head slowly.</>}</span>
                {!f.selfie && <button type="button" className="abtn" style={{ marginLeft: 'auto' }} onClick={() => setF({ ...f, selfie: true })}>Start</button>}
              </div>
              {errs.selfie && <span className="err" style={{ color: 'var(--neg)', fontSize: 13 }}>{errs.selfie}</span>}
            </>
          )}
          <div className="row-btns">
            <button className="btn gold">{step < 3 ? 'Continue' : 'Send for checking'}</button>
            {step > 0 ? <button type="button" className="abtn quiet" onClick={() => { setErrs({}); setStep(step - 1) }}>Back</button> : <Link to="/login" className="abtn quiet">I already have an account</Link>}
          </div>
        </form>
      </main>
    </div>
  )
}
