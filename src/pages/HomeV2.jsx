// V2 "Job ticket" home. Same content model as V1, different hierarchy: the quote is a full-width
// search strip, prices are a board you can scan, the visit is a timeline with real times.
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useBrand } from '../brand/BrandContext.jsx'
import { useQuoteStart, VehicleInputs } from '../flows/QuoteStarter.jsx'
import { useDraft } from '../flows/draft.jsx'
import { METROS } from '../data/areas.js'
import { money, SERVICE_ORDER, SERVICES, SYMPTOMS } from '../data/services.js'
import { SIZE_LABEL } from '../data/vehicles.js'
import { ServiceAreaCheck } from '../service/index.jsx'
import { Alert, Button, Field, Input } from '../ui/index.jsx'
import { UXNote } from '../ui/UXNote.jsx'
import { FAQ } from './Home.jsx'

const COPY = {
  nubrakes: {
    h1: 'Your brakes, fixed where the car is parked.',
    lede: 'Plate and ZIP give you a full price. A certified technician comes to your home or work, and you pay when the job is done.',
    notice: 'NuBrakes is now part of Valvoline. Your account, past visits and warranty carry over.',
  },
  valvoline: {
    h1: 'Valvoline brake service, at your curb.',
    lede: 'Plate and ZIP give you a full price. A certified technician comes to your home or work, and you pay when the job is done.',
    notice: 'Mobile brake service from the team that built NuBrakes. NuBrakes accounts, history and warranties work here too.',
  },
}

const FACTS = [
  ['Price', 'Shown before we ask who you are'],
  ['Payment', 'After the job, never at booking'],
  ['Technicians', 'ASE certified in brakes'],
  ['Warranty', 'Parts and labor'],
]

const VISIT = [
  ['Now', 'Price and arrival window', 'About a minute. Vehicle, what you are noticing and your ZIP. No account needed.'],
  ['Day before, 6 pm', 'You get your technician', 'Name, certification and the van to look for, by text.'],
  ['On the day', 'A 30-minute heads-up', 'A text when they set off, with a live arrival time on your booking page.'],
  ['1 to 2 hours', 'The work, where you parked', 'Anything beyond the quote comes to your phone for a yes or no first.'],
  ['After', 'Report, then payment', 'Measurements for every wheel, then a payment link. The warranty starts that day.'],
]

const SIZES = ['compact', 'mid', 'suv', 'truck', 'ev']

function QuoteStrip() {
  const q = useQuoteStart()
  return (
    <form className="strip-form" onSubmit={q.submit} noValidate aria-label="See your price">
      <UXNote id="price-first" className="uxnote-corner" />
      <div className={`strip strip-${q.entry}`}>
        <VehicleInputs entry={q.entry} value={q.v} errors={q.errors} onChange={(p) => q.setV((x) => ({ ...x, ...p }))} />
        <Field label="ZIP where it is parked" error={q.errors.zip}>
          {(a) => <Input {...a} inputMode="numeric" autoComplete="postal-code" maxLength={5} value={q.zip} onChange={(e) => q.setZip(e.target.value.replace(/\D/g, ''))} />}
        </Field>
        <Button type="submit" size="lg" loading={q.busy} iconEnd={ArrowRight} className="strip-go">
          {q.busy ? 'Finding it' : 'See my price'}
        </Button>
      </div>
      {q.lookupError === 'not_found' && (
        <Alert tone="warning" title="We could not match that plate" action={<Button type="button" size="sm" variant="ghost" onClick={() => q.switchEntry('ymm')}>Use make and model</Button>}>
          New plates can take a few weeks to show up.
        </Alert>
      )}
      {q.lookupError === 'network' && <Alert tone="danger" title="Plate lookup is not responding">Try again, or use make and model.</Alert>}
      <p className="strip-foot small muted">
        <button type="button" className="link-btn" onClick={() => q.switchEntry(q.entry === 'plate' ? 'ymm' : 'plate')}>
          {q.entry === 'plate' ? 'No plate handy? Use make and model' : 'Use the license plate instead'}
        </button>
        <span>No phone number or email until you book.</span>
      </p>
    </form>
  )
}

