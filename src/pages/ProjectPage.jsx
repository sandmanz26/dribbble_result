import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { PEOPLE, SKILLS, SKILL_IN, LEVEL, STRENGTH, CLOSERS, readiness, projectOf, daysUntil } from '../data/bridge.js'
import { Bar, Strength, Avatar, Dialog, Empty, fmtDate } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

export default function ProjectPage() {
  const { id } = useParams()
  const { s, dispatch } = useStore()
  const [confirm, setConfirm] = useState(false)
  const p = projectOf(id)
  if (!p) return <div className="page"><Empty title="This project is no longer open"><Link to="/app/projects" className="btn">All projects</Link></Empty></div>
  const r = readiness(p, s.evidence)
  const pi = PEOPLE[p.pi]
  const app = s.applications.find((a) => a.project === p.id)
  const sent = app && app.state !== 'draft'
  const pv = s.privacy
  return (
    <div className="page">
      <Link to="/app/projects" className="crumb"><I.Left size={16} /> Projects</Link>
      <header className="title-row proj-head">
        <img src={`photos/${p.photo}.webp`} alt="" width="160" height="120" className="proj-ph" />
        <div>
          <h1>{p.title}</h1>
          <p className="sub"><Avatar pi={p.pi} size={22} /> {pi.name} · {pi.lab}, {pi.dept}</p>
          <ul className="facts">
            <li><I.Clock size={16} aria-hidden="true" /> {p.hours} hours a week</li>
            <li><I.Grad size={16} aria-hidden="true" /> {p.pay}</li>
            <li><I.Calendar size={16} aria-hidden="true" /> Starts {fmtDate(p.start, { day: 'numeric', month: 'long', year: 'numeric' })}</li>
            <li><I.People size={16} aria-hidden="true" /> {p.spots} {p.spots === 1 ? 'place' : 'places'}</li>
            <li><I.Hourglass size={16} aria-hidden="true" /> Closes {fmtDate(p.deadline, { day: 'numeric', month: 'long' })}, in {daysUntil(p.deadline)} days</li>
          </ul>
        </div>
      </header>

      <div className="row r-8-4">
        <div className="col">
          <section className="panel" aria-labelledby="w-h">
            <div className="panel-head"><h2 id="w-h">Your readiness, worked out</h2><span className="big-score"><b>{r.score}%</b>{r.ready ? ' ready' : ' of the way'}</span></div>
            <p className="panel-sub">Each skill the lab asked for has a weight. Your best evidence for it counts in full when it is verified at the level asked, less when it is only linked or claimed, and half when it is below the level.</p>
            <div className="table-wrap">
              <table className="tbl work">
                <thead><tr><th>Skill asked for</th><th>Level</th><th>Your best evidence</th><th>Counts as</th><th className="num">Points</th></tr></thead>
                <tbody>
                  {r.rows.map((x) => (
                    <tr key={x.skill} className={x.v < 1 ? 'is-gap' : ''}>
                      <td><b>{x.name}</b></td>
                      <td>{LEVEL[x.level]}</td>
                      <td>{x.best ? <><span className={x.v >= 1 ? 'hl' : ''}>{x.best.title}</span><small className="muted block">{x.best.kind}, {x.best.by}</small></> : <span className="muted">-</span>}</td>
                      <td>{x.short ? <span className="str is-below">{STRENGTH[x.best.strength].label}, below level</span> : <Strength s={x.best?.strength} short />}</td>
                      <td className="num"><b>{String(x.pts).replace(/\.0$/, '')}</b><span className="muted"> / {x.w}</span></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr><td colSpan="4">Total, rounded</td><td className="num"><b>{r.score}</b><span className="muted"> / 100</span></td></tr></tfoot>
              </table>
            </div>
          </section>

          <section className="panel" aria-labelledby="miss-h">
            <div className="panel-head"><h2 id="miss-h">{r.missing.length ? `Missing or partly shown: ${r.missing.length}` : 'Nothing missing'}</h2></div>
            {r.missing.length ? (
              <ul className="rows">
                {r.missing.map((m) => (
                  <li key={m.skill} className="row-card miss">
                    <span className="miss-pts">+{String(m.gap).replace(/\.0$/, '')}</span>
                    <span><b>{SKILLS[m.skill]}{m.short ? `: shown at ${LEVEL[m.best.level].toLowerCase()} level, ${LEVEL[m.level].toLowerCase()} asked` : m.best ? `: ${STRENGTH[m.best.strength].label.toLowerCase()} only` : ': no evidence yet'}</b>
                      <small>{CLOSERS[m.skill].what}. {CLOSERS[m.skill].how}.</small></span>
                    <Link to={`/app/evidence?skill=${m.skill}`} className="btn is-quiet">Add evidence</Link>
                  </li>
                ))}
              </ul>
            ) : <p className="fine">Every skill this lab asked for is verified at the level asked.</p>}
          </section>

          <section className="panel" aria-labelledby="ab-h">
            <div className="panel-head"><h2 id="ab-h">About the project</h2></div>
            <p className="prose">{p.summary}</p>
          </section>
        </div>

        <aside className="col">
          <section className="panel apply" aria-labelledby="ap-h">
            <div className="panel-head"><h2 id="ap-h">{sent ? 'Application sent' : 'Apply'}</h2></div>
            {sent ? (
              <>
                <p className="prose">{app.note}</p>
                <button className="btn" onClick={() => dispatch({ type: 'withdraw', project: p.id })}>Withdraw</button>
              </>
            ) : (
              <>
                <p className="prose">The lab sees what your privacy settings allow:</p>
                <ul className="ticks">
                  <li><I.Check size={16} aria-hidden="true" /> Your readiness of {r.score}% and how it is worked out</li>
                  <li><I.Check size={16} aria-hidden="true" /> Your evidence for the {p.reqs.length} skills they asked for</li>
                  <li>{pv.blind ? <I.EyeClosed size={16} aria-hidden="true" /> : <I.Check size={16} aria-hidden="true" />} {pv.blind ? 'Not your name or photo until they shortlist you' : 'Your name from the start'}</li>
                  <li>{pv.grades ? <I.Check size={16} aria-hidden="true" /> : <I.EyeClosed size={16} aria-hidden="true" />} {pv.grades ? 'Course grades' : 'Not your grades: courses show as verified only'}</li>
                </ul>
                <Link to="/app/privacy" className="more">Change what labs see</Link>
                <button className="btn is-primary wide" onClick={() => setConfirm(true)}>{app?.state === 'draft' ? 'Send the draft' : 'Apply'} with {r.score}% readiness</button>
                {!r.ready && <p className="fine">Under 75% you can still apply. Labs see the gaps you are closing.</p>}
              </>
            )}
          </section>
          <section className="panel" aria-labelledby="pi-h">
            <div className="panel-head"><h2 id="pi-h">Who you would work with</h2></div>
            <div className="pi"><Avatar pi={p.pi} size={44} /><span><b>{pi.name}</b><small>{pi.lab}, {pi.dept}</small></span></div>
            <p className="fine">Contributions on this project are recorded in your passport with the roles you take, once {pi.name} verifies them.</p>
          </section>
        </aside>
      </div>

      <Dialog open={confirm} onClose={() => setConfirm(false)} title="Send your application?">
        <p className="prose">{pi.name} will see your evidence for {p.reqs.map((x) => SKILL_IN[x.skill]).join(', ')}{pv.blind ? ', with your name hidden until shortlisting' : ''}. You can withdraw at any time.</p>
        <label className="field"><span>A line for the lab (optional)</span><textarea rows="3" placeholder="Why this project, and when you can start" /></label>
        <div className="dlg-foot"><button className="btn" onClick={() => setConfirm(false)}>Not yet</button><button className="btn is-primary" onClick={() => { dispatch({ type: 'apply', project: p.id }); setConfirm(false) }}>Send application</button></div>
      </Dialog>
    </div>
  )
}
