import { useState } from 'react'
import { Link } from 'react-router-dom'
import Photo from '../components/Photo.jsx'
import Reveal from '../components/Reveal.jsx'
import { allPosts, years, postPhoto, fmtDate } from '../data/trips.js'
import { crewById } from '../data/crew.js'

export default function Journal() {
  const [year, setYear] = useState('all')
  const posts = allPosts().filter((p) => year === 'all' || p.trip.year === year).sort((a, b) => b.date.localeCompare(a.date))
  return (
    <div className="wrap">
      <header className="page-head">
        <h1>Journal</h1>
        <div className="seg" role="group" aria-label="Filter by year">
          {['all', ...years].map((y) => (
            <button key={y} aria-pressed={year === y} onClick={() => setYear(y)}>{y === 'all' ? 'All' : y}</button>
          ))}
        </div>
      </header>
      {posts.length ? (
        <div className="journal">
          {posts.map((p, n) => (
            <Reveal key={p.trip.slug + p.id} delay={(n % 3) * 0.05} className={n === 0 ? 'wide' : ''}>
              <Link to={`/trip/${p.trip.slug}/${p.id}`} className="post-card">
                <Photo src={postPhoto(p.trip, p, n === 0 ? 1280 : 960)} />
                <span className="meta">{fmtDate(p.date)}, {p.trip.title}, by {crewById[p.author].name}</span>
                <h3>{p.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="empty"><p>No posts for {year} yet.</p><button className="btn quiet" onClick={() => setYear('all')}>Show all years</button></div>
      )}
    </div>
  )
}
