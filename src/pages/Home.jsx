import { useMemo, useRef, useState, useEffect } from 'react'
import { CgArrowRight, CgArrowTopRight, CgChevronDown, CgMathPlus, CgMathMinus } from 'react-icons/cg'
import { TYPES, UNITS, ZONES, FLOOR, SHARED, EVENTS, FAQ } from '../data.js'
import { useScroll, useReveal, reduced } from '../motion.js'
import { WLink } from '../App.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <Types />
      <Plan />
      <Shared />
      <Community />
      <Faq />
      <Cta />
    </>
  )
}

function Hero() {
  const ref = useScroll()
  return (
    <section className="hero" ref={ref} aria-labelledby="h-h">
      <div className="hero-text">
        <h1 id="h-h"><span>Warehouse space</span><span>for small brands</span><span className="hl">that ship.</span></h1>
        <p className="lede">Rent a shelf, a pallet, a private bay or a packing desk on one shared floor. The dock, the packing tables and the team that receives your stock come with it.</p>
        <div className="cta-row">
          <a className="btn" href="#plan" onClick={(e) => { e.preventDefault(); document.getElementById('plan')?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' }) }}>See what is free<CgArrowRight aria-hidden="true" /></a>
          <WLink to="/tour" colour="var(--tangerine)" className="btn ghost">Book a tour</WLink>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="ha-photo"><img src="img/hero.webp" alt="" width="1800" height="771" fetchpriority="high" /></div>
        <i className="sh s1" /><i className="sh s2" /><i className="sh s3" /><i className="sh s4" /><i className="sh s5" />
      </div>
      <ul className="hero-facts">
        <li><b>From $39</b><span>a pallet a month</span></li>
        <li><b>Month to month</b><span>on shelves, pallets and desks</span></li>
        <li><b>2 pickups a day</b><span>from the main couriers</span></li>
      </ul>
    </section>
  )
}

// Four ways to take space, as colour slabs that slide past while the section is pinned.
function Types() {
  const track = useRef(null)
  const ref = useScroll(({ pin }) => {
    const t = track.current
    if (!t || innerWidth < 800) return
    const max = Math.max(0, t.scrollWidth - t.parentElement.clientWidth)
    t.style.transform = `translate3d(${(-pin * max).toFixed(1)}px,0,0)`
  })
  useEffect(() => {
    const sec = ref.current, t = track.current
    if (!sec || !t) return
    const size = () => {
      if (innerWidth < 800 || reduced()) { sec.style.height = ''; t.style.transform = ''; return }
      sec.style.height = `${innerHeight + Math.max(0, t.scrollWidth - t.parentElement.clientWidth)}px`
    }
    size()
    const ro = new ResizeObserver(size); ro.observe(t)
    addEventListener('resize', size)
    return () => { ro.disconnect(); removeEventListener('resize', size) }
  }, [ref])
  return (
    <section className="types" ref={ref} aria-labelledby="t-h">
      <div className="types-stick">
        <div className="types-head wrap">
          <h2 id="t-h">Four ways to take space</h2>
          <p>Pick by how your stock moves. Change when it does.</p>
        </div>
        <div className="types-view">
          <ol className="types-row" ref={track}>
            {Object.values(TYPES).map((t, i) => (
              <li key={t.id} className={`slab slab-${t.id}`} style={{ '--c': t.colour, '--k': i }}>
                <span className="slab-no">{String(i + 1).padStart(2, '0')}</span>
                <div className="slab-pic"><img src={`${t.img}-s.webp`} alt="" loading="lazy" width="900" height="675" /></div>
                <div className="slab-body">
                  <h3>{t.name}</h3>
                  <p>{t.fits}</p>
                  <p className="slab-price"><b>${t.from}</b> {t.unit}</p>
                  <WLink to={`/spaces/${t.id}`} colour={t.colour} className="slab-link">What is included<CgArrowTopRight aria-hidden="true" /></WLink>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="wrap"><div className="types-bar" aria-hidden="true"><i /></div></div>
      </div>
    </section>
  )
}

// The live thing: the real floor, unit by unit. Free units can be picked; the card prices them.
function Plan() {
  const [type, setType] = useState('all')
  const [sel, setSel] = useState('B2')
  const [months, setMonths] = useState(3)
  const ref = useReveal([type])
  const u = UNITS.find((x) => x.id === sel)
  const T = u && TYPES[u.type]
  const price = u ? (u.type === 'bay' ? Math.round(T.from * (u.m2 / 20)) : T.from) : 0
  const free = useMemo(() => UNITS.filter((x) => x.free && (type === 'all' || x.type === type)).length, [type])
  const cell = (v) => `${(v / FLOOR.cols) * 100}%`
  const rowc = (v) => `${(v / FLOOR.rows) * 100}%`
  return (
    <section className="plan wrap" id="plan" aria-labelledby="p-h" ref={ref}>
      <div className="plan-head">
        <h2 id="p-h" data-r>The floor, as it is today</h2>
        <p data-r>{free} units free{type !== 'all' ? ` in ${TYPES[type].name.toLowerCase()}s` : ''}. Pick one to see what it costs and book a tour of it.</p>
        <div className="filters" role="group" aria-label="Show" data-r>
          <button aria-pressed={type === 'all'} onClick={() => setType('all')}>All</button>
          {Object.values(TYPES).map((t) => <button key={t.id} aria-pressed={type === t.id} onClick={() => setType(t.id)} style={{ '--c': t.colour }}><i />{t.name}</button>)}
        </div>
      </div>
      <div className="plan-grid">
        <div className="floor" role="group" aria-label="Floor plan" data-r>
          {ZONES.map((z) => <div key={z.name} className={`zone ${z.kind}`} style={{ left: cell(z.x), top: rowc(z.y), width: cell(z.w), height: rowc(z.h) }}><span>{z.name}</span></div>)}
          {UNITS.map((x, i) => {
            const dim = type !== 'all' && x.type !== type
            return (
              <button key={x.id} className={`unit u-${x.type} ${x.free ? 'free' : 'taken'} ${sel === x.id ? 'sel' : ''} ${dim ? 'dim' : ''}`} style={{ left: cell(x.x), top: rowc(x.y), width: cell(x.w), height: rowc(x.h), '--i': i % 12, '--c': TYPES[x.type].colour }}
                disabled={!x.free} onClick={() => setSel(x.id)} aria-label={`${x.id}, ${TYPES[x.type].name}, ${x.free ? 'free' : 'taken'}`} aria-pressed={sel === x.id}>
                <span>{x.id}</span>
              </button>
            )
          })}
        </div>
        {u && (
          <aside className="unit-card" style={{ '--c': T.colour, '--ink-c': T.ink }} key={u.id} aria-live="polite">
            <div className="uc-head"><span className="uc-id">{u.id}</span><span>{T.name}{u.m2 ? `, ${u.m2} m²` : ''}</span></div>
            <img src={`${T.img}-s.webp`} alt="" />
            <p>{T.size}</p>
            <div className="uc-months">
              <span>Months</span>
              <div className="stepper">
                <button onClick={() => setMonths((m) => Math.max(1, m - 1))} aria-label="One month less"><CgMathMinus /></button>
                <output>{months}</output>
                <button onClick={() => setMonths((m) => Math.min(24, m + 1))} aria-label="One month more"><CgMathPlus /></button>
              </div>
            </div>
            <dl>
              <div><dt>A month</dt><dd>${price}</dd></div>
              <div className="tot"><dt>{months} month{months > 1 ? 's' : ''}</dt><dd>${price * months}</dd></div>
            </dl>
            <WLink to={`/tour?unit=${u.id}`} colour={T.colour} className="btn wide">Tour {u.id}<CgArrowRight aria-hidden="true" /></WLink>
          </aside>
        )}
      </div>
      <p className="legend"><span><i className="lg-free" />Free</span><span><i className="lg-taken" />Taken</span><span>Sample floor plan and prices</span></p>
    </section>
  )
}

// Shared kit: the photo stack holds still while each line takes its turn.
function Shared() {
  const [i, setI] = useState(0)
  const list = useRef(null)
  const ref = useScroll(({ vh }) => {
    const items = list.current?.querySelectorAll('li') || []
    let best = 0, d = 1e9
    items.forEach((n, k) => { const r = n.getBoundingClientRect(); const c = Math.abs(r.top + r.height / 2 - vh / 2); if (c < d) { d = c; best = k } })
    setI(best)
  })
  return (
    <section className="shared" ref={ref} aria-labelledby="s-h">
      <div className="wrap shared-grid">
        <div className="shared-pics" aria-hidden="true">
          {SHARED.map((s, k) => <img key={s.t} src={`${s.img}-s.webp`} alt="" className={k === i ? 'on' : k < i ? 'gone' : ''} style={{ '--k': k }} loading="lazy" />)}
        </div>
        <div>
          <h2 id="s-h">Shared, so you do not have to buy it</h2>
          <ol className="shared-list" ref={list}>
            {SHARED.map((s, k) => <li key={s.t} className={k === i ? 'on' : ''}><span className="sl-no">{String(k + 1).padStart(2, '0')}</span><b>{s.t}</b><p>{s.d}</p></li>)}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Community() {
  const ref = useScroll()
  const r2 = useReveal()
  return (
    <section className="comm" ref={ref} aria-labelledby="c-h">
      <div className="wrap comm-grid" ref={r2}>
        <figure className="comm-pic a" data-r><img src="img/founder-s.webp" alt="A founder holding a parcel" loading="lazy" /></figure>
        <figure className="comm-pic b" data-r><img src="img/workshop-s.webp" alt="An evening workshop on the floor" loading="lazy" /></figure>
        <div className="comm-text">
          <h2 id="c-h" data-r>The people on the next shelf run brands too</h2>
          <p data-r>Members swap couriers, suppliers and the odd pallet of tape. Once a month the lounge turns into a workshop.</p>
          <ul className="events">{EVENTS.map((e, k) => <li key={e.t} data-r style={{ '--i': k }}><span className="ev-d">{e.d}</span><b>{e.t}</b><span>{e.who}</span></li>)}</ul>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="faq wrap" aria-labelledby="f-h">
      <h2 id="f-h">Before you move in</h2>
      <div className="qs">{FAQ.map(([q, a], i) => <details key={q} open={i === 0}><summary>{q}<CgChevronDown aria-hidden="true" /></summary><p>{a}</p></details>)}</div>
    </section>
  )
}

function Cta() {
  const ref = useScroll()
  return (
    <section className="cta" ref={ref}>
      <i className="cta-sh a" aria-hidden="true" /><i className="cta-sh b" aria-hidden="true" /><i className="cta-sh c" aria-hidden="true" />
      <div className="wrap">
        <h2>Walk the floor before you sign</h2>
        <p>Thirty minutes, the free units on the plan, and the team that would run your stock.</p>
        <WLink to="/tour" colour="var(--tangerine)" className="btn invert">Book a tour<CgArrowRight aria-hidden="true" /></WLink>
      </div>
    </section>
  )
}
