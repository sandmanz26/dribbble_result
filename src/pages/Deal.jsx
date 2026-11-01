import { Link, useParams } from 'react-router-dom'
import UilArrowLeft from '@iconscout/react-unicons/icons/uil-arrow-left'
import UilCheck from '@iconscout/react-unicons/icons/uil-check'
import UilEnvelope from '@iconscout/react-unicons/icons/uil-envelope'
import UilWhatsapp from '@iconscout/react-unicons/icons/uil-whatsapp'
import { useStore } from '../store.jsx'
import { BRANDS, FORMATS, STAGES, TAX, AGENCY, TODAY, CREATOR, rp, fmtDay, relDay, daysBetween, paymentsOf, trail } from '../data/studio.js'
import { food, Logo, Mono, Pill } from '../ui.jsx'

const STEP_NAMES = { script: 'Script', draft: 'Draft', post: 'Post', insight: 'Insight' }

export default function Deal() {
  const { id } = useParams()
  const { s, dispatch, deals } = useStore()
  const d = deals.find((x) => x.id === id)
  if (!d) return <div className="panel"><h1 style={{ fontSize: 22 }}>No deal {id}</h1><p style={{ marginTop: 8 }}><Link className="link" to="/deals">Back to deals</Link></p></div>
  const b = BRANDS[d.brand]
  const pays = paymentsOf(d)
  const all = trail(d.fee)
  const stage = STAGES.find((x) => x.key === d.stage)
  const exclLeft = d.exclusivity ? daysBetween(TODAY, d.exclusivity.until) : null
  return (
    <>
      <Link to="/deals" className="btn ghost sm" style={{ marginLeft: -10 }}><UilArrowLeft size={16} />Deals</Link>
      <div className="title-row" style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Logo brand={d.brand} size={52} />
          <div>
            <h1>{d.title}</h1>
            <p className="sub" style={{ marginTop: 2 }}>{b.name} · {b.category} · <span className="num">{d.id}</span></p>
          </div>
        </div>
        <div className="actions">
          <label className="stage-select"><span className="sr-only">Stage</span>
            <select value={d.stage} onChange={(e) => dispatch({ type: 'stage', id: d.id, stage: e.target.value, toast: `Moved to ${STAGES.find((x) => x.key === e.target.value).name}` })}>
              {STAGES.map((x) => <option key={x.key} value={x.key}>{x.name}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="grid">
        <div className="span-7" style={{ display: 'grid', gap: 24 }}>
          <section className="panel" aria-labelledby="dl-h">
            <div className="panel-head"><h2 id="dl-h">Deliverables <span className="muted" style={{ fontWeight: 400 }}>{d.deliverables.length}</span></h2><span className="meta">{d.revisions} revision {d.revisions === 1 ? 'round' : 'rounds'} included</span></div>
            <ul className="rows">
              {d.deliverables.map((dl, i) => (
                <li key={i} className="dlv">
                  <img className="thumb" src={food(dl.thumb)} alt="" width="56" height="56" />
                  <div style={{ minWidth: 0 }}>
                    <b style={{ fontWeight: 600 }}>{FORMATS[dl.fmt].name}</b>
                    <ol className="steps">
                      {Object.entries(dl.steps).map(([k, [due, doneOn]]) => {
                        const key = `${d.id}-${i}-${k}`
                        const done = doneOn || s.done[key]
                        const late = !done && daysBetween(due, TODAY) > 0
                        return (
                          <li key={k} className={done ? 'done' : late ? 'late' : daysBetween(TODAY, due) <= 1 ? 'soon' : ''}>
                            <button className="step-dot" disabled={!!doneOn} aria-pressed={!!done} aria-label={`${STEP_NAMES[k]} ${done ? 'done' : 'not done'}, due ${fmtDay(due)}`} onClick={() => dispatch({ type: 'done', key, date: TODAY, toast: `${STEP_NAMES[k]} marked done` })}>{done && <UilCheck size={14} />}</button>
                            <span className="step-name">{STEP_NAMES[k]}</span>
                            <span className="step-date num">{done ? (doneOn ? fmtDay(doneOn) : 'Today') : relDay(due)}</span>
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel" aria-labelledby="tm-h">
            <div className="panel-head"><h2 id="tm-h">Terms</h2></div>
            <dl className="lines">
              <div><dt>Paid ads usage</dt><dd>{d.usage ? `${d.usage} months from posting` : 'Organic only'}</dd></div>
              <div><dt>Exclusivity</dt><dd>{d.exclusivity ? <>{d.exclusivity.category} until {fmtDay(d.exclusivity.until)} <span className="muted">· {exclLeft} days left</span></> : 'None'}</dd></div>
              <div><dt>Whitelisting</dt><dd>{d.whitelisting ? 'Yes' : 'No'}</dd></div>
              <div><dt>Payment terms</dt><dd>{pays.length > 1 ? '50% deposit, 50% after the insight report' : 'In full after the insight report'}</dd></div>
            </dl>
            {d.note && <p className="note">{d.note}</p>}
          </section>
        </div>

        <div className="span-5" style={{ display: 'grid', gap: 24 }}>
          <section className="panel" aria-labelledby="tr-h">
            <div className="panel-head"><h2 id="tr-h">Where the money goes</h2><span className="meta num">{rp(d.fee)}</span></div>
            <div className="split" role="img" aria-label={`Of ${rp(d.fee)}: ${rp(all.net)} to ${CREATOR.name.split(' ')[0]}, ${rp(all.cut)} to Riuh, ${rp(all.tax)} withheld as ${TAX.name}`}>
              <span className="you" style={{ width: `${(all.net / d.fee) * 100}%` }} />
              <span className="riuh" style={{ width: `${(all.cut / d.fee) * 100}%` }} />
              <span className="tax" style={{ width: `${(all.tax / d.fee) * 100}%` }} />
            </div>
            <dl className="lines" style={{ marginTop: 12 }}>
              <div><dt><i className="sw you" />To you</dt><dd className="num"><b>{rp(all.net)}</b></dd></div>
              <div><dt><i className="sw riuh" />Riuh Talent, {Math.round(AGENCY.commission * 100)}%</dt><dd className="num">{rp(all.cut)}</dd></div>
              <div><dt><i className="sw tax" />{TAX.name}, {Math.round(TAX.rate * 100)}% withheld</dt><dd className="num">{rp(all.tax)}</dd></div>
            </dl>
            <p className="small muted" style={{ marginTop: 8 }}>{TAX.note} The withholding slip counts toward your annual return.</p>
            <h3 className="h3" style={{ marginTop: 20 }}>Payments</h3>
            <ul className="rows">
              {pays.map((p) => (
                <li key={p.label} className="pay">
                  <span><b style={{ fontWeight: 600 }}>{p.label}</b><span className="muted" style={{ display: 'block', fontSize: 13 }}>{p.state === 'paid' ? `Received ${fmtDay(p.paid)}` : `Due ${fmtDay(p.due)}${p.after ? `, after ${p.after}` : ''}`}</span></span>
                  <span className="num" style={{ textAlign: 'right' }}><b style={{ fontWeight: 600 }}>{rp(p.net)}</b><span className="muted" style={{ display: 'block', fontSize: 13 }}>of {rp(p.gross)}</span></span>
                  <Pill tone={p.state === 'paid' ? 'pos' : p.state === 'late' ? 'neg' : ''}>{p.state === 'paid' ? 'Received' : p.state === 'late' ? `${p.lateBy} days late` : relDay(p.due)}</Pill>
                </li>
              ))}
            </ul>
            {pays.some((p) => p.state === 'late') && <button className="btn primary" style={{ marginTop: 12, width: '100%' }} disabled={!!s.reminded[d.id]} onClick={() => dispatch({ type: 'remind', id: d.id, date: TODAY, toast: `Reminder drafted for ${b.pic}` })}>{s.reminded[d.id] ? 'Reminder drafted' : `Draft a reminder to ${b.pic.split(' ')[0]}`}</button>}
          </section>

          <section className="panel" aria-labelledby="pc-h">
            <div className="panel-head"><h2 id="pc-h">Brand contact</h2><span className="meta">Last talked {relDay(b.lastContact).toLowerCase()}</span></div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Mono name={b.pic} hue={b.hue} size={40} />
              <span><b style={{ fontWeight: 600 }}>{b.pic}</b><span className="muted" style={{ display: 'block', fontSize: 13 }}>{b.role}, {b.name}</span></span>
              <span className="pill" style={{ marginLeft: 'auto' }}>{b.channel === 'WhatsApp' ? <UilWhatsapp size={14} /> : <UilEnvelope size={14} />}{b.channel}</span>
            </div>
            <p style={{ marginTop: 12 }}><span className="muted">Next:</span> {b.next}</p>
            <p className="small muted" style={{ marginTop: 6 }}>Riuh handles the brand side. {CREATOR.manager} sees every change you make here.</p>
          </section>

          <section className="panel" aria-labelledby="ac-h">
            <div className="panel-head"><h2 id="ac-h">Activity</h2></div>
            <ol className="activity">
              {activityOf(d, pays, s.done).map((a, i) => <li key={i}><span className="num muted">{fmtDay(a.date)}</span><span>{a.text}</span></li>)}
            </ol>
          </section>
        </div>
      </div>
    </>
  )
}

// What happened on this deal, newest first, built from its steps and payments.
function activityOf(d, pays, done) {
  const out = []
  pays.forEach((p) => { if (p.paid) out.push({ date: p.paid, text: `${p.label} received, ${rp(p.net)} to you` }) })
  d.deliverables.forEach((dl, i) => Object.entries(dl.steps).forEach(([k, [, on]]) => {
    const when = on || (done[`${d.id}-${i}-${k}`] ? TODAY : null)
    if (when) out.push({ date: when, text: `${STEP_NAMES[k]} done for ${FORMATS[dl.fmt].short}` })
  }))
  if (d.stage !== 'negotiating') out.push({ date: pays[0].due < (pays[0].paid || '9') ? pays[0].due : (pays[0].paid || pays[0].due), text: 'Contract signed' })
  return out.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
}
