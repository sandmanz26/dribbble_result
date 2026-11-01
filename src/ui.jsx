import { BRANDS } from './data/studio.js'

export const food = (k) => `food/${k}.webp`

// The product's mark: an R that turns into a speech tail, in the one hue.
export function Mark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <path d="M10 23V9h7a4.5 4.5 0 0 1 0 9h-7m7 0 6 5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Mono({ name, hue = 330, size = 32 }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return <span className="mono" aria-hidden="true" style={{ width: size, height: size, fontSize: size * 0.38, background: `hsl(${hue} 70% 93%)`, color: `hsl(${hue} 55% 28%)` }}>{initials}</span>
}

// Brands are recognised by their initials on a pale tile of their own hue (identity, not data).
export function Logo({ brand, name, hue, size = 32 }) {
  const b = brand ? BRANDS[brand] : { name, hue }
  const initials = b.name.split(' ').filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).slice(0, 2).join('')
  return <span className="logo" aria-hidden="true" style={{ width: size, height: size, fontSize: size * 0.38, background: `hsl(${b.hue} 75% 92%)`, color: `hsl(${b.hue} 60% 26%)` }}>{initials}</span>
}

export function Pill({ tone, children, dot }) {
  return <span className={`pill${tone ? ` ${tone}` : ''}`}>{dot && <span className="dot" />}{children}</span>
}
