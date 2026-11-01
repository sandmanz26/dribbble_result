import { useEffect, useRef, useState } from 'react'
import { BiX } from 'react-icons/bi'
import { people } from '../data/people.js'

export const photo = (name, small) => `photos/${name}${small ? '-sm' : ''}.webp`

export function Photo({ name, small, alt = '', className = '', ...rest }) {
  return <img className={`photo ${className}`} src={photo(name, small)} alt={alt} loading="lazy" decoding="async" {...rest} />
}

// A photo seen through a camera monitor: frame lines in the corners and a burn-in
// label, the way crews actually see images on set.
export function Frame({ name, small, alt = '', burn, tc, className = '', children }) {
  return (
    <figure className={`frame ${className}`}>
      <Photo name={name} small={small} alt={alt} className="frame__img" />
      <span className="frame__lines" aria-hidden="true"><i /><i /><i /><i /></span>
      {(burn || tc) && (
        <span className="frame__burn mono" aria-hidden="true">
          <span>{burn}</span><span>{tc}</span>
        </span>
      )}
      {children}
    </figure>
  )
}

export function Avatar({ id, size = 36 }) {
  const p = people[id]
  if (!p) return null
  return <img className="avatar" src={`photos/${p.photo}.webp`} alt={p.name} width={size} height={size} style={{ width: size, height: size }} loading="lazy" />
}

export function Stack({ ids, size = 28, max = 6 }) {
  const shown = ids.slice(0, max)
  const more = ids.length - shown.length
  return (
    <span className="stack" style={{ '--s': `${size}px` }}>
      {shown.map((id) => <Avatar key={id} id={id} size={size} />)}
      {more > 0 && <span className="stack__more mono" style={{ width: size, height: size }}>+{more}</span>}
    </span>
  )
}

export function Button({ variant = 'ink', size, icon: Icon, iconEnd: End, children, className = '', ...rest }) {
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

// Press and hold for decisions that tell someone else something (challenge, book, offer).
// A slip of the thumb should not send a booking. Keyboard: hold Enter or Space.
export function HoldButton({ onDone, children, ms = 750, variant = 'green', className = '', disabled }) {
  const [p, setP] = useState(0)
  const raf = useRef(0)
  const t0 = useRef(0)
  const done = useRef(false)
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const stop = () => { cancelAnimationFrame(raf.current); if (!done.current) setP(0) }
  const start = () => {
    if (disabled) return
    done.current = false
    t0.current = performance.now()
    const tick = (now) => {
      const v = Math.min(1, (now - t0.current) / (reduce ? 1 : ms))
      setP(v)
      if (v >= 1) { done.current = true; onDone(); setTimeout(() => setP(0), 400); return }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <button
      className={`hold hold--${variant} ${className}`}
      disabled={disabled}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); start() } }}
      onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ') stop() }}
      onContextMenu={(e) => e.preventDefault()}
      aria-describedby="hold-hint"
    >
      <span className="hold__fill" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />
      <span className="hold__label">{children}</span>
      <span className="hold__hint mono" aria-hidden="true">{p > 0 && p < 1 ? 'Keep holding' : 'Hold'}</span>
    </button>
  )
}

export function HoldHint() {
  return <span id="hold-hint" className="sr-only">Press and hold to confirm</span>
}

export function Sheet({ open, onClose, title, children, footer }) {
  const ref = useRef(null)
  const back = useRef(null)
  useEffect(() => {
    if (!open) return
    back.current = document.activeElement
    const el = ref.current
    el?.querySelector('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])')?.focus()
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

// Text tabs with an underline, not pills.
export function Tabs({ value, onChange, options, label }) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value} className="tabs__btn" onClick={() => onChange(o.value)}>
          {o.label}{o.count != null && <sup className="mono">{o.count}</sup>}
        </button>
      ))}
    </div>
  )
}

// Section with a call-sheet row number in the left rail.
export function Section({ no, title, aside, children, className = '', id }) {
  return (
    <section className={`sec ${className}`} aria-labelledby={id}>
      <div className="sec__head">
        <span className="sec__no mono" aria-hidden="true">{no}</span>
        <h2 className="sec__title" id={id}>{title}</h2>
        {aside && <span className="sec__aside">{aside}</span>}
      </div>
      {children}
    </section>
  )
}

export const gbp = (n) => `£${n.toLocaleString('en-GB')}`
