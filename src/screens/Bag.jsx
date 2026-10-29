import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore, linePrice, dipName, sideOf } from '../store.jsx'
import { money, HEAT, itemOf } from '../data/menu.js'
import { DELIVERY } from '../data/service.js'
import { Tile, Stepper } from '../ui/kit.jsx'
import SetupSheet, { summary } from './Setup.jsx'
import * as I from '../ui/icons.js'

const EXTRAS = ['mayo-fries', 'slaw', 'corn']

export default function Bag() {
  const { s, dispatch, itemById, subtotal, short, address, online } = useStore()
  const nav = useNavigate()
  const [setup, setSetup] = useState(false)
  const sum = summary(s, address)

  if (!s.bag.length) {
    return (
      <div className="empty">
        <img src="food/bucket.webp" alt="" className="empty-art" />
        <h1>Your bag is empty</h1>
        <p>Pick something from the menu. Your bag stays on this phone, even with no signal.</p>
        <Link to="/" className="btn">See the menu</Link>
      </div>
    )
  }

  const extras = EXTRAS.map((id) => itemById(id)).filter((it) => it && !it.soldOut && !s.bag.some((l) => l.id === it.id))
  const sold = s.bag.some((l) => itemById(l.id)?.soldOut)

  return (
    <div className="bag">
      <h1 className="page-title">Your bag</h1>
      <button className="where-card" onClick={() => setSetup(true)}>
        {s.setup.mode === 'delivery' ? <I.Scooter size={22} /> : s.setup.style === 'curbside' ? <I.Car size={22} /> : <I.Store size={22} />}
        <span><small>{sum.k}</small><b>{sum.v}</b><small>{sum.sub}</small></span>
        <em>Change</em>
      </button>

      <ul className="bag-lines">
        {s.bag.map((l) => {
          const it = itemById(l.id) || itemOf(l.id)
          const bits = [l.heat && HEAT.find((h) => h.id === l.heat)?.name, ...l.dips.map(dipName), l.side !== 'none' && sideOf(l.side)?.name].filter(Boolean)
          return (
            <li key={l.key} className="bag-line">
              <Tile item={it} size="sm" />
              <span className="bag-text"><b>{it.name}</b><span>{bits.join(', ')}</span>{it.soldOut && <em>Sold out since you added it. Remove it to continue.</em>}</span>
              <span className="bag-end">
                <span className="bag-price">{money(linePrice(l, it))}</span>
                <Stepper small value={l.qty} onChange={(v) => dispatch({ type: 'qty', key: l.key, d: v - l.qty })} label={`${it.name} quantity`} />
              </span>
            </li>
          )
        })}
      </ul>

      {extras.length > 0 && (
        <section className="extras" aria-labelledby="h-extras">
          <h2 id="h-extras">Goes well with it</h2>
          <ul>
            {extras.map((it) => (
              <li key={it.id}>
                <Tile item={it} size="sm" />
                <span><b>{it.name}</b><small>{money(it.price)}</small></span>
                <button className="quick is-inline" aria-label={`Add ${it.name}`} onClick={() => dispatch({ type: 'add', line: { id: it.id, qty: 1, heat: null, dips: [], side: 'none' } })}><I.Add size={18} /></button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {short > 0 && (
        <div className="minbar" role="status">
          <span>Add {money(short)} more for delivery. The minimum is {money(DELIVERY.minOrder)}.</span>
          <i style={{ '--p': `${Math.min(100, (subtotal / DELIVERY.minOrder) * 100)}%` }} />
        </div>
      )}

      <dl className="sums">
        <div className="is-total"><dt>Food</dt><dd>{money(subtotal)}</dd></div>
      </dl>
      <p className="fine bag-fine">{s.setup.mode === 'delivery' ? 'Delivery fee and an optional rider tip are added at checkout.' : 'No fees for pickup.'}</p>
      {!online && <p className="note is-warn"><I.Offline size={18} /> No signal. You can still finish checkout. The order waits on this phone and nothing is charged until the shop has it.</p>}

      <div className="placebar">
        <button className="btn is-wide is-accent" onClick={() => nav('/checkout')} disabled={sold || short > 0}>Checkout <span className="btn-sum">{money(subtotal)}</span></button>
      </div>
      <SetupSheet open={setup} onClose={() => setSetup(false)} />
    </div>
  )
}
