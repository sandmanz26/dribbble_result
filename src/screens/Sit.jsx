import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Back } from '../ui/kit.jsx'
import { SITS } from '../data/library.js'
import { buildRitual } from '../data/ritual.js'
import { mmss } from '../data/history.js'

// Ambient sound made in the browser, so nothing is downloaded: rain is filtered noise,
// the hum is brown noise, and the bell at the end is a soft decaying tone.
function useAmbient(kind, on) {
  const ctx = useRef(null)
  const node = useRef(null)
  useEffect(() => {
    if (!on || kind === 'none') return
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    const ac = ctx.current || new AC()
    ctx.current = ac
    const len = ac.sampleRate * 2
    const buf = ac.createBuffer(1, len, ac.sampleRate)
    const d = buf.getChannelData(0)
    let last = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      d[i] = kind === 'hum' ? (last = (last + 0.02 * w) / 1.02) * 3.5 : w
    }
    const src = ac.createBufferSource()
    src.buffer = buf
    src.loop = true
    const filter = ac.createBiquadFilter()
    filter.type = kind === 'hum' ? 'lowpass' : 'bandpass'
    filter.frequency.value = kind === 'hum' ? 400 : 1400
    filter.Q.value = 0.6
    const gain = ac.createGain()
    gain.gain.value = 0
    gain.gain.linearRampToValueAtTime(kind === 'hum' ? 0.5 : 0.12, ac.currentTime + 2)
    src.connect(filter).connect(gain).connect(ac.destination)
    src.start()
    node.current = { src, gain }
    return () => {
      gain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.6)
      setTimeout(() => src.stop(), 700)
    }
  }, [kind, on])
  const bell = () => {
    const ac = ctx.current
    if (!ac) return
    const o = ac.createOscillator()
    const g = ac.createGain()
    o.frequency.value = 432
    g.gain.setValueAtTime(0.25, ac.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 4)
    o.connect(g).connect(ac.destination)
    o.start()
    o.stop(ac.currentTime + 4)
  }
  return bell
}

export default function Sit() {
  const { s, set, notify } = useStore()
  const nav = useNavigate()
  const step = s.checkin ? buildRitual(s.checkin, s.flags).steps[2] : { id: 'open', minutes: 5 }
  const m = SITS[step.id]
  const total = step.minutes * 60
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [finished, setFinished] = useState(false)
  const bell = useAmbient(s.sound, running)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [running])
  useEffect(() => {
    if (running && elapsed >= total) {
      setRunning(false)
      setFinished(true)
      bell()
      set((c) => ({ done: [...new Set([...c.done, 'sit'])], minutesToday: c.minutesToday + step.minutes }))
    }
  }, [elapsed, running, total, bell, set, step.minutes])

  const p = Math.min(elapsed / total, 1)
  return (
    <div className={`player f-${m.field}`}>
      <header className="bar on-field"><Back label="Leave the sit" /><span className="bar-title">{m.kind}</span><span className="meta num">{mmss(Math.max(total - elapsed, 0))}</span></header>
      <div className="player-center">
        {/* The moon fills as the sit goes on: new moon at the start, full at the bell. */}
        <svg className="moon" viewBox="0 0 200 200" role="img" aria-label={`${Math.round(p * 100)} percent through`}>
          <defs><clipPath id="moonclip"><circle cx="100" cy="100" r="78" /></clipPath></defs>
          <circle cx="100" cy="100" r="78" className="moon-lit" />
          <circle cx={100 + p * 160} cy="100" r="80" className="moon-dark" clipPath="url(#moonclip)" />
          <circle cx="100" cy="100" r="78" className="moon-edge" />
        </svg>
        {finished ? <><h1 className="serif">Rest here a moment.</h1><p>{step.minutes} minutes of {m.name.toLowerCase()}.</p></> : (
          <><h1 className="serif">{m.name}</h1><p>{m.line}</p></>
        )}
      </div>
      <div className="player-foot">
        {!finished && (
          <div className="patterns" role="radiogroup" aria-label="Sound">
            {[['rain', 'Rain'], ['hum', 'Low hum'], ['none', 'Silence']].map(([k, l]) => <button key={k} role="radio" aria-checked={s.sound === k} onClick={() => set({ sound: k })}><Icon name={k === 'none' ? 'mute' : 'sound'} size={16} /> {l}</button>)}
          </div>
        )}
        {finished ? (
          <button className="btn primary block" onClick={() => { nav('/ritual'); notify({ text: 'Lovely. One line in the journal to close.' }) }}>Back to the ritual</button>
        ) : (
          <button className="roundbtn" onClick={() => setRunning(!running)} aria-label={running ? 'Pause' : elapsed ? 'Resume' : 'Begin'}><Icon name={running ? 'pause' : 'play'} size={28} /></button>
        )}
      </div>
    </div>
  )
}
