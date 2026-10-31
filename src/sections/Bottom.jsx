import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Minus, Plus, Check, X, MapPin, Telephone, Calendar, Bike, ArrowUpRight } from '@mynaui/icons-react'
import { gsap, reduced, getLenis } from '../motion.js'
import { SEATING, TIMES, FULL, NOW, CLOSED_DAY, photo, idr } from '../data.js'

const DAYS = 14

// A real calendar file, so the booking lands in the guest's own calendar.
function downloadIcs(date, time, party, seat) {
  const [h, m] = time.split(':').map(Number)
  const start = new Date(date); start.setHours(h, m, 0, 0)
  const end = new Date(start.getTime() + 150 * 60000)
  const z = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Rimba//Booking//EN', 'BEGIN:VEVENT', `DTSTART:${z(start)}`, `DTEND:${z(end)}`,
    `SUMMARY:Dinner at Rimba, ${party} guests`, `LOCATION:Jalan Raya Sayan 88, Ubud, Bali`, `DESCRIPTION:${seat}. Tell us by 2pm on the day if plans change.`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  a.download = 'rimba-booking.ics'
  a.click()
}
const fmt = (d, o) => d.toLocaleDateString('en-GB', o)

export function Reserve() {
  const ref = useRef()
  const days = useMemo(() => Array.from({ length: DAYS }, (_, i) => { const d = new Date(NOW); d.setDate(d.getDate() + i); return d }), [])
  const [party, setParty] = useState(2)
  const [day, setDay] = useState(0)
  const [time, setTime] = useState(null)
  const [seat, setSeat] = useState('room')
  const [step, setStep] = useState('pick') // pick | details | done
  const [form, setForm] = useState({ name: '', phone: '', note: '' })
  const [err, setErr] = useState({})

  const closed = days[day].getDay() === CLOSED_DAY
  const full = FULL[day] || []
  const late = (t) => day === 0 && Number(t.slice(0, 2)) * 60 + Number(t.slice(3)) < NOW.getHours() * 60 + NOW.getMinutes() + 90
  const terraceOk = party <= 4

  useEffect(() => { setTime(null) }, [day, party])
  useEffect(() => { if (!terraceOk && seat === 'terrace') setSeat('room') }, [terraceOk, seat])

  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.reserve-photo img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.reserve', start: 'top bottom', end: 'center center', scrub: true } })
      gsap.from('.reserve-panel > *', { y: 30, opacity: 0, stagger: 0.06, scrollTrigger: { trigger: '.reserve-panel', start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  const submit = (e) => {
    e.preventDefault()
    const x = {}
    if (form.name.trim().length < 2) x.name = 'Who should we ask for at the door?'
    if (form.phone.replace(/\D/g, '').length < 8) x.phone = 'A number we can message if something changes'
    setErr(x)
    if (!Object.keys(x).length) setStep('done')
  }

  const when = `${fmt(days[day], { weekday: 'long', day: 'numeric', month: 'long' })} at ${time}`
  const seatLabel = SEATING.find((s) => s.key === seat).label

  return (
    <section className="reserve" id="reserve" ref={ref} aria-labelledby="reserve-h">
      <div className="reserve-photo"><img src={photo('table-two')} alt="A table for two with a candle and a torch ginger flower" loading="lazy" /></div>
      <div className="reserve-panel">
        <h2 id="reserve-h">Book a table</h2>
        {step === 'done' ? (
          <div className="booked" role="status">
            <span className="booked-icon"><Check /></span>
            <h3>See you {fmt(days[day], { weekday: 'long' })}, {form.name.split(' ')[0]}.</h3>
            <p>{party} {party === 1 ? 'guest' : 'guests'}, {when}, {seatLabel.toLowerCase()}. We sent the details to {form.phone} and will message the day before.</p>
            <div className="booked-actions">
              <button className="btn btn-ghost" onClick={() => downloadIcs(days[day], time, party, seatLabel)}><Calendar /> Add to calendar</button>
              <button className="link-btn" onClick={() => { setStep('pick'); setTime(null) }}>Change or cancel</button>
            </div>
          </div>
        ) : step === 'details' ? (
          <form className="details" onSubmit={submit} noValidate>
            <button type="button" className="summary" onClick={() => setStep('pick')} aria-label="Change date, time or party size">
              <span>{party} {party === 1 ? 'guest' : 'guests'}, {when}</span><span>{seatLabel}</span><em>Change</em>
            </button>
            <label className={`field ${err.name ? 'has-error' : ''}`}><span>Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />{err.name && <small>{err.name}</small>}</label>
            <label className={`field ${err.phone ? 'has-error' : ''}`}><span>Mobile or WhatsApp</span><input type="tel" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" placeholder="With country code" />{err.phone && <small>{err.phone}</small>}</label>
            <label className="field"><span>Allergies or an occasion <em>optional</em></span><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Shellfish allergy, a birthday" /></label>
            <button className="btn btn-accent btn-lg btn-full" type="submit">Confirm booking</button>
            <p className="fine">No deposit for up to 6 guests. Please tell us by 2pm on the day if plans change.</p>
          </form>
        ) : (
          <div className="pick">
            <div className="pick-row">
              <span className="pick-label" id="party-l">Guests</span>
              <div className="stepper" role="group" aria-labelledby="party-l">
                <button onClick={() => setParty(Math.max(1, party - 1))} aria-label="One fewer guest" disabled={party <= 1}><Minus /></button>
                <output aria-live="polite">{party}</output>
                <button onClick={() => setParty(Math.min(8, party + 1))} aria-label="One more guest" disabled={party >= 8}><Plus /></button>
              </div>
            </div>
            {party >= 8 && <p className="fine">For 9 or more, the long room seats 16. Message us and we will plan it with you.</p>}

            <div className="pick-block">
              <span className="pick-label">Date</span>
              <div className="days" role="radiogroup" aria-label="Date" data-lenis-prevent>
                {days.map((d, i) => {
                  const isClosed = d.getDay() === CLOSED_DAY
                  return (
                    <button key={i} role="radio" aria-checked={day === i} className={`day ${day === i ? 'is-on' : ''} ${isClosed ? 'is-closed' : ''}`} onClick={() => setDay(i)}>
                      <small>{i === 0 ? 'Today' : i === 1 ? 'Tmrw' : fmt(d, { weekday: 'short' })}</small>
                      <b>{d.getDate()}</b>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pick-block">
              <span className="pick-label">Time</span>
              {closed ? <p className="fine">We are closed on Mondays. The garden and the cooks rest.</p> : (
                <div className="times" role="radiogroup" aria-label="Time">
                  {TIMES.map((t) => {
                    const off = full.includes(t) || late(t)
                    return <button key={t} role="radio" aria-checked={time === t} disabled={off} className={`time ${time === t ? 'is-on' : ''}`} onClick={() => setTime(t)} title={off ? 'Fully booked' : undefined}>{t}</button>
                  })}
                </div>
              )}
              {!closed && full.length >= 5 && <p className="fine">Almost full. The hearth bar keeps four seats for walk-ins before 7pm.</p>}
            </div>

            <div className="pick-block">
              <span className="pick-label">Where</span>
              <div className="seats" role="radiogroup" aria-label="Seating">
                {SEATING.map((s) => {
                  const off = s.key === 'terrace' && !terraceOk
                  return <button key={s.key} role="radio" aria-checked={seat === s.key} disabled={off} className={seat === s.key ? 'is-on' : ''} onClick={() => setSeat(s.key)}>{s.label}{off && <small> up to 4</small>}</button>
                })}
              </div>
            </div>

            <button className="btn btn-accent btn-lg btn-full" disabled={!time || closed} onClick={() => setStep('details')}>
              {time ? `Continue, ${fmt(days[day], { weekday: 'short' })} ${time}` : 'Choose a time'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export function Visit() {
  return (
    <section className="visit" id="visit" aria-labelledby="visit-h">
      <div className="visit-grid">
        <div>
          <h2 id="visit-h">Visit</h2>
          <address>
            Jalan Raya Sayan 88<br />Ubud, Gianyar, Bali 80571
          </address>
          <a className="inline-link" href="#visit" onClick={(e) => e.preventDefault()}><MapPin /> Open in maps <ArrowUpRight /></a>
        </div>
        <dl className="hours">
          <div><dt>Tuesday to Sunday</dt><dd>Dinner 17:30 to 22:30</dd></div>
          <div><dt>Hearth bar</dt><dd>From 17:00, walk-ins welcome</dd></div>
          <div><dt>Pickup</dt><dd>16:00 to 20:00</dd></div>
          <div><dt>Monday</dt><dd>Closed</dd></div>
        </dl>
        <div className="visit-notes">
          <p>Twelve minutes from central Ubud by car. Parking at the gate, and a buggy down the garden path if you need it.</p>
          <a className="inline-link" href="#visit" onClick={(e) => e.preventDefault()}><Telephone /> +62 361 975 088</a>
        </div>
      </div>
      <footer className="footer">
        <span className="wordmark big">Rimba</span>
        <p>Prototype with sample content: the restaurant, people, prices and reviews are placeholders.</p>
      </footer>
    </section>
  )
}

export function OrderDrawer({ open, onClose }) {
  const [size, setSize] = useState(2)
  const [slot, setSlot] = useState(null)
  const [done, setDone] = useState(false)
  const panel = useRef()
  const slots = ['16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30']
  const feasts = [{ n: 2, label: 'For two', price: 780 }, { n: 4, label: 'For four', price: 1450 }, { n: 6, label: 'For six', price: 2100 }]
  const f = feasts.find((x) => x.n === size)

  useEffect(() => {
    if (!open) return
    getLenis()?.stop()
    const t = setTimeout(() => panel.current?.querySelector('button')?.focus(), 50)
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => { getLenis()?.start(); clearTimeout(t); window.removeEventListener('keydown', k); setDone(false) }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="drawer-layer">
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="order-h" ref={panel} data-lenis-prevent>
        <button className="drawer-close" onClick={onClose} aria-label="Close"><X /></button>
        <img className="drawer-img" src={photo('sharing', 800)} alt="The sharing feast laid out on the table" />
        <div className="drawer-body">
          <h2 id="order-h">Rimba at home</h2>
          {done ? (
            <div role="status" className="booked">
              <span className="booked-icon"><Check /></span>
              <h3>Order placed for {slot}.</h3>
              <p>The sharing feast {f.label.toLowerCase()}, {idr(f.price)}. Pay at pickup. We pack it hot in banana leaf and woven baskets.</p>
              <button className="btn btn-ghost" onClick={onClose}>Back to the page</button>
            </div>
          ) : (
            <>
              <p>The sharing feast, packed hot for pickup: fish from the embers, sate lilit, sambals, red rice and pickles.</p>
              <div className="pick-block">
                <span className="pick-label">Size</span>
                <div className="seats">{feasts.map((x) => <button key={x.n} className={size === x.n ? 'is-on' : ''} aria-pressed={size === x.n} onClick={() => setSize(x.n)}>{x.label}<small> {idr(x.price)}</small></button>)}</div>
              </div>
              <div className="pick-block">
                <span className="pick-label">Pickup today</span>
                <div className="times">{slots.map((s, i) => <button key={s} className={`time ${slot === s ? 'is-on' : ''}`} disabled={i < 1} aria-pressed={slot === s} onClick={() => setSlot(s)}>{s}</button>)}</div>
              </div>
              <p className="fine"><Bike /> Delivery inside Ubud through the usual apps, search Rimba.</p>
              <button className="btn btn-accent btn-lg btn-full" disabled={!slot} onClick={() => setDone(true)}>{slot ? `Order for ${slot}, ${idr(f.price)}` : 'Choose a pickup time'}</button>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}
