import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Scene from './Scene.jsx'
import { fmtRange } from '../data/trips.js'

const INTERVAL = 6000

export default function PhotoBanner({ trips }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const go = (n) => setI((n + trips.length) % trips.length)

  useEffect(() => {
    if (paused || reduce) return
    const t = setTimeout(() => go(i + 1), INTERVAL)
    return () => clearTimeout(t)
  }, [i, paused, reduce])

  const cur = trips[i]
  return (
    <section
      className={`banner ${paused ? 'paused' : ''} ${reduce ? 'still' : ''}`}
      style={{ '--dur': `${INTERVAL}ms` }}
      aria-roledescription="carousel"
      aria-label="Recent trips"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="banner-stage" aria-live={paused ? 'polite' : 'off'}>
        {trips.map((t, n) => (
          <div key={t.slug} className={`banner-slide ${n === i ? 'on' : ''}`} aria-hidden={n !== i} role="group" aria-roledescription="slide" aria-label={`${n + 1} of ${trips.length}`}>
            <Scene type={t.scene} palette={t.palette} seed={t.slug} label={`Banner illustration of ${t.place}`} />
          </div>
        ))}
        <div className="banner-arrows">
          <button className="round" onClick={() => go(i - 1)} aria-label="Previous trip">←</button>
          <button className="round" onClick={() => go(i + 1)} aria-label="Next trip">→</button>
        </div>
        <div className="banner-caption">
          <div className="banner-meta"><span className="tag">{cur.tag}</span><span>{fmtRange(cur.start, cur.end)}, {cur.year}</span><span>{cur.place}, {cur.country}</span></div>
          <h2>{cur.title}</h2>
          <p>{cur.summary}</p>
          <Link className="btn sm" to={`/trip/${cur.slug}`}>Read the trip blog →</Link>
        </div>
      </div>
      <div className="banner-nav" role="tablist" aria-label="Choose a trip">
        {trips.map((t, n) => (
          <button key={t.slug} role="tab" aria-selected={n === i} className={`banner-tab ${n === i ? 'on' : ''}`} onClick={() => go(n)}>
            <small>{fmtRange(t.start, t.end)}</small>
            <strong>{t.place}</strong>
          </button>
        ))}
      </div>
    </section>
  )
}
