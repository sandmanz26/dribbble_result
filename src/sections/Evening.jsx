import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, reduced, scrollToId } from '../motion.js'
import { COURSES, photo } from '../data.js'

const ORDINAL = ['First', 'Second', 'Third', 'Fourth', 'Fifth']

// The signature scene: one table, one plate position, five courses served in turn.
// Each new plate turns in like it is being set down; the old one turns away.
export default function Evening() {
  const wrap = useRef()
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      const plates = gsap.utils.toArray('.plate')
      gsap.set(plates.slice(1), { clipPath: 'circle(0% at 50% 50%)', rotate: -40 })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: 0.6,
        },
      })
      plates.forEach((p, i) => {
        if (!i) return
        const at = i - 0.55
        tl.to(plates[i - 1], { rotate: 24, scale: 0.92, duration: 0.5, ease: 'power1.in' }, at)
          .to(p, { clipPath: 'circle(75% at 50% 50%)', rotate: 0, duration: 0.55, ease: 'power2.out' }, at + 0.05)
      })
      tl.to({}, { duration: 0.6 })
      // Follow the plate, not the scrollbar. The timeline keeps easing after the wheel stops
      // (scrub), so the text listens to the timeline itself: plate i lands at time i.
      tl.eventCallback('onUpdate', () => {
        const i = Math.max(0, Math.min(COURSES.length - 1, Math.floor(tl.time() + 0.3)))
        setActive((a) => (a === i ? a : i))
        gsap.set('.rail-fill', { scaleX: tl.progress() })
      })
      gsap.from('.evening-head > *', { y: 40, opacity: 0, stagger: 0.1, scrollTrigger: { trigger: '.evening-head', start: 'top 80%' } })
    }, wrap)
    return () => ctx.revert()
  }, [])

  const c = COURSES[active]
  return (
    <section className="evening" id="evening" aria-labelledby="evening-h">
      <header className="evening-head">
        <h2 id="evening-h">Five courses, one fire.</h2>
        <p>The tasting menu, as it reaches the table. 950k per person, about two and a half hours.</p>
      </header>

      <div className="evening-scroll" ref={wrap} style={{ '--n': COURSES.length }}>
        <div className="evening-sticky">
          <div className="evening-copy" aria-live="polite">
            <p className="course-ord" key={`o${active}`}>{ORDINAL[active]} course</p>
            <h3 key={`h${active}`}>{c.name}</h3>
            <p className="course-text" key={`t${active}`}>{c.text}</p>
          </div>

          <div className="table">
            {COURSES.map((co, i) => (
              <img key={co.key} className="plate" src={photo(co.key)} srcSet={`${photo(co.key, 800)} 800w, ${photo(co.key)} 1600w`} sizes="(min-width: 900px) 46vw, 90vw" alt={co.name} style={{ zIndex: i + 1 }} loading={i ? 'lazy' : 'eager'} />
            ))}
          </div>

          <dl className="evening-facts" key={`f${active}`}>
            <div><dt>From</dt><dd>{c.from}</dd></div>
            <div><dt>Cooked</dt><dd>{c.cooked}</dd></div>
          </dl>

          <div className="rail" aria-hidden="true">
            <span className="rail-line"><span className="rail-fill" /></span>
            <ol>
              {COURSES.map((co, i) => <li key={co.key} className={i === active ? 'is-on' : i < active ? 'is-past' : ''}>{co.short}</li>)}
            </ol>
          </div>
        </div>
      </div>

      {/* Reduced motion and screen readers get the menu as a plain list. */}
      <ol className="evening-list">
        {COURSES.map((co, i) => (
          <li key={co.key}>
            <img src={photo(co.key, 800)} alt="" loading="lazy" />
            <div><p className="course-ord">{ORDINAL[i]} course</p><h3>{co.name}</h3><p>{co.text}</p><p className="muted">{co.from}. {co.cooked.replace(/\.$/, '')}.</p></div>
          </li>
        ))}
      </ol>

      <div className="evening-end">
        <p>Vegetarian version 850k. Paired drinks 650k.</p>
        <a href="#reserve" className="btn btn-accent" onClick={(e) => { e.preventDefault(); scrollToId('reserve') }}>Book a table</a>
      </div>
    </section>
  )
}
