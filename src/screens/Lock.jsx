import { useState } from 'react'
import { Lock1 } from 'iconsax-react'
import { useStore } from '../store.jsx'
import { DEMO_PIN } from '../data/school.js'

// Student records stay behind a PIN whenever the phone is put down.
export default function Lock() {
  const { dispatch, user, brand, log } = useStore()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const press = (d) => {
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    setError('')
    if (next.length === 4) {
      setTimeout(() => {
        if (next === DEMO_PIN) { dispatch({ type: 'set', patch: { locked: false } }); log({ action: 'Unlocked', target: 'App', detail: 'PIN' }) }
        else { setError('That PIN is not right. Try again.'); setPin('') }
      }, 160)
    }
  }

  return (
    <div className="lock">
      <div className="lock-top">
        <span className="crest crest-lg">{brand.crest}</span>
        <h1>Welcome back, {user.first}</h1>
        <p>{brand.name} records are locked. Enter your PIN.</p>
      </div>
      <div className={`pin-dots ${error ? 'is-error' : ''}`} aria-label={`${pin.length} of 4 digits entered`}>
        {[0, 1, 2, 3].map((i) => <span key={i} className={i < pin.length ? 'is-on' : ''} />)}
      </div>
      <p className="lock-error" role="alert">{error || ' '}</p>
      <div className="keypad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => <button key={d} onClick={() => press(d)}>{d}</button>)}
        <span />
        <button onClick={() => press('0')}>0</button>
        <button onClick={() => setPin(pin.slice(0, -1))} aria-label="Delete">Del</button>
      </div>
      <p className="lock-hint"><Lock1 size={14} color="currentColor" /> Demo PIN {DEMO_PIN}. Locks after 5 minutes away.</p>
    </div>
  )
}
