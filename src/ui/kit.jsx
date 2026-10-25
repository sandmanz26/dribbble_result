import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import { useStore } from '../store.jsx'
import { MOODS } from '../data/library.js'

export function Back({ label = 'Back', to }) {
  const nav = useNavigate()
  return <button className="iconbtn" onClick={() => (to ? nav(to) : nav(-1))} aria-label={label}><Icon name="back" /></button>
}

export function MoodIcon({ mood, size = 22 }) {
  const m = MOODS.find((x) => x.id === mood)
  if (!m) return <span className="mood-none" aria-label="No check-in" />
  return <span className={`moodic m-${mood}`}><Icon name={m.icon} size={size} label={m.label} /></span>
}

export function Toast() {
  const { toast, notify } = useStore()
  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {toast && <div className="toast"><span>{toast.text}</span>{toast.undo && <button onClick={() => { toast.undo(); notify(null) }}>Undo</button>}</div>}
    </div>
  )
}

// The mark: a small square sun print of one leaf.
export function Mark({ size = 30 }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="3" className="mark-bg" />
      <path d="M9 22c0-7.5 5-12.5 14-13-0.5 9-5.5 14-13 14" className="mark-leaf" />
      <path d="M10 22c3-3 6-6 9.5-9" className="mark-vein" />
    </svg>
  )
}
