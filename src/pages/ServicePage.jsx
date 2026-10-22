import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Clock } from 'lucide-react'
import { money, SERVICE_ORDER, SERVICES } from '../data/services.js'
import { SIZE_LABEL } from '../data/vehicles.js'
import { QuoteStarter } from '../flows/QuoteStarter.jsx'
import NotFound from './NotFound.jsx'

export default function ServicePage() {
  const { id } = useParams()
  const s = SERVICES[id]
  if (!s) return <NotFound />
  const others = SERVICE_ORDER.filter((x) => x !== id)
  return (
    <>
      <section className="section">
        <div className="wrap hero-grid">
          <div className="stack-md">
            <Link to="/services" className="text-link back-link"><ArrowLeft size={16} aria-hidden /> All services</Link>
            <h1 className="display-lg">{s.name}</h1>
            <p className="lede">{s.blurb}</p>
            <p className="meta-line"><Clock size={18} aria-hidden /> {s.hours}, at your home or work</p>

            <div className="two-col">
              <div>
                <h2 className="display-xs">What is included</h2>
                <ul className="check-list">
                  {s.includes.map((x) => <li key={x}><Check size={18} aria-hidden /> {x}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="display-xs">Signs you need it</h2>
                <ul className="dash-list">
                  {s.signs.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="display-xs">Price by vehicle</h2>
              <dl className="lines lines-wide">
                {Object.entries(s.price).map(([k, v]) => (
                  <div key={k}><dt>{SIZE_LABEL[k]}</dt><dd className="num">{money(v)}{s.perAxle ? ' per axle' : ''}</dd></div>
                ))}
              </dl>
              <p className="small muted">Standard parts. Sample prices for the prototype.</p>
            </div>
          </div>
          <div className="hero-card sticky-card">
            <QuoteStarter title={`Price ${s.short.toLowerCase()} for your car`} service={id} />
          </div>
        </div>
      </section>
      <section className="section section-sunken">
        <div className="wrap">
          <h2 className="display-sm">Other brake work</h2>
          <ul className="inline-links">
            {others.map((o) => <li key={o}><Link to={`/services/${o}`}>{SERVICES[o].name}</Link></li>)}
          </ul>
        </div>
      </section>
    </>
  )
}
