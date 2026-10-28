import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRepeat, Check2, ChevronRight, Download, ExclamationTriangleFill, FileEarmarkSpreadsheet, Upload } from 'react-bootstrap-icons'
import { SAMPLE, useStore } from '../store.jsx'
import { FIELDS, readFile } from '../data/engine.js'
import { Sheet } from '../ui/kit.jsx'

const KIND = {
  plano: { title: 'Planogram', what: 'Where each item lives: aisle, bay, shelf, facings.' },
  inv: { title: 'Inventory count', what: 'How many are on the floor and in the backroom, per SKU.' },
}
// What each field should hold, said the way the associate would look for it in the file.
const HINT = {
  sku: 'The item number both files share',
  name: 'The product name, for reading on the walk',
  aisle: 'Aisle numbers, E1 and E2 for endcaps',
  bay: 'The bay or section along the aisle',
  shelf: 'Shelf number, 1 at the top',
  pos: 'Left-to-right slot on the shelf',
  facings: 'How many fronts the item gets',
  depth: 'How many units stand behind each front',
  fixture: 'Shelf, peg, cooler and so on',
  floor: 'Units counted on the sales floor',
  back: 'Units counted in the backroom',
  counted: 'When the count was taken',
}

// Field names in running text: lower case, except the SKU.
const low = (l) => (l === 'SKU' ? l : l.toLowerCase())

// A few values from a column, so the associate can tell the columns apart by what they hold.
const samples = (f, i) => [...new Set(f.rows.map((r) => String(r[i] ?? '').trim()).filter(Boolean))].slice(0, 3)

// The column picker: a bottom sheet listing the file's columns with what is in them.
function ColumnSheet({ kind, field, f, map, onPick, onClose }) {
  const usedBy = (i) => FIELDS[kind].find((x) => x.id !== field.id && map[x.id] === i)
  const opts = [...(field.need ? [] : [{ i: null, name: 'Not in this file', vals: 'Leave this out' }]), ...f.headers.map((h, i) => ({ i, name: h || `Column ${i + 1}`, vals: samples(f, i).join(', ') || 'Empty column' }))]
  const keys = (e) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const els = [...e.currentTarget.querySelectorAll('[role="option"]')]
    const k = els.indexOf(document.activeElement)
    const to = e.key === 'Home' ? 0 : e.key === 'End' ? els.length - 1 : Math.min(els.length - 1, Math.max(0, k + (e.key === 'ArrowDown' ? 1 : -1)))
    els[to]?.focus()
  }
  return (
    <Sheet labelledBy="cs-h" onClose={onClose} className="picker">
      <div className="bs-head">
        <h2 id="cs-h">Column for {low(field.label)}</h2>
        <p>{HINT[field.id]}. From {f.fileName}.</p>
      </div>
      <div className="optlist" data-scroll role="listbox" aria-labelledby="cs-h" onKeyDown={keys}>
        {opts.map((o, k) => {
          const on = (map[field.id] ?? null) === o.i
          const first = k === 0 && !opts.some((x) => (map[field.id] ?? null) === x.i)
          const other = o.i != null && usedBy(o.i)
          return (
            <button key={o.i ?? 'none'} role="option" aria-selected={on} className="opt" tabIndex={on || first ? 0 : -1} onClick={() => onPick(o.i)}>
              <span className="opt-text">
                <b>{o.name}</b>
                <small>{other ? `Now used for ${low(other.label)} · ` : ''}{o.i == null ? o.vals : <>e.g. <span className="num">{o.vals}</span></>}</small>
              </span>
              <span className="opt-mark" aria-hidden="true">{on && <Check2 size={22} />}</span>
            </button>
          )
        })}
      </div>
    </Sheet>
  )
}

