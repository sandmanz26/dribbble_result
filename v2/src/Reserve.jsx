import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap, reduced, ScrollTrigger, goTo } from './motion.js'
import { NOW, CLOSED, TIMES, FULL, PRICE, img } from './data.js'

const fmt = (d, o) => d.toLocaleDateString('en-GB', o)
export const DAYS = Array.from({ length: 21 }, (_, i) => { const d = new Date(NOW); d.setDate(d.getDate() + i); return d })
const isClosed = (i) => CLOSED.includes(DAYS[i].getDay())
const firstOpen = () => DAYS.findIndex((_, i) => !isClosed(i))
export const slotOff = (day, t) => (FULL[day] || []).includes(t) || (day === 0 && Number(t.slice(0, 2)) * 60 + Number(t.slice(3)) < NOW.getHours() * 60 + NOW.getMinutes() + 120)

export function useBooking() {
  const [b, set] = useState({ party: 2, day: firstOpen(), time: null })
  return [b, (patch) => set((x) => ({ ...x, ...patch }))]
}

// A small listbox that opens upward from the hero bar. Keyboard: arrows, Enter, Escape.
function Pop({ label, value, options, onPick, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useEffect(() => {
    if (!open) return
    const out = (e) => !ref.current.contains(e.target) && setOpen(false)
    const key = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', out); document.addEventListener('keydown', key)
    setTimeout(() => ref.current.querySelector('[aria-selected="true"], [role="option"]:not([aria-disabled="true"])')?.focus(), 20)
    return () => { document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', key) }
  }, [open])
  const move = (e) => {
    if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return
    e.preventDefault()
    const items = [...ref.current.querySelectorAll('[role="option"]:not([aria-disabled="true"])')]
    const i = items.indexOf(document.activeElement)
    items[Math.max(0, Math.min(items.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))]?.focus()
  }
  return (
    <div className="pop" ref={ref}>
      <button className="pop-btn" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)} disabled={disabled}>
        <small>{label}</small><span>{value}</span>
      </button>
      {open && (
        <ul className="pop-list" role="listbox" aria-label={label} onKeyDown={move} data-lenis-prevent>
          {options.map((o) => (
            <li key={o.value} role="option" tabIndex={o.off ? -1 : 0} aria-selected={o.on} aria-disabled={o.off}
              onClick={() => { if (!o.off) { onPick(o.value); setOpen(false) } }}
              onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !o.off) { e.preventDefault(); onPick(o.value); setOpen(false) } }}>
              {o.label}{o.note && <em>{o.note}</em>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function BookingBar({ b, set }) {
  const dayOpts = DAYS.map((d, i) => ({ value: i, label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : fmt(d, { weekday: 'short', day: 'numeric', month: 'short' }), off: isClosed(i), note: isClosed(i) ? 'Closed' : null, on: b.day === i }))
  const timeOpts = TIMES.map((t) => ({ value: t, label: t, off: slotOff(b.day, t), note: slotOff(b.day, t) ? 'Full' : null, on: b.time === t }))
  return (
    <div className="bar" role="group" aria-label="Find a table">
      <Pop label="Guests" value={`${b.party} ${b.party === 1 ? 'guest' : 'guests'}`} options={[1, 2, 3, 4, 5, 6].map((n) => ({ value: n, label: `${n} ${n === 1 ? 'guest' : 'guests'}`, on: b.party === n }))} onPick={(party) => set({ party })} />
      <Pop label="Date" value={dayOpts[b.day].label} options={dayOpts.slice(0, 14)} onPick={(day) => set({ day, time: null })} />
      <Pop label="Time" value={b.time || 'Any time'} options={timeOpts} onPick={(time) => set({ time })} />
      <button className="btn btn-solid" onClick={() => goTo('reserve')}>Reserve</button>
    </div>
  )
}

// After the hero, the booking bar becomes one slim button that stays in reach.
export function Dock() {
  const [inRange, setIn] = useState(false)
  const [inCourses, setCourses] = useState(false)
  const show = inRange && !inCourses
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: '.story', start: 'top 60%', endTrigger: '#reserve', end: 'top 85%',
      onToggle: (s) => setIn(s.isActive),
    })
    // The six courses get the whole screen; the button steps out of their way.
    const c = ScrollTrigger.create({ trigger: '.c-scroll', start: 'top 70%', end: 'bottom 30%', onToggle: (s) => setCourses(s.isActive) })
    return () => { st.kill(); c.kill() }
  }, [])
  return (
    <div className={`dock ${show ? 'on' : ''}`} aria-hidden={!show}>
      <span>Tuesday to Saturday, from £{PRICE}</span>
      <button className="btn btn-solid" tabIndex={show ? 0 : -1} onClick={() => goTo('reserve')}>Reserve</button>
    </div>
  )
}

function downloadIcs(date, time, party) {
  const [h, m] = time.split(':').map(Number)
  const s = new Date(date); s.setHours(h, m, 0, 0)
  const e = new Date(s.getTime() + 180 * 60000)
  const z = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Osier//Booking//EN', 'BEGIN:VEVENT', `DTSTART:${z(s)}`, `DTEND:${z(e)}`, `SUMMARY:Dinner at Osier, ${party} guests`, 'LOCATION:14 Weymouth Mews, London W1G 7EB', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  a.download = 'osier-booking.ics'
  a.click()
}

export function Reserve({ b, set }) {
  const ref = useRef()
  const [step, setStep] = useState('pick')
  const [form, setForm] = useState({ name: '', email: '', note: '' })
  const [err, setErr] = useState({})
  const days = useMemo(() => DAYS.slice(0, 14), [])
  const closed = isClosed(b.day)

  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.res-photo img', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'top top', scrub: true } })
      gsap.from('.res-panel > *', { opacity: 0, y: 26, duration: 1, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: '.res-panel', start: 'top 78%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  const submit = (e) => {
    e.preventDefault()
    const x = {}
    if (form.name.trim().length < 2) x.name = 'Please add the name for the booking.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) x.email = 'We send the confirmation here.'
    setErr(x)
    if (!Object.keys(x).length) setStep('done')
  }
  const when = `${fmt(DAYS[b.day], { weekday: 'long', day: 'numeric', month: 'long' })} at ${b.time}`

  return (
    <section className="reserve" id="reserve" ref={ref} aria-labelledby="res-h">
      <figure className="res-photo"><img src={img('pour', 800)} alt="Red wine poured into a glass by candlelight" loading="lazy" /></figure>
      <div className="res-panel">
        <p className="label">Reservations</p>
        <h2 id="res-h">Reserve a table</h2>
        {step === 'done' ? (
          <div className="done" role="status">
            <p className="done-big">Thank you, {form.name.split(' ')[0]}. We look forward to {fmt(DAYS[b.day], { weekday: 'long' })}.</p>
            <p>{b.party} {b.party === 1 ? 'guest' : 'guests'}, {when}. A confirmation is on its way to {form.email}. We will call the day before to ask about allergies.</p>
            <div className="row"><button className="btn btn-line" onClick={() => downloadIcs(DAYS[b.day], b.time, b.party)}>Add to calendar</button><button className="link" onClick={() => setStep('pick')}>Change the booking</button></div>
          </div>
        ) : step === 'details' ? (
          <form className="form" onSubmit={submit} noValidate>
            <button type="button" className="summary" onClick={() => setStep('pick')}><span>{b.party} {b.party === 1 ? 'guest' : 'guests'}, {when}</span><em>Change</em></button>
            <label className={`field ${err.name ? 'bad' : ''}`}><span>Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />{err.name && <small>{err.name}</small>}</label>
            <label className={`field ${err.email ? 'bad' : ''}`}><span>Email</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />{err.email && <small>{err.email}</small>}</label>
            <label className="field"><span>Allergies or an occasion <em>optional</em></span><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
            <button className="btn btn-solid btn-full" type="submit">Confirm reservation</button>
            <p className="fine">A card holds the table; nothing is charged unless you cancel within 48 hours (£{60} per guest).</p>
          </form>
        ) : (
          <div className="pick">
            <div className="pick-row">
              <span>Guests</span>
              <div className="count" role="group" aria-label="Guests">
                <button onClick={() => set({ party: Math.max(1, b.party - 1) })} disabled={b.party <= 1} aria-label="One fewer guest">−</button>
                <output aria-live="polite">{b.party}</output>
                <button onClick={() => set({ party: Math.min(6, b.party + 1) })} disabled={b.party >= 6} aria-label="One more guest">+</button>
              </div>
            </div>
            {b.party >= 6 && <p className="fine">For seven to ten, the cellar can be booked privately. Write to us.</p>}
            <div className="pick-block">
              <span>Date</span>
              <div className="dates" role="radiogroup" aria-label="Date" data-lenis-prevent>
                {days.map((d, i) => (
                  <button key={i} role="radio" aria-checked={b.day === i} disabled={isClosed(i)} className={b.day === i ? 'on' : ''} onClick={() => set({ day: i, time: null })}>
                    <small>{fmt(d, { weekday: 'short' })}</small><b>{d.getDate()}</b>
                  </button>
                ))}
              </div>
            </div>
            <div className="pick-block">
              <span>Time</span>
              {closed ? <p className="fine">We are closed on Sundays and Mondays.</p> : (
                <div className="times" role="radiogroup" aria-label="Time">
                  {TIMES.map((t) => <button key={t} role="radio" aria-checked={b.time === t} disabled={slotOff(b.day, t)} className={b.time === t ? 'on' : ''} onClick={() => set({ time: t })}>{t}</button>)}
                </div>
              )}
              {!closed && TIMES.every((t) => slotOff(b.day, t)) && <p className="fine">This evening is full. Join the waiting list or try the chef's table.</p>}
            </div>
            <button className="btn btn-solid btn-full" disabled={!b.time || closed} onClick={() => setStep('details')}>{b.time ? `Continue with ${b.time}` : 'Choose a time'}</button>
          </div>
        )}
      </div>
    </section>
  )
}
