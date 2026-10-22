import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarPlus } from 'lucide-react'
import { useBrand } from '../brand/BrandContext.jsx'
import { BRAND_META } from '../brand/tokens.js'
import { extraFinding, listBookings } from '../data/api.js'
import { fmtDay } from '../data/schedule.js'
import { money, SERVICES } from '../data/services.js'
import { vehicleLabel } from '../data/vehicles.js'
import { FindBooking, linesOf } from '../service/index.jsx'
import { Alert, Button, Empty, Loading, Skeleton } from '../ui/index.jsx'
import { UXNote } from '../ui/UXNote.jsx'

const LABEL = {
  scheduled: 'Booked', assigned: 'Technician assigned', en_route: 'On the way', working: 'In progress',
  approval: 'Needs your OK', done: 'Done', cancelled: 'Cancelled',
}
const DISMISS_KEY = 'nb-migr-dismissed'

function readDismissed() {
  try { return localStorage.getItem(DISMISS_KEY) === '1' } catch { return false }
}

function BookingRow({ b, brand }) {
  const extra = b.extra === 'approved' ? extraFinding(b).price : 0
  const origin = b.brand || 'nubrakes'
  const free = SERVICES[b.service]?.free
  return (
    <li>
      <Link to={`/booking/${b.id}`} className="booking-row">
        <span className="stack-xs">
          <strong>{SERVICES[b.service].name}</strong>
          <span className="muted small">{vehicleLabel(b.vehicle)} · {fmtDay(b.slot.day, { weekday: 'short', month: 'short', day: 'numeric', ...(b.slot.day.slice(0, 4) !== String(new Date().getFullYear()) ? { year: 'numeric' } : {}) })}, {b.slot.label}</span>
          {origin !== brand && <span className="booking-origin">Booked with {BRAND_META[origin].name}</span>}
        </span>
        <span className={`tag${b.status === 'approval' ? ' tag-warning' : b.status === 'cancelled' ? '' : b.status === 'done' ? ' tag-success' : ' tag-info'}`}>{LABEL[b.status]}</span>
        <span className="num">{free ? 'Free' : money(linesOf(b).total + extra)}</span>
        <ArrowRight size={18} aria-hidden />
      </Link>
    </li>
  )
}

export default function Bookings() {
  const { brand } = useBrand()
  const [state, setState] = useState({ status: 'loading' })
  const [nonce, setNonce] = useState(0)
  const [finding, setFinding] = useState(false)
  const [dismissed, setDismissed] = useState(readDismissed)

  useEffect(() => {
    let live = true
    setState({ status: 'loading' })
    listBookings()
      .then((list) => live && setState({ status: 'ok', list }))
      .catch((e) => live && setState({ status: 'error', message: e.message }))
    return () => { live = false }
  }, [nonce])

  const list = state.list || []
  const upcoming = list.filter((b) => !['done', 'cancelled'].includes(b.status))
  const past = list.filter((b) => ['done', 'cancelled'].includes(b.status)).sort((a, b) => (a.slot.day < b.slot.day ? 1 : -1))
  const migrated = brand === 'valvoline' && list.some((b) => (b.brand || 'nubrakes') === 'nubrakes')

  const dismiss = () => {
    setDismissed(true)
    try { localStorage.setItem(DISMISS_KEY, '1') } catch {}
  }

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
        {state.status === 'error' && (
          <Alert tone="danger" title="Your visits did not load" action={<Button size="sm" variant="ghost" onClick={() => setNonce((n) => n + 1)}>Try again</Button>}>
            {state.message} Nothing is lost.
          </Alert>
        )}
        {state.status === 'ok' && !list.length && (
          <Empty
            icon={CalendarPlus}
            title="No visits yet"
            action={
              <div className="row-actions">
                <Button to="/quote/vehicle" iconEnd={ArrowRight}>Get a quote</Button>
                {!finding && <Button variant="ghost" onClick={() => setFinding(true)}>Find a booking</Button>}
              </div>
            }
          >
            <p>Once you book, the visit shows up here with your technician, arrival time and report.</p>
            {finding && <FindBooking />}
          </Empty>
        )}
        {state.status === 'ok' && list.length > 0 && (
          <>
            {migrated && !dismissed && (
              <div className="note-anchor">
                <UXNote id="migration" className="uxnote-corner" />
                <Alert tone="info" title="Your NuBrakes visits and warranties are here" action={<Button size="sm" variant="ghost" onClick={dismiss}>Dismiss</Button>}>
                  Nothing changed on your side. Old NB- booking numbers still work.
                </Alert>
              </div>
            )}
            <div className="booking-group" aria-labelledby="upcoming-title">
              <h2 id="upcoming-title" className="display-xs">Upcoming</h2>
              {upcoming.length ? (
                <ul className="booking-list">{upcoming.map((b) => <BookingRow key={b.id} b={b} brand={brand} />)}</ul>
              ) : (
                <p className="muted">Nothing booked. <Link to="/quote/vehicle" className="text-link">Get a quote</Link></p>
              )}
            </div>
            {past.length > 0 && (
              <div className="booking-group" aria-labelledby="past-title">
                <h2 id="past-title" className="display-xs">Past visits</h2>
                <ul className="booking-list">{past.map((b) => <BookingRow key={b.id} b={b} brand={brand} />)}</ul>
              </div>
            )}
            <details className="find-details">
              <summary className="link-btn">Looking for a visit that is not here?</summary>
              <FindBooking />
            </details>
          </>
        )}
      </div>
    </section>
  )
}
