import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from './store.jsx'
import { Mark } from './ui/kit.jsx'

// On a computer: a phone, and a reviewer panel beside it. On a phone: the app, full screen.
const Q = '(min-width: 760px) and (min-height: 700px)'
function useWide() {
  const [w, setW] = useState(() => window.matchMedia(Q).matches)
  useEffect(() => {
    const m = window.matchMedia(Q)
    const f = () => setW(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return w
}

const TOURS = [
  ['/welcome', 'Onboarding, with health flags for herbs'],
  ['/check-in', 'The one-minute check-in, as a conversation'],
  ['/ritual', 'Today’s ritual, and why each step was chosen'],
  ['/ritual/breath', 'Breath player: the tide'],
  ['/ritual/herb', 'Herbal protocol, as an apothecary label'],
  ['/ritual/sit', 'Meditation player with rain sound'],
  ['/journal', 'Journal and the mood weather'],
]

export default function Frame({ children }) {
  const wide = useWide()
  const { s, set, reset } = useStore()
  if (!wide) return <div className="bare">{children}</div>
  return (
    <div className="stage">
      <aside className="panel" aria-label="Prototype panel">
        <div className="panel-brand"><Mark size={40} /><div><strong>Tend</strong><span>A ritual from a one-minute check-in</span></div></div>
        <p className="panel-note">Clickable prototype for the wellness app brief. Content is sample data; herbal notes need review by a qualified herbalist and clinician.</p>
        <h2>Walk through</h2>
        <ol className="tours">
          {TOURS.map(([to, l]) => <li key={to}><Link to={to} onClick={() => to !== '/welcome' && !s.onboarded && set({ onboarded: true })}>{l}</Link></li>)}
        </ol>
        <h2>Time of day</h2>
        <div className="seg-mini">
          {['morning', 'evening'].map((t) => <button key={t} aria-pressed={s.time === t} onClick={() => set({ time: t, checkin: null, done: [] })}>{t === 'morning' ? 'Morning 07:40' : 'Evening 21:30'}</button>)}
        </div>
        <h2>Theme</h2>
        <div className="seg-mini">
          {['system', 'light', 'dark'].map((t) => <button key={t} aria-pressed={s.theme === t} onClick={() => set({ theme: t })}>{t === 'system' ? 'Auto' : t[0].toUpperCase() + t.slice(1)}</button>)}
        </div>
        <div className="panel-links">
          <Link to="/system">Design system</Link>
          <a href="research.pdf" target="_blank" rel="noreferrer">Research report (PDF)</a>
          <button onClick={reset}>Reset the demo</button>
        </div>
      </aside>
      <div className="device"><div className="device-screen"><div className="statusbar" aria-hidden="true"><span>{s.time === 'morning' ? '7:40' : '21:30'}</span><span className="sb-icons"><i /><i /><i /></span></div>{children}</div></div>
    </div>
  )
}
