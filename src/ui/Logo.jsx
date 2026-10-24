// Caravan's mark: three travellers on one arc, heading the same way.
export function Mark({ size = 32, tone = 'brand' }) {
  return (
    <svg className={`mark mark-${tone}`} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="12" className="mark-bg" />
      <path d="M8 27c4.5-8.5 9-12.5 14-12.5S29.5 17 32 21" className="mark-arc" />
      <circle cx="10.6" cy="22.6" r="2.6" className="mark-dot" />
      <circle cx="21.6" cy="14.6" r="2.6" className="mark-dot" />
      <circle cx="31.4" cy="20" r="3.4" className="mark-lead" />
    </svg>
  )
}

export function Wordmark({ size = 28, tone = 'brand' }) {
  return (
    <span className={`wordmark wordmark-${tone}`} style={{ fontSize: size * 0.82 }}>
      <Mark size={size} tone={tone} />
      <span>caravan</span>
    </span>
  )
}
