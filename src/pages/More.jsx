import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoIosRefresh, IoIosWater, IoIosSync, IoIosDownload } from 'react-icons/io'
import { RETAIL, FAQ } from '../data.js'
import { useReveal, Arrow } from '../App.jsx'

export function WhereToBuy() {
  const ref = useReveal()
  const [zip, setZip] = useState('')
  const [res, setRes] = useState(null)
  const [ok, setOk] = useState(false)
  return (
    <div ref={ref} className="wrap page-pad">
      <header className="page-head"><h1 data-r>Where to buy</h1><p data-r>Coming soon to stores near you. Until then, the full range ships from here.</p></header>
      <ul className="retail big" data-r>{RETAIL.map((r) => <li key={r}>{r}<small>Coming soon</small></li>)}<li>Amazon<small>Decision pending</small></li></ul>
      <form className="locator" onSubmit={(e) => { e.preventDefault(); setRes(/^\d{5}$/.test(zip) ? 'none' : 'bad') }} data-r>
        <label className="field"><span>Find a store by ZIP code</span><input inputMode="numeric" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="10001" /></label>
        <button className="btn">Search</button>
      </form>
      {res === 'bad' && <p className="err" role="alert">Enter a 5-digit ZIP code.</p>}
      {res === 'none' && <p role="status">No stores near {zip} yet. Retail locations appear here once the first retailer goes live.</p>}
      <section className="notify" data-r>
        <h2>Coming soon to stores near you.</h2>
        {ok ? <p className="ok">We’ll email you the day we land.</p> : <form className="field inline" onSubmit={(e) => { e.preventDefault(); setOk(true) }}><span className="sr">Email</span><input type="email" required placeholder="Email address" /><button className="btn">Notify me</button></form>}
      </section>
    </div>
  )
}

export function About() {
  const ref = useReveal()
  return (
    <div ref={ref}>
      <section className="wrap page-pad about">
        <header className="page-head"><h1 data-r>Breath spray, finally designed for real life.</h1></header>
        <div className="story">
          <p data-r>The breath spray aisle is clinical and forgettable. Small bottles you hide in a fist, caps that end up in the bottom of a bag.</p>
          <p data-r>So we made something you would actually want to pull out in public: a pocket object with a twist you can’t stop playing with.</p>
          <p data-r>One promise behind it. Make every moment fresh.</p>
        </div>
        <img className="about-pic" src="img/bench.webp" alt="Early device prototypes, sketches and calipers on a studio bench" loading="lazy" data-r />
        <ul className="values" data-r><li>Clean ingredients</li><li>Designed to be seen</li><li>Built for real moments</li></ul>
        <p className="say" data-r>BRTH is pronounced “breath.”</p>
      </section>
    </div>
  )
}

export function Faq() {
  const ref = useReveal()
  return (
    <div ref={ref} className="wrap page-pad faq">
      <header className="page-head"><h1 data-r>FAQ</h1></header>
      {FAQ.map(([g, qs]) => (
        <section key={g} className="fgroup" data-r>
          <h2>{g}</h2>
          {qs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </section>
      ))}
    </div>
  )
}

// Carton QR destination, not in the navigation. 20% off with an email.
export function Hello() {
  const ref = useReveal()
  const [code, setCode] = useState(false)
  return (
    <div ref={ref}>
      <section className="hello">
        <div className="wrap hello-grid">
          <div>
            <h1 data-r>You found us. Here’s 20% off.</h1>
            <p data-r>Thanks for picking up BRTH. Get 20% off your next order, or save 20% on every refill with a subscription.</p>
            {code ? (
              <div className="code-box" role="status" data-in="1"><span>Your code</span><b>HELLO20</b><small>Also sent to your inbox. One code per order. Prototype: nothing was sent.</small><Link to="/shop" className="btn accent">Shop with 20% off</Link></div>
            ) : (
              <form className="field inline" onSubmit={(e) => { e.preventDefault(); setCode(true) }} data-r><span className="sr">Email</span><input type="email" required placeholder="Email address" autoComplete="email" /><button className="btn accent">Reveal my code</button></form>
            )}
          </div>
          <img src="img/carton-duo.webp" alt="Arctic Mint device next to its carton" data-r />
        </div>
      </section>
      <section className="wrap sec">
        <h2 data-r>How to use</h2>
        <div className="how3 big" data-r>{[[IoIosRefresh, 'Twist to reveal'], [IoIosWater, 'Spray 1 to 2 times'], [IoIosSync, 'Enjoy fresh breath']].map(([I, t], i) => <span key={t}><span className="ring"><I aria-hidden="true" /></span>{i + 1}. {t}</span>)}</div>
        <Link to="/moments" className="more" data-r>See real moments<Arrow /></Link>
        <p className="note">Tracked separately: UTM on the QR code and a dedicated code (HELLO20).</p>
      </section>
    </div>
  )
}

export function Wholesale() {
  const ref = useReveal()
  const [sent, setSent] = useState(false)
  return (
    <div ref={ref} className="wrap page-pad wholesale">
      <header className="page-head"><h1 data-r>Wholesale and press</h1><p data-r>BRTH is the pocket breath spray that feels like a premium object, at a drugstore price.</p></header>
      <dl className="stats" data-r>
        <div><dt>Format</dt><dd>2-pack, 2 × 10 mL</dd></div>
        <div><dt>Retail price</dt><dd>$7.99</dd></div>
        <div><dt>Flavors</dt><dd>Spearmint, Arctic Mint</dd></div>
        <div><dt>Claims</dt><dd>Sugar free, vegan, travel ready</dd></div>
      </dl>
      <button className="btn ghost" onClick={() => alert('Sell sheet PDF placeholder.')}><IoIosDownload aria-hidden="true" />Download the sell sheet (PDF)</button>
      <section className="contact" aria-labelledby="ws-h">
        <h2 id="ws-h">Get in touch</h2>
        {sent ? <p className="ok">Thanks. We reply within two working days. Prototype: nothing was sent.</p> : (
          <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <label className="field"><span>Name</span><input required /></label>
            <label className="field"><span>Company</span><input required /></label>
            <label className="field"><span>Role</span><input /></label>
            <label className="field full"><span>Message</span><textarea rows={4} required /></label>
            <button className="btn">Send</button>
          </form>
        )}
      </section>
    </div>
  )
}
