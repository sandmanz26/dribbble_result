import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, reduced, splitLines, goTo } from './motion.js'
import { COURSES, MENU, ROOMS, GUESTS, PRICE, PAIRING, img } from './data.js'

const WORD = 'OSIER'

export function Hero({ children }) {
  const wrap = useRef()
  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      // Arrival: the room fades up from black, the name settles letter by letter.
      gsap.fromTo('.h-img', { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1.06, duration: 2.4, ease: 'power2.out' })
      gsap.from('.h-word span', { opacity: 0, y: 18, duration: 1.4, stagger: 0.08, ease: 'power3.out', delay: 0.5 })
      gsap.from('.h-line, .h-foot', { opacity: 0, y: 14, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 1.1 })
      // Leaving: the room settles and darkens, the letters drift apart like breath on glass.
      const tl = gsap.timeline({ scrollTrigger: { trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: 1 } })
      tl.to('.h-img', { scale: 1, ease: 'none' }, 0)
        .to('.h-dark', { opacity: 0.72, ease: 'none' }, 0)
        .to('.h-word span', { x: (i) => (i - (WORD.length - 1) / 2) * 34, opacity: 0, ease: 'power1.in' }, 0)
        .to('.h-line', { y: -30, opacity: 0, ease: 'power1.in', duration: 0.6 }, 0)
        .to('.h-foot', { y: 30, opacity: 0, ease: 'power1.in', duration: 0.5 }, 0)
    }, wrap)
    return () => ctx.revert()
  }, [])
  return (
    <section className="hero" id="top" ref={wrap}>
      <div className="h-sticky">
        <img className="h-img" src={img('room')} srcSet={`${img('room', 800)} 800w, ${img('room')} 1600w, ${img('room', 2400)} 2400w`} sizes="100vw" alt="The dining room before service, white tables and candles, night outside the tall windows" fetchpriority="high" />
        <div className="h-shade" aria-hidden="true" />
        <div className="h-dark" aria-hidden="true" />
        <div className="h-center">
          <h1 className="h-word" aria-label="Osier">{[...WORD].map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}</h1>
          <p className="h-line">A tasting menu in six courses, served by candlelight in Marylebone.</p>
        </div>
        <div className="h-foot">{children}</div>
      </div>
    </section>
  )
}

export function Story() {
  const ref = useRef()
  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      ref.current.querySelectorAll('[data-lines]').forEach((el) => {
        const lines = splitLines(el)
        gsap.from(lines, { yPercent: 110, duration: 1.3, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 84%' } })
      })
      gsap.fromTo('.s-chef img', { yPercent: -6, scale: 1.08 }, { yPercent: 6, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.s-chef', start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo('.s-produce', { y: 120 }, { y: -60, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.from('.s-chef', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'power4.out', scrollTrigger: { trigger: '.s-chef', start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section className="story" ref={ref} aria-labelledby="story-h">
      <div className="s-text">
        <p className="label">The restaurant</p>
        <h2 id="story-h" data-lines>Twenty-four seats, one menu, one sitting a night.</h2>
        <p className="s-body" data-lines>Osier cooks what British growers, fishermen and farmers bring to the door that week. Six courses, each one made to be eaten slowly, in a room where the loudest thing is the candle.</p>
        <p className="s-sign">Hugo Lindqvist, chef and owner</p>
      </div>
      <figure className="s-chef"><img src={img('chef')} alt="The chef plating a course with fine tweezers" loading="lazy" /></figure>
      <figure className="s-produce"><img src={img('produce', 800)} alt="Scallops, oysters, celeriac, beetroot, dill and a Bramley apple on slate" loading="lazy" /></figure>
    </section>
  )
}

// The signature scene. Each course opens from a slit of light at the centre of the screen;
// the course before it sinks back into the dark. Text follows the timeline, not the scrollbar.
export function Courses() {
  const wrap = useRef()
  const [active, setActive] = useState(0)
  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray('.c-frame')
      const pics = gsap.utils.toArray('.c-frame img')
      gsap.set(frames.slice(1), { clipPath: 'inset(50% 0% 50% 0%)' })
      const tl = gsap.timeline({ scrollTrigger: { trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: 1.1 } })
      tl.fromTo(pics[0], { scale: 1.12 }, { scale: 1.02, duration: 0.8, ease: 'none' }, 0)
      frames.forEach((f, i) => {
        if (!i) return
        const at = i - 0.6
        tl.to(frames[i - 1], { scale: 0.94, opacity: 0.25, duration: 0.6, ease: 'power2.in' }, at)
          .to(f, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.inOut' }, at)
          .fromTo(pics[i], { scale: 1.22 }, { scale: 1.02, duration: 1, ease: 'none' }, at)
      })
      tl.to({}, { duration: 0.5 })
      tl.eventCallback('onUpdate', () => {
        const i = Math.max(0, Math.min(COURSES.length - 1, Math.floor(tl.time() + 0.45)))
        setActive((a) => (a === i ? a : i))
        gsap.set('.c-progress i', { scaleX: tl.progress() })
      })
    }, wrap)
    return () => ctx.revert()
  }, [])
  const c = COURSES[active]
  return (
    <section className="courses" id="menu" aria-labelledby="courses-h">
      <h2 id="courses-h" className="sr-only">The six courses</h2>
      <div className="c-scroll" ref={wrap} style={{ '--n': COURSES.length }}>
        <div className="c-sticky">
          {COURSES.map((co, i) => (
            <div className="c-frame" key={co.key} style={{ zIndex: i + 1 }}>
              <img src={img(co.key)} srcSet={`${img(co.key, 800)} 800w, ${img(co.key)} 1600w, ${img(co.key, 2400)} 2400w`} sizes="100vw" alt={co.title} loading={i < 2 ? 'eager' : 'lazy'} />
            </div>
          ))}
          <div className="c-copy" aria-live="polite">
            <p className="c-num" key={`n${active}`}>{['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'][active]} course</p>
            <h3 key={`t${active}`}>{c.title}</h3>
            <p className="c-text" key={`x${active}`}>{c.text}</p>
          </div>
          <div className="c-progress" aria-hidden="true">
            <i />
            <ol>{COURSES.map((co, i) => <li key={co.key} className={i === active ? 'on' : ''}>{co.name}</li>)}</ol>
          </div>
        </div>
      </div>
      <ol className="c-list">
        {COURSES.map((co) => <li key={co.key}><img src={img(co.key, 800)} alt="" loading="lazy" /><div><h3>{co.title}</h3><p>{co.text}</p></div></li>)}
      </ol>
    </section>
  )
}