export default function HomeV2() {
  const { brand } = useBrand()
  const { update, draft } = useDraft()
  const nav = useNavigate()
  const t = COPY[brand]

  return (
    <div className="v2-home">
      <section className="v2-hero">
        <div className="wrap stack-lg">
          <div className="v2-hero-head">
            <h1 className="display-xl">{t.h1}</h1>
            <p className="lede">{t.lede}</p>
          </div>
          <QuoteStrip />
          <dl className="v2-facts">
            {FACTS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </section>

      <div className="v2-notice">
        <p className="wrap">{t.notice} <UXNote id="acquisition" /></p>
      </div>

      <section className="section" aria-labelledby="board-title">
        <div className="wrap stack-md">
          <div className="v2-head">
            <h2 id="board-title" className="display-md">Prices</h2>
            <p className="muted">Standard parts and labor, per axle unless noted. Sample prices for the prototype.</p>
          </div>
          <div className="table-scroll v2-board-wrap" role="region" aria-label="Prices by vehicle type" tabIndex={0}>
            <table className="v2-board">
              <thead>
                <tr><th scope="col">Service</th>{SIZES.map((z) => <th scope="col" key={z} className="num">{SIZE_LABEL[z]}</th>)}</tr>
              </thead>
              <tbody>
                {SERVICE_ORDER.map((id) => (
                  <tr key={id}>
                    <th scope="row"><Link to={`/services/${id}`}>{SERVICES[id].name}</Link><span className="muted small">{SERVICES[id].hours}</span></th>
                    {SIZES.map((z) => <td key={z} className="num">{money(SERVICES[id].price[z])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section v2-ruled" id="how" aria-labelledby="visit-title">
        <div className="wrap v2-two">
          <h2 id="visit-title" className="display-md">What a visit looks like</h2>
          <ol className="v2-timeline">
            {VISIT.map(([when, title, text]) => (
              <li key={title}>
                <span className="v2-when">{when}</span>
                <div>
                  <h3 className="step-title">{title}</h3>
                  <p className="muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section v2-ruled" aria-labelledby="sym-title">
        <div className="wrap stack-md">
          <div className="v2-head">
            <h2 id="sym-title" className="display-md">Match the symptom</h2>
            <p className="muted">The technician measures before any work, so a guess here never locks you in.</p>
          </div>
          <div className="table-scroll" role="region" aria-label="Symptoms and likely repairs" tabIndex={0}>
            <table className="v2-symptoms">
              <thead><tr><th scope="col">You notice</th><th scope="col">Usually means</th><th scope="col">We quote</th><th scope="col"><span className="sr-only">Action</span></th></tr></thead>
              <tbody>
                {SYMPTOMS.map((s) => (
                  <tr key={s.id}>
                    <th scope="row">{s.label}</th>
                    <td className="muted">{s.note}</td>
                    <td>{SERVICES[s.service].short}</td>
                    <td>
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => {
                          update({ symptoms: [s.id], mode: 'symptoms', service: s.service })
                          nav(draft.vehicle ? '/quote/issue' : '/quote/vehicle')
                        }}
                      >
                        Price it <ArrowRight size={14} aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section v2-ruled" id="areas" aria-labelledby="areas-title">
        <div className="wrap v2-two">
          <div className="stack-md">
            <h2 id="areas-title" className="display-md">Where we work</h2>
            <ul className="v2-metros">
              {METROS.map((m) => (
                <li key={m.id}><span>{m.name}</span><span className="num muted">{m.prefixes.map((p) => `${p}xx`).join(', ')}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <ServiceAreaCheck />
          </div>
        </div>
      </section>

      <section className="section v2-ruled" aria-labelledby="faq-title">
        <div className="wrap stack-md">
          <h2 id="faq-title" className="display-md">Questions</h2>
          <dl className="v2-faq">
            {FAQ.map(([q, a]) => <div key={q}><dt>{q}</dt><dd className="muted">{a}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="section v2-ruled">
        <div className="wrap cta-row">
          <h2 className="display-md">Price your brakes in about a minute.</h2>
          <Button to="/quote/vehicle" size="lg" iconEnd={ArrowRight}>Get a quote</Button>
        </div>
      </section>
    </div>
  )
}
