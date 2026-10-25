import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Back } from '../ui/kit.jsx'
import { BREATHS } from '../data/library.js'
import { buildRitual } from '../data/ritual.js'
import { mmss } from '../data/history.js'

const PHASES = ['Breathe in', 'Hold', 'Breathe out', 'Hold']

// The breath is a tide: the screen fills as you breathe in and empties as you breathe out.
export default function Breath() {
  const { s, set, notify } = useStore()
  const nav = useNavigate()
  const step = s.checkin ? buildRitual(s.checkin, s.flags).steps[0] : { id: 'long', minutes: 3 }
  const [pattern, setPattern] = useState(step.id)
  const b = BREATHS[pattern]
  const total = step.minutes * 60
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState(0)
  const [left, setLeft] = useState(0) // seconds left in this phase
  const [elapsed, setElapsed] = useState(0)
  const [breaths, setBreaths] = useState(0)
  const [finished, setFinished] = useState(false)
  const timer = useRef(null)

  // Advance one second at a time; skip phases with a zero count.
  useEffect(() => {
    if (!running) return
    timer.current = setInterval(() => {
      setElapsed((e) => e + 1)
      setLeft((l) => {
        if (l > 1) return l - 1
        let p = phase
        for (let k = 0; k < 4; k++) { p = (p + 1) % 4; if (b.counts[p] > 0) break }
        if (p === 0) setBreaths((n) => n + 1)
        setPhase(p)
        return b.counts[p]
      })
    }, 1000)
    return () => clearInterval(timer.current)
  }, [running, phase, b])

  useEffect(() => {
    if (running && elapsed >= total) {
      setRunning(false)
      setFinished(true)
      set((c) => ({ done: [...new Set([...c.done, 'breath'])], minutesToday: c.minutesToday + step.minutes }))
    }
  }, [elapsed, running, total, set, step.minutes])

  const start = () => { setPhase(0); setLeft(b.counts[0]); setRunning(true); setFinished(false); setElapsed(0); setBreaths(0) }
  // Fill level: rising while breathing in, full while holding after, falling while breathing out.
  const level = !running && !finished ? 0.08 : phase === 0 || phase === 1 ? 1 : 0.08
  const dur = running ? b.counts[phase] : 0.6

  return (
    <div className={`player f-${b.field}`}>
      <div className="tide" style={{ '--level': level, '--dur': `${phase === 1 || phase === 3 ? 0.3 : dur}s` }} aria-hidden="true"><span /></div>
      <header className="bar on-field"><Back label="Leave the breath" /><h1 className="bar-title">{b.name}</h1><span className="meta num">{mmss(Math.max(total - elapsed, 0))}</span></header>

      <div className="player-center" aria-live="polite">
        {finished ? (
          <>
            <h2 className="serif">Well breathed.</h2>
            <p className="num">{breaths} breaths in {step.minutes} minutes</p>
          </>
        ) : running ? (
          <>
            <span className="phase">{PHASES[phase]}</span>
            <span className="count num">{left}</span>
          </>
        ) : (
          <>
            <h2 className="serif">{b.name}</h2>
            <p>{b.why}</p>
            <p className="num counts">{b.counts.map((c, i) => (c ? `${PHASES[i].replace('Breathe ', '')} ${c}` : null)).filter(Boolean).join('  ·  ')}</p>
          </>
        )}
      </div>

      <div className="player-foot">
        {!running && !finished && (
          <div className="patterns" role="radiogroup" aria-label="Pattern">
            {Object.entries(BREATHS).map(([id, x]) => <button key={id} role="radio" aria-checked={pattern === id} onClick={() => setPattern(id)}>{x.name}</button>)}
          </div>
        )}
        {finished ? (
          <button className="btn primary wide" onClick={() => { nav('/ritual'); notify({ text: 'Breath done. Next, put the kettle on.' }) }}>Back to the ritual</button>
        ) : running ? (
          <button className="roundbtn" onClick={() => setRunning(false)} aria-label="Pause"><Icon name="pause" size={28} /></button>
        ) : (
          <button className="roundbtn" onClick={elapsed > 0 ? () => setRunning(true) : start} aria-label={elapsed > 0 ? 'Resume' : 'Begin'}><Icon name="play" size={28} /></button>
        )}
      </div>
    </div>
  )
}
