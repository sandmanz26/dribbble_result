import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiArrowBack, BiRightArrowAlt } from 'react-icons/bi'
import { useStore } from '../store.jsx'
import { Button, Frame, IconButton } from '../ui/kit.jsx'

const who = [
  { v: 'crew', t: 'Crew', d: 'Camera, lighting, grip, art, sound, hair and make-up' },
  { v: 'creative', t: 'Cast and creatives', d: 'Actors, directors, writers, editors, composers' },
  { v: 'production', t: 'Production', d: 'Producers, line producers, coordinators, ADs' },
]
const depts = ['Lighting', 'Camera', 'Grip', 'Art', 'Sound', 'Costume', 'Hair and make-up', 'Locations', 'Post']
const words = ['Call', 'Hold', 'Crew', 'Wrap']

export default function Welcome() {
  const nav = useNavigate()
  const { set } = useStore()
  const [step, setStep] = useState(0)
  const [kind, setKind] = useState('crew')
  const [dept, setDept] = useState(['Lighting'])
  const [w, setW] = useState(0)

  useEffect(() => {
    if (step !== 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setW((x) => (x + 1) % words.length), 1400)
    return () => clearInterval(t)
  }, [step])

  const finish = (as = kind === 'production' ? 'production' : 'crew') => {
    set({ onboarded: true, as })
    nav(as === 'production' ? '/crew' : '/')
  }

  if (step === 0) {
    return (
      <div className="welcome">
        <Frame name="set-warehouse" alt="A crew lighting a set inside a warehouse" burn="A001_C014 / ROLLING" tc="01:04:22:16" className="welcome__frame" />
        <div className="welcome__body">
          <p className="wordmark"><i className="live" aria-hidden="true" />Rolling</p>
          <h1 className="welcome__h">
            <span className="sr-only">Call, hold, crew, wrap. </span>
            <span className="welcome__word" aria-hidden="true" key={w}>{words[w]}.</span>
            <span className="welcome__rest">Your working day in film and TV, from first pencil to wrap.</span>
          </h1>
          <Button variant="green" className="btn--block" iconEnd={BiRightArrowAlt} onClick={() => setStep(1)}>Get started</Button>
          <button className="textbtn textbtn--center" onClick={() => finish('crew')}>Look around as Mara, a gaffer</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page onboard">
      <header className="mast mast--back">
        <IconButton icon={BiArrowBack} label="Back" onClick={() => setStep(step - 1)} />
        <p className="mono small">{step} / 2</p>
      </header>
      {step === 1 && (
        <>
          <h1 className="display">What do you do?</h1>
          <ol className="pick" role="radiogroup" aria-label="What do you do">
            {who.map((x, i) => (
              <li key={x.v}>
                <button role="radio" aria-checked={kind === x.v} className="pick__opt" onClick={() => setKind(x.v)}>
                  <span className="mono pick__no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="pick__t">{x.t}</span>
                  <span className="row__s small">{x.d}</span>
                </button>
              </li>
            ))}
          </ol>
          <Button variant="green" className="btn--block" onClick={() => (kind === 'production' ? finish('production') : setStep(2))}>Continue</Button>
        </>
      )}
      {step === 2 && (
        <>
          <h1 className="display">{kind === 'creative' ? 'Your craft' : 'Your department'}</h1>
          <p className="mast__sub">Calls from these come first. Pick as many as you like.</p>
          <div className="depts depts--wrap">
            {depts.map((d) => (
              <button key={d} className="dept" aria-pressed={dept.includes(d)} onClick={() => setDept(dept.includes(d) ? dept.filter((x) => x !== d) : [...dept, d])}>{d}</button>
            ))}
          </div>
          <Button variant="green" className="btn--block" disabled={!dept.length} onClick={() => finish('crew')}>Show me today</Button>
          <p className="row__s small">The prototype continues as Mara, a gaffer on a feature film.</p>
        </>
      )}
    </div>
  )
}
