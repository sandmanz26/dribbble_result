import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Add, ArrowRight, ArrowUpRight, ChartLine, CheckmarkFilled, Chat, Dashboard, Document, Education, Money, Security, Wallet } from '@carbon/icons-react'
import { usePrices } from '../store.jsx'
import Dial from '../ui/Dial.jsx'
import { Mark } from '../ui/Shell.jsx'
import { useNow } from '../ui/Sessions.jsx'
import { INSTRUMENTS, byId, fmt, spreadLabel, usd } from '../data/market.js'
import { CLIENT, FUNDS, OPEN, balances, pnl } from '../data/account.js'
import { sessionNow } from '../data/sessions.js'
import { PriceArea } from '@/components/dash'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import '../landing.css'

// GlobalTrade's landing page, after the owner's reference (a dark fintech page in the manner of
// Starlight): a centred headline under a warm light, floating currency tiles, the real client area
// leaning back beneath it and straightening as you scroll, then large feature panels, payment
// cards, a bento of smaller promises, questions, a closing card and a full footer. The live gold
// price still sits inside the headline where the word "gold" would be. All prices are a demo feed.

const pct = (n) => `${n >= 0 ? '+' : '−'}${Math.abs(n * 100).toFixed(2)}%`
const tbc = (t) => <mark className="rounded bg-transparent px-0 text-muted-foreground underline decoration-dotted underline-offset-4" title="To be confirmed by GlobalTrade before launch">[{t}]</mark>
const jump = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

// Parts of each section rise and sharpen once as they enter. Content stays visible without script.
function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    document.documentElement.classList.add('rv-on')
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -10% 0px' })
    document.querySelectorAll('.lp-rv').forEach((el) => io.observe(el))
    return () => { io.disconnect(); document.documentElement.classList.remove('rv-on') }
  }, [])
}
// A light that follows the cursor inside any element marked .spot or .metal.
const follow = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

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
  return <span className={cn('live-px tabular-nums transition-colors duration-700', dir, className)}>{fmt(id, p)}</span>
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.06] bg-[#060709]/60 backdrop-blur-xl">
      <p className="border-b border-white/[0.04] bg-[#0d0e11]/80 px-5 py-1.5 text-center text-[12px] text-muted-foreground">Trading on margin is high risk. You can lose all the money you deposit. {tbc('Regulator-required risk figure')}</p>
      <nav className="mx-auto flex h-16 max-w-[1240px] items-center gap-8 px-5 md:px-8" aria-label="Main">
        <Link to="/" className="flex items-center gap-2.5"><Mark size={26} /><span className="font-display text-[17px] tracking-tight">GlobalTrade</span></Link>
        <span className="hidden flex-1 items-center justify-center gap-7 text-[13.5px] text-muted-foreground lg:flex">
          {[['markets', 'Markets'], ['platform', 'Platform'], ['costs', 'Costs'], ['payments', 'Payments'], ['faq', 'Questions']].map(([id, l]) => <a key={id} href="#/" onClick={jump(id)} className="transition-colors hover:text-foreground">{l}</a>)}
        </span>
        <span className="ml-auto flex items-center gap-3 lg:ml-0">
          <Link to="/login" className="hidden text-[13.5px] text-muted-foreground transition-colors hover:text-foreground sm:inline">Log in</Link>
          <Button size="sm" asChild><Link to="/register">Open an account</Link></Button>
        </span>
      </nav>
    </header>
  )
}

