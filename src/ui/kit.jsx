import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft2, CloseCircle, TickCircle, Warning2, InfoCircle } from 'iconsax-react'
import { useStore } from '../store.jsx'

export const ICON = { size: 20, color: 'currentColor' }

export function TopBar({ title, back, action, large, sub }) {
  const nav = useNavigate()
  return (
    <header className={`topbar ${large ? 'is-large' : ''}`}>
      <div className="topbar-row">
        {back ? (
          <button className="icon-btn" onClick={() => (window.history.length > 1 ? nav(-1) : nav(back))} aria-label="Back">
            <ArrowLeft2 {...ICON} />
          </button>
        ) : <span className="topbar-spacer" />}
        {!large && <h1 className="topbar-title">{title}</h1>}
        <div className="topbar-action">{action}</div>
      </div>
      {large && (
        <div className="topbar-large">
          <h1>{title}</h1>
          {sub && <p>{sub}</p>}
        </div>
      )}
    </header>
  )
}

export function Button({ variant = 'primary', size, icon, children, className = '', ...p }) {
  return (
    <button className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`} {...p}>
      {icon}
      {children && <span>{children}</span>}
    </button>
  )
}

export function Sheet({ open, onClose, title, children, footer, tall }) {
  const ref = useRef()
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    const t = setTimeout(() => ref.current?.querySelector('input, button, [tabindex]')?.focus(), 30)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); prev?.focus?.() }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="sheet-layer">
      <div className="sheet-backdrop" onClick={onClose} />
      <div className={`sheet ${tall ? 'is-tall' : ''}`} role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <div className="sheet-grip" />
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><CloseCircle {...ICON} /></button>
        </div>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-foot">{footer}</div>}
      </div>
    </div>
  )
}

export function Field({ label, error, help, children, optional }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span className="field-label">{label}{optional && <em> optional</em>}</span>
      {children}
      {error ? <span className="field-error" role="alert">{error}</span> : help ? <span className="field-help">{help}</span> : null}
    </label>
  )
}

export function Chip({ on, children, ...p }) {
  return <button type="button" className={`chip ${on ? 'is-on' : ''}`} aria-pressed={!!on} {...p}>{children}</button>
}

export function Segmented({ value, options, onChange, label }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} role="radio" aria-checked={value === o.value} className={value === o.value ? 'is-on' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

const TINTS = 6
export function Avatar({ s, size = 44 }) {
  const n = (s.first.charCodeAt(0) + s.last.charCodeAt(0)) % TINTS
  return (
    <span className={`avatar tint-${n}`} style={{ width: size, height: size, fontSize: size * 0.36 }} aria-hidden="true">
      {s.first[0]}{s.last[0]}
    </span>
  )
}

const STATUS = { enrolled: 'Enrolled', pending: 'Incomplete', withdrawn: 'Withdrawn', open: 'Not started', draft: 'In progress', submitted: 'Waiting for review', locked: 'Locked', returned: 'Returned' }
export function Status({ value }) {
  return <span className={`status status-${value}`}>{STATUS[value] || value}</span>
}

export function Toast() {
  const { state, dispatch } = useStore()
  const t = state.toast
  useEffect(() => {
    if (!t) return
    const id = setTimeout(() => dispatch({ type: 'toast', toast: null }), 3600)
    return () => clearTimeout(id)
  }, [t, dispatch])
  if (!t) return null
  const I = t.tone === 'warn' ? Warning2 : t.tone === 'info' ? InfoCircle : TickCircle
  return (
    <div className={`toast toast-${t.tone}`} role="status" key={t.id}>
      <I size={18} color="currentColor" variant="Bold" />
      <span>{t.text}</span>
    </div>
  )
}

export function Empty({ icon, title, children, action }) {
  return (
    <div className="empty">
      {icon && <div className="empty-icon">{icon}</div>}
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}

// A short honest pause so loading states are visible in the prototype.
export function useLoading(ms = 450, deps = []) {
  const [loading, set] = useState(true)
  useEffect(() => { set(true); const t = setTimeout(() => set(false), ms); return () => clearTimeout(t) }, deps) // eslint-disable-line
  return loading
}

export function SkeletonRows({ n = 5 }) {
  return (
    <div className="list" aria-busy="true" aria-label="Loading">
      {Array.from({ length: n }).map((_, i) => (
        <div className="row skeleton-row" key={i}>
          <span className="sk sk-circle" />
          <span className="sk-lines"><span className="sk" style={{ width: `${60 - i * 4}%` }} /><span className="sk" style={{ width: '34%' }} /></span>
        </div>
      ))}
    </div>
  )
}

export function fmtDate(isoStr, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!isoStr) return ''
  return new Date(isoStr.length <= 10 ? `${isoStr}T12:00:00` : isoStr).toLocaleDateString('en-GB', opts)
}

export function fmtTime(isoStr) {
  return new Date(isoStr).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export function age(dob, now) {
  const d = new Date(`${dob}T12:00:00`)
  let a = now.getFullYear() - d.getFullYear()
  if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) a--
  return a
}

export function Highlight({ text, query }) {
  const q = (query || '').trim().split(/\s+/).filter((t) => t.length > 1)
  if (!q.length) return text
  const re = new RegExp(`(${q.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig')
  return text.split(re).map((part, i) => (re.test(part) && i % 2 ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))
}
