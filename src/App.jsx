import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { FaArrowRight, FaChevronDown, FaArrowLeft } from 'react-icons/fa6'
import { FLAVOURS, PERSONAS, REVIEWS, PRINCIPLES, FAQ, flavour } from './data.js'
import { Logo, Tub, Picker, Label, Review, Video, Offer, useScroll, useReveal, through, reduced } from './kit.jsx'

// Every page takes its colours from one flavour; changing flavour repaints the page.
function usePaint(id) {
  const f = flavour(id)
  return { '--f': f.field, '--fi': f.ink, '--p': f.pop }
}

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })

function Header({ squeeze }) {
  return (
    <header className={`hdr ${squeeze ? 'sq' : ''}`}>
      <Link to="/" className="brand" aria-label="KhangoSupps home"><Logo small /></Link>
      {!squeeze && (
        <nav aria-label="Main">
          <a href="#label" onClick={(e) => { e.preventDefault(); go('label') }}>Ingredients</a>
          <a href="#flavours" onClick={(e) => { e.preventDefault(); go('flavours') }}>Flavours</a>
          <a href="#reviews" onClick={(e) => { e.preventDefault(); go('reviews') }}>Reviews</a>
          <a href="#for" onClick={(e) => { e.preventDefault(); go('for') }}>Who it is for</a>
        </nav>
      )}
      <button className="btn sm" onClick={() => go('offer')}>Starter pack $9.99</button>
    </header>
  )
}

function Home() {
  const [fl, setFl] = useState('choc')
  const ref = useReveal()
  return (
    <div className="paint" style={usePaint(fl)} ref={ref}>
      <Header />
      <Hero fl={fl} setFl={setFl} />
      <Band />
      <Ingredients fl={fl} setFl={setFl} />
      <Shake />
      <Day />
      <Flavours fl={fl} setFl={setFl} />
      <Reviews />
      <Principles />
      <System />
      <section className="wrap sec" id="offer" aria-labelledby="o-h">
        <h2 id="o-h" className="sr">Get the starter pack</h2>
        <Offer id={fl} onFlavour={setFl} />
      </section>
      <Faq />
      <Footer />
    </div>
  )
}

function Hero({ fl, setFl }) {
  const f = flavour(fl)
  const sec = useRef(null)
  useScroll(() => {
    const el = sec.current; if (!el || reduced()) return
    const p = Math.min(1, scrollY / innerHeight)
    el.style.setProperty('--h', p.toFixed(3))
  })
  return (
    <section className="hero" ref={sec} aria-labelledby="h-h">
      <div className="stripes" aria-hidden="true"><i /><i /><i /></div>
      <h1 id="h-h" className="hero-word"><span className="w1">Stay</span><span className="w2">ready.</span></h1>
      <Tub id={fl} className="hero-tub" />
      <div className="hero-foot wrap">
        <div>
          <p className="lede">Whey protein with five ingredients you can say out loud, and a taste you look forward to. {f.facts.protein} g protein, {f.facts.sugar} g sugar a scoop.</p>
          <div className="cta-row">
            <button className="btn" onClick={() => go('offer')}>Try all four for $9.99<FaArrowRight aria-hidden="true" /></button>
            <button className="btn ghost" onClick={() => go('for')}>Who it is for</button>
          </div>
        </div>
        <div className="hero-pick">
          <p className="hp-now" key={f.id}><b>{f.name}.</b> {f.taste}</p>
          <Picker value={fl} onChange={setFl} />
        </div>
      </div>
    </section>
  )
}

function Band() {
  const t = useRef(null)
  const v = useRef({ last: 0, x: 0 })
  useScroll(() => {
    if (!t.current || reduced()) return
    const d = scrollY - v.current.last; v.current.last = scrollY
    v.current.x = (v.current.x - 0.4 - Math.abs(d) * 0.35) % 1400
    t.current.style.transform = `translate3d(${v.current.x}px,0,0)`
  })
  const words = ['Five ingredients', 'Real taste', '24 g protein', '1 g sugar', 'Stay ready']
  return (
    <div className="band" aria-hidden="true">
      <div className="band-t" ref={t}>{[0, 1, 2].map((k) => <p key={k}>{words.map((w) => <span key={w}>{w}<i>✶</i></span>)}</p>)}</div>
    </div>
  )
}

