import { Link, useParams } from 'react-router-dom'
import * as I from '../ui/icons.js'

// About a third of the product stays with the client. The navigation keeps them so the shape of the
// product is clear; the screens are replaced with a description of what was designed.
export const REDACTED = [
  { id: 'buying', name: 'Buying', icon: I.Buying, store: false, did: 'Open-to-buy by category and month, purchase orders to the houses, and season buy plans with the AI’s size curves.' },
  { id: 'finance', name: 'Finance', icon: I.Finance, store: false, did: 'Margin by boutique and category, consignment settlements, and the PPN-ready sales ledger.' },
  { id: 'cash', name: 'Cash flow', icon: I.Cash, store: false, did: 'Thirteen-week cash forecast from bank feeds, payables to the houses, and the weeks where the balance gets thin.' },
  { id: 'analytics', name: 'Analytics', icon: I.Analytics, store: true, did: 'Explorer for sales, stock and clients, where every chart can be asked about in words.' },
  { id: 'settings', name: 'Settings', icon: I.Settings, store: false, did: 'Roles and permissions, boutiques and display minimums, and integrations with POS terminals, couriers and the house portals.' },
]

export default function Redacted() {
  const { id } = useParams()
  const r = REDACTED.find((x) => x.id === id) || REDACTED[0]
  return (
    <div className="page">
      <header className="title-row"><div><h1>{r.name}</h1><p>Redacted under NDA.</p></div></header>
      <section className="card redacted" aria-label={`${r.name}, redacted`}>
        <div className="ghost" aria-hidden="true">
          <div className="ghost-kpis">{[0, 1, 2, 3].map((k) => <span key={k}><i style={{ width: '40%' }} /><b style={{ width: `${55 + k * 8}%` }} /></span>)}</div>
          <div className="ghost-body"><span className="ghost-chart" /><span className="ghost-list">{[0, 1, 2, 3, 4, 5].map((k) => <i key={k} style={{ width: `${90 - k * 9}%` }} />)}</span></div>
        </div>
        <div className="redacted-note">
          <I.LockLg />
          <h2>This module stays with the client</h2>
          <p>{r.did}</p>
          <p className="muted">It was part of the engagement. Its screens, figures and flows are covered by the NDA, so they are not shown here. The AI patterns it uses are the same ones you can try in Today, Decisions and Ask.</p>
          <Link className="btn" to="/">Read the case notes</Link>
        </div>
      </section>
    </div>
  )
}
