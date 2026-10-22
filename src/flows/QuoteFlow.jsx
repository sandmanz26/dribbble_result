// Quote and booking flow. Order follows the path-to-purchase findings (docs/strategy.md):
// price before contact details, location problems caught before scheduling, and no
// payment step because customers pay after the job.
import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronDown, KeyRound, MapPinOff, UserRound, X, XCircle } from 'lucide-react'
import { useBrand } from '../brand/BrandContext.jsx'
import { checkZip, createBooking, getQuote, lookupPlate } from '../data/api.js'
import { LOCATION_TYPES, suggestAddresses } from '../data/areas.js'
import { fmtDay } from '../data/schedule.js'
import { AXLES, money, recommend, SERVICE_ORDER, SERVICES, SYMPTOMS, TIERS } from '../data/services.js'
import { sizeOf, vehicleLabel } from '../data/vehicles.js'
import { ArrivalWindowPicker, QuoteBreakdown, VehicleChip, WaitlistForm } from '../service/index.jsx'
import { Alert, Button, Check, Choice, Empty, Field, Input, Loading, Segmented, Skeleton, Wordmark } from '../ui/index.jsx'
import { currentTotal, holdText, invalidateQuote, useDraft } from './draft.jsx'
import { UXNote } from '../ui/UXNote.jsx'
import { VehicleInputs } from './QuoteStarter.jsx'
import { ProtoTrigger } from '../pages/PrototypePanel.jsx'

const STEPS = [
  { id: 'vehicle', label: 'Vehicle', title: 'Which car needs brakes?', notes: ['mobile-summary'], ready: () => true },
  { id: 'issue', label: 'Brakes', title: 'What is going on?', notes: ['symptoms'], ready: (d) => Boolean(d.vehicle) },
  { id: 'location', label: 'Location', title: 'Where will the car be?', notes: ['location'], ready: (d) => Boolean(d.vehicle && d.service) },
  { id: 'price', label: 'Price', title: 'Your price', notes: ['breakdown', 'price-change'], ready: (d) => Boolean(d.vehicle && d.service && (d.noBooking || (d.metro && d.address))) },
  { id: 'time', label: 'Time', title: 'When should we come?', notes: ['windows', 'presence'], ready: (d) => Boolean(d.vehicle && d.service && d.metro && d.address && d.quote) },
  { id: 'details', label: 'Book', title: 'Check and book', notes: ['contact-last'], ready: (d) => Boolean(d.vehicle && d.service && d.metro && d.address && d.quote && d.slot) },
]
const STEP = Object.fromEntries(STEPS.map((s) => [s.id, s]))
// Out-of-area customers still get a price; their flow ends there with a waitlist.
const stepsFor = (d) => (d.noBooking ? STEPS.filter((s) => ['vehicle', 'issue', 'price'].includes(s.id)) : STEPS)

const SPOT_TYPES = ['apartment', 'work', 'street']

// Step-level errors carry tabIndex -1 so they can take focus; field errors focus their input.
const focusFirstError = () =>
  requestAnimationFrame(() => {
    const el = document.querySelector(
      '.flow-main .field-error[tabindex], .flow-main :is(input,select,textarea)[aria-invalid="true"], .flow-main .alert-danger',
    )
    if (!el) return
    el.focus({ preventScroll: true })
    el.scrollIntoView({ block: 'center' })
  })

function StepError({ id, children }) {
  return (
    <p id={id} className="field-error" role="alert" tabIndex={-1}>
      <XCircle size={15} aria-hidden /> {children}
    </p>
  )
}

const CHANGE_TEXT = {
  vehicle: 'You changed the vehicle.',
  service: 'You changed the service.',
  'axle-rear': 'You added the rear axle.',
  'axle-front': 'You added the front axle.',
  axle: 'You changed the axle.',
  refreshed: 'The 7-day hold ran out, so we checked parts prices again.',
}
const axleReason = (from, to) => (to === 'both' ? (from === 'rear' ? 'axle-front' : 'axle-rear') : 'axle')

function axleText(d) {
  const s = SERVICES[d.service]
  if (!s?.perAxle) return 'All four wheels'
  return { front: 'Front axle', rear: 'Rear axle', both: 'Front and rear', unsure: 'Front axle, to confirm' }[d.axle]
}

