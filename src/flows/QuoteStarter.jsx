// First step of the quote, embedded in the home hero and service pages. Asks for the vehicle
// (it sets the price) and the ZIP (it tells us whether we come to you), and checks both at once,
// so an out-of-area customer learns it here, not on step 3, and can still see a price.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { checkZip, lookupPlate } from '../data/api.js'
import { MAKES, SAMPLE_PLATE, STATES, YEARS } from '../data/vehicles.js'
import { Alert, Button, Field, Input, Segmented, Select } from '../ui/index.jsx'
import { OutOfArea } from '../service/index.jsx'
import { UXNote } from '../ui/UXNote.jsx'
import { useDraft } from './draft.jsx'

export function VehicleInputs({ entry, value, onChange, errors = {} }) {
  const models = value.make ? Object.keys(MAKES[value.make]) : []
  if (entry === 'plate') {
    return (
      <div className="grid-plate">
        <Field label="License plate" error={errors.plate} hint={`Try ${SAMPLE_PLATE}`}>
          {(a) => (
            <Input
              {...a}
              value={value.plate}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="input input-plate"
              onChange={(e) => onChange({ plate: e.target.value.toUpperCase().slice(0, 8) })}
            />
          )}
        </Field>
        <Field label="State">
          {(a) => (
            <Select {...a} value={value.plateState} onChange={(e) => onChange({ plateState: e.target.value })}>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </Select>
          )}
        </Field>
      </div>
    )
  }
  return (
    <div className="grid-ymm">
      <Field label="Year" error={errors.year}>
        {(a) => (
          <Select {...a} value={value.year || ''} onChange={(e) => onChange({ year: Number(e.target.value) || null })}>
            <option value="">Year</option>
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </Select>
        )}
      </Field>
      <Field label="Make" error={errors.make}>
        {(a) => (
          <Select {...a} value={value.make || ''} onChange={(e) => onChange({ make: e.target.value || null, model: null })}>
            <option value="">Make</option>
            {Object.keys(MAKES).map((m) => <option key={m}>{m}</option>)}
          </Select>
        )}
      </Field>
      <Field label="Model" error={errors.model}>
        {(a) => (
          <Select {...a} value={value.model || ''} disabled={!value.make} onChange={(e) => onChange({ model: e.target.value || null })}>
            <option value="">{value.make ? 'Model' : 'Pick a make first'}</option>
            {models.map((m) => <option key={m}>{m}</option>)}
          </Select>
        )}
      </Field>
    </div>
  )
}

// Shared by the V1 side card and the V2 search strip: same fields, same validation.
export function useQuoteStart(service) {
  const { draft, update } = useDraft()
  const nav = useNavigate()
  const [entry, setEntry] = useState(draft.entry)
  const [v, setV] = useState({
    plate: draft.plate,
    plateState: draft.plateState,
    year: draft.vehicle?.year || null,
    make: draft.vehicle?.make || null,
    model: draft.vehicle?.model || null,
  })
  const [zip, setZip] = useState(draft.zip)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [lookupError, setLookupError] = useState(null)
  // ZIP that came back out of area. The starter shows the waitlist and a way to see the price.
  const [outZip, setOutZip] = useState(null)

  async function submit(e) {
    e.preventDefault()
    const err = {}
    if (entry === 'plate' && v.plate.trim().length < 2) err.plate = 'Enter your plate, or switch to year, make and model'
    if (entry === 'ymm') {
      if (!v.year) err.year = 'Pick a year'
      if (!v.make) err.make = 'Pick a make'
      if (!v.model) err.model = 'Pick a model'
    }
    if (!/^\d{5}$/.test(zip)) err.zip = 'Enter a 5-digit ZIP code'
    setErrors(err)
    setLookupError(null)
    setOutZip(null)
    if (Object.keys(err).length) return

    setBusy(true)
    const vehicleP = entry === 'plate' ? lookupPlate(v.plateState, v.plate) : Promise.resolve({ year: v.year, make: v.make, model: v.model })
    // A failed ZIP check never blocks the quote: the Location step checks again.
    const zipP = checkZip(zip).then((m) => ({ metro: m }), () => ({ failed: true }))
    let vehicle
    let area
    try {
      ;[vehicle, area] = await Promise.all([vehicleP, zipP])
    } catch (ex) {
      setBusy(false)
      return setLookupError(ex.code === 'not_found' ? 'not_found' : 'network')
    }
    setBusy(false)
    const metro = area.failed ? undefined : area.metro?.id || null
    update((d) => {
      const nextMetro = metro === undefined ? (d.zip === zip ? d.metro : null) : metro
      return {
        vehicle,
        entry,
        plate: v.plate,
        plateState: v.plateState,
        zip,
        metro: nextMetro,
        // An arrival window belongs to one metro's team.
        ...(nextMetro !== d.metro ? { slot: null } : {}),
        noBooking: false,
        ...(service ? { mode: 'known', service } : {}),
      }
    })
    if (metro === null) return setOutZip(zip)
    nav('/quote/issue')
  }

  const seePriceAnyway = () => {
    update({ noBooking: true })
    nav('/quote/issue')
  }

  const switchEntry = (x) => {
    setEntry(x)
    setErrors({})
    setLookupError(null)
  }
  const changeZip = (z) => {
    setZip(z)
    setOutZip(null)
  }
  return { entry, switchEntry, v, setV, zip, setZip: changeZip, errors, busy, lookupError, submit, outZip, seePriceAnyway }
}

// Out-of-area result, shared by the V1 card and the V2 strip.
export function StarterOut({ zip, onSeePrice }) {
  return (
    <div className="starter-out note-anchor" aria-live="polite">
      <UXNote id="coverage-first" className="uxnote-corner" />
      <OutOfArea
        zip={zip}
        action={<button type="button" className="link-btn" onClick={onSeePrice}>See the price anyway</button>}
      />
    </div>
  )
}

export function QuoteStarter({ title = 'See your price', service }) {
  const { entry, switchEntry, v, setV, zip, setZip, errors, busy, lookupError, submit, outZip, seePriceAnyway } = useQuoteStart(service)
  return (
    <form className="starter" onSubmit={submit} noValidate aria-labelledby="starter-title">
      <h2 id="starter-title" className="starter-title">{title}</h2>
      <Segmented
        label="How to find your vehicle"
        value={entry}
        onChange={switchEntry}
        options={[{ value: 'plate', label: 'License plate' }, { value: 'ymm', label: 'Make and model' }]}
      />
      <VehicleInputs entry={entry} value={v} errors={errors} onChange={(p) => setV((x) => ({ ...x, ...p }))} />
      {lookupError === 'not_found' && (
        <Alert tone="warning" title="We could not match that plate" action={<Button type="button" size="sm" variant="ghost" onClick={() => switchEntry('ymm')}>Use year, make, model</Button>}>
          New plates can take a few weeks to show up.
        </Alert>
      )}
      {lookupError === 'network' && (
        <Alert tone="danger" title="Plate lookup is not responding">Try again, or enter year, make and model.</Alert>
      )}
      <Field label="ZIP code where the car is parked" error={errors.zip} hint="Your ZIP tells us if we come to you. Price depends on the car and the work.">
        {(a) => (
          <Input {...a} inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} />
        )}
      </Field>
      <Button type="submit" block size="lg" loading={busy} iconEnd={ArrowRight}>
        {busy ? 'Checking your car and ZIP' : 'See my price'}
      </Button>
      {outZip && <StarterOut zip={outZip} onSeePrice={seePriceAnyway} />}
      <p className="small muted center">No phone number or email until you book.</p>
    </form>
  )
}
