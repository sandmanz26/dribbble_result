import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CgCheck, CgArrowRight } from 'react-icons/cg'
import { TYPES, UNITS } from '../data.js'
import { WLink } from '../App.jsx'

// Tour booking: pick a day and a slot, say what you sell, and the unit you came for is already attached.
export default function Tour() {
  const [sp] = useSearchParams()
  const unit = UNITS.find((u) => u.id === sp.get('unit'))
  const days = useMemo(() => {
    const out = []; const d = new Date()
    while (out.length < 6) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) out.push(new Date(d)) }
    return out
  }, [])
  const [day, setDay] = useState(0)
  const [slot, setSlot] = useState(null)
  const [v, setV] = useState({ name: '', company: '', sells: '', type: unit?.type || 'shelf' })
  const [err, setErr] = useState({})
  const [done, setDone] = useState(false)
  const slots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00']
  const full = (i) => (day * 3 + i) % 4 === 1
  const submit = (e) => {
    e.preventDefault()
    const x = {}
    if (v.name.trim().length < 2) x.name = 'Tell us who to expect.'
    if (v.company.trim().length < 2) x.company = 'Your brand or company name.'
    if (!slot) x.slot = 'Pick a time.'
    setErr(x)
    if (!Object.keys(x).length) setDone(true)
  }
  if (done) return (
    <section className="wrap tour done">
      <span className="done-sh" aria-hidden="true" />
      <h1>See you on {days[day].toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at {slot}.</h1>
      <p className="sp-lede">{v.name}, we will walk you through {unit ? `unit ${unit.id} and ` : ''}the free {TYPES[v.type].name.toLowerCase()}s, the dock and the packing floor. Ask for the front desk at Unit 4.</p>
      <WLink to="/" className="btn">Back to the floor<CgArrowRight aria-hidden="true" /></WLink>
    </section>
  )
  return (
    <section className="wrap tour">
      <h1>Book a tour</h1>
      <p className="sp-lede">Thirty minutes on the floor with the person who runs it.{unit && <> You are booking for <b>{unit.id}</b>, a {TYPES[unit.type].name.toLowerCase()}.</>}</p>
      <form onSubmit={submit} noValidate className="tour-form">
        <fieldset>
          <legend>Day</legend>
          <div className="days">{days.map((d, i) => <button type="button" key={i} aria-pressed={day === i} onClick={() => { setDay(i); setSlot(null) }}><span>{d.toLocaleDateString('en-GB', { weekday: 'short' })}</span><b>{d.getDate()}</b></button>)}</div>
        </fieldset>
        <fieldset>
          <legend>Time</legend>
          <div className="slots">{slots.map((s, i) => <button type="button" key={s} disabled={full(i)} aria-pressed={slot === s} onClick={() => setSlot(s)}>{full(i) ? `${s} full` : s}</button>)}</div>
          {err.slot && <p className="err">{err.slot}</p>}
        </fieldset>
        <fieldset>
          <legend>Space you are after</legend>
          <div className="types-pick">{Object.values(TYPES).map((t) => <label key={t.id} style={{ '--c': t.colour }} className={v.type === t.id ? 'on' : ''}><input type="radio" name="type" checked={v.type === t.id} onChange={() => setV({ ...v, type: t.id })} /><i />{t.name}</label>)}</div>
        </fieldset>
        <div className="fields">
          <label>Your name<input value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} aria-invalid={!!err.name} autoComplete="name" />{err.name && <span className="err">{err.name}</span>}</label>
          <label>Brand or company<input value={v.company} onChange={(e) => setV({ ...v, company: e.target.value })} aria-invalid={!!err.company} />{err.company && <span className="err">{err.company}</span>}</label>
          <label className="full">What do you sell? (optional)<input value={v.sells} onChange={(e) => setV({ ...v, sells: e.target.value })} placeholder="Candles, about 300 orders a month" /></label>
        </div>
        <button className="btn">Book the tour<CgCheck aria-hidden="true" /></button>
        <p className="note">Prototype: nothing is sent.</p>
      </form>
    </section>
  )
}
