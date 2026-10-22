// Proposed components for the mobile-service use case: things a shop-based design system
// does not need (service area, arrival windows, a technician coming to you, approving extra
// work remotely). Built on the shared primitives, so they theme with the brand tokens.
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BadgeCheck, CalendarX2, Car, Check as CheckIcon, Clock, Download, MapPin, MapPinOff, Navigation, Pencil, Search, ShieldCheck, Wrench,
} from 'lucide-react'
import { Alert, Button, Choice, Empty, Field, Input, Loading, Sheet, Skeleton } from '../ui/index.jsx'
import { checkZip, findBooking, getAvailability, joinWaitlist } from '../data/api.js'
import { fmtDay, isoDay, nextDays, toDate, windowsFor } from '../data/schedule.js'
import { money, priceQuote, SERVICES, TIERS } from '../data/services.js'
import { BRAND_META } from '../brand/tokens.js'
import { SIZE_LABEL, vehicleLabel } from '../data/vehicles.js'
import { COMING } from '../data/areas.js'

/* VehicleChip: the vehicle being quoted, with a quick way to change it. */
export function VehicleChip({ vehicle, size, onEdit }) {
  return (
    <div className="vehicle-chip">
      <span className="vehicle-chip-icon" aria-hidden>
        <Car size={20} />
      </span>
      <span className="vehicle-chip-text">
        <strong>{vehicleLabel(vehicle)}</strong>
        {size && <span>{SIZE_LABEL[size]}</span>}
      </span>
      {onEdit && (
        <button type="button" className="link-btn" onClick={onEdit}>
          <Pencil size={14} aria-hidden /> Change
        </button>
      )}
    </div>
  )
}

/* WaitlistForm: one email field for out-of-area customers, with invalid, sending and sent states. */
export function WaitlistForm({ zip, sentText }) {
  const [email, setEmail] = useState('')
  const [wait, setWait] = useState('idle')
  async function join(e) {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setWait('invalid')
    setWait('sending')
    await joinWaitlist(email, zip)
    setWait('done')
  }
  if (wait === 'done') {
    return (
      <p className="area-result area-in" role="status">
        <CheckIcon size={18} aria-hidden /> {sentText || `We will email ${email} when we reach ${zip}.`}
      </p>
    )
  }
  return (
    <form className="inline-form" onSubmit={join} noValidate>
      <Field label="Email me when you get here" error={wait === 'invalid' ? 'Enter an email like name@example.com' : null}>
        {(a) => <Input {...a} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />}
      </Field>
      <Button type="submit" variant="secondary" loading={wait === 'sending'}>
        Notify me
      </Button>
    </form>
  )
}

/* OutOfArea: the "not here yet" state, shared by the ZIP check and the quote starters. */
export function OutOfArea({ zip, action }) {
  return (
    <div className="area-out">
      <p className="area-result">
        <MapPinOff size={18} aria-hidden /> Not in {zip} yet. Next up: {COMING.join(', ')}.
      </p>
      <WaitlistForm zip={zip} />
      {action}
    </div>
  )
}

/* ServiceAreaCheck: ZIP check with in-area, out-of-area (waitlist) and error states. */
export function ServiceAreaCheck({ initialZip = '', onResult, compact }) {
  const [zip, setZip] = useState(initialZip)
  const [state, setState] = useState({ status: 'idle' })

  async function run(e) {
    e?.preventDefault()
    if (!/^\d{5}$/.test(zip)) return setState({ status: 'invalid' })
    setState({ status: 'checking' })
    try {
      const metro = await checkZip(zip)
      setState(metro ? { status: 'in', metro } : { status: 'out' })
      onResult?.(zip, metro)
    } catch (err) {
      setState({ status: 'error', message: err.message })
    }
  }

  return (
    <div className={`area-check${compact ? ' area-check-compact' : ''}`}>
      <form className="inline-form" onSubmit={run} noValidate>
        <Field label="ZIP code" error={state.status === 'invalid' ? 'Enter a 5-digit ZIP code' : null}>
          {(a) => (
            <Input
              {...a}
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              value={zip}
              placeholder="78704"
              onChange={(e) => {
                setZip(e.target.value.replace(/\D/g, ''))
                if (state.status !== 'idle') setState({ status: 'idle' })
              }}
            />
          )}
        </Field>
        <Button type="submit" variant="secondary" loading={state.status === 'checking'}>
          Check
        </Button>
      </form>
      <div aria-live="polite">
        {state.status === 'in' && (
          <p className="area-result area-in">
            <BadgeCheck size={18} aria-hidden /> We come to {zip} in {state.metro.name}.
          </p>
        )}
        {state.status === 'error' && (
          <Alert tone="danger" title="Could not check that ZIP" action={<Button variant="ghost" size="sm" onClick={run}>Try again</Button>}>
            {state.message}
          </Alert>
        )}
        {state.status === 'out' && <OutOfArea zip={zip} />}
      </div>
    </div>
  )
}

