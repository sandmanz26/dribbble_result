import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { DECISIONS, RULES, decisionOf } from '../data/ai.js'
import { PEOPLE, productOf, clientOf, placeName, idr } from '../data/world.js'
import { AiTag, ClientAvatar, Dialog, Photo, Pill, Toast, useToast } from '../ui/kit.jsx'
import { PairBars } from '../ui/charts.jsx'
import { kindName } from './Today.jsx'
import * as I from '../ui/icons.js'

const NOW_LABEL = '10:41'
const REASONS = ['The data is wrong or out of date', 'Right idea, wrong timing', 'I know something it does not', 'Brand or client reason']

export default function Decisions() {
  const { id } = useParams()
  const { s, role } = useStore()
  const nav = useNavigate()
  const [tab, setTab] = useState('open')
  const mine = (d) => (role.id === 'owner' ? d.owner === 'ratna' : d.store === 'psn' || d.owner === 'dimas')
  const lists = {
    open: DECISIONS.filter((d) => !s.decided[d.id] && mine(d)),
    all: DECISIONS,
    done: DECISIONS.filter((d) => s.decided[d.id]),
  }
  const list = lists[tab]
  const cur = decisionOf(id) || list[0] || DECISIONS[0]
  return (
    <div className="page">
      <header className="title-row">
        <div><h1>Decisions</h1><p>Everything Selvedge proposes, with its reasons. {role.id === 'owner' ? 'You approve what is above the limits you set.' : 'Ratna approves what is above the limits; you can add what you know.'}</p></div>
        <div className="title-actions"><Link className="btn" to="/autopilot"><I.Autopilot /> Limits</Link></div>
      </header>
      <div className="split">
        <section className="card is-flush list-pane" aria-label="Proposals">
          <div className="tabs" role="tablist">
            {[['open', role.id === 'owner' ? 'Waiting for you' : 'Your boutique'], ['all', 'All'], ['done', 'Decided']].map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{label} <span className="num muted">{lists[k].length}</span></button>
            ))}
          </div>
          {list.length ? (
            <ul className="rows">
              {list.map((d) => {
                const st = s.decided[d.id]?.status
                return (
                  <li key={d.id}>
                    <button className={`row-link ${cur.id === d.id ? 'is-selected' : ''}`} onClick={() => nav(`/decisions/${d.id}`)}>
                      {d.product ? <Photo id={d.product} size="sm" /> : <span className="ph is-sm ph-icon"><I.Person /></span>}
                      <span className="cell-2"><span className="clamp2">{d.title}</span><small>{d.id} · {kindName[d.kind]} · {PEOPLE[d.owner].short} decides</small></span>
                      {st ? <Pill tone={st === 'approved' ? 'pos' : ''}>{st === 'approved' ? 'Approved' : st === 'declined' ? 'Declined' : 'Edited'}</Pill> : <span className="num">{idr(d.value)}</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : <p className="empty-line">{tab === 'done' ? 'Nothing decided yet in this session.' : 'Nothing waiting. New proposals arrive at 07:00 and when stock moves.'}</p>}
        </section>
        <Detail d={cur} key={cur.id} />
      </div>
    </div>
  )
}

function Detail({ d }) {
  const { s, dispatch, role, me } = useStore()
  const [dlg, setDlg] = useState(null)
  const [why, setWhy] = useState(REASONS[0])
  const [qty, setQty] = useState(2)
  const [picks, setPicks] = useState(['citra', 'anindya'])
  const [toast, show] = useToast()
  const done = s.decided[d.id]
  const rule = RULES.find((r) => r.id === d.rule)
  const canDecide = me.id === d.owner
  const p = d.product ? productOf(d.product) : null

  const decide = (status, note) => {
    const verb = status === 'approved' ? 'Approved' : status === 'declined' ? 'Declined' : 'Approved with an edit'
    dispatch({ type: 'decide', id: d.id, status, by: me.name, at: NOW_LABEL, note, picks: d.kind === 'allocation' ? picks : undefined,
      log: { id: `L-${Date.now()}`, when: `Thu 29 Oct, ${NOW_LABEL}`, what: `${verb}: ${d.title}`, detail: `By ${me.name}${note ? `. ${note}` : ''}`, kind: 'decision' } })
    setDlg(null)
    show(<span>{verb}. {status !== 'declined' ? followUp(d, picks) : 'Selvedge will weigh your reason next time.'}</span>)
  }

  return (
    <article className="card detail-pane" aria-labelledby="h-d">
      <header className="d-head">
        <div>
          <p className="id">{d.id} · {kindName[d.kind]}{d.store ? ` · ${placeName(d.store)}` : ''}</p>
          <h2 id="h-d">{d.title}</h2>
          <p className="muted">{d.asks} {PEOPLE[d.owner].name} decides.</p>
        </div>
        <div className="d-value"><span className="muted small">{d.valueLabel}</span><span className="num">{idr(d.value)}</span></div>
      </header>

      {done && (
        <div className={`d-done ${done.status}`} role="status">
          <I.Done />
          <span><b>{done.status === 'approved' ? 'Approved' : done.status === 'declined' ? 'Declined' : 'Approved with an edit'} by {done.by} at {done.at}.</b> {done.status === 'declined' ? `Reason: ${done.note}.` : followUp(d, done.picks)}</span>
          {done.status !== 'declined' && <button className="btn is-sm" onClick={() => dispatch({ type: 'undoDecision', id: d.id })}><I.Undo /> Undo</button>}
        </div>
      )}

      <section className="ai d-ai">
        <div className="card-head"><h3>Why Selvedge suggests it</h3><AiTag text="Proposed by Selvedge" when="07:00" sources={d.sources} /></div>
        <ul className="why">{d.why.map((w, i) => <li key={i}>{w}</li>)}</ul>
        {d.chart && <figure className="a-fig"><figcaption>{d.chart.title}, last 8 weeks</figcaption><PairBars a={d.chart.a} b={d.chart.b} labels={['7 Sep', '', '', '', '', '', '', '26 Oct']} /></figure>}
        {d.ranking && (
          <div className="ranking">
            <p className="h4">Waitlist, ranked <span className="muted">Choose two. The ranking explains; it does not decide.</span></p>
            <ul>
              {d.ranking.map((r, i) => {
                const c = clientOf(r.client); const on = picks.includes(r.client)
                return (
                  <li key={r.client}>
                    <button role="checkbox" aria-checked={on} disabled={!!done || !canDecide} onClick={() => setPicks(on ? picks.filter((x) => x !== r.client) : [...picks, r.client].slice(-2))}>
                      <span className="check-box">{on && <I.Check />}</span>
                      <span className="num rank">{i + 1}</span>
                      <ClientAvatar client={c} size="sm" />
                      <span className="cell-2"><span>{c.name} <span className="muted small">{c.tier} · {placeName(c.store)}</span></span><small>{r.reasons.join(' · ')}</small></span>
                      <Pill tone={i < 2 ? 'ai' : ''}>{r.score}</Pill>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        <dl className="d-facts">
          <div><dt>Expected effect</dt><dd>{d.effect.text}<span className="muted"> · {idr(d.effect.low)} to {idr(d.effect.high)}</span></dd></div>
          <div><dt>What could go wrong</dt><dd>{d.risk}</dd></div>
          {d.cost && <div><dt>Cost and timing</dt><dd>{d.cost}</dd></div>}
          <div><dt>How sure</dt><dd>{d.confidence}</dd></div>
        </dl>
      </section>

      {!done && (canDecide ? (
        <footer className="d-actions">
          <button className="btn is-primary" onClick={() => decide('approved')} disabled={d.kind === 'allocation' && picks.length !== 2}>{d.kind === 'allocation' ? `Offer to ${picks.map((x) => clientOf(x).name.split(' ')[0]).join(' and ') || '…'}` : 'Approve'}</button>
          {d.kind === 'transfer' && <button className="btn" onClick={() => setDlg('edit')}><I.Edit /> Edit</button>}
          <button className="btn" onClick={() => setDlg('decline')}>Decline</button>
          <span className="muted small">{rule?.locked || `Logged, and can be undone until it ships.`}</span>
        </footer>
      ) : (
        <footer className="d-actions">
          <span className="muted">{PEOPLE[d.owner].name} decides this one.</span>
          <button className="btn" onClick={() => show(`Your note was added for ${PEOPLE[d.owner].short}.`)}>Add what you know</button>
        </footer>
      ))}

      {p && <p className="d-link"><Link className="link" to={`/stock/${p.id}`}>Open {p.name}, {p.variant}</Link></p>}

      <Dialog open={dlg === 'decline'} onClose={() => setDlg(null)} title="Why decline?">
        <p className="muted">Your reason goes into the log and into how Selvedge weighs the next proposal like this.</p>
        <div className="radios" role="radiogroup">
          {REASONS.map((r) => <button key={r} role="radio" aria-checked={why === r} onClick={() => setWhy(r)}><span className="radio" />{r}</button>)}
        </div>
        <div className="dlg-foot"><button className="btn" onClick={() => setDlg(null)}>Cancel</button><button className="btn is-primary" onClick={() => decide('declined', why)}>Decline {d.id}</button></div>
      </Dialog>
      <Dialog open={dlg === 'edit'} onClose={() => setDlg(null)} title="Edit the transfer">
        <p className="muted">Pacific Place keeps its display minimum of 2, so up to 2 can move.</p>
        <div className="stepper-row"><span>Units to move</span><span className="stepper"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Fewer"><I.Minus /></button><output className="num">{qty}</output><button onClick={() => setQty(Math.min(2, qty + 1))} aria-label="More" disabled={qty >= 2}><I.Add /></button></span></div>
        <p className="small muted">Value {idr(qty * (p?.price || 0))}. {qty < 2 ? 'Plaza Senayan would run out about 4 days later than now.' : ''}</p>
        <div className="dlg-foot"><button className="btn" onClick={() => setDlg(null)}>Cancel</button><button className="btn is-primary" onClick={() => decide(qty === 2 ? 'approved' : 'edited', qty === 2 ? '' : `Moved ${qty} instead of 2`)}>Approve {qty}</button></div>
      </Dialog>
      <Toast toast={toast} />
    </article>
  )
}

function followUp(d, picks) {
  if (d.kind === 'transfer') return 'Transfer TR-2291 created. Pacific Place is asked to pack it by 12:00; it arrives Friday 14:00.'
  if (d.kind === 'allocation') return `${(picks || []).map((x) => clientOf(x).name).join(' and ')} will be offered the pieces by their advisors. The others hear from their advisor first.`
  if (d.kind === 'reorder') return 'Purchase order PO-0871 sent to the house for confirmation.'
  if (d.kind === 'markdown') return 'Transfer TR-2292 created from Seminyak. Kadek is told why the markdown was not taken.'
  return 'Arief is told.'
}
