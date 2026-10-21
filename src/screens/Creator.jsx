import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { IconChevronLeft, IconShare2, IconCheck, IconClock } from '@tabler/icons-react'
import { Img, Rating, SaveButton, Stars, PlayBadge, Toast, ICON } from '../components/ui.jsx'
import { getCreator, fromPrice, money, reviewsPool } from '../data/creators.js'
import { creatorMedia, coverOf } from '../data/media.js'
import { useStore } from '../app/store.jsx'

const TABS = ['Portfolio', 'Packages', 'Reviews']

export default function Creator() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useStore()
  const c = getCreator(id)
  const [tab, setTab] = useState('Portfolio')
  const [toast, setToast] = useState(false)
  const scroller = useRef(null)
  const { scrollY } = useScroll({ container: scroller })
  const scrim = useTransform(scrollY, [240, 300], [0, 1]) // status bar backdrop appears once the hero is gone
  if (!c) return null
  const media = creatorMedia(c, 500)
  const reviews = reviewsPool.slice(0, 3).map((r, n) => ({ ...r, stars: n === 2 ? Math.round(c.rating) : r.stars }))
  const book = () => nav(user?.guest ? `/signup?next=/book/${c.id}` : `/book/${c.id}`)
  const share = async () => {
    try { await navigator.clipboard?.writeText(window.location.href) } catch { /* clipboard blocked */ }
    setToast(true); setTimeout(() => setToast(false), 1800)
  }

  return (
    <>
      <div className="screen has-cta" ref={scroller}>
        <div className="hero-img">
          <Img src={coverOf(c, 960)} alt={`Work by ${c.name}`} eager />
          <div className="hero-actions">
            <button className="icon-btn glass" onClick={() => nav(-1)} aria-label="Back"><IconChevronLeft {...ICON} /></button>
            <span style={{ display: 'flex', gap: 8 }}>
              <button className="icon-btn glass" onClick={share} aria-label="Share profile"><IconShare2 size={20} stroke={1.6} /></button>
              <SaveButton id={c.id} className="icon-btn glass" iconSize={20} />
            </span>
          </div>
        </div>

        <header className="profile-head">
          <img className="avatar" src={c.avatar} alt="" />
          <h1 style={{ fontSize: 28 }}>{c.name}</h1>
          <p className="muted">{c.title} in {c.area}, London</p>
          <p style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <Rating value={c.rating} count={c.reviews} />
            <span className="small muted" style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}><IconClock size={15} stroke={1.6} />Replies {c.responds}</span>
          </p>
          <div className="stats">
            <div><b className="num">{c.jobs}</b><span className="small muted">Jobs on Proof</span></div>
            <div><b className="num">{2026 - c.since} yrs</b><span className="small muted">Experience</span></div>
            <div><b className="num">{money(fromPrice(c))}</b><span className="small muted">Starting price</span></div>
          </div>
          <p style={{ marginTop: 6 }}>{c.bio}</p>
        </header>

        <div className="sticky-tabs">
          <div className="seg" role="tablist" aria-label="Profile sections">
            {TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}</button>)}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} role="tabpanel" aria-label={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ paddingTop: 8 }}>
            {tab === 'Portfolio' && (
              <div className="masonry">
                {media.map((m, n) => (
                  <Link key={m.key} to={`/creator/${c.id}/media/${n}`} aria-label={`Open item ${n + 1}${m.duration ? ', video' : ''}`}>
                    <Img src={m.src} style={{ aspectRatio: Math.max(0.66, Math.min(1.5, m.ratio)) }}>{m.duration && <PlayBadge duration={m.duration} />}</Img>
                  </Link>
                ))}
              </div>
            )}
            {tab === 'Packages' && (
              <div className="pad" style={{ display: 'grid', gap: 10 }}>
                {c.packages.map((p) => (
                  <div className="pkg" key={p.id}>
                    <div className="top"><h3>{p.name}</h3><b className="num">{money(p.price)}</b></div>
                    <p className="small muted">{p.hours} {p.hours === 1 ? 'hour' : 'hours'}, delivered in {p.deliver}</p>
                    <ul>{p.includes.map((x) => <li key={x}><IconCheck size={15} stroke={2} />{x}</li>)}</ul>
                  </div>
                ))}
              </div>
            )}
            {tab === 'Reviews' && (
              <div className="pad">
                <p style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 8 }}><b style={{ fontSize: 32, letterSpacing: '-0.03em' }} className="num">{c.rating.toFixed(1)}</b><span className="muted">from {c.reviews} reviews</span></p>
                {reviews.map((r) => (
                  <article className="review" key={r.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>{r.name}</b><Stars value={r.stars} /></div>
                    <p>{r.text}</p>
                    <p className="small muted">{r.when}</p>
                  </article>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div className="status-scrim" aria-hidden="true" style={{ opacity: scrim }} />
      <div className="cta-bar">
        <span className="price"><span className="small muted">Packages from</span><b className="num">{money(fromPrice(c))}</b></span>
        <button className="btn" onClick={book}>Check availability</button>
      </div>
      <Toast show={toast}><IconCheck size={18} />Profile link copied</Toast>
    </>
  )
}
