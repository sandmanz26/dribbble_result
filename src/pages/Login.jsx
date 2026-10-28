import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Locked, Warning } from '@carbon/icons-react'
import { useStore } from '../store.jsx'
import Sessions from '../ui/Sessions.jsx'

// Demo accounts. Nothing is sent anywhere: the check runs in the browser.
export const DEMO = {
  client: { email: 'sofia.brandt@example.com' },
  staff: { email: 'k.asante@globaltrade.example' },
}
export const CODE = '482913'

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
  const [step, setStep] = useState('pick')
  const [who, setWho] = useState(null)
  const [err, setErr] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const boxes = useRef([])
  useEffect(() => { if (step === 'code') boxes.current[0]?.focus() }, [step])

  // Design prototype: no email or password is typed anywhere. A reviewer picks a demo account,
  // then sees the second step with the demo code.
  const accounts = [
    { kind: 'client', label: 'Demo client', sub: DEMO.client.email },
    { kind: 'staff', label: 'Demo staff member', sub: DEMO.staff.email },
    ...(s.signup ? [{ kind: 'new', label: s.signup.name || 'The account you created', sub: s.signup.email }] : []),
  ]
  const first = q.get('as') === 'staff' ? 'staff' : 'client'
  const ordered = [...accounts].sort((a, b) => (a.kind === first ? -1 : b.kind === first ? 1 : 0))
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
    if (code.join('') !== CODE) { setErr(`That code is not right. In this prototype the code is ${CODE}.`); return }
    const session = who.kind === 'staff' ? 'staff' : 'client'
    set({ session, who: who.kind === 'new' ? 'new' : 'demo' })
    nav(session === 'staff' ? '/staff' : '/client', { replace: true })
  }

  return (
    <div className="auth">
      <AuthSide line="Log in to see your balance, your trades and the status of every payment." />
      <main className="auth-main">
        {step === 'pick' ? (
          <div className="auth-form">
            <h1>Log in</h1>
            <p className="proto-note">This is a design prototype, not a real broker. Nothing is typed here: choose a demo account. The live product signs in with email, password and an authenticator code.</p>
            <div className="demo-pick">
              {ordered.map((a) => (
                <button key={a.kind} type="button" className="demo-acct" onClick={() => { setWho(a); setStep('code'); setErr('') }}>
                  <b>{a.label}</b><span>{a.sub}</span>
                </button>
              ))}
            </div>
            <p className="muted">New here? <Link to="/register">See the account opening flow</Link></p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={verify}>
            <h1>Enter your code</h1>
            <p>The second step asks for six digits from an authenticator app. In this prototype the code is <b className="num">{CODE}</b>.</p>
            <div className="code-inputs" role="group" aria-label="Six-digit code">
              {code.map((d, i) => (
                <input key={i} ref={(el) => (boxes.current[i] = el)} inputMode="numeric" autoComplete="off" aria-label={`Digit ${i + 1}`} value={d}
                  onChange={(e) => typeDigit(i, e.target.value)} onKeyDown={(e) => e.key === 'Backspace' && !d && i > 0 && boxes.current[i - 1]?.focus()} />
              ))}
            </div>
            {err && <p className="notice" role="alert"><Warning size={16} />{err}</p>}
            <button type="button" className="abtn quiet" onClick={() => setCode(CODE.split(''))}>Fill in the demo code</button>
            <button className="btn gold" disabled={code.join('').length < 6}><Locked size={16} /> Log in</button>
            <button type="button" className="abtn quiet" onClick={() => { setStep('pick'); setCode(['', '', '', '', '', '']); setErr('') }}>Choose another demo account</button>
          </form>
        )}
      </main>
    </div>
  )
}