/* ---------- Step 1: vehicle ---------- */
function VehicleStep({ next }) {
  const { draft, update } = useDraft()
  const [editing, setEditing] = useState(!draft.vehicle)
  const [entry, setEntry] = useState(draft.entry)
  const [v, setV] = useState({
    plate: draft.plate, plateState: draft.plateState,
    year: draft.vehicle?.year || null, make: draft.vehicle?.make || null, model: draft.vehicle?.model || null,
  })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [lookup, setLookup] = useState(null)

  async function go() {
    if (!editing) return next()
    const err = {}
    if (entry === 'plate' && v.plate.trim().length < 2) err.plate = 'Enter your plate'
    if (entry === 'ymm') {
      if (!v.year) err.year = 'Pick a year'
      if (!v.make) err.make = 'Pick a make'
      if (!v.model) err.model = 'Pick a model'
    }
    setErrors(err)
    setLookup(null)
    if (Object.keys(err).length) return focusFirstError()
    let vehicle = { year: v.year, make: v.make, model: v.model }
    if (entry === 'plate') {
      setBusy(true)
      try {
        vehicle = await lookupPlate(v.plateState, v.plate)
      } catch (ex) {
        setBusy(false)
        setLookup(ex.code)
        return focusFirstError()
      }
      setBusy(false)
    }
    const changed = vehicleLabel(vehicle) !== vehicleLabel(draft.vehicle)
    update((d) => ({ vehicle, entry, plate: v.plate, plateState: v.plateState, ...(changed ? invalidateQuote(d, 'vehicle') : {}) }))
    next()
  }

  return (
    <>
      {!editing ? (
        <VehicleChip vehicle={draft.vehicle} size={sizeOf(draft.vehicle)} onEdit={() => setEditing(true)} />
      ) : (
        <div className="stack-md">
          <Segmented
            label="How to find your vehicle"
            value={entry}
            onChange={(x) => { setEntry(x); setErrors({}); setLookup(null) }}
            options={[{ value: 'plate', label: 'License plate' }, { value: 'ymm', label: 'Make and model' }]}
          />
          <VehicleInputs entry={entry} value={v} errors={errors} onChange={(p) => setV((x) => ({ ...x, ...p }))} />
          {lookup === 'not_found' && (
            <Alert tone="warning" title="We could not match that plate" action={<Button size="sm" variant="ghost" onClick={() => { setEntry('ymm'); setLookup(null) }}>Use year, make, model</Button>}>
              Check the state, or enter the vehicle yourself. New plates can take a few weeks to show up.
            </Alert>
          )}
          {lookup === 'network' && (
            <Alert tone="danger" title="Plate lookup is not responding" action={<Button size="sm" variant="ghost" onClick={go}>Try again</Button>}>
              You can also enter year, make and model.
            </Alert>
          )}
        </div>
      )}
      <FlowActions onNext={go} busy={busy} nextLabel={busy ? 'Finding your vehicle' : 'Continue'} />
    </>
  )
}

/* ---------- Step 2: symptoms or known service, axle ---------- */
function SymptomAdvice({ rec }) {
  // Urgent symptoms lead, with what to do until the visit. Other notes follow.
  const lead = rec.urgent ? rec.notes.find((n) => n.urgent) : null
  const rest = rec.notes.filter((n) => n !== lead)
  return (
    <Alert tone={rec.urgent ? 'warning' : 'info'} title={`We will quote ${SERVICES[rec.service].name.toLowerCase()}`}>
      <div className="stack-sm">
        {lead && <p><strong>{lead.note} Drive gently until it is fixed.</strong></p>}
        {rest.length === 1 && <p>{rest[0].note}</p>}
        {rest.length > 1 && <ul className="dash-list">{rest.map((n) => <li key={n.id}>{n.note}</li>)}</ul>}
        <p>The technician measures first and nothing changes without your OK.</p>
      </div>
    </Alert>
  )
}

