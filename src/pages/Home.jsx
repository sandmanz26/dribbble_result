import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { SlArrowRight, SlClock, SlLocationPin } from 'react-icons/sl'
import { MENU, STEPS, CAFE, usd, isOpen } from '../data.js'
import { useReveal, useScroll, reduced, Bubbles } from '../App.jsx'

export default function Home() {
  const ref = useReveal()
  return (
    <div ref={ref}>
      <Hero />
      <Journey />
      <Bowls />
      <Visit />
      <TakeHome />
    </div>
  )
}

// The word gets softer and rounder as you scroll, the way foam does when you whisk.
function Hero() {
  const word = useRef(null)
  const bowl = useRef(null)
  useScroll(() => {
    if (reduced()) return
    const p = Math.min(1, scrollY / (innerHeight * 0.7))
    word.current?.style.setProperty('--soft', (30 + p * 70).toFixed(0))
    word.current?.style.setProperty('--wght', (780 - p * 260).toFixed(0))
    bowl.current?.style.setProperty('--turn', `${(scrollY * 0.12).toFixed(1)}deg`)
  })
  const st = isOpen()
  return (
    <section className="hero" aria-labelledby="h-h">
      <div className="hero-text">
        <h1 id="h-h">matcha, whisked<br />until it&rsquo;s <em ref={word} className="fluffy">fluffy.</em></h1>
        <p className="lede">First-harvest matcha from one farm in Kyoto, sifted and whisked by hand for every cup. A soft, cheerful place to slow down.</p>
        <div className="cta-row">
          <Link to="/menu" className="btn">See the menu<SlArrowRight aria-hidden="true" /></Link>
          <Link to="/about" className="link">How we make it</Link>
        </div>
        <p className="hero-note"><i className={st.open ? 'on' : ''} />{st.open ? 'Open now' : 'Closed now'}, {CAFE.street}, {CAFE.suburb}</p>
      </div>
      <div className="hero-art">
        <div className="bowl" ref={bowl}><img src="img/bowl.webp" alt="Fluffy jade green matcha foam in a speckled bowl, from above" width="1200" height="1200" /></div>
        <Bubbles n={10} />
        <span className="leaf l1" aria-hidden="true" /><span className="leaf l2" aria-hidden="true" />
      </div>
    </section>
  )
}

// From one field to the bowl: a green line draws itself between the three stops.
function Journey() {
  const box = useRef(null)
  const path = useRef(null)
  useScroll(() => {
    const el = box.current, pth = path.current
    if (!el || !pth) return
    const r = el.getBoundingClientRect()
    const p = reduced() ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / r.height))
    const len = pth.getTotalLength()
    pth.style.strokeDasharray = len
    pth.style.strokeDashoffset = (len * (1 - p)).toFixed(0)
  })
  return (
    <section className="journey" aria-labelledby="j-h">
      <div className="wrap">
        <h2 id="j-h" data-r>from one field<br />to your bowl</h2>
        <p className="sub" data-r>Most cafe matcha is a cooking powder that turns brown and bitter. Ours is shaded, picked once, milled on stone and whisked while you watch.</p>
        <div className="stops" ref={box}>
          <svg className="vine" viewBox="0 0 100 300" preserveAspectRatio="none" aria-hidden="true">
            <path ref={path} d="M30 0 C 90 40, 90 70, 50 100 S 5 170, 50 200 S 95 270, 60 300" />
          </svg>
          {STEPS.map((s, i) => (
            <article key={s.n} className={`stop ${i % 2 ? 'r' : ''}`} data-r>
              <div className={`blob b${i}`}><img src={`img/${s.img}.webp`} alt="" loading="lazy" /></div>
              <div className="stop-text">
                <span className="num">{['21 days', '40 g an hour', '20 seconds'][i]}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Bowls() {
  const list = MENU.filter((m) => m.cat !== 'home').slice(0, 6)
  return (
    <section className="bowls wrap" aria-labelledby="b-h">
      <div className="head">
        <h2 id="b-h" data-r>today at the counter</h2>
        <Link to="/menu" className="link" data-r>The whole menu<SlArrowRight aria-hidden="true" /></Link>
      </div>
      <div className="arches">
        {list.map((m, i) => (
          <Link key={m.id} to={`/menu?item=${m.id}`} className="arch" style={{ '--i': i }} data-r>
            <div className="arch-pic"><img src={`img/${m.img}.webp`} alt="" loading="lazy" /><Bubbles n={5} /></div>
            <span className="jp" lang="ja">{m.jp}</span>
            <h3>{m.name}</h3>
            <span className="price">{usd(m.price)}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Visit() {
  const st = isOpen()
  return (
    <section className="visit" id="visit" aria-labelledby="v-h">
      <svg className="wave top" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 80 C 240 10, 480 10, 720 45 S 1200 90, 1440 20 L1440 80 Z" /></svg>
      <div className="wrap visit-grid">
        <div className="visit-pics" data-r>
          <div className="window"><img src="img/cafe.webp" alt="The cafe with a green tiled counter, oak stools and paper lamps" loading="lazy" /></div>
          <div className="porthole"><img src="img/friends.webp" alt="Two friends at the window bar with iced matcha" loading="lazy" /></div>
        </div>
        <div className="visit-text">
          <h2 id="v-h" data-r>come in,<br />slow down.</h2>
          <p data-r>A green counter, big windows, paper lamps and nobody rushing you. Sit at the window bar, watch your matcha being whisked, stay as long as you like.</p>
          <p className="quiet" data-r><SlClock aria-hidden="true" />{CAFE.quiet}</p>
          <dl className="hours" data-r>{CAFE.hours.map(([d, a, b]) => <div key={d}><dt>{d}</dt><dd>{a} am to {b - 12} pm</dd></div>)}</dl>
          <p className="addr" data-r><SlLocationPin aria-hidden="true" />{CAFE.street}, {CAFE.suburb}</p>
          <p className={`now ${st.open ? 'on' : ''}`} data-r><i />{st.open ? `Open now, until ${st.until - 12} pm` : `Closed now, back at ${st.from} am`}</p>
        </div>
      </div>
      <svg className="wave bottom" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 L1440 0 L1440 40 C 1200 90, 960 10, 720 40 S 240 80, 0 30 Z" /></svg>
    </section>
  )
}

function TakeHome() {
  const tins = MENU.filter((m) => m.cat === 'home')
  return (
    <section className="take wrap" aria-labelledby="t-h">
      <div className="take-pic" data-r><img src="img/tins.webp" alt="Three fuwa tins, green, cream and brown, with matcha and hojicha" loading="lazy" /></div>
      <div className="take-text">
        <h2 id="t-h" data-r>take the club home</h2>
        <p data-r>The same matcha we whisk at the counter. Picked this May, sealed in Kyoto, best within three months of opening.</p>
        <ul className="tin-list" data-r>
          {tins.map((t) => (
            <li key={t.id}>
              <Link to={`/menu?cat=home&item=${t.id}`}><b>{t.name}</b><span>{t.line.split('.')[0]}.</span><em>{usd(t.price)}</em></Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
