import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Locked, Warning } from '@carbon/icons-react'
import { useStore } from '../store.jsx'
import Sessions from '../ui/Sessions.jsx'

// Demo accounts. Nothing is sent anywhere: the check runs in the browser.
export const DEMO = {
  client: { email: 'sofia.brandt@example.com', password: 'demo-trader-2026' },
  staff: { email: 'k.asante@globaltrade.example', password: 'demo-staff-2026' },
}
export const CODE = '482913'
const MAX_TRIES = 5

export function AuthSide({ line }) {
  return (
    <aside className="auth-side">
      <Link to="/" className="brand">GlobalTrade</Link>
      <p className="auth-line">{line}</p>
      <Sessions compact />
    </aside>
  )
}

export default function Login() {
  const { s, set } = useStore()
  const nav = useNavigate()
  const [q] = useSearchParams()
  const [step, setStep] = useState('password')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [who, setWho] = useState(null)
  const [tries, setTries] = useState(0)
  const [err, setErr] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const boxes = useRef([])
  useEffect(() => { if (step === 'code') boxes.current[0]?.focus() }, [step])

  const accounts = [
    ...Object.entries(DEMO).map(([k, v]) => ({ ...v, kind: k })),
    ...(s.signup ? [{ email: s.signup.email, password: s.signup.password, kind: 'new' }] : []),
  ]
  const first = q.get('as') === 'staff' ? 'staff' : 'client'
  const other = first === 'staff' ? 'client' : 'staff'
  const fill = (k) => { setEmail(DEMO[k].email); setPw(DEMO[k].password); setErr('') }
  const locked = tries >= MAX_TRIES

  const submit = (e) => {
    e.preventDefault()
    if (locked) return
    if (!email.trim() || !pw) { setErr('Enter your email and password.'); return }
    const acc = accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === pw)
    if (!acc) {
      const t = tries + 1
      setTries(t)
      setErr(t >= MAX_TRIES ? 'Too many attempts. For your safety, sign-in is paused for 15 minutes.' : `That email and password do not match. ${MAX_TRIES - t} ${MAX_TRIES - t === 1 ? 'try' : 'tries'} left before a 15-minute pause.`)
      return
    }
    setErr('')
    setWho(acc)
    setStep('code')
  }
  const typeDigit = (i, v) => {
    const d = v.replace(/\D/g, '')
    if (d.length > 1) {
      const all = d.slice(0, 6).split('')
      setCode([...all, ...Array(6 - all.length).fill('')])
      boxes.current[Math.min(all.length, 5)]?.focus()
      return
    }
    const next = [...code]
    next[i] = d
    setCode(next)
    if (d && i < 5) boxes.current[i + 1]?.focus()
  }
  const verify = (e) => {
    e.preventDefault()
    if (code.join('') !== CODE) { setErr('That code is not right. Check the newest code in your authenticator app.'); return }
    const session = who.kind === 'staff' ? 'staff' : 'client'
    set({ session, who: who.kind === 'new' ? 'new' : 'demo' })
    nav(session === 'staff' ? '/staff' : '/client', { replace: true })
  }

  return (
    <div className="auth">
      <AuthSide line="Log in to see your balance, your trades and the status of every payment." />
      <main className="auth-main">
        {step === 'password' ? (
          <form className="auth-form" onSubmit={submit} noValidate>
            <h1>Log in</h1>
            <label className={`afield ${err && !locked ? 'bad' : ''}`}>Email<input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label className={`afield ${err && !locked ? 'bad' : ''}`}>Password<input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} /></label>
            {err && <p className="notice" role="alert"><Warning size={16} />{err}</p>}
            <button className="btn gold" disabled={locked}>Continue</button>
            <p className="muted">New here? <Link to="/register">Open an account</Link></p>
            <div className="demo-creds">
              <span><b>Demo accounts for this prototype.</b> The second step asks for the code <b className="num">{CODE}</b>.</span>
              <button type="button" onClick={() => fill(first)}>Fill in the {first} account</button>
              <button type="button" onClick={() => fill(other)}>Fill in the {other} account</button>
              {s.signup && <span>Or use the account you created: {s.signup.email}</span>}
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={verify}>
            <h1>Enter your code</h1>
            <p>Open your authenticator app and type the six digits shown for GlobalTrade.</p>
            <div className="code-inputs" role="group" aria-label="Six-digit code">
              {code.map((d, i) => (
                <input key={i} ref={(el) => (boxes.current[i] = el)} inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'} aria-label={`Digit ${i + 1}`} value={d}
                  onChange={(e) => typeDigit(i, e.target.value)} onKeyDown={(e) => e.key === 'Backspace' && !d && i > 0 && boxes.current[i - 1]?.focus()} />
              ))}
            </div>
            {err && <p className="notice" role="alert"><Warning size={16} />{err}</p>}
            <button className="btn gold" disabled={code.join('').length < 6}><Locked size={16} /> Log in</button>
            <button type="button" className="abtn quiet" onClick={() => { setStep('password'); setCode(['', '', '', '', '', '']); setErr('') }}>Use a different account</button>
          </form>
        )}
      </main>
    </div>
  )
}
