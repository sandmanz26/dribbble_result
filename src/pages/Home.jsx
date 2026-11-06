import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoIosLeaf, IoIosAirplane, IoIosCheckmark, IoIosClose, IoIosPlay, IoIosStarOutline, IoIosCube, IoIosPause } from 'react-icons/io'
import { useStore } from '../store.jsx'
import { FLAVORS, MOMENTS, COMPARE, INGREDIENTS, UGC } from '../data.js'
import { useReveal, Arrow, Wordmark, reduced } from '../App.jsx'
import { useTwistHero, TwistStage, AddBtn, FlavorDots, Mist, IntroCover, LoopDevice } from '../Twist.jsx'

export default function Home() {
  const ref = useReveal()
  return (
    <div ref={ref}>
      <Hero />
      <Trust />
      <TwistCards />
      <MomentsRow />
      <PickFlavor />
      <WhyBrth />
      <Ingredients />
      <Social />
      <Subscribe />
      <FindInStore />
      <EmailCapture />
    </div>
  )
}

function Hero() {
  const s = useStore()
  const { sec, mist, open, intro, setIntro } = useTwistHero()
  const [video, setVideo] = useState(false)
  useEffect(() => { document.documentElement.classList.toggle('intro', intro === 'play'); return () => document.documentElement.classList.remove('intro') }, [intro])
  return (
    <section className={`hero intro-${intro}`} ref={sec} aria-labelledby="h-h" style={{ '--field': s.f.field, '--accent': s.f.accent }}>
      <div className="hero-pin">
        <div className="hero-copy">
          <p className="eyebrow">Pocket breath spray</p>
          <h1 id="h-h">Make every moment fresh.<sup className="tm">™</sup></h1>
          <p className="sub">A twist-up breath spray for the moment right before the moment. Sugar free. Vegan. Fits anywhere.</p>
          <div className="ctas">
            <Link to={s.f.path} className="btn">Shop the 2-pack, $7.99</Link>
            <button className="btn ghost" onClick={() => setVideo(true)}><IoIosPlay aria-hidden="true" />Watch the twist</button>
          </div>
          <p className="say">Every breath, fresh. <small>BRTH is said “breath.”</small></p>
        </div>
        <div className="hero-art">
          <TwistStage open={open} flavor={s.f} />
          <FlavorDots className="on-field" label="Flavor shown" />
        </div>
        <Mist ref={mist} tint={s.f.mist} />
      </div>
      {intro === 'play' && <IntroCover flavor={s.f} onDone={() => setIntro('done')} />}
      {video && <TwistVideo onClose={() => setVideo(false)} />}
    </section>
  )
}

// "Watch the twist": a 10-second muted loop in a lightbox, with a pause control. Placeholder until the shoot.
function TwistVideo({ onClose }) {
  const s = useStore()
  const [play, setPlay] = useState(!reduced())
  const [ph, setPh] = useState(0)
  const close = useRef(null)
  useEffect(() => { close.current?.focus(); const k = (e) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, []) // eslint-disable-line
  useEffect(() => { if (!play) return; const t = setInterval(() => setPh((p) => (p + 1) % 4), 900); return () => clearInterval(t) }, [play])
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Watch the twist" onClick={onClose}>
      <div className="lb-box" onClick={(e) => e.stopPropagation()} style={{ background: s.f.field }}>
        <button ref={close} className="ico close light" onClick={onClose} aria-label="Close"><IoIosClose /></button>
        <div className="lb-stage"><TwistStage open={[0, 0.3, 1, 1][ph]} flavor={s.f} /></div>
        <div className="lb-bar">
          <button className="ico light" onClick={() => setPlay((p) => !p)} aria-label={play ? 'Pause' : 'Play'}>{play ? <IoIosPause /> : <IoIosPlay />}</button>
          <p className="ph">VIDEO: 10-second twist loop, closed to open to mist. Drawn stand-in until the shoot.</p>
        </div>
      </div>
    </div>
  )
}

function Trust() {
  const items = [[IoIosStarOutline, 'Sugar free'], [IoIosLeaf, 'Vegan friendly'], [IoIosAirplane, 'TSA travel ready'], [IoIosCube, 'Free shipping on 2+ packs']]
  return <ul className="trust" aria-label="At a glance">{items.map(([I, t]) => <li key={t}><span className="ring"><I aria-hidden="true" /></span>{t}</li>)}</ul>
}

