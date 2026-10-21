import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="wrap page-title" style={{ paddingBottom: 100 }}>
      <span className="eyebrow">Wrong turn</span>
      <h1>We’re lost too.</h1>
      <p style={{ margin: '16px 0 26px', color: 'var(--ink-soft)' }}>That trip or entry doesn’t exist. Let’s get you back on the map.</p>
      <Link to="/" className="btn">Back home →</Link>
    </div>
  )
}
