import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '@carbon/icons-react'
import { usePrices } from '../store.jsx'
import Dial from '../ui/Dial.jsx'
import { useNow } from '../ui/Sessions.jsx'
import { INSTRUMENTS, byId, fmt, spreadLabel, usd, signedUsd } from '../data/market.js'
import { CLIENT, CLOSED, FUNDS, OPEN, balances } from '../data/account.js'
import { sessionNow } from '../data/sessions.js'

// GlobalTrade, dressed as a watchmaker. The borrowed category is the watch counter: one object
// on a dark field, a wide low wordmark, few words, long pauses. The object is the market itself:
// the four trading sessions drawn as a world-time dial, set to the visitor's real minute. Below
// it the broker shows its paperwork as a private bank would, on paper, with sums that add up.

// Sections reveal their parts once, as they enter. Content stays visible without script.
function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    document.documentElement.classList.add('rv-on')
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -6% 0px' })
    document.querySelectorAll('.rv').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
const jump = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
const tbc = (t) => <mark className="tbc" title="To be confirmed by GlobalTrade before launch">{t}</mark>

function Hero() {
  const { price } = usePrices()
  const now = useNow(20000)
  const info = sessionNow(now)
  return (
    <header className="hero">
      <nav className="top" aria-label="Main">
        <span className="mark-small">GlobalTrade</span>
        <span className="top-links">
          <a href="#/" onClick={jump('markets')}>Markets</a>
          <a href="#/" onClick={jump('papers')}>Statements</a>
          <Link to="/login">Log in</Link>
        </span>
      </nav>
      <div className="counter">
        <Dial />
        <h1 className="wordmark">GlobalTrade</h1>
        <p className="tagline">Forex, gold and crypto in one account.</p>
        <div className="spec-row">
          <span className="spec num">Gold {fmt('XAUUSD', price('XAUUSD'))}<small>demo price</small></span>
          <Link to="/register" className="buy">Open an account <span>from $100</span></Link>
          <span className="spec">{info.open.length ? `${info.open.map((s) => s.city).join(' and ')} open` : info.fx ? 'Between sessions' : 'Weekend, crypto open'}<small>{`${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`}</small></span>
        </div>
      </div>
    </header>
  )
}

