import { useId } from 'react'

// Golden Stone's mark: a round stone with a square window, the shape of an old Chinese cash coin
// and of a gold weight, in one disc. The same circle is the page's only shape (globe, bullets, frames).
export function Mark({ size = 28, title }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} className="mark">
      <circle cx="16" cy="16" r="15" fill="var(--gold)" />
      <rect x="11.5" y="11.5" width="9" height="9" rx="1" fill="var(--green-deep)" transform="rotate(45 16 16)" />
    </svg>
  )
}

// A strip of kente-style weave: blocks of warp stripes alternating with checked weft, in the
// brand's green, gold, red and black. Used only as an edge, the way a strip of cloth is worn.
export function Kente({ height = 18, className = '' }) {
  const id = useId().replace(/:/g, '')
  const h = 24
  return (
    <svg className={`kente ${className}`} width="100%" height={height} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id={id} width="96" height={h} patternUnits="userSpaceOnUse" patternTransform={`scale(${height / h})`}>
          <rect width="48" height={h} fill="#D2A445" />
          {[3, 9, 15, 21].map((y) => <rect key={y} x="0" y={y} width="48" height="1.6" fill="#16120c" />)}
          {[6, 18, 30, 42].map((x) => <rect key={x} x={x} y="0" width="3" height={h} fill="#0F4A36" />)}
          <rect x="48" width="48" height={h} fill="#0F4A36" />
          {Array.from({ length: 6 }, (_, i) => Array.from({ length: 3 }, (_, j) => (i + j) % 2 ? null : <rect key={`${i}${j}`} x={50 + i * 7.5} y={2 + j * 7.5} width="6" height="6" fill="#D2A445" />))}
          <rect x="48" y="10.5" width="48" height="3" fill="#A93A2C" />
          <rect x="47" width="2" height={h} fill="#16120c" />
          <rect x="95" width="2" height={h} fill="#16120c" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// The Chinese key fret (huiwen), a continuous meander line, used as a thin rule.
export function Fret({ className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`fret ${className}`} width="100%" height="14" aria-hidden="true">
      <defs>
        <pattern id={id} width="28" height="14" patternUnits="userSpaceOnUse">
          <path d="M1 13 V1 H21 V9 H9 V5 H17 M21 13 H27 V1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill={`url(#${id})`} />
    </svg>
  )
}

// A garden-window lattice (square grid with diagonals), used as a quiet texture inside circles.
export function Lattice({ className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`lattice ${className}`} width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 0H40V40H0Z M20 0V40 M0 20H40 M0 0L40 40 M40 0L0 40" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <rect x="15" y="15" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(45 20 20)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
