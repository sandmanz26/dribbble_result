import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Mark } from '../ui/kit.jsx'
import { FLAGS } from '../data/library.js'

const GOALS = [
  ['calm', 'Feel calmer', 'Less wound up during the day'],
  ['sleep', 'Sleep better', 'Wind down at night'],
  ['focus', 'Focus', 'A clearer head for work'],
  ['energy', 'More energy', 'Gentler, warmer mornings'],
]

// Onboarding asks only what the ritual needs: a name, one goal, and what herbs must avoid.
export default function Welcome() {
  const { s, set } = useStore()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('calm')
  const [flags, setFlags] = useState([])
  const [none, setNone] = useState(false)
  const [reminder, setReminder] = useState('07:30')

  const finish = () => {
    set({ onboarded: true, name: name.trim() || 'Lena', goal, flags: none ? [] : flags, reminder })
    nav('/check-in', { replace: true })
  }
  const demo = () => { set({ onboarded: true }); nav('/', { replace: true }) }
  const toggle = (id) => { setNone(false); setFlags((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])) }

  if (step === 0) {
    return (
      <div className="welcome">
        <div className="welcome-rings" aria-hidden="true"><span /><span /><span /></div>
        <div className="welcome-copy">
          <Mark size={44} />
          <h1>Tend to yourself, a minute at a time.</h1>
          <p>Tell us how today feels. We shape a short ritual of breath, stillness and a cup of something calming, and explain every choice.</p>
        </div>
        <div className="stackbtn">
          <button className="btn primary" onClick={() => setStep(1)}>Begin</button>
          <button className="btn quiet" onClick={demo}>Look around as Lena</button>
        </div>
      </div>
    )
  }

  return (
    <div className="onb">
      <header className="onb-head">
        <button className="iconbtn" aria-label="Back" onClick={() => setStep(step - 1)}><Icon name="back" /></button>
        <div className="dots" aria-label={`Step ${step} of 4`}>{[1, 2, 3, 4].map((i) => <i key={i} className={i <= step ? 'on' : ''} />)}</div>
        <span className="iconbtn-space" />
      </header>

      {step === 1 && (
        <form className="onb-body" onSubmit={(e) => { e.preventDefault(); setStep(2) }}>
          <h1 className="serif">What should we call you?</h1>
          <label htmlFor="nm" className="sr-only">Your first name</label>
          <input id="nm" className="bigfield" autoFocus placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
          <p className="meta">Only used to greet you. You can stay anonymous.</p>
          <button className="btn primary">Continue</button>
        </form>
      )}

      {step === 2 && (
        <div className="onb-body">
          <h1 className="serif">What would you like more of?</h1>
          <div className="choices" role="radiogroup" aria-label="Your main goal">
            {GOALS.map(([id, l, sub]) => (
              <button key={id} role="radio" aria-checked={goal === id} className={`choice c-${id}`} onClick={() => setGoal(id)}>
                <strong>{l}</strong><span>{sub}</span>
              </button>
            ))}
          </div>
          <button className="btn primary" onClick={() => setStep(3)}>Continue</button>
        </div>
      )}

      {step === 3 && (
        <div className="onb-body">
          <h1 className="serif">Anything herbs should avoid?</h1>
          <p className="meta">Some herbs do not mix with pregnancy, certain medicines or allergies. We use this only to leave those herbs out. It stays on this phone.</p>
          <ul className="flags">
            {FLAGS.map((f) => (
              <li key={f.id}><label className={`flag ${flags.includes(f.id) ? 'on' : ''}`}><input type="checkbox" checked={flags.includes(f.id)} onChange={() => toggle(f.id)} />{f.label}</label></li>
            ))}
            <li><label className={`flag ${none ? 'on' : ''}`}><input type="checkbox" checked={none} onChange={(e) => { setNone(e.target.checked); if (e.target.checked) setFlags([]) }} />None of these</label></li>
          </ul>
          <button className="btn primary" disabled={!none && flags.length === 0} onClick={() => setStep(4)}>Continue</button>
        </div>
      )}

      {step === 4 && (
        <div className="onb-body">
          <h1 className="serif">When should we remind you?</h1>
          <p className="meta">One gentle nudge a day. No streak alarms.</p>
          <label htmlFor="rm" className="sr-only">Reminder time</label>
          <input id="rm" type="time" className="bigfield" value={reminder} onChange={(e) => setReminder(e.target.value)} />
          <p className="note"><Icon name="shield" /> Tend is for everyday wellbeing. It is not medical advice and does not replace care from a professional.</p>
          <button className="btn primary" onClick={finish}>Do my first check-in</button>
        </div>
      )}
    </div>
  )
}
