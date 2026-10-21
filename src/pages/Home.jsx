import { Link } from 'react-router-dom'
import PhotoBanner from '../components/PhotoBanner.jsx'
import YearCalendar from '../components/YearCalendar.jsx'
import TripCard from '../components/TripCard.jsx'
import SubscribeBlock from '../components/SubscribeBlock.jsx'
import Scene from '../components/Scene.jsx'
import { Avatar } from '../components/Crew.jsx'
import { crew } from '../data/crew.js'
import { trips, featuredTrips, allPosts, fmtDate } from '../data/trips.js'

export default function Home() {
  const recent = featuredTrips().slice(0, 4)
  const upcoming = trips.find((t) => t.upcoming)
  const posts = allPosts().filter((p) => !p.trip.upcoming).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  const countries = new Set(trips.map((t) => t.country.split(' → ')[0])).size

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-top">
            <div>
              <span className="eyebrow">Est. 2024 · Five friends, many maps</span>
              <h1 style={{ marginTop: 14 }}>Our year, <em>one trip</em> at a time.</h1>
            </div>
            <p>A shared travel journal from a gang of friends. Pick a trip from the banner or the calendar and read the story behind it.</p>
          </div>
          <PhotoBanner trips={recent} />
          <div className="ticker" aria-label="Gang stats">
            <div className="stat"><b>{trips.filter((t) => !t.upcoming).length}</b><span>Trips logged</span></div>
            <div className="stat"><b>{allPosts().length}</b><span>Journal entries</span></div>
            <div className="stat"><b>{countries}+</b><span>Countries</span></div>
            {upcoming && <Link to={`/trip/${upcoming.slug}`} className="stat" style={{ background: 'var(--mustard)' }}><b>Dec 4</b><span>Next: {upcoming.place} →</span></Link>}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="wrap"><YearCalendar /></div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div><span className="eyebrow">This year’s trips</span><h2>Every trip has its own blog.</h2></div>
            <Link className="btn ghost sm" to="/journal">Browse all entries →</Link>
          </div>
          <div className="grid cols-3">
            {[...featuredTrips().slice(0, 3), upcoming].filter(Boolean).slice(0, 3).map((t) => <TripCard key={t.slug} trip={t} />)}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div><span className="eyebrow">Fresh off the road</span><h2>Latest dispatches</h2></div>
          </div>
          <div>
            {posts.map((p) => (
              <Link key={p.trip.slug + p.id} to={`/trip/${p.trip.slug}/${p.id}`} className="dispatch">
                <div className="thumb"><Scene type={p.scene} palette={p.trip.palette} seed={p.id} /></div>
                <div>
                  <div className="meta"><span>{fmtDate(p.date)}</span><span>· {p.trip.place}</span><span>· {p.read} min</span></div>
                  <h3>{p.title}</h3>
                </div>
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div><span className="eyebrow">Who’s travelling</span><h2>The crew</h2></div>
            <p>Everyone writes. Everyone’s opinion on pastries is correct.</p>
          </div>
          <div className="crew-strip">
            {crew.map((c) => (
              <div className="crew-card" key={c.id}>
                <Avatar id={c.id} large />
                <h3>{c.name}</h3>
                <small>{c.role}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap"><SubscribeBlock /></div>
      </section>
    </>
  )
}
