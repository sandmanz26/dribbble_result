import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiArrowBack, BiRightArrowAlt } from 'react-icons/bi'
import { useStore } from '../store.jsx'
import { Button, IconButton, Photo } from '../ui/kit.jsx'

const who = [
  { v: 'crew', t: 'I work on crews', d: 'Camera, lighting, grip, art, sound, hair and make-up' },
  { v: 'creative', t: 'I am cast or a creative', d: 'Actors, directors, writers, editors, composers' },
  { v: 'production', t: 'I run productions', d: 'Producers, line producers, coordinators, ADs' },
]
const depts = ['Lighting', 'Camera', 'Grip', 'Art', 'Sound', 'Costume', 'Hair and make-up', 'Locations', 'Post']

export default function Welcome() {
  const nav = useNavigate()
  const { set } = useStore()
  const [step, setStep] = useState(0)
  const [kind, setKind] = useState('crew')
  const [dept, setDept] = useState(['Lighting'])

  const finish = (as = kind === 'production' ? 'production' : 'crew') => {
    set({ onboarded: true, as })
    nav(as === 'production' ? '/crew' : '/')
  }

  if (step === 0) {
    return (
      <div className="welcome">
        <Photo name="set-warehouse" className="welcome__img" alt="A crew lighting a set inside a warehouse" />
        <div className="welcome__body">
          <p className="wordmark"><span className="wordmark__dot" aria-hidden="true" />Rolling</p>
          <h1 className="display">Your next call, your holds and the crew you trust.</h1>
          <p className="muted">For the people who make film and TV, from first pencil to wrap.</p>
          <Button className="btn--block" iconEnd={BiRightArrowAlt} onClick={() => setStep(1)}>Get started</Button>
          <button className="link link--center" onClick={() => finish('crew')}>Look around as Mara, a gaffer</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page onboard">
      <header className="top top--back">
        <IconButton icon={BiArrowBack} label="Back" onClick={() => setStep(step - 1)} />
        <p className="small muted mono">{step} / 2</p>
      </header>
      {step === 1 && (
        <>
          <h1 className="h1">What do you do?</h1>
          <div className="pick" role="radiogroup" aria-label="What do you do">
            {who.map((w) => (
              <button key={w.v} role="radio" aria-checked={kind === w.v} className="pick__opt" onClick={() => setKind(w.v)}>
                <span className="pick__t">{w.t}</span>
                <span className="small muted">{w.d}</span>
              </button>
            ))}
          </div>
          <Button className="btn--block" onClick={() => (kind === 'production' ? finish('production') : setStep(2))}>Continue</Button>
        </>
      )}
      {step === 2 && (
        <>
          <h1 className="h1">{kind === 'creative' ? 'What is your craft?' : 'Which department?'}</h1>
          <p className="muted">Calls from these come first. Pick as many as you like.</p>
          <div className="chips">
            {depts.map((d) => (
              <button key={d} className="chip" aria-pressed={dept.includes(d)} onClick={() => setDept(dept.includes(d) ? dept.filter((x) => x !== d) : [...dept, d])}>{d}</button>
            ))}
          </div>
          <Button className="btn--block" disabled={!dept.length} onClick={() => finish('crew')}>Show me today</Button>
          <p className="small muted">The prototype continues as Mara, a gaffer on a feature film.</p>
        </>
      )}
    </div>
  )
}
