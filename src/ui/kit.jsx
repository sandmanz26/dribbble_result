import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ICONS from './icons.js'

export function Icon({ name, size = 20, label, className = '' }) {
  const i = ICONS[name]
  if (!i) return null
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox={`0 0 ${i.w} ${i.h}`}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      dangerouslySetInnerHTML={{ __html: i.body }}
    />
  )
}

// The mark: a tick drawn the way an examiner ticks, set beside the name.
export function Wordmark({ to = '/', light = false }) {
  return (
    <Link to={to} className={`wordmark${light ? ' is-light' : ''}`} aria-label="ExamAce home">
      <svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true">
        <rect width="28" height="28" fill="currentColor" />
        <path d="M6 15.5l5 5L22.5 8" fill="none" stroke="var(--mark-ink)" strokeWidth="3.6" strokeLinecap="square" />
      </svg>
      <span>ExamAce</span>
    </Link>
  )
}

// Staggered entrance for the parts of a section. Content is visible without script.
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = el.querySelectorAll('[data-rise]')
    items.forEach((n, i) => {
      n.classList.add('rise-wait')
      n.style.setProperty('--rise-delay', `${Math.min(i, 6) * 75}ms`)
    })
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('[data-rise]').forEach((n) => n.classList.add('rise-in'))
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

export function Section({ className = '', children, ...rest }) {
  const ref = useReveal()
  return (
    <section ref={ref} className={className} {...rest}>
      {children}
    </section>
  )
}

export function AoBar({ mark, max, size = 'm' }) {
  return (
    <span className={`aobar aobar-${size}`} role="img" aria-label={`${mark} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <i key={i} className={i < mark ? 'on' : ''} />
      ))}
    </span>
  )
}

export const CODE_NAMES = {
  K: 'Knowledge (AO1)',
  APP: 'Application (AO2)',
  AN: 'Analysis (AO3)',
  EV: 'Evaluation (AO4)',
  'EV?': 'Evaluation not supported',
  '?': 'Assertion: not yet explained',
}

export function MarginCode({ code }) {
  return (
    <abbr className={`mcode${code.includes('?') ? ' is-query' : ''}`} title={CODE_NAMES[code] || code}>
      {code}
    </abbr>
  )
}
