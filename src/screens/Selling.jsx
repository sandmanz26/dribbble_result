import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { PRODUCTS, CLIENTS, PEOPLE, productOf, clientOf, placeName, PLACES, idr, full } from '../data/world.js'
import { AiTag, ClientAvatar, Photo, Pill } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

const METHODS = ['Card', 'QRIS', 'Bank transfer']

// A lean point of sale for the boutique floor: who it is for, what, then payment.
export default function Selling() {
  const { s, dispatch, me, role } = useStore()
  const [client, setClient] = useState(null)
  const [lines, setLines] = useState([])
  const [q, setQ] = useState('')
  const [method, setMethod] = useState('Card')
  const [done, setDone] = useState(null)
  const advisor = role.id === 'owner' ? 'dimas' : me.id
  const results = PRODUCTS.filter((p) => `${p.name} ${p.variant}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
  const total = lines.reduce((t, l) => t + productOf(l).price, 0)
  const c = client ? clientOf(client) : null
  const tips = assist(c, lines)

  if (done) {
    return (
      <div className="page">
        <header className="title-row"><div><h1>Sale {done.id} complete</h1><p>{idr(done.total)} by {done.method}, {done.time}. Credited to {PEOPLE[done.advisor].name}.</p></div><div className="title-actions"><button className="btn is-primary" onClick={() => { setDone(null); setLines([]); setClient(null) }}>New sale</button></div></header>
        <div className="grid">
          <section className="card s7 receipt" aria-label="Receipt">
            <p className="muted small">Plaza Senayan · {done.time} · {done.id}</p>
            <ul className="rlines">{done.lines.map((id, i) => <li key={i}><Photo id={id} size="sm" /><span className="cell-2">{productOf(id).name}<small>{productOf(id).variant}</small></span><span className="num">{full(productOf(id).price)}</span></li>)}</ul>
            <p className="rtotal"><span>Total, PPN included</span><span className="num">IDR {full(done.total)}</span></p>
            <p className="muted small">{done.client ? `Attached to ${clientOf(done.client).name}’s profile. Receipt sent by e-mail.` : 'Walk-in. No client attached.'}</p>
          </section>
          <section className="card ai s5">
            <div className="card-head"><h2>What happens next</h2><AiTag /></div>
            <ul className="brief-points">
              <li>Stock is updated in every boutique at once. {done.lines.some((id) => productOf(id).stock[0] <= 1) ? 'One of these was the last here; I will propose a replenishment at 07:00.' : ''}</li>
              {done.client && <li>A thank-you note for {clientOf(done.client).name.split(' ')[0]} is drafted for tomorrow morning. You send it.</li>}
              <li>The sale counts toward {PEOPLE[done.advisor].short}’s book and today’s plan.</li>
            </ul>
            <Link className="btn is-sm" to="/today">Back to today</Link>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="title-row"><div><h1>New sale</h1><p>Plaza Senayan, by {PEOPLE[advisor].name}. Prices include PPN.</p></div></header>
      <div className="grid">
        <div className="s7 stack">
          <section className="card" aria-labelledby="h-for">
            <div className="card-head"><h2 id="h-for">For</h2>{c && <button className="btn is-sm is-quiet" onClick={() => setClient(null)}>Change</button>}</div>
            {c ? (
              <div className="for-client"><ClientAvatar client={c} /><span className="cell-2">{c.name} <small>{c.tier} · {c.sizes}</small></span><Link className="link small" to={`/clients/${c.id}`}>Profile</Link></div>
            ) : (
              <div className="chips">{CLIENTS.filter((x) => x.store === 'psn').map((x) => <button key={x.id} className="chip" onClick={() => setClient(x.id)}>{x.name}</button>)}<button className="chip" onClick={() => setClient(null)}>Walk-in</button></div>
            )}
          </section>
          <section className="card is-flush" aria-labelledby="h-items">
            <div className="card-head"><h2 id="h-items">Add pieces</h2></div>
            <div className="pad-x"><label className="search is-full"><I.Search /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search or scan a tag" aria-label="Search pieces" /></label></div>
            <ul className="rows">
              {results.map((p) => (
                <li key={p.id} className="row-static">
                  <Photo id={p.id} size="sm" />
                  <span className="cell-2">{p.name}<small>{p.variant} · here {p.stock[0]}</small></span>
                  <span className="num">{idr(p.price)}</span>
                  <button className="btn is-sm" disabled={p.stock[0] === 0} onClick={() => setLines([...lines, p.id])}>{p.stock[0] ? 'Add' : 'Not here'}</button>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="s5 stack">
          <section className="card" aria-labelledby="h-bag">
            <div className="card-head"><h2 id="h-bag">This sale</h2><span className="meta">{lines.length} {lines.length === 1 ? 'piece' : 'pieces'}</span></div>
            {lines.length ? (
              <ul className="rlines">{lines.map((id, i) => <li key={i}><Photo id={id} size="sm" /><span className="cell-2">{productOf(id).name}<small>{productOf(id).variant}</small></span><span className="num">{full(productOf(id).price)}</span><button className="btn is-quiet is-sm" aria-label="Remove" onClick={() => setLines(lines.filter((_, k) => k !== i))}><I.Close /></button></li>)}</ul>
            ) : <p className="empty-line is-box">Add a piece from the list, or scan its tag.</p>}
            <p className="rtotal"><span>Total</span><span className="num">IDR {full(total)}</span></p>
            <div className="seg is-full" role="radiogroup" aria-label="Payment">{METHODS.map((m) => <button key={m} role="radio" aria-checked={method === m} onClick={() => setMethod(m)}>{m}</button>)}</div>
            <button className="btn is-primary is-wide" disabled={!lines.length} onClick={() => {
              const sale = { id: `S-1042${s.sales.length + 2}`, lines, total, method, client, advisor, time: '10:46' }
              dispatch({ type: 'sale', sale }); setDone(sale)
            }}>Take payment, {idr(total)}</button>
          </section>
          {tips.length > 0 && (
            <section className="card ai" aria-labelledby="h-assist">
              <div className="card-head"><h2 id="h-assist">Selvedge noticed</h2><AiTag text="Selvedge" /></div>
              <ul className="brief-points">{tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function assist(c, lines) {
  const out = []
  if (c?.id === 'anindya') out.push('She takes shoes in 37. The Tirta pump in rosso is here in 37; in nero, 37 is sold out here but 2 pairs are at Pondok Indah.')
  if (c?.hold) out.push(`She has the ${productOf(c.hold.item).name} on hold until 17:00. Add it to this sale to close the hold.`)
  if (c?.waitlist) out.push(`She is waiting for the ${productOf(c.waitlist.item).name}. Do not promise one; allocation is decided on Monday.`)
  const last = lines.find((id) => productOf(id).stock[0] - lines.filter((x) => x === id).length === 0)
  if (last) out.push(`This is the last ${productOf(last).name} here. ${PLACES.slice(1, 6).filter((pl, i) => productOf(last).stock[i + 1] > 0).map(placeName).slice(0, 2).join(' and ')} still have some.`)
  if (lines.length && !c) out.push('Attach a client to credit the sale to their advisor and keep their sizes up to date.')
  return out
}
export { Pill }
