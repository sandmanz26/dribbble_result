import { Link } from 'react-router-dom'
import { ArrowRight, CaretRight } from '@phosphor-icons/react'
import PhotoBanner from '../components/PhotoBanner.jsx'
import YearCalendar from '../components/YearCalendar.jsx'
import TripCard from '../components/TripCard.jsx'
import SubscribeForm from '../components/SubscribeForm.jsx'
import Photo from '../components/Photo.jsx'
import Reveal from '../components/Reveal.jsx'
import { crew, crewById } from '../data/crew.js'
import { recentTrips, upcomingTrip, allPosts, photo, postPhoto, fmtRange, fmtDate } from '../data/trips.js'

export function SubscribeSection({ as: H = 'h2' }) {
  return (
    <Reveal as="section" className="subscribe" aria-labelledby="sub-h">
      <div>
        <H id="sub-h">Hear about the next trip first</H>
        <p className="lede">Get an email when we announce a trip or publish a new post. Pick only the updates you want.</p>
      </div>
      <SubscribeForm />
    </Reveal>
  )
}

export default function Home() {
  const recent = recentTrips()
  const next = upcomingTrip()
  const thisYear = recent.filter((t) => t.year === 2026).slice(0, 3)
  const posts = allPosts().filter((p) => !p.trip.upcoming).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  return (
    <>
      <div className="hero wrap"><PhotoBanner trips={recent.slice(0, 4)} /></div>

      <div className="wrap">
        <Reveal as="section" className="statement" aria-label="About">
          <h2>Five friends, one shared calendar and a blog for every trip.</h2>
          {next && (
            <Link to={`/trip/${next.slug}`} className="next-trip">
              <Photo src={photo(next.slug, 480)} alt={next.place} />
              <span>
                <span className="meta">Next trip, {fmtRange(next.start, next.end)}</span>
                <strong>{next.title}</strong>
                <span className="link">See the plan <ArrowRight size={14} weight="bold" /></span>
              </span>
            </Link>
          )}
        </Reveal>

        <YearCalendar />

        <section className="trips" aria-labelledby="trips-h">
          <div className="trips-head">
            <h2 id="trips-h">This year so far</h2>
            <Link to="/journal" className="link">All posts <ArrowRight size={14} weight="bold" /></Link>
          </div>
          <div className="trio">
            {thisYear.map((t, n) => <Reveal key={t.slug} delay={n * 0.08}><TripCard trip={t} layout={n ? 'row' : undefined} /></Reveal>)}
          </div>
        </section>

        <section className="dispatches" aria-labelledby="posts-h">
          <h2 id="posts-h">Latest posts</h2>
          <div>
            {posts.map((p, n) => (
              <Reveal key={p.trip.slug + p.id} delay={n * 0.05}>
                <Link to={`/trip/${p.trip.slug}/${p.id}`} className="entry">
                  <Photo src={postPhoto(p.trip, p, 480)} />
                  <div>
                    <span className="meta">{fmtDate(p.date)}, by {crewById[p.author].name}</span>
                    <h3>{p.title}</h3>
                  </div>
                  <CaretRight className="go" size={20} />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="crew" aria-labelledby="crew-h">
          <h2 id="crew-h">Who writes this</h2>
          <p className="muted" style={{ maxWidth: '52ch' }}>We met at university in 2016 and started travelling together in 2024. Everyone writes, and everyone gets a byline.</p>
          <div className="crew-row">
            {crew.map((c, n) => (
              <Reveal key={c.id} delay={n * 0.06} className="person">
                <Photo src={c.photo} alt={c.name} />
                <b>{c.name}</b>
                <span className="meta">{c.role}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <SubscribeSection />
      </div>
    </>
  )
}
