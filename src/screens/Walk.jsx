import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check2, Dash, ExclamationTriangleFill, InfoCircle, Plus, X } from 'react-bootstrap-icons'
import { useStore } from '../store.jsx'
import { STATUS } from '../data/engine.js'
import { Pill, aisleClass, aisleTag } from '../ui/kit.jsx'

// Screen question: what do I carry out from the back, and where, in the order I walk?
const FILTERS = [
  ['todo', 'To do', (r, d) => !d && r.status !== 'full'],
  ['fill', 'Fill', (r, d) => !d && (r.status === 'fill' || r.status === 'partial')],
  ['short', 'Short', (r) => ['partial', 'reorder', 'out'].includes(r.status)],
  ['missing', 'No count', (r) => r.status === 'missing'],
  ['done', 'Done', (r, d) => !!d],
  ['all', 'All', () => true],
]
// A row in the item view stands for all of the item's places; done and skipped live on the places.
const keysOf = (r) => { if (!r.locs) return [r.key]; const work = r.locs.filter((l) => l.move > 0); return (work.length ? work : r.locs).map((l) => l.key) }
const doneOf = (s, r) => { const ks = keysOf(r); return ks.every((k) => s.done[k] != null) ? ks.reduce((a, k) => a + s.done[k], 0) : undefined }
const skipOf = (s, r) => keysOf(r).map((k) => s.skipped[k]).find(Boolean)
const where = (l) => `${l.aisle.kind === 'end' ? `Endcap ${l.aisle.n}` : `Bay ${l.bay}`} · shelf ${l.shelf}${l.pos ? ` · slot ${l.pos}` : ''}`

// Rows for the list: every place, or one row per item with its places combined.
function useRows(result, view) {
  return useMemo(() => {
    if (!result || result.unmapped) return []
    if (view === 'place') return result.stops.map((l) => ({ ...l, places: 1 }))
    const firstStep = (it) => Math.min(...it.locs.map((l) => l.step))
    return result.items.map((it) => {
      const first = it.locs.find((l) => l.step === firstStep(it))
      return { ...first, key: `item-${it.sku}`, locs: it.locs, capacity: it.capacity, facings: it.locs.reduce((a, l) => a + l.facings, 0), floor: it.floor, back: it.back, need: it.need, move: it.move, status: it.status, places: it.locs.length }
    }).sort((a, b) => a.step - b.step)
  }, [result, view])
}

function Slots({ cap, have, add, cls }) {
  const n = Math.min(cap, 48)
  const k = cap / n
  const h = Math.round(have / k)
  const a = Math.round(add / k)
  return (
    <div className={`shelfviz ${cls}`} aria-hidden="true">
      <div className="shelfviz-row">{Array.from({ length: n }, (_, i) => <i key={i} className={i < h ? 'have' : i < h + a ? 'add' : ''} />)}</div>
      <small>{have} on the shelf{add ? `, ${add} to bring out` : ''}, room for {cap}{k > 1 ? ` (one box is ${k.toFixed(1)} units)` : ''}</small>
    </div>
  )
}

