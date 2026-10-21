import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { IconChevronLeft, IconChevronRight, IconShieldCheck, IconAlertCircleFilled, IconCheck, IconCreditCard } from '@tabler/icons-react'
import { TopBar, Img } from '../components/ui.jsx'
import { getCreator, money, SERVICE_FEE } from '../data/creators.js'
import { coverOf } from '../data/media.js'
import { useStore } from '../app/store.jsx'

const STEPS = ['Package', 'Date', 'Details', 'Payment']
const TODAY = '2026-10-21'
const MONTHS = [[2026, 9], [2026, 10], [2026, 11]]
const SLOTS = ['09:00', '10:00', '12:00', '14:00', '16:00', '18:00']
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
const nice = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })
const logo = (slug) => `https://cdn.simpleicons.org/${slug}/121214/f2f2f0`

const luhn = (num) => {
  const d = num.replace(/\D/g, '')
  if (d.length < 13) return false
  let sum = 0
  for (let i = 0; i < d.length; i++) {
    let n = +d[d.length - 1 - i]
    if (i % 2) { n *= 2; if (n > 9) n -= 9 }
    sum += n
  }
  return sum % 10 === 0
}
const expiryOk = (v) => {
  const m = v.match(/^(\d{2})\/(\d{2})$/)
  if (!m || +m[1] < 1 || +m[1] > 12) return false
  return new Date(2000 + +m[2], +m[1], 1) > new Date(TODAY)
}

