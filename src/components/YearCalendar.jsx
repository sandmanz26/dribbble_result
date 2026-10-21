import { useState } from 'react'
import { Link } from 'react-router-dom'
import { years, tripsByYear, fmtRange } from '../data/trips.js'

const COLORS = ['#e8563a', '#2f6f73', '#6b4b8a', '#4f7d3a', '#b5651d', '#a14b6e']
const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

export default function YearCalendar() {
  const [year, setYear] = useState(years[0])
  const [hl, setHl] = useState(null)
  const trips = tripsByYear(year)
  const colorOf = Object.fromEntries(trips.map((t, n) => [t.slug, COLORS[n % COLORS.length]]))

  const months = Array.from({ length: 12 }, (_, m) => {
    const first = new Date(year, m, 1)
    const lead = (first.getDay() + 6) % 7 // Monday-first grid
    const count = new Date(year, m + 1, 0).getDate()
    const cells = []
    for (let k = 0; k < lead; k++) cells.push(<span key={`b${k}`} />)
    for (let d = 1; d <= count; d++) {
      const key = iso(year, m, d)
      const t = trips.find((x) => x.start <= key && key <= x.end)
      if (t) {
        cells.push(
          <Link
            key={d}
            to={`/trip/${t.slug}`}
            className={`day ${key === t.start ? 'start' : ''} ${key === t.end ? 'end' : ''} ${hl === t.slug ? 'hl' : ''}`}
            style={{ '--c': colorOf[t.slug] }}
            aria-label={`${t.title}, ${fmtRange(t.start, t.end)}`}
            onMouseEnter={() => setHl(t.slug)}
            onMouseLeave={() => setHl(null)}
          >{d}</Link>
        )
      } else cells.push(<span key={d} className="day">{d}</span>)
    }
    const n = trips.filter((t) => t.start.slice(5, 7) === String(m + 1).padStart(2, '0')).length
    return (
      <div className="month" key={m}>
        <h3>{first.toLocaleString('en-US', { month: 'long' })}{n > 0 && <small>{n} {n > 1 ? 'trips' : 'trip'}</small>}</h3>
        <div className="dow" aria-hidden="true">{DOW.map((d, k) => <span key={k}>{d}</span>)}</div>
        <div className="days">{cells}</div>
      </div>
    )
  })

  return (
    <div className="cal-wrap" id="calendar">
      <div className="section-head">
        <div>
          <span className="eyebrow">The yearly calendar</span>
          <h2>Pick a date, land on a trip.</h2>
        </div>
        <div className="year-tabs" role="tablist" aria-label="Choose year">
          {years.map((y) => (
            <button key={y} role="tab" aria-selected={y === year} className={`year-tab ${y === year ? 'on' : ''}`} onClick={() => setYear(y)}>{y}</button>
          ))}
        </div>
      </div>
      <div className="cal-grid">{months}</div>
      <div className="cal-legend" aria-label={`Trips in ${year}`}>
        {trips.map((t) => (
          <Link
            key={t.slug}
            to={`/trip/${t.slug}`}
            className={`legend-item ${hl === t.slug ? 'hl' : ''}`}
            style={{ '--c': colorOf[t.slug] }}
            onMouseEnter={() => setHl(t.slug)}
            onMouseLeave={() => setHl(null)}
          >
            <i />{t.title.replace(' (Upcoming)', '')} <small>{fmtRange(t.start, t.end)}</small>
          </Link>
        ))}
      </div>
    </div>
  )
}
