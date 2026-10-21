import { Link } from 'react-router-dom'
import { featuredTrips } from '../data/trips.js'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <h4>Wanderlog Gang</h4>
            <p style={{ maxWidth: '36ch', color: '#d6cfbb' }}>Five friends, one shared calendar, and a blog for every adventure. Written between buses.</p>
          </div>
          <div>
            <h4>Latest trips</h4>
            <ul>{featuredTrips().slice(0, 4).map((t) => <li key={t.slug}><Link to={`/trip/${t.slug}`}>{t.title}</Link></li>)}</ul>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/journal">All journal entries</Link></li>
              <li><Link to="/subscribe">Subscribe for updates</Link></li>
            </ul>
          </div>
        </div>
        <div className="copy"><span>© 2026 Wanderlog Gang</span><span>Mock data · No backend</span></div>
      </div>
    </footer>
  )
}
