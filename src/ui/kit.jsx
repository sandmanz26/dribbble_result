import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Add, Minus, Close } from './icons.js'

// A dish photo, square, cropped to the food. Photos are real (see Credits) and lazy-loaded.
export const photoSrc = (name) => `food/${name}.webp`
export function Tile({ item, size = 'md', className = '' }) {
  return (
    <span className={`tile tile-${size} ${item.soldOut ? 'is-out' : ''} ${className}`}>
      <img src={photoSrc(item.photo)} alt="" loading="lazy" decoding="async" />
    </span>
  )
}

export function Stepper({ value, onChange, min = 0, label, small }) {
  return (
    <span className={`stepper ${small ? 'is-small' : ''}`} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="One fewer"><Minus size={small ? 16 : 18} /></button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="One more"><Add size={small ? 16 : 18} /></button>
    </span>
  )
}

// Bottom sheet: every choice that needs more than a tap opens here, never a browser dropdown.
export function Sheet({ open, onClose, title, children }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    ref.current?.focus()
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  const host = document.querySelector('.app')
  if (!open || !host) return null
  return createPortal(
    <div className="sheet-wrap" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref} onClick={(e) => e.stopPropagation()}>
        <span className="sheet-grip" aria-hidden="true" />
        <div className="sheet-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Close"><Close size={20} /></button></div>
        {children}
      </div>
    </div>, host)
}

// One message at a time, slides up above the tab bar.
export function useToast() {
  const [t, setT] = useState(null)
  useEffect(() => { if (!t) return; const id = setTimeout(() => setT(null), t.ms || 3200); return () => clearTimeout(id) }, [t])
  return [t, (text, extra) => setT({ text, key: Date.now(), ...extra })]
}
export function Toast({ toast }) {
  if (!toast) return null
  return <div className="toast" key={toast.key} role="status">{toast.text}{toast.action}</div>
}

export const clock = (d) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
export const day = (d) => new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