// The word in the headline: gold, shown instead of said.
function GoldChip() {
  const { series, change } = usePrices()
  const ch = change('XAUUSD')
  return (
    <span className="edge relative mx-[0.06em] inline-flex h-[0.78em] w-[2.6em] translate-y-[0.06em] items-stretch overflow-hidden rounded-[0.16em] bg-white/[0.04] align-baseline shadow-[0_0_60px_-10px_rgb(212_174_98/0.5)] backdrop-blur" data-ui aria-hidden="true">
      <span className="relative min-w-0 flex-1 py-[0.06em] pl-[0.08em]"><PriceArea id="XAUUSD" data={series.XAUUSD.slice(-72)} height="100%" bare /></span>
      <span className="grid content-center gap-0.5 pr-[0.14em] pl-[0.06em] text-left text-[13px] leading-tight tracking-normal">
        <b className="font-normal text-muted-foreground max-sm:hidden">Gold</b><Px id="XAUUSD" className="text-[clamp(15px,1.5vw,22px)] font-medium text-primary" /><small className={cn('max-sm:hidden', ch >= 0 ? 'text-positive' : 'text-destructive')}>{pct(ch)}</small>
      </span>
    </span>
  )
}

// The client area itself, leaning back under the headline and straightening as it scrolls in.
function HeroPreview() {
  const ref = useRef(null)
  const { series, price, change } = usePrices()
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight * 0.95)))
        el.style.setProperty('--tilt', `${(1 - p) * 26}deg`)
        el.style.setProperty('--scale', `${0.92 + p * 0.08}`)
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf) }
  }, [])
  const b = balances(FUNDS)
  const floating = OPEN.reduce((a, p) => { const ins = byId[p.ins]; const h = (ins.spread * ins.pip) / 2; const q = p.side === 'Buy' ? price(p.ins) - h : price(p.ins) + h; return a + pnl(p.ins, p.side, p.lots, p.open, q) }, 0)
  const ch = change('XAUUSD')
  return (
    <div className="tilt-stage relative mx-auto mt-14 max-w-[1120px] px-4 md:mt-16">
      <div className="tilt-glow" aria-hidden="true" />
      <div ref={ref} className="tilt-card edge relative overflow-hidden rounded-2xl bg-[#0b0c0f]/90 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] lp-in d5" data-ui role="img" aria-label="The GlobalTrade client area: equity, balance, a live gold chart and the market list">
        <div className="flex h-10 items-center gap-2 border-b border-white/[0.06] px-4"><span className="size-2.5 rounded-full bg-white/10" /><span className="size-2.5 rounded-full bg-white/10" /><span className="size-2.5 rounded-full bg-white/10" /><span className="mx-auto rounded-md bg-white/[0.04] px-3 py-0.5 text-[11px] text-muted-foreground">globaltrade · client area</span></div>
        <div className="grid grid-cols-[52px_minmax(0,1fr)] md:grid-cols-[200px_minmax(0,1fr)]">
          <aside className="hidden border-r border-white/[0.06] p-3 md:block">
            <p className="flex items-center gap-2 px-2 pb-4 text-[13px]"><Mark size={20} />GlobalTrade</p>
            {[[Dashboard, 'Overview', 1], [ChartLine, 'Trade history'], [Money, 'Deposits'], [Wallet, 'Withdrawals']].map(([I, l, on]) => <p key={l} className={cn('flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[12px] text-muted-foreground', on && 'bg-white/[0.06] text-foreground')}><I size={14} />{l}</p>)}
          </aside>
          <aside className="grid content-start justify-center gap-3 border-r border-white/[0.06] py-4 md:hidden">{[Dashboard, ChartLine, Money].map((I, k) => <I key={k} size={16} className={k ? 'text-muted-foreground' : 'text-primary'} />)}</aside>
          <div className="grid gap-3 p-3 md:p-5">
            <div className="flex items-end justify-between"><div><p className="text-[11px] text-muted-foreground">Overview</p><p className="font-display text-[18px] font-light md:text-[22px]">{CLIENT.name}’s account</p></div><span className="hidden rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground sm:inline">Add money</span></div>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {[['Equity', usd(b.balance + floating)], ['Balance', usd(b.balance)], ['Open trades', `${floating >= 0 ? '+' : '−'}${usd(Math.abs(floating)).slice(1)}`]].map(([l, v], k) => (
                <div key={l} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 md:p-3"><p className="text-[10px] text-muted-foreground md:text-[11px]">{l}</p><p className={cn('mt-1 text-[13px] tabular-nums md:text-[19px] md:font-light', k === 2 && (floating >= 0 ? 'text-positive' : 'text-destructive'))}>{v}</p></div>
              ))}
            </div>
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="flex items-baseline justify-between text-[11px] text-muted-foreground"><span>XAU/USD · last 8 hours</span><span className={ch >= 0 ? 'text-positive' : 'text-destructive'}>{pct(ch)}</span></p>
                <p className="mt-1 text-[20px] font-light tabular-nums"><Px id="XAUUSD" /></p>
                <PriceArea id="XAUUSD" data={series.XAUUSD.slice(-96)} height={170} />
              </div>
              <ul className="hidden rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 lg:grid">
                {INSTRUMENTS.slice(0, 6).map((i) => { const c = change(i.id); return <li key={i.id} className="flex items-center justify-between rounded px-2 py-1.5 text-[11.5px]"><span>{i.name}</span><span className="text-right tabular-nums"><Px id={i.id} /><span className={cn('block text-[10px]', c >= 0 ? 'text-positive' : 'text-destructive')}>{pct(c)}</span></span></li> })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const [m, setM] = useState({ x: 0, y: 0 })
  const move = (e) => setM({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 })
  const tiles = [
    ['Au', 'left-[7%] top-[190px]', 'bg-gradient-to-br from-[#f3d48b] to-[#a8792c]', 'rgb(212 174 98 / 0.6)', '-8deg', 1.2],
    ['€', 'left-[15%] top-[400px]', 'bg-gradient-to-br from-[#5b8cff] to-[#2445b5]', 'rgb(91 140 255 / 0.5)', '6deg', 0.8],
    ['₿', 'right-[8%] top-[210px]', 'bg-gradient-to-br from-[#ffb04a] to-[#d06a10]', 'rgb(255 160 60 / 0.5)', '8deg', 1],
    ['Ξ', 'right-[15%] top-[420px]', 'bg-gradient-to-br from-[#a3a9c7] to-[#4a5070]', 'rgb(163 169 199 / 0.4)', '-6deg', 0.7],
  ]
  return (
    <section className="relative px-5 pb-10 pt-36 md:pt-40" onMouseMove={move} aria-labelledby="hero-h">
      <div className="lp-hero-light" aria-hidden="true" />
      <div className="lp-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        {tiles.map(([g, pos, bg, glow, r, depth], k) => (
          <span key={g} className={cn('tile3d lp-in', `d${k + 2}`, pos, bg)} style={{ '--tile-glow': glow, '--r': r, animationDelay: `${k * 0.6}s`, translate: `${m.x * 40 * depth}px ${m.y * 30 * depth}px` }}>{g}</span>
        ))}
      </div>
      <div className="relative mx-auto max-w-[980px] text-center">
        <a href="#/" onClick={jump('markets')} className="lp-in d1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 text-[12.5px] text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground">
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">Live</span>Forex, gold and crypto in one account<ArrowRight size={14} />
        </a>
        <h1 id="hero-h" className="lp-in d2 mt-6 font-display text-[clamp(46px,6.6vw,100px)] font-light leading-[1.02] tracking-[-0.045em]">
          <span className="sr-only">Trade gold on world time</span>
          <span aria-hidden="true">Trade <GoldChip /><br />on world time</span>
        </h1>
        <p className="lp-in d3 mx-auto mt-7 max-w-[560px] text-[17px] leading-relaxed text-muted-foreground md:text-[19px]">GlobalTrade is a broker for currencies, gold and crypto. Live prices around the clock, every cost in writing, and accounts from $100.</p>
        <div className="lp-in d4 mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild><Link to="/register">Open an account<ArrowRight size={16} /></Link></Button>
          <Button size="lg" variant="secondary" asChild><Link to="/register">Practise with $10,000</Link></Button>
        </div>
      </div>
      <HeroPreview />
    </section>
  )
}

