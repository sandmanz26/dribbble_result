import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarPlus } from 'lucide-react'
import { listBookings } from '../data/api.js'
import { fmtDay } from '../data/schedule.js'
import { money, SERVICES } from '../data/services.js'
import { vehicleLabel } from '../data/vehicles.js'
import { Button, Empty, Loading, Skeleton } from '../ui/index.jsx'

const LABEL = {
  scheduled: 'Booked', assigned: 'Technician assigned', en_route: 'On the way', working: 'In progress',
  approval: 'Needs your OK', done: 'Done', cancelled: 'Cancelled',
}

export default function Bookings() {
  const [state, setState] = useState({ status: 'loading' })
  useEffect(() => {
    listBookings().then((list) => setState({ status: 'ok', list }))
  }, [])

  return (
    <section className="section">
      <div className="wrap narrow stack-lg">
        <div className="page-head">
          <h1 className="display-lg">My bookings</h1>
        </div>
        {state.status === 'loading' && (
          <Loading label="Loading bookings">
            <div className="stack-sm">
              {[0, 1].map((i) => <Skeleton key={i} h={84} r="var(--radius-md)" />)}
            </div>
          </Loading>
        )}
        {state.status === 'ok' && !state.list.length && (
          <Empty icon={CalendarPlus} title="No visits yet" action={<Button to="/quote/vehicle" iconEnd={ArrowRight}>Get a quote</Button>}>
            Once you book, the visit shows up here with your technician, arrival time and report.
          </Empty>
        )}
        {state.status === 'ok' && state.list.length > 0 && (
          <ul className="booking-list">
            {state.list.map((b) => (
              <li key={b.id}>
                <Link to={`/booking/${b.id}`} className="booking-row">
                  <span className="stack-xs">
                    <strong>{SERVICES[b.service].name}</strong>
                    <span className="muted small">{vehicleLabel(b.vehicle)} · {fmtDay(b.slot.day, { weekday: 'short', month: 'short', day: 'numeric' })}, {b.slot.label}</span>
                  </span>
                  <span className={`tag${b.status === 'approval' ? ' tag-warning' : b.status === 'cancelled' ? '' : b.status === 'done' ? ' tag-success' : ' tag-info'}`}>{LABEL[b.status]}</span>
                  <span className="num">{money(b.total)}</span>
                  <ArrowRight size={18} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
