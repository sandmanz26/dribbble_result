import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Back } from '../ui/kit.jsx'
import { Print } from '../ui/Print.jsx'
import { MOODS } from '../data/library.js'
import { buildRitual } from '../data/ritual.js'
import { TODAY, daySeed } from '../data/history.js'

// The check-in exposes today's print. One question at a time, answered with a tap: the weather
// sets the depth of the blue, and the herb the answers point to appears on the sheet as you go.
const Q = [
  { id: 'mood', ask: (n, t) => `${t === 'evening' ? 'Evening' : 'Morning'}, ${n}. What’s today’s weather?` },
  { id: 'sleep', ask: () => 'How long did you sleep last night?' },
  { id: 'energy', ask: () => 'And your energy right now?' },
  { id: 'stress', ask: () => 'How much is on your mind?' },
  { id: 'minutes', ask: () => 'How much time do you have?' },
]
const ENERGY = ['Empty', 'Low', 'Okay', 'Good', 'Full']
const STRESS = ['Nothing', 'A little', 'Some', 'A lot', 'Too much']
const DEFAULTS = { sleep: 7, energy: 3, stress: 2, minutes: 10 }

export default function CheckIn() {
  const { s, set } = useStore()
  const nav = useNavigate()
  const loc = useLocation()
  const preset = loc.state?.mood
  const [a, setA] = useState(preset ? { mood: preset } : {})
  const [sleep, setSleep] = useState(7)
  const [printing, setPrinting] = useState(false)
  const at = Q.findIndex((q) => a[q.id] === undefined)
  const finished = at === -1
  const ctx = { goal: s.goal, time: s.time }
  const ritual = a.mood ? buildRitual({ ...DEFAULTS, ...a, ...ctx }, s.flags) : null
  const herb = ritual?.steps.find((st) => st.kind === 'herb').id

  const answer = (id, v) => {
    const next = { ...a, [id]: v }
    setA(next)
    if (Q.every((q) => next[q.id] !== undefined)) {
      setPrinting(true)
      setTimeout(() => setPrinting(false), 1200)
    }
  }
  const back = () => {
    const last = [...Q].reverse().find((q) => a[q.id] !== undefined)
    if (!last) return
    const next = { ...a }
    delete next[last.id]
    setA(next)
  }
  const said = {
    mood: (v) => MOODS.find((m) => m.id === v).label,
    sleep: (v) => `${v} h sleep`,
    energy: (v) => `energy ${ENERGY[v - 1].toLowerCase()}`,
    stress: (v) => `${STRESS[v - 1].toLowerCase()} on your mind`,
    minutes: (v) => `${v} min`,
  }
  const go = () => {
    set({ checkin: { ...a, ...ctx }, done: [] })
    nav('/ritual', { replace: true })
  }
  const step = finished ? Q.length : at + 1
  const caption = Q.filter((q) => a[q.id] !== undefined && q.id !== 'mood')

  return (
    <div className="ci">
      <header className="bar"><Back to="/" label="Close check-in" /><h1 className="bar-title">Check-in</h1><span className="meta num" aria-label={`Question ${step} of ${Q.length}`}>{step}/{Q.length}</span></header>
      <div className="segs ci-segs" aria-hidden="true">{Q.map((q, i) => <i key={q.id} className={i < (finished ? Q.length : at) ? 'on' : ''} />)}</div>

      <Print mood={a.mood || 'none'} herb={herb || 'chamomile'} seed={daySeed(TODAY)} size="mid" className={printing ? 'printing' : ''}>
        <p className="ci-caption" aria-live="polite">
          {a.mood ? [<span key="mood">{said.mood(a.mood)}</span>, ...caption.map((q) => <span key={q.id}>{said[q.id](a[q.id])}</span>)] : <span>Not exposed yet. Pick a weather to begin.</span>}
        </p>
      </Print>

      {finished ? (
        <div className="ci-done" aria-live="polite">
          {printing ? <h2>Printing today’s sheet…</h2> : (
            <>
              <h2>Today’s ritual: {ritual.name.toLowerCase()}, {ritual.minutes} minutes.</h2>
              <ol className="plan">{ritual.steps.map((st) => <li key={st.kind}><div><strong>{st.title}</strong><small>{st.why}</small></div><span className="meta num">{st.minutes} min{st.parallel ? ', while you sit' : ''}</span></li>)}</ol>
              <button className="btn primary wide" onClick={go}>Open today’s ritual</button>
              <button className="btn text ci-back" onClick={back}>Change my last answer</button>
            </>
          )}
        </div>
      ) : (
        <>
          <h2 className="ci-q">{Q[at].ask(s.name, s.time)}</h2>
          <div className="ci-a">
            {Q[at].id === 'mood' && (
              <ul className="wx-list" aria-label="Today as weather">
                {MOODS.map((m) => (
                  <li key={m.id}>
                    <button className={`wx ex-${m.id}`} onClick={() => answer('mood', m.id)}>
                      <span className="sw" aria-hidden="true" /><span><strong>{m.label}</strong><small>{m.line}</small></span><Icon name="next" size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {Q[at].id === 'sleep' && (
              <>
                <label htmlFor="sl" className="sleep-v"><strong className="num">{sleep}</strong><span>hours</span></label>
                <div className="ruler">
                  <input id="sl" type="range" min={3} max={10} step={0.5} value={sleep} onChange={(e) => setSleep(Number(e.target.value))} />
                  <div className="ticks" aria-hidden="true">{Array.from({ length: 15 }, (_, i) => <i key={i} className={i % 2 ? '' : 'h'} />)}</div>
                  <div className="ticks-l" aria-hidden="true"><span>3 h</span><span>10 h</span></div>
                </div>
                <button className="btn primary wide" onClick={() => answer('sleep', sleep)}>That’s about right</button>
              </>
            )}
            {(Q[at].id === 'energy' || Q[at].id === 'stress') && (
              <div className="scale" role="group" aria-label={Q[at].id === 'energy' ? 'Energy' : 'How much is on your mind'}>
                {(Q[at].id === 'energy' ? ENERGY : STRESS).map((l, i) => (
                  <button key={l} onClick={() => answer(Q[at].id, i + 1)}>
                    <span className="meter" aria-hidden="true">{Array.from({ length: 5 }, (_, k) => <i key={k} className={k <= i ? 'on' : ''} style={{ height: `${(k + 1) * 20}%` }} />)}</span>
                    {l}
                  </button>
                ))}
              </div>
            )}
            {Q[at].id === 'minutes' && (
              <div className="times" role="group" aria-label="Time you have">
                {[5, 10, 20].map((m) => <button key={m} onClick={() => answer('minutes', m)}><strong className="num">{m}</strong><span>minutes</span></button>)}
              </div>
            )}
            {at > 0 && <button className="btn text ci-back" onClick={back}>Previous question</button>}
          </div>
        </>
      )}
    </div>
  )
}