// One file: drop or pick it, see what was read, and fix any column the app could not match.
function FileCard({ kind }) {
  const { s, set, load, notify } = useStore()
  const [over, setOver] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [pick, setPick] = useState(null)
  const f = s.files[kind]
  const map = s.maps[kind]
  const take = async (file) => {
    if (!file) return
    setErr(''); setBusy(true)
    try { const parsed = await readFile(file); load(kind, parsed); notify({ text: `${parsed.rows.length} rows read from ${parsed.fileName}.` }) }
    catch (e) { setErr(e.message || 'That file could not be read.') }
    setBusy(false)
  }
  // Picking a column another field was using moves it: one column feeds one field.
  const setCol = (id, i) => {
    set((c) => {
      const m = { ...c.maps[kind] }
      for (const k of Object.keys(m)) if (i != null && m[k] === i) delete m[k]
      if (i == null) delete m[id]; else m[id] = i
      return { maps: { ...c.maps, [kind]: m }, done: {}, skipped: {} }
    })
    const field = FIELDS[kind].find((x) => x.id === id)
    notify({ text: i == null ? `${field.label}: not in this file.` : `${field.label} reads from “${f.headers[i]}”.` })
    setPick(null)
  }
  const missingNeed = f ? FIELDS[kind].filter((x) => x.need && map[x.id] == null) : []
  const field = pick && FIELDS[kind].find((x) => x.id === pick)
  return (
    <section className={`card filecard ${over ? 'over' : ''} ${f ? 'has' : 'none'}`} aria-labelledby={`h-${kind}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files[0]) }}>
      <div className="fc-top">
        <span className="fc-icon" aria-hidden="true">{f ? <FileEarmarkSpreadsheet size={22} /> : <Upload size={22} />}</span>
        <div style={{ minWidth: 0 }}>
          <h2 id={`h-${kind}`}>{KIND[kind].title}</h2>
          <small>{f ? <>{f.fileName}<br /><span className="num">{f.rows.length} rows · {f.headers.length} columns</span></> : KIND[kind].what}</small>
        </div>
      </div>
      <label className="btn ghost wide">
        <input type="file" accept=".csv,.xlsx,text/csv" onChange={(e) => { take(e.target.files[0]); e.target.value = '' }} />
        {busy ? 'Reading…' : f ? <><ArrowRepeat size={18} /> Replace file</> : <><Upload size={18} /> Choose CSV or Excel</>}
      </label>
      {err && <p className="note bad" role="alert"><ExclamationTriangleFill size={16} />{err}</p>}
      {f && (
        <>
          <div className="fc-sub">
            <h3>Columns</h3>
            <small>{missingNeed.length ? <span className="neg">{missingNeed.length} to choose</span> : 'All matched'}</small>
          </div>
          <ul className="maplist" aria-label={`Columns in ${f.fileName}`}>
            {FIELDS[kind].map((x) => {
              const i = map[x.id]
              const unset = x.need && i == null
              return (
                <li key={x.id}>
                  <button className={`maprow ${unset ? 'unset' : ''}`} onClick={() => setPick(x.id)} aria-haspopup="listbox">
                    <span className="mr-label">{x.label}{x.need && <span className="sr-only"> (needed)</span>}</span>
                    <span className="mr-value">
                      {i != null ? <><b>{f.headers[i] || `Column ${i + 1}`}</b><small className="num">e.g. {samples(f, i)[0] ?? 'empty'}</small></> : unset ? <b>Choose a column</b> : <small>Not in this file</small>}
                    </span>
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>
          <details className="peek">
            <summary>First rows of the file</summary>
            <div className="scrollx">
              <table className="preview">
                <thead><tr>{f.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                <tbody>{f.rows.slice(0, 3).map((r, k) => <tr key={k}>{f.headers.map((_, i) => <td key={i}>{String(r[i] ?? '')}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </details>
        </>
      )}
      {field && <ColumnSheet kind={kind} field={field} f={f} map={map} onPick={(i) => setCol(field.id, i)} onClose={() => setPick(null)} />}
    </section>
  )
}

export default function Files() {
  const { s, loadSamples, result, notify } = useStore()
  const nav = useNavigate()
  const both = s.files.plano && s.files.inv
  const ok = result && !result.unmapped
  return (
    <div className="page">
      <div className="title">
        <h1>Files</h1>
        <p>Add today’s planogram and stock count. They are joined on SKU here on the phone; nothing is uploaded.</p>
      </div>
      <FileCard kind="plano" />
      <FileCard kind="inv" />
      {both && ok ? (
        <button className="btn wide" onClick={() => nav('/check')}>Check the join</button>
      ) : !both ? (
        <section className="card">
          <div className="fc-sub"><h3>No files to hand?</h3></div>
          <p className="muted">Store 214’s files from this morning are messy the way real exports are.</p>
          <button className="btn wide" onClick={async () => { await loadSamples(); notify({ text: 'Sample files for store 214 loaded.' }); nav('/check') }}>Use the sample files</button>
          <div className="samples">
            <a href={SAMPLE.plano} download><Download size={16} /> planogram-store-214.csv</a>
            <a href="samples/inventory-store-214.xlsx" download><Download size={16} /> inventory-store-214.xlsx</a>
            <a href={SAMPLE.inv} download><Download size={16} /> inventory-store-214.csv</a>
          </div>
        </section>
      ) : null}
    </div>
  )
}