function StopSheet({ row, onClose }) {
  const { s, set, notify } = useStore()
  const doneQty = doneOf(s, row)
  const keys = keysOf(row)
  const [qty, setQty] = useState(doneQty ?? row.move ?? 0)
  const cls = aisleClass(row.aisle)
  // Units moved are shared out across the item's places in walking order, each up to what it needed.
  const finish = (n) => {
    const before = { done: s.done, skipped: s.skipped }
    const locs = row.locs ? row.locs.filter((l) => keys.includes(l.key)) : [{ key: row.key, move: row.move }]
    let left = n
    const add = {}
    locs.forEach((l, i) => { const take = i === locs.length - 1 ? left : Math.min(left, l.move ?? 0); add[l.key] = take; left -= take })
    set((c) => { const sk = { ...c.skipped }; keys.forEach((k) => delete sk[k]); return { done: { ...c.done, ...add }, skipped: sk } })
    notify({ text: `Done: ${n} ${row.name.split(' ').slice(0, 3).join(' ')} on the shelf.`, undo: () => set(before) })
    onClose()
  }
  const skip = (why) => {
    set((c) => { const d = { ...c.done }; const sk = { ...c.skipped }; keys.forEach((k) => { delete d[k]; sk[k] = why }); return { done: d, skipped: sk } })
    notify({ text: `Noted: ${why.toLowerCase()}.` })
    onClose()
  }
  const reopen = () => set((c) => { const d = { ...c.done }; const k = { ...c.skipped }; keys.forEach((x) => { delete d[x]; delete k[x] }); return { done: d, skipped: k } })
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <section className="panelsheet" role="dialog" aria-modal="true" aria-labelledby="ps-h">
        <span className="grab" />
        <div className="ps-top">
          <span className="stop-where"><span className={`aisle-tag ${cls}`} style={{ height: 22, minWidth: 28, fontSize: 13, marginRight: 8 }}>{aisleTag(row.aisle)}</span>{row.places > 1 ? `${row.places} places` : where(row)}</span>
          <h2 id="ps-h">{row.name}</h2>
          <span className="stop-meta"><span className="mono">SKU {row.sku}</span>{row.fixture && <span>{row.fixture}</span>}<Pill status={row.status} done={doneQty} /></span>
        </div>

        {row.status === 'missing' ? (
          <>
            <p className="note bad"><ExclamationTriangleFill size={16} />This item is on the planogram but not in today’s count, so there is no stock figure to fill from. Count the shelf and the backroom, or ask why it was left out.</p>
            <button className="btn wide" onClick={() => skip('Added to the recount list')}>Add to the recount list</button>
          </>
        ) : (
          <>
            <div className="facts">
              <div><small>Room</small><b className="num">{row.capacity}</b><small>{row.facings} facings{row.places > 1 ? '' : ` × ${row.depth}`}</small></div>
              <div><small>Floor</small><b className="num">{row.floor}</b></div>
              <div><small>Back</small><b className="num">{row.back}</b></div>
              <div><small>Bring</small><b className="num">{row.move}</b></div>
            </div>
            <Slots cap={row.capacity} have={row.floor} add={row.move} cls={cls} />
            {row.places > 1 && (
              <div>
                <div className="sec-h"><h2>Where it goes</h2><small>Floor count split by room, home shelf first</small></div>
                <ul className="places">{row.locs.map((l) => (
                  <li key={l.key} className={aisleClass(l.aisle)}><span className="aisle-tag" style={{ height: 22, minWidth: 28, fontSize: 13 }}>{aisleTag(l.aisle)}</span>{where(l)}<span className="num muted" style={{ marginLeft: 'auto' }}>{l.floor} of {l.capacity}, bring {l.move}</span></li>
                ))}</ul>
              </div>
            )}
            {row.status === 'partial' && <p className="note"><InfoCircle size={16} />The backroom has {row.back}. After this the shelf is still {row.need - row.move} short; it goes on the reorder list.</p>}
            {(row.status === 'reorder' || row.status === 'out') && <p className="note bad"><ExclamationTriangleFill size={16} />Nothing in the backroom. {row.status === 'out' ? 'The shelf is empty: ' : ''}this item goes on the reorder list.</p>}
            {row.move > 0 ? (
              <>
                <div className="stepper" role="group" aria-label="Units moved to the shelf">
                  <button aria-label="One less" onClick={() => setQty(Math.max(0, qty - 1))}><Dash size={22} /></button>
                  <output className="num" aria-live="polite">{qty}</output>
                  <button aria-label="One more" onClick={() => setQty(Math.min(row.back, qty + 1))}><Plus size={22} /></button>
                </div>
                <button className="btn wide" onClick={() => finish(qty)}><Check2 size={18} /> Done, moved {qty}</button>
                <div>
                  <div className="sec-h"><h2>Could not fill it?</h2></div>
                  <div className="reasons">{['Not found in the back', 'Damaged stock', 'Shelf blocked'].map((r) => <button key={r} className="chip" onClick={() => skip(r)}>{r}</button>)}</div>
                </div>
              </>
            ) : (
              <button className="btn wide ghost" onClick={() => finish(0)}><Check2 size={18} /> Checked, nothing to bring</button>
            )}
          </>
        )}
        {(doneQty != null || skipOf(s, row)) && <button className="btn ghost wide" onClick={reopen}>Open it again</button>}
        <button className="btn ghost wide" onClick={onClose}><X size={18} /> Close</button>
      </section>
    </>
  )
}