function Ingredients({ fl, setFl }) {
  const f = flavour(fl)
  const [open, setOpen] = useState(0)
  useEffect(() => setOpen(0), [fl])
  return (
    <section className="ings wrap sec" id="label" aria-labelledby="i-h">
      <div className="ings-text">
        <h2 id="i-h" data-r>Five ingredients. Read them out loud.</h2>
        <p data-r>Most tubs list twenty things and a "proprietary blend". Ours lists five, and every one of them is there for a reason you can taste.</p>
        <Picker value={fl} onChange={setFl} label="Show the label for" />
        <ol className="ing-list" key={fl}>
          {f.ings.map(([n, d], i) => (
            <li key={n} className={open === i ? 'on' : ''} style={{ '--i': i }}>
              <button onClick={() => setOpen(i)} aria-expanded={open === i}><span>{String(i + 1).padStart(2, '0')}</span>{n}</button>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="ings-art">
        <img className="ings-photo" src="img/ingredients.webp" alt="Cocoa, roasted peanuts, vanilla, cinnamon, strawberries and a scoop of protein powder on cream paper" width="1800" height="1007" loading="lazy" data-r />
        <div data-r><Label id={fl} /></div>
      </div>
    </section>
  )
}

function Shake() {
  return (
    <section className="shake" aria-labelledby="sh-h">
      <Video src="video/shake.mp4" poster="video/shake.webp">
        <div className="shake-text wrap">
          <h2 id="sh-h"><span>Shake.</span><span>Drink.</span><span>Go.</span></h2>
          <p>Mixes in a shaker in about ten seconds, with water or milk.</p>
        </div>
      </Video>
    </section>
  )
}

// A day of people who have to be ready: each card stacks on the one before.
function Day() {
  return (
    <section className="day sec" id="for" aria-labelledby="d-h">
      <div className="wrap day-head">
        <h2 id="d-h" data-r>Ready is a time of day</h2>
        <p data-r>Five in the morning on the track. Seven after a night shift. Half past six with three lunch boxes. Each gets its own page.</p>
      </div>
      <div className="stack wrap">
        {PERSONAS.map((p, i) => {
          const f = flavour(p.flavour)
          return (
            <article key={p.id} className="slide" style={{ '--f': f.field, '--fi': f.ink, '--p': f.pop, '--k': i }}>
              <div className="sl-pic"><img src={`img/${p.img}.webp`} alt="" loading="lazy" width="1000" height="1250" /></div>
              <div className="sl-body">
                <span className="sl-time">{p.time}</span>
                <h3>{p.head}</h3>
                <p>{p.lede}</p>
                <Link className="btn on-f" to={`/for/${p.id}`}>The page for {p.who.toLowerCase()}<FaArrowRight aria-hidden="true" /></Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function Flavours({ fl, setFl }) {
  const row = useRef(null)
  useScroll(() => {
    const el = row.current; if (!el || reduced() || innerWidth < 800) return
    const p = through(el)
    el.querySelectorAll('.fl-card').forEach((c, i) => c.style.setProperty('--y', `${((0.5 - p) * (i % 2 ? 70 : -30)).toFixed(1)}px`))
  })
  return (
    <section className="wrap sec" id="flavours" aria-labelledby="fl-h">
      <div className="sec-head">
        <h2 id="fl-h" data-r>Four flavours, no chalk</h2>
        <p data-r>Pick the one you would drink even if it did nothing for you. That is how we tested them.</p>
      </div>
      <div className="fl-row" ref={row}>
        {FLAVOURS.map((f, i) => (
          <article key={f.id} className={`fl-card ${fl === f.id ? 'on' : ''}`} style={{ '--f': f.field, '--fi': f.ink, '--p': f.pop, '--i': i }} data-r>
            <div className="fl-pic"><img src={`img/${f.img}.webp`} alt="" loading="lazy" /></div>
            <h3>{f.name}</h3>
            <p>{f.taste}</p>
            <p className="fl-facts"><b>{f.facts.protein} g</b> protein <b>{f.facts.kcal}</b> kcal</p>
            <button className="btn on-f" onClick={() => { setFl(f.id); go('offer') }}>Start with this one</button>
          </article>
        ))}
      </div>
    </section>
  )
}

function Reviews() {
  const avg = (REVIEWS.reduce((a, r) => a + r.stars, 0) / REVIEWS.length).toFixed(1)
  return (
    <section className="wrap sec" id="reviews" aria-labelledby="r-h">
      <div className="sec-head">
        <h2 id="r-h" data-r>What people say after the first tub</h2>
        <p data-r><b className="big">{avg}</b> average from {REVIEWS.length} reviews. Sample reviews in this draft, to be replaced with verified ones from the store.</p>
      </div>
      <div className="reviews">{REVIEWS.map((r, i) => <Review key={r.name} r={r} i={i} />)}</div>
    </section>
  )
}

function Principles() {
  return (
    <section className="princ sec" aria-labelledby="p-h">
      <div className="wrap">
        <h2 id="p-h" data-r>What stay ready means</h2>
        <ol>{PRINCIPLES.map(([t, d], i) => <li key={t} data-r style={{ '--i': i }}><span>{i + 1}</span><b>{t}</b><p>{d}</p></li>)}</ol>
      </div>
    </section>
  )
}

function System() {
  return (
    <section className="wrap sec sys" aria-labelledby="sy-h">
      <div className="sec-head">
        <h2 id="sy-h" data-r>One system, a page for each person</h2>
        <p data-r>Every squeeze page is built from the same blocks: a photo, a promise, three reasons, the label, one review and the starter pack. A new audience or a new state is a new set of words, not a new design.</p>
      </div>
      <div className="sys-row">
        {PERSONAS.map((p, i) => {
          const f = flavour(p.flavour)
          return (
            <Link key={p.id} to={`/for/${p.id}`} className="sys-card" style={{ '--f': f.field, '--fi': f.ink, '--i': i }} data-r>
              <img src={`img/${p.img}.webp`} alt="" loading="lazy" />
              <span><b>{p.head}</b>#/for/{p.id}<FaArrowRight aria-hidden="true" /></span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="wrap sec faq" aria-labelledby="q-h">
      <h2 id="q-h" data-r>Before your first scoop</h2>
      <div className="qs">{FAQ.map(([q, a], i) => <details key={q} open={i === 0} data-r><summary>{q}<FaChevronDown aria-hidden="true" /></summary><p>{a}</p></details>)}</div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="foot">
      <div className="stripes still" aria-hidden="true"><i /><i /><i /></div>
      <div className="wrap foot-in">
        <p className="foot-word" aria-hidden="true">Stay ready.</p>
        <div className="foot-row">
          <Logo small />
          <span>Draft landing page. Product names, nutrition, prices and reviews are samples for the client to confirm.</span>
          <span>Photos, packshots and the video are AI-generated concept images.</span>
        </div>
      </div>
    </footer>
  )
}

// Squeeze page: one person, one promise, one form. No navigation out.
function Persona() {
  const { id } = useParams()
  const nav = useNavigate()
  const p = PERSONAS.find((x) => x.id === id) || PERSONAS[0]
  const [fl, setFl] = useState(p.flavour)
  useEffect(() => setFl(p.flavour), [p.flavour])
  const ref = useReveal([id])
  const r = REVIEWS[p.review]
  const others = PERSONAS.filter((x) => x.id !== p.id)
  return (
    <div className="paint sq-page" style={usePaint(fl)} ref={ref}>
      <Header squeeze />
      <section className="sq-hero">
        <div className="sq-pic"><img src={`img/${p.img}.webp`} alt="" width="1000" height="1250" /></div>
        <div className="sq-text">
          <p className="sq-for"><b>{p.time}</b>For {p.who.toLowerCase()}</p>
          <h1>{p.head}</h1>
          <p className="lede">{p.lede}</p>
          <button className="btn" onClick={() => go('offer')}>Try all four for $9.99<FaArrowRight aria-hidden="true" /></button>
          <Tub id={fl} className="sq-tub" />
        </div>
      </section>
      <section className="wrap sec sq-reasons">
        <ol>{p.reasons.map(([t, d], i) => <li key={t} data-r style={{ '--i': i }}><span>{i + 1}</span><b>{t}</b><p>{d}</p></li>)}</ol>
      </section>
      <section className="wrap sec sq-proof">
        <div data-r><Label id={fl} compact /></div>
        <div className="sq-quote"><Review r={r} /></div>
      </section>
      <section className="wrap sec" id="offer"><Offer id={fl} onFlavour={setFl} persona={p.who} /></section>
      <section className="wrap sq-switch">
        <p>This is one of three pages built from the same system.</p>
        <div>{others.map((o) => <Link key={o.id} to={`/for/${o.id}`}>{o.who}</Link>)}<button onClick={() => nav('/')}><FaArrowLeft aria-hidden="true" />Main landing page</button></div>
      </section>
      <Footer />
    </div>
  )
}

export default function App() {
  const loc = useLocation()
  useEffect(() => {
    scrollTo(0, 0)
    const p = PERSONAS.find((x) => loc.pathname === `/for/${x.id}`)
    document.title = p ? `${p.head} · KhangoSupps` : 'KhangoSupps, stay ready'
  }, [loc.pathname])
  return (
    <main key={loc.pathname} className="route">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/for/:id" element={<Persona />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </main>
  )
}