// The broker's paperwork, as a private bank would show it: on paper, with sums that add up.
const dt = (s) => new Date(s.replace(' ', 'T') + 'Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
function statement() {
  const sep = CLOSED.filter((t) => t.closed < '2026-10-01')
  const oct = CLOSED.filter((t) => t.closed >= '2026-10-01')
  const dIn = FUNDS.filter((f) => f.kind === 'Deposit' && f.status === 'Completed' && f.date < '2026-10-01').reduce((a, f) => a + f.amount, 0)
  const opening = Math.round((dIn + sep.reduce((a, t) => a + t.pnl, 0)) * 100) / 100
  const out = FUNDS.filter((f) => f.kind === 'Withdrawal' && f.status === 'Completed' && f.date >= '2026-10-01').reduce((a, f) => a + f.amount, 0)
  const pl = Math.round(oct.reduce((a, t) => a + t.pnl, 0) * 100) / 100
  const closing = Math.round((opening - out + pl) * 100) / 100
  console.assert(Math.abs(closing - balances(FUNDS).balance) < 0.005, 'statement closes on the account balance')
  return { oct, opening, out, pl, closing }
}
function Paper({ which }) {
  const g = OPEN[0]
  if (which === 'confirm') {
    const oz = g.lots * byId.XAUUSD.lot
    const notional = oz * g.open
    return (
      <article className="sheet" data-ui>
        <header><b>GlobalTrade</b><span>Trade confirmation</span></header>
        <p className="sheet-to">{CLIENT.name} · account {CLIENT.id}<br />{dt(g.opened)}, 08:12 UTC</p>
        <h3>Bought {g.lots.toFixed(2)} lot of gold</h3>
        <dl>
          <div><dt>Market</dt><dd>XAU/USD, gold against the US dollar</dd></div>
          <div><dt>Size</dt><dd className="num">{oz} troy ounces</dd></div>
          <div><dt>Price</dt><dd className="num">{fmt('XAUUSD', g.open)}</dd></div>
          <div><dt>Value</dt><dd className="num">{usd(notional)}</dd></div>
          <div><dt>Margin at {CLIENT.leverage}</dt><dd className="num">{usd(notional / 30)}</dd></div>
          <div><dt>Stop, target</dt><dd className="num">{fmt('XAUUSD', g.stop)}, {fmt('XAUUSD', g.target)}</dd></div>
          <div><dt>Spread paid</dt><dd className="num">{usd(byId.XAUUSD.spread * byId.XAUUSD.pip * oz)}</dd></div>
          <div><dt>Commission</dt><dd className="num">$0.00</dd></div>
        </dl>
        <footer>Reference {g.id}. Keep this for your records.</footer>
      </article>
    )
  }
  if (which === 'statement') {
    const st = statement()
    return (
      <article className="sheet" data-ui>
        <header><b>GlobalTrade</b><span>Statement, October 2026</span></header>
        <p className="sheet-to">{CLIENT.name} · account {CLIENT.id}<br />1 to 28 October 2026, in US dollars</p>
        <h3>Closing balance {usd(st.closing)}</h3>
        <table>
          <tbody>
            <tr><td>Opening balance, 1 October</td><td className="num">{usd(st.opening)}</td></tr>
            <tr><td>Withdrawn, 6 October</td><td className="num">−{usd(st.out)}</td></tr>
            {st.oct.map((t) => <tr key={t.id}><td>{t.side === 'Buy' ? 'Bought' : 'Sold'} {byId[t.ins].name}, closed {t.closed.slice(8, 10)} Oct</td><td className="num">{signedUsd(t.pnl)}</td></tr>)}
            <tr className="total"><td>Closing balance</td><td className="num">{usd(st.closing)}</td></tr>
          </tbody>
        </table>
        <footer>A $400.00 withdrawal requested on 27 October is in review and not yet deducted.</footer>
      </article>
    )
  }
  if (which === 'receipt') {
    const w = FUNDS.find((x) => x.id === 'W-0712')
    return (
      <article className="sheet narrow" data-ui>
        <header><b>GlobalTrade</b><span>Withdrawal receipt</span></header>
        <h3>{usd(w.amount)} sent</h3>
        <dl>
          <div><dt>To</dt><dd>{w.method}</dd></div>
          <div><dt>Requested</dt><dd>{dt(w.date + ' 09:00')}</dd></div>
          <div><dt>Checked by</dt><dd>A person on our payments team</dd></div>
          <div><dt>Fee</dt><dd>{tbc('to confirm')}</dd></div>
        </dl>
        <footer>Reference {w.id}</footer>
      </article>
    )
  }
  const t = CLOSED.find((x) => x.id === 'T-50688')
  const spread = byId.EURUSD.spread * 10 * t.lots
  return (
    <article className="sheet" data-ui>
      <header><b>GlobalTrade</b><span>What this trade cost</span></header>
      <p className="sheet-to">{CLIENT.name} · {t.id}<br />Sold {t.lots.toFixed(2)} lot of EUR/USD, 15 October, closed the same day</p>
      <h3>Total cost {usd(spread)}</h3>
      <table>
        <tbody>
          <tr><td>Spread, {byId.EURUSD.spread} pips at $10 a pip</td><td className="num">{usd(spread)}</td></tr>
          <tr><td>Commission</td><td className="num">$0.00</td></tr>
          <tr><td>Overnight financing, closed the same day</td><td className="num">$0.00</td></tr>
          <tr className="total"><td>Total cost</td><td className="num">{usd(spread)}</td></tr>
        </tbody>
      </table>
      <footer>The result of the trade, {signedUsd(t.pnl)}, already includes the spread.</footer>
    </article>
  )
}
const PAPERS = [['confirm', 'Trade confirmation'], ['statement', 'Monthly statement'], ['cost', 'Cost of a trade'], ['receipt', 'Withdrawal receipt']]
function Papers() {
  const [sel, setSel] = useState('confirm')
  return (
    <section className="papers" id="papers" aria-label="Statements and receipts">
      <div className="papers-index rv" role="tablist" aria-label="Documents">
        {PAPERS.map(([id, label]) => <button key={id} role="tab" aria-selected={sel === id} onClick={() => setSel(id)}>{label}</button>)}
        <p className="papers-note">Every trade, payment and cost comes back to you in writing. These are samples from a demo account.</p>
      </div>
      <div className="papers-stage rv"><div key={sel} className="fadein"><Paper which={sel} /></div></div>
    </section>
  )
}

const GROUPS = ['Metals', 'Forex', 'Crypto']
function Markets() {
  const { price } = usePrices()
  return (
    <section className="markets" id="markets" aria-labelledby="mk-h">
      <h2 id="mk-h" className="sr-only">Markets</h2>
      {GROUPS.map((g) => (
        <div key={g} className="mk-group rv">
          <h3 className="mk-day">{g}</h3>
          {INSTRUMENTS.filter((i) => i.kind === g).map((i) => (
            <div key={i.id} className="mk-row">
              <span>{i.name}</span>
              <span className="num">{fmt(i.id, price(i.id))}</span>
              <span>{g === 'Crypto' ? 'Every day' : 'Sun 22:00 to Fri 22:00'}</span>
              <span className="num">{spreadLabel(i)}</span>
            </div>
          ))}
        </div>
      ))}
      <p className="mk-note rv">Live demo prices. Typical spreads shown are samples for GlobalTrade to confirm. Times are UTC.</p>
    </section>
  )
}

function Steps() {
  const steps = [
    ['First, you apply.', <><b>Sofia Brandt</b><span>sofia.brandt@example.com</span><span>Germany</span><em>Application received</em></>],
    ['Then we check it is you.', <><b>Sofia Brandt</b><span>Passport, utility bill</span><span>Checked by a person</span><em>Verified</em></>],
    ['Then you add money.', <><b>Sofia Brandt</b><span className="num">Card ending 4417</span><span className="num">$500.00 added</span><em>Funded</em></>],
    ['Finally, you trade.', <><b>Bought 0.05 lot of gold</b><span className="num">at 3,961.20</span><span className="num">margin $660.20</span><em>Position open</em></>],
  ]
  return (
    <section className="steps" aria-labelledby="st-h">
      {steps.map(([say, card], i) => (
        <div key={say} className={`field f${i + 1}`}>
          {i === 0 && <h2 id="st-h">Opening an account</h2>}
          <div className="acard" data-ui>{card}</div>
          <p className="field-say">{say}</p>
        </div>
      ))}
    </section>
  )
}

function Plans() {
  return (
    <section className="plans" aria-label="Accounts">
      <div className="plan practice rv">
        <h2>Practice</h2>
        <p className="plan-for">For learning the platform with play money.</p>
        <p className="plan-in">$10,000 of play money, every market, live demo prices, no time limit. Nothing you do here touches real money.</p>
        <div className="plan-foot"><p className="price num">$0<small>always</small></p><Link to="/register" className="btn line">Try the practice account</Link></div>
      </div>
      <div className="plan live rv">
        <h2>Live account</h2>
        <p className="plan-for">For trading with your own money.</p>
        <p className="plan-in">Every market on this page, leverage up to the limit your country allows, no GlobalTrade fee on deposits, statements for every trade and payment.</p>
        <div className="plan-foot"><p className="price num">$100<small>first deposit</small></p><Link to="/register" className="btn ink">Open an account</Link></div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about rv" aria-labelledby="ab-h">
      <h2 id="ab-h" className="sr-only">About GlobalTrade</h2>
      <p>
        <b>GlobalTrade</b> is a broker for people who trade <span className="hl a">currencies, gold and crypto</span> alongside their working lives. We keep one account for everyone, so the person with $100 sees the same prices and the same support as the person with $100,000. Every trade, deposit and withdrawal comes back to you as a <span className="hl b">written confirmation</span>, with what it cost spelled out. We publish only what we can back with a licence or a document: our company is {tbc('registered company name')}, authorised by {tbc('regulator and licence number')}, and client money is held {tbc('in segregated accounts at named banks')}. Trading on margin is high risk, and we would rather you understood that before you start than after. <a href="#/" onClick={jump('contact')} className="hl c">Ask us anything before you open an account.</a>
      </p>
    </section>
  )
}

const FAQ = [
  ['Licence', 'Is GlobalTrade regulated?', <>Our licence is {tbc('regulator, licence number and a link to the public register')}. Check it on the regulator’s own site before you deposit. That is good practice with any broker.</>],
  ['Your money', 'Where is my money kept?', <>Client money is held {tbc('in segregated accounts at named banks')}, apart from the company’s own money.</>],
  ['Checks', 'How long does verification take?', 'Most checks are done within one business day. If a document is unclear we ask for another one by email, and your account stays as it is in the meantime.'],
  ['Withdrawals', 'How do withdrawals work?', 'You withdraw to the card or bank account you paid in from. Each request is checked by a person, and you can follow its status in the client area.'],
  ['Risk', 'What can I lose?', 'Trading on margin is high risk. Prices can move against you quickly and you can lose all the money in your account. Only trade with money you can afford to lose.'],
  ['Hours', 'When can I trade?', 'Forex and metals trade from Sunday 22:00 to Friday 22:00 UTC. Crypto trades every day. The dial at the top of this page shows what is open right now.'],
]
function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="faq" aria-labelledby="fq-h">
      <h2 id="fq-h" className="rv">Before you ask</h2>
      <div className="drawer">
        {FAQ.map(([tab, q, a], i) => (
          <div key={tab} className={`fcard c${(i % 3) + 1} ${open === i ? 'open' : ''}`} style={{ '--i': i }}>
            <button className="fcard-head" aria-expanded={open === i} onClick={() => setOpen(i)}>
              <span className="ftab">{tab}</span>
              <span className="fq">{q}</span>
            </button>
            {open === i && <p className="fa">{a}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="ct-h">
      <h2 id="ct-h" className="sr-only">Contact</h2>
      <a className="crow" href="mailto:support@globaltrade.example?subject=Question%20before%20opening%20an%20account">support@globaltrade.example</a>
      <span className="crow">Live chat in the client area</span>
      <span className="crow">{tbc('Registered address')}</span>
      <span className="crow">{tbc('Support hours')}</span>
      <span className="crow greet">Write to us<a className="round" href="mailto:support@globaltrade.example?subject=Question%20before%20opening%20an%20account" aria-label="Email GlobalTrade support"><ArrowRight size={28} /></a></span>
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
        <Papers />
        <Markets />
        <Steps />
        <Plans />
        <About />
        <Faq />
        <Contact />
      </main>
      <footer className="foot">
        <div className="foot-cols">
          <div><b>GlobalTrade</b><span>{tbc('Registered company name')}</span><span>{tbc('Registered address')}</span></div>
          <div><b>Site</b><a href="#/" onClick={jump('markets')}>Markets</a><a href="#/" onClick={jump('papers')}>Statements</a><Link to="/register">Open an account</Link><Link to="/login">Log in</Link></div>
          <div><b>Contact</b><a href="mailto:support@globaltrade.example">support@globaltrade.example</a><span>Live chat in the client area</span></div>
          <div><b>Risk</b><span>Trading on margin is high risk. Only trade with money you can afford to lose.</span></div>
        </div>
        <p className="foot-word" aria-hidden="true"><span>Global</span><span>Trade</span></p>
        <p className="legal">© 2026 GlobalTrade. Prices on this prototype are a simulated demo feed, not market data. Nothing here is investment advice.</p>
      </footer>
    </div>
  )
}