function IssueStep({ next, back }) {
  const { draft, update } = useDraft()
  const [error, setError] = useState(null)
  const rec = recommend(draft.symptoms)
  const service = draft.mode === 'symptoms' ? rec?.service : draft.service
  const s = SERVICES[service]

  function go() {
    if (!service) {
      setError(draft.mode === 'symptoms' ? 'Pick at least one, or choose "No symptoms, just due"' : 'Pick a service')
      return focusFirstError()
    }
    if (service !== draft.service) update((d) => ({ service, ...invalidateQuote(d, 'service') }))
    next()
  }

  // "No symptoms, just due" cannot be combined with a symptom.
  const toggle = (id, on) =>
    update((d) => {
      let list = on ? [...d.symptoms, id] : d.symptoms.filter((y) => y !== id)
      if (on) list = id === 'due' ? ['due'] : list.filter((y) => y !== 'due')
      return { symptoms: list }
    })

  return (
    <>
      <Segmented
        label="How do you want to start?"
        value={draft.mode}
        onChange={(mode) => { update({ mode }); setError(null) }}
        options={[{ value: 'symptoms', label: 'What I am noticing' }, { value: 'known', label: 'I know what I need' }]}
      />
      {draft.mode === 'symptoms' ? (
        <fieldset className="stack-sm" aria-describedby={error ? 'issue-err' : undefined}>
          <legend className="field-label">Pick everything that applies</legend>
          {error && <StepError id="issue-err">{error}</StepError>}
          {SYMPTOMS.map((x) => (
            <Check key={x.id} checked={draft.symptoms.includes(x.id)} onChange={(on) => { setError(null); toggle(x.id, on) }}>
              {x.label}
            </Check>
          ))}
        </fieldset>
      ) : (
        <fieldset className="stack-sm" aria-describedby={error ? 'issue-err' : undefined}>
          <legend className="field-label">Service</legend>
          {error && <StepError id="issue-err">{error}</StepError>}
          {SERVICE_ORDER.map((id) => (
            <Choice
              key={id}
              name="service"
              value={id}
              checked={draft.service === id}
              onChange={(v) => { setError(null); update((d) => ({ service: v, ...(v !== d.service ? invalidateQuote(d, 'service') : {}) })) }}
              title={SERVICES[id].name}
              detail={SERVICES[id].blurb}
            />
          ))}
        </fieldset>
      )}

      {draft.mode === 'symptoms' && rec && <SymptomAdvice rec={rec} />}

      {s?.perAxle && (
        <fieldset className="stack-sm">
          <legend className="field-label">Which brakes?</legend>
          <div className="choice-grid">
            {AXLES.map((a) => (
              <Choice
                key={a.id}
                name="axle"
                value={a.id}
                checked={draft.axle === a.id}
                onChange={(axle) => update((d) => (axle === d.axle ? {} : { axle, ...invalidateQuote(d, axleReason(d.axle, axle)) }))}
                title={a.label}
                detail={a.hint}
              />
            ))}
          </div>
        </fieldset>
      )}
      <FlowActions onBack={back} onNext={go} />
    </>
  )
}

