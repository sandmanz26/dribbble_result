import { Link } from 'react-router-dom'
import { useStore, etaOf } from '../store.jsx'
import { money, ITEMS } from '../data/menu.js'
import { planFor } from '../data/service.js'
import { clock, day } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

function line(o, now) {
  if (o.status === 'outbox') return ['Waiting for signal, not sent', 'warn']
  if (o.status === 'sending') return ['Sending', 'warn']
  if (o.status === 'review') return ['Check changes before it sends', 'warn']
  if (o.status === 'needs') return ['The shop needs your answer', 'warn']
  if (o.status === 'sent') return ['Waiting for the shop to accept', '']
  if (o.status === 'cancelled') return ['Cancelled', 'muted']
  if (o.status === 'done') return [o.mode === 'delivery' ? 'Delivered' : 'Collected', 'done']
  const st = planFor(o)[o.step]
  if (st.wait === 'arrival' && !o.arrived) return ['Tap I’m here when you arrive', 'warn']
  return [`${st.title}, ${o.mode === 'delivery' ? 'arrives' : 'ready'} about ${clock(etaOf(o, now))}`, '']
}

export default function Orders() {
  const { s, now } = useStore()
  if (!s.orders.length) {
    return (
      <div className="empty">
        <img src="food/wings.webp" alt="" className="empty-art" />
        <h1>No orders yet</h1>
        <p>When you place an order you can follow it here, from the kitchen to your door.</p>
        <Link to="/" className="btn">See the menu</Link>
      </div>
    )
  }
  const open = s.orders.filter((o) => !['done', 'cancelled'].includes(o.status))
  const past = s.orders.filter((o) => ['done', 'cancelled'].includes(o.status))
  const stub = (o) => {
    const [text, tone] = line(o, now)
    const first = ITEMS.find((i) => i.id === o.lines[0]?.id)
    return (
      <li key={o.id}>
        <Link to={`/order/${o.id}`} className={`stub is-${tone}`}>
          <span className="stub-no">{o.id}</span>
          <span className="stub-text">
            <b>{text}</b>
            <span>{first?.name}{o.lines.length > 1 ? ` and ${o.lines.length - 1} more` : ''}</span>
            <span>{money(o.priced.total)} · {o.mode === 'delivery' ? 'Delivery' : 'Pickup'} · {new Date(o.createdAt).toDateString() === new Date(now).toDateString() ? '' : `${day(o.createdAt)}, `}{clock(o.createdAt)}</span>
          </span>
          {tone === 'warn' ? <I.Warning size={20} /> : tone === 'done' ? <I.CheckCircle size={20} /> : tone === 'muted' ? <I.Close size={20} /> : <I.Fire size={20} className="pulse" />}
        </Link>
      </li>
    )
  }
  return (
    <div className="orders">
      <h1 className="page-title">Orders</h1>
      {open.length > 0 && <><h2 className="sec-h">Now</h2><ul className="stubs">{open.map(stub)}</ul></>}
      {past.length > 0 && <><h2 className="sec-h">Earlier</h2><ul className="stubs">{past.map(stub)}</ul></>}
    </div>
  )
}