export function Menu() {
  const ref = useRef()
  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.m-row', { opacity: 0, y: 24, duration: 1, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: '.m-list', start: 'top 80%' } })
      const lines = splitLines(ref.current.querySelector('[data-lines]'))
      gsap.from(lines, { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: '.m-head', start: 'top 85%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section className="menu" ref={ref} aria-labelledby="menu-h">
      <div className="m-head">
        <p className="label">The menu</p>
        <h2 id="menu-h" data-lines>Autumn, as it is this week.</h2>
      </div>
      <ol className="m-list">
        <li className="m-row m-cols" aria-hidden="true"><span>Course</span><span>With the wine pairing</span></li>
        {MENU.map(([dish, wine], i) => (
          <li className="m-row" key={dish}><span className="m-i">{i + 1}</span><span className="m-dish">{dish}</span><span className="m-wine">{wine}</span></li>
        ))}
      </ol>
      <div className="m-foot">
        <p><b>£{PRICE}</b> per guest. Wine pairing £{PAIRING}, or a non-alcoholic pairing £85.</p>
        <p>About three hours. We cook for allergies when told at booking; the menu cannot be changed on the night.</p>
      </div>
    </section>
  )
}

// Three rooms as a sticky stack: each card holds the screen, then steps back as the next arrives.
export function Rooms() {
  const ref = useRef()
  useLayoutEffect(() => {
    if (reduced()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 760px)', () => {
      const cards = gsap.utils.toArray('.r-card')
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return
        gsap.to(card.querySelector('.r-inner'), {
          scale: 0.9, opacity: 0.35, ease: 'none',
          scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top top', scrub: true },
        })
      })
      gsap.utils.toArray('.r-card img').forEach((im) => gsap.fromTo(im, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'top top', scrub: true } }))
    })
    return () => mm.revert()
  }, [])
  return (
    <section className="rooms" id="room" ref={ref} aria-label="The rooms">
      {ROOMS.map((r) => (
        <article className="r-card" key={r.photo}>
          <div className="r-inner">
            <img src={img(r.photo)} srcSet={`${img(r.photo, 800)} 800w, ${img(r.photo)} 1600w`} sizes="100vw" alt="" loading="lazy" />
            <div className="r-cap"><h2>{r.name}</h2><p>{r.text}</p></div>
          </div>
        </article>
      ))}
    </section>
  )
}

export function Guests() {
  const ref = useRef()
  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.g-bg img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.utils.toArray('.g-quote').forEach((q) => {
        const lines = splitLines(q.querySelector('p'))
        gsap.from(lines, { yPercent: 110, duration: 1.3, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: q, start: 'top 82%' } })
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section className="guests" ref={ref} aria-labelledby="guests-h">
      <div className="g-bg" aria-hidden="true"><img src={img('candle')} alt="" loading="lazy" /></div>
      <h2 id="guests-h" className="sr-only">What guests say</h2>
      {GUESTS.map((g) => (
        <blockquote className="g-quote" key={g.who}><p>“{g.text}”</p><footer>{g.who}, {g.where}</footer></blockquote>
      ))}
    </section>
  )
}

export function Visit() {
  return (
    <section className="visit" id="visit" aria-labelledby="visit-h">
      <figure className="v-photo"><img src={img('door', 800)} alt="The townhouse at night, candlelight in the tall windows" loading="lazy" /></figure>
      <div className="v-info">
        <h2 id="visit-h">Visit</h2>
        <address>14 Weymouth Mews<br />Marylebone, London W1G 7EB</address>
        <dl>
          <div><dt>Dinner</dt><dd>Tuesday to Saturday, one sitting from 7pm</dd></div>
          <div><dt>Lunch</dt><dd>Friday and Saturday, from 12.30pm</dd></div>
          <div><dt>Dress</dt><dd>As you would for a good evening. No jackets required.</dd></div>
          <div><dt>Gift</dt><dd>An evening at Osier, as a card or by email. <a href="#visit" onClick={(e) => e.preventDefault()}>Give a dinner</a></dd></div>
        </dl>
        <p className="v-contact"><a href="#visit" onClick={(e) => e.preventDefault()}>+44 20 7946 0381</a><a href="#visit" onClick={(e) => e.preventDefault()}>Get directions</a></p>
      </div>
      <footer className="foot">
        <span className="foot-word">OSIER</span>
        <div>
          <p>A design prototype with sample content. The restaurant, people, menu, prices and guest words are placeholders.</p>
          <a href="../" className="foot-v1">See version 1</a>
        </div>
      </footer>
    </section>
  )
}

export const goReserve = () => goTo('reserve')