/* ---------- Step 3: ZIP, address, access ---------- */
function AddressInput({ value, onChange, metroId, error }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const list = open ? suggestAddresses(value, metroId) : []
  const pick = (a) => { onChange(a); setOpen(false); setActive(-1) }
  return (
    <Field label="Street address" error={error} hint="Start typing, for example 1407 Congress">
      {(a) => (
        <div className="combo">
          <Input
            {...a}
            role="combobox"
            aria-expanded={list.length > 0}
            aria-controls="addr-list"
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `addr-${active}` : undefined}
            autoComplete="street-address"
            value={value}
            onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(-1) }}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            onKeyDown={(e) => {
              if (!list.length) return
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, list.length - 1)) }
              if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)) }
              if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(list[active]) }
              if (e.key === 'Escape') setOpen(false)
            }}
          />
          {list.length > 0 && (
            <ul id="addr-list" role="listbox" className="combo-list">
              {list.map((x, i) => (
                <li key={x} id={`addr-${i}`} role="option" aria-selected={i === active} onMouseDown={(e) => { e.preventDefault(); pick(x) }}>
                  {x}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Field>
  )
}

// What the customer would pay, shown to out-of-area visitors next to the waitlist.
function IndicativePrice() {
  const { draft, update, size } = useDraft()
  const nav = useNavigate()
  const [res, setRes] = useState({ status: 'loading' })
  const [nonce, setNonce] = useState(0)
  useEffect(() => {
    let live = true
    setRes({ status: 'loading' })
    getQuote({ service: draft.service, axle: draft.axle, size })
      .then((q) => live && setRes({ status: 'ok', q }))
      .catch((e) => live && setRes({ status: 'error', message: e.message }))
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce])
  if (res.status === 'loading') return <Loading label="Loading your price"><Skeleton w="70%" h={22} /></Loading>
  if (res.status === 'error') {
    return (
      <Alert tone="danger" title="The price did not load" action={<Button size="sm" variant="ghost" onClick={() => setNonce((n) => n + 1)}>Try again</Button>}>
        {res.message}
      </Alert>
    )
  }
  return (
    <p className="indicative">
      {SERVICES[draft.service].name} for your {vehicleLabel(draft.vehicle)}: <strong className="num">{money(res.q.standard.total)}</strong> with standard parts.{' '}
      <button type="button" className="link-btn" onClick={() => { update({ noBooking: true }); nav('/quote/price') }}>See the breakdown</button>
    </p>
  )
}

function LocationStep({ next, back }) {
  const { draft, update } = useDraft()
  const [zipState, setZipState] = useState(draft.metro ? { status: 'in' } : { status: 'idle' })
  const [errors, setErrors] = useState({})
  // Only the latest ZIP check may write its result; a slow earlier answer is ignored.
  const req = useRef(0)
  // The metro the chosen arrival window belongs to. A different metro means a different team.
  const lastMetro = useRef(draft.metro)

  async function check(zip) {
    const id = ++req.current
    setZipState({ status: 'checking' })
    try {
      const metro = await checkZip(zip)
      if (id !== req.current) return
      const mid = metro?.id || null
      const prev = lastMetro.current
      update((d) => ({ metro: mid, ...(prev && mid !== prev && d.slot ? { slot: null, slotDropped: true } : {}) }))
      if (mid) lastMetro.current = mid
      setZipState({ status: metro ? 'in' : 'out', metro })
    } catch (e) {
      if (id !== req.current) return
      setZipState({ status: 'error', message: e.message })
    }
  }

  useEffect(() => {
    if (/^\d{5}$/.test(draft.zip) && !draft.metro) check(draft.zip)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const needsSpot = SPOT_TYPES.includes(draft.locationType)

  function go() {
    const err = {}
    if (!/^\d{5}$/.test(draft.zip)) err.zip = 'Enter a 5-digit ZIP code'
    else if (!draft.metro) err.zip = zipState.status === 'out' ? 'We do not cover this ZIP yet' : 'Check your ZIP first'
    if (draft.address.trim().length < 5) err.address = 'Enter the street address where the car will be'
    if (needsSpot && !draft.spotOk) err.spot = 'Pick one so the technician knows what to expect'
    setErrors(err)
    if (Object.keys(err).length) return focusFirstError()
    next()
  }

  const type = LOCATION_TYPES.find((t) => t.id === draft.locationType)
  const out = zipState.status === 'out'
  const pickSpot = (spotOk) => { update({ spotOk }); setErrors((x) => ({ ...x, spot: null })) }

  return (
    <>
      <div className="inline-form">
        <Field label="ZIP code" error={errors.zip}>
          {(a) => (
            <Input
              {...a}
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              value={draft.zip}
              onChange={(e) => {
                const zip = e.target.value.replace(/\D/g, '')
                // The price does not depend on the ZIP, so the quote stays.
                update({ zip, metro: null })
                setErrors((x) => ({ ...x, zip: null }))
                if (zip.length === 5) check(zip)
                else { req.current++; setZipState({ status: 'idle' }) }
              }}
            />
          )}
        </Field>
        <p className="zip-status" aria-live="polite">
          {zipState.status === 'checking' && <span className="muted">Checking…</span>}
          {zipState.status === 'in' && <span className="ok">We come here</span>}
        </p>
      </div>

      {zipState.status === 'error' && (
        <Alert tone="danger" title="Could not check that ZIP" action={<Button size="sm" variant="ghost" onClick={() => check(draft.zip)}>Try again</Button>}>
          {zipState.message}
        </Alert>
      )}

      {out ? (
        <Empty icon={MapPinOff} title={`We are not in ${draft.zip} yet`}>
          <IndicativePrice />
          <WaitlistForm zip={draft.zip} />
        </Empty>
      ) : (
        <>
          <AddressInput
            value={draft.address}
            metroId={draft.metro}
            error={errors.address}
            onChange={(address) => { update({ address }); setErrors((x) => ({ ...x, address: null })) }}
          />
          <fieldset className="stack-sm">
            <legend className="field-label">Where exactly?</legend>
            <div className="choice-grid">
              {LOCATION_TYPES.map((t) => (
                <Choice key={t.id} name="loc" value={t.id} checked={draft.locationType === t.id} onChange={(locationType) => update({ locationType })} title={t.label} />
              ))}
            </div>
          </fieldset>
          {type && (
            <Alert tone={needsSpot ? 'warning' : 'info'} title={type.hint}>
              {needsSpot
                ? 'If the spot does not work on the day, rescheduling is free.'
                : 'The technician needs a flat spot and room to open the doors. If the spot does not work on the day, rescheduling is free.'}
            </Alert>
          )}
          {needsSpot && (
            <fieldset className="stack-sm" aria-describedby={errors.spot ? 'spot-err' : undefined}>
              <legend className="field-label">Is there a flat spot with room to open all doors?</legend>
              {errors.spot && <StepError id="spot-err">{errors.spot}</StepError>}
              <div className="choice-grid">
                <Choice name="spot" value="yes" checked={draft.spotOk === 'yes'} onChange={pickSpot} title="Yes" />
                <Choice name="spot" value="unsure" checked={draft.spotOk === 'unsure'} onChange={pickSpot} title="Not sure" detail="The technician texts before arriving to check" />
              </div>
            </fieldset>
          )}
          <Field label="Anything the technician should know?" optional hint="Gate code, parking level, which car">
            {(a) => <textarea {...a} className="input textarea" rows={3} value={draft.accessNotes} onChange={(e) => update({ accessNotes: e.target.value })} />}
          </Field>
        </>
      )}
      <FlowActions onBack={back} onNext={go} disabled={out} />
    </>
  )
}

/* ---------- Step 4: price ---------- */
function PriceStep({ next, back }) {
  const { draft, update, size } = useDraft()
  const nav = useNavigate()
  const [state, setState] = useState(draft.quote ? { status: 'ok' } : { status: 'loading' })
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (draft.quote && nonce === 0) return
    let live = true
    setState({ status: 'loading' })
    getQuote({ service: draft.service, axle: draft.axle, size })
      .then((quote) => { if (live) { update({ quote, quotedAt: new Date().toISOString() }); setState({ status: 'ok' }) } })
      .catch((e) => live && setState({ status: 'error', message: e.message }))
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce])

  const total = currentTotal(draft)
  const change = state.status === 'ok' && draft.priceChange?.from != null && total != null && draft.priceChange.from !== total ? draft.priceChange : null

  return (
    <>
      <VehicleChip vehicle={draft.vehicle} size={size} />
      {change && (
        <Alert tone="info" title={`Price updated from ${money(change.from)} to ${money(total)}`}>
          {CHANGE_TEXT[change.reason]}
        </Alert>
      )}
      <QuoteBreakdown
        service={draft.service}
        axle={draft.axle}
        quote={draft.quote}
        tier={draft.tier}
        onTier={(tier) => update({ tier })}
        status={state.status}
        error={state.message}
        onRetry={() => setNonce((n) => n + 1)}
        holdLabel={holdText(draft)}
      />
      {draft.noBooking && state.status === 'ok' && (
        <div className="stack-sm note-anchor">
          <UXNote id="coverage-first" className="uxnote-corner" />
          <p>We will email you when we reach {draft.zip}. This price is what you would pay.</p>
          <WaitlistForm zip={draft.zip} />
          <button type="button" className="link-btn" onClick={() => { update({ noBooking: false }); nav('/quote/location') }}>
            Car parked somewhere else? Try another ZIP
          </button>
        </div>
      )}
      <FlowActions
        onBack={back}
        onNext={draft.noBooking ? null : () => { update({ priceChange: null }); next() }}
        disabled={state.status !== 'ok'}
        nextLabel="Pick a time"
      />
    </>
  )
}

/* ---------- Step 5: arrival window, presence and keys ---------- */
function TimeStep({ next, back }) {
  const { draft, update } = useDraft()
  const [errors, setErrors] = useState({})
  const urgent = draft.mode === 'symptoms' && Boolean(recommend(draft.symptoms)?.urgent)
  function go() {
    const err = {}
    if (!draft.slot) err.time = 'Pick an arrival window'
    if (draft.presence === 'keys' && draft.keysAt.trim().length < 3) err.keys = 'Tell us where the keys will be'
    setErrors(err)
    if (Object.keys(err).length) return focusFirstError()
    next()
  }
  return (
    <>
      {draft.slotDropped && (
        <Alert tone="warning" title="Your new address is served by a different team">
          Pick a window again. Everything else is kept.
        </Alert>
      )}
      {errors.time && <StepError id="time-err">{errors.time}</StepError>}
      <ArrivalWindowPicker
        metro={draft.metro}
        value={draft.slot}
        urgent={urgent}
        onChange={(slot) => { update({ slot, slotDropped: false }); setErrors((x) => ({ ...x, time: null })) }}
      />
      <fieldset className="stack-sm">
        <legend className="field-label">Will you be there?</legend>
        <div className="choice-grid">
          <Choice name="presence" value="present" checked={draft.presence === 'present'} onChange={(presence) => update({ presence })} title="I will be there" detail="The technician says hi and starts" aside={<UserRound size={20} aria-hidden />} />
          <Choice name="presence" value="keys" checked={draft.presence === 'keys'} onChange={(presence) => update({ presence })} title="I will leave the keys" detail="Tell us where, right below" aside={<KeyRound size={20} aria-hidden />} />
        </div>
        {draft.presence === 'keys' && (
          <Field label="Where will the keys be?" error={errors.keys}>
            {(a) => (
              <Input
                {...a}
                value={draft.keysAt}
                onChange={(e) => { update({ keysAt: e.target.value }); setErrors((x) => ({ ...x, keys: null })) }}
                placeholder="Lockbox by the side door, code sent by text"
              />
            )}
          </Field>
        )}
      </fieldset>
      <FlowActions onBack={back} onNext={go} />
    </>
  )
}

/* ---------- Step 6: review, contact and book ---------- */
function ChangeLink({ step, label, state }) {
  return (
    <Link to={`/quote/${step}`} state={state} className="link-btn change-link">
      Change<span className="sr-only"> {label}</span>
    </Link>
  )
}

const REVIEW = { returnTo: 'details' }

function DetailsStep({ back }) {
  const { draft, update, size } = useDraft()
  const nav = useNavigate()
  const { brand } = useBrand()
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState(null)
  const c = draft.contact
  const set = (patch) => update((d) => ({ contact: { ...d.contact, ...patch } }))
  const q = draft.quote[draft.tier] || draft.quote.standard

  async function book() {
    const err = {}
    if (c.name.trim().length < 2) err.name = 'Enter your name'
    if (c.phone.replace(/\D/g, '').length !== 10) err.phone = 'Enter a 10-digit mobile number'
    if (!/^\S+@\S+\.\S+$/.test(c.email)) err.email = 'Enter an email like name@example.com'
    setErrors(err)
    setFail(null)
    if (Object.keys(err).length) return focusFirstError()
    setBusy(true)
    try {
      const b = await createBooking({ ...draft, size }, brand)
      update({ slot: null, quote: null, quotedAt: null, priceChange: null, lastStep: 'vehicle' })
      nav(`/booking/${b.id}`, { state: { justBooked: true } })
    } catch (e) {
      setBusy(false)
      setFail(e)
      focusFirstError()
    }
  }

  const phoneFmt = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 10)
    if (d.length < 4) return d
    if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  }

  const rows = [
    ['Vehicle', vehicleLabel(draft.vehicle), 'vehicle', 'vehicle'],
    ['Service', `${SERVICES[draft.service].name}, ${axleText(draft).toLowerCase()}`, 'issue', 'service'],
    q.hasTiers && ['Parts', TIERS[draft.tier].name, 'price', 'parts'],
    ['When', `${fmtDay(draft.slot.day, { weekday: 'short', month: 'short', day: 'numeric' })}, ${draft.slot.label}`, 'time', 'arrival window'],
    ['Where', draft.address, 'location', 'address'],
  ].filter(Boolean)

  return (
    <>
      {fail && (
        <Alert
          tone="danger"
          title={fail.code === 'slot_taken' ? 'That arrival window just filled' : 'Booking did not go through'}
          action={fail.code === 'slot_taken'
            ? <Button size="sm" variant="ghost" onClick={() => { update({ slot: null }); nav('/quote/time', { state: REVIEW }) }}>Pick another window</Button>
            : <Button size="sm" variant="ghost" onClick={book}>Try again</Button>}
        >
          {fail.code === 'slot_taken' ? 'Someone booked it a moment ago. Your price and details are kept.' : 'Nothing was booked. Your details are kept.'}
        </Alert>
      )}
      <div className="review-box">
        <p className="field-label">You are booking</p>
        <dl className="lines lines-review">
          {rows.map(([k, v, step, label]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v} <ChangeLink step={step} label={label} state={REVIEW} /></dd>
            </div>
          ))}
          <div className="lines-total"><dt>Total, paid after the job</dt><dd className="num">{money(q.total)}</dd></div>
        </dl>
        {SPOT_TYPES.includes(draft.locationType) && draft.spotOk === 'unsure' && (
          <p className="small muted">The technician will text before arriving to confirm the spot.</p>
        )}
      </div>
      <div className="form-grid">
        <Field label="Full name" error={errors.name}>
          {(a) => <Input {...a} autoComplete="name" value={c.name} onChange={(e) => set({ name: e.target.value })} />}
        </Field>
        <Field label="Mobile number" error={errors.phone} hint="For arrival texts. No marketing calls.">
          {(a) => <Input {...a} type="tel" inputMode="tel" autoComplete="tel-national" value={c.phone} onChange={(e) => set({ phone: phoneFmt(e.target.value) })} />}
        </Field>
        <Field label="Email" error={errors.email} hint="Receipt and inspection report go here">
          {(a) => <Input {...a} type="email" autoComplete="email" value={c.email} onChange={(e) => set({ email: e.target.value })} />}
        </Field>
      </div>
      <Check checked={c.sms} onChange={(sms) => set({ sms })} detail="Technician assigned, 30 minutes out, approvals, done">
        Text me visit updates
      </Check>
      <FlowActions
        onBack={back}
        onNext={book}
        busy={busy}
        nextLabel={busy ? 'Booking' : `Book, ${money(q.total)}`}
        note="Nothing charged now. Pay after the job."
        final
      />
      <p className="small muted">Free to reschedule or cancel up to 2 hours before your window.</p>
    </>
  )
}

