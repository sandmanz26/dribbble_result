import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { PRODUCTS, STORES, PLACES, CLIENTS, productOf, placeName, units, rate, cover, soldByStore, idr, full, clientOf } from '../data/world.js'
import { KIRANA_DAYS } from '../data/ai.js'
import { AiTag, Dialog, Photo, Pill, Toast, useToast } from '../ui/kit.jsx'
import { Bars } from '../ui/charts.jsx'
import * as I from '../ui/icons.js'

const SHORT = { psn: 'PSN', pi: 'PI', pp: 'PP', pim: 'PIM', tp: 'TP', smy: 'SMY', dc: 'DC' }
const CATS = ['All', 'Bags', 'Shoes', 'Small leather', 'Jewellery', 'Ready to wear', 'Accessories']

// What Selvedge notices about a piece, one sentence, with the decision it leads to.
export function noteFor(p) {
  if (p.id === 'kirana-top-handle') return { text: `Runs out at Plaza Senayan in about ${KIRANA_DAYS} days. Pacific Place has 4 that have not sold in 5 weeks.`, decision: 'D-118', tone: 'ai' }
  if (p.id === 'tirta-pump-nero') return { text: `Best-selling shoe of the season. ${p.broken}.`, decision: 'D-120', tone: 'ai' }
  if (p.id === 'arunika-structured') return { text: `${p.inbound} arrive Monday for ${p.waitlist} clients on the waitlist.`, decision: 'D-119', tone: 'ai' }
  if (p.id === 'senja-hobo') return { text: 'Seminyak holds 5 and sold none in 5 weeks; Plaza Indonesia is selling it.', decision: 'D-122', tone: 'ai' }
  if (cover(p) > 26) return { text: `About ${Math.round(cover(p))} weeks of stock at this rate. Worth watching after the December peak.`, tone: '' }
  return null
}

export default function Stock() {
  const nav = useNavigate()
  const { role } = useStore()
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const rows = PRODUCTS.filter((p) => (cat === 'All' || p.cat === cat) && `${p.name} ${p.variant}`.toLowerCase().includes(q.toLowerCase()))
  const total = PRODUCTS.reduce((t, p) => t + units(p), 0)
  const value = PRODUCTS.reduce((t, p) => t + units(p) * p.price, 0)
  return (
    <div className="page">
      <header className="title-row">
        <div><h1>Stock</h1><p>{PRODUCTS.length} styles, {full(total)} pieces worth {idr(value)} at retail, across {STORES.length} boutiques and Cikarang. Counted 29 Oct, 07:00.</p></div>
      </header>
      <div className="toolbar">
        <label className="search"><I.Search /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search styles" aria-label="Search styles" /></label>
        <div className="seg" role="tablist" aria-label="Category">
          {CATS.map((c) => <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}>{c} <span className="num muted">{c === 'All' ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === c).length}</span></button>)}
        </div>
      </div>
      <section className="card is-flush" aria-label="Styles">
        <div className="tbl-scroll">
          <table className="tbl stock-tbl">
            <thead><tr><th>Style</th>{PLACES.map((pl) => <th key={pl} className={`num ${role.id !== 'owner' && pl === 'psn' ? 'is-here' : ''}`} title={placeName(pl)}>{SHORT[pl]}</th>)}<th className="num">Total</th><th className="num">Sold, 4 wks</th><th className="num">Cover</th><th>Selvedge</th></tr></thead>
            <tbody>
              {rows.map((p) => {
                const n = noteFor(p)
                return (
                  <tr key={p.id} className="is-link" onClick={() => nav(`/stock/${p.id}`)}>
                    <td><span className="with-ph"><Photo id={p.id} size="sm" /><span className="cell-2"><Link to={`/stock/${p.id}`} onClick={(e) => e.stopPropagation()}>{p.name}</Link><small>{p.variant} · {idr(p.price)}</small></span></span></td>
                    {p.stock.map((n2, i) => <td key={i} className={`num ${n2 === 0 ? 'is-zero' : ''} ${role.id !== 'owner' && i === 0 ? 'is-here' : ''}`}>{n2}</td>)}
                    <td className="num"><b>{units(p)}</b></td>
                    <td className="num">{p.weekly.slice(-4).reduce((t, x) => t + x, 0)}</td>
                    <td className="num">{Number.isFinite(cover(p)) ? `${cover(p).toFixed(1)} wk` : '-'}</td>
                    <td className="note-cell">{n ? <span className={n.tone === 'ai' ? 'ai-note' : 'muted'}>{n.decision ? <><I.Spark /> {n.decision}</> : 'Watch'}</span> : <span className="muted">-</span>}</td>
                  </tr>
                )
              })}
              {!rows.length && <tr><td colSpan={12} className="empty-row">No style matches “{q}”.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      <p className="foot-note">PSN Plaza Senayan, PI Plaza Indonesia, PP Pacific Place, PIM Pondok Indah Mall, TP Tunjungan Plaza, SMY Seminyak, DC Cikarang. Cover is weeks of stock at the last 4 weeks’ rate of sale.</p>
    </div>
  )
}

