import { useState } from 'react'
import { Link } from 'react-router-dom'
import Scene from '../components/Scene.jsx'
import { allPosts, years, fmtDate } from '../data/trips.js'
import { crewById } from '../data/crew.js'

export default function Journal() {
  const [year, setYear] = useState('all')
  const posts = allPosts().filter((p) => year === 'all' || p.trip.year === year).sort((a, b) => b.date.localeCompare(a.date))
  return (
    <div className="wrap">
      <header className="page-title">
        <span className="eyebrow">Journal</span>
        <h1>Every entry, newest first.</h1>
      </header>
      <div className="filters" role="group" aria-label="Filter by year">
        {['all', ...years].map((y) => <button key={y} className={year === y ? 'on' : ''} aria-pressed={year === y} onClick={() => setYear(y)}>{y === 'all' ? 'All years' : y}</button>)}
      </div>
      {posts.length ? (
        <div style={{ paddingBottom: 80 }}>
          {posts.map((p) => (
            <Link key={p.trip.slug + p.id} to={`/trip/${p.trip.slug}/${p.id}`} className="dispatch">
              <div className="thumb"><Scene type={p.scene} palette={p.trip.palette} seed={p.id} /></div>
              <div>
                <div className="meta"><span>{fmtDate(p.date)}</span><span>· {p.trip.title}</span><span>· {crewById[p.author].name}</span></div>
                <h3>{p.title}</h3>
              </div>
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      ) : <p className="empty">No entries for this year yet.</p>}
    </div>
  )
}
