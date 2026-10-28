import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUp, CheckmarkFilled, ChevronDown, Time } from '@carbon/icons-react'
import { usePrices } from '../store.jsx'
import Chart from '../ui/Chart.jsx'
import Dial from '../ui/Dial.jsx'
import { useNow } from '../ui/Sessions.jsx'
import { INSTRUMENTS, byId, fmt, spreadLabel, usd } from '../data/market.js'
import { CLIENT, FUNDS, OPEN } from '../data/account.js'
import { sessionNow } from '../data/sessions.js'

// GlobalTrade. Direction "the sentence is the layout": one short sentence at poster scale, and
// inside it, where the word "gold" would be, the live gold price itself. The brand's colour is
// also its flagship market. Every section after it repeats the grammar at a smaller scale: a
// short statement with its proof beside it, and the proof is always a working piece of the platform.

// Parts of each section rise once as they enter, staggered. Content stays visible without script.
function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    document.documentElement.classList.add('rv-on')
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('.rv').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
const jump = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
const tbc = (t) => <mark className="tbc" title="To be confirmed by GlobalTrade before launch">{t}</mark>
const pct = (n) => `${n >= 0 ? '+' : '−'}${Math.abs(n * 100).toFixed(2)}%`
const utc = (d) => `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`

// A price that briefly lights when it changes, in the direction it moved.
function Px({ id, className = '' }) {
  const { price } = usePrices()
  const p = price(id)
  const last = useRef(p)
  const [dir, setDir] = useState('')
  useEffect(() => {
    if (p === last.current) return
    setDir(p > last.current ? 'up' : 'down')
    last.current = p
    const t = setTimeout(() => setDir(''), 700)
    return () => clearTimeout(t)
  }, [p])
  return <span className={`px num ${dir} ${className}`}>{fmt(id, p)}</span>
}

function Nav() {
  return (
    <nav className="top" aria-label="Main">
      <Link to="/" className="wordmark">GlobalTrade</Link>
      <span className="top-links">
        <a href="#/" onClick={jump('markets')}>Markets</a>
        <a href="#/" onClick={jump('costs')}>Costs</a>
        <a href="#/" onClick={jump('platform')}>Platform</a>
        <a href="#/" onClick={jump('account')}>Account</a>
        <a href="#/" onClick={jump('faq')}>Questions</a>
      </span>
      <span className="top-end">
        <Link to="/login" className="top-login">Log in</Link>
        <Link to="/register" className="btn gold small">Open an account</Link>
      </span>
    </nav>
  )
}

// The word in the sentence: gold, shown instead of said.
function GoldChip() {
  const { series, change } = usePrices()
  const data = series.XAUUSD.slice(-96)
  const ch = change('XAUUSD')
  return (
    <span className="chip" data-ui aria-hidden="true">
      <span className="chip-chart"><Chart id="XAUUSD" data={data} height="fill" axes={false} area={false} /></span>
      <span className="chip-read"><b>Gold</b><Px id="XAUUSD" /><small className={ch >= 0 ? 'pos' : 'neg'}>{pct(ch)}</small></span>
    </span>
  )
}

function Hero() {
  const { change } = usePrices()
  return (
    <header className="hero">
      <Nav />
      <div className="hero-main">
        <h1 className="sentence">
          <span className="sr-only">Trade gold on world time</span>
          <span className="mask" aria-hidden="true"><span className="line l1">Trade <GoldChip /></span></span>
          <span className="mask" aria-hidden="true"><span className="line l2">on world time</span></span>
        </h1>
        <p className="lede">GlobalTrade is a forex, gold and crypto broker. Live prices around the clock, every cost in writing, from $100.</p>
        <div className="hero-actions">
          <Link to="/register" className="btn gold">Open an account</Link>
          <a href="#/" className="link" onClick={jump('markets')}>See the markets <ArrowRight size={18} /></a>
        </div>
      </div>
      <ul className="ticker" aria-label="Demo prices">
        {INSTRUMENTS.map((i) => {
          const ch = change(i.id)
          return (
            <li key={i.id}>
              <a href="#/" onClick={jump('markets')}>
                <span className="tk-name">{i.name}</span>
                <Px id={i.id} />
                <small className={`num ${ch >= 0 ? 'pos' : 'neg'}`}>{pct(ch)}</small>
              </a>
            </li>
          )
        })}
      </ul>
    </header>
  )
}

