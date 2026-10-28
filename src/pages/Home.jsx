import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Checkmark, Upload } from '@carbon/icons-react'
import { usePrices } from '../store.jsx'
import Chart from '../ui/Chart.jsx'
import Sessions from '../ui/Sessions.jsx'
import { INSTRUMENTS, byId, fmt, signedUsd, spreadLabel, usd } from '../data/market.js'
import { pnl } from '../data/account.js'
import { SESSIONS } from '../data/sessions.js'

// The idea: GlobalTrade's day is the world's trading day. The page is a dark room in which the
// markets are the lit things: a gold price line behind the name, the four sessions with a marker
// at this minute, one order shown from placed to closed. Prices are a labelled demo feed.

const HERO = ['XAUUSD', 'EURUSD', 'BTCUSD']

// The site uses hash routing, so in-page links scroll by id instead of changing the hash.
const jump = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
const ORDER = { ins: 'XAUUSD', side: 'Buy', lots: 0.5, open: 3961.2, stop: 3930.0, target: 4020.0 }
const PAST = { open: 3871.6, close: 3893.15, lots: 0.2, at: '9 Sep, 10:11' }

// Sections reveal their parts once, as they enter. Content is visible without script.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv')
    if (!('IntersectionObserver' in window)) return
    document.documentElement.classList.add('rv-on')
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0, rootMargin: '0px 0px -8% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Hero() {
  const { series, change } = usePrices()
  const [k, setK] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => !document.hidden && setK((x) => (x + 1) % HERO.length), 6500)
    return () => clearInterval(id)
  }, [])
  const id = HERO[k]
  // The rail docks as the header once it reaches the top; then it takes the page ground.
  const rail = useRef(null)
  useEffect(() => {
    const on = () => rail.current && rail.current.classList.toggle('stuck', rail.current.getBoundingClientRect().top <= 0.5)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className="hero" aria-labelledby="hero-h">
      <div className="hero-pic" data-ui>
        {HERO.map((h, i) => <div key={h} className={`hero-layer ${i === k ? 'on' : ''}`} aria-hidden={i !== k}><Chart id={h} data={series[h].slice(-160)} height="fill" lane={92} label={`${byId[h].name}, last 13 hours, demo prices`} /></div>)}
        <p className="hero-cap num" aria-live="off"><b>{byId[id].name}</b> {fmt(id, series[id][series[id].length - 1].p)} <span>{change(id) >= 0 ? '+' : '−'}{Math.abs(change(id) * 100).toFixed(2)}% today · last 13 hours · demo prices</span></p>
      </div>
      <nav className="rail" ref={rail} aria-label="Main">
        <h1 id="hero-h">GlobalTrade: forex, gold, crypto</h1>
        <p className="rail-line">One account for currencies, metals and coins.</p>
        <div className="rail-links">
          <a href="#/" onClick={jump('markets')}>Markets</a>
          <Link to="/login">Log in</Link>
          <Link to="/register" className="btn gold small">Open an account</Link>
        </div>
      </nav>
      <div className="hero-mob">
        <p>One account for currencies, metals and coins.</p>
        <Link to="/register" className="btn gold">Open an account</Link>
      </div>
      <div className="hero-pic second">
        <Sessions />
      </div>
    </header>
  )
}

function Showcase() {
  const { price } = usePrices()
  const [closed, setClosed] = useState(null)
  const bid = price('XAUUSD') - byId.XAUUSD.spread * byId.XAUUSD.pip / 2
  const live = pnl('XAUUSD', 'Buy', ORDER.lots, ORDER.open, bid)
  const done = closed ?? { at: PAST.at, open: PAST.open, close: PAST.close, lots: PAST.lots, pnl: pnl('XAUUSD', 'Buy', PAST.lots, PAST.open, PAST.close) }
  const row = (state, body) => (
    <div className="sc-row rv">
      <span className="sc-word">{state}</span>
      <div className={`ticket t-${state.toLowerCase()}`} data-ui>{body}</div>
    </div>
  )
  return (
    <section className="sec showcase" aria-labelledby="sc-h">
      <h2 id="sc-h" className="rv">One order, start to finish</h2>
      {row('Placed', <>
        <span className="tk-main"><b>Buy {ORDER.lots.toFixed(2)} lot</b> XAU/USD</span>
        <span className="tk-cell num"><small>Limit</small>{fmt('XAUUSD', ORDER.open)}</span>
        <span className="tk-cell num"><small>Stop</small>{fmt('XAUUSD', ORDER.stop)}</span>
        <span className="tk-cell num"><small>Target</small>{fmt('XAUUSD', ORDER.target)}</span>
        <span className="tk-end">Waiting for the price</span>
      </>)}
      {row('Open', <>
        <span className="tk-main"><b>Buy {ORDER.lots.toFixed(2)} lot</b> XAU/USD</span>
        <span className="tk-cell num"><small>Entry</small>{fmt('XAUUSD', ORDER.open)}</span>
        <span className="tk-cell num"><small>Now</small>{fmt('XAUUSD', bid)}</span>
        <span className="tk-cell num"><small>Profit</small>{signedUsd(live)}</span>
        {closed ? <span className="tk-end">Closed below</span> : <button className="btn line small" onClick={() => setClosed({ at: 'just now', open: ORDER.open, close: bid, lots: ORDER.lots, pnl: live })}>Close at {fmt('XAUUSD', bid)}</button>}
      </>)}
      {row('Closed', <>
        <span className="tk-main"><b>Bought {done.lots.toFixed(2)} lot</b> XAU/USD</span>
        <span className="tk-cell num"><small>Entry</small>{fmt('XAUUSD', done.open)}</span>
        <span className="tk-cell num"><small>Exit</small>{fmt('XAUUSD', done.close)}</span>
        <span className="tk-cell num"><small>Result</small>{signedUsd(done.pnl)}</span>
        <span className="tk-end"><Checkmark size={16} /> {done.at}</span>
      </>)}
      <p className="sc-note rv">Demo prices. The profit is worked out from the price on screen: {ORDER.lots} lot of gold is {ORDER.lots * 100} ounces, so each dollar the price moves is {usd(ORDER.lots * 100, 0)}.</p>
    </section>
  )
}

