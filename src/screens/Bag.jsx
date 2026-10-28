import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore, linePrice, dipName, sideOf } from '../store.jsx'
import { money, HEAT, SHOP, itemOf } from '../data/menu.js'
import Food from '../ui/Food.jsx'
import { Tile, Stepper, Sheet, clock } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

// Time slots every 15 minutes from the next quarter hour, inside opening hours.
function slots(now, lead) {
  const d = new Date(now + lead * 60000); d.setSeconds(0, 0)
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15)
  const out = []
  for (let i = 0; i < 8; i++) { const t = new Date(d.getTime() + i * 15 * 60000); if (t.getHours() < 23 && t.getHours() >= 11) out.push(t.getTime()) }
  return out
}

export default function Bag() {
  const { s, dispatch, itemById, subtotal, fee, total, online, now } = useStore()
  const nav = useNavigate()
  const [sheet, setSheet] = useState(false)
  const lead = Math.max(0, ...s.bag.map((l) => itemById(l.id)?.mins || 0)) + 5 + (s.mode === 'delivery' ? SHOP.deliveryMins : 0)
  const times = slots(now, lead)
  const slotLabel = s.slot === 'asap' ? `As soon as it's ready, about ${clock(now + lead * 60000)}` : clock(s.slot)

  if (!s.bag.length) {
    return (
      <div className="empty">
        <Food art="bucket" className="empty-art" />
        <h1>Your bag is empty</h1>
        <p>Pick something from the menu. Your bag stays on this phone, even with no signal.</p>
        <Link to="/" className="btn">See the menu</Link>
      </div>
    )
  }

  const place = () => {
    dispatch({ type: 'place', total, online, now: new Date().toISOString(), mins: lead })
    nav(`/order/A-${s.seq + 1}`)
  }

  return (
    <div className="bag">
      <h1 className="page-title">Your bag</h1>
      <ul className="bag-lines">
        {s.bag.map((l) => {
          const it = itemById(l.id) || itemOf(l.id)
          const bits = [l.heat && HEAT.find((h) => h.id === l.heat)?.name, ...l.dips.map(dipName), l.side !== 'none' && sideOf(l.side)?.name].filter(Boolean)
          return (
            <li key={l.key} className="bag-line">
              <Tile item={it} size="sm" />
              <span className="bag-text"><b>{it.name}</b><span>{bits.join(', ')}</span>{it.soldOut && <em>Sold out since you added it</em>}</span>
              <span className="bag-end">
                <span className="bag-price">{money(linePrice(l, it))}</span>
                <Stepper small value={l.qty} onChange={(v) => dispatch({ type: 'qty', key: l.key, d: v - l.qty })} label={`${it.name} quantity`} />
              </span>
            </li>
          )
        })}
      </ul>

      <section className="card">
        <div className="seg" role="radiogroup" aria-label="How you get it">
          {[['pickup', I.Store, 'Pickup'], ['delivery', I.Bike, 'Delivery']].map(([id, Icon, label]) => (
            <button key={id} role="radio" aria-checked={s.mode === id} onClick={() => dispatch({ type: 'set', patch: { mode: id, slot: 'asap' } })}><Icon size={18} />{label}</button>
          ))}
        </div>
        <button className="setting" onClick={() => setSheet(true)}>
          <I.Time size={20} /><span><small>{s.mode === 'pickup' ? 'Pickup time' : 'Delivery time'}</small>{slotLabel}</span><I.Right size={18} />
        </button>
        <div className="setting is-static">
          <I.Pin size={20} /><span><small>{s.mode === 'pickup' ? 'Collect from' : 'Deliver to'}</small>{s.mode === 'pickup' ? `${SHOP.name}, ${SHOP.branch}` : '14 Palm Avenue, flat 3 (saved address)'}</span>
        </div>
        <div className="setting is-static">
          <I.Cash size={20} /><span><small>Payment</small>{s.mode === 'pickup' ? 'Pay at the counter, cash or card' : 'Pay the rider, cash or card'}</span>
        </div>
      </section>

      <dl className="sums">
        <div><dt>Food</dt><dd>{money(subtotal)}</dd></div>
        {s.mode === 'delivery' && <div><dt>Delivery</dt><dd>{money(fee)}</dd></div>}
        <div className="is-total"><dt>To pay</dt><dd>{money(total)}</dd></div>
      </dl>

      {!online && <p className="note is-warn"><I.Offline size={18} /> No signal right now. Your order is saved on this phone and goes to the kitchen by itself as soon as you are back online. The ready time starts from then.</p>}

      <div className="placebar">
        <button className="btn is-wide" onClick={place} disabled={s.bag.some((l) => itemById(l.id)?.soldOut)}>
          {online ? <>Send order <span className="btn-sum">{money(total)}</span></> : <>Save order, send when online</>}
        </button>
      </div>

      <Sheet open={sheet} onClose={() => setSheet(false)} title={s.mode === 'pickup' ? 'Pickup time' : 'Delivery time'}>
        <div className="options" role="radiogroup" aria-label="Time">
          <button role="radio" aria-checked={s.slot === 'asap'} className="option" onClick={() => { dispatch({ type: 'set', patch: { slot: 'asap' } }); setSheet(false) }}>
            <span className="radio" aria-hidden="true" />As soon as it&apos;s ready<span className="option-price">about {clock(now + lead * 60000)}</span>
          </button>
          {times.map((t) => (
            <button key={t} role="radio" aria-checked={s.slot === t} className="option" onClick={() => { dispatch({ type: 'set', patch: { slot: t } }); setSheet(false) }}>
              <span className="radio" aria-hidden="true" />{clock(t)}
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  )
}
