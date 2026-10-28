import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { money, STATIONS } from '../data/menu.js'
import Food from '../ui/Food.jsx'
import { clock, day } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

export default function Orders() {
  const { s, stageOf, itemById } = useStore()
  if (!s.orders.length) {
    return (
      <div className="empty">
        <Food art="wings" className="empty-art" />
        <h1>No orders yet</h1>
        <p>When you send an order its ticket shows up here, and you can watch it move through the kitchen.</p>
        <Link to="/" className="btn">See the menu</Link>
      </div>
    )
  }
  return (
    <div className="orders">
      <h1 className="page-title">Orders</h1>
      <ul className="stubs">
        {s.orders.map((o) => {
          const st = stageOf(o)
          const first = itemById(o.lines[0].id)
          return (
            <li key={o.id}>
              <Link to={`/order/${o.id}`} className={`stub ${st < 0 ? 'is-waiting' : st === 4 ? 'is-done' : ''}`}>
                <span className="stub-no">{o.id}</span>
                <span className="stub-text">
                  <b>{st < 0 ? 'Waiting for signal' : STATIONS[st].name}</b>
                  <span>{o.lines.reduce((t, l) => t + l.qty, 0)} items, {first?.name}{o.lines.length > 1 ? ' and more' : ''}</span>
                  <span>{day(o.madeAt)}, {clock(o.madeAt)} · {money(o.total)}</span>
                </span>
                {st < 0 ? <I.Offline size={20} /> : st === 4 ? <I.CheckCircle size={20} /> : <I.Fire size={20} className="pulse" />}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
