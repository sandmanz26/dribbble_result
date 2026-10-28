import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRepeat, Download, ExclamationTriangleFill, FileEarmarkSpreadsheet, Upload } from 'react-bootstrap-icons'
import { SAMPLE, useStore } from '../store.jsx'
import { FIELDS, readFile } from '../data/engine.js'

const KIND = {
  plano: { title: 'Planogram', what: 'Where each item lives: aisle, bay, shelf, facings.' },
  inv: { title: 'Inventory count', what: 'How many are on the floor and in the backroom, per SKU.' },
}

// One file: drop or pick it, see what was read, and fix any column the app could not match.
function FileCard({ kind }) {
  const { s, set, load, notify } = useStore()
  const [over, setOver] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const f = s.files[kind]
  const map = s.maps[kind]
  const take = async (file) => {
    if (!file) return
    setErr(''); setBusy(true)
    try { const parsed = await readFile(file); load(kind, parsed); notify({ text: `${parsed.rows.length} rows read from ${parsed.fileName}.` }) }
    catch (e) { setErr(e.message || 'That file could not be read.') }
    setBusy(false)
  }
  const setCol = (id, v) => set((c) => ({ maps: { ...c.maps, [kind]: { ...c.maps[kind], [id]: v === '' ? undefined : Number(v) } }, done: {}, skipped: {} }))
  const missingNeed = f ? FIELDS[kind].filter((x) => x.need && map[x.id] == null) : []
  return (
    <section className={`dropzone ${over ? 'over' : ''} ${f ? 'has' : ''}`} aria-labelledby={`h-${kind}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files[0]) }}>
      <div className="dz-top">
        <span className="dz-icon">{f ? <FileEarmarkSpreadsheet size={20} /> : <Upload size={20} />}</span>
        <div style={{ minWidth: 0 }}>
          <b id={`h-${kind}`}>{KIND[kind].title}</b>
          <small>{f ? <>{f.fileName} · {f.rows.length} rows · {f.headers.length} columns</> : KIND[kind].what}</small>
        </div>
      </div>
      <label className="btn ghost small" style={{ justifySelf: 'start' }}>
        <input type="file" accept=".csv,.xlsx,text/csv" onChange={(e) => { take(e.target.files[0]); e.target.value = '' }} />
        {busy ? 'Reading…' : f ? <><ArrowRepeat size={16} /> Replace file</> : <><Upload size={16} /> Choose CSV or Excel</>}
      </label>
      {err && <p className="note bad" role="alert"><ExclamationTriangleFill size={16} />{err}</p>}
      {f && (
        <>
          {missingNeed.length > 0 && <p className="note bad" role="alert"><ExclamationTriangleFill size={16} />Pick a column for {missingNeed.map((x) => x.label.toLowerCase()).join(', ')} to continue.</p>}
          <div className="maprows" role="group" aria-label={`Columns in ${f.fileName}`}>
            {FIELDS[kind].map((x) => (
              <label key={x.id} className="maprow">
                <span>{x.label}{x.need && <em> *</em>}</span>
                <select className={x.need && map[x.id] == null ? 'unset' : ''} value={map[x.id] ?? ''} onChange={(e) => setCol(x.id, e.target.value)}>
                  <option value="">{x.need ? 'Choose a column' : 'Not in this file'}</option>
                  {f.headers.map((h, i) => <option key={i} value={i}>{h || `Column ${i + 1}`}</option>)}
                </select>
              </label>
            ))}
          </div>
          <div className="scrollx">
            <table className="preview">
              <caption className="sr-only">First rows of {f.fileName}</caption>
              <thead><tr>{f.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
              <tbody>{f.rows.slice(0, 3).map((r, k) => <tr key={k}>{f.headers.map((_, i) => <td key={i}>{String(r[i] ?? '')}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </>
      )}
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
        <p className="muted">Add today’s planogram and stock count. They are joined on SKU here on the phone; nothing is uploaded.</p>
      </div>
      <FileCard kind="plano" />
      <FileCard kind="inv" />
      {both && ok ? (
        <button className="btn wide" onClick={() => nav('/check')}>Check the join</button>
      ) : !both ? (
        <div style={{ display: 'grid', gap: 10 }}>
          <button className="btn wide" onClick={async () => { await loadSamples(); notify({ text: 'Sample files for store 214 loaded.' }); nav('/check') }}>Use the sample files</button>
          <div className="samples">
            <span className="muted">Or download them, edit, and add them back:</span>
            <a href={SAMPLE.plano} download><Download size={14} /> planogram-store-214.csv</a>
            <a href="samples/inventory-store-214.xlsx" download><Download size={14} /> inventory-store-214.xlsx</a>
            <a href={SAMPLE.inv} download><Download size={14} /> inventory-store-214.csv</a>
          </div>
        </div>
      ) : null}
    </div>
  )
}