export default function Book() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user, addBooking } = useStore()
  const c = getCreator(id)
  const [step, setStep] = useState(0)
  const [pkgId, setPkgId] = useState(c?.packages[0].id)
  const [month, setMonth] = useState(c ? MONTHS.findIndex(([y, m]) => c.available.some((d) => d.startsWith(iso(y, m, 1).slice(0, 7)))) : 0)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [details, setDetails] = useState({ location: '', notes: '' })
  const [method, setMethod] = useState('card')
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: user?.name || '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | paying | declined | done
  const [ref, setRef] = useState(null)

  const pkg = c?.packages.find((p) => p.id === pkgId)
  const fee = pkg ? Math.round(pkg.price * SERVICE_FEE * 100) / 100 : 0
  const total = pkg ? pkg.price + fee : 0
  // Deterministic "already booked" slots per date so the picker shows real constraints.
  const taken = useMemo(() => (date ? SLOTS.filter((_, n) => (date.charCodeAt(9) + n) % 3 === 0) : []), [date])
  if (!c) return null
  const first = c.name.split(' ')[0]

  const canNext = [!!pkg, !!date && !!time, details.location.trim().length > 2, true][step]
  const next = () => {
    if (step === 2 && details.location.trim().length <= 2) return setErrors({ location: 'Add the address or venue for the shoot.' })
    setErrors({})
    setStep(step + 1)
  }

  const pay = () => {
    if (method === 'card') {
      const e = {}
      if (!luhn(card.number)) e.number = 'Check the card number.'
      if (!expiryOk(card.expiry)) e.expiry = 'Use MM/YY, in the future.'
      if (!/^\d{3,4}$/.test(card.cvc)) e.cvc = '3 or 4 digits.'
      if (card.name.trim().length < 2) e.name = 'Name as it appears on the card.'
      setErrors(e)
      if (Object.keys(e).length) return
    }
    setStatus('paying')
    setTimeout(() => {
      // Prototype: any card ending in 0002 is declined, to demonstrate the error state.
      if (method === 'card' && card.number.replace(/\D/g, '').endsWith('0002')) return setStatus('declined')
      const bookingRef = `PR-${Math.floor(10000 + Math.random() * 89999)}`
      addBooking({ id: bookingRef, creatorId: c.id, packageId: pkg.id, date, time, location: details.location.trim(), notes: details.notes.trim(), total, status: 'confirmed' })
      setRef(bookingRef)
      setStatus('done')
    }, 1400)
  }

  if (status === 'done')
    return (
      <div className="screen safe-top" style={{ display: 'grid', alignContent: 'center', gap: 16, padding: '56px 24px 40px', textAlign: 'center', justifyItems: 'center' }}>
        <motion.span className="success-mark" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}><IconCheck size={34} stroke={2.4} /></motion.span>
        <h1 style={{ fontSize: 28 }}>You’re booked with {first}</h1>
        <p className="muted">{pkg.name}, {nice(date)} at {time}. We’ve emailed your receipt{user?.email ? ` to ${user.email}` : ''}.</p>
        <div className="summary" style={{ width: '100%', textAlign: 'left', marginTop: 8 }}>
          <div className="row"><span className="muted">Booking</span><b className="num">{ref}</b></div>
          <div className="row"><span className="muted">Paid</span><b className="num">{money(total)}</b></div>
        </div>
        <div style={{ display: 'grid', gap: 10, width: '100%', marginTop: 8 }}>
          <button className="btn block" onClick={() => nav('/bookings', { replace: true })}>View booking</button>
          <button className="btn ghost block" onClick={() => nav('/', { replace: true })}>Back to Discover</button>
        </div>
      </div>
    )

  const [y, m] = MONTHS[Math.max(0, month)]
  const lead = (new Date(y, m, 1).getDay() + 6) % 7
  const days = new Date(y, m + 1, 0).getDate()

  return (
    <>
      <div className="screen has-cta">
        <TopBar title={STEPS[step]} />
        <div className="steps" aria-label={`Step ${step + 1} of 4`}>{STEPS.map((s, n) => <i key={s} className={n <= step ? 'on' : ''} />)}</div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '20px 20px 4px' }}>
          <Img src={coverOf(c, 330)} style={{ width: 48, height: 48, borderRadius: 10, flex: 'none' }} />
          <div><h3>{c.name}</h3><p className="small muted">{c.title}</p></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} className="pad" style={{ display: 'grid', gap: 12, marginTop: 16 }} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
            {step === 0 && (
              <div role="radiogroup" aria-label="Package" style={{ display: 'grid', gap: 10 }}>
                {c.packages.map((p) => (
                  <button key={p.id} className="pkg" role="radio" aria-checked={pkgId === p.id} onClick={() => setPkgId(p.id)}>
                    <span className="top"><h3>{p.name}</h3><b className="num">{money(p.price)}</b></span>
                    <span className="small muted">{p.hours} {p.hours === 1 ? 'hour' : 'hours'}, delivered in {p.deliver}</span>
                    <ul>{p.includes.map((x) => <li key={x}><IconCheck size={15} stroke={2} />{x}</li>)}</ul>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button className="icon-btn" disabled={month <= 0} style={{ opacity: month <= 0 ? 0.3 : 1 }} onClick={() => setMonth(month - 1)} aria-label="Previous month"><IconChevronLeft size={20} /></button>
                  <h2 aria-live="polite">{new Date(y, m, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h2>
                  <button className="icon-btn" disabled={month >= MONTHS.length - 1} style={{ opacity: month >= MONTHS.length - 1 ? 0.3 : 1 }} onClick={() => setMonth(month + 1)} aria-label="Next month"><IconChevronRight size={20} /></button>
                </div>
                <div className="cal-grid">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, k) => <span key={k} className="dow" aria-hidden="true">{d}</span>)}
                  {Array.from({ length: lead }, (_, k) => <span key={`b${k}`} />)}
                  {Array.from({ length: days }, (_, k) => {
                    const d = iso(y, m, k + 1)
                    const open = d > TODAY && c.available.includes(d)
                    return (
                      <button key={d} className={`cal-day ${open ? 'open' : ''}`} disabled={!open} aria-pressed={date === d}
                        aria-label={`${nice(d)}${open ? ', available' : ', unavailable'}`} onClick={() => { setDate(d); setTime(null) }}>{k + 1}</button>
                    )
                  })}
                </div>
                <p className="small muted">{first} has {c.available.length} open dates in the next two months.</p>
                {date && (
                  <div className="field" style={{ marginTop: 8 }}>
                    <label id="slot-l">Start time on {nice(date)}</label>
                    <div className="slots" role="group" aria-labelledby="slot-l">
                      {SLOTS.map((s) => <button key={s} className="slot" disabled={taken.includes(s)} aria-pressed={time === s} onClick={() => setTime(s)}>{s}</button>)}
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <div className="field">
                  <label htmlFor="b-loc">Location</label>
                  <input id="b-loc" className="input" placeholder="Venue or address" value={details.location} onChange={(e) => { setDetails({ ...details, location: e.target.value }); setErrors({}) }} aria-invalid={!!errors.location} aria-describedby={errors.location ? 'loc-err' : undefined} />
                  {errors.location && <p className="err" id="loc-err"><IconAlertCircleFilled size={15} />{errors.location}</p>}
                </div>
                <div className="field">
                  <label htmlFor="b-notes">Anything {first} should know? (optional)</label>
                  <textarea id="b-notes" className="input" placeholder="Shot list, dress code, parking…" value={details.notes} onChange={(e) => setDetails({ ...details, notes: e.target.value })} />
                  <p className="help">You can message {first} after booking.</p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="summary">
                  <div className="row"><span>{pkg.name}</span><span className="num">{money(pkg.price)}</span></div>
                  <div className="row"><span className="muted">{nice(date)}, {time}</span></div>
                  <div className="row"><span className="muted">Service fee</span><span className="num muted">{money(fee)}</span></div>
                  <div className="row total"><span>Total</span><span className="num">{money(total)}</span></div>
                </div>
                <div className="note"><IconShieldCheck size={18} stroke={1.8} /><span>Proof holds your payment and releases it to {first} 48 hours after your photos are delivered.</span></div>

                <div className="paymethods" role="radiogroup" aria-label="Payment method" style={{ marginTop: 8 }}>
                  <button className="paymethod" role="radio" aria-checked={method === 'card'} onClick={() => setMethod('card')}>
                    <IconCreditCard size={22} stroke={1.6} />Card<span style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}><img src={logo('visa')} alt="Visa" /><img src={logo('mastercard')} alt="Mastercard" /></span><span className="radio" style={{ marginLeft: 12 }} />
                  </button>
                  <button className="paymethod" role="radio" aria-checked={method === 'applepay'} onClick={() => setMethod('applepay')}>
                    <img src={logo('applepay')} alt="" style={{ height: 22 }} />Apple Pay<span className="radio" />
                  </button>
                  <button className="paymethod" role="radio" aria-checked={method === 'paypal'} onClick={() => setMethod('paypal')}>
                    <img src={logo('paypal')} alt="" />PayPal<span className="radio" />
                  </button>
                </div>

                {method === 'card' && (
                  <div style={{ display: 'grid', gap: 14, marginTop: 8 }}>
                    {[
                      ['number', 'Card number', '4242 4242 4242 4242', 'cc-number', (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')],
                    ].map(([k, label, ph, ac, fmt]) => (
                      <div className="field" key={k}>
                        <label htmlFor={`c-${k}`}>{label}</label>
                        <input id={`c-${k}`} className="input num" inputMode="numeric" autoComplete={ac} placeholder={ph} value={card[k]}
                          onChange={(e) => { setCard({ ...card, [k]: fmt(e.target.value) }); setErrors({ ...errors, [k]: null }) }} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `c-${k}-err` : 'c-test'} />
                        {errors[k] ? <p className="err" id={`c-${k}-err`}><IconAlertCircleFilled size={15} />{errors[k]}</p> : <p className="help" id="c-test">Prototype: use 4242 4242 4242 4242. A card ending 0002 is declined.</p>}
                      </div>
                    ))}
                    <div className="row2">
                      <div className="field">
                        <label htmlFor="c-expiry">Expiry</label>
                        <input id="c-expiry" className="input num" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={card.expiry}
                          onChange={(e) => { const d = e.target.value.replace(/\D/g, '').slice(0, 4); setCard({ ...card, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }); setErrors({ ...errors, expiry: null }) }}
                          aria-invalid={!!errors.expiry} aria-describedby={errors.expiry ? 'c-expiry-err' : undefined} />
                        {errors.expiry && <p className="err" id="c-expiry-err"><IconAlertCircleFilled size={15} />{errors.expiry}</p>}
                      </div>
                      <div className="field">
                        <label htmlFor="c-cvc">CVC</label>
                        <input id="c-cvc" className="input num" inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={card.cvc}
                          onChange={(e) => { setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }); setErrors({ ...errors, cvc: null }) }}
                          aria-invalid={!!errors.cvc} aria-describedby={errors.cvc ? 'c-cvc-err' : undefined} />
                        {errors.cvc && <p className="err" id="c-cvc-err"><IconAlertCircleFilled size={15} />{errors.cvc}</p>}
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="c-name">Name on card</label>
                      <input id="c-name" className="input" autoComplete="cc-name" value={card.name} onChange={(e) => { setCard({ ...card, name: e.target.value }); setErrors({ ...errors, name: null }) }} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'c-name-err' : undefined} />
                      {errors.name && <p className="err" id="c-name-err"><IconAlertCircleFilled size={15} />{errors.name}</p>}
                    </div>
                  </div>
                )}
                {status === 'declined' && (
                  <p className="err" role="alert" style={{ padding: '12px 14px', borderRadius: 14, background: 'color-mix(in srgb, var(--danger) 10%, transparent)' }}>
                    <IconAlertCircleFilled size={16} />Your bank declined this payment. Try another card or method. You have not been charged.
                  </p>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="cta-bar">
        <span className="price">
          <span className="small muted">{step === 3 ? 'Total' : pkg?.name}</span>
          <b className="num">{money(step === 3 ? total : pkg?.price || 0)}</b>
        </span>
        {step < 3
          ? <button className="btn" disabled={!canNext && step !== 2} onClick={next}>Continue</button>
          : <button className="btn" onClick={pay} disabled={status === 'paying'}>{status === 'paying' ? 'Processing…' : `Pay ${money(total)}`}</button>}
      </div>
    </>
  )
}
