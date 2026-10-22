import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CalendarClock, CalendarX2, Check, CircleSlash, FileText, SearchX, ShieldCheck } from 'lucide-react'
import { useBrand } from '../brand/BrandContext.jsx'
import { BRAND_META } from '../brand/tokens.js'
import { createWarrantyCheck, extraFinding, getBooking, updateBooking } from '../data/api.js'
import { LOCATION_TYPES } from '../data/areas.js'
import { fmtDay } from '../data/schedule.js'
import { money, priceQuote, SERVICES, warrantyEndFor } from '../data/services.js'
import { vehicleLabel } from '../data/vehicles.js'
import { useDraft } from '../flows/draft.jsx'
import {
  ApprovalRequest, ArrivalWindowPicker, FindBooking, linesOf, LocationSummary, Receipt, StatusTimeline, TechnicianCard,
  WarrantyCard, WarrantyClaimSheet, warrantyStatus,
} from '../service/index.jsx'
import { Alert, Button, Choice, Empty, Loading, Sheet, Skeleton } from '../ui/index.jsx'
import { UXNote } from '../ui/UXNote.jsx'

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

// Sample readings for the prototype. Seeded past visits carry their own.
function reportRows(b) {
  if (b.report) return b.report
  return [
    ['Front pads', 'New, 11 mm'],
    ['Rear pads', '6 mm, good for now'],
    ['Front rotors', b.extra === 'approved' || b.service === 'pads-rotors' ? 'New' : '25.1 mm, replace soon'],
    ['Brake fluid', b.service === 'pads' ? '1.5% water, fine' : b.extra === 'approved' ? 'Replaced' : b.extra === 'declined' ? '3.5% water, replace soon' : '1.5% water, fine'],
  ]
}

// The quote draft a past booking turns into: same car, address and contact.
function draftFrom(b, patch) {
  return {
    vehicle: b.vehicle, zip: b.zip, metro: b.metro, address: b.address, locationType: b.locationType,
    accessNotes: b.accessNotes || '', spotOk: b.spotOk || null, presence: b.presence || 'present', keysAt: b.keysNote || '',
    contact: b.contact, mode: 'known', axle: b.axle || 'front', slot: null, slotDropped: false, priceChange: null, noBooking: false,
    ...patch,
  }
}

