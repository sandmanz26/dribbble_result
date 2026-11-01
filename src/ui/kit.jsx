import { useEffect, useRef } from 'react'
import { BiX } from 'react-icons/bi'
import { people } from '../data/people.js'

export const photo = (name, small) => `photos/${name}${small ? '-sm' : ''}.webp`

export function Photo({ name, small, alt = '', className = '', ...rest }) {
  return <img className={`photo ${className}`} src={photo(name, small)} alt={alt} loading="lazy" decoding="async" {...rest} />
}

export function Avatar({ id, size = 36, ring }) {
  const p = people[id]
  if (!p) return null
  return (
    <img
      className={`avatar${ring ? ' avatar--ring' : ''}`}
      src={`photos/${p.photo}.webp`}
      alt={p.name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      loading="lazy"
    />
  )
}

export function Stack({ ids, size = 28, max = 5 }) {
  const shown = ids.slice(0, max)
  const more = ids.length - shown.length
  return (
    <span className="stack" style={{ '--s': `${size}px` }}>
      {shown.map((id) => <Avatar key={id} id={id} size={size} ring />)}
      {more > 0 && <span className="stack__more" style={{ width: size, height: size }}>+{more}</span>}
    </span>
  )
}

export function Button({ variant = 'primary', size, icon: Icon, iconEnd: End, children, className = '', ...rest }) {
  return (
    <button className={`btn btn--${variant}${size ? ` btn--${size}` : ''} ${className}`} {...rest}>
      {Icon && <Icon aria-hidden="true" className="btn__icon" />}
      {children && <span>{children}</span>}
      {End && <End aria-hidden="true" className="btn__icon" />}
    </button>
  )
}

export function IconButton({ icon: Icon, label, className = '', ...rest }) {
  return (
    <button className={`iconbtn ${className}`} aria-label={label} title={label} {...rest}>
      <Icon aria-hidden="true" />
    </button>
  )
}

// Bottom sheet: Escape closes, focus moves in and returns on close.
export function Sheet({ open, onClose, title, children, footer }) {
  const ref = useRef(null)
  const back = useRef(null)
  useEffect(() => {
    if (!open) return
    back.current = document.activeElement
    const el = ref.current
    const first = el?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    first?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && el) {
        const f = [...el.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])')].filter((n) => !n.disabled)
        if (!f.length) return
        const a = f[0], z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); back.current?.focus?.() }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="sheet" role="presentation">
      <div className="sheet__scrim" onClick={onClose} />
      <div className="sheet__panel" role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <div className="sheet__grip" aria-hidden="true" />
        <div className="sheet__head">
          <h2 className="sheet__title">{title}</h2>
          <IconButton icon={BiX} label="Close" onClick={onClose} />
        </div>
        <div className="sheet__body">{children}</div>
        {footer && <div className="sheet__foot">{footer}</div>}
      </div>
    </div>
  )
}

export function Segmented({ value, onChange, options, label }) {
  return (
    <div className="seg" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value} className="seg__btn" onClick={() => onChange(o.value)}>
          {o.label}
          {o.count != null && <span className="seg__count">{o.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function Badge({ tone = 'plain', children }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export const gbp = (n) => `£${n.toLocaleString('en-GB')}`