/* ArrivalWindowPicker: day strip plus two-hour arrival windows, with loading, full-day,
   closed-day and error states. */
const hasFree = (d, metro) => windowsFor(d, metro).windows.some((w) => w.left > 0)

/* `urgent` opens on the first day with a free window and marks its earliest window "Soonest".
   The day strip is one tab stop: arrow keys, Home and End move between open days and select. */
export function ArrivalWindowPicker({ metro, value, onChange, urgent }) {
  const days = nextDays(14)
  const firstOpen = days.find((d) => d.getDay() !== 0)
  const soonestDay = days.find((d) => hasFree(d, metro))
  const soonest = soonestDay ? { day: isoDay(soonestDay), window: windowsFor(soonestDay, metro).windows.find((w) => w.left > 0).id } : null
  const [day, setDay] = useState(value?.day || (urgent && soonest ? soonest.day : isoDay(firstOpen)))
  const [res, setRes] = useState({ status: 'loading' })
  const [nonce, setNonce] = useState(0)
  const strip = useRef(null)

  useEffect(() => {
    let live = true
    setRes({ status: 'loading' })
    getAvailability(day, metro)
      .then((r) => live && setRes({ status: 'ok', ...r }))
      .catch((e) => live && setRes({ status: 'error', message: e.message }))
    return () => {
      live = false
    }
  }, [day, metro, nonce])

  useEffect(() => {
    strip.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [day])

  const openIds = days.filter((d) => d.getDay() !== 0).map(isoDay)
  function onStripKey(e) {
    const i = openIds.indexOf(day)
    const to = { ArrowRight: (i + 1) % openIds.length, ArrowLeft: (i - 1 + openIds.length) % openIds.length, Home: 0, End: openIds.length - 1 }[e.key]
    if (to === undefined) return
    e.preventDefault()
    setDay(openIds[to])
    requestAnimationFrame(() => strip.current?.querySelector(`[data-day="${openIds[to]}"]`)?.focus())
  }

  const nextOpenDay = () =>
    days.find((d) => isoDay(d) > day && windowsFor(d, metro).windows.some((w) => w.left > 0))

  const allFull = res.status === 'ok' && !res.closed && res.windows.every((w) => w.left === 0)

  return (
    <div className="awp">
      <div className="awp-days" ref={strip} role="group" aria-label="Choose a day" onKeyDown={onStripKey}>
        {days.map((d) => {
          const id = isoDay(d)
          const closed = d.getDay() === 0
          return (
            <button
              type="button"
              key={id}
              data-day={id}
              className={`awp-day${id === day ? ' is-on' : ''}${closed ? ' is-closed' : ''}`}
              aria-pressed={id === day}
              aria-disabled={closed || undefined}
              tabIndex={id === day ? 0 : -1}
              aria-label={closed ? `${d.toLocaleDateString('en-US', { weekday: 'short' })} ${d.getDate()}, closed` : fmtDay(d)}
              onClick={() => !closed && setDay(id)}
            >
              <span className="awp-dow">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="awp-date">{d.getDate()}</span>
              <span className="awp-mon">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
            </button>
          )
        })}
      </div>

      <div className="awp-slots" aria-live="polite">
        {res.status === 'loading' && (
          <Loading label="Loading arrival windows">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} h={60} r="var(--radius-md)" className="awp-skel" />
            ))}
          </Loading>
        )}
        {res.status === 'error' && (
          <Alert tone="danger" title="Arrival windows did not load" action={<Button variant="ghost" size="sm" onClick={() => setNonce((n) => n + 1)}>Try again</Button>}>
            Your quote is saved. Check your connection and try again.
          </Alert>
        )}
        {res.status === 'ok' && res.closed && (
          <Empty icon={CalendarX2} title="We do not work on Sundays" action={<Button variant="secondary" size="sm" onClick={() => setDay(isoDay(nextOpenDay()))}>Show the next open day</Button>}>
            Technicians are off so they can restock parts.
          </Empty>
        )}
        {allFull && (
          <Empty icon={CalendarX2} title={`${fmtDay(day, { weekday: 'long', month: 'short', day: 'numeric' })} is fully booked`} action={<Button variant="secondary" size="sm" onClick={() => setDay(isoDay(nextOpenDay()))}>Show the next open day</Button>}>
            Pick another day. Openings show up here when someone reschedules.
          </Empty>
        )}
        {res.status === 'ok' && !res.closed && !allFull && (
          <fieldset className="stack-sm">
            <legend className="sr-only">Arrival window on {fmtDay(day)}</legend>
            {res.windows.map((w) => (
              <Choice
                key={w.id}
                name="window"
                value={w.id}
                checked={value?.day === day && value?.window === w.id}
                disabled={w.left === 0}
                onChange={() => onChange({ day, window: w.id, label: w.label })}
                title={w.label}
                detail={w.left === 0 ? 'Full' : 'Technician arrives in this window. We text when they are 30 minutes out.'}
                aside={
                  urgent && soonest?.day === day && soonest.window === w.id
                    ? <span className="tag tag-success">Soonest</span>
                    : w.left > 0 && w.left < 2 ? <span className="tag tag-warning">Last spot</span> : null
                }
              />
            ))}
          </fieldset>
        )}
      </div>
    </div>
  )
}