export default function Booking() {
  const { id } = useParams()
  const loc = useLocation()
  const nav = useNavigate()
  const { brand } = useBrand()
  const { update: updateDraft } = useDraft()
  const [state, setState] = useState({ status: 'loading' })
  const [sheet, setSheet] = useState(null)
  const [slot, setSlot] = useState(null)
  const [reason, setReason] = useState(CANCEL_REASONS[0])
  const [busy, setBusy] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [eta, setEta] = useState(18)

  useEffect(() => {
    let live = true
    setState({ status: 'loading' })
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
          <Empty icon={SearchX} title={`We could not find booking ${id}`}>
            <p>Look it up with the booking number and your phone number. Bookings live on the device you made them on in this prototype.</p>
            <FindBooking />
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
  const done = b.status === 'done'
  const live = ['assigned', 'en_route', 'working', 'approval', 'done'].includes(b.status)
  const origin = b.brand || 'nubrakes'
  const warrantyEnd = b.warrantyEnd || warrantyEndFor(b.service, b.slot.day)
  const premium = b.tier === 'premium' && s.premiumAdd > 0
  const standard = premium ? priceQuote({ service: b.service, axle: b.axle, size: b.size || 'suv', tier: 'standard' }) : null

  const bookAgain = () => {
    const q = (tier) => priceQuote({ service: b.service, axle: b.axle, size: b.size || 'suv', tier })
    updateDraft(draftFrom(b, {
      service: b.service, tier: b.tier || 'standard', quote: { standard: q('standard'), premium: q('premium') },
      quotedAt: new Date().toISOString(), lastStep: 'time',
    }))
    nav('/quote/time')
  }
  const bookLater = () => {
    updateDraft(draftFrom(b, { service: finding.service, axle: 'front', tier: 'standard', quote: null, quotedAt: null, lastStep: 'price' }))
    nav('/quote/price')
  }

  return (
    <section className="section">
      <div className="wrap stack-lg">
        {loc.state?.justBooked && b.status === 'scheduled' && (
          <Alert tone="success" title="You are booked">
            We sent the details to {b.contact.email}{b.contact.sms ? ` and will text ${b.contact.phone}` : ''}.
          </Alert>
        )}
        <div className="page-head">
          <p className="muted">Booking {b.id}{origin !== brand ? `. Booked with ${BRAND_META[origin].name}` : ''}</p>
          <h1 className="display-lg">{cancelled ? 'Visit cancelled' : done ? 'All done' : when}</h1>
        </div>

        {cancelled ? (
          <Empty
            icon={CircleSlash}
            title="This visit is cancelled"
            action={s.free ? <Button to="/quote/vehicle">Book a new visit</Button> : <Button onClick={bookAgain}>Book again with the same car and address</Button>}
          >
            Nothing was charged. Your vehicle and address are saved for next time.
          </Empty>
        ) : (
          <div className="booking-grid">
            <div className="stack-lg no-print">
              <div className="note-anchor">
                <UXNote id="tech" className="uxnote-corner" />
                <StatusTimeline status={b.status} />
              </div>

              {b.status === 'scheduled' && (
                <Alert tone="info" title="Technician assigned the evening before">
                  You get a text with their name and photo. On the day, we text when they are 30 minutes out.
                </Alert>
              )}
              {['scheduled', 'assigned'].includes(b.status) && brand === 'valvoline' && (
                <p className="small muted">
                  Texts come from {BRAND_META.valvoline.fullName}. The van may still carry NuBrakes branding during the changeover.
                </p>
              )}
              {live && !done && (
                <TechnicianCard tech={b.tech} status={b.status} eta={eta} window={b.slot.label} livery={BRAND_META[brand].vanLivery} />
              )}
              {b.status === 'approval' && (
                <div className="note-anchor">
                  <UXNote id="approval" className="uxnote-corner" />
                  <ApprovalRequest
                    finding={finding}
                    techName={b.tech.name.split(' ')[0]}
                    busy={busy}
                    decided={b.extra}
                    onDecide={(d) => save({ extra: d }, d)}
                  />
                </div>
              )}
              {done && (
                <div className="stack-md">
                  {!b.paid && (
                    <Alert tone="success" title={`${b.tech.name.split(' ')[0]} finished at ${b.slot.label.split(' to ')[1]}`}>
                      We texted a secure payment link to {b.contact.phone}. You can also pay from the receipt here.
                    </Alert>
                  )}
                  <div className="report">
                    <h2 className="display-xs"><FileText size={20} aria-hidden /> Inspection report</h2>
                    <dl className="lines">
                      {reportRows(b).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                    </dl>
                    {b.extra === 'declined' && (
                      <div className="report-later note-anchor">
                        <p><strong>Recommended, not done:</strong> {finding.title.toLowerCase()} ({finding.reading.split('. ')[0].toLowerCase()})</p>
                        <div><Button size="sm" variant="secondary" onClick={bookLater}>Book this for later</Button></div>
                      </div>
                    )}
                    <p className="small muted">Sample readings for the prototype.</p>
                  </div>
                  {warrantyEnd && (
                    <WarrantyCard
                      originBrand={origin}
                      currentBrand={brand}
                      service={b.service}
                      axle={b.axle}
                      endDate={warrantyEnd}
                      status={warrantyStatus(warrantyEnd)}
                      onReport={() => setSheet('warranty')}
                    />
                  )}
                </div>
              )}
              {['scheduled', 'assigned'].includes(b.status) && <Prep booking={b} />}
              {actionError && !sheet && <Alert tone="danger" title="That did not save">{actionError}</Alert>}
            </div>

            <aside className="booking-side stack-md">
              <div className="side-card stack-md no-print">
                <dl className="lines">
                  <div><dt>Vehicle</dt><dd>{vehicleLabel(b.vehicle)}</dd></div>
                  <div><dt>Service</dt><dd>{s.name}</dd></div>
                  <div><dt>Arrival</dt><dd>{when}</dd></div>
                  {!done && extra > 0 && <div><dt>Approved on site</dt><dd className="num">{money(extra)}</dd></div>}
                  {!done && (
                    <div className="lines-total">
                      <dt>Total, after the job</dt>
                      <dd className={s.free ? '' : 'num'}>{s.free ? 'Free under warranty' : money(linesOf(b).total + extra)}</dd>
                    </div>
                  )}
                </dl>
                <LocationSummary address={b.address} type={LOCATION_TYPES.find((t) => t.id === b.locationType)?.label} notes={b.accessNotes} />
                {['scheduled', 'assigned'].includes(b.status) && (
                  <div className="row-actions">
                    <UXNote id="reschedule" />
                    <Button variant="secondary" icon={CalendarClock} onClick={() => { setSlot(null); setActionError(null); setSheet('reschedule') }}>Reschedule</Button>
                    <Button variant="ghost" icon={CalendarX2} onClick={() => { setActionError(null); setReason(CANCEL_REASONS[0]); setSheet('cancel') }}>Cancel</Button>
                  </div>
                )}
                {!done && <p className="small muted"><ShieldCheck size={15} aria-hidden /> Warranty starts when the job is done</p>}
              </div>
              {done && (
                <div className="note-anchor">
                  <UXNote id="receipt" className="uxnote-corner" />
                  <Receipt booking={b} finding={finding} onPay={async () => {
                    const nb = await updateBooking(id, { paid: true, paidAt: new Date().toISOString() })
                    setState({ status: 'ok', b: nb })
                  }} />
                </div>
              )}
            </aside>
          </div>
        )}

        {!b.demo && (
          <div className="proto-strip">
            <p className="small"><strong>Prototype:</strong> move this visit along to see each state.</p>
            <div className="row-actions">
              <Button
                size="sm"
                variant="secondary"
                disabled={cancelled || done || (b.status === 'approval' && !b.extra)}
                onClick={() => save({ status: ORDER[ORDER.indexOf(b.status) + 1] }, 'step')}
                loading={busy === 'step'}
              >
                {b.status === 'approval' && !b.extra ? 'Answer the request first' : 'Next status'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => save({ status: 'scheduled', extra: null, paid: false, paidAt: null }, 'reset')} loading={busy === 'reset'}>Start over</Button>
            </div>
          </div>
        )}
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
          reason === 'Need a different day' ? (
            <div className="row-actions">
              <Button onClick={() => { setSlot(null); setActionError(null); setSheet('reschedule') }}>Pick a new window</Button>
              <Button variant="danger" loading={busy === 'cancel'} onClick={() => save({ status: 'cancelled', cancelReason: reason }, 'cancel')}>Cancel anyway</Button>
            </div>
          ) : (
            <div className="row-actions">
              <Button variant="danger" loading={busy === 'cancel'} onClick={() => save({ status: 'cancelled', cancelReason: reason }, 'cancel')}>Cancel visit</Button>
              <Button variant="ghost" onClick={() => setSheet(null)}>Keep it</Button>
            </div>
          )
        }
      >
        {actionError && <Alert tone="danger" title="That did not save">{actionError}</Alert>}
        <p className="muted">Free to cancel. Telling us why helps us fix things.</p>
        <fieldset className="stack-sm">
          <legend className="sr-only">Reason</legend>
          {CANCEL_REASONS.map((r) => <Choice key={r} name="reason" value={r} checked={reason === r} onChange={setReason} title={r} />)}
        </fieldset>
        {reason === 'Need a different day' && (
          <p className="small">Moving the visit is free and keeps your price. Pick a new window instead of cancelling.</p>
        )}
        {reason === 'Price is higher than expected' && (premium && standard ? (
          <Alert
            tone="info"
            title={`Standard parts bring it to ${money(standard.total)}`}
            action={
              <Button size="sm" variant="secondary" loading={busy === 'tier'} onClick={() => save({ tier: 'standard', total: standard.total, lines: { parts: standard.parts, labor: standard.labor, tax: standard.tax, total: standard.total } }, 'tier')}>
                Switch to standard parts
              </Button>
            }
          >
            That is {money(Math.round((linesOf(b).total - standard.total) * 100) / 100)} less. Ceramic pads, quiet and low dust.
          </Alert>
        ) : (
          <p className="small">Your price is fixed and nothing is charged until the job is done. Extra work only happens if you approve it.</p>
        ))}
      </Sheet>

      <WarrantyClaimSheet
        open={sheet === 'warranty'}
        onClose={() => setSheet(null)}
        booking={b}
        onSubmit={async (claim) => {
          const nb = await createWarrantyCheck(b, claim, brand)
          setSheet(null)
          nav(`/booking/${nb.id}`, { state: { justBooked: true } })
        }}
      />
    </section>
  )
}
