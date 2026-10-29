import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { PROJECTS, SKILLS, SKILL_IN, LEVEL, RESEARCHER, TODAY, scoreOf, daysUntil } from '../data/bridge.js'
import { Bar, SkillChip, fmtDate } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

export default function LabHome() {
  const { s } = useStore()
  const mine = PROJECTS.filter((p) => p.pi === RESEARCHER.id)
  const main = mine[0]
  const pool = s.applicants.filter((a) => a.project === main.id && a.state !== 'declined')
  const ranked = pool.map((a) => ({ a, score: scoreOf(a) })).sort((x, y) => y.score - x.score)
  const fresh = s.applicants.filter((a) => a.state === 'new').length
  const short = s.applicants.filter((a) => a.state === 'shortlisted').length
  const places = mine.reduce((t, p) => t + p.spots, 0)
  // Coverage: how many in the pool show each required skill verified at the level asked.
  const coverage = main.reqs.map((r, i) => ({ r, n: pool.filter((a) => a.scores[i] >= 1).length }))
  const weakest = coverage.slice().sort((a, b) => a.n - b.n)[0]
  const greet = TODAY.getHours() < 12 ? 'Morning' : TODAY.getHours() < 18 ? 'Afternoon' : 'Evening'
  const label = (a) => (s.blindLab && a.state !== 'shortlisted' ? `Applicant ${a.id}` : a.name || `Applicant ${a.id}`)
  return (
    <div className="page home">
      <header className="title-row">
        <div>
          <h1 className="greet">{greet}, {RESEARCHER.first}. {fresh} new applicants, {s.verify.length} to sign.</h1>
          <p className="sub">Thursday 29 October 2026 · Only {weakest.n} of {pool.length} applicants for {main.short.toLowerCase()} show {SKILL_IN[weakest.r.skill]} verified at {LEVEL[weakest.r.level].toLowerCase()} level.</p>
        </div>
        <Link to={`/lab/applicants?project=${main.id}`} className="btn is-primary">Review new applicants <I.Right size={16} /></Link>
      </header>

      <section className="tiles" aria-label="At a glance">
        <div className="tile"><span>New applicants</span><b>{fresh}</b><small>not yet reviewed</small></div>
        <div className="tile"><span>Shortlisted</span><b>{short}</b><small>names visible to you</small></div>
        <div className="tile"><span>To verify</span><b>{s.verify.length}</b><small>contributions waiting for your signature</small></div>
        <div className="tile"><span>Open places</span><b>{places}</b><small>across {mine.length} projects</small></div>
      </section>

      <div className="row r-9-3">
        <section className="panel" aria-labelledby="ap-h">
          <div className="panel-head"><h2 id="ap-h">{main.title} <span className="chip-count">{pool.length} applicants</span></h2><Link to={`/lab/applicants?project=${main.id}`} className="more">View all</Link></div>
          <ul className="match-list">
            {ranked.slice(0, 5).map(({ a, score }) => (
              <li key={a.id}>
                <Link to={`/lab/applicants?project=${main.id}&open=${a.id}`} className="match is-lab">
                  <span className={`anon ${s.blindLab && a.state !== 'shortlisted' ? '' : 'is-named'}`} aria-hidden="true">{s.blindLab && a.state !== 'shortlisted' ? <I.EyeClosed size={14} /> : (a.name || '?').split(' ').map((x) => x[0]).join('')}</span>
                  <span className="match-t"><b>{label(a)}</b><small>{a.hours} h a week · applied {fmtDate(a.at)}</small></span>
                  <span className="match-r"><Bar value={score} /><b className="num">{score}%</b></span>
                  <span className="cells-mini" aria-label="Evidence per skill">{main.reqs.map((r, i) => <SkillChip key={r.skill} skill={r.skill} v={a.scores[i]} />)}</span>
                  <span className={`state is-${a.state}`}>{{ new: 'New', shortlisted: 'Shortlisted', task: 'Task sent', declined: 'Declined' }[a.state]}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="fine">{s.blindLab ? 'Names stay hidden until you shortlist. ' : 'Names are visible. '}Ranked by evidence for the {main.reqs.length} skills you asked for, weighted as you set them.</p>
        </section>
        <section className="panel" aria-labelledby="v-h">
          <div className="panel-head"><h2 id="v-h">Waiting for your signature</h2><Link to="/lab/verify" className="more">Open</Link></div>
          {s.verify.length ? (
            <ul className="rows">{s.verify.map((v) => <li key={v.id} className="row-card col"><b>{v.who}</b><small>{v.project}, {v.hours} h · asked {fmtDate(v.asked)}</small><small className="muted">{v.roles.join(', ')}</small></li>)}</ul>
          ) : <p className="fine">Nothing to sign. Students ask you when a project ends.</p>}
        </section>
      </div>

      <div className="row r-6-6">
        <section className="panel" aria-labelledby="pr-h">
          <div className="panel-head"><h2 id="pr-h">Your open projects <span className="chip-count">{mine.length}</span></h2></div>
          <ul className="rows">
            {mine.map((p) => { const n = s.applicants.filter((a) => a.project === p.id).length; return (
              <li key={p.id}><Link to={`/lab/applicants?project=${p.id}`} className="row-card"><span className="num-big">{n}</span><span><b>{p.title}</b><small>{n} applicants for {p.spots} {p.spots === 1 ? 'place' : 'places'} · closes {fmtDate(p.deadline)}, in {daysUntil(p.deadline)} days</small></span></Link></li>
            ) })}
          </ul>
        </section>
        <section className="panel" aria-labelledby="cv-h">
          <div className="panel-head"><h2 id="cv-h">Skills your pool can show</h2><span className="muted">{main.short}</span></div>
          <ul className="coverage">
            {coverage.map(({ r, n }) => (
              <li key={r.skill}><span>{SKILLS[r.skill]} <small className="muted">{LEVEL[r.level].toLowerCase()}, weight {r.w}</small></span><span className="cov-bar" role="img" aria-label={`${n} of ${pool.length}`}><span style={{ width: `${(n / pool.length) * 100}%` }} /></span><b className="num">{n} of {pool.length}</b></li>
            ))}
          </ul>
          <p className="fine">Short on {SKILL_IN[weakest.r.skill]}? Invite promising applicants to the Bridge task for it. It is reviewed by your lab and counts as verified.</p>
        </section>
      </div>
    </div>
  )
}
