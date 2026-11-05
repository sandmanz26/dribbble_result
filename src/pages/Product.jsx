import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AiOutlinePlus, AiOutlineMinus, AiOutlineCheck, AiOutlineArrowRight } from 'react-icons/ai'
import { byId, COFFEES, GRINDS, METHODS, usd, nextRoast, fmtDay } from '../data.js'
import { useCart } from '../store.jsx'
import { useReveal } from '../motion.js'
import { Go } from '../App.jsx'
import Bag3D from '../Bag3D.jsx'
import Card from '../Card.jsx'

export default function Product() {
  const { id } = useParams()
  const c = byId(id) || COFFEES[0]
  const cart = useCart()
  const [size, setSize] = useState(250)
  const [grind, setGrind] = useState('whole')
  const [sub, setSub] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const ref = useReveal([id])
  const each = c.price[size] * (sub ? 0.9 : 1)
  const others = COFFEES.filter((x) => x.id !== c.id).slice(0, 3)
  const methods = METHODS.filter((m) => c.best.includes(m.id))
  const add = () => { cart.add({ id: c.id, size, grind, sub: sub || undefined, qty }); setAdded(true) }
  return (
    <div ref={ref} style={{ '--c': c.colour, '--ink-c': c.ink }}>
      <section className="pd wrap">
        <div className="pd-art">
          <span className="pd-disc" aria-hidden="true" />
          <Bag3D coffee={c} interactive auto hint vt="bag" className="pd-bag" />
        </div>
        <div className="pd-info">
          <p className="pd-origin">{c.region}, {c.origin}</p>
          <h1>{c.name}</h1>
          <p className="pd-line">{c.line}</p>
          <ul className="pd-notes">{c.notes.map((n) => <li key={n}>{n}</li>)}</ul>
          <div className="pd-opt">
            <span>Size</span>
            <div className="seg">{[250, 1000].map((s) => <button key={s} aria-pressed={size === s} onClick={() => { setSize(s); setAdded(false) }}>{s === 1000 ? '1 kg' : '250 g'}<small>{usd(c.price[s])}</small></button>)}</div>
          </div>
          <div className="pd-opt">
            <span>Grind</span>
            <div className="grinds">{GRINDS.map((g) => <button key={g.id} aria-pressed={grind === g.id} onClick={() => { setGrind(g.id); setAdded(false) }}><b>{g.name}</b><small>{g.hint}</small></button>)}</div>
          </div>
          <div className="pd-opt">
            <span>How often</span>
            <div className="seg">
              <button aria-pressed={!sub} onClick={() => { setSub(0); setAdded(false) }}>Just once</button>
              {[2, 4].map((w) => <button key={w} aria-pressed={sub === w} onClick={() => { setSub(w); setAdded(false) }}>Every {w} weeks<small>10% off</small></button>)}
            </div>
          </div>
          <div className="pd-buy">
            <div className="stepper">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="One bag less"><AiOutlineMinus /></button>
              <output aria-label="Bags">{qty}</output>
              <button onClick={() => setQty((q) => Math.min(12, q + 1))} aria-label="One bag more"><AiOutlinePlus /></button>
            </div>
            <button className="btn grow" onClick={add}>{added ? <><AiOutlineCheck aria-hidden="true" />In your bag</> : <>Add to bag, {usd(each * qty)}</>}</button>
          </div>
          <p className="pd-ship">Roasted {fmtDay(nextRoast().roast)}, posted the day after. Free delivery over $45.</p>
        </div>
      </section>

      <section className="pd-more wrap">
        <div className="taste" data-r>
          <h2>How it tastes</h2>
          {[['Fruit', c.fruit], ['Body', c.body], ['Sweetness', c.sweet]].map(([k, v]) => (
            <div key={k} className="taste-row"><span>{k}</span><span className="meter"><b style={{ width: `${v * 10}%` }} /></span><span>{v} of 10</span></div>
          ))}
        </div>
        <dl className="facts" data-r>
          <h2>Where it is from</h2>
          {[['Grown by', c.producer], ['Region', `${c.region}, ${c.origin}`], ['Height', c.alt], ['Variety', c.variety], ['Process', c.process], ['Picked', c.harvest], ['Roast', c.roast]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <div className="recipes" data-r>
          <h2>Brew it like this</h2>
          {methods.map((m) => (
            <div key={m.id} className="rcp">
              <b>{m.name}</b>
              <dl>{m.recipe.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap also">
        <h2 data-r>If you like this, try</h2>
        <div className="grid three">{others.map((o, i) => <Card key={o.id} c={o} i={i} />)}</div>
        <Go to="/shop" className="more">All six coffees<AiOutlineArrowRight aria-hidden="true" /></Go>
      </section>
    </div>
  )
}
