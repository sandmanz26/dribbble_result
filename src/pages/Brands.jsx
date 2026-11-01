import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import UilWhatsapp from '@iconscout/react-unicons/icons/uil-whatsapp'
import UilEnvelope from '@iconscout/react-unicons/icons/uil-envelope'
import { useStore } from '../store.jsx'
import { BRANDS, PAST_BRAND_PAYMENTS, TODAY, rp, relDay, daysBetween, paymentsOf } from '../data/studio.js'
import { Logo, Mono, Pill } from '../ui.jsx'

export default function Brands() {
  const { deals } = useStore()
  const [params] = useSearchParams()
  const focus = params.get('b')
  const [f, setF] = useState('all')
  const rows = Object.entries(BRANDS).map(([key, b]) => {
    const mine = deals.filter((d) => d.brand === key)
    const received = mine.flatMap(paymentsOf).filter((p) => p.state === 'paid').reduce((t, p) => t + p.gross, 0)
      + PAST_BRAND_PAYMENTS.filter((p) => p.brand === b.name).reduce((t, p) => t + p.gross, 0)
    const late = mine.flatMap(paymentsOf).some((p) => p.state === 'late')
    const quiet = daysBetween(b.lastContact, TODAY)
    const live = mine.filter((d) => d.stage !== 'paid').length
    const repeat = mine.length + PAST_BRAND_PAYMENTS.filter((p) => p.brand === b.name).length
    return { key, b, received, late, quiet, live, repeat, follow: late || (quiet > 7 && b.next !== '-') }
  }).sort((a, z) => Number(z.follow) - Number(a.follow) || z.received - a.received)
  const shown = rows.filter((r) => f === 'all' || r.follow)
  const total = rows.reduce((t, r) => t + r.received, 0)
  return (
    <>
      <div className="title-row">
        <div>
          <h1>Brands</h1>
          <p className="sub"><b>{rows.filter((r) => r.follow).length} brands need a follow-up.</b> {rows.length} brands have paid you {rp(total)} since June, before tax and Riuh’s share.</p>
        </div>
        <div className="seg" role="tablist" aria-label="Brands">{[['all', 'All'], ['follow', 'Needs follow-up']].map(([k, l]) => <button key={k} role="tab" aria-selected={f === k} onClick={() => setF(k)}>{l} <span className="muted">{k === 'all' ? rows.length : rows.filter((r) => r.follow).length}</span></button>)}</div>
      </div>
      <section className="panel" style={{ marginTop: 24 }} aria-label="Brand relationships">
        <div className="table-wrap">
          <table className="t brands">
            <thead><tr><th>Brand</th><th>Contact</th><th>Next step</th><th className="r">Deals</th><th className="r">Paid since June</th><th className="r">Last talked</th></tr></thead>
            <tbody>
              {shown.map(({ key, b, received, late, quiet, live, repeat, follow }) => {
                const deal = deals.find((d) => d.brand === key && d.stage !== 'paid') || deals.find((d) => d.brand === key)
                return (
                  <tr key={key} className={focus === key ? 'hl' : ''}>
                    <td><span style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Logo brand={key} size={36} /><span><b style={{ fontWeight: 600 }}>{b.name}</b><span className="muted" style={{ display: 'block', fontSize: 12 }}>{b.category}{repeat > 1 ? ` · worked together ${repeat} times` : ''}</span></span></span></td>
                    <td><span style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Mono name={b.pic} hue={b.hue} size={28} /><span><span style={{ display: 'block' }}>{b.pic}</span><span className="muted" style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>{b.channel === 'WhatsApp' ? <UilWhatsapp size={12} /> : <UilEnvelope size={12} />}{b.role}</span></span></span></td>
                    <td>{deal ? <Link to={`/deals/${deal.id}`} className={late ? '' : 'link'} style={late ? { color: 'var(--negative)', fontWeight: 500 } : {}}>{b.next}</Link> : b.next}</td>
                    <td className="r num">{live ? <Pill tone="acc">{live} live</Pill> : <span className="muted">-</span>}</td>
                    <td className="r num">{received ? rp(received) : <span className="muted">Rp0</span>}</td>
                    <td className="r num"><span style={{ color: follow && !late && quiet > 7 ? 'var(--warning)' : undefined }}>{relDay(b.lastContact)}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
