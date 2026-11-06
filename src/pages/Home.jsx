import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ImArrowRight, ImLocation, ImClock, ImLeaf } from 'react-icons/im'
import { MENU, STEPS, PROOF, CAFE, usd, isOpen } from '../data.js'
import { useSectionColours, useReveal, reduced } from '../App.jsx'

export default function Home() {
  useSectionColours()
  const ref = useReveal()
  return (
    <div ref={ref}>
      <Hero />
      <Proper />
      <Favourites />
      <Visit />
      <TakeHome />
    </div>
  )
}

function Hero() {
  const art = useRef(null)
  const move = (e) => {
    if (reduced() || !art.current) return
    const r = art.current.getBoundingClientRect()
    art.current.style.setProperty('--x', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    art.current.style.setProperty('--y', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  return (
    <section className="hero" data-bg="#f9cfd8" onPointerMove={move} aria-labelledby="h-h">
      <div className="hero-text">
        <h1 id="h-h"><span>matcha,</span><span>made</span><span className="wob">fluffy.</span></h1>
        <p className="lede">First-harvest matcha from one farm in Kyoto, whisked by hand for every cup. Come for the green, stay for the calm.</p>
        <div className="cta-row">
          <Link to="/menu" className="btn">See the menu<ImArrowRight aria-hidden="true" /></Link>
          <a href="#/#visit" className="btn ghost">Find the club</a>
        </div>
      </div>
      <div className="hero-art" ref={art}>
        <span className="blob b1" aria-hidden="true" /><span className="blob b2" aria-hidden="true" /><span className="blob b3" aria-hidden="true" />
        <div className="hero-photo"><img src="img/hero.webp" alt="Two iced matcha lattes clinking against a pink wall" width="2000" height="1125" /></div>
        <svg className="spin-badge" viewBox="0 0 200 200" aria-hidden="true">
          <defs><path id="c" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" /></defs>
          <text><textPath href="#c">whisked to order · whisked to order · </textPath></text>
        </svg>
      </div>
      <div className="ticker" aria-hidden="true"><p>{[0, 1].map((k) => <span key={k}>{MENU.filter((m) => m.cat !== 'home').map((m) => <em key={m.id}>{m.name}<i>✿</i></em>)}</span>)}</p></div>
    </section>
  )
}

function Proper() {
  return (
    <section className="proper" data-bg="#d3e3b8" aria-labelledby="p-h">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="p-h" data-r>proper matcha.<br />no shortcuts.</h2>
          <p data-r>Most cafe matcha is a cooking grade powder that turns brown and bitter. Ours is shaded, picked once in spring and milled on stone. You can taste the difference before the milk goes in.</p>
        </div>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.n} className="step" style={{ '--i': i }} data-r>
              <div className="step-pic"><img src={`img/${s.img}.webp`} alt="" loading="lazy" /></div>
              <span className="step-n">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
        <ul className="proof" data-r>{PROOF.map(([b, s]) => <li key={b}><ImLeaf aria-hidden="true" /><b>{b}</b><span>{s}</span></li>)}</ul>
      </div>
    </section>
  )
}

function Favourites() {
  const row = useRef(null)
  const nudge = (d) => row.current?.scrollBy({ left: d * 340, behavior: reduced() ? 'auto' : 'smooth' })
  const list = MENU.filter((m) => m.cat !== 'home')
  return (
    <section className="favs" data-bg="#fbe8a6" aria-labelledby="f-h">
      <div className="wrap favs-head">
        <h2 id="f-h" data-r>the line-up</h2>
        <div className="arrows"><button onClick={() => nudge(-1)} aria-label="Scroll left"><ImArrowRight style={{ transform: 'scaleX(-1)' }} /></button><button onClick={() => nudge(1)} aria-label="Scroll right"><ImArrowRight /></button></div>
      </div>
      <div className="fav-row" ref={row} tabIndex={0} aria-label="Drinks and sweets">
        {list.map((m, i) => (
          <Link key={m.id} to={`/menu?item=${m.id}`} className="fav" style={{ '--bg': m.bg, '--i': i }}>
            <div className="fav-pic"><img src={`img/${m.img}.webp`} alt="" loading="lazy" /></div>
            <div className="fav-body">
              <span className="jp" lang="ja">{m.jp}</span>
              <h3>{m.name}</h3>
              <p>{m.line}</p>
              <span className="fav-price">{usd(m.price)}{m.star && <i>fan favourite</i>}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Visit() {
  const st = isOpen()
  return (
    <section className="visit" id="visit" data-bg="#cfe7f6" aria-labelledby="v-h">
      <div className="wrap visit-grid">
        <div className="visit-pics">
          <img className="vp1" src="img/cafe.webp" alt="The cafe with a pastel green tiled counter, oak stools and paper lamps" loading="lazy" data-r />
          <img className="vp2" src="img/friends.webp" alt="Two friends at the window bar with iced matcha lattes" loading="lazy" data-r />
        </div>
        <div className="visit-text">
          <h2 id="v-h" data-r>come in,<br />slow down.</h2>
          <p data-r>A green counter, big windows, paper lamps and nobody rushing you. Sit at the window bar, watch your matcha being whisked, stay as long as you like.</p>
          <p className="quiet" data-r><ImClock aria-hidden="true" />{CAFE.quiet}</p>
          <dl className="hours" data-r>
            {CAFE.hours.map(([d, a, b]) => <div key={d}><dt>{d}</dt><dd>{a} am to {b - 12} pm</dd></div>)}
          </dl>
          <p className="addr" data-r><ImLocation aria-hidden="true" />{CAFE.street}, {CAFE.suburb}</p>
          <p className={`now ${st.open ? 'on' : ''}`} data-r><i />{st.open ? `Open now, until ${st.until - 12} pm` : `Closed now, opens at ${st.from} am`}</p>
        </div>
      </div>
    </section>
  )
}

function TakeHome() {
  const tins = MENU.filter((m) => m.cat === 'home')
  return (
    <section className="take" data-bg="#e6dcf6" aria-labelledby="t-h">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="t-h" data-r>take the club home</h2>
          <p data-r>The same matcha we whisk at the counter, in tins you will want to keep. Picked this May, sealed in Kyoto, best within 3 months of opening.</p>
        </div>
        <div className="tins">
          {tins.map((t, i) => (
            <Link key={t.id} to={`/menu?cat=home&item=${t.id}`} className="tin" style={{ '--bg': t.bg, '--i': i }} data-r>
              <img src={`img/${t.img}.webp`} alt="" loading="lazy" />
              <span><b>{t.name}</b><em>{usd(t.price)}</em></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
