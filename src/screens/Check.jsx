import { Link } from 'react-router-dom'
import { CheckCircleFill, ExclamationTriangleFill, InfoCircle, Layers } from 'react-bootstrap-icons'
import { useStore } from '../store.jsx'

// Screen question: can I trust the join before I start walking?
export default function Check() {
  const { result, s } = useStore()
  if (!result || result.unmapped) return (
    <div className="empty"><b>Nothing to check yet</b><span>Add both files first.</span><Link to="/files" className="btn">Add files</Link></div>
  )
  const { issues: is, counts } = result
  const problems = is.missing.length + is.badRows.length
  return (
    <div className="page">
      <div className="title">
        <h1>Check the join</h1>
        <p>{counts.matched} of {counts.matched + is.missing.length} planogram items matched the count. {problems ? `${problems} need${problems === 1 ? 's' : ''} a look before you walk.` : 'Nothing blocks the walk.'}</p>
        <p className="muted" style={{ fontSize: 13 }}>{s.files.plano.fileName} ({counts.plano} rows) joined with {s.files.inv.fileName} ({counts.inv} rows) on SKU.</p>
      </div>

      {is.missing.length > 0 && (
        <section className="alert bad" aria-labelledby="m-h">
          <div className="alert-h"><ExclamationTriangleFill size={18} color="var(--out)" /><div><b id="m-h">{is.missing.length} planogram items are not in the count</b><small>They stay on the walk marked “Not in the count”, with no stock figure. Count them or ask why they were left out.</small></div></div>
          <ul className="alist">{is.missing.map((m) => <li key={m.sku}><span>{m.name}</span><small className="mono">{m.sku}</small><small>{m.where}</small></li>)}</ul>
        </section>
      )}
      {is.badRows.length > 0 && (
        <section className="alert bad" aria-labelledby="b-h">
          <div className="alert-h"><ExclamationTriangleFill size={18} color="var(--out)" /><div><b id="b-h">{is.badRows.length} rows could not be read</b><small>They are left out of the walk.</small></div></div>
          <ul className="alist">{is.badRows.map((b, k) => <li key={k}><span>{b.why}</span><small>{b.file}, row {b.row}</small></li>)}</ul>
        </section>
      )}
      {is.multi.length > 0 && (
        <section className="alert" aria-labelledby="mu-h">
          <div className="alert-h"><Layers size={18} /><div><b id="mu-h">{is.multi.length} items have more than one place</b><small>The count gives one floor figure per item, so it is split across the places by their room, home shelf first. Switch to “One row per item” on the walk to see them combined.</small></div></div>
          <ul className="alist">{is.multi.map((m) => <li key={m.sku}><span>{m.name}</span><small className="mono">{m.sku}</small><small>{m.places}</small></li>)}</ul>
        </section>
      )}
      {is.extra.length > 0 && (
        <section className="alert" aria-labelledby="x-h">
          <div className="alert-h"><InfoCircle size={18} /><div><b id="x-h">{is.extra.length} counted items have no place on the planogram</b><small>They are not on the walk. New lines and seasonal stock often show up here.</small></div></div>
          <ul className="alist">{is.extra.map((m) => <li key={m.sku}><span>{m.name}</span><small className="mono">{m.sku}</small><small className="num">{m.floor} floor, {m.back} back</small></li>)}</ul>
        </section>
      )}
      {(is.trimmed.length > 0 || is.dupCount.length > 0) && (
        <section className="alert" aria-labelledby="t-h">
          <div className="alert-h"><CheckCircleFill size={18} color="var(--ok)" /><div><b id="t-h">Cleaned up automatically</b><small>
            {is.trimmed.length > 0 && <>{is.trimmed.length} SKU{is.trimmed.length > 1 ? 's had' : ' had'} spaces around {is.trimmed.length > 1 ? 'them' : 'it'} ({is.trimmed.map((t) => `${t.sku} in the ${t.file}, row ${t.row}`).join('; ')}) and still matched. </>}
            {is.dupCount.length > 0 && <>{is.dupCount.length} SKUs were counted twice; the counts were added together.</>}
          </small></div></div>
        </section>
      )}
      <Link to="/" className="btn wide">Start the walk</Link>
    </div>
  )
}
