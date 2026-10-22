// Phone version of the price board: one vehicle type at a time, defaulting to the customer's own
// car when we know it. The full matrix stays on wider screens (CSS swaps .size-board-phone in).
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDraft } from '../flows/draft.jsx'
import { money, SERVICE_ORDER, SERVICES } from '../data/services.js'
import { SIZE_LABEL } from '../data/vehicles.js'
import { Segmented } from '../ui/index.jsx'

export const SIZES = ['compact', 'mid', 'suv', 'truck', 'ev']
const SHORT = { compact: 'Compact', mid: 'Midsize', suv: 'SUV', truck: 'Pickup', ev: 'EV' }

export function PriceBySize({ className = '' }) {
  const { size } = useDraft()
  const [z, setZ] = useState(size || 'compact')
  return (
    <div className={`size-board-phone stack-sm ${className}`}>
      <Segmented label="Vehicle type" size="sm" value={z} onChange={setZ} options={SIZES.map((x) => ({ value: x, label: SHORT[x] }))} />
      <table className="size-board">
        <thead>
          <tr><th scope="col">Service</th><th scope="col" className="num">{SIZE_LABEL[z]}</th></tr>
        </thead>
        <tbody>
          {SERVICE_ORDER.map((id) => (
            <tr key={id}>
              <th scope="row">
                <Link to={`/services/${id}`}>{SERVICES[id].name}</Link>
                <span className="muted small">{SERVICES[id].perAxle ? 'Per axle' : 'Per visit'}</span>
              </th>
              <td className="num">{money(SERVICES[id].price[z])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
