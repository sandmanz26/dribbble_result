import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="wrap lost">
      <h1>Wrong turn</h1>
      <p className="muted">We couldn’t find that trip or post.</p>
      <Link to="/calendar" className="btn">Open the calendar</Link>
    </div>
  )
}
