// Quote and booking flow. Order follows the path-to-purchase findings (docs/strategy.md):
// price before contact details, location problems caught before scheduling, and no
// payment step because customers pay after the job.
import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronDown, KeyRound, MapPinOff, UserRound, X } from 'lucide-react'
import { useBrand } from '../brand/BrandContext.jsx'
import { checkZip, createBooking, getQuote, joinWaitlist, lookupPlate } from '../data/api.js'
import { LOCATION_TYPES, suggestAddresses } from '../data/areas.js'
import { fmtDay } from '../data/schedule.js'
import { AXLES, money, recommend, SERVICE_ORDER, SERVICES, SYMPTOMS } from '../data/services.js'
import { sizeOf, vehicleLabel } from '../data/vehicles.js'
import { ArrivalWindowPicker, QuoteBreakdown, VehicleChip } from '../service/index.jsx'
import { Alert, Button, Check, Choice, Empty, Field, Input, Segmented, Wordmark } from '../ui/index.jsx'
import { useDraft } from './draft.jsx'
import { UXNote } from '../ui/UXNote.jsx'
import { VehicleInputs } from './QuoteStarter.jsx'

const STEPS = [
  { id: 'vehicle', label: 'Vehicle', title: 'Which car needs brakes?', notes: ['mobile-summary'], ready: () => true },
  { id: 'issue', label: 'Brakes', title: 'What is going on?', notes: ['symptoms'], ready: (d) => Boolean(d.vehicle) },
  { id: 'location', label: 'Location', title: 'Where will the car be?', notes: ['location'], ready: (d) => Boolean(d.vehicle && d.service) },
  { id: 'price', label: 'Price', title: 'Your price', notes: ['breakdown'], ready: (d) => Boolean(d.vehicle && d.service && d.metro && d.address) },
  { id: 'time', label: 'Time', title: 'When should we come?', notes: ['windows', 'presence'], ready: (d) => Boolean(d.vehicle && d.service && d.metro && d.address && d.quote) },
  { id: 'details', label: 'Book', title: 'Who should we contact?', notes: ['contact-last'], ready: (d) => Boolean(d.vehicle && d.service && d.metro && d.address && d.quote && d.slot) },
]

