import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CaretRight } from '@phosphor-icons/react'
import Photo from '../components/Photo.jsx'
import Reveal from '../components/Reveal.jsx'
import NotFound from './NotFound.jsx'
import { crewById } from '../data/crew.js'
import { getTrip, trips, photo, postPhoto, fmtRange, fmtDate } from '../data/trips.js'

export default function Trip() {
  const { slug } = useParams()
  const trip = getTrip(slug)
  if (!trip) return <NotFound />
  const sorted = [...trips].sort((a, b) => a.start.localeCompare(b.start))
  const idx = sorted.findIndex((t) => t.slug === slug)
  const prev = sorted[idx - 1]
  const next = sorted[idx + 1]
  const posts = [...trip.posts].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/calendar">{trip.year} calendar</Link><CaretRight size={12} /><span aria-current="page">{trip.title}</span>
      </nav>

      <header className="trip-top">
        <Reveal>
          <p className="meta">{trip.tag}{trip.upcoming ? ', upcoming' : ''}</p>
          <h1>{trip.title}</h1>
          <p className="lede">{trip.summary}</p>
        </Reveal>
        <Photo src={photo(trip.slug, 1920)} alt={`${trip.place}, ${trip.country}`} eager />
      </header>

      <dl className="facts">
        <div><dt>Dates</dt><dd>{fmtRange(trip.start, trip.end)}, {trip.year}</dd></div>
        <div><dt>Country</dt><dd>{trip.country}</dd></div>
        <div><dt>Distance</dt><dd>{trip.stats.distance}</dd></div>
        <div><dt>Cost per person</dt><dd>{trip.stats.budget}</dd></div>
      </dl>

      <div className="trip-body">
        <section aria-labelledby="blog-h">
          <h2 id="blog-h">The trip blog</h2>
          {posts.map((p, n) => (
            <Link key={p.id} to={`/trip/${trip.slug}/${p.id}`} className="entry">
              <Photo src={postPhoto(trip, p, 480)} />
              <div>
                <span className="meta">Day {n + 1}, {fmtDate(p.date)}, by {crewById[p.author].name}</span>
                <h3>{p.title}</h3>
                <p className="muted" style={{ fontSize: 15, marginTop: 4 }}>{p.read} min read</p>
              </div>
              <CaretRight className="go" size={20} />
            </Link>
          ))}
          <div className="pager">
            {prev ? <Link to={`/trip/${prev.slug}`}><span className="meta">Previous trip</span><b>{prev.title}</b></Link> : <span />}
            {next ? <Link className="next" to={`/trip/${next.slug}`}><span className="meta">Next trip</span><b>{next.title}</b></Link> : <span />}
          </div>
        </section>

        <aside className="aside" aria-label="About this trip">
          <div>
            <h3>Who went</h3>
            {trip.crew.map((id) => (
              <div className="who" key={id}>
                <img src={crewById[id].photo} alt="" loading="lazy" />
                <span><b>{crewById[id].name}</b><span className="meta">{crewById[id].role}</span></span>
              </div>
            ))}
          </div>
          <div>
            <h3>Get new posts</h3>
            <p className="muted" style={{ marginBottom: 14 }}>We’ll email you when the next post goes up.</p>
            <Link to="/subscribe" className="btn">Subscribe <ArrowRight size={16} weight="bold" /></Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
