import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from '@phosphor-icons/react'
import Photo from './Photo.jsx'
import { photo, fmtRange } from '../data/trips.js'

const INTERVAL = 7000

// Large photo banner of recent trips. Auto-advances (paused on hover/focus,
// off for reduced motion); thumbnails double as tabs and progress indicators.
export default function PhotoBanner({ trips }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const auto = !paused && !reduce

  useEffect(() => {
    if (!auto) return
    const t = setTimeout(() => setI((n) => (n + 1) % trips.length), INTERVAL)
    return () => clearTimeout(t)
  }, [i, auto, trips.length])

  const cur = trips[i]
  return (
    <section
      className="banner"
      aria-roledescription="carousel"
      aria-label="Recent trips"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={cur.slug}
          className="slide"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Photo src={photo(cur.slug, 1920)} alt={`${cur.place}, ${cur.country}`} eager={i === 0} />
        </motion.div>
      </AnimatePresence>

      <div className="banner-copy" aria-live={paused ? 'polite' : 'off'}>
        <motion.div key={cur.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
          <p className="meta">{fmtRange(cur.start, cur.end)}, {cur.year} in {cur.place}, {cur.country}</p>
          <h1>{cur.title}</h1>
          <p>{cur.summary}</p>
          <Link className="btn on-photo" to={`/trip/${cur.slug}`}>Read the trip <ArrowRight size={16} weight="bold" /></Link>
        </motion.div>
      </div>

      <div className="banner-thumbs" role="tablist" aria-label="Choose a trip">
        {trips.map((t, n) => (
          <button key={t.slug} role="tab" aria-selected={n === i} className="thumb-btn" onClick={() => setI(n)} aria-label={t.title}>
            <Photo src={photo(t.slug, 480)} />
            <span className="label">{t.place}</span>
            <span className="bar">
              {n === i && (
                <motion.i
                  key={`${t.slug}-${auto}`}
                  initial={{ scaleX: auto ? 0 : 1 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: auto ? INTERVAL / 1000 : 0, ease: 'linear' }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
