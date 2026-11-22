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
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = [...el.querySelectorAll('[data-rise]')]
    const vh = window.innerHeight
    // Items already on screen at load show at once; the rest rise as each one arrives.
    const later = items.filter((n) => n.getBoundingClientRect().top > vh * 0.92)
    later.forEach((n) => n.classList.add('rise-wait'))
    let waiting = later
    let frame = 0
    // Reveal everything that has reached the screen, including items jumped past by an anchor link.
    const check = () => {
      frame = 0
      const line = window.innerHeight * 0.92
      const due = waiting.filter((n) => n.getBoundingClientRect().top < line)
      due.forEach((n, i) => {
        n.style.setProperty('--rise-delay', `${Math.min(i, 5) * 75}ms`)
        n.classList.add('rise-in')
      })
      waiting = waiting.filter((n) => !due.includes(n))
      if (!waiting.length) window.removeEventListener('scroll', onScroll)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
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
