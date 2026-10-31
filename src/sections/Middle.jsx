import { useLayoutEffect, useRef, useState } from 'react'
import { Flame, Leaf, Download } from '@mynaui/icons-react'
import { gsap, ScrollTrigger, reduced } from '../motion.js'
import { MENU, ROOMS, REVIEWS, photo, idr } from '../data.js'

export function Menu() {
  const [tab, setTab] = useState('hearth')
  const [hover, setHover] = useState(null)
  const ref = useRef()
  const m = MENU[tab]
  const shown = hover ?? m.items[0].photo

  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.menu-head > *', { y: 36, opacity: 0, stagger: 0.08, scrollTrigger: { trigger: '.menu-head', start: 'top 82%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  // A new tab lists its items in, top to bottom, so the eye follows the change.
  useLayoutEffect(() => {
    if (reduced()) return
    gsap.fromTo('.menu-item', { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.035, duration: 0.45, ease: 'power2.out' })
    setHover(null)
  }, [tab])

  return (
    <section className="menu" id="menu" ref={ref} aria-labelledby="menu-h">
      <div className="menu-head">
        <h2 id="menu-h">The menu</h2>
        <div className="tabs" role="tablist" aria-label="Menu">
          {Object.entries(MENU).map(([k, v]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{v.label}</button>
          ))}
        </div>
      </div>
      <div className="menu-body">
        <div className="menu-list" role="tabpanel" aria-label={m.label}>
          <p className="menu-note">{m.note}</p>
          <ul>
            {m.items.map((it) => (
              <li key={it.name} className="menu-item" tabIndex={0} onMouseEnter={() => setHover(it.photo)} onFocus={() => setHover(it.photo)}>
                <div>
                  <h3>{it.name}
                    {it.tags?.includes('veg') && <span className="tag" title="Vegetarian"><Leaf /> Veg</span>}
                    {it.tags?.includes('nil') && <span className="tag">No alcohol</span>}
                    {it.spice ? <span className="tag spice" title={`Spice ${it.spice} of 3`}>{Array.from({ length: it.spice }).map((_, i) => <Flame key={i} />)}</span> : null}
                  </h3>
                  <p>{it.desc}</p>
                </div>
                <span className="price">{idr(it.price)}</span>
              </li>
            ))}
          </ul>
          <p className="menu-foot">Prices in rupiah, including tax and service. <a href="#menu" onClick={(e) => e.preventDefault()}><Download /> Full menu as PDF</a></p>
        </div>
        <div className="menu-photo" aria-hidden="true">
          {[...new Set(Object.values(MENU).flatMap((x) => x.items.map((i) => i.photo)))].map((p) => (
            <img key={p} src={photo(p, 800)} alt="" className={p === shown ? 'is-on' : ''} loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  )
}

export function Rooms() {
  const wrap = useRef()
  const track = useRef()
  useLayoutEffect(() => {
    if (reduced()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      // Vertical scroll walks you sideways through the rooms, entrance first.
      const dist = () => track.current.scrollWidth - window.innerWidth
      const tween = gsap.to(track.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: wrap.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
      })
      gsap.utils.toArray('.room img').forEach((img) => {
        gsap.fromTo(img, { scale: 1.14 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
      })
      gsap.to('.rooms-progress span', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: wrap.current, start: 'top top', end: () => `+=${dist()}`, scrub: true } })
    })
    return () => mm.revert()
  }, [])
  return (
    <section className="rooms" id="room" ref={wrap} aria-labelledby="rooms-h">
      <div className="rooms-track" ref={track}>
        <div className="rooms-intro">
          <h2 id="rooms-h">The room</h2>
          <p>A pavilion in the trees, open to the valley. Where you sit changes the evening, so you can choose when you book.</p>
          <div className="rooms-progress" aria-hidden="true"><span /></div>
        </div>
        {ROOMS.map((r) => (
          <figure className="room" key={r.photo}>
            <div className="room-img"><img src={photo(r.photo)} srcSet={`${photo(r.photo, 800)} 800w, ${photo(r.photo)} 1600w`} sizes="(min-width: 900px) 50vw, 88vw" alt="" loading="lazy" /></div>
            <figcaption><h3>{r.title}</h3><p>{r.text}</p></figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export function Reviews() {
  const ref = useRef()
  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.review').forEach((r, i) => {
        gsap.from(r, { y: 60 + i * 20, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: r, start: 'top 88%' } })
      })
      gsap.fromTo('.reviews-embers img', { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.reviews', start: 'top bottom', end: 'bottom top', scrub: true } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section className="reviews" ref={ref} aria-labelledby="reviews-h">
      <div className="reviews-embers" aria-hidden="true"><img src={photo('embers')} alt="" loading="lazy" /></div>
      <div className="reviews-inner">
        <h2 id="reviews-h">What guests say</h2>
        <div className="review-list">
          {REVIEWS.map((r) => (
            <blockquote className="review" key={r.who}>
              <p>“{r.text}”</p>
              <footer>{r.who}, {r.where}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

export { ScrollTrigger }