// The platform's market screen, working: pick a market, a range, and read any minute of it.
const RANGES = [['1H', 12, 'last hour'], ['8H', 96, 'last 8 hours'], ['24H', 288, 'last 24 hours']]
function Terminal() {
  const { series, price, change } = usePrices()
  const [sel, setSel] = useState('XAUUSD')
  const [range, setRange] = useState(1)
  const [hover, setHover] = useState(null)
  const box = useRef(null)
  const ins = byId[sel]
  const data = series[sel].slice(-RANGES[range][1])
  const p = price(sel)
  const half = (ins.spread * ins.pip) / 2
  const ch = change(sel)
  const now = useNow(30000)
  const lane = 76
  const onMove = (e) => {
    const r = box.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const w = r.width - lane
    if (x < 0 || x > w) { setHover(null); return }
    const i = Math.round((x / w) * (data.length - 1))
    setHover({ i, left: (i / (data.length - 1)) * w })
  }
  const hp = hover && data[hover.i]
  return (
    <div className="term rv" data-ui>
      <aside className="term-list" aria-label="Markets">
        {['Metals', 'Forex', 'Crypto'].map((g) => (
          <div key={g} role="group" aria-label={g}>
            <span className="term-group">{g}</span>
            {INSTRUMENTS.filter((i) => i.kind === g).map((i) => {
              const c = change(i.id)
              return (
                <button key={i.id} className="term-row" aria-pressed={sel === i.id} onClick={() => { setSel(i.id); setHover(null) }}>
                  <span>{i.name}</span>
                  <Px id={i.id} />
                  <small className={`num ${c >= 0 ? 'pos' : 'neg'}`}>{pct(c)}</small>
                </button>
              )
            })}
          </div>
        ))}
      </aside>
      <div className="term-main">
        <div className="term-head">
          <div>
            <h3>{ins.name}<span>{ins.long}</span></h3>
            <p className="term-price"><Px id={sel} /><small className={`num ${ch >= 0 ? 'pos' : 'neg'}`}>{pct(ch)} since 00:00 UTC</small></p>
          </div>
          <div className="term-tabs" role="group" aria-label="Range">
            {RANGES.map(([l], k) => <button key={l} aria-pressed={range === k} onClick={() => { setRange(k); setHover(null) }}>{l}</button>)}
          </div>
        </div>
        <div className="term-chart" ref={box} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          <Chart id={sel} data={data} height="fill" lane={lane} label={`${ins.name}, ${RANGES[range][2]}, demo data`} />
          {hp && (
            <>
              <span className="xhair" style={{ left: hover.left }} />
              <span className="xread num" style={{ left: Math.max(0, Math.min(hover.left + 12, (box.current?.clientWidth || 600) - lane - 150)) }}>{fmt(sel, hp.p)}<small>{utc(new Date(hp.t))} UTC</small></span>
            </>
          )}
        </div>
        <div className="term-foot">
          <span><small>Sell</small><b className="num">{fmt(sel, p - half)}</b></span>
          <span><small>Buy</small><b className="num">{fmt(sel, p + half)}</b></span>
          <span><small>Typical spread</small><b className="num">{spreadLabel(ins)}</b></span>
          <span><small>Hours</small><b>{ins.kind === 'Crypto' ? 'Every day' : 'Sun 22:00 to Fri 22:00'}</b></span>
          <span className="term-now"><Time size={16} /> {sessionNow(now).line}</span>
        </div>
      </div>
    </div>
  )
}