function TwistCards() {
  const s = useStore()
  const cards = [
    ['Twist', 'A quarter turn reveals the nozzle. No cap to lose.', <LoopDevice flavor={s.f} mode="twist" />, 'Animated: the top turns a quarter'],
    ['Spray', 'One or two sprays. That’s it.', <LoopDevice flavor={s.f} mode="rise" />, 'Animated: the nozzle rises'],
    ['Go', 'Lean in. You’re good.', <img src={`img/${s.f.hand}.webp`} alt="The device in hand on a city street" loading="lazy" />, ''],
  ]
  return (
    <section className="twist sec wrap" aria-labelledby="tw-h">
      <h2 id="tw-h">Twist. Spray. Go.</h2>
      <ol className="cards3 swipe" style={{ '--field': s.f.field }}>
        {cards.map(([t, d, pic, alt], i) => (
          <li key={t} data-r style={{ '--i': i }}>
            <div className="pic" role={alt ? 'img' : undefined} aria-label={alt || undefined}>{pic}<span className="num">0{i + 1}</span></div>
            <h3>{t}</h3><p>{d}</p>
          </li>
        ))}
      </ol>
      <Link to="/how-it-works" className="more" data-r>See how it works<Arrow /></Link>
    </section>
  )
}

function MomentsRow() {
  return (
    <section className="moments sec" aria-labelledby="mo-h">
      <div className="wrap head-row"><h2 id="mo-h" data-r>For the moment before the moment.</h2><Link to="/moments" className="more" data-r>Watch more Moments<Arrow /></Link></div>
      <ul className="hscroll" tabIndex={0} aria-label="Moments">
        {MOMENTS.map((m) => (
          <li key={m.t} className="mcard"><div className="mframe"><img src={`img/${m.img}.webp`} alt="" loading="lazy" /></div><p>{m.t}</p></li>
        ))}
      </ul>
    </section>
  )
}

