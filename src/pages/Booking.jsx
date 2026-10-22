import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { CalendarClock, CalendarX2, Check, CircleSlash, FileText, SearchX, ShieldCheck } from 'lucide-react'
import { extraFinding, getBooking, updateBooking } from '../data/api.js'
import { LOCATION_TYPES } from '../data/areas.js'
import { fmtDay } from '../data/schedule.js'
import { money, SERVICES } from '../data/services.js'
import { vehicleLabel } from '../data/vehicles.js'
import {
  ApprovalRequest, ArrivalWindowPicker, LocationSummary, StatusTimeline, TechnicianCard,
} from '../service/index.jsx'
import { Alert, Button, Choice, Empty, Loading, Sheet, Skeleton } from '../ui/index.jsx'

const ORDER = ['scheduled', 'assigned', 'en_route', 'working', 'approval', 'done']
const CANCEL_REASONS = ['Fixed it somewhere else', 'Need a different day', 'Price is higher than expected', 'Something else']

function Prep({ booking }) {
  const items = [
    'Park on a flat spot with room to open all doors',
    booking.presence === 'keys' ? `Keys: ${booking.keysNote}` : 'Be nearby so the technician can get the keys',
    'Clear the trunk if you have a wheel lock key in there',
  ]
  return (
    <div className="stack-sm">
      <h2 className="display-xs">Before we arrive</h2>
      <ul className="check-list">
        {items.map((x) => <li key={x}><Check size={18} aria-hidden /> {x}</li>)}
      </ul>
    </div>
  )
}

