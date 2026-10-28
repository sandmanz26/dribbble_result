import { NavLink, useNavigate } from 'react-router-dom'
import { Logout } from '@carbon/icons-react'
import { useStore } from '../store.jsx'

// The icon rail: brand mark, the area's destinations, log out at the foot. Each icon has a
// tooltip and an accessible name. On a phone it becomes a bottom bar.
export function Mark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="4" fill="#1f1c16" />
      <path d="M5 22l7-7 5 4 10-10" fill="none" stroke="#d9ad55" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Shell({ items, children, label }) {
  const { set, toast, notify } = useStore()
  const nav = useNavigate()
  return (
    <div className="appshell">
      <nav className="arail" aria-label={label}>
        <NavLink to="/" className="mark" aria-label="GlobalTrade website"><Mark /></NavLink>
        {items.map(([to, name, Icon, end]) => (
          <NavLink key={to} to={to} end={end} aria-label={name}><Icon size={18} /><span className="tip">{name}</span></NavLink>
        ))}
        <span className="gap" />
        <button aria-label="Log out" onClick={() => { set({ session: null }); nav('/login') }}><Logout size={18} /><span className="tip">Log out</span></button>
      </nav>
      <main className="canvas">{children}</main>
      {toast && <div className="toast" role="status"><span>{toast.text}</span>{toast.undo && <button onClick={() => { toast.undo(); notify(null) }}>Undo</button>}</div>}
    </div>
  )
}
