import { useState } from 'react'
import { Check, WarningCircle, ArrowRight } from '@phosphor-icons/react'

const TOPICS = ['New trips', 'Every post', 'Monthly digest', 'Budget breakdowns']
const KEY = 'wg-subscribers'
const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)

// Mock only: there is no backend, so sign-ups are kept in this browser's localStorage.
export default function SubscribeForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topics, setTopics] = useState(['New trips'])
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('idle') // idle | sending | done

  const toggle = (t) => setTopics((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))

  const submit = (e) => {
    e.preventDefault()
    if (!isEmail(email.trim())) return setError({ field: 'email', msg: 'Enter an email address like name@example.com.' })
    if (!topics.length) return setError({ field: 'topics', msg: 'Choose at least one type of update.' })
    setError(null)
    setStatus('sending')
    setTimeout(() => {
      try {
        const list = JSON.parse(localStorage.getItem(KEY) || '[]')
        localStorage.setItem(KEY, JSON.stringify([...list, { name, email: email.trim(), topics, at: Date.now() }]))
      } catch { /* storage blocked: still confirm in the mock */ }
      setStatus('done')
    }, 700)
  }

  if (status === 'done')
    return (
      <div className="done" role="status">
        <span className="mark"><Check size={26} weight="bold" /></span>
        <h3>You’re subscribed{name ? `, ${name.trim().split(' ')[0]}` : ''}</h3>
        <p className="muted">We’ll email {email.trim()} when there is something new.</p>
        <button className="btn quiet" onClick={() => { setStatus('idle'); setEmail(''); setName('') }}>Add another email</button>
      </div>
    )

  const emailErr = error?.field === 'email'
  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="sub-name">First name (optional)</label>
        <input id="sub-name" type="text" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="sub-email">Email</label>
        <input
          id="sub-email" type="email" autoComplete="email" inputMode="email" required
          placeholder="name@example.com" value={email}
          aria-invalid={emailErr} aria-describedby={emailErr ? 'sub-email-err' : 'sub-email-help'}
          onChange={(e) => { setEmail(e.target.value); if (emailErr) setError(null) }}
        />
        {emailErr
          ? <p id="sub-email-err" className="error"><WarningCircle size={16} weight="fill" />{error.msg}</p>
          : <p id="sub-email-help" className="help">About two emails a month. Unsubscribe any time.</p>}
      </div>
      <fieldset className="field" aria-describedby={error?.field === 'topics' ? 'sub-topics-err' : undefined}>
        <legend>What should we send you?</legend>
        <div className="choices">
          {TOPICS.map((t) => (
            <label className="choice" key={t}>
              <input type="checkbox" checked={topics.includes(t)} onChange={() => { toggle(t); if (error?.field === 'topics') setError(null) }} />
              <span>{topics.includes(t) && <Check size={14} weight="bold" />}{t}</span>
            </label>
          ))}
        </div>
        {error?.field === 'topics' && <p id="sub-topics-err" className="error"><WarningCircle size={16} weight="fill" />{error.msg}</p>}
      </fieldset>
      <div>
        <button className="btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Subscribing…' : <>Subscribe <ArrowRight size={16} weight="bold" /></>}
        </button>
      </div>
    </form>
  )
}
