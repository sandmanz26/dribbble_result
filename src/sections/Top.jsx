import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight } from '@mynaui/icons-react'
import { gsap, ScrollTrigger, reduced, scrollToId, getLenis } from '../motion.js'
import { photo } from '../data.js'

export function Nav({ onOrder }) {
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const bar = useRef()

  useEffect(() => {
    // Hide on the way down, return on the way up: the page gets the whole screen while reading.
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const y = self.scroll()
        setSolid(y > 24)
        setHidden(self.direction === 1 && y > window.innerHeight * 1.2)
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
      },
    })
    return () => st.kill()
  }, [])

  const go = (id) => (e) => { e.preventDefault(); scrollToId(id) }
  return (
    <header className={`nav ${solid ? 'is-solid' : ''} ${hidden ? 'is-hidden' : ''}`}>
      <a href="#top" className="wordmark" onClick={go('top')} aria-label="Rimba, back to top">Rimba</a>
      <nav aria-label="Sections">
        <a href="#evening" onClick={go('evening')}>The evening</a>
        <a href="#menu" onClick={go('menu')}>Menu</a>
        <a href="#room" onClick={go('room')}>The room</a>
        <a href="#visit" onClick={go('visit')}>Visit</a>
      </nav>
      <div className="nav-actions">
        <button className="link-btn" onClick={onOrder}>Order to take home</button>
        <a href="#reserve" className="btn btn-accent" onClick={go('reserve')}>Book a table</a>
      </div>
      <span className="nav-progress" ref={bar} aria-hidden="true" />
    </header>
  )
}

export function Hero() {
  const wrap = useRef()
  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      // The room recedes into a framed window as the story begins.
      const tl = gsap.timeline({ scrollTrigger: { trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: true } })
      tl.fromTo('.hero-frame', { clipPath: 'inset(0vh 0vw 0vh 0vw round 0px)' }, { clipPath: 'inset(9vh 7vw 9vh 7vw round 22px)', ease: 'none' }, 0)
        .fromTo('.hero-img', { scale: 1.12 }, { scale: 1, ease: 'none' }, 0)
        .to('.hero-copy', { yPercent: -24, opacity: 0, ease: 'power2.in', duration: 0.3 }, 0)
        .fromTo('.hero-after', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35 }, 0.62)
      gsap.from('.hero-copy > *', { y: 28, opacity: 0, duration: 1.1, stagger: 0.09, ease: 'power3.out', delay: 0.15 })
      gsap.from('.hero-img', { opacity: 0, duration: 1.4, ease: 'power2.out' })
    }, wrap)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={wrap}>
      <div className="hero-sticky">
        <div className="hero-frame">
          <img className="hero-img" src={photo('hero')} srcSet={`${photo('hero', 800)} 800w, ${photo('hero')} 1600w`} sizes="100vw" alt="The dining room at dusk, open to the jungle, with the wood fire burning at the back" fetchpriority="high" />
          <div className="hero-shade" aria-hidden="true" />
        </div>
        <div className="hero-copy">
          <h1>Cooked over fire, from the forest and the sea.</h1>
          <p>Indonesian cooking at a wood-fire hearth above Ubud. Dinner Tuesday to Sunday.</p>
          <div className="hero-ctas">
            <a href="#reserve" className="btn btn-accent btn-lg" onClick={(e) => { e.preventDefault(); scrollToId('reserve') }}>Book a table</a>
            <a href="#evening" className="btn btn-ghost btn-lg" onClick={(e) => { e.preventDefault(); scrollToId('evening') }}>See tonight's menu <ArrowRight /></a>
          </div>
        </div>
        <p className="hero-after" aria-hidden="true">Rimba means forest.</p>
      </div>
    </section>
  )
}

export function Story() {
  const ref = useRef()
  const text = 'Rimba means forest. Everything we cook comes from within a day of the kitchen: the river below us, the rice terraces at Jatiluwih, the reef at Amed and the garden behind the hearth. It all meets the same fire.'
  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      // Words light up as you read them, at reading pace, not all at once.
      gsap.fromTo('.story-text .w', { opacity: 0.16 }, {
        opacity: 1, stagger: 0.05, ease: 'none',
        scrollTrigger: { trigger: '.story-text', start: 'top 78%', end: 'bottom 45%', scrub: true },
      })
      gsap.fromTo('.story-pantry img', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.story-pantry', start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo('.story-chef', { y: 80 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.story-media', start: 'top bottom', end: 'bottom top', scrub: true } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section className="story" ref={ref} aria-labelledby="story-h">
      <h2 id="story-h" className="sr-only">About Rimba</h2>
      <p className="story-text">{text.split(' ').map((w, i) => <span className="w" key={i}>{w} </span>)}</p>
      <div className="story-media">
        <figure className="story-pantry">
          <img src={photo('pantry')} srcSet={`${photo('pantry', 800)} 800w, ${photo('pantry')} 1600w`} sizes="(min-width: 900px) 55vw, 100vw" alt="Torch ginger, galangal, candlenuts, chillies, lime leaves and a fresh mackerel on dark stone" loading="lazy" />
        </figure>
        <figure className="story-chef">
          <img src={photo('chef', 800)} alt="Chef Kadek Sari turning fish skewers over the embers" loading="lazy" />
          <figcaption><b>Kadek Sari</b>, chef. Cooked in Jakarta and Copenhagen, came home to cook with fire.</figcaption>
        </figure>
      </div>
    </section>
  )
}

// Keep ScrollTrigger measurements right after images and fonts load.
export function useRefreshOnLoad() {
  useEffect(() => {
    const r = () => ScrollTrigger.refresh()
    window.addEventListener('load', r)
    document.fonts?.ready.then(r)
    return () => window.removeEventListener('load', r)
  }, [])
  return getLenis
}
