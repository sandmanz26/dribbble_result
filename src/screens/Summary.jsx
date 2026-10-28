import { Link } from 'react-router-dom'
import { Download } from 'react-bootstrap-icons'
import { useStore } from '../store.jsx'
import { toCsv } from '../data/engine.js'
import { aisleClass, aisleTag } from '../ui/kit.jsx'

// Screen question: how far through am I, and what has to be ordered?
export default function Summary() {
  const { s, result } = useStore()
  if (!result || result.unmapped) return (
    <div className="empty"><b>No walk yet</b><span>Add both files to see progress.</span><Link to="/files" className="btn">Add files</Link></div>
  )
  const stops = result.stops
  const work = stops.filter((l) => l.move > 0)
  const done = work.filter((l) => s.done[l.key] != null || s.skipped[l.key])
  const moved = stops.reduce((a, l) => a + (s.done[l.key] ?? 0), 0)
  const units = work.reduce((a, l) => a + l.move, 0)
  const aisles = []
  for (const l of stops) {
    let a = aisles.find((x) => x.code === l.aisle.code)
    if (!a) aisles.push((a = { code: l.aisle.code, aisle: l.aisle, total: 0, done: 0 }))
    if (l.move > 0) { a.total += 1; if (s.done[l.key] != null || s.skipped[l.key]) a.done += 1 }
  }
  const reorder = result.items.filter((i) => ['partial', 'reorder', 'out'].includes(i.status)).sort((a, b) => a.floor - b.floor)
  const skipped = stops.filter((l) => s.skipped[l.key])
  const download = () => {
    const blob = new Blob([toCsv(stops, s.done)], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'restock-walk-store-214.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }
  return (
    <div className="page">
      <div className="title">
        <h1>Summary</h1>
        <p>{done.length === work.length ? 'Walk complete.' : `${work.length - done.length} places left to fill.`} {reorder.length} items need ordering.</p>
      </div>
      <section className="card sumcard" aria-labelledby="pd-h">
        <h2 id="pd-h" className="sr-only">Progress</h2>
        <p className="sum num">{done.length}<small> of {work.length} places done</small></p>
        <div className="progress-bar" role="progressbar" aria-valuenow={work.length ? Math.round((done.length / work.length) * 100) : 0} aria-valuemin={0} aria-valuemax={100} aria-label="Places done"><i style={{ width: `${work.length ? (done.length / work.length) * 100 : 0}%` }} /></div>
        <small className="num">{moved} of {units} units on the shelf{skipped.length ? ` · ${skipped.length} could not be filled` : ''}</small>
        <ul className="aislebars" aria-label="By aisle">{aisles.filter((a) => a.total).map((a) => (
          <li key={a.code} className={aisleClass(a.aisle)}>
            <span className="aisle-tag">{aisleTag(a.aisle)}</span>
            <span className="track"><i style={{ width: `${(a.done / a.total) * 100}%` }} /></span>
            <span className="r num">{a.done} of {a.total}</span>
          </li>
        ))}</ul>
      </section>
      <section className="card" aria-labelledby="ro-h">
        <p className="sum num">{reorder.length}<small> items to order</small></p>
        <h2 id="ro-h" className="sr-only">To order</h2>
        <p className="muted">Still short after everything in the backroom is used.</p>
        {reorder.length === 0 ? <p className="muted">Nothing to order.</p> : (
          <ul className="alist">{reorder.map((i) => <li key={i.sku}><span>{i.name}</span><b className="num">{i.need - i.move}</b><small><span className="mono">{i.sku}</span> · <span className="num">{i.floor} of {i.capacity} on shelf, {i.back} in back</span></small></li>)}</ul>
        )}
      </section>
      {skipped.length > 0 && (
        <section className="card" aria-labelledby="sk-h">
          <div className="sec-h"><h2 id="sk-h">Could not fill</h2></div>
          <ul className="alist">{skipped.map((l) => <li key={l.key}><span>{l.name}</span><small>{s.skipped[l.key]}</small></li>)}</ul>
        </section>
      )}
      <button className="btn wide" onClick={download}><Download size={18} /> Download the walk as CSV</button>
    </div>
  )
}
