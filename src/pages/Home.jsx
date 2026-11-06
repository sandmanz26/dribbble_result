import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoIosLeaf, IoIosAirplane, IoIosCheckmark, IoIosRefresh, IoIosSync, IoIosWater, IoIosHappy, IoIosClose, IoIosPlay } from 'react-icons/io'
import { useStore } from '../store.jsx'
import { FLAVORS, MOMENTS, COMPARE, INGREDIENTS, UGC, RETAIL } from '../data.js'
import { useReveal, Arrow, Wordmark } from '../App.jsx'
import { useTwistHero, TwistStage, AddBtn, FlavorDots, Mist } from '../Twist.jsx'

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
  const { sec, mist, open, intro } = useTwistHero()
  const [video, setVideo] = useState(false)
  return (
    <section className={`hero intro-${intro}`} ref={sec} aria-labelledby="h-h" style={{ '--field': s.f.field, '--accent': s.f.accent }}>
      <div className="hero-pin">
        <div className="hero-copy">
          <p className="eyebrow">Pocket breath spray</p>
          <h1 id="h-h">Make every moment fresh.</h1>
          <p className="sub">A twist-up breath spray for the moment right before the moment. Sugar free. Vegan. Fits anywhere.</p>
          <div className="ctas">
            <Link to={s.f.path} className="btn accent">Shop the 2-pack, $7.99</Link>
            <button className="btn ghost" onClick={() => setVideo(true)}><IoIosPlay aria-hidden="true" />Watch the twist</button>
          </div>
          <FlavorDots />
          <p className="say">Every breath, fresh. <small>BRTH is said “breath.”</small></p>
        </div>
        <div className="hero-art">
          <span className="giant" aria-hidden="true">BRTH</span>
          <span className="side" aria-hidden="true"><b>BRTH LABS</b><i>Twist. Spray. Go.</i></span>
          <TwistStage open={open} flavor={s.f} />
        </div>
        <Mist ref={mist} tint={s.f.accent} />
      </div>
      {video && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="The twist" onClick={() => setVideo(false)}>
          <div className="lb-box" onClick={(e) => e.stopPropagation()} style={{ background: s.f.field }}>
            <button className="ico close light" onClick={() => setVideo(false)} aria-label="Close"><IoIosClose /></button>
            <img src={`img/${s.flavor === 'arctic' ? 'arctic-34' : 'spearmint-open'}.webp`} alt="The device twisted open" />
            <p className="ph">VIDEO: 10-second twist loop, closed to open to mist. Placeholder until the shoot.</p>
          </div>
        </div>
      )}
    </section>
  )
}

function Trust() {
  const items = [[IoIosHappy, 'Sugar free'], [IoIosLeaf, 'Vegan friendly'], [IoIosAirplane, 'TSA travel ready'], [IoIosCheckmark, 'Free shipping on 2+ packs']]
  return <ul className="trust" aria-label="At a glance">{items.map(([I, t]) => <li key={t}><span className="ring"><I aria-hidden="true" /></span>{t}</li>)}</ul>
}

function TwistCards() {
  const cards = [
    ['Twist', 'A quarter turn reveals the nozzle. No cap to lose.', IoIosRefresh, 'spearmint-34'],
    ['Spray', 'One or two sprays. That’s it.', IoIosWater, 'spearmint-open'],
    ['Go', 'Lean in. You’re good.', IoIosSync, 'in-hand'],
  ]
  return (
    <section className="twist sec wrap" aria-labelledby="tw-h">
      <h2 id="tw-h" data-r>Twist. Spray. Go.</h2>
      <ol className="cards3 swipe">
        {cards.map(([t, d, I, img], i) => (
          <li key={t} data-r style={{ '--i': i }}>
            <div className="pic"><img src={`img/${img}.webp`} alt="" loading="lazy" /><span className="num">{i + 1}</span></div>
            <span className="ring"><I aria-hidden="true" /></span>
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
          <li key={m.t} className="mcard"><img src={`img/${m.img}.webp`} alt="" loading="lazy" /><p>{m.t}</p></li>
        ))}
      </ul>
    </section>
  )
}

function PickFlavor() {
  const [q, setQ] = useState({ spearmint: 1, arctic: 1 })
  return (
    <section className="pick sec wrap" aria-labelledby="pk-h">
      <h2 id="pk-h" data-r>Pick your flavor.</h2>
      <div className="pick-grid">
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
      <p className="duo" data-r>Can’t choose? Get both. <AddBtn className="ghost sm" line={{ id: 'duo', name: 'Duo', flavor: 'duo', img: 'devices', packs: 2, price: 14.99 }}>Add the Duo, $14.99</AddBtn></p>
    </section>
  )
}

function WhyBrth() {
  return (
    <section className="why sec wrap" aria-labelledby="wy-h">
      <h2 id="wy-h" data-r>Not your dad’s breath spray.</h2>
      <table className="compare" data-r>
        <thead><tr><th scope="col"><span className="sr">Feature</span></th><th scope="col">BRTH</th><th scope="col">Typical pocket spray</th></tr></thead>
        <tbody>{COMPARE.map(([a, b, c]) => <tr key={a}><th scope="row">{a}</th><td className="yes">{b}</td><td>{c}</td></tr>)}</tbody>
      </table>
      <p className="note" data-r>Every row to be confirmed by the product team before launch.</p>
    </section>
  )
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
      <h2 id="st-h" data-r>Grab it on the go.</h2>
      <ul className="retail" data-r>{RETAIL.map((r) => <li key={r}>{r}<small>Coming soon</small></li>)}</ul>
      <p data-r>Coming soon to a store near you. Get a note the day we land.</p>
      {ok ? <p className="ok">We’ll let you know.</p> : <form className="field inline" onSubmit={(e) => { e.preventDefault(); setOk(true) }} data-r><span className="sr">Email</span><input type="email" required placeholder="Email address" /><button className="btn">Notify me</button></form>}
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