export default function Booking() {
  const { id } = useParams()
  const loc = useLocation()
  const [state, setState] = useState({ status: 'loading' })
  const [sheet, setSheet] = useState(null)
  const [slot, setSlot] = useState(null)
  const [reason, setReason] = useState(CANCEL_REASONS[0])
  const [busy, setBusy] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [eta, setEta] = useState(18)

  useEffect(() => {
    let live = true
    getBooking(id)
      .then((b) => live && setState({ status: 'ok', b }))
      .catch(() => live && setState({ status: 'missing' }))
    return () => { live = false }
  }, [id])

  const b = state.b
  useEffect(() => {
    if (b?.status !== 'en_route') return
    setEta(18)
    const t = setInterval(() => setEta((e) => Math.max(2, e - 1)), 4000)
    return () => clearInterval(t)
  }, [b?.status])

  async function save(patch, key) {
    setBusy(key)
    setActionError(null)
    try {
      const nb = await updateBooking(id, patch)
      setState({ status: 'ok', b: nb })
      setSheet(null)
    } catch (e) {
      setActionError(e.message)
    }
    setBusy(null)
  }

  if (state.status === 'loading') {
    return (
      <section className="section">
        <Loading label="Loading your booking">
          <div className="wrap booking-grid">
            <div className="stack-md">
              <Skeleton w="40%" h={36} />
              <Skeleton h={40} />
              <Skeleton h={160} r="var(--radius-lg)" />
            </div>
            <Skeleton h={280} r="var(--radius-lg)" />
          </div>
        </Loading>
      </section>
    )
  }
  if (state.status === 'missing') {
    return (
      <section className="section">
        <div className="wrap narrow">
          <Empty icon={SearchX} title="We could not find that booking" action={<Button to="/bookings">See my bookings</Button>}>
            Bookings live on the device you made them on in this prototype.
          </Empty>
        </div>
      </section>
    )
  }

  const s = SERVICES[b.service]
  const finding = extraFinding(b)
  const extra = b.extra === 'approved' ? finding.price : 0
  const when = `${fmtDay(b.slot.day, { weekday: 'long', month: 'long', day: 'numeric' })}, ${b.slot.label}`
  const cancelled = b.status === 'cancelled'
  const live = ['assigned', 'en_route', 'working', 'approval', 'done'].includes(b.status)

  return (
    <section className="section">
      <div className="wrap stack-lg">
        {loc.state?.justBooked && b.status === 'scheduled' && (
          <Alert tone="success" title="You are booked">
            We sent the details to {b.contact.email}{b.contact.sms ? ` and will text ${b.contact.phone}` : ''}.
          </Alert>
        )}
        <div className="page-head">
          <p className="muted">Booking {b.id}</p>
          <h1 className="display-lg">{cancelled ? 'Visit cancelled' : b.status === 'done' ? 'All done' : when}</h1>
        </div>

        {cancelled ? (
          <Empty icon={CircleSlash} title="This visit is cancelled" action={<Button to="/quote/vehicle">Book a new visit</Button>}>
            Nothing was charged. Your vehicle and address are saved for next time.
          </Empty>
        ) : (
          <div className="booking-grid">
            <div className="stack-lg">
              <StatusTimeline status={b.status} />

              {b.status === 'scheduled' && (
                <Alert tone="info" title="Technician assigned the evening before">
                  You get a text with their name and photo. On the day, we text when they are 30 minutes out.
                </Alert>
              )}
              {live && b.status !== 'done' && (
                <TechnicianCard tech={b.tech} status={b.status} eta={eta} window={b.slot.label} />
              )}
              {b.status === 'approval' && (
                <ApprovalRequest
                  finding={finding}
                  techName={b.tech.name.split(' ')[0]}
                  busy={busy}
                  decided={b.extra}
                  onDecide={(d) => save({ extra: d }, d)}
                />
              )}
              {b.status === 'done' && (
                <div className="stack-md">
                  <Alert tone="success" title={`${b.tech.name.split(' ')[0]} finished at ${b.slot.label.split(' to ')[1]}`}>
                    We texted a secure payment link to {b.contact.phone}. Your warranty starts today.
                  </Alert>
                  <div className="report">
                    <h2 className="display-xs"><FileText size={20} aria-hidden /> Inspection report</h2>
                    <dl className="lines">
                      <div><dt>Front pads</dt><dd>New, 11 mm</dd></div>
                      <div><dt>Rear pads</dt><dd>6 mm, good for now</dd></div>
                      <div><dt>Front rotors</dt><dd>{b.extra === 'approved' || b.service === 'pads-rotors' ? 'New' : '25.1 mm, replace soon'}</dd></div>
                      <div><dt>Brake fluid</dt><dd>{b.extra === 'approved' && b.service !== 'pads' ? 'Replaced' : '1.5% water, fine'}</dd></div>
                    </dl>
                    <p className="small muted">Sample readings for the prototype.</p>
                  </div>
                </div>
              )}
              {['scheduled', 'assigned'].includes(b.status) && <Prep booking={b} />}
              {actionError && !sheet && <Alert tone="danger" title="That did not save">{actionError}</Alert>}
            </div>

            <aside className="booking-side">
              <div className="side-card stack-md">
                <dl className="lines">
                  <div><dt>Vehicle</dt><dd>{vehicleLabel(b.vehicle)}</dd></div>
                  <div><dt>Service</dt><dd>{s.name}</dd></div>
                  <div><dt>Arrival</dt><dd>{when}</dd></div>
                  {extra > 0 && <div><dt>Approved on site</dt><dd className="num">{money(extra)}</dd></div>}
                  <div className="lines-total"><dt>{b.status === 'done' ? 'Total due' : 'Total, after the job'}</dt><dd className="num">{money(b.total + extra)}</dd></div>
                </dl>
                <LocationSummary address={b.address} type={LOCATION_TYPES.find((t) => t.id === b.locationType)?.label} notes={b.accessNotes} />
                {['scheduled', 'assigned'].includes(b.status) && (
                  <div className="row-actions">
                    <Button variant="secondary" icon={CalendarClock} onClick={() => { setSlot(null); setActionError(null); setSheet('reschedule') }}>Reschedule</Button>
                    <Button variant="ghost" icon={CalendarX2} onClick={() => { setActionError(null); setSheet('cancel') }}>Cancel</Button>
                  </div>
                )}
                <p className="small muted"><ShieldCheck size={15} aria-hidden /> Warranty on parts and labor</p>
              </div>
            </aside>
          </div>
        )}

        <div className="proto-strip">
          <p className="small"><strong>Prototype:</strong> move this visit along to see each state.</p>
          <div className="row-actions">
            <Button
              size="sm"
              variant="secondary"
              disabled={cancelled || b.status === 'done' || (b.status === 'approval' && !b.extra)}
              onClick={() => save({ status: ORDER[ORDER.indexOf(b.status) + 1] }, 'step')}
              loading={busy === 'step'}
            >
              {b.status === 'approval' && !b.extra ? 'Answer the request first' : 'Next status'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => save({ status: 'scheduled', extra: null }, 'reset')} loading={busy === 'reset'}>Start over</Button>
          </div>
        </div>
      </div>

      <Sheet
        open={sheet === 'reschedule'}
        onClose={() => setSheet(null)}
        title="Pick a new arrival window"
        footer={<Button block disabled={!slot} loading={busy === 'reschedule'} onClick={() => save({ slot, status: 'scheduled' }, 'reschedule')}>{slot ? `Move to ${fmtDay(slot.day, { weekday: 'short', month: 'short', day: 'numeric' })}, ${slot.label}` : 'Pick a window'}</Button>}
      >
        {actionError && <Alert tone="danger" title="That did not save">{actionError}</Alert>}
        <ArrivalWindowPicker metro={b.metro} value={slot} onChange={setSlot} />
      </Sheet>

      <Sheet
        open={sheet === 'cancel'}
        onClose={() => setSheet(null)}
        title="Cancel this visit?"
        footer={
          <div className="row-actions">
            <Button variant="danger" loading={busy === 'cancel'} onClick={() => save({ status: 'cancelled', cancelReason: reason }, 'cancel')}>Cancel visit</Button>
            <Button variant="ghost" onClick={() => setSheet(null)}>Keep it</Button>
          </div>
        }
      >
        {actionError && <Alert tone="danger" title="That did not save">{actionError}</Alert>}
        <p className="muted">Free to cancel. Telling us why helps us fix things.</p>
        <fieldset className="stack-sm">
          <legend className="sr-only">Reason</legend>
          {CANCEL_REASONS.map((r) => <Choice key={r} name="reason" value={r} checked={reason === r} onChange={setReason} title={r} />)}
        </fieldset>
      </Sheet>
    </section>
  )
}