export function Product() {
  const { id } = useParams()
  const { s, dispatch, me, role } = useStore()
  const [holdAt, setHoldAt] = useState(null)
  const [client, setClient] = useState('wulan')
  const [hours, setHours] = useState(48)
  const [toast, show] = useToast()
  const p = productOf(id)
  const forecast = useMemo(() => (p ? [rate(p), rate(p) * 1.1, rate(p) * 1.25, rate(p) * 1.4].map((x) => Math.round(x)) : []), [p])
  if (!p) return <div className="page"><h1>Style not found</h1><Link className="link" to="/stock">Back to stock</Link></div>
  const n = noteFor(p)
  const myHolds = s.holds.filter((h) => h.product === p.id)
  const held = (pl) => (p.id === 'laras-mini' && pl === 'psn' ? 1 : 0) + myHolds.filter((h) => h.store === pl).length
  const weeks = ['7 Sep', '14', '21', '28', '5 Oct', '12', '19', '26', '2 Nov', '9', '16', '23']
  const data = [...p.weekly, ...forecast].map((v, i) => [weeks[i], v])
  const guide = s.guide?.id === 'hold'

  const confirmHold = () => {
    dispatch({ type: 'hold', hold: { product: p.id, store: holdAt, client, hours, by: me.name } })
    if (guide) { dispatch({ type: 'learned', id: 'hold' }); dispatch({ type: 'guide', guide: { id: 'hold', step: 4 } }) }
    setHoldAt(null)
    show(<span>Held for {clientOf(client).name} at {placeName(holdAt)} for {hours} hours.{holdAt !== 'psn' ? ` ${placeName(holdAt)} is asked to send it to Plaza Senayan.` : ''}</span>)
  }

  return (
    <div className="page">
      <nav className="crumbs"><Link to="/stock">Stock</Link><I.Right /><span>{p.name}</span></nav>
      <header className="obj-head card">
        <Photo id={p.id} size="lg" alt={`${p.name}, ${p.variant}`} />
        <div className="obj-main">
          <h1>{p.name}</h1>
          <p className="muted">{p.variant} · {p.cat} · Autumn Winter 26 · <span className="mono">{p.id.toUpperCase().slice(0, 12)}</span></p>
          <p className="obj-price num">{idr(p.price)}</p>
        </div>
        <dl className="obj-figs">
          <div><dt>In the group</dt><dd className="num">{units(p)}</dd></div>
          <div><dt>Sold, 4 weeks</dt><dd className="num">{p.weekly.slice(-4).reduce((t, x) => t + x, 0)}</dd></div>
          <div><dt>Cover</dt><dd className="num">{Number.isFinite(cover(p)) ? `${cover(p).toFixed(1)} wk` : '-'}</dd></div>
        </dl>
      </header>

      <div className="grid">
        <section className="card ai s5 sees-card" aria-labelledby="h-sees">
          <div className="card-head"><h2 id="h-sees">What Selvedge sees</h2><AiTag text="Selvedge" when="07:00" sources={['Sales by boutique, 8 weeks', 'Stock on hand', 'Holds and waitlists']} /></div>
          {n ? <p className="big-note">{n.text}</p> : <p className="big-note">Selling at its usual rate everywhere. Nothing to do.</p>}
          {p.id === 'kirana-top-handle' && (
            <ul className="scen" aria-label="Two futures">
              <li><span><b>If nothing moves</b><br />Plaza Senayan sells out around {KIRANA_DAYS === 8 ? '6 November' : 'next week'}</span><span className="num">−{idr(2 * p.price)}</span></li>
              <li><span><b>If 2 move from Pacific Place</b><br />Stock lasts past the December peak</span><span className="num">kept</span></li>
            </ul>
          )}
          {p.id !== 'kirana-top-handle' && (() => {
            const sold = soldByStore(p); const names = STORES.map((x) => x.name)
            const hi = sold.indexOf(Math.max(...sold)); const lo = sold.indexOf(Math.min(...sold))
            return (
              <ul className="sees-facts">
                <li><span>Sells best at</span><span>{names[hi]}, {sold[hi]} in 4 weeks</span></li>
                <li><span>Slowest at</span><span>{names[lo]}, {sold[lo]} in 4 weeks</span></li>
                <li><span>Next 4 weeks, group</span><span className="num">{forecast.reduce((t, x) => t + x, 0)} units likely</span></li>
              </ul>
            )
          })()}
          {n?.decision && <Link className="btn is-sm" to={`/decisions/${n.decision}`} style={{ justifySelf: 'start', alignSelf: 'flex-start' }}>Open {n.decision}</Link>}
          <p className="muted small conf">Forecast is likely, not certain: based on {p.weekly.reduce((t, x) => t + x, 0)} sales in 8 weeks{p.weekly.reduce((t, x) => t + x, 0) < 8 ? ', which is few, so treat it as a rough guide' : ''}.</p>
        </section>
        <section className="card s7" aria-labelledby="h-sales">
          <div className="card-head"><h2 id="h-sales">Units sold per week, group</h2><span className="meta"><span className="key-ink" /> Sold <span className="key-ai" /> Forecast</span></div>
          <Bars data={data} fc={4} mark={8} height={180} label={`${p.name} units sold per week and forecast`} />
        </section>

        <section className="card is-flush s12" aria-labelledby="h-where" data-guide="stock-table">
          <div className="card-head"><h2 id="h-where">Stock by boutique</h2><span className="meta">Hold for a client for up to 48 hours, or 72 with an appointment</span></div>
          <table className="tbl">
            <thead><tr><th>Where</th><th className="num">On hand</th><th className="num hide-sm">On hold</th><th className="num">Free</th><th className="num hide-sm">Sold, 4 wks</th><th /></tr></thead>
            <tbody>
              {PLACES.map((pl, i) => {
                const h = held(pl); const free = p.stock[i] - h
                return (
                  <tr key={pl} className={role.id !== 'owner' && pl === 'psn' ? 'is-here-row' : ''}>
                    <td><span className="cell-2">{placeName(pl)}{role.id !== 'owner' && pl === 'psn' ? <small>Your boutique</small> : pl === 'dc' ? <small>Warehouse, ships next day</small> : null}</span></td>
                    <td className="num">{p.stock[i]}</td>
                    <td className="num hide-sm">{h || <span className="muted">0</span>}</td>
                    <td className="num">{free}</td>
                    <td className="num hide-sm">{pl === 'dc' ? '-' : soldByStore(p)[i]}</td>
                    <td className="num">{free > 0 ? <button className="btn is-sm" data-guide={`hold-${pl}`} onClick={() => { setHoldAt(pl); if (guide) dispatch({ type: 'guide', guide: { id: 'hold', step: 2 } }) }}>Hold</button> : <span className="muted small">None free</span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {(p.id === 'laras-mini' || myHolds.length > 0) && (
            <ul className="holds">
              {p.id === 'laras-mini' && <li><I.Clock /> 1 at Plaza Senayan for Wulan Sasmita until today 17:00, placed by Intan</li>}
              {myHolds.map((h, k) => <li key={k}><I.Clock /> 1 at {placeName(h.store)} for {clientOf(h.client).name}, {h.hours} hours, placed by {h.by}</li>)}
            </ul>
          )}
        </section>
      </div>

      <Dialog open={!!holdAt} onClose={() => setHoldAt(null)} title={`Hold at ${placeName(holdAt || 'psn')}`}>
        <label className="field" data-guide="hold-client"><span>For</span>
          <div className="radios" role="radiogroup">
            {CLIENTS.filter((c) => c.store === 'psn').slice(0, 5).map((c) => <button key={c.id} role="radio" aria-checked={client === c.id} onClick={() => { setClient(c.id); if (guide) dispatch({ type: 'guide', guide: { id: 'hold', step: 3 } }) }}><span className="radio" />{c.name}<small className="muted"> · {c.tier}</small></button>)}
          </div>
        </label>
        <div className="field"><span>How long</span>
          <div className="seg">{[24, 48, 72].map((h) => <button key={h} aria-selected={hours === h} onClick={() => setHours(h)} disabled={h === 72 && !['anindya', 'dewi', 'rizal', 'ayu'].includes(client)}>{h} hours</button>)}</div>
          <small className="muted">72 hours only when the client has an appointment booked.</small>
        </div>
        {holdAt && holdAt !== 'psn' && <p className="note"><I.Truck /> {placeName(holdAt)} will be asked to send it to Plaza Senayan. Usually next day in Jakarta.</p>}
        <div className="dlg-foot"><button className="btn" onClick={() => setHoldAt(null)}>Cancel</button><button className="btn is-primary" data-guide="hold-confirm" onClick={confirmHold}>Hold for {clientOf(client).name.split(' ')[0]}</button></div>
      </Dialog>
      <Toast toast={toast} />
    </div>
  )
}
