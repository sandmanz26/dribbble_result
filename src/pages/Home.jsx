import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BadgeCheck, CreditCard, Gauge, ShieldCheck } from 'lucide-react'
import { useBrand } from '../brand/BrandContext.jsx'
import { QuoteStarter } from '../flows/QuoteStarter.jsx'
import { useDraft } from '../flows/draft.jsx'
import { METROS } from '../data/areas.js'
import { money, recommend, SERVICE_ORDER, SERVICES, SYMPTOMS } from '../data/services.js'
import { ServiceAreaCheck } from '../service/index.jsx'
import { Alert, Button } from '../ui/index.jsx'
import { UXNote } from '../ui/UXNote.jsx'

const COPY = {
  nubrakes: {
    h1: 'Brake repair in your driveway.',
    lede: 'A certified technician comes to your home or work and fixes your brakes on the spot. You see the full price first and pay when the job is done.',
    bandTitle: 'NuBrakes is now part of Valvoline',
    band: 'Same technicians, same warranty, same app. Bookings and service history you already have carry over with nothing to do on your side.',
  },
  valvoline: {
    h1: 'Brakes fixed where you park.',
    lede: 'Valvoline now comes to you. A certified technician fixes your brakes at home or work. You see the full price first and pay when the job is done.',
    bandTitle: 'From the team that built NuBrakes',
    band: 'Mobile brake repair joins Valvoline. If you booked with NuBrakes before, your history and warranty work here too.',
  },
}

const STEPS = [
  { title: 'See your price', text: 'Vehicle, what you are noticing, and your ZIP. Parts and labor are itemised before we ask who you are.' },
  { title: 'Pick an arrival window', text: 'Two-hour windows, most days of the week. We text when the technician is 30 minutes out.' },
  { title: 'We fix it where you park', text: 'Driveway, garage or work lot. You do not need to stay if you leave the keys.' },
  { title: 'Approve, then pay', text: 'Anything beyond the quote needs your OK in the app. You pay when the work is finished.' },
]

const FAQ = [
  ['Do I need to be there?', 'No. Choose "I will leave the keys" when you book and tell us where. The technician texts photos when done.'],
  ['How much space does the technician need?', 'A flat spot with room to open the doors and the van parked behind or beside you. Most driveways and parking lots work.'],
  ['What if the technician finds something else?', 'They measure it, send you the reading and the price in the app, and wait for your answer. Saying no never changes the original quote.'],
  ['When do I pay?', 'After the work is finished and you have seen the report. Nothing is charged at booking.'],
  ['I booked with NuBrakes before. What changes?', 'Nothing you need to do. Your account, past visits and warranty carry over.'],
]