export default function Walk() {
  const { s, set, result } = useStore()
  const [open, setOpen] = useState(null)
  const rows = useRows(result, s.view)
  if (!result) return (
    <div className="empty"><b>No files yet</b><span>Add a planogram and a stock count to build the walk.</span><Link to="/files" className="btn">Add files</Link></div>
  )
  if (result.unmapped) return (
    <div className="empty"><b>Some columns are not matched</b><span>Tell the app which column holds the SKU, the shelf place and the counts.</span><Link to="/files" className="btn">Match columns</Link></div>
  )
  const isDone = (r) => doneOf(s, r) != null || !!skipOf(s, r)
  const f = FILTERS.find((x) => x[0] === s.filter) || FILTERS[0]
  const shown = rows.filter((r) => f[2](r, isDone(r)))
  const work = rows.filter((r) => r.move > 0)
  const workDone = work.filter(isDone)
  const units = work.reduce((a, r) => a + r.move, 0)
  const moved = work.reduce((a, r) => a + (s.done[r.key] ?? 0), 0)
  const outs = rows.filter((r) => r.status === 'out').length
  const groups = []
  for (const r of shown) {
    const g = groups[groups.length - 1]
    if (g && g.code === r.aisle.code) g.rows.push(r)
    else groups.push({ code: r.aisle.code, aisle: r.aisle, rows: [r] })
  }
  const pct = work.length ? (workDone.length / work.length) * 100 : 0
  const aisleTiles = []
  for (const r of rows) {
    let t = aisleTiles.find((x) => x.code === r.aisle.code)
    if (!t) aisleTiles.push((t = { code: r.aisle.code, aisle: r.aisle, left: 0 }))
    if (r.move > 0 && !isDone(r)) t.left += 1
  }
  return (
    <div>
      <div className="walk-head">
        <div className="title">
          <h1>Restock walk</h1>
          <p>{work.length - workDone.length} places to fill from the back, {units - moved} units. {outs ? `${outs} empty with none in the back.` : ''}</p>
        </div>
        <div className="progress">
          <div className="progress-bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Walk progress"><i style={{ width: `${pct}%`, background: 'var(--text)' }} /></div>
          <small className="num">{workDone.length} of {work.length} places done · {moved} of {units} units on the shelf</small>
        </div>
        <nav className="aislemap" aria-label="Aisles, in walking order">
          {aisleTiles.map((t) => (
            <button key={t.code} className={`tile ${aisleClass(t.aisle)} ${t.left === 0 ? 'clear' : ''}`} onClick={() => document.getElementById(`aisle-${t.code}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} aria-label={`${t.aisle.label}: ${t.left ? `${t.left} places left` : 'done'}`}>
              <b>{aisleTag(t.aisle)}</b><small className="num">{t.left ? `${t.left} left` : 'Done'}</small>
            </button>
          ))}
        </nav>
        <div className="seg" role="group" aria-label="How to list items in more than one place">
          <button aria-pressed={s.view === 'place'} onClick={() => set({ view: 'place' })}>Every place</button>
          <button aria-pressed={s.view === 'item'} onClick={() => set({ view: 'item' })}>One row per item</button>
        </div>
        <div className="chips" role="group" aria-label="Show">
          {FILTERS.map(([id, label, fn]) => <button key={id} className="chip" aria-pressed={f[0] === id} onClick={() => set({ filter: id })}>{label} <b className="num">{rows.filter((r) => fn(r, isDone(r))).length}</b></button>)}
        </div>
      </div>
      {groups.length === 0 ? (
        <div className="empty"><b>{f[0] === 'todo' ? 'Walk finished' : 'Nothing here'}</b><span>{f[0] === 'todo' ? 'Every place that needed stock has been done or noted.' : 'No places match this filter.'}</span>{f[0] === 'todo' && <Link className="btn" to="/summary">See the summary</Link>}</div>
      ) : groups.map((g) => (
        <section key={g.code + g.rows[0].step} id={`aisle-${g.code}`} className={`aisle ${aisleClass(g.aisle)}`} aria-label={g.aisle.label}>
          <div className="aisle-h"><span className="aisle-tag">{aisleTag(g.aisle)}</span><b>{g.aisle.label}</b><small>{g.aisle.kind === 'aisle' ? (g.aisle.n % 2 ? 'walk front to back' : 'walk back to front') : 'front of store'}</small></div>
          {g.rows.map((r) => {
            const d = doneOf(s, r)
            return (
              <button key={r.key} className={`stop ${isDone(r) ? 'is-done' : ''}`} onClick={() => setOpen(r.key)}>
                <span className="stop-where">{r.places > 1 ? `${where(r)} · +${r.places - 1} more place` : where(r)}</span>
                <span className="stop-name">{r.name}</span>
                <span className="stop-meta"><span className="mono">{r.sku}</span><span className="num">{r.facings} facings</span>{r.status === 'missing' ? <span>no count</span> : <span className="num">floor {r.floor}/{r.capacity} · back {r.back}</span>}</span>
                <span className="stop-side">
                  {r.status === 'missing' ? <span className="move zero">?</span> : r.move > 0 ? <span className="move num" style={{ color: 'var(--cink)' }}>+{r.move}<small> bring</small></span> : <span className="move zero num">0</span>}
                  {skipOf(s, r) ? <span className="pill partial">{skipOf(s, r)}</span> : <Pill status={r.status} done={d} />}
                </span>
              </button>
            )
          })}
        </section>
      ))}
      {open && <StopSheet row={rows.find((r) => r.key === open)} onClose={() => setOpen(null)} />}
      <p className="muted" style={{ padding: '16px', fontSize: 13 }}>{STATUS.fill.label}: the backroom covers the gap. {STATUS.partial.label}: it covers some of it.</p>
    </div>
  )
}
