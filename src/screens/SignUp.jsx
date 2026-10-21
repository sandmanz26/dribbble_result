import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { IconCamera, IconSearch, IconAlertCircleFilled, IconEye, IconEyeOff } from '@tabler/icons-react'
import { TopBar } from '../components/ui.jsx'
import { useStore } from '../app/store.jsx'
import { CATEGORIES } from '../data/creators.js'

const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)

// Two short steps: who you are (role), then account details.
// Creators also pick a specialty and area so they appear in search.
export default function SignUp() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/'
  const { signUp, user } = useStore()
  const [step, setStep] = useState(0)
  const [role, setRole] = useState('client')
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '', specialty: 'portrait', area: '' })
  const [errors, setErrors] = useState({})
  const [show, setShow] = useState(false)
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setErrors({ ...errors, [k]: null }) }

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (form.name.trim().length < 2) errs.name = 'Enter your full name.'
    if (!isEmail(form.email.trim())) errs.email = 'Enter an email like name@example.com.'
    if (form.password.length < 8) errs.password = 'Use at least 8 characters.'
    if (role === 'creator' && !form.area.trim()) errs.area = 'Tell clients where you’re based.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    signUp({ name: form.name.trim(), email: form.email.trim(), role, specialty: role === 'creator' ? form.specialty : null, area: form.area.trim() || null })
    nav(role === 'creator' ? '/studio' : next, { replace: true })
  }

  const Err = ({ k }) => errors[k] ? <p className="err" id={`${k}-err`}><IconAlertCircleFilled size={15} />{errors[k]}</p> : null

  return (
    <div className="screen has-cta">
      <TopBar title={step ? 'Your details' : 'Create an account'} />
      <div className="steps" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 4 }}><i className="on" /><i className={step ? 'on' : ''} /></div>

      {step === 0 ? (
        <div className="pad" style={{ display: 'grid', gap: 12, marginTop: 28 }}>
          <h1 style={{ marginBottom: 12 }}>How will you use Proof?</h1>
          <div role="radiogroup" aria-label="Account type" style={{ display: 'grid', gap: 10 }}>
            <button className="role" role="radio" aria-checked={role === 'client'} onClick={() => setRole('client')}>
              <span className="ico"><IconSearch size={22} stroke={1.6} /></span>
              <span><h3>I want to hire</h3><span className="muted small">Find and book a photographer or videographer.</span></span>
            </button>
            <button className="role" role="radio" aria-checked={role === 'creator'} onClick={() => setRole('creator')}>
              <span className="ico"><IconCamera size={22} stroke={1.6} /></span>
              <span><h3>I’m a creator</h3><span className="muted small">Show your portfolio and get booked.</span></span>
            </button>
          </div>
          <div className="cta-bar"><button className="btn block" onClick={() => setStep(1)}>Continue</button></div>
        </div>
      ) : (
        <form className="pad" onSubmit={submit} noValidate style={{ display: 'grid', gap: 18, marginTop: 28 }}>
          <div className="field">
            <label htmlFor="su-name">Full name</label>
            <input id="su-name" className="input" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
            <Err k="name" />
          </div>
          <div className="field">
            <label htmlFor="su-email">Email</label>
            <input id="su-email" className="input" type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
            <Err k="email" />
          </div>
          <div className="field">
            <label htmlFor="su-pass">Password</label>
            <div style={{ position: 'relative' }}>
              <input id="su-pass" className="input" type={show ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={set('password')} aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-err' : 'pass-help'} style={{ paddingRight: 52 }} />
              <button type="button" className="icon-btn" style={{ position: 'absolute', right: 4, top: 4 }} onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <IconEyeOff size={20} stroke={1.6} /> : <IconEye size={20} stroke={1.6} />}
              </button>
            </div>
            {errors.password ? <Err k="password" /> : <p className="help" id="pass-help">At least 8 characters.</p>}
          </div>
          {role === 'creator' && (
            <>
              <div className="field">
                <label htmlFor="su-spec">Main specialty</label>
                <select id="su-spec" className="input" value={form.specialty} onChange={set('specialty')}>
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="su-area">Where are you based?</label>
                <input id="su-area" className="input" placeholder="e.g. Brixton" value={form.area} onChange={set('area')} aria-invalid={!!errors.area} aria-describedby={errors.area ? 'area-err' : undefined} />
                <Err k="area" />
              </div>
            </>
          )}
          <p className="help">By continuing you agree to the Terms and Privacy Policy.</p>
          <div className="cta-bar"><button className="btn block" type="submit">Create account</button></div>
        </form>
      )}
    </div>
  )
}
