// The BRTH device drawn in SVG: silver cap, twist section, body with the vertical wordmark.
// `open` (0 to 1) twists the top a quarter turn, lifts it and raises the nozzle.
export default function Device({ flavor, open = 0, className = '', label = true }) {
  const lift = Math.min(1, Math.max(0, (open - 0.25) / 0.75))
  const twist = Math.min(1, open / 0.6)
  const dark = flavor.field
  const shade = flavor.id === 'arctic' ? '#08224f' : '#0a3a22'
  const hi = flavor.id === 'arctic' ? '#2f5594' : '#2c6a49'
  return (
    <svg className={`device ${className}`} viewBox="0 0 140 440" role="img" aria-label={`${flavor.name} BRTH device${open > 0.9 ? ', twisted open' : ''}`}>
      {/* nozzle, hidden inside until the top lifts */}
      <g transform={`translate(0 ${30 - lift * 30})`}>
        <rect x="62" y="38" width="16" height="26" rx="3" fill="#c9cbcd" />
        <rect x="66" y="42" width="8" height="4" rx="2" fill="#7b7e82" />
      </g>
      {/* top: cap + twist section, lifts and turns */}
      <g transform={`translate(0 ${-lift * 26})`}>
        <rect x="26" y="56" width="88" height="46" rx="8" fill="#b9bcc0" />
        <rect x="26" y="56" width="22" height="46" rx="8" fill="#d6d8db" />
        <rect x="92" y="56" width="22" height="46" rx="8" fill="#9a9da1" />
        <circle cx="70" cy="68" r="5" fill="#8b8e92" />
        <circle cx="70" cy="68" r="2" fill="#5d6064" />
        <rect x="22" y="100" width="96" height="104" rx="6" fill={dark} />
        <clipPath id={`tw-${flavor.id}`}><rect x="22" y="100" width="96" height="104" rx="6" /></clipPath>
        <g clipPath={`url(#tw-${flavor.id})`}>
          <rect x={22 + twist * 40} y="100" width="22" height="104" fill={hi} opacity=".55" />
          <rect x={96 - twist * 40} y="100" width="22" height="104" fill={shade} opacity=".7" />
        </g>
      </g>
      {/* body */}
      <rect x="22" y="206" width="96" height="214" rx="10" fill={dark} />
      <rect x="22" y="206" width="20" height="214" rx="10" fill={hi} opacity=".45" />
      <rect x="98" y="206" width="20" height="214" rx="10" fill={shade} opacity=".7" />
      <line x1="22" y1="205" x2="118" y2="205" stroke={shade} strokeWidth="2" />
      {label && (
        <g fill="#f6f5f1">
          <text x="0" y="0" transform="translate(82 228) rotate(90)" fontFamily="'Work Sans Variable', sans-serif" fontWeight="800" fontSize="44" letterSpacing="-1">BRTH</text>
          <text x="70" y="370" textAnchor="middle" fontFamily="'Work Sans Variable', sans-serif" fontWeight="500" fontSize="9" letterSpacing="3">LABS</text>
          <text x="70" y="392" textAnchor="middle" fontFamily="'Work Sans Variable', sans-serif" fontWeight="700" fontSize="9" letterSpacing="1">{flavor.name.toUpperCase()}</text>
        </g>
      )}
    </svg>
  )
}