/* ---------- shell ---------- */
function FlowActions({ onBack, onNext, nextLabel = 'Continue', busy, disabled, final, note }) {
  return (
    <div className="flow-actions">
      {note && <p className="flow-note small muted">{note}</p>}
      {onBack ? <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>Back</Button> : <span />}
      {onNext && <Button onClick={onNext} loading={busy} disabled={disabled} iconEnd={final ? null : ArrowRight} size="lg">{nextLabel}</Button>}
    </div>
  )
}

function Summary({ draft, linkState }) {
  const q = draft.quote?.[draft.tier] || draft.quote?.standard
  const rows = [
    draft.vehicle && ['Vehicle', vehicleLabel(draft.vehicle), 'vehicle', 'vehicle'],
    draft.service && ['Service', `${SERVICES[draft.service].short}, ${axleText(draft).toLowerCase()}`, 'issue', 'service'],
    q?.hasTiers && ['Parts', TIERS[draft.tier].name, 'price', 'parts'],
    draft.address && draft.metro && !draft.noBooking && ['Location', draft.address, 'location', 'location'],
    draft.slot && !draft.noBooking && ['Arrival', `${fmtDay(draft.slot.day, { weekday: 'short', month: 'short', day: 'numeric' })}, ${draft.slot.label}`, 'time', 'arrival window'],
  ].filter(Boolean)
  return (
    <>
      {rows.length ? (
        <dl className="lines lines-review">
          {rows.map(([k, v, step, label]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v} <ChangeLink step={step} label={label} state={linkState} /></dd>
            </div>
          ))}
          {q && (
            <div className="lines-total">
              <dt>Total</dt>
              <dd className="num" aria-live="polite">{money(q.total)}</dd>
            </div>
          )}
        </dl>
      ) : (
        <p className="muted small">Your choices show up here as you go.</p>
      )}
      <p className="small muted">Pay after the job. {holdText(draft)}.</p>
    </>
  )
}