function SymptomHelper() {
  const [picked, setPicked] = useState([])
  const { update, draft } = useDraft()
  const nav = useNavigate()
  const rec = recommend(picked)
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  return (
    <div className="helper">
      <div className="helper-chips" role="group" aria-label="What are you noticing?">
        {SYMPTOMS.map((s) => (
          <button key={s.id} type="button" className={`chip${picked.includes(s.id) ? ' is-on' : ''}`} aria-pressed={picked.includes(s.id)} onClick={() => toggle(s.id)}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="helper-result" aria-live="polite">
        {rec ? (
          <>
            <p className="muted small">Most likely</p>
            <p className="helper-service">{SERVICES[rec.service].name}</p>
            {rec.urgent && <Alert tone="warning" title="Worth fixing soon">Drive gently and keep extra distance until then.</Alert>}
            <ul className="helper-notes">
              {rec.notes.map((n) => <li key={n.id}>{n.note}</li>)}
            </ul>
            <Button
              iconEnd={ArrowRight}
              onClick={() => {
                update({ symptoms: picked, mode: 'symptoms', service: rec.service })
                nav(draft.vehicle ? '/quote/issue' : '/quote/vehicle')
              }}
            >
              Price this for my car
            </Button>
          </>
        ) : (
          <p className="muted">Pick what you are noticing. You can choose more than one.</p>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const { brand } = useBrand()
  const t = COPY[brand]
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 className="display-xl">{t.h1}</h1>
            <p className="lede">{t.lede}</p>
            <ul className="trust-row">
              <li><ShieldCheck size={20} aria-hidden /> Warranty on parts and labor</li>
              <li><BadgeCheck size={20} aria-hidden /> ASE-certified technicians</li>
              <li><CreditCard size={20} aria-hidden /> Pay after the job</li>
            </ul>
          </div>
          <div className="hero-card">
            <UXNote id="price-first" className="uxnote-corner" />
            <QuoteStarter />
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap band-row">
          <h2 className="display-sm">{t.bandTitle} <UXNote id="acquisition" /></h2>
          <p>{t.band}</p>
        </div>
      </section>

      <section className="section" id="how" aria-labelledby="how-title">
        <div className="wrap">
          <h2 id="how-title" className="display-md">How a visit works</h2>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="step-num" aria-hidden>{i + 1}</span>
                <h3 className="step-title">{s.title}</h3>
                <p className="muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-split" aria-labelledby="fix-title">
        <div className="wrap split">
          <div className="split-side">
            <h2 id="fix-title" className="display-md">What we fix</h2>
            <p className="muted">Starting prices per axle for a compact car. Your quote is exact for your vehicle.</p>
            <Link to="/services" className="text-link">All services and prices <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <ul className="service-rows">
            {SERVICE_ORDER.map((id) => {
              const s = SERVICES[id]
              return (
                <li key={id}>
                  <Link to={`/services/${id}`} className="service-row">
                    <span className="service-row-main">
                      <span className="service-row-name">{s.name}</span>
                      <span className="muted small">{s.blurb}</span>
                    </span>
                    <span className="service-row-price">
                      <span className="muted small">from</span> <span className="num">{money(s.price.compact)}</span>
                    </span>
                    <ArrowRight size={18} aria-hidden className="service-row-arrow" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="section section-sunken" aria-labelledby="helper-title">
        <div className="wrap">
          <div className="section-head">
            <Gauge size={28} aria-hidden className="accent-icon" />
            <h2 id="helper-title" className="display-md">Not sure what you need?</h2>
            <p className="muted">Tell us what the car is doing. The technician measures everything before starting, so you are never locked into a guess.</p>
          </div>
          <SymptomHelper />
        </div>
      </section>

      <section className="section" aria-labelledby="reviews-title">
        <div className="wrap reviews">
          <h2 id="reviews-title" className="sr-only">What customers say</h2>
          <figure className="review-main">
            <blockquote>
              “I was on a work call in my kitchen. He sent me the rotor measurement, I tapped approve, and the car was done before my next meeting.”
            </blockquote>
            <figcaption>Priya S., Austin · pads and rotors</figcaption>
          </figure>
          <div className="review-side">
            <figure>
              <blockquote>“Price on the screen was the price on the invoice.”</blockquote>
              <figcaption>Tom R., Houston</figcaption>
            </figure>
            <figure>
              <blockquote>“Booked from the parking lot at work at lunch. Done by 3.”</blockquote>
              <figcaption>Alicia M., Dallas</figcaption>
            </figure>
            <p className="small muted">Sample reviews for the prototype.</p>
          </div>
        </div>
      </section>

      <section className="section section-sunken" id="areas" aria-labelledby="areas-title">
        <div className="wrap split">
          <div className="split-side">
            <h2 id="areas-title" className="display-md">Where we work</h2>
            <ul className="metro-list">
              {METROS.map((m) => <li key={m.id}>{m.name}</li>)}
            </ul>
          </div>
          <div>
            <p className="muted">Check your ZIP before you start.</p>
            <ServiceAreaCheck />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="wrap split">
          <div className="split-side">
            <h2 id="faq-title" className="display-md">Questions</h2>
          </div>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-cta">
        <div className="wrap cta-row">
          <h2 className="display-md">Price your brakes in about a minute.</h2>
          <Button to="/quote/vehicle" size="lg" iconEnd={ArrowRight}>Get a quote</Button>
        </div>
      </section>
    </>
  )
}