function Markets() {
  return (
    <section className="sec markets" id="markets" aria-labelledby="mk-h">
      <div className="sec-head rv">
        <h2 id="mk-h">Eight markets, one screen</h2>
        <p>Gold, silver, four currency pairs, bitcoin and ether, on the same screen you will trade from. Pick a market, change the range, and read any minute of the day.</p>
      </div>
      <Terminal />
      <p className="fine rv">Simulated demo prices, updating every 1.5 seconds. Typical spreads are samples for GlobalTrade to confirm. Times are UTC.</p>
    </section>
  )
}

// The live thing: type what you would put in, and on what, and read what it really means.
const LEV = { XAUUSD: 20, EURUSD: 30, GBPUSD: 30, USDJPY: 30, AUDUSD: 20, XAGUSD: 10, BTCUSD: 2, ETHUSD: 2 }
const WORDS = [[/gold|xau/, 'XAUUSD'], [/silver|xag/, 'XAGUSD'], [/bitcoin|btc/, 'BTCUSD'], [/ether|eth/, 'ETHUSD'], [/yen|jpy/, 'USDJPY'], [/pound|sterling|gbp|cable/, 'GBPUSD'], [/aussie|aud/, 'AUDUSD'], [/euro|eur/, 'EURUSD']]
function parse(text) {
  const t = text.toLowerCase()
  const m = t.replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*(k)?/)
  const amount = m ? Number(m[1]) * (m[2] ? 1000 : 1) : 0
  const hit = WORDS.find(([re]) => re.test(t))
  return { amount, id: hit ? hit[1] : null }
}
function Costs() {
  const [text, setText] = useState('$2,500 on gold')
  const { price } = usePrices()
  const { amount, id } = parse(text)
  const ins = id && byId[id]
  let out = null
  if (ins && amount > 0) {
    const p = price(id)
    const perLot = id === 'USDJPY' ? ins.lot : ins.lot * p
    const pipLot = id === 'USDJPY' ? (ins.pip * ins.lot) / p : ins.pip * ins.lot
    const lev = LEV[id]
    const lots = Math.floor(((amount * lev) / perLot) * 100) / 100
    out = { lev, lots, value: lots * perLot, units: lots * ins.lot, unit: ins.unit, spread: lots * ins.spread * pipLot, move: lots * perLot * 0.01, minMargin: (0.01 * perLot) / lev }
  }
  const examples = ['$500 on the euro', '$10,000 on bitcoin', '$300 on silver']
  return (
    <section className="sec costs" id="costs" aria-labelledby="co-h">
      <h2 id="co-h" className="rv">Know the cost before you trade</h2>
      <label className="ask rv" data-ui>
        <span className="sr-only">An amount and a market, for example $2,500 on gold</span>
        <input value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} autoComplete="off" />
      </label>
      <div className="costs-body">
        <div className="answer rv" data-ui aria-live="polite">
          {!ins ? <p className="ans-note">Name a market: gold, silver, euro, pound, yen, aussie, bitcoin or ether.</p>
            : !(amount > 0) ? <p className="ans-note">Add an amount, for example $1,000.</p>
            : out.lots < 0.01 ? <p className="ans-note">The smallest trade on {ins.name} is 0.01 lot, which needs {usd(out.minMargin)} of margin at 1:{out.lev}.</p>
            : (
              <dl>
                <div><dt>Largest position at 1:{out.lev}</dt><dd className="num">{out.lots.toFixed(2)} lot<small>{out.units.toLocaleString('en-US', { maximumFractionDigits: 2 })} {out.unit}, worth {usd(out.value, 0)}</small></dd></div>
                <div><dt>Cost to open it, the spread</dt><dd className="num">{usd(out.spread)}<small>{spreadLabel(ins)} on {ins.name}, no commission</small></dd></div>
                <div className="warn"><dt>If the price moves 1% against you</dt><dd className="num">−{usd(out.move, 0)}<small>{Math.round((out.move / amount) * 100)}% of your {usd(amount, 0)}</small></dd></div>
              </dl>
            )}
          <p className="ans-fine">Leverage shown is the EU and UK retail limit for each market, {tbc('limits under GlobalTrade’s licence to confirm')}. Most traders use far less.</p>
        </div>
        <div className="examples rv">
          <span>Try</span>
          {examples.map((e) => <button key={e} onClick={() => setText(e)}>{e}</button>)}
        </div>
      </div>
    </section>
  )
}