function PickFlavor() {
  const [q, setQ] = useState({ spearmint: 1, arctic: 1 })
  const grid = useRef(null)
  const mist = useRef(null)
  // The light mist wipe between Moments and Pick your flavor: once, as the cards arrive.
  useEffect(() => {
    if (reduced()) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const m = mist.current; if (!m) return
      m.haze(0.9); m.clear(0.014)
      for (let i = 0; i < 6; i++) m.burst(0, 0.1 + i * 0.16, innerWidth < 760 ? 10 : 22, 2.4, 'right')
    }, { threshold: 0.35 })
    io.observe(grid.current); return () => io.disconnect()
  }, [])
  return (
    <section className="pick sec wrap" aria-labelledby="pk-h">
      <h2 id="pk-h" data-r>Pick your flavor.</h2>
      <div className="pick-grid" ref={grid}>
        <Mist ref={mist} className="wipe" />
        {Object.values(FLAVORS).map((f) => (
          <article key={f.id} className="fcard" style={{ '--field': f.field, '--accent': f.accent }} data-r>
            <Link to={f.path} className="fcard-pic"><img src={`img/${f.img}.webp`} alt={`${f.name} device`} loading="lazy" /></Link>
            <div className="fcard-body">
              <h3>{f.name}</h3>
              <p>{f.line}</p>
              <p className="price">$7.99 <small>2-pack</small></p>
              <div className="row">
                <span className="qty light"><button onClick={() => setQ({ ...q, [f.id]: Math.max(1, q[f.id] - 1) })} aria-label={`One less ${f.name}`}>−</button><output>{q[f.id]}</output><button onClick={() => setQ({ ...q, [f.id]: q[f.id] + 1 })} aria-label={`One more ${f.name}`}>+</button></span>
                <AddBtn className="accent grow" line={{ id: f.id, name: f.name, flavor: f.id, img: f.img, packs: 1, price: 7.99, qty: q[f.id] }} />
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="duo" data-r><span>Can’t choose? Get both.</span> <AddBtn className="ghost sm" line={{ id: 'duo', name: 'Duo', flavor: 'duo', img: 'devices', packs: 2, price: 14.99 }}>Add the Duo, $14.99</AddBtn></p>
    </section>
  )
}

function WhyBrth() {
  return (
    <section className="why sec wrap" aria-labelledby="wy-h">
      <h2 id="wy-h" data-r>Not your dad’s breath spray.</h2>
      <table className="compare" data-r>
        <thead><tr><th scope="col"><span className="sr">Feature</span></th><th scope="col">BRTH</th><th scope="col">Typical pocket spray</th></tr></thead>
        <tbody>{COMPARE.map(([a, b, c]) => <tr key={a}><th scope="row">{a}</th><Cell v={b} yes /><Cell v={c} /></tr>)}</tbody>
      </table>
      <p className="note" data-r>Every row to be confirmed by the product team before launch.</p>
    </section>
  )
}

function Cell({ v, yes }) {
  if (v === true) return <td className={yes ? 'yes' : ''}><IoIosCheckmark aria-hidden="true" /><span className="sr">Yes</span></td>
  if (v === false) return <td className="no"><IoIosClose aria-hidden="true" /><span className="sr">No</span></td>
  return <td className="varies">{v}</td>
}

export function Ingredients({ id = 'in-h' }) {
  const [on, setOn] = useState(-1)
  return (
    <section className="ings sec wrap" aria-labelledby={id}>
      <h2 id={id} data-r>Six ingredients. Nothing weird.</h2>
      <ol className="ing-list">
        {INGREDIENTS.map(([n, d], i) => (
          <li key={n} data-r style={{ '--i': i }}>
            <button onClick={() => setOn(on === i ? -1 : i)} aria-expanded={on === i} onMouseEnter={() => setOn(i)}>{n}<span className={on === i ? 'show' : ''}>{d}</span></button>
          </li>
        ))}
      </ol>
      <p className="small-print" data-r>Contains xylitol. Keep out of reach of children and pets.</p>
    </section>
  )
}

function Social() {
  return (
    <section className="social sec wrap" aria-labelledby="so-h">
      <h2 id="so-h" data-r>People are leaning in.</h2>
      <div className="ugc">{UGC.map((u, i) => (
        <figure key={u.h} data-r style={{ '--i': i }}><img src={`img/${u.img}.webp`} alt="" loading="lazy" /><figcaption><b>{u.h}</b>{u.q}</figcaption></figure>
      ))}</div>
      <p className="note" data-r>Pre-launch layout: creator posts and handles are placeholders. After launch this becomes a star summary and three reviews.</p>
    </section>
  )
}

function Subscribe() {
  const s = useStore()
  return (
    <section className="subband" aria-labelledby="sb-h">
      <div className="wrap sb-grid">
        <div>
          <h2 id="sb-h" data-r>Never run out mid-moment.</h2>
          <p data-r>Get a fresh 2-pack every 1, 2, or 3 months. Save 20%. Skip or cancel anytime.</p>
          <Link to={s.f.path + '?sub=1'} className="btn accent" data-r>Start my subscription</Link>
        </div>
        <img src="img/devices.webp" alt="Arctic Mint and Spearmint devices side by side" loading="lazy" data-r />
      </div>
    </section>
  )
}

function FindInStore() {
  const [ok, setOk] = useState(false)
  return (
    <section className="store sec wrap" aria-labelledby="st-h">
      <div className="store-grid">
        <div>
          <h2 id="st-h" data-r>Grab it on the go.</h2>
          <p className="big" data-r>Coming soon to a store near you.</p>
          <p data-r>Get a note the day we land. Retailer logos and the ZIP code finder appear here once the first retailer is confirmed.</p>
        </div>
        <div data-r>
      {ok ? <p className="ok">We’ll let you know.</p> : <form className="field inline" onSubmit={(e) => { e.preventDefault(); setOk(true) }} data-r><span className="sr">Email</span><input type="email" required placeholder="Email address" /><button className="btn">Notify me</button></form>}
        </div>
      </div>
    </section>
  )
}

function EmailCapture() {
  const [step, setStep] = useState(0)
  return (
    <section className="capture sec" aria-labelledby="ec-h">
      <div className="wrap cap-box">
        <Wordmark />
        <h2 id="ec-h">Get 15% off your first order.</h2>
        <p>Plus first dibs on new flavors.</p>
        {step === 2 ? <p className="ok">Code FRESH15 is yours. Prototype: nothing was sent.</p> : (
          <form className="field inline" onSubmit={(e) => { e.preventDefault(); setStep(step + 1) }}>
            {step === 0 ? <><span className="sr">Email</span><input key="e" type="email" required placeholder="Email address" autoComplete="email" /></> : <><span className="sr">Phone, optional</span><input key="p" type="tel" placeholder="Phone for SMS (optional)" autoComplete="tel" /></>}
            <button className="btn">{step === 0 ? 'Get 15% off' : 'Done'}</button>
          </form>
        )}
      </div>
    </section>
  )
}
