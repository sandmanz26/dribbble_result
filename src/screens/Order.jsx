import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore, linePrice, dipName, sideOf } from '../store.jsx'
import { money, HEAT, STATIONS, SHOP } from '../data/menu.js'
import { clock } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

// The order as the kitchen sees it: a printed ticket that moves along the rail.
export default function Order() {
  const { id } = useParams()
  const nav = useNavigate()
  const { s, stageOf, itemById, online, dispatch } = useStore()
  const o = s.orders.find((x) => x.id === id)
  if (!o) return <div className="empty"><h1>We can&apos;t find order {id}</h1><p>It may have been cleared when the demo was reset.</p><Link className="btn" to="/orders">All orders</Link></div>

  const st = stageOf(o)
  const ready = o.sentAt ? new Date(o.sentAt).getTime() + o.mins * 60000 : null
  const pickup = o.mode === 'pickup'
  const stations = STATIONS.map((x, i) => (i === 4 && !pickup ? { ...x, name: 'On the way', note: 'With the rider, sealed at the counter.' } : x))

  return (
    <div className="order">
      <div className="order-top">
        <button className="icon-btn" onClick={() => nav('/orders')} aria-label="All orders"><I.Back size={22} /></button>
        <span>{pickup ? 'Pickup' : 'Delivery'} · {SHOP.branch}</span>
      </div>

      <div className={`ticket ${st < 0 ? 'is-waiting' : ''}`}>
        <div className="ticket-head">
          <span className="ticket-label">{pickup ? 'Your number' : 'Order'}</span>
          <span className="ticket-no">{o.id}</span>
          <span className="ticket-name">for {o.name}</span>
        </div>

        {st < 0 ? (
          <div className="ticket-wait" role="status">
            <I.Offline size={22} />
            <p><b>Not sent yet.</b> Saved on this phone at {clock(o.madeAt)}. It goes to the kitchen by itself when you have signal, and the ready time starts then.</p>
            <button className="btn is-small" disabled={!online} onClick={() => dispatch({ type: 'flush', now: new Date().toISOString() })}>{online ? 'Send now' : 'Still no signal'}</button>
          </div>
        ) : (
          <div className="ticket-eta" aria-live="polite">
            {st === 4 ? <><b>{pickup ? 'Ready at the counter' : 'On the way to you'}</b><span>Show this number when you collect.</span></>
              : <><b>{pickup ? 'Ready' : 'Arrives'} about {clock(o.slot === 'asap' ? ready : o.slot)}</b><span>{STATIONS[st].note}</span></>}
          </div>
        )}

        <ol className="rail" aria-label="Kitchen progress">
          {stations.map((x, i) => (
            <li key={x.id} className={i < st ? 'is-done' : i === st ? 'is-now' : ''} aria-current={i === st ? 'step' : undefined}>
              <span className="rail-dot">{i < st ? <I.Check size={14} /> : i === st ? <I.Fire size={14} /> : null}</span>
              <span className="rail-name">{x.name}</span>
            </li>
          ))}
        </ol>

        <hr className="perf" />
        <ul className="ticket-lines">
          {o.lines.map((l) => {
            const it = itemById(l.id)
            const bits = [l.heat && HEAT.find((h) => h.id === l.heat)?.name, ...l.dips.map(dipName), l.side !== 'none' && sideOf(l.side)?.name].filter(Boolean)
            return <li key={l.key}><span className="q">{l.qty}×</span><span><b>{it.name}</b><small>{bits.join(' · ')}</small></span><span className="p">{money(linePrice(l, it))}</span></li>
          })}
        </ul>
        <p className="ticket-total"><span>{pickup ? 'Pay at the counter' : 'Pay the rider'}</span><b>{money(o.total)}</b></p>
      </div>

      {st >= 0 && st < 4 && <button className="btn is-ghost" onClick={() => dispatch({ type: 'bump', id: o.id })}>Demo: move to the next station</button>}
    </div>
  )
}
