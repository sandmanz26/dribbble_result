// Shared primitives. Brand-agnostic: every visual decision comes from CSS variables (tokens.js).
import { forwardRef, useEffect, useId, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Info, Loader2, X, XCircle } from 'lucide-react'

export function Button({ variant = 'primary', size = 'md', loading, icon: Icon, iconEnd: IconEnd, to, block, children, className = '', ...rest }) {
  const cls = `btn btn-${variant} btn-${size}${block ? ' btn-block' : ''} ${className}`
  const inner = (
    <>
      {loading ? <Loader2 className="spin" size={18} aria-hidden /> : Icon && <Icon size={18} aria-hidden />}
      {children && <span>{children}</span>}
      {IconEnd && !loading && <IconEnd size={18} aria-hidden />}
    </>
  )
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
  return (
    <button className={cls} aria-busy={loading || undefined} disabled={loading || rest.disabled} {...rest}>
      {inner}
    </button>
  )
}

export function IconButton({ label, icon: Icon, size = 20, className = '', ...rest }) {
  return (
    <button className={`icon-btn ${className}`} aria-label={label} title={label} {...rest}>
      <Icon size={size} aria-hidden />
    </button>
  )
}

export function Field({ label, hint, error, optional, children, id: given }) {
  const auto = useId()
  const id = given || auto
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="field-optional"> (optional)</span>}
      </label>
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {hint && !error && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {error && (
        <p id={`${id}-err`} className="field-error" role="alert">
          <XCircle size={15} aria-hidden /> {error}
        </p>
      )}
    </div>
  )
}

export const Input = forwardRef(function Input(props, ref) {
  return <input ref={ref} className="input" {...props} />
})

export function Select({ children, ...props }) {
  return (
    <div className="select-wrap">
      <select className="input select" {...props}>{children}</select>
    </div>
  )
}

// Radio styled as a selectable card. Used for axles, tiers, location types.
export function Choice({ name, value, checked, onChange, title, detail, aside, disabled }) {
  return (
    <label className={`choice${checked ? ' is-on' : ''}${disabled ? ' is-disabled' : ''}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} disabled={disabled} />
      <span className="choice-mark" aria-hidden />
      <span className="choice-body">
        <span className="choice-title">{title}</span>
        {detail && <span className="choice-detail">{detail}</span>}
      </span>
      {aside && <span className="choice-aside">{aside}</span>}
    </label>
  )
}

export function Check({ checked, onChange, children, detail }) {
  return (
    <label className={`check${checked ? ' is-on' : ''}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="check-box" aria-hidden />
      <span className="choice-body">
        <span className="choice-title">{children}</span>
        {detail && <span className="choice-detail">{detail}</span>}
      </span>
    </label>
  )
}

export function Segmented({ label, value, onChange, options, size }) {
  return (
    <div className={`segmented${size === 'sm' ? ' segmented-sm' : ''}`} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={value === o.value ? 'is-on' : ''}
          onClick={() => onChange(o.value)}
        >
          {o.icon && <o.icon size={16} aria-hidden />}
          {o.label}
        </button>
      ))}
    </div>
  )
}

const ALERT_ICON = { info: Info, success: CheckCircle2, warning: AlertTriangle, danger: XCircle }

export function Alert({ tone = 'info', title, children, action }) {
  const Icon = ALERT_ICON[tone]
  return (
    <div className={`alert alert-${tone}`} role={tone === 'danger' ? 'alert' : 'status'}>
      <Icon size={20} aria-hidden className="alert-icon" />
      <div className="alert-body">
        {title && <p className="alert-title">{title}</p>}
        {children && <div className="alert-text">{children}</div>}
      </div>
      {action && <div className="alert-action">{action}</div>}
    </div>
  )
}

export function Skeleton({ w = '100%', h = 16, r, className = '' }) {
  return <span className={`skeleton ${className}`} style={{ width: w, height: h, borderRadius: r }} aria-hidden />
}

export function Loading({ label, children }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}

export function Empty({ icon: Icon, title, children, action }) {
  return (
    <div className="empty">
      {Icon && (
        <span className="empty-icon" aria-hidden>
          <Icon size={22} />
        </span>
      )}
      <p className="empty-title">{title}</p>
      {children && <div className="empty-text">{children}</div>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  )
}

// Native <dialog>: focus trap, Escape and inert background for free.
export function Sheet({ open, onClose, title, children, footer }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      className="sheet"
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="sheet-title"
    >
      {open && (
        <div className="sheet-inner">
          <header className="sheet-head">
            <h2 id="sheet-title" className="sheet-title">{title}</h2>
            <IconButton icon={X} label="Close" onClick={onClose} />
          </header>
          <div className="sheet-body">{children}</div>
          {footer && <footer className="sheet-foot">{footer}</footer>}
        </div>
      )}
    </dialog>
  )
}

export function Wordmark({ brand, compact }) {
  if (brand === 'valvoline') {
    return (
      <span className="wordmark wordmark-vv">
        <span className="wm-main">Valvoline</span>
        {!compact && <span className="wm-sub">Mobile Brake Service</span>}
      </span>
    )
  }
  return (
    <span className="wordmark wordmark-nb">
      <span className="wm-main">
        Nu<span className="wm-strong">Brakes</span>
      </span>
      {!compact && <span className="wm-sub">A Valvoline company</span>}
    </span>
  )
}
