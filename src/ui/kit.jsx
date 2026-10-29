import { useEffect, useRef } from 'react'
import { STRENGTH, PEOPLE, SKILLS, SKILL_SHORT } from '../data/bridge.js'
import * as I from './icons.js'

export const fmtDate = (iso, opts = { day: 'numeric', month: 'short' }) => (iso ? new Date(iso + (iso.length === 10 ? 'T12:00:00' : '')).toLocaleDateString('en-GB', opts) : '-')

// Readiness as a bar: the evidenced part in ink, the rest as the track. The figure sits beside it in text.
export function Bar({ value, label }) {
  return (
    <span className="bar" role="img" aria-label={label || `${value} percent ready`}>
      <span className="bar-fill" style={{ width: `${value}%` }} />
      <span className="bar-mark" style={{ insetInlineStart: '75%' }} aria-hidden="true" />
    </span>
  )
}

// How a piece of evidence counts. Verified is highlighted in the lime, the way a researcher marks a source they checked.
export function Strength({ s, short = false }) {
  if (!s) return <span className="str is-none">{short ? 'None' : 'No evidence'}</span>
  const k = typeof s === 'string' ? s : s >= 1 ? 'verified' : s >= 0.7 ? 'linked' : s >= 0.5 ? 'below' : s > 0 ? 'claimed' : null
  if (!k) return <span className="str is-none">{short ? 'None' : 'No evidence'}</span>
  if (k === 'below') return <span className="str is-below">Below level</span>
  return <span className={`str is-${k}`}>{k === 'verified' && <I.Verified size={14} aria-hidden="true" />}{STRENGTH[k].label}</span>
}

// One chip per required skill: the skill's short name, styled by how strongly it is shown.
export function SkillChip({ skill, v }) {
  const k = v >= 1 ? 'verified' : v >= 0.7 ? 'linked' : v >= 0.5 ? 'below' : v > 0 ? 'claimed' : 'none'
  const said = { verified: 'verified', linked: 'linked, not checked', below: 'below the level asked', claimed: 'claimed only', none: 'no evidence' }[k]
  return <span className={`str is-${k}`} title={`${SKILLS[skill]}: ${said}`} aria-label={`${SKILLS[skill]}: ${said}`}>{k === 'verified' && <I.Verified size={14} aria-hidden="true" />}{SKILL_SHORT[skill]}</span>
}

export function Avatar({ pi, name, size = 32 }) {
  const p = PEOPLE[pi]
  const n = name || p?.name || '?'
  const initials = n.replace(/^Dr\.\s*/, '').split(' ').map((x) => x[0]).slice(0, 2).join('')
  const hue = p?.hue ?? 210
  return <span className="avatar" style={{ width: size, height: size, background: `hsl(${hue} 55% 90%)`, color: `hsl(${hue} 45% 26%)`, fontSize: size * 0.4 }} aria-hidden="true">{initials}</span>
}

export function Dialog({ open, onClose, title, children, wide }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    const el = ref.current
    el?.querySelector('input, select, textarea, button:not(.dlg-x)')?.focus()
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const f = [...el.querySelectorAll('a, button, input, select, textarea')].filter((x) => !x.disabled)
        if (!f.length) return
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus() }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus() }
      }
    }
    document.addEventListener('keydown', key)
    return () => { document.removeEventListener('keydown', key); prev?.focus?.() }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!open) return null
  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`dlg ${wide ? 'is-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="dlg-t" ref={ref}>
        <div className="dlg-head"><h2 id="dlg-t">{title}</h2><button className="dlg-x icon-btn" onClick={onClose} aria-label="Close"><I.X /></button></div>
        {children}
      </div>
    </div>
  )
}

export function Toggle({ on, onChange, label, id }) {
  return <button id={id} role="switch" aria-checked={on} aria-label={label} className={`switch ${on ? 'is-on' : ''}`} onClick={() => onChange(!on)}><span /></button>
}

export function Empty({ title, children }) {
  return <div className="empty"><p className="empty-t">{title}</p>{children}</div>
}