function Markets() {
  const { series, price, change } = usePrices()
  const [active, setActive] = useState('XAUUSD')
  const rows = useRef({})
  // On a phone, the row nearest the pinned chart becomes active as the list scrolls.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.dataset.id)), { rootMargin: '-45% 0px -50% 0px' })
    Object.values(rows.current).forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])
  const ins = byId[active]
  const hours = ins.kind === 'Crypto' ? 'Open every day, around the clock' : 'Sunday 22:00 to Friday 22:00 UTC'
  return (
    <section className="sec markets" id="markets" aria-labelledby="mk-h">
      <div className="mk-pic" data-ui>
        <div className="mk-chart-head"><b>{ins.name}</b><span className="num">{fmt(active, price(active))}</span></div>
        <Chart id={active} data={series[active].slice(-144)} height={340} label={`${ins.name}, last 12 hours, demo prices`} />
        <p className="mk-chart-cap">Last 12 hours, demo prices, UTC</p>
      </div>
      <div className="mk-list">
        <h2 id="mk-h">Markets</h2>
        <p className="mk-sub">Eight to start with, in three groups. Prices here are a demo feed.</p>
        <ol>
          {INSTRUMENTS.map((i) => {
            const ch = change(i.id)
            return (
              <li key={i.id} ref={(el) => (rows.current[i.id] = el)} data-id={i.id} className={active === i.id ? 'on' : ''}>
                <button onMouseEnter={() => setActive(i.id)} onFocus={() => setActive(i.id)} onClick={() => setActive(i.id)} aria-expanded={active === i.id}>
                  <span className="mk-name">{i.name}<small>{i.kind}</small></span>
                  <span className="mk-price num">{fmt(i.id, price(i.id))}<small>{ch >= 0 ? '+' : '−'}{Math.abs(ch * 100).toFixed(2)}% today</small></span>
                </button>
                {active === i.id && (
                  <p className="mk-desc">{i.long}. Typical spread {spreadLabel(i)}. {hours}.</p>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function How() {
  return (
    <section className="sec how" aria-labelledby="how-h">
      <h2 id="how-h" className="rv">Open an account</h2>
      <div className="ex rv">
        <p className="ex-say">First, tell us who you are.</p>
        <div className="call"><label>Email<span className="field">sofia.brandt@example.com</span></label></div>
        <div className="resp" data-ui><Checkmark size={16} /> We sent a six-digit code to sofia.brandt@example.com. It works for 10 minutes.</div>
      </div>
      <div className="ex rv">
        <p className="ex-say">Then, show us it is you.</p>
        <div className="call"><label>Passport or ID card<span className="field file"><Upload size={16} /> passport-sofia-brandt.jpg · 2.1 MB</span></label></div>
        <div className="resp" data-ui><span className="pill">In review</span> A person checks your document and a selfie. We will email you when it is done.</div>
      </div>
      <div className="ex rv">
        <p className="ex-say">Finally, add money and place a trade.</p>
        <div className="call"><label>Deposit<span className="field num">$500.00 from card ending 4417</span></label></div>
        <div className="resp wide" data-ui>
          <div className="mini">
            <div><small>Balance</small><b className="num">$500.00</b></div>
            <div><small>Used as margin</small><b className="num">$0.00</b></div>
            <div><small>Free to trade</small><b className="num">$500.00</b></div>
            <div><small>Open trades</small><b className="num">0</b></div>
          </div>
          <Sessions compact />
        </div>
      </div>
      <Link to="/register" className="link rv">Start the real sign-up flow <ArrowRight size={16} /></Link>
    </section>
  )
}

function Pricing() {
  return (
    <section className="sec pricing" aria-labelledby="pr-h">
      <div className="pr-text rv">
        <h2 id="pr-h">One account</h2>
        <p>No tiers to compare. Every client gets the same prices, the same markets and the same support. You can start small and add money when you are ready.</p>
      </div>
      <div className="pr-fig rv">
        <p className="figure num" aria-label="Minimum first deposit: 100 US dollars"><span className="cur">$</span>100<span className="per">first deposit</span></p>
        <div className="pr-chip" data-ui><span>XAU/USD</span><b className="num">0.25</b><small>typical spread</small></div>
        <ul>
          <li>Every market on this page</li>
          <li>Leverage up to the limit your country allows</li>
          <li>No GlobalTrade fee on deposits</li>
          <li>A practice account with $10,000 in play money</li>
        </ul>
        <Link to="/register" className="btn gold">Open an account</Link>
      </div>
    </section>
  )
}

const tbc = (t) => <mark className="tbc" title="To be confirmed by GlobalTrade before launch">{t}</mark>

function About() {
  return (
    <section className="sec about" aria-labelledby="ab-h">
      <h2 id="ab-h" className="sr-only">About GlobalTrade</h2>
      <div className="ab-row rv">
        <dl className="facts">
          <div><dt>Company</dt><dd>{tbc('Registered company name')}</dd></div>
          <div><dt>Registered in</dt><dd>{tbc('Country and number')}</dd></div>
          <div><dt>Regulated by</dt><dd>{tbc('Regulator and licence')}</dd></div>
        </dl>
        <p className="ab-para">GlobalTrade is a broker for people who trade currencies, gold and crypto next to a day job. We show prices, costs and risks in plain numbers, publish only claims we can back with a licence or a document, and keep the same account for everyone.</p>
      </div>
      <div className="ab-row rv">
        <p className="ab-word">Markets</p>
        <div className="ab-lists">
          <ul>{INSTRUMENTS.slice(0, 5).map((i) => <li key={i.id}><span>{i.name}</span><span className="muted">{i.kind}</span></li>)}</ul>
          <ul>{INSTRUMENTS.slice(5).map((i) => <li key={i.id}><span>{i.name}</span><span className="muted">{i.kind}</span></li>)}<li><span>Sessions</span><span className="muted num">{SESSIONS.length} centres</span></li></ul>
        </div>
      </div>
    </section>
  )
}

const FAQ = [
  ['Is GlobalTrade regulated?', <>Our licence is {tbc('regulator, licence number and a link to the public register')}. Check it on the regulator’s own site before you deposit. That is good practice with any broker.</>],
  ['Where is my money kept?', <>Client money is held {tbc('in segregated accounts at named banks')}, apart from the company’s own money.</>],
  ['How long does verification take?', 'Most checks are done within one business day. If a document is unclear we ask for another one by email, and your account stays as it is in the meantime.'],
  ['How do withdrawals work?', 'You can withdraw to the card or bank account you paid in from. Each request is checked by a person first, and you can follow its status in the client area.'],
  ['What can I lose?', 'Trading on margin is high risk. Prices can move against you quickly and you can lose all the money in your account. Only trade with money you can afford to lose.'],
  ['When can I trade?', 'Forex and metals trade from Sunday 22:00 to Friday 22:00 UTC. Crypto trades every day. The sessions at the top of this page show what is open right now.'],
]
function Faq() {
  return (
    <section className="sec faq" aria-labelledby="fq-h">
      <div className="fq-row"><h2 id="fq-h" className="fq-q soft">Questions</h2><span /></div>
      {FAQ.map(([q, a]) => (
        <div key={q} className="fq-row rv"><h3 className="fq-q">{q}</h3><p className="fq-a">{a}</p></div>
      ))}
    </section>
  )
}

function Contact() {
  return (
    <section className="sec contact" aria-labelledby="ct-h">
      <h2 id="ct-h" className="ct-say">Write to us about your account, a trade or a payment.</h2>
      <a className="ct-mail" href="mailto:support@globaltrade.example?subject=Question%20about%20my%20account">support@<wbr />globaltrade.example</a>
      <div className="ct-corners">
        <span>Live chat in the client area, {tbc('hours')}</span>
        <span>{tbc('Registered address')}</span>
      </div>
    </section>
  )
}

export default function Home() {
  useReveal()
  return (
    <div className="site">
      <p className="risk-top">Trading on margin is high risk. You can lose all the money you deposit. {tbc('Regulator-required risk figure')}</p>
      <Hero />
      <main>
        <Showcase />
        <Markets />
        <How />
        <Pricing />
        <About />
        <Faq />
        <Contact />
      </main>
      <footer className="foot">
        <span className="muted">GlobalTrade, a multi-asset broker</span>
        <span className="foot-links"><a href="#/" onClick={jump('markets')}>Markets</a><Link to="/register">Open an account</Link><Link to="/login">Log in</Link></span>
        <span className="muted">2026 · <a href="#/" onClick={jump('ab-h')}>Privacy</a></span>
        <p className="foot-risk">Prices on this prototype are a simulated demo feed, not market data. Nothing here is investment advice.</p>
      </footer>
    </div>
  )
}