/* QuoteBreakdown: itemised price with optional parts tier, loading and error states. */
export function QuoteBreakdown({ service, axle, quote, tier, onTier, status = 'ok', onRetry, error, holdLabel = 'Price held for 7 days from your quote' }) {
  const s = SERVICES[service]
  if (status === 'loading') {
    return (
      <Loading label="Building your quote">
        <div className="quote-card">
          <Skeleton w="45%" h={22} />
          <Skeleton h={64} r="var(--radius-md)" />
          <Skeleton h={64} r="var(--radius-md)" />
          <Skeleton w="70%" />
          <Skeleton w="60%" />
          <Skeleton w="40%" h={28} />
        </div>
      </Loading>
    )
  }
  if (status === 'error') {
    return (
      <Alert tone="danger" title="We could not price this right now" action={<Button variant="ghost" size="sm" onClick={onRetry}>Try again</Button>}>
        {error || 'Parts prices did not load.'} Nothing you entered is lost.
      </Alert>
    )
  }
  if (!quote) return null
  const q = quote[tier] || quote.standard
  const axleText = s.perAxle ? (axle === 'both' ? 'front and rear axles' : axle === 'rear' ? 'rear axle' : 'front axle') : 'all four wheels'
  return (
    <div className="quote-card">
      <div>
        <p className="quote-service">{s.name}</p>
        <p className="muted">{axleText}, {s.hours.toLowerCase()}</p>
      </div>
      {q.hasTiers && onTier && (
        <fieldset className="stack-sm">
          <legend className="field-label">Parts</legend>
          {Object.values(TIERS).map((t) => (
            <Choice
              key={t.id}
              name="tier"
              value={t.id}
              checked={tier === t.id}
              onChange={onTier}
              title={t.name}
              detail={t.detail}
              aside={<span className="num">{money(quote[t.id].total)}</span>}
            />
          ))}
        </fieldset>
      )}
      <dl className="lines">
        <div><dt>Parts</dt><dd className="num">{money(q.parts)}</dd></div>
        <div><dt>Labor</dt><dd className="num">{money(q.labor)}</dd></div>
        <div><dt>Coming to you</dt><dd>Included</dd></div>
        <div><dt>Sales tax on parts</dt><dd className="num">{money(q.tax)}</dd></div>
        <div className="lines-total"><dt>Total</dt><dd className="num">{money(q.total)}</dd></div>
      </dl>
      <ul className="assurances">
        <li><ShieldCheck size={17} aria-hidden /> {holdLabel}</li>
        <li><Wrench size={17} aria-hidden /> Extra work only with your OK in the app</li>
        <li><Clock size={17} aria-hidden /> Pay after the job is done</li>
      </ul>
    </div>
  )
}

const initials = (n) => n.split(' ').map((p) => p[0]).join('')

