import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Back, MoodIcon } from '../ui/kit.jsx'
import { MOODS } from '../data/library.js'
import { buildRitual } from '../data/ritual.js'

// The check-in is a short conversation: one question at a time, answered with a tap.
const Q = [
  { id: 'mood', ask: (n, t) => `${t === 'evening' ? 'Evening' : 'Morning'}, ${n}. If today were weather, what would it be?` },
  { id: 'sleep', ask: () => 'How long did you sleep last night?' },
  { id: 'energy', ask: () => 'And your energy right now?' },
  { id: 'stress', ask: () => 'How much is on your mind?' },
  { id: 'minutes', ask: () => 'How much time do you have?' },
]
const ENERGY = ['Empty', 'Low', 'Okay', 'Good', 'Full']
const STRESS = ['Nothing much', 'A little', 'Some', 'A lot', 'Too much']

export default function CheckIn() {
  const { s, set } = useStore()
  const nav = useNavigate()
  const [a, setA] = useState({})
  const [sleep, setSleep] = useState(7)
  const [thinking, setThinking] = useState(false)
  const end = useRef(null)
  const at = Q.findIndex((q) => a[q.id] === undefined)
  const finished = at === -1
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [at, thinking])

  const answer = (id, v) => {
    const next = { ...a, [id]: v }
    setA(next)
    if (Object.keys(next).length === Q.length) {
      setThinking(true)
      setTimeout(() => setThinking(false), 1100)
    }
  }
  const said = (id) => {
    const v = a[id]
    if (id === 'mood') return MOODS.find((m) => m.id === v).label
    if (id === 'sleep') return `About ${v} hours`
    if (id === 'energy') return ENERGY[v - 1]
    if (id === 'stress') return STRESS[v - 1]
    return `${v} minutes`
  }
  const go = () => {
    set({ checkin: { ...a, goal: s.goal, time: s.time }, done: [] })
    nav('/ritual', { replace: true })
  }
  const ritual = finished ? buildRitual({ ...a, goal: s.goal, time: s.time }, s.flags) : null

  return (
    <div className="chat">
      <header className="bar"><Back to="/" label="Close check-in" /><span className="bar-title">Check-in</span><span className="meta num">{Math.min(at === -1 ? Q.length : at + 1, Q.length)} of {Q.length}</span></header>
      <ol className="thread" aria-live="polite">
        {Q.slice(0, finished ? Q.length : at + 1).map((q) => (
          <li key={q.id} className="turn">
            <p className="bubble tend">{q.ask(s.name, s.time)}</p>
            {a[q.id] !== undefined && <p className="bubble you">{q.id === 'mood' && <MoodIcon mood={a.mood} size={18} />}{said(q.id)}</p>}
          </li>
        ))}
        {finished && (
          <li className="turn">
            {thinking ? <p className="bubble tend typing" aria-label="Shaping your ritual"><i /><i /><i /></p> : (
              <div className="bubble tend result">
                <p>Here is a {ritual.minutes}-minute ritual for today: <strong>{ritual.name.toLowerCase()}</strong>.</p>
                <ul>{ritual.steps.map((st) => <li key={st.kind}><span className={`swatch f-${st.field}`} />{st.title}<span className="meta num">{st.minutes} min{st.parallel ? ', while you sit' : ''}</span></li>)}</ul>
                <button className="btn primary" onClick={go}>See today’s ritual</button>
              </div>
            )}
          </li>
        )}
        <li ref={end} aria-hidden="true" />
      </ol>

      {!finished && (
        <div className="answer">
          {Q[at].id === 'mood' && (
            <div className="weather" role="group" aria-label="Today as weather">
              {MOODS.map((m) => (
                <button key={m.id} className={`wx w-${m.id}`} onClick={() => answer('mood', m.id)}>
                  <Icon name={m.icon} size={26} /><strong>{m.label}</strong><span>{m.line}</span>
                </button>
              ))}
            </div>
          )}
          {Q[at].id === 'sleep' && (
            <div className="slide">
              <label htmlFor="sl" className="slide-value num"><strong>{sleep}</strong> hours</label>
              <input id="sl" type="range" min={3} max={10} step={0.5} value={sleep} onChange={(e) => setSleep(Number(e.target.value))} />
              <div className="slide-ends meta small"><span>3 h</span><span>10 h</span></div>
              <button className="btn primary" onClick={() => answer('sleep', sleep)}>That’s about right</button>
            </div>
          )}
          {(Q[at].id === 'energy' || Q[at].id === 'stress') && (
            <div className={`levels l-${Q[at].id}`} role="group" aria-label={Q[at].id === 'energy' ? 'Energy' : 'How much is on your mind'}>
              {(Q[at].id === 'energy' ? ENERGY : STRESS).map((l, i) => (
                <button key={l} onClick={() => answer(Q[at].id, i + 1)} style={{ '--n': i + 1 }}>
                  <span className="lv" aria-hidden="true">{Array.from({ length: 5 }, (_, k) => <i key={k} className={k <= i ? 'on' : ''} />)}</span>
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
        </div>
      )}
    </div>
  )
}
