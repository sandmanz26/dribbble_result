import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { money, SERVICE_ORDER, SERVICES } from '../data/services.js'
import { SIZE_LABEL } from '../data/vehicles.js'

const SIZES = ['compact', 'mid', 'suv', 'truck', 'ev']

export default function Services() {
  return (
    <section className="section">
      <div className="wrap stack-lg">
        <div className="page-head">
          <h1 className="display-lg">Services and prices</h1>
          <p className="lede">Standard parts, labor included, per axle unless noted. Sales tax applies to parts. Your quote shows the exact total for your vehicle.</p>
        </div>
        <div className="table-scroll" role="region" aria-label="Prices by vehicle type" tabIndex={0}>
          <table className="price-table">
            <thead>
              <tr>
                <th scope="col">Service</th>
                {SIZES.map((s) => <th scope="col" key={s} className="num">{SIZE_LABEL[s]}</th>)}
              </tr>
            </thead>
            <tbody>
              {SERVICE_ORDER.map((id) => {
                const s = SERVICES[id]
                return (
                  <tr key={id}>
                    <th scope="row">
                      <Link to={`/services/${id}`}>{s.name}</Link>
                      <span className="muted small">{s.perAxle ? 'Per axle' : 'Per visit'} · {s.hours}</span>
                    </th>
                    {SIZES.map((z) => <td key={z} className="num">{money(s.price[z])}</td>)}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="small muted">Sample prices for the prototype.</p>
        <Link to="/quote/vehicle" className="text-link">Get the exact price for your car <ArrowRight size={16} aria-hidden /></Link>
      </div>
    </section>
  )
}
