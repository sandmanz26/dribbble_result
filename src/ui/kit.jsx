import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import { PEOPLE, initials, trust } from '../data/people.js'
import { useStore } from '../store.jsx'

// Each person keeps one pale tint of their own hue, as identity, never as data.
export function Avatar({ id, size = 36, ring = false }) {
  const p = PEOPLE[id]
  if (!p) return null
  return (
    <span className={`avatar ${ring ? 'ring' : ''}`} style={{ '--h': p.hue, width: size, height: size, fontSize: Math.round(size * 0.38) }} aria-hidden="true">
      {size < 30 ? initials(id)[0] : initials(id)}
    </span>
  )
}

export function Faces({ ids, max = 4, size = 28 }) {
  const shown = ids.slice(0, max)
  return (
    <span className="faces" aria-hidden="true">
      {shown.map((id) => <Avatar key={id} id={id} size={size} ring />)}
      {ids.length > max && <span className="faces-more" style={{ width: size, height: size }}>+{ids.length - max}</span>}
    </span>
  )
}

const TRUST = {
  id: { label: 'ID verified', icon: 'verified' },
  contact: { label: 'Phone and email', icon: 'tick' },
  partial: { label: 'Not fully verified', icon: 'alert' },
}
export function Trust({ id, level, compact = false }) {
  const t = level || trust(id)
  const m = TRUST[t]
  return (
    <span className={`trust trust-${t} ${compact ? 'compact' : ''}`} title={m.label}>
      <Icon name={m.icon} size={compact ? 14 : 16} />
      {compact ? <span className="sr-only">{m.label}</span> : m.label}
    </span>
  )
}

export function TopBar({ title, back = true, right, sub }) {
  const nav = useNavigate()
  return (
    <header className="topbar">
      {back ? (
        <button className="iconbtn" onClick={() => nav(-1)} aria-label="Back"><Icon name="back" size={22} /></button>
      ) : <span className="iconbtn-space" />}
      <div className="topbar-title">
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      <div className="topbar-right">{right}</div>
    </header>
  )
}

export function Sheet({ open, onClose, title, children, tall = false }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    ref.current?.querySelector('button, input, textarea, select, [tabindex]')?.focus()
    const f = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', f)
    return () => { window.removeEventListener('keydown', f); opener?.focus?.() }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="scrim" onClick={onClose}>
      <section ref={ref} className={`sheet ${tall ? 'tall' : ''}`} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <span className="sheet-grip" aria-hidden="true" />
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="iconbtn" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </div>
        {children}
      </section>
    </div>
  )
}

export function Toast() {
  const { toast, notify } = useStore()
  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {toast && (
        <div className="toast">
          <span>{toast.text}</span>
          {toast.undo && <button onClick={() => { toast.undo(); notify(null) }}>Undo</button>}
        </div>
      )}
    </div>
  )
}

export function Seg({ options, value, onChange, label }) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {options.map(([v, l]) => (
        <button key={v} role="radio" aria-checked={value === v} onClick={() => onChange(v)}>{l}</button>
      ))}
    </div>
  )
}

export function Skeleton({ rows = 3, tall = 96 }) {
  return (
    <div className="skel" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => <span key={i} style={{ height: tall }} />)}
    </div>
  )
}

export function Failed({ what, onRetry }) {
  return (
    <div className="failed" role="alert">
      <Icon name="alert" />
      <p>{what} did not load. Check your connection.</p>
      <button className="btn ghost small" onClick={onRetry}>Try again</button>
    </div>
  )
}

export function Empty({ title, children, action }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}

export function Toggle({ checked, onChange, label, id }) {
  return (
    <button id={id} role="switch" aria-checked={checked} aria-label={label} className="toggle" onClick={() => onChange(!checked)}>
      <span />
    </button>
  )
}