/* TechnicianCard: who is coming, with credentials and live arrival info. */
export function TechnicianCard({ tech, status, eta, window: win, livery }) {
  const line = {
    scheduled: `Arrives ${win}`,
    assigned: `Arrives ${win}`,
    en_route: `On the way, about ${eta} min`,
    working: 'Working on your car',
    approval: 'Waiting for your OK',
    done: 'Job finished',
  }[status]
  return (
    <div className="tech-card">
      <span className="avatar" aria-hidden>{initials(tech.name)}</span>
      <div className="tech-text">
        <p className="tech-name">{tech.name}</p>
        <p className="muted small">{tech.cert} · {tech.years} years on the team</p>
        <p className={`tech-status${status === 'en_route' ? ' is-live' : ''}`}>
          {status === 'en_route' ? <Navigation size={16} aria-hidden /> : <Clock size={16} aria-hidden />} {line}
        </p>
        {(status === 'en_route' || status === 'assigned') && <p className="muted small">Look for a {tech.van}{livery ? `, ${livery}` : ''}</p>}
      </div>
    </div>
  )
}

export const STATUS_STEPS = [
  { id: 'scheduled', label: 'Booked' },
  { id: 'assigned', label: 'Technician assigned' },
  { id: 'en_route', label: 'On the way' },
  { id: 'working', label: 'Working' },
  { id: 'done', label: 'Done' },
]

/* StatusTimeline: where the visit is, from booked to done. */
export function StatusTimeline({ status }) {
  const current = status === 'approval' ? 'working' : status
  const idx = STATUS_STEPS.findIndex((s) => s.id === current)
  return (
    <ol className="timeline" aria-label="Visit progress">
      {STATUS_STEPS.map((s, i) => (
        <li key={s.id} className={i < idx ? 'is-done' : i === idx ? 'is-now' : ''} aria-current={i === idx ? 'step' : undefined}>
          <span className="timeline-dot" aria-hidden>{i < idx && <CheckIcon size={12} strokeWidth={3} />}</span>
          <span className="timeline-label">{s.label}</span>
        </li>
      ))}
    </ol>
  )
}

/* ApprovalRequest: the technician found more work; the customer decides remotely with the
   measurement and the price in front of them. Nothing is added without an answer. */
export function ApprovalRequest({ finding, techName, onDecide, busy, decided }) {
  if (decided) {
    return (
      <Alert tone={decided === 'approved' ? 'success' : 'info'} title={decided === 'approved' ? `Approved. ${money(finding.price)} added` : 'Declined. Nothing added'}>
        {decided === 'approved' ? `${techName} is doing it now.` : `${techName} notes it in your report so you can book it later.`}
      </Alert>
    )
  }
  return (
    <section className="approval" aria-labelledby="approval-title">
      <p className="approval-from">{techName} needs your OK</p>
      <h3 id="approval-title" className="approval-title">{finding.title}</h3>
      <dl className="lines">
        <div><dt>Reading</dt><dd>{finding.reading}</dd></div>
        <div><dt>Why it matters</dt><dd>{finding.why}</dd></div>
        <div className="lines-total"><dt>Adds</dt><dd className="num">{money(finding.price)}</dd></div>
      </dl>
      <div className="row-actions">
        <Button onClick={() => onDecide('approved')} loading={busy === 'approved'} disabled={Boolean(busy)}>Approve {money(finding.price)}</Button>
        <Button variant="secondary" onClick={() => onDecide('declined')} loading={busy === 'declined'} disabled={Boolean(busy)}>Not now</Button>
      </div>
      <p className="muted small">Not now is always fine. The original quote stays the same.</p>
    </section>
  )
}

/* LocationSummary: the service spot, with access notes the technician needs. */
export function LocationSummary({ address, type, notes }) {
  return (
    <div className="loc-summary">
      <MapPin size={18} aria-hidden />
      <div>
        <p>{address}</p>
        <p className="muted small">{type}{notes ? `. ${notes}` : ''}</p>
      </div>
    </div>
  )
}

/* Receipt: the bill after the job, from the stored quote lines. Unpaid, paying, failed and paid. */
export const linesOf = (b) =>
  b.lines || priceQuote({ service: b.service, axle: b.axle, size: b.size || 'suv', tier: b.tier || 'standard' }) || { parts: 0, labor: 0, tax: 0, total: b.total }

