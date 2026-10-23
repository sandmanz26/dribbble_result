// Nelum (lotus) mark for V1: three petals from one base. A logo, not an icon.
export default function Mark({ size = 28, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="currentColor" />
      <g fill="none" stroke="var(--mark-ink, #fff)" strokeWidth="2">
        <ellipse cx="16" cy="15" rx="4" ry="9" />
        <ellipse cx="16" cy="15" rx="4" ry="9" transform="rotate(-50 16 22)" />
        <ellipse cx="16" cy="15" rx="4" ry="9" transform="rotate(50 16 22)" />
      </g>
    </svg>
  )
}
