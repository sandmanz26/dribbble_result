import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import UilEllipsisH from '@iconscout/react-unicons/icons/uil-ellipsis-h'
import UilSearch from '@iconscout/react-unicons/icons/uil-search'
import { useStore } from '../store.jsx'
import { STAGES, BRANDS, FORMATS, STEPS, TODAY, rp, relDay, daysBetween, paymentsOf } from '../data/studio.js'
import { food, Logo, Pill } from '../ui.jsx'

const STEP_VERB = { script: 'Script', draft: 'Draft', post: 'Post', insight: 'Insight' }
export function nextStepOf(d, done) {
  return STEPS.filter((x) => x.deal.id === d.id && !x.done && !done[x.key]).sort((a, b) => a.due.localeCompare(b.due))[0]
}

export default function Deals() {
  const { s, dispatch, deals } = useStore()
  const [params] = useSearchParams()
  const [view, setView] = useState('board')
  const [q, setQ] = useState('')
  const [drag, setDrag] = useState(null)
  const [over, setOver] = useState(null)
  const [mstage, setMstage] = useState(null)
  const focus = params.get('stage')
  const shown = deals.filter((d) => !q || `${BRANDS[d.brand].name} ${d.title} ${d.id}`.toLowerCase().includes(q.toLowerCase()))
  const move = (id, stage) => {
    const d = deals.find((x) => x.id === id)
    if (!d || d.stage === stage) return
    dispatch({ type: 'stage', id, stage, toast: `${BRANDS[d.brand].name} moved to ${STAGES.find((x) => x.key === stage).name}` })
  }
  const live = deals.filter((d) => d.stage !== 'paid')
  return (
    <>
      <div className="title-row">
        <div>
          <h1>Deals</h1>
          <p className="sub"><b className="num">{live.length} live deals worth {rp(live.reduce((t, d) => t + d.fee, 0))}</b> before tax and Riuh’s share. Drag a card when a deal moves on.</p>
        </div>
        <div className="actions">
          <label className="search" style={{ width: 240, flex: 'none' }}><UilSearch size={16} /><span className="sr-only">Filter deals</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by brand" style={{ border: 0, outline: 0, background: 'none', width: '100%' }} /></label>
          <div className="seg" role="tablist" aria-label="View">{[['board', 'Board'], ['list', 'List']].map(([k, l]) => <button key={k} role="tab" aria-selected={view === k} onClick={() => setView(k)}>{l}</button>)}</div>
        </div>
      </div>

      {view === 'board' ? (
        <>
        <div className="stage-tabs" role="tablist" aria-label="Stage">
          {STAGES.map((st) => <button key={st.key} role="tab" aria-selected={(mstage || focus || 'production') === st.key} onClick={() => setMstage(st.key)}>{st.name} <span className="muted">{shown.filter((d) => d.stage === st.key).length}</span></button>)}
        </div>
        <div className="board" aria-label="Deals by stage">
          {STAGES.map((st) => {
            const list = shown.filter((d) => d.stage === st.key)
            return (
              <section key={st.key} className={`col${over === st.key ? ' over' : ''}${focus === st.key ? ' focus' : ''}${(mstage || focus || 'production') === st.key ? ' m-on' : ''}`} aria-labelledby={`c-${st.key}`}
                onDragOver={(e) => { e.preventDefault(); setOver(st.key) }} onDragLeave={() => setOver(null)} onDrop={(e) => { e.preventDefault(); move(drag, st.key); setDrag(null); setOver(null) }}>
                <div className="col-head"><h2 id={`c-${st.key}`}>{st.name} <span className="muted">{list.length}</span></h2></div>
                <p className="small muted col-hint num">{list.length ? rp(list.reduce((t, d) => t + d.fee, 0)) : 'Nothing here'} · {st.hint}</p>
                <ul className="cards">
                  {list.map((d) => <DealCard key={d.id} d={d} done={s.done} onDrag={setDrag} onMove={move} dragging={drag === d.id} />)}
                </ul>
                {!list.length && <p className="drop">Drop a deal here</p>}
              </section>
            )
          })}
        </div>
        </>
      ) : (
        <section className="panel" style={{ marginTop: 24 }} aria-label="Deals list">
          <table className="t">
            <thead><tr><th>Deal</th><th>Stage</th><th>Next step</th><th className="r">Fee</th><th className="r">To you</th></tr></thead>
            <tbody>
              {shown.map((d) => {
                const n = nextStepOf(d, s.done)
                const toYou = paymentsOf(d).reduce((t, p) => t + p.net, 0)
                return (
                  <tr key={d.id} className="click" onClick={() => { window.location.hash = `#/deals/${d.id}` }}>
                    <td><Link to={`/deals/${d.id}`} style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Logo brand={d.brand} /><span><b style={{ fontWeight: 600 }}>{BRANDS[d.brand].name}</b><span className="muted" style={{ display: 'block', fontSize: 13 }}>{d.title}</span></span></Link></td>
                    <td><Pill tone={d.stage === 'paid' ? 'pos' : d.stage === 'negotiating' ? '' : 'acc'}>{STAGES.find((x) => x.key === d.stage).name}</Pill></td>
                    <td className="muted">{n ? `${STEP_VERB[n.kind]}, ${relDay(n.due)}` : '-'}</td>
                    <td className="r num">{rp(d.fee)}</td>
                    <td className="r num"><b style={{ fontWeight: 600 }}>{rp(toYou)}</b></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      )}
    </>
  )
}

function DealCard({ d, done, onDrag, onMove, dragging }) {
  const [menu, setMenu] = useState(false)
  const n = nextStepOf(d, done)
  const pays = paymentsOf(d)
  const paid = pays.filter((p) => p.state === 'paid').reduce((t, p) => t + p.gross, 0)
  const late = pays.find((p) => p.state === 'late')
  const due = n ? daysBetween(TODAY, n.due) : null
  return (
    <li className={`deal${dragging ? ' dragging' : ''}`} draggable onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; onDrag(d.id) }} onDragEnd={() => onDrag(null)}>
      <img src={food(d.thumb)} alt="" className="deal-img" width="260" height="80" loading="lazy" />
      <div className="deal-body">
        <div className="deal-top"><Logo brand={d.brand} size={24} /><b>{BRANDS[d.brand].name}</b>
          <button className="btn ghost sm icon" aria-label={`Move ${BRANDS[d.brand].name} to another stage`} aria-expanded={menu} onClick={() => setMenu(!menu)}><UilEllipsisH size={18} /></button>
        </div>
        <Link to={`/deals/${d.id}`} className="deal-title">{d.title}</Link>
        <p className="deal-fmt muted">{d.deliverables.map((x) => FORMATS[x.fmt].short).join(' + ')}</p>
        <p className="deal-money num"><b>{rp(d.fee)}</b></p>
        <p className="small muted">{paid ? `${Math.round((paid / d.fee) * 100)}% paid` : 'Nothing paid yet'}</p>
        <span className="track" style={{ display: 'block', height: 4, marginTop: 6, background: 'var(--raised)' }} aria-hidden="true"><span style={{ width: `${(paid / d.fee) * 100}%` }} /></span>
        {late ? <p className="deal-next late">Final payment {late.lateBy} days late</p> : n ? <p className={`deal-next${due < 0 ? ' late' : ''}`}>{STEP_VERB[n.kind]} · {n.fmt.short} · {relDay(n.due)}</p> : <p className="deal-next muted">{d.stage === 'paid' ? 'All paid' : 'Waiting on the brand'}</p>}
      </div>
      {menu && (
        <div className="menu" role="menu" style={{ right: 8, top: 120 }}>
          {STAGES.map((st) => <button key={st.key} role="menuitem" disabled={st.key === d.stage} onClick={() => { setMenu(false); onMove(d.id, st.key) }}>{st.key === d.stage ? `In ${st.name}` : `Move to ${st.name}`}</button>)}
        </div>
      )}
    </li>
  )
}