// Proof for each promise: a working fragment of the platform beside it.
function QuoteBoard() {
  const { price } = usePrices()
  return (
    <div className="frag quotes" data-ui>
      <div className="frag-h"><b>Prices</b><span>Demo feed</span></div>
      <table>
        <thead><tr><th>Market</th><th>Sell</th><th>Buy</th><th>Spread</th></tr></thead>
        <tbody>{['XAUUSD', 'EURUSD', 'GBPUSD', 'BTCUSD'].map((id) => {
          const i = byId[id]
          const h = (i.spread * i.pip) / 2
          return <tr key={id}><td>{i.name}</td><td className="num">{fmt(id, price(id) - h)}</td><td className="num">{fmt(id, price(id) + h)}</td><td className="num">{spreadLabel(i)}</td></tr>
        })}</tbody>
      </table>
    </div>
  )
}
function Confirmation() {
  const g = OPEN[0]
  const oz = g.lots * byId.XAUUSD.lot
  return (
    <article className="frag paper" data-ui>
      <header><b>GlobalTrade</b><span>Trade confirmation</span></header>
      <h4>Bought {g.lots.toFixed(2)} lot of gold</h4>
      <dl>
        <div><dt>Size</dt><dd className="num">{oz} troy ounces</dd></div>
        <div><dt>Price</dt><dd className="num">{fmt('XAUUSD', g.open)}</dd></div>
        <div><dt>Value</dt><dd className="num">{usd(oz * g.open)}</dd></div>
        <div><dt>Spread paid</dt><dd className="num">{usd(byId.XAUUSD.spread * byId.XAUUSD.pip * oz)}</dd></div>
        <div><dt>Commission</dt><dd className="num">$0.00</dd></div>
      </dl>
      <footer>{CLIENT.name} · {CLIENT.id} · {g.id}</footer>
    </article>
  )
}
function Withdrawal() {
  const w = FUNDS.find((x) => x.id === 'W-0788')
  const steps = [['Requested', '27 Oct, 09:14'], ['Checked by a person', 'In review now'], ['Sent to your bank', 'Usually the next working day']]
  return (
    <div className="frag track" data-ui>
      <div className="frag-h"><b>Withdrawal {w.id}</b><span className="num">{usd(w.amount)}</span></div>
      <ol>{steps.map(([t, s], k) => <li key={t} className={k === 0 ? 'done' : k === 1 ? 'now' : ''}><i>{k === 0 && <CheckmarkFilled size={16} />}</i><b>{t}</b><span>{s}</span></li>)}</ol>
      <p>To {w.method}, the account it came from.</p>
    </div>
  )
}
const ROWS = [
  ['Prices you can see', 'Sell, buy and the spread between them for every market, side by side. The spread is what a trade costs, so we never hide it.', <QuoteBoard key="q" />, 'w1'],
  ['Four centres, one clock', 'The trading day follows Sydney, Tokyo, London and New York. The dial reads your own clock and lights what is open now.', <div key="d" className="frag dialfrag"><Dial /></div>, 'w2'],
  ['Every trade in writing', 'Each trade, deposit and withdrawal comes back as a confirmation with the price, the size and what it cost you.', <Confirmation key="c" />, 'w3'],
  ['Withdrawals a person checks', 'Money goes back to the account it came from, after someone on our payments team has looked at it. You can follow every step.', <Withdrawal key="w" />, 'w4'],
]
function Platform() {
  return (
    <section className="sec platform" id="platform" aria-labelledby="pl-h">
      <h2 id="pl-h" className="axis rv">A broker you can check</h2>
      {ROWS.map(([t, p, frag, w]) => (
        <div key={t} className={`prow ${w}`}>
          <div className="axis rv"><h3>{t}</h3><p>{p}</p></div>
          <div className="pfrag rv">{frag}</div>
        </div>
      ))}
    </section>
  )
}