function Ticker() {
  const { change } = usePrices()
  const row = INSTRUMENTS.map((i) => { const c = change(i.id); return (
    <span key={i.id} className="flex items-center gap-3 px-8 text-[14px]"><span className="text-muted-foreground">{i.name}</span><Px id={i.id} /><span className={cn('text-[12.5px]', c >= 0 ? 'text-positive' : 'text-destructive')}>{pct(c)}</span></span>
  ) })
  return (
    <section className="mx-auto max-w-[1240px] px-5 pt-16 md:px-8" aria-label="Demo prices">
      <p className="text-center text-[13px] text-muted-foreground">Eight markets that move the world, priced live</p>
      <div className="marquee mt-6 overflow-hidden"><div className="marquee-track">{row}{row}</div></div>
    </section>
  )
}

// A large feature panel: statement on the left, its proof as an object on the right.
function Panel({ id, title, text, points, children, reverse }) {
  return (
    <div id={id} className="spot edge lp-rv grid scroll-mt-24 items-center gap-10 overflow-hidden rounded-3xl bg-gradient-to-b from-white/[0.035] to-white/[0.01] p-8 md:grid-cols-2 md:p-14" onMouseMove={follow}>
      <div className={cn('grid gap-5', reverse && 'md:order-2')}>
        <h2 className="font-display text-[clamp(32px,3.4vw,48px)] font-light leading-[1.06] tracking-[-0.035em]">{title}</h2>
        <p className="max-w-[44ch] text-[16px] leading-relaxed text-muted-foreground">{text}</p>
        <ul className="grid gap-2.5 text-[14px]">{points.map((p) => <li key={p} className="flex items-start gap-2.5"><CheckmarkFilled size={16} className="mt-0.5 shrink-0 text-primary" />{p}</li>)}</ul>
      </div>
      <div className="relative min-h-[320px]">{children}</div>
    </div>
  )
}

