import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { PROJECTS, SKILLS, LEVEL, CLOSERS, RESEARCHER, scoreOf, readiness, projectOf } from '../data/bridge.js'
import { Bar, Strength, Toggle, Dialog, Empty, fmtDate } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

const STATES = { new: 'New', shortlisted: 'Shortlisted', task: 'Task sent', declined: 'Declined' }
const REASONS = ['Places are filled', 'Evidence does not cover the core skill yet', 'Hours do not fit the project', 'Another reason, in a note']

export default function Applicants() {
  const { s, dispatch } = useStore()
  const loc = useLocation(); const nav = useNavigate()
  const q = new URLSearchParams(loc.search)
  const mine = PROJECTS.filter((p) => p.pi === RESEARCHER.id)
  const p = projectOf(q.get('project')) || mine[0]
  const openId = q.get('open')
  const [show, setShow] = useState('active')
  const [decline, setDecline] = useState(null)
  const [reason, setReason] = useState(REASONS[0])
  const all = s.applicants.filter((a) => a.project === p.id)
  const rows = all.filter((a) => (show === 'active' ? a.state !== 'declined' : a.state === 'declined')).map((a) => ({ a, score: scoreOf(a) })).sort((x, y) => y.score - x.score)
  const blind = s.blindLab
  const name = (a) => (blind && a.state !== 'shortlisted' ? `Applicant ${a.id}` : a.name || `Applicant ${a.id}`)
  const open = all.find((a) => a.id === openId)
  const setOpen = (id) => nav(`/lab/applicants?project=${p.id}${id ? `&open=${id}` : ''}`, { replace: true })
  const act = (a, state, toast) => dispatch({ type: 'applicant', id: a.id, state, toast })
  return (
    <div className="page">
      <header className="title-row">
        <div><h1>Applicants</h1><p className="sub">Ranked by evidence for the skills you asked for. {blind ? 'Names stay hidden until you shortlist.' : 'Names are shown.'}</p></div>
        <div className="sw-inline"><label htmlFor="blind">Blind review</label><Toggle id="blind" on={blind} onChange={(v) => dispatch({ type: 'blindLab', on: v })} label="Blind review" /></div>
      </header>
      <div className="tabs" role="tablist" aria-label="Project">
        {mine.map((x) => <button key={x.id} role="tab" aria-selected={x.id === p.id} onClick={() => nav(`/lab/applicants?project=${x.id}`)}>{x.title} <span className="muted">{s.applicants.filter((a) => a.project === x.id).length}</span></button>)}
      </div>
      <div className="filters">
        <div className="seg" role="radiogroup" aria-label="Show">{[['active', 'Under review'], ['declined', 'Declined']].map(([k, l]) => <label key={k} className={show === k ? 'is-on' : ''}><input type="radio" name="show" checked={show === k} onChange={() => setShow(k)} />{l}</label>)}</div>
        <span className="muted">{rows.length} shown · {p.spots} {p.spots === 1 ? 'place' : 'places'}</span>
      </div>
      {rows.length ? (
        <div className="table-wrap">
          <table className="tbl app-tbl">
            <thead><tr><th>Applicant</th>{p.reqs.map((r) => <th key={r.skill}>{SKILLS[r.skill]}<small className="muted block">weight {r.w}</small></th>)}<th className="num">Readiness</th><th className="num">Hours</th><th>State</th><th><span className="sr">Actions</span></th></tr></thead>
            <tbody>
              {rows.map(({ a, score }) => (
                <tr key={a.id} className={openId === a.id ? 'is-sel' : ''}>
                  <td><button className="link-strong" onClick={() => setOpen(a.id)}>{name(a)}</button><small className="muted block">applied {fmtDate(a.at)}</small></td>
                  {a.scores.map((v, i) => <td key={i}><Strength s={v} short /></td>)}
                  <td className="num"><span className="tbl-ready"><Bar value={score} /><b>{score}%</b></span></td>
                  <td className="num">{a.hours} h</td>
                  <td><span className={`state is-${a.state}`}>{STATES[a.state]}</span></td>
                  <td className="acts">
                    {a.state !== 'shortlisted' && a.state !== 'declined' && <button className="btn is-small" onClick={() => act(a, 'shortlisted', `${a.id} shortlisted. Their name is now visible.`)}>Shortlist</button>}
                    {a.state === 'new' && <button className="btn is-small is-quiet" onClick={() => act(a, 'task', `Bridge task sent to ${a.id}`)}>Send task</button>}
                    {a.state !== 'declined' && <button className="icon-btn" onClick={() => setDecline(a)} aria-label={`Decline ${name(a)}`}><I.X size={16} /></button>}
                    {a.state === 'declined' && <button className="btn is-small is-quiet" onClick={() => act(a, 'new', `${a.id} is back under review`)}>Undo</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <Empty title={show === 'declined' ? 'Nobody declined yet' : 'No applicants under review'}><p>{show === 'declined' ? 'Declined applicants keep their place here, with the reason they were sent.' : 'New applications appear here as they arrive.'}</p></Empty>}
      <p className="fine">Evidence key: <Strength s="verified" /> at the level asked · <Strength s="linked" /> work linked, unchecked · <span className="str is-below">Below level</span> · <Strength s="claimed" /> statement only · <span className="str is-none">None</span></p>

      <Dialog open={!!open} onClose={() => setOpen(null)} title={open ? name(open) : ''} wide>
        {open && <Detail a={open} p={p} blind={blind} />}
      </Dialog>
      <Dialog open={!!decline} onClose={() => setDecline(null)} title={decline ? `Decline ${name(decline)}?` : ''}>
        <p className="prose">They receive the reason with a pointer to what would close the gap. Nothing about the decision is shared with other labs.</p>
        <fieldset className="field"><legend>Reason</legend><div className="opts">{REASONS.map((r) => <label key={r} className={`opt ${reason === r ? 'is-on' : ''}`}><input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} /><span><b>{r}</b></span></label>)}</div></fieldset>
        <div className="dlg-foot"><button className="btn" onClick={() => setDecline(null)}>Cancel</button><button className="btn is-primary" onClick={() => { dispatch({ type: 'applicant', id: decline.id, state: 'declined', reason, toast: `${decline.id} declined. The reason is on its way.` }); setDecline(null) }}>Decline with this reason</button></div>
      </Dialog>
    </div>
  )
}

function Detail({ a, p, blind }) {
  const { s } = useStore()
  const isLina = a.id === 'A-31'
  const r = isLina ? readiness(p, s.evidence) : null
  return (
    <div className="detail">
      <p className="prose">{a.hours} hours a week · applied {fmtDate(a.at, { day: 'numeric', month: 'long' })} · {scoreOf(a)}% ready{blind && a.state !== 'shortlisted' ? ' · name hidden until shortlisting' : ''}</p>
      <ul className="rows">
        {p.reqs.map((q, i) => {
          const row = r?.rows[i]
          return (
            <li key={q.skill} className="row-card ev">
              <Strength s={a.scores[i]} />
              <span><b>{SKILLS[q.skill]}, {LEVEL[q.level].toLowerCase()} asked</b>
                <small>{row?.best ? `${row.best.title} · ${row.best.kind}, ${row.best.by}` : a.scores[i] >= 1 ? 'Verified record at the level asked' : a.scores[i] > 0 ? 'Partly shown' : 'No evidence yet'}</small>
                {a.scores[i] < 1 && <small className="muted">To close it: {CLOSERS[q.skill].what.toLowerCase()}.</small>}</span>
            </li>
          )
        })}
      </ul>
      {isLina && <p className="fine">Passport: 1 verified contribution, 96 hours, Urban Climate Lab. <Link to="/p/BRG-7Q4-LH2">Open the passport</Link></p>}
    </div>
  )
}
