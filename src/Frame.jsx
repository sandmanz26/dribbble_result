import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from './store.jsx'
import { Mark } from './ui/Logo.jsx'

// On a computer the app sits in a phone frame with a reviewer panel beside it.
// On a phone (or any narrow window) the frame goes and the app takes the whole screen.
const Q = '(min-width: 720px) and (min-height: 700px)'
function useDesktop() {
  const [on, setOn] = useState(() => window.matchMedia(Q).matches)
  useEffect(() => {
    const m = window.matchMedia(Q)
    const f = () => setOn(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return on
}

const TOURS = [
  ['/welcome', 'Sign up with phone, email and ID check'],
  ['/', 'Discover destinations and groups'],
  ['/g/kansai', 'Request to join a group'],
  ['/trip/kyoto/dates', 'Vote on dates with the group'],
  ['/trip/kyoto/budget', 'Split costs and see who owes whom'],
  ['/trip/kyoto/plan', 'Vote on the itinerary'],
  ['/trip/kyoto/packing', 'Claim shared packing'],
  ['/chats', 'A message request, then block or report'],
  ['/me/safety', 'Safety preferences'],
]

export default function Frame({ children }) {
  const desktop = useDesktop()
  const { s, set, reset, sim, setSim } = useStore()
  if (!desktop) return <div className="bare">{children}</div>
  return (
    <div className="stage">
      <aside className="panel" aria-label="Prototype panel">
        <div className="panel-brand">
          <Mark size={40} />
          <div>
            <strong className="wordmark">caravan</strong>
            <span>Travel with people you can trust</span>
          </div>
        </div>
        <p className="panel-note">A clickable prototype. People, groups and prices are sample data. Open this page on a phone to use it full screen.</p>
        <h2>Try these</h2>
        <ol className="panel-tours">
          {TOURS.map(([to, label]) => (
            <li key={to}><Link to={to} onClick={() => to !== '/welcome' && !s.onboarded && set({ onboarded: true })}>{label}</Link></li>
          ))}
        </ol>
        <h2>Prototype</h2>
        <div className="panel-row">
          <label><input type="checkbox" checked={sim.slow} onChange={(e) => setSim({ ...sim, slow: e.target.checked })} /> Slow network</label>
          <label><input type="checkbox" checked={sim.fail} onChange={(e) => setSim({ ...sim, fail: e.target.checked })} /> Network fails</label>
        </div>
        <div className="panel-row">
          {['system', 'light', 'dark'].map((t) => (
            <button key={t} aria-pressed={s.theme === t} onClick={() => set({ theme: t })}>{t === 'system' ? 'Auto' : t[0].toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
        <button className="panel-reset" onClick={reset}>Reset the demo</button>
        <p className="panel-note small">Demo SMS code: 2468. Today in the demo: Saturday 24 October 2026.</p>
      </aside>
      <div className="device" role="presentation">
        <div className="device-screen">
          <div className="statusbar" aria-hidden="true"><span>9:41</span><span className="statusbar-icons"><i /><i /><i /></span></div>
          {children}
        </div>
      </div>
    </div>
  )
}
