import { useState } from 'react'
import { Link } from 'react-router-dom'
import Photo from './Photo.jsx'
import { years, tripsByYear, fmtRange, photo } from '../data/trips.js'

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

// Twelve months at a glance. Every trip day is a link to that trip's page;
// hovering a trip (in the grid or the list) highlights its whole span.
export default function YearCalendar({ headingLevel = 'h2' }) {
  const [year, setYear] = useState(years[0])
  const [hl, setHl] = useState(null)
  const trips = tripsByYear(year)
  const H = headingLevel
  const hover = (slug) => ({ onMouseEnter: () => setHl(slug), onMouseLeave: () => setHl(null), onFocus: () => setHl(slug), onBlur: () => setHl(null) })

  return (
    <section className="cal" aria-labelledby="cal-h">
      <div className="cal-head">
        <div>
          <H id="cal-h">{year} calendar</H>
          <p className="muted">Every highlighted day belongs to a trip. Click any of them to open that trip.</p>
        </div>
        <div className="seg" role="tablist" aria-label="Year">
          {years.map((y) => (
            <button key={y} role="tab" aria-selected={y === year} onClick={() => { setYear(y); setHl(null) }}>{y}</button>
          ))}
        </div>
      </div>

      <div className="cal-body">
        <div className={`months ${hl ? 'has-hl' : ''}`}>
          {Array.from({ length: 12 }, (_, m) => {
            const first = new Date(year, m, 1)
            const lead = (first.getDay() + 6) % 7 // Monday-first
            const count = new Date(year, m + 1, 0).getDate()
            return (
              <div className="month" key={m}>
                <h3>{first.toLocaleString('en-US', { month: 'long' })}</h3>
                <div className="dow" aria-hidden="true">{DOW.map((d, k) => <span key={k}>{d}</span>)}</div>
                <div className="days">
                  {Array.from({ length: lead }, (_, k) => <span key={`b${k}`} />)}
                  {Array.from({ length: count }, (_, k) => {
                    const d = k + 1
                    const key = iso(year, m, d)
                    const t = trips.find((x) => x.start <= key && key <= x.end)
                    if (!t) return <span key={d} className="day">{d}</span>
                    const cls = ['day', key === t.start && 'start', key === t.end && 'end', hl === t.slug && 'hl'].filter(Boolean).join(' ')
                    return (
                      <Link key={d} to={`/trip/${t.slug}`} className={cls} aria-label={`${t.title}, ${fmtRange(t.start, t.end)}`} {...hover(t.slug)}>{d}</Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="cal-list">
          <h3>{trips.length} {trips.length === 1 ? 'trip' : 'trips'} in {year}</h3>
          {trips.length ? trips.map((t) => (
            <Link key={t.slug} to={`/trip/${t.slug}`} className={`cal-item ${hl === t.slug ? 'hl' : ''}`} {...hover(t.slug)}>
              <Photo src={photo(t.slug, 480)} />
              <span><b>{t.title}</b><span className="meta">{fmtRange(t.start, t.end)}{t.upcoming ? ', upcoming' : ''}</span></span>
            </Link>
          )) : <p className="cal-empty">No trips logged for {year} yet.</p>}
        </div>
      </div>
    </section>
  )
}