export function Receipt({ booking: b, finding, onPay }) {
  const [state, setState] = useState({ status: 'idle' })
  const l = linesOf(b)
  const extra = b.extra === 'approved' ? finding.price : 0
  const free = SERVICES[b.service]?.free
  async function pay() {
    setState({ status: 'paying' })
    try {
      await onPay()
      setState({ status: 'idle' })
    } catch {
      setState({ status: 'error' })
    }
  }
  return (
    <div className="receipt stack-md">
      <div className="receipt-head">
        <h2 className="display-xs">Receipt</h2>
        {b.paid && <span className="tag tag-success">Paid, {fmtDay(b.paidAt, { month: 'short', day: 'numeric' })}</span>}
      </div>
      <dl className="lines">
        {free ? (
          <div><dt>{SERVICES[b.service].name}</dt><dd>Free under warranty</dd></div>
        ) : (
          <>
            <div><dt>Parts{SERVICES[b.service]?.premiumAdd > 0 && TIERS[b.tier] ? `, ${TIERS[b.tier].name.toLowerCase()}` : ''}</dt><dd className="num">{money(l.parts)}</dd></div>
            <div><dt>Labor</dt><dd className="num">{money(l.labor)}</dd></div>
            <div><dt>Coming to you</dt><dd>Included</dd></div>
            <div><dt>Sales tax on parts</dt><dd className="num">{money(l.tax)}</dd></div>
          </>
        )}
        {b.extra === 'approved' && <div><dt>Approved on site: {finding.title.toLowerCase()}</dt><dd className="num">{money(extra)}</dd></div>}
        {b.extra === 'declined' && <div><dt>Declined on site, not charged</dt><dd className="num">{money(0)}</dd></div>}
        <div className="lines-total"><dt>{b.paid ? 'Total paid' : 'Total due'}</dt><dd className="num">{money(l.total + extra)}</dd></div>
      </dl>
      {state.status === 'error' && (
        <Alert tone="danger" title="Payment did not go through. Nothing was charged." action={<Button size="sm" variant="ghost" onClick={pay}>Try again</Button>} />
      )}
      {!b.paid && l.total + extra > 0 && (
        <Button block onClick={pay} loading={state.status === 'paying'}>{state.status === 'paying' ? 'Paying' : `Pay ${money(l.total + extra)} now`}</Button>
      )}
      {b.paid && <Button variant="ghost" icon={Download} onClick={() => window.print()}>Download receipt</Button>}
      <p className="small muted">Shows on your statement as {BRAND_META[b.brand || 'nubrakes'].statementName}.</p>
    </div>
  )
}

/* WarrantyCard: what is covered and until when, including visits made under the other brand.
   status: active, expiring (under 60 days left), expired. */
export const warrantyStatus = (end, now = new Date()) => {
  const left = (toDate(end) - now) / 86400000
  return left < 0 ? 'expired' : left < 60 ? 'expiring' : 'active'
}
const longDay = (d) => fmtDay(d, { month: 'long', day: 'numeric', year: 'numeric' })

export function WarrantyCard({ originBrand, currentBrand, service, axle, endDate, status, onReport }) {
  const s = SERVICES[service]
  const side = s?.perAxle ? (axle === 'both' ? 'Front and rear ' : axle === 'rear' ? 'Rear ' : 'Front ') : ''
  const what = `${side}${s?.warrantyParts || s?.name.toLowerCase()}`
  const covered = what.charAt(0).toUpperCase() + what.slice(1)
  return (
    <div className={`warranty warranty-${status}`}>
      <ShieldCheck size={22} aria-hidden className="warranty-icon" />
      <div className="stack-sm warranty-body">
        <div className="receipt-head">
          <p className="warranty-title">{status === 'expired' ? `Warranty ended ${longDay(endDate)}` : `Covered until ${longDay(endDate)}`}</p>
          {status === 'expiring' && <span className="tag tag-warning">Ends soon</span>}
          {status === 'expired' && <span className="tag">Ended</span>}
        </div>
        <p className="muted">{covered}, parts and labor.</p>
        {originBrand && currentBrand && originBrand !== currentBrand && (
          <p className="small">Issued by {BRAND_META[originBrand].name}. Honored by {BRAND_META[currentBrand].fullName}.</p>
        )}
        {status !== 'expired' && onReport && (
          <div><Button size="sm" variant="secondary" onClick={onReport}>Something feels wrong</Button></div>
        )}
      </div>
    </div>
  )
}

