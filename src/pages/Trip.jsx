import { Link, useParams } from 'react-router-dom'
import Scene from '../components/Scene.jsx'
import { Avatars, Avatar } from '../components/Crew.jsx'
import SubscribeForm from '../components/SubscribeForm.jsx'
import NotFound from './NotFound.jsx'
import { crewById } from '../data/crew.js'
import { getTrip, trips, fmtRange, fmtDate } from '../data/trips.js'

export default function Trip() {
  const { slug } = useParams()
  const trip = getTrip(slug)
  if (!trip) return <NotFound />
  const sorted = [...trips].sort((a, b) => a.start.localeCompare(b.start))
  const idx = sorted.findIndex((t) => t.slug === slug)
  const prev = sorted[idx - 1]; const next = sorted[idx + 1]
  const posts = [...trip.posts].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/#calendar">{trip.year} calendar</Link> / {trip.place}</nav>
      <header className="trip-hero">
        <div className="art"><Scene type={trip.scene} palette={trip.palette} seed={trip.slug} label={`Illustration of ${trip.place}`} /></div>
        <div className="info">
          <div>
            <span className="stamp" style={{ color: 'var(--tomato)' }}>{trip.upcoming ? 'Upcoming' : trip.tag}</span>
            <h1>{trip.title}</h1>
            <p className="sum">{trip.summary}</p>
          </div>
          <div className="facts">
            <div className="fact wide"><span>When</span><b>{fmtRange(trip.start, trip.end)}, {trip.year}</b></div>
            <div className="fact"><span>Where</span><b>{trip.place}</b></div>
            <div className="fact"><span>Country</span><b>{trip.country}</b></div>
            <div className="fact"><span>Distance</span><b>{trip.stats.distance}</b></div>
            <div className="fact"><span>Budget</span><b>{trip.stats.budget}</b></div>
          </div>
        </div>
      </header>

      <div className="trip-layout">
        <section aria-labelledby="blog-h">
          <div className="section-head" style={{ marginBottom: 24 }}>
            <div><span className="eyebrow">Trip blog</span><h2 id="blog-h" style={{ fontSize: 40 }}>{posts.length} {posts.length === 1 ? 'entry' : 'entries'} from {trip.place}</h2></div>
          </div>
          <div>
            {posts.map((p, n) => (
              <Link key={p.id} to={`/trip/${trip.slug}/${p.id}`} className="dispatch">
                <div className="thumb"><Scene type={p.scene} palette={trip.palette} seed={p.id} /></div>
                <div>
                  <div className="meta"><span>Day {n + 1}</span><span>· {fmtDate(p.date)}</span><span>· {p.read} min · {crewById[p.author].name}</span></div>
                  <h3>{p.title}</h3>
                  <p style={{ color: 'var(--ink-soft)', fontSize: 15, marginTop: 4 }}>{p.body[0].slice(0, 110)}…</p>
                </div>
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          <div className="pager" style={{ marginTop: 50 }}>
            {prev ? <Link to={`/trip/${prev.slug}`}><small>← Previous trip</small><strong>{prev.title}</strong></Link> : <span />}
            {next ? <Link className="next" to={`/trip/${next.slug}`}><small>Next trip →</small><strong>{next.title}</strong></Link> : <span />}
          </div>
        </section>

        <aside className="side" aria-label="Trip sidebar">
          <div className="box">
            <h4>Who went</h4>
            {trip.crew.map((id) => (
              <div className="row" key={id}><Avatar id={id} /><div><b>{crewById[id].name}</b><br /><small style={{ fontFamily: 'var(--mono)', color: 'var(--ink-soft)' }}>{crewById[id].role}</small></div></div>
            ))}
          </div>
          <div className="box" style={{ background: 'var(--mustard)' }}>
            <h4>Get the next one</h4>
            <p className="fine" style={{ color: 'var(--ink)', marginBottom: 14 }}>Join the list and hear when new entries land.</p>
            <Link to="/subscribe" className="btn sm ghost">Subscribe →</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