function MarketCards() {
  const { change } = usePrices()
  const cards = ['BTCUSD', 'EURUSD', 'XAUUSD']
  return (
    <div className="fan absolute inset-0 grid origin-center scale-[0.78] place-items-center sm:scale-100" aria-hidden="true">
      {cards.map((id) => { const c = change(id); const i = byId[id]; return (
        <div key={id} className="edge col-start-1 row-start-1 w-[270px] rounded-2xl bg-[#101216]/95 p-5 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur" data-ui>
          <div className="flex items-center justify-between text-[12px] text-muted-foreground"><span>{i.kind}</span><Badge tone={c >= 0 ? 'ok' : 'bad'}>{pct(c)}</Badge></div>
          <p className="mt-6 text-[13px]">{i.name}</p>
          <p className="mt-1 font-display text-[30px] font-light tracking-[-0.03em]"><Px id={id} /></p>
          <p className="mt-4 text-[11.5px] text-muted-foreground">{i.long} · spread {spreadLabel(i)}</p>
        </div>
      ) })}
    </div>
  )
}

const LEV = { XAUUSD: 20, EURUSD: 30, GBPUSD: 30, USDJPY: 30, AUDUSD: 20, XAGUSD: 10, BTCUSD: 2, ETHUSD: 2 }
function CostLine() {
  const { price } = usePrices()
  const [id, setId] = useState('XAUUSD')
  const [amount, setAmount] = useState(2500)
  const ins = byId[id]
  const p = price(id)
  const perLot = id === 'USDJPY' ? ins.lot : ins.lot * p
  const pipLot = id === 'USDJPY' ? (ins.pip * ins.lot) / p : ins.pip * ins.lot
  const lev = LEV[id]
  const lots = Math.floor(((amount * lev) / perLot) * 100) / 100
  const spread = lots * ins.spread * pipLot
  const move = lots * perLot * 0.01
  return (
    <div className="edge absolute inset-0 grid content-center gap-5 rounded-2xl bg-[#0d0f12]/90 p-6" data-ui>
      <div className="flex flex-wrap gap-1.5">{['XAUUSD', 'EURUSD', 'GBPUSD', 'BTCUSD', 'ETHUSD'].map((x) => <button key={x} onClick={() => setId(x)} aria-pressed={id === x} className={cn('rounded-full px-3 py-1 text-[12px] ring-1 ring-inset transition-colors', id === x ? 'bg-primary/15 text-primary ring-primary/40' : 'text-muted-foreground ring-white/10 hover:text-foreground')}>{byId[x].name}</button>)}</div>
      <label className="grid gap-2 text-[12px] text-muted-foreground">Amount you put in
        <span className="flex items-center gap-4"><input type="range" min="100" max="20000" step="100" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-[#d4ae62]" aria-label="Amount in US dollars" /><b className="w-24 text-right font-display text-[24px] font-light tabular-nums text-foreground">{usd(amount, 0)}</b></span>
      </label>
      {lots < 0.01 ? <p className="text-[13px] text-muted-foreground">The smallest trade on {ins.name} is 0.01 lot, which needs {usd((0.01 * perLot) / lev)} at 1:{lev}.</p> : (
        <dl className="grid grid-cols-3 gap-3">
          {[['Largest position', `${lots.toFixed(2)} lot`, `at 1:${lev}`], ['Cost to open', usd(spread), 'the spread'], ['1% against you', `−${usd(move, 0)}`, `${Math.round((move / amount) * 100)}% of it`]].map(([t, v, s], k) => (
            <div key={t} className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-inset ring-white/5"><dt className="text-[11px] text-muted-foreground">{t}</dt><dd className={cn('mt-1 text-[17px] tabular-nums', k === 2 && 'text-destructive')}>{v}</dd><dd className="text-[11px] text-muted-foreground">{s}</dd></div>
          ))}
        </dl>
      )}
      <p className="text-[11.5px] text-muted-foreground">EU and UK retail leverage limits, {tbc('to confirm for GlobalTrade’s licence')}.</p>
    </div>
  )
}

function Payments() {
  const cards = [
    [Wallet, 'Card', 'Add money from a debit or credit card. It arrives straight away.', <div key="c" className="metal relative h-16 w-24 rounded-lg"><span className="absolute left-2 top-2 h-3 w-4 rounded-sm bg-gradient-to-br from-[#f3d48b] to-[#a8792c]" /><span className="absolute bottom-2 right-2 text-[9px] text-white/60">4417</span></div>],
    [Money, 'Bank transfer', 'Send from your own bank account. Usually the same or the next working day.', <div key="b" className="grid h-16 w-24 place-items-center rounded-lg bg-white/[0.04] ring-1 ring-inset ring-white/10 text-[11px] text-muted-foreground">IBAN ···0932</div>],
    [ArrowUpRight, 'Withdrawals', 'Back to the account you paid in from, after a person on our team has checked it.', <div key="w" className="flex h-16 w-24 items-center justify-center gap-1">{[1, 1, 0].map((on, k) => <span key={k} className={cn('size-2.5 rounded-full', on ? 'bg-primary shadow-[0_0_10px_rgb(212_174_98/0.7)]' : 'bg-white/15')} />)}</div>],
    [Security, 'Your money, kept apart', <>Client money is held {tbc('in segregated accounts at named banks')}.</>, <div key="s" className="grid h-16 w-24 place-items-center"><Security size={28} className="text-primary" /></div>],
  ]
  return (
    <section id="payments" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 md:px-8" aria-labelledby="pay-h">
      <div className="lp-rv max-w-[640px]">
        <h2 id="pay-h" className="font-display text-[clamp(32px,3.6vw,52px)] font-light leading-[1.05] tracking-[-0.035em]">Money in and out, the way you already pay</h2>
        <p className="mt-4 text-[16px] text-muted-foreground">No GlobalTrade fee on deposits. Every payment comes back to you in writing.</p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([I, t, d, art], k) => (
          <div key={t} className="spot edge lp-rv grid content-start gap-5 rounded-2xl bg-white/[0.025] p-6 transition-transform duration-300 hover:-translate-y-1" style={{ '--d': `${k * 80}ms` }} onMouseMove={follow}>
            <div className="grid h-28 place-items-center rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent">{art}</div>
            <div><p className="flex items-center gap-2 text-[15px]"><I size={16} className="text-primary" />{t}</p><p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{d}</p></div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Bento() {
  const now = useNow(20000)
  const info = sessionNow(now)
  const g = OPEN[0]
  const w = FUNDS.find((x) => x.id === 'W-0788')
  const tile = 'spot edge lp-rv overflow-hidden rounded-2xl bg-white/[0.025] p-6 transition-transform duration-300 hover:-translate-y-1'
  return (
    <section className="mx-auto max-w-[1240px] px-5 md:px-8" aria-labelledby="more-h">
      <div className="lp-rv max-w-[640px]">
        <h2 id="more-h" className="font-display text-[clamp(32px,3.6vw,52px)] font-light leading-[1.05] tracking-[-0.035em]">A few more things you will like</h2>
        <p className="mt-4 text-[16px] text-muted-foreground">Built for people who trade alongside their working lives.</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-6">
        <div className={cn(tile, 'md:col-span-2 md:row-span-2 grid content-between gap-6')} onMouseMove={follow}>
          <div className="mx-auto w-full max-w-[280px]"><Dial /></div>
          <div><p className="text-[15px]">Four centres, one clock</p><p className="mt-1.5 text-[13.5px] text-muted-foreground">{info.line}</p></div>
        </div>
        <div className={cn(tile, 'md:col-span-2')} onMouseMove={follow}>
          <div className="rounded-xl bg-[#f2ede3] p-4 text-[#17150f]" data-ui>
            <p className="flex justify-between text-[11px] text-[#5b5547]"><span>Trade confirmation</span><span>{g.id}</span></p>
            <p className="mt-2 text-[15px]">Bought {g.lots.toFixed(2)} lot of gold at {fmt('XAUUSD', g.open)}</p>
            <p className="mt-1 text-[11.5px] text-[#5b5547]">Spread paid {usd(byId.XAUUSD.spread * byId.XAUUSD.pip * g.lots * 100)} · commission $0.00</p>
          </div>
          <p className="mt-4 text-[15px]">Every trade in writing</p><p className="mt-1 text-[13.5px] text-muted-foreground">Price, size and cost, for every trade and payment.</p>
        </div>
        <div className={cn(tile, 'md:col-span-2')} onMouseMove={follow}>
          <ol className="grid gap-2 text-[12.5px]" data-ui>{[['Requested', '27 Oct, 09:14', 1], ['Checked by a person', 'In review now', 2], ['Sent to your bank', 'Next working day', 0]].map(([t, s, st]) => <li key={t} className="flex items-center gap-2.5"><span className={cn('size-2 rounded-full', st === 1 ? 'bg-positive' : st === 2 ? 'live-dot bg-primary' : 'bg-white/15')} /><span className="flex-1">{t}</span><span className="text-muted-foreground">{s}</span></li>)}</ol>
          <p className="mt-4 text-[15px]">Withdrawal {w.id}, {usd(w.amount, 0)}</p><p className="mt-1 text-[13.5px] text-muted-foreground">Follow each step in the client area.</p>
        </div>
        <div className={cn(tile, 'md:col-span-2')} onMouseMove={follow}>
          <p className="font-display text-[44px] font-light tracking-[-0.04em] text-primary">$10,000</p>
          <p className="mt-2 text-[15px]">A practice account</p><p className="mt-1 text-[13.5px] text-muted-foreground">Play money, live demo prices, no time limit.</p>
        </div>
        <div className={cn(tile, 'md:col-span-2')} onMouseMove={follow}>
          <div className="flex items-center gap-2" aria-hidden="true">{['Passport', 'Utility bill'].map((d) => <span key={d} className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[12px] ring-1 ring-inset ring-white/10"><Document size={14} />{d}<CheckmarkFilled size={14} className="text-positive" /></span>)}</div>
          <p className="mt-4 text-[15px]">Checked by a person</p><p className="mt-1 text-[13.5px] text-muted-foreground">Most identity checks are done within one working day.</p>
        </div>
        <div className={cn(tile, 'md:col-span-3')} onMouseMove={follow}>
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/30"><Chat size={18} /></span><div className="rounded-xl rounded-tl-sm bg-white/[0.04] px-3 py-2 text-[13px]">When will my withdrawal arrive?</div></div>
          <p className="mt-4 text-[15px]">Support from people, not a script</p><p className="mt-1 text-[13.5px] text-muted-foreground">Live chat in the client area, and email for everything else.</p>
        </div>
        <div className={cn(tile, 'md:col-span-3')} onMouseMove={follow}>
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/30"><Education size={18} /></span><div className="text-[13px] text-muted-foreground">An experience check before your first trade</div></div>
          <p className="mt-4 text-[15px]">Risk explained before, not after</p><p className="mt-1 text-[13.5px] text-muted-foreground">Trading on margin is high risk. You can lose all the money you deposit.</p>
        </div>
      </div>
    </section>
  )
}

const FAQ = [
  ['Is GlobalTrade regulated?', <>Our licence is {tbc('regulator, licence number and a link to the public register')}. Check it on the regulator’s own site before you deposit.</>],
  ['Where is my money kept?', <>Client money is held {tbc('in segregated accounts at named banks')}, apart from the company’s own money.</>],
  ['How long does verification take?', 'Most checks are done within one working day. If a document is unclear we ask for another one, and your account stays as it is in the meantime.'],
  ['How do withdrawals work?', 'You withdraw to the card or bank account you paid in from. Each request is checked by a person, and you can follow its status in the client area.'],
  ['What can I lose?', 'Trading on margin is high risk. Prices can move against you quickly and you can lose all the money in your account. Only trade with money you can afford to lose.'],
  ['When can I trade?', 'Forex and metals trade from Sunday 22:00 to Friday 22:00 UTC. Crypto trades every day.'],
]
function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="mx-auto grid max-w-[1240px] scroll-mt-24 gap-10 px-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:px-8" aria-labelledby="faq-h">
      <div className="lp-rv">
        <h2 id="faq-h" className="font-display text-[clamp(32px,3.4vw,48px)] font-light leading-[1.05] tracking-[-0.035em]">Questions before you start</h2>
        <p className="mt-4 max-w-[36ch] text-[15px] text-muted-foreground">Something not answered here? Write to <a href="mailto:support@globaltrade.example" className="text-primary hover:underline">support@globaltrade.example</a> and a person replies.</p>
      </div>
      <div className="grid gap-2">
        {FAQ.map(([q, a], i) => (
          <div key={q} className="edge lp-rv overflow-hidden rounded-xl bg-white/[0.025]" style={{ '--d': `${i * 50}ms` }}>
            <h3 className="font-normal"><button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] transition-colors hover:text-primary">{q}<Add size={18} className={cn('shrink-0 transition-transform duration-300', open === i && 'rotate-45 text-primary')} /></button></h3>
            <div className={cn('grid transition-[grid-template-rows] duration-300', open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}><div className="overflow-hidden"><p className="px-5 pb-5 text-[14px] leading-relaxed text-muted-foreground">{a}</p></div></div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 md:px-8" aria-labelledby="cta-h">
      <div className="edge lp-rv relative grid items-center gap-10 overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-8 md:grid-cols-2 md:p-16">
        <div className="lp-hero-light !top-[-500px] opacity-60" aria-hidden="true" />
        <div className="relative">
          <h2 id="cta-h" className="font-display text-[clamp(36px,4.2vw,60px)] font-light leading-[1.02] tracking-[-0.04em]">Open an account in minutes</h2>
          <p className="mt-5 max-w-[40ch] text-[16px] text-muted-foreground">One live account for everyone, from $100. The same prices and support at $100 or $100,000.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button size="lg" asChild><Link to="/register">Open an account<ArrowRight size={16} /></Link></Button><Button size="lg" variant="ghost" asChild><Link to="/login">Log in</Link></Button></div>
        </div>
        <div className="relative grid min-h-[260px] place-items-center [perspective:1200px]">
          <div className="metal relative aspect-[1.586] w-full max-w-[400px] rounded-2xl transition-transform duration-500 [transform:rotateY(-16deg)_rotateX(10deg)] hover:[transform:rotateY(-4deg)_rotateX(4deg)]" onMouseMove={follow} aria-hidden="true">
            <span className="metal-sheen" />
            <span className="absolute left-6 top-6 flex items-center gap-2 text-[14px] text-white/85"><Mark size={22} />GlobalTrade</span>
            <span className="absolute left-6 top-[42%] h-8 w-11 rounded-md bg-gradient-to-br from-[#f3d48b] via-[#c9a55e] to-[#8a6420]" />
            <span className="absolute bottom-6 left-6 text-[13px] tracking-[0.2em] text-white/60">GT 104882</span>
            <span className="absolute bottom-6 right-6 text-[12px] text-primary">Live account</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const cols = [
    ['Trade', [['Markets', 'markets'], ['Costs', 'costs'], ['Payments', 'payments'], ['Questions', 'faq']]],
    ['Account', [['Open an account', '/register'], ['Log in', '/login'], ['Practice account', '/register']]],
    ['Company', [[tbc('About'), null], [tbc('Legal documents'), null], [tbc('Complaints'), null]]],
  ]
  return (
    <footer className="mt-32 border-t border-white/[0.06]">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] md:px-8">
        <div className="grid content-start gap-4">
          <p className="flex items-center gap-2.5"><Mark size={24} /><span className="font-display text-[17px]">GlobalTrade</span></p>
          <p className="max-w-[40ch] text-[13px] leading-relaxed text-muted-foreground">{tbc('Registered company name')}, {tbc('registered address')}. Authorised by {tbc('regulator and licence number')}.</p>
          <p className="max-w-[44ch] text-[12.5px] leading-relaxed text-muted-foreground">Trading on margin is high risk. You can lose all the money you deposit. {tbc('Regulator-required risk figure')}.</p>
        </div>
        {cols.map(([h, links]) => (
          <div key={h} className="grid content-start gap-3 text-[13.5px]">
            <p>{h}</p>
            {links.map(([l, to], k) => to?.startsWith('/') ? <Link key={k} to={to} className="text-muted-foreground transition-colors hover:text-foreground">{l}</Link> : to ? <a key={k} href="#/" onClick={jump(to)} className="text-muted-foreground transition-colors hover:text-foreground">{l}</a> : <span key={k} className="text-muted-foreground">{l}</span>)}
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] px-5 py-6 text-[12.5px] text-muted-foreground md:px-8">
        <span className="flex items-center gap-2"><span className="live-dot size-1.5 rounded-full bg-positive" />Demo price feed live</span>
        <span>Prices on this prototype are simulated. Nothing here is investment advice.</span>
        <span>© 2026 GlobalTrade</span>
      </div>
    </footer>
  )
}

export default function Home() {
  useReveal()
  return (
    <div className="dash lp min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <div className="mx-auto mt-32 grid max-w-[1240px] gap-6 px-5 md:px-8" id="markets">
          <Panel id="platform" title="Every market in one account" text="Gold, silver, four currency pairs, bitcoin and ether, on the same screen you trade from. One balance, one login, one set of statements." points={['Live demo prices updating every 1.5 seconds', 'Typical spreads shown before you trade', 'Forex and metals Sunday to Friday, crypto every day']}>
            <MarketCards />
          </Panel>
          <Panel id="costs" reverse title="Know the cost before you trade" text="Pick a market and an amount. See the largest position you could open, what the spread costs, and what a 1% move against you would do." points={['No commission on any market', 'No GlobalTrade fee on deposits', 'The cost is on every trade confirmation']}>
            <CostLine />
          </Panel>
        </div>
        <div className="mt-32 grid gap-32">
          <Payments />
          <Bento />
          <Faq />
          <Closing />
        </div>
      </main>
      <Footer />
    </div>
  )
}