const focusFirstError = () =>
  requestAnimationFrame(() => document.querySelector('.flow-main [aria-invalid="true"], .flow-main .alert-danger')?.focus?.())

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
    update({ vehicle, entry, plate: v.plate, plateState: v.plateState, ...(changed ? { quote: null } : {}) })
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
    if (service !== draft.service) update({ service, quote: null })
    next()
  }

  return (
    <>
      <Segmented
        label="How do you want to start?"
        value={draft.mode}
        onChange={(mode) => { update({ mode }); setError(null) }}
        options={[{ value: 'symptoms', label: 'What I am noticing' }, { value: 'known', label: 'I know what I need' }]}
      />
      {draft.mode === 'symptoms' ? (
        <fieldset className="stack-sm" aria-invalid={error ? true : undefined} aria-describedby={error ? 'issue-err' : undefined}>
          <legend className="field-label">Pick everything that applies</legend>
          {SYMPTOMS.map((x) => (
            <Check
              key={x.id}
              checked={draft.symptoms.includes(x.id)}
              onChange={(on) => {
                setError(null)
                update((d) => ({ symptoms: on ? [...d.symptoms, x.id] : d.symptoms.filter((y) => y !== x.id) }))
              }}
            >
              {x.label}
            </Check>
          ))}
        </fieldset>
      ) : (
        <fieldset className="stack-sm" aria-invalid={error ? true : undefined} aria-describedby={error ? 'issue-err' : undefined}>
          <legend className="field-label">Service</legend>
          {SERVICE_ORDER.map((id) => (
            <Choice
              key={id}
              name="service"
              value={id}
              checked={draft.service === id}
              onChange={(v) => { setError(null); update({ service: v, quote: null }) }}
              title={SERVICES[id].name}
              detail={SERVICES[id].blurb}
            />
          ))}
        </fieldset>
      )}
      {error && <p id="issue-err" className="field-error" role="alert">{error}</p>}

      {draft.mode === 'symptoms' && rec && (
        <Alert tone={rec.urgent ? 'warning' : 'info'} title={`We will quote ${SERVICES[rec.service].name.toLowerCase()}`}>
          {rec.notes[rec.notes.length - 1].note} The technician measures first and nothing changes without your OK.
        </Alert>
      )}

      {s?.perAxle && (
        <fieldset className="stack-sm">
          <legend className="field-label">Which brakes?</legend>
          <div className="choice-grid">
            {AXLES.map((a) => (
              <Choice key={a.id} name="axle" value={a.id} checked={draft.axle === a.id} onChange={(axle) => update({ axle, quote: null })} title={a.label} detail={a.hint} />
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

function LocationStep({ next, back }) {
  const { draft, update } = useDraft()
  const [zipState, setZipState] = useState(draft.metro ? { status: 'in' } : { status: 'idle' })
  const [errors, setErrors] = useState({})
  const [email, setEmail] = useState('')
  const [wait, setWait] = useState('idle')

  async function check(zip) {
    setZipState({ status: 'checking' })
    try {
      const metro = await checkZip(zip)
      update({ metro: metro?.id || null })
      setZipState({ status: metro ? 'in' : 'out', metro })
    } catch (e) {
      setZipState({ status: 'error', message: e.message })
    }
  }

  useEffect(() => {
    if (/^\d{5}$/.test(draft.zip) && !draft.metro) check(draft.zip)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function go() {
    const err = {}
    if (!/^\d{5}$/.test(draft.zip)) err.zip = 'Enter a 5-digit ZIP code'
    else if (!draft.metro) err.zip = zipState.status === 'out' ? 'We do not cover this ZIP yet' : 'Check your ZIP first'
    if (draft.address.trim().length < 5) err.address = 'Enter the street address where the car will be'
    setErrors(err)
    if (Object.keys(err).length) return focusFirstError()
    next()
  }

  const type = LOCATION_TYPES.find((t) => t.id === draft.locationType)
  const out = zipState.status === 'out'

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
                update({ zip, metro: null, quote: null })
                setErrors((x) => ({ ...x, zip: null }))
                if (zip.length === 5) check(zip)
                else setZipState({ status: 'idle' })
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
          {wait === 'done' ? (
            <p>Thanks. We will email {email} when we start in your area. Your quote details are saved.</p>
          ) : (
            <form
              className="inline-form"
              noValidate
              onSubmit={async (e) => {
                e.preventDefault()
                if (!/^\S+@\S+\.\S+$/.test(email)) return setWait('invalid')
                setWait('sending')
                await joinWaitlist(email, draft.zip)
                setWait('done')
              }}
            >
              <Field label="Email me when you get here" error={wait === 'invalid' ? 'Enter an email like name@example.com' : null}>
                {(a) => <Input {...a} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />}
              </Field>
              <Button type="submit" variant="secondary" loading={wait === 'sending'}>Notify me</Button>
            </form>
          )}
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
            <Alert tone={['apartment', 'work', 'street'].includes(type.id) ? 'warning' : 'info'} title={type.hint}>
              The technician needs a flat spot and room to open the doors. If the spot does not work on the day, rescheduling is free.
            </Alert>
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
  const [state, setState] = useState(draft.quote ? { status: 'ok' } : { status: 'loading' })
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (draft.quote && nonce === 0) return
    let live = true
    setState({ status: 'loading' })
    getQuote({ service: draft.service, axle: draft.axle, size })
      .then((quote) => { if (live) { update({ quote }); setState({ status: 'ok' }) } })
      .catch((e) => live && setState({ status: 'error', message: e.message }))
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce])

  return (
    <>
      <VehicleChip vehicle={draft.vehicle} size={size} />
      <QuoteBreakdown
        service={draft.service}
        axle={draft.axle}
        quote={draft.quote}
        tier={draft.tier}
        onTier={(tier) => update({ tier })}
        status={state.status}
        error={state.message}
        onRetry={() => setNonce((n) => n + 1)}
      />
      <FlowActions onBack={back} onNext={next} disabled={state.status !== 'ok'} nextLabel="Pick a time" />
    </>
  )
}

/* ---------- Step 5: arrival window and presence ---------- */
function TimeStep({ next, back }) {
  const { draft, update } = useDraft()
  const [error, setError] = useState(null)
  function go() {
    if (!draft.slot) {
      setError('Pick an arrival window')
      return focusFirstError()
    }
    next()
  }
  return (
    <>
      <ArrivalWindowPicker metro={draft.metro} value={draft.slot} onChange={(slot) => { update({ slot }); setError(null) }} />
      {error && <p className="field-error" role="alert" tabIndex={-1}>{error}</p>}
      <fieldset className="stack-sm">
        <legend className="field-label">Will you be there?</legend>
        <div className="choice-grid">
          <Choice name="presence" value="present" checked={draft.presence === 'present'} onChange={(presence) => update({ presence })} title="I will be there" detail="The technician says hi and starts" aside={<UserRound size={20} aria-hidden />} />
          <Choice name="presence" value="keys" checked={draft.presence === 'keys'} onChange={(presence) => update({ presence })} title="I will leave the keys" detail="Tell us where in the next step" aside={<KeyRound size={20} aria-hidden />} />
        </div>
      </fieldset>
      <FlowActions onBack={back} onNext={go} />
    </>
  )
}

/* ---------- Step 6: contact and book ---------- */
function DetailsStep({ back }) {
  const { draft, update, size } = useDraft()
  const nav = useNavigate()
  const { brand } = useBrand()
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState(null)
  const c = draft.contact
  const set = (patch) => update((d) => ({ contact: { ...d.contact, ...patch } }))

  async function book() {
    const err = {}
    if (c.name.trim().length < 2) err.name = 'Enter your name'
    if (c.phone.replace(/\D/g, '').length !== 10) err.phone = 'Enter a 10-digit mobile number'
    if (!/^\S+@\S+\.\S+$/.test(c.email)) err.email = 'Enter an email like name@example.com'
    if (draft.presence === 'keys' && (draft.keysNote || '').trim().length < 3) err.keys = 'Tell the technician where the keys will be'
    setErrors(err)
    setFail(null)
    if (Object.keys(err).length) return focusFirstError()
    setBusy(true)
    try {
      const b = await createBooking({
        brand, vehicle: draft.vehicle, size, service: draft.service, axle: draft.axle, tier: draft.tier,
        total: draft.quote[draft.tier]?.total ?? draft.quote.standard.total, metro: draft.metro, zip: draft.zip,
        address: draft.address, locationType: draft.locationType, accessNotes: draft.accessNotes,
        slot: draft.slot, presence: draft.presence, keysNote: draft.keysNote || '', contact: draft.contact,
      })
      update({ slot: null, quote: null })
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

  return (
    <>
      {fail && (
        <Alert
          tone="danger"
          title={fail.code === 'slot_taken' ? 'That arrival window just filled' : 'Booking did not go through'}
          action={fail.code === 'slot_taken'
            ? <Button size="sm" variant="ghost" onClick={() => { update({ slot: null }); nav('/quote/time') }}>Pick another window</Button>
            : <Button size="sm" variant="ghost" onClick={book}>Try again</Button>}
        >
          {fail.code === 'slot_taken' ? 'Someone booked it a moment ago. Your price and details are kept.' : 'Nothing was booked. Your details are kept.'}
        </Alert>
      )}
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
        {draft.presence === 'keys' && (
          <Field label="Where will the keys be?" error={errors.keys}>
            {(a) => <Input {...a} value={draft.keysNote || ''} onChange={(e) => update({ keysNote: e.target.value })} placeholder="Lockbox by the side door, code sent by text" />}
          </Field>
        )}
      </div>
      <Check checked={c.sms} onChange={(sms) => set({ sms })} detail="Technician assigned, 30 minutes out, approvals, done">
        Text me visit updates
      </Check>
      <div className="review-box">
        <p className="field-label">You are booking</p>
        <dl className="lines">
          <div><dt>Service</dt><dd>{SERVICES[draft.service].name}, {axleText(draft).toLowerCase()}</dd></div>
          <div><dt>When</dt><dd>{fmtDay(draft.slot.day, { weekday: 'short', month: 'short', day: 'numeric' })}, {draft.slot.label}</dd></div>
          <div><dt>Where</dt><dd>{draft.address}</dd></div>
          <div className="lines-total"><dt>Total, paid after the job</dt><dd className="num">{money(draft.quote[draft.tier]?.total ?? draft.quote.standard.total)}</dd></div>
        </dl>
      </div>
      <FlowActions onBack={back} onNext={book} busy={busy} nextLabel={busy ? 'Booking' : 'Book appointment'} final />
      <p className="small muted">Nothing is charged now. Free to reschedule or cancel up to 2 hours before your window.</p>
    </>
  )
}

/* ---------- shell ---------- */
function FlowActions({ onBack, onNext, nextLabel = 'Continue', busy, disabled, final }) {
  return (
    <div className="flow-actions">
      {onBack ? <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>Back</Button> : <span />}
      <Button onClick={onNext} loading={busy} disabled={disabled} iconEnd={final ? null : ArrowRight} size="lg">{nextLabel}</Button>
    </div>
  )
}

function Summary({ draft }) {
  const q = draft.quote?.[draft.tier] || draft.quote?.standard
  const rows = [
    draft.vehicle && ['Vehicle', vehicleLabel(draft.vehicle)],
    draft.service && ['Service', `${SERVICES[draft.service].short}, ${axleText(draft).toLowerCase()}`],
    draft.address && draft.metro && ['Location', draft.address],
    draft.slot && ['Arrival', `${fmtDay(draft.slot.day, { weekday: 'short', month: 'short', day: 'numeric' })}, ${draft.slot.label}`],
  ].filter(Boolean)
  return (
    <>
      {rows.length ? (
        <dl className="lines">
          {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          {q && <div className="lines-total"><dt>Total</dt><dd className="num">{money(q.total)}</dd></div>}
        </dl>
      ) : (
        <p className="muted small">Your choices show up here as you go.</p>
      )}
      <p className="small muted">Pay after the job. Price holds for 7 days.</p>
    </>
  )
}

export default function QuoteFlow() {
  const { step = 'vehicle' } = useParams()
  const { draft } = useDraft()
  const { brand } = useBrand()
  const nav = useNavigate()
  const heading = useRef(null)
  const idx = STEPS.findIndex((s) => s.id === step)

  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }, [step])

  if (idx < 0) return <Navigate to="/quote/vehicle" replace />
  // Deep links to a later step fall back to the first step that still needs input.
  const firstMissing = STEPS.findIndex((s, i) => i <= idx && !s.ready(draft))
  if (firstMissing !== -1) return <Navigate to={`/quote/${STEPS[firstMissing - 1]?.id || 'vehicle'}`} replace />

  const current = STEPS[idx]
  const next = () => nav(`/quote/${STEPS[idx + 1].id}`)
  const back = idx > 0 ? () => nav(`/quote/${STEPS[idx - 1].id}`) : null
  const Body = { vehicle: VehicleStep, issue: IssueStep, location: LocationStep, price: PriceStep, time: TimeStep, details: DetailsStep }[step]
  const q = draft.quote?.[draft.tier] || draft.quote?.standard

  return (
    <div className="flow">
      <header className="flow-header">
        <div className="wrap header-row">
          <Link to="/" className="brand-link" aria-label="Home"><Wordmark brand={brand} compact /></Link>
          <p className="flow-count">Step {idx + 1} of {STEPS.length}</p>
          <Link to="/" className="text-link flow-exit"><X size={18} aria-hidden /> <span>Save and exit</span></Link>
        </div>
        <div className="flow-bar" aria-hidden><span style={{ width: `${((idx + 1) / STEPS.length) * 100}%` }} /></div>
      </header>

      <div className="wrap flow-grid">
        <nav className="flow-steps" aria-label="Quote steps">
          <ol>
            {STEPS.map((s, i) => (
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
              <span className="num">{q ? money(q.total) : vehicleLabel(draft.vehicle) || 'Not started'}</span>
              <ChevronDown size={18} aria-hidden />
            </summary>
            <Summary draft={draft} />
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
          <Summary draft={draft} />
        </aside>
      </div>
    </div>
  )
}