export default function QuoteFlow() {
  const { step = 'vehicle' } = useParams()
  const routeLoc = useLocation()
  const { draft, update } = useDraft()
  const { brand } = useBrand()
  const nav = useNavigate()
  const heading = useRef(null)
  const steps = stepsFor(draft)
  const idx = steps.findIndex((s) => s.id === step)

  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
    if (idx >= 0) update({ lastStep: step })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  if (idx < 0) return <Navigate to="/quote/vehicle" replace />
  // Deep links to a later step fall back to the first step that still needs input.
  const firstMissing = steps.findIndex((s, i) => i <= idx && !s.ready(draft))
  if (firstMissing !== -1) return <Navigate to={`/quote/${steps[firstMissing - 1]?.id || 'vehicle'}`} state={routeLoc.state} replace />

  const current = steps[idx]
  // "Change" links from the review carry returnTo. Continue goes straight back to the review; if the
  // edit dropped something the review needs (a new quote, say), the redirect above stops at that
  // step first and keeps returnTo, so the customer only redoes what changed.
  const returnTo = routeLoc.state?.returnTo
  const next = () => {
    if (returnTo && returnTo !== step && STEP[returnTo]) return nav(`/quote/${returnTo}`, { state: routeLoc.state })
    nav(`/quote/${steps[idx + 1].id}`, { state: routeLoc.state })
  }
  const back = idx > 0 ? () => nav(`/quote/${steps[idx - 1].id}`) : null
  const Body = { vehicle: VehicleStep, issue: IssueStep, location: LocationStep, price: PriceStep, time: TimeStep, details: DetailsStep }[step]
  const q = draft.quote?.[draft.tier] || draft.quote?.standard
  const linkState = step === 'details' ? REVIEW : undefined

  return (
    <div className="flow">
      <header className="flow-header">
        <div className="wrap header-row">
          <Link to="/" className="brand-link" aria-label="Home"><Wordmark brand={brand} compact /></Link>
          <p className="flow-count">Step {idx + 1} of {steps.length}</p>
          <Link to="/" state={{ saved: true }} className="text-link flow-exit"><X size={18} aria-hidden /> <span>Save and exit</span></Link>
          <ProtoTrigger />
        </div>
        <div className="flow-bar" aria-hidden><span style={{ width: `${((idx + 1) / steps.length) * 100}%` }} /></div>
      </header>

      <div className="wrap flow-grid">
        <nav className="flow-steps" aria-label="Quote steps">
          <ol>
            {steps.map((s, i) => (
              <li key={s.id} className={i < idx ? 'is-done' : i === idx ? 'is-now' : ''}>
                {i < idx ? <Link to={`/quote/${s.id}`}>{s.label}</Link> : <span aria-current={i === idx ? 'step' : undefined}>{s.label}</span>}
              </li>
            ))}
          </ol>
        </nav>

        <main className="flow-main" id="main">
          <details className="flow-summary-mobile">
            <summary>
              <span>Your quote</span>
              <span className="num" aria-live="polite">{q ? money(q.total) : vehicleLabel(draft.vehicle) || 'Not started'}</span>
              <ChevronDown size={18} aria-hidden />
            </summary>
            <Summary draft={draft} linkState={linkState} />
          </details>
          <h1 className="display-md flow-title" tabIndex={-1} ref={heading}>
            {current.title} {current.notes.map((n) => <UXNote key={n} id={n} />)}
          </h1>
          <div className="stack-md">
            <Body next={next} back={back} />
          </div>
        </main>

        <aside className="flow-summary" aria-label="Quote summary">
          <p className="field-label">Your quote</p>
          <Summary draft={draft} linkState={linkState} />
        </aside>
      </div>
    </div>
  )
}