// How an account opens, driven by one slider.
const STAGES = [
  ['Apply', 'First, tell us who you are.'],
  ['Verify', 'Then we check it is you.'],
  ['Fund', 'Then add money your way.'],
  ['Trade', 'Finally, place your first trade.'],
]
function StageCard({ k }) {
  if (k === 0) return (
    <div className="frag stage" data-ui>
      <div className="frag-h"><b>Your details</b><span>Application</span></div>
      <dl><div><dt>Name</dt><dd>Sofia Brandt</dd></div><div><dt>Email</dt><dd>sofia.brandt@example.com</dd></div><div><dt>Country</dt><dd>Germany</dd></div><div><dt>Experience</dt><dd>Traded forex before</dd></div></dl>
      <span className="stage-state">Application received</span>
    </div>
  )
  if (k === 1) return (
    <div className="frag stage" data-ui>
      <div className="frag-h"><b>Identity check</b><span>Verification</span></div>
      <dl><div><dt>Passport</dt><dd><CheckmarkFilled size={16} /> Clear and readable</dd></div><div><dt>Proof of address</dt><dd><CheckmarkFilled size={16} /> Utility bill, September</dd></div><div><dt>Checked by</dt><dd>A person on our team</dd></div><div><dt>Time taken</dt><dd className="num">4 hours</dd></div></dl>
      <span className="stage-state">Verified</span>
    </div>
  )
  if (k === 2) return (
    <div className="frag stage" data-ui>
      <div className="frag-h"><b>Add money</b><span>Deposit</span></div>
      <p className="stage-big num">$500.00</p>
      <dl><div><dt>From</dt><dd>Card ending 4417</dd></div><div><dt>GlobalTrade fee</dt><dd className="num">$0.00</dd></div><div><dt>Arrives</dt><dd>Straight away</dd></div></dl>
      <span className="stage-state">Funded</span>
    </div>
  )
  return (
    <div className="frag stage" data-ui>
      <div className="frag-h"><b>Buy gold</b><span>XAU/USD</span></div>
      <p className="stage-big num">0.05 lot<small>at 3,961.20</small></p>
      <dl><div><dt>Margin at 1:20</dt><dd className="num">{usd((0.05 * 100 * 3961.2) / 20)}</dd></div><div><dt>Stop</dt><dd className="num">3,930.00</dd></div><div><dt>Target</dt><dd className="num">4,020.00</dd></div></dl>
      <span className="stage-state gold">Position open</span>
    </div>
  )
}
function Stages() {
  const [k, setK] = useState(0)
  return (
    <section className="stages" id="account" aria-labelledby="sg-h">
      <div className="stg-left">
        <h2 id="sg-h" key={k} className="fadein">{STAGES[k][1]}</h2>
        <p>Opening an account takes four steps and usually less than a day. Drag through them.</p>
      </div>
      <div className="stg-right"><div key={k} className="fadein"><StageCard k={k} /></div></div>
      <div className="stg-slide">
        <div className="rail" style={{ '--p': `${(k / 3) * 100}%` }}>
          <i aria-hidden="true" />
          <input type="range" min="0" max="3" step="1" value={k} onChange={(e) => setK(Number(e.target.value))} aria-label="Step" aria-valuetext={STAGES[k][0]} />
        </div>
        <div className="stg-names">{STAGES.map(([n], i) => <button key={n} className={i <= k ? 'on' : ''} aria-current={i === k ? 'step' : undefined} onClick={() => setK(i)}>{n}</button>)}</div>
      </div>
    </section>
  )
}

