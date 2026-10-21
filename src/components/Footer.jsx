import { Link } from 'react-router-dom'
import { recentTrips } from '../data/trips.js'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot">
          <div>
            <strong>Wanderlog Gang</strong>
            <p className="muted" style={{ maxWidth: '38ch' }}>Five friends writing up every trip we take together.</p>
          </div>
          <div>
            <h4>Recent trips</h4>
            <ul>{recentTrips().slice(0, 4).map((t) => <li key={t.slug}><Link to={`/trip/${t.slug}`}>{t.title}</Link></li>)}</ul>
          </div>
          <div>
            <h4>Site</h4>
            <ul>
              <li><Link to="/calendar">Calendar</Link></li>
              <li><Link to="/journal">Journal</Link></li>
              <li><Link to="/subscribe">Subscribe</Link></li>
              <li><Link to="/credits">Photo credits</Link></li>
            </ul>
          </div>
        </div>
        <p className="foot-base">© 2026 Wanderlog Gang</p>
      </div>
    </footer>
  )
}
