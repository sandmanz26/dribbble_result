// First step of the quote, embedded in the home hero and service pages. Asks for the two
// things that change the price (vehicle, ZIP) and nothing else.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { lookupPlate } from '../data/api.js'
import { MAKES, SAMPLE_PLATE, STATES, YEARS } from '../data/vehicles.js'
import { Alert, Button, Field, Input, Segmented, Select } from '../ui/index.jsx'
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

export function QuoteStarter({ title = 'See your price', service }) {
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
    if (Object.keys(err).length) return

    let vehicle = { year: v.year, make: v.make, model: v.model }
    if (entry === 'plate') {
      setBusy(true)
      try {
        vehicle = await lookupPlate(v.plateState, v.plate)
      } catch (ex) {
        setBusy(false)
        return setLookupError(ex.code === 'not_found' ? 'not_found' : 'network')
      }
      setBusy(false)
    }
    update((d) => ({
      vehicle,
      entry,
      plate: v.plate,
      plateState: v.plateState,
      zip,
      metro: d.zip === zip ? d.metro : null,
      ...(service ? { mode: 'known', service } : {}),
    }))
    nav('/quote/issue')
  }

  return (
    <form className="starter" onSubmit={submit} noValidate aria-labelledby="starter-title">
      <h2 id="starter-title" className="starter-title">{title}</h2>
      <Segmented
        label="How to find your vehicle"
        value={entry}
        onChange={(x) => {
          setEntry(x)
          setErrors({})
          setLookupError(null)
        }}
        options={[{ value: 'plate', label: 'License plate' }, { value: 'ymm', label: 'Make and model' }]}
      />
      <VehicleInputs entry={entry} value={v} errors={errors} onChange={(p) => setV((x) => ({ ...x, ...p }))} />
      {lookupError === 'not_found' && (
        <Alert tone="warning" title="We could not match that plate" action={<Button type="button" size="sm" variant="ghost" onClick={() => { setEntry('ymm'); setLookupError(null) }}>Use year, make, model</Button>}>
          New plates can take a few weeks to show up.
        </Alert>
      )}
      {lookupError === 'network' && (
        <Alert tone="danger" title="Plate lookup is not responding">Try again, or enter year, make and model.</Alert>
      )}
      <Field label="ZIP code where the car is parked" error={errors.zip}>
        {(a) => (
          <Input {...a} inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} />
        )}
      </Field>
      <Button type="submit" block size="lg" loading={busy} iconEnd={ArrowRight}>
        {busy ? 'Finding your vehicle' : 'See my price'}
      </Button>
      <p className="small muted center">No phone number or email until you book.</p>
    </form>
  )
}
