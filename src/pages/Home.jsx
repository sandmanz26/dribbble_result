import { useEffect, useMemo, useRef, useState } from 'react'
import { AiOutlineArrowRight, AiOutlinePlus, AiOutlineCheck, AiOutlineDown } from 'react-icons/ai'
import { COFFEES, METHODS, STAGES, FAQ, GRINDS, nextRoast, fmtDay, usd } from '../data.js'
import { useCart } from '../store.jsx'
import { useScrollFx, useReveal, pinned, through, reduced } from '../motion.js'
import { Go } from '../App.jsx'
import Bag3D from '../Bag3D.jsx'
import Card from '../Card.jsx'

export default function Home() {
  const ref = useReveal()
  return (
    <div ref={ref}>
      <Hero />
      <Notes />
      <Journey />
      <Shelf />
      <Brew />
      <Subscribe />
      <Origins />
      <Faq />
      <Closing />
    </div>
  )
}

export function useCountdown() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t) }, [])
  const r = nextRoast(now)
  const h = Math.floor(r.ms / 36e5)
  const left = h >= 24 ? `${Math.floor(h / 24)} days ${h % 24} hours` : `${h} hours ${Math.floor((r.ms % 36e5) / 6e4)} minutes`
  return { ...r, left }
}

function Hero() {
  const cart = useCart()
  const [sel, setSel] = useState('guji')
  const c = COFFEES.find((x) => x.id === sel)
  const [yaw, setYaw] = useState(-18)
  const art = useRef(null)
  const rd = useCountdown()
  useScrollFx(() => {
    if (reduced()) return
    setYaw(-18 + Math.min(scrollY, 900) * 0.32)
    art.current?.style.setProperty('--s', Math.min(1, scrollY / 700).toFixed(3))
  })
  const move = (e) => {
    if (reduced() || !art.current) return
    const r = art.current.getBoundingClientRect()
    art.current.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    art.current.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  return (
    <section className="hero" aria-labelledby="h-h" style={{ '--c': c.colour, '--ink-c': c.ink }} onPointerMove={move}>
      <div className="hero-text">
        <h1 id="h-h"><span>Coffee is a fruit.</span><span className="hl">Taste it.</span></h1>
        <p className="lede">Small-lot coffee roasted every Tuesday and posted the next morning. Pick a bag by the fruit you want in your cup.</p>
        <div className="picker" role="radiogroup" aria-label="Pick a coffee">
          {COFFEES.map((x) => (
            <button key={x.id} role="radio" aria-checked={sel === x.id} onClick={() => setSel(x.id)} style={{ '--c': x.colour }} aria-label={`${x.name}, ${x.notes.join(', ')}`}>
              <i />
            </button>
          ))}
        </div>
        <div className="hero-pick" key={c.id}>
          <p><b>{c.name}</b>, {c.origin}</p>
          <p className="hero-notes">{c.notes.join(' · ')}</p>
        </div>
        <div className="cta-row">
          <button className="btn" onClick={() => cart.add({ id: c.id, size: 250, grind: 'whole' })}><AiOutlinePlus aria-hidden="true" />Add 250 g, {usd(c.price[250])}</button>
          <Go to={`/coffee/${c.id}`} vt="bag" className="btn ghost">See this coffee</Go>
        </div>
        <p className="roast-line"><span className="dot" aria-hidden="true" />Next roast {fmtDay(rd.roast)}. Order in the next {rd.left}.</p>
      </div>
      <div className="hero-art" ref={art}>
        <span className="hero-disc" aria-hidden="true" />
        <img className="fl f1" src="img/cherry.webp" alt="" aria-hidden="true" />
        <img className="fl f2" src="img/bean.webp" alt="" aria-hidden="true" />
        <img className="fl f3" src="img/bean.webp" alt="" aria-hidden="true" />
        <img className="fl f4" src="img/cherry.webp" alt="" aria-hidden="true" />
        <Bag3D coffee={c} yaw={yaw} interactive hint className="hero-bag" />
      </div>
    </section>
  )
}

function Notes() {
  const row = useMemo(() => COFFEES.flatMap((c) => c.notes.map((n) => ({ n, c: c.colour }))), [])
  const ref = useRef(null)
  useScrollFx(() => { if (ref.current && !reduced()) ref.current.style.setProperty('--x', `${(-scrollY * 0.25) % 1800}px`) })
  return (
    <div className="notes" aria-label="Tasting notes across the six coffees">
      <div className="notes-track" ref={ref}>
        {[0, 1].map((k) => (
          <p key={k} aria-hidden={k === 1}>{row.map((x, i) => <span key={i} style={{ '--c': x.c }}><i />{x.n}</span>)}</p>
        ))}
      </div>
    </div>
  )
}

// From cherry to cup, pinned: the object turns in place while the four stages take their turn.
function Journey() {
  const sec = useRef(null)
  const [p, setP] = useState(0)
  useScrollFx(() => { if (sec.current) setP(pinned(sec.current)) })
  const n = STAGES.length
  const at = Math.min(n - 1, Math.floor(p * n * 0.999))
  return (
    <section className="journey" ref={sec} aria-labelledby="j-h" style={{ '--n': n }}>
      <div className="j-stick">
        <div className="j-text wrap">
          <h2 id="j-h">From cherry to cup</h2>
          <ol className="j-steps">
            {STAGES.map((s, i) => (
              <li key={s.t} className={i === at ? 'on' : i < at ? 'past' : ''}>
                <span className="j-k">{s.k}</span>
                <b>{s.t}</b>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="j-stage" aria-hidden="true">
          <span className={`j-disc d${at}`} />
          {STAGES.map((s, i) => {
            const local = p * n - i
            const st = reduced() ? { opacity: i === at ? 1 : 0 } : {
              '--t': Math.max(-1, Math.min(1, local - 0.5)).toFixed(3),
              opacity: i === at ? 1 : 0,
            }
            return <img key={s.img} src={`img/${s.img}.webp`} alt="" className={`j-obj ${i === at ? 'on' : ''}`} style={st} />
          })}
        </div>
        <div className="j-bar wrap" aria-hidden="true">{STAGES.map((s, i) => <i key={s.t} className={i <= at ? 'on' : ''} />)}</div>
      </div>
    </section>
  )
}

function Shelf() {
  return (
    <section className="shelf wrap" aria-labelledby="s-h">
      <div className="sec-head">
        <h2 id="s-h" data-r>Six coffees, one roast day</h2>
        <p data-r>Every bag is painted the colour of the fruit you taste. Fruity on the left, chocolatey on the right, one decaf for the evening.</p>
      </div>
      <div className="grid">{COFFEES.map((c, i) => <Card key={c.id} c={c} i={i} />)}</div>
      <Go to="/shop" className="more" data-r>Compare all six side by side<AiOutlineArrowRight aria-hidden="true" /></Go>
    </section>
  )
}

// The live thing: say how you brew and what you like, get one coffee and its recipe.
function Brew() {
  const cart = useCart()
  const [m, setM] = useState('pourover')
  const [taste, setTaste] = useState(7)
  const [decaf, setDecaf] = useState(false)
  const [added, setAdded] = useState(false)
  const method = METHODS.find((x) => x.id === m)
  const pick = useMemo(() => {
    const pool = COFFEES.filter((c) => (decaf ? c.kind === 'decaf' : c.kind !== 'decaf'))
    return pool.map((c) => ({ c, s: -Math.abs(c.fruit - taste) * 2 + (c.best.includes(m) ? 3 : 0) })).sort((a, b) => b.s - a.s)[0].c
  }, [m, taste, decaf])
  useEffect(() => setAdded(false), [pick.id, m])
  const grind = GRINDS.find((g) => g.id === method.grind)
  return (
    <section className="brew" id="brew" aria-labelledby="b-h">
      <div className="wrap brew-grid">
        <div className="brew-ask">
          <h2 id="b-h" data-r>Brew match</h2>
          <p data-r>Tell us how you make coffee and what you like in it. We pick one bag, grind it for your method and give you the recipe.</p>
          <img className="brew-tools" src="img/tools.webp" alt="A pour-over dripper, a moka pot, a French press and an espresso cup" width="900" height="476" loading="lazy" data-r />
          <fieldset data-r>
            <legend>I brew with</legend>
            <div className="seg">{METHODS.map((x) => <button key={x.id} aria-pressed={m === x.id} onClick={() => setM(x.id)}>{x.name}</button>)}</div>
          </fieldset>
          <fieldset data-r>
            <legend>I like my coffee</legend>
            <input type="range" min="0" max="10" value={taste} onChange={(e) => setTaste(+e.target.value)} aria-label="From chocolate and nuts to fruit and flowers" aria-valuetext={taste < 4 ? 'Chocolate and nuts' : taste > 6 ? 'Fruit and flowers' : 'Somewhere in between'} style={{ '--v': `${taste * 10}%` }} />
            <div className="range-ends"><span>Chocolate and nuts</span><span>Fruit and flowers</span></div>
          </fieldset>
          <label className="check" data-r><input type="checkbox" checked={decaf} onChange={(e) => setDecaf(e.target.checked)} /><i aria-hidden="true"><AiOutlineCheck /></i>Decaf only</label>
        </div>
        <div className="brew-answer" style={{ '--c': pick.colour, '--ink-c': pick.ink }} aria-live="polite">
          <div className="ba-top" key={pick.id}>
            <img src={`img/${pick.img}.webp`} alt="" />
            <div>
              <p className="ba-for">Your match for {method.name.toLowerCase()}</p>
              <h3>{pick.name}</h3>
              <p>{pick.line}</p>
            </div>
          </div>
          <dl className="recipe">{method.recipe.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <button className="btn wide on-c" onClick={() => { cart.add({ id: pick.id, size: 250, grind: method.grind }); setAdded(true) }}>
            {added ? <><AiOutlineCheck aria-hidden="true" />Added, ground for {grind.name.toLowerCase()}</> : <><AiOutlinePlus aria-hidden="true" />Add 250 g ground for {grind.name.toLowerCase()}, {usd(pick.price[250])}</>}
          </button>
        </div>
      </div>
    </section>
  )
}

function Subscribe() {
  const cart = useCart()
  const [id, setId] = useState('cerrado')
  const [size, setSize] = useState(250)
  const [every, setEvery] = useState(2)
  const [bags, setBags] = useState(2)
  const c = COFFEES.find((x) => x.id === id)
  const each = c.price[size] * 0.9
  const month = (each * bags * 4) / every
  return (
    <section className="subs wrap" id="subscribe" aria-labelledby="sub-h">
      <div className="subs-head">
        <h2 id="sub-h" data-r>Never run out on a Monday</h2>
        <p data-r>A subscription arrives the week after each roast. You save 10%, delivery is free, and you can skip, swap or stop before any Monday.</p>
      </div>
      <div className="subs-box" data-r style={{ '--c': c.colour, '--ink-c': c.ink }}>
        <div className="subs-opts">
          <div className="opt"><span>Coffee</span><div className="swatches">{COFFEES.map((x) => <button key={x.id} aria-pressed={id === x.id} onClick={() => setId(x.id)} style={{ '--c': x.colour }} aria-label={x.name}><i /></button>)}</div><b className="opt-val">{c.name}</b></div>
          <div className="opt"><span>Bag size</span><div className="seg">{[250, 1000].map((s) => <button key={s} aria-pressed={size === s} onClick={() => setSize(s)}>{s === 1000 ? '1 kg' : '250 g'}</button>)}</div></div>
          <div className="opt"><span>Bags each time</span><div className="seg">{[1, 2, 3].map((b) => <button key={b} aria-pressed={bags === b} onClick={() => setBags(b)}>{b}</button>)}</div></div>
          <div className="opt"><span>Every</span><div className="seg">{[2, 3, 4].map((w) => <button key={w} aria-pressed={every === w} onClick={() => setEvery(w)}>{w} weeks</button>)}</div></div>
        </div>
        <div className="subs-sum">
          <div className="subs-bags" aria-hidden="true">{Array.from({ length: bags }).map((_, k) => <img key={`${id}${k}`} src={`img/${c.img}.webp`} alt="" style={{ '--k': k }} />)}</div>
          <p><b>{usd(each * bags)}</b> each delivery</p>
          <p className="subs-month">About {usd(Math.round(month))} a month. First box ships {fmtDay(nextRoast().post)}.</p>
          <button className="btn wide" onClick={() => cart.add({ id, size, grind: 'whole', sub: every, qty: bags })}>Start the subscription<AiOutlineArrowRight aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  )
}

function Origins() {
  const fig = useRef(null)
  useScrollFx(() => { if (fig.current && !reduced()) fig.current.style.setProperty('--z', (1.12 - through(fig.current) * 0.12).toFixed(3)) })
  return (
    <section className="origins wrap" id="origins" aria-labelledby="o-h">
      <div className="sec-head">
        <h2 id="o-h" data-r>Where the cherries grow</h2>
        <p data-r>Six farms and stations we buy from by name, with the height, the process and the months they pick.</p>
      </div>
      <figure className="farm" ref={fig} data-r><img src="img/farm.webp" alt="Coffee shrubs on terraced hills with a drying bed and a small shed" width="1800" height="1007" loading="lazy" /></figure>
      <div className="otable" role="table" aria-label="Origins">
        <div role="row" className="orow ohead"><span role="columnheader">Coffee</span><span role="columnheader">Grown by</span><span role="columnheader">Height</span><span role="columnheader">Process</span><span role="columnheader">Picked</span></div>
        {COFFEES.map((c) => (
          <Go key={c.id} to={`/coffee/${c.id}`} role="row" className="orow" style={{ '--c': c.colour }} data-r>
            <span role="cell"><i />{c.name}<small>{c.region}, {c.origin}</small></span>
            <span role="cell">{c.producer}</span>
            <span role="cell">{c.alt}</span>
            <span role="cell">{c.process}</span>
            <span role="cell">{c.harvest}</span>
          </Go>
        ))}
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="faq wrap" aria-labelledby="f-h">
      <h2 id="f-h" data-r>Questions before the first bag</h2>
      <div className="qs">{FAQ.map(([q, a], i) => <details key={q} open={i === 0} data-r><summary>{q}<AiOutlineDown aria-hidden="true" /></summary><p>{a}</p></details>)}</div>
    </section>
  )
}

function Closing() {
  const rd = useCountdown()
  return (
    <section className="closing">
      <img className="cl-cup" src="img/cup.webp" alt="" aria-hidden="true" />
      <div className="wrap">
        <h2>Next roast, {fmtDay(rd.roast)}</h2>
        <p>Order in the next {rd.left} and your coffee is posted {fmtDay(rd.post)}.</p>
        <Go to="/shop" className="btn invert">Shop the six coffees<AiOutlineArrowRight aria-hidden="true" /></Go>
      </div>
    </section>
  )
}