function Plan() {
  return (
    <section className="sec plan" aria-labelledby="pr-h">
      <h2 id="pr-h" className="plan-line rv">Open an account <span className="nowrap">from <span className="price">$100</span></span></h2>
      <div className="plan-foot rv">
        <p>One live account for everyone: every market on this page, the same prices and support at $100 or $100,000, and no GlobalTrade fee on deposits.</p>
        <div className="plan-act">
          <Link to="/register" className="btn gold">Open an account</Link>
          <Link to="/register" className="link">Or practise with $10,000 of play money <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="sec about" aria-labelledby="ab-h">
      <aside className="ab-facts rv">
        <h2 id="ab-h">About us</h2>
        <dl>
          <div><dt>Company</dt><dd>{tbc('Registered name')}</dd></div>
          <div><dt>Licence</dt><dd>{tbc('Regulator and number')}</dd></div>
          <div><dt>Client money</dt><dd>{tbc('Segregated, named banks')}</dd></div>
        </dl>
      </aside>
      <div className="ab-text rv">
        <p><span className="ab-dial" aria-hidden="true"><Dial /></span><b>GlobalTrade</b> is a broker for people who trade currencies, gold and crypto alongside their working lives. We keep one account for everyone, so the person with $100 sees the same prices and the same support as the person with $100,000. Every trade, deposit and withdrawal comes back to you in writing, with what it cost spelled out.</p>
        <p>We publish only what we can back with a licence or a document. Trading on margin is high risk, and we would rather you understood that before you start than after.</p>
      </div>
    </section>
  )
}

const FAQ = [
  ['Is GlobalTrade regulated?', <>Our licence is {tbc('regulator, licence number and a link to the public register')}. Check it on the regulator’s own site before you deposit. That is good practice with any broker.</>],
  ['Where is my money kept?', <>Client money is held {tbc('in segregated accounts at named banks')}, apart from the company’s own money.</>],
  ['How long does verification take?', 'Most checks are done within one working day. If a document is unclear we ask for another one by email, and your account stays as it is in the meantime.'],
  ['How do withdrawals work?', 'You withdraw to the card or bank account you paid in from. Each request is checked by a person, and you can follow its status in the client area.'],
  ['What can I lose?', 'Trading on margin is high risk. Prices can move against you quickly and you can lose all the money in your account. Only trade with money you can afford to lose.'],
  ['When can I trade?', 'Forex and metals trade from Sunday 22:00 to Friday 22:00 UTC. Crypto trades every day. The dial on this page shows what is open right now.'],
]
function Faq() {
  return (
    <section className="sec faq" id="faq" aria-labelledby="fq-h">
      <h2 id="fq-h" className="rv">Questions before you start</h2>
      <div className="fq-list">
        {FAQ.map(([q, a], i) => (
          <details key={q} className="rv" open={i === 0}>
            <summary>{q}<ChevronDown size={22} aria-hidden="true" /></summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  const now = useNow(20000)
  return (
    <section className="sec contact" id="contact" aria-labelledby="ct-h">
      <h2 id="ct-h" className="sr-only">Contact</h2>
      <p className="ct-say rv">Questions about an account or a payment? Write to us, and a person answers.</p>
      <div className="ct-clock rv" data-ui role="img" aria-label={`Support desk, ${utc(now)} UTC`}><span>Support desk</span><b className="num">{utc(now)}</b><small>UTC, now</small></div>
      <div className="ct-links rv">
        <b>Prefer to talk it through?</b>
        <a href="mailto:support@globaltrade.example?subject=Question%20before%20opening%20an%20account">support@globaltrade.example</a>
        <Link to="/login">Live chat in the client area</Link>
        <small>{tbc('Registered address')} · {tbc('Support hours')}</small>
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
        <Markets />
        <Costs />
        <Platform />
        <Stages />
        <Plan />
        <About />
        <Faq />
        <Contact />
      </main>
      <footer className="foot">
        <div className="foot-top">
          <span className="wordmark">GlobalTrade</span>
          <span>Forex, gold and crypto broker</span>
          <span>{tbc('Registered company name and address')}</span>
          <a href="#/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="link">Back to top <ArrowUp size={16} /></a>
        </div>
        <a className="foot-mail" href="mailto:support@globaltrade.example"><span>support</span><span>@globaltrade.example</span></a>
        <div className="foot-meta">
          <span><Link to="/register">Open an account</Link><Link to="/login">Log in</Link></span>
          <span>Prices on this prototype are a simulated demo feed. Nothing here is investment advice.</span>
          <span>© 2026 GlobalTrade</span>
        </div>
      </footer>
    </div>
  )
}
