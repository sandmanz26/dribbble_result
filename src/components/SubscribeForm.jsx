import { useState } from 'react'
import { allPosts } from '../data/trips.js'

const INTERESTS = ['New trip announced', 'Every blog post', 'Monthly digest', 'Budget notes']
const KEY = 'wanderlog.subscribers'
const valid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)

export default function SubscribeForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [picks, setPicks] = useState(['New trip announced'])
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)

  const toggle = (o) => setPicks((p) => (p.includes(o) ? p.filter((x) => x !== o) : [...p, o]))

  const submit = (e) => {
    e.preventDefault()
    if (!valid(email.trim())) return setErr('That email doesn’t look right — try name@example.com')
    if (!picks.length) return setErr('Pick at least one thing you’d like to hear about.')
    // Mock persistence: no backend, so just keep it in this browser.
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || '[]')
      localStorage.setItem(KEY, JSON.stringify([...list, { name, email, picks, at: Date.now() }]))
    } catch { /* storage unavailable — still show success in the mock */ }
    setErr('')
    setDone(true)
  }

  if (done)
    return (
      <div className="sub-form" role="status">
        <div className="success">
          <div className="big">✉</div>
          <h3>You’re on the list{name ? `, ${name.split(' ')[0]}` : ''}!</h3>
          <p className="fine">A postcard is on its way to {email}. Until then, there are {allPosts().length} journal entries waiting for you.</p>
          <button className="btn ghost sm" onClick={() => { setDone(false); setEmail(''); setName('') }}>Subscribe another email</button>
        </div>
      </div>
    )

  return (
    <form className="sub-form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="sub-name">First name <span style={{ opacity: .6 }}>(optional)</span></label>
        <input id="sub-name" type="text" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex" />
      </div>
      <div className="field">
        <label htmlFor="sub-email">Email</label>
        <input id="sub-email" type="email" autoComplete="email" required value={email} aria-invalid={!!err && !valid(email.trim())} aria-describedby={err ? 'sub-err' : undefined}
          onChange={(e) => { setEmail(e.target.value); if (err) setErr('') }} placeholder="you@example.com" />
      </div>
      <fieldset className="field">
        <legend>Send me</legend>
        <div className="opts">
          {INTERESTS.map((o) => (
            <label className="opt" key={o}>
              <input type="checkbox" checked={picks.includes(o)} onChange={() => toggle(o)} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {err && <p id="sub-err" className="field err" role="alert" style={{ color: '#b3261e', fontWeight: 500 }}>{err}</p>}
      <button className="btn" type="submit">Send me postcards ✦</button>
      <p className="fine">About two emails a month. Unsubscribe in one click, always.</p>
    </form>
  )
}