const WARRANTY_SYMPTOMS = [
  { id: 'noise', label: 'A noise when braking' },
  { id: 'vibration', label: 'Shaking or vibration' },
  { id: 'soft', label: 'Soft or spongy pedal' },
]

/* WarrantyClaimSheet: what feels wrong and when to come. Books a free warranty check. */
export function WarrantyClaimSheet({ open, onClose, booking, onSubmit }) {
  const [symptom, setSymptom] = useState(null)
  const [slot, setSlot] = useState(null)
  const [state, setState] = useState({ status: 'idle' })
  async function send() {
    if (!symptom || !slot) return setState({ status: 'invalid' })
    setState({ status: 'sending' })
    try {
      await onSubmit({ symptom, slot })
    } catch (e) {
      setState({ status: 'error', message: e.message })
    }
  }
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Book a free warranty check"
      footer={<Button block loading={state.status === 'sending'} onClick={send}>{slot ? `Book for ${fmtDay(slot.day, { weekday: 'short', month: 'short', day: 'numeric' })}, ${slot.label}` : 'Book the check'}</Button>}
    >
      {state.status === 'error' && <Alert tone="danger" title="That did not go through">{state.message} Nothing was booked.</Alert>}
      <fieldset className="stack-sm">
        <legend className="field-label">What do you notice?</legend>
        {state.status === 'invalid' && !symptom && <p className="field-error" role="alert">Pick what you notice</p>}
        {WARRANTY_SYMPTOMS.map((x) => <Choice key={x.id} name="wsym" value={x.id} checked={symptom === x.id} onChange={setSymptom} title={x.label} />)}
      </fieldset>
      <div className="stack-sm">
        <p className="field-label">When should we come?</p>
        {state.status === 'invalid' && !slot && <p className="field-error" role="alert">Pick an arrival window</p>}
        {booking && <ArrivalWindowPicker metro={booking.metro} value={slot} onChange={setSlot} />}
      </div>
      <p className="small muted">Free under your warranty. Same car and address as the original visit.</p>
    </Sheet>
  )
}

/* FindBooking: booking number plus the phone's last 4 digits. Old NB- numbers still work. */
export function FindBooking({ compact }) {
  const nav = useNavigate()
  const [id, setId] = useState('')
  const [last4, setLast4] = useState('')
  const [state, setState] = useState({ status: 'idle' })
  async function go(e) {
    e.preventDefault()
    const err = {}
    if (id.trim().length < 4) err.id = 'Enter your booking number'
    if (!/^\d{4}$/.test(last4)) err.last4 = 'Enter the last 4 digits'
    if (Object.keys(err).length) return setState({ status: 'invalid', err })
    setState({ status: 'loading' })
    try {
      const b = await findBooking(id, last4)
      nav(`/booking/${b.id}`)
    } catch (ex) {
      setState({ status: ex.code === 'not_found' ? 'missing' : 'error', message: ex.message })
    }
  }
  const err = state.err || {}
  return (
    <form className={`find-booking stack-sm${compact ? ' find-compact' : ''}`} onSubmit={go} noValidate aria-label="Find a booking">
      <div className="find-grid">
        <Field label="Booking number" error={err.id} hint={err.id ? null : 'Starts with NB- or VMB-. Your old NuBrakes number works.'}>
          {(a) => <Input {...a} autoCapitalize="characters" spellCheck={false} value={id} onChange={(e) => setId(e.target.value.toUpperCase())} placeholder="NB-41873" />}
        </Field>
        <Field label="Last 4 of your phone" error={err.last4}>
          {(a) => <Input {...a} inputMode="numeric" maxLength={4} value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))} />}
        </Field>
      </div>
      <div aria-live="polite">
        {state.status === 'missing' && <Alert tone="warning" title="No visit matches that number and phone">Check the number on your confirmation text or email.</Alert>}
        {state.status === 'error' && <Alert tone="danger" title="We could not look that up" action={<Button size="sm" variant="ghost" onClick={go}>Try again</Button>}>{state.message}</Alert>}
      </div>
      <div><Button type="submit" variant="secondary" icon={Search} loading={state.status === 'loading'}>Find my booking</Button></div>
    </form>
  )
}
