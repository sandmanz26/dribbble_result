import { useEffect, useRef, useState } from 'react'
import { PEOPLE } from '../data/world.js'
import * as I from './icons.js'

// The product's mark: a ruled ledger line over a selvedge edge.
export function Mark({ className = 'brand-mark' }) {
  return (
    <svg className={className} viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="6" fill="#141414" />
      <path d="M8 9h12M8 14h12" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7 20.5h14" stroke="#a32a24" strokeWidth="2.6" strokeDasharray="3 2" />
    </svg>
  )
}

export function Avatar({ id, size }) {
  const p = PEOPLE[id]
  const name = p?.name || id
  const ini = name.split(' ').slice(0, 2).map((w) => w[0]).join('')
  return <span className={`av ${size ? `is-${size}` : ''}`} style={{ '--h': p?.hue ?? (name.charCodeAt(0) * 37) % 360 }} aria-hidden="true">{ini}</span>
}
export function ClientAvatar({ client, size }) {
  const ini = client.name.split(' ').slice(0, 2).map((w) => w[0]).join('')
  return <span className={`av ${size ? `is-${size}` : ''}`} style={{ '--h': (client.name.charCodeAt(0) * 47 + client.name.length * 13) % 360 }} aria-hidden="true">{ini}</span>
}

export const Photo = ({ id, size = '', alt = '' }) => <img className={`ph ${size ? `is-${size}` : ''}`} src={`img/${id}.webp`} alt={alt} loading="lazy" decoding="async" />

// "Written by Selvedge" with the time and a way to see where every number came from.
export function AiTag({ text = 'Written by Selvedge', when, sources }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const off = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', off); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', off); document.removeEventListener('keydown', esc) }
  }, [open])
  return (
    <span className="ai-tag-wrap" ref={ref}>
      <span className="ai-tag"><I.Spark />{text}{when ? `, ${when}` : ''}</span>
      {sources?.length > 0 && <button className="src-btn" aria-expanded={open} onClick={() => setOpen(!open)}>{sources.length} sources</button>}
      {open && (
        <span className="pop" role="dialog" aria-label="Sources">
          <b>Where this comes from</b>
          <ul>{sources.map((s) => <li key={s}><I.Doc />{s}</li>)}</ul>
          <small>Every figure in the text is read from these. Nothing is estimated unless it says so.</small>
        </span>
      )}
    </span>
  )
}

export function Delta({ value, good = 'up', d = 1, suffix = '%', window }) {
  if (value === 0 || value == null) return <span className="muted">{value === 0 ? '0' : '-'}</span>
  const isGood = good === 'up' ? value > 0 : value < 0
  return <span className={isGood ? 'up' : 'down'}><span className="num">{value > 0 ? '+' : '−'}{Math.abs(value * (suffix === '%' ? 100 : 1)).toFixed(d)}{suffix}</span>{window ? <span className="muted"> {window}</span> : null}</span>
}

export function Pill({ tone = '', children }) {
  return <span className={`pill ${tone ? `is-${tone}` : ''}`}>{children}</span>
}

export function useToast() {
  const [t, setT] = useState(null)
  useEffect(() => { if (!t) return; const id = setTimeout(() => setT(null), t.ms || 4200); return () => clearTimeout(id) }, [t])
  return [t, (text, extra) => setT({ text, key: Date.now(), ...extra })]
}
export function Toast({ toast }) {
  if (!toast) return null
  return <div className="toast" role="status" key={toast.key}>{toast.text}{toast.action}</div>
}

export function Dialog({ open, onClose, title, children, wide }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k); ref.current?.focus()
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="dlg-wrap" onMouseDown={onClose}>
      <div className={`dlg ${wide ? 'is-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref} onMouseDown={(e) => e.stopPropagation()}>
        <div className="dlg-head"><h2>{title}</h2><button className="btn is-quiet is-sm" onClick={onClose} aria-label="Close"><I.Close /></button></div>
        {children}
      </div>
    </div>
  )
}
