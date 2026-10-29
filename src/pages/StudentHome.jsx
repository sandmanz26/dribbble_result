import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { PROJECTS, PEOPLE, SKILLS, SKILL_IN, CLOSERS, STUDENT, TODAY, readiness, projectOf, daysUntil } from '../data/bridge.js'
import { Bar, Strength, Avatar, fmtDate } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

export default function StudentHome() {
  const { s } = useStore()
  const ranked = PROJECTS.map((p) => ({ p, r: readiness(p, s.evidence) })).sort((a, b) => b.r.score - a.r.score)
  const ready = ranked.filter((x) => x.r.ready)
  const verified = s.evidence.filter((e) => e.strength === 'verified').length
  // A gap is worth closing when the project is within reach (50% or more) and not complete.
  const near = ranked.filter((x) => x.r.score >= 50 && x.r.score < 100)
  const gain = {}
  near.forEach(({ p, r }) => r.missing.forEach((m) => { gain[m.skill] = gain[m.skill] || { skill: m.skill, pts: 0, on: [] }; gain[m.skill].pts += m.gap; gain[m.skill].on.push({ p, gap: m.gap }) }))
  const gaps = Object.values(gain).sort((a, b) => b.pts - a.pts)
  const draft = s.applications.find((a) => a.state === 'draft')
  const draftP = draft && projectOf(draft.project)
  const passportDone = s.contributions.filter((c) => c.state === 'verified').length
  const greet = TODAY.getHours() < 12 ? 'Morning' : TODAY.getHours() < 18 ? 'Afternoon' : 'Evening'

  return (
    <div className="page home">
      <header className="title-row">
        <div>
          <h1 className="greet">{greet}, {STUDENT.first}. You’re ready for {ready.length} {ready.length === 1 ? 'project' : 'projects'}.</h1>
          <p className="sub">Thursday 29 October 2026 · {draftP ? <>Your draft for <Link to={`/app/projects/${draftP.id}`}>{draftP.title}</Link> closes in {daysUntil(draftP.deadline)} days.</> : 'No drafts waiting.'}</p>
        </div>
        {draftP && <Link to={`/app/projects/${draftP.id}`} className="btn is-primary">Finish the draft <I.Right size={16} /></Link>}
      </header>

      <section className="tiles" aria-label="At a glance">
        <div className="tile"><span>Ready for</span><b>{ready.length}</b><small>projects at 75% or more</small></div>
        <div className="tile"><span>Evidence</span><b>{s.evidence.length}</b><small>{verified} verified, {s.evidence.length - verified} not yet</small></div>
        <div className="tile"><span>Gaps within reach</span><b>{gaps.length}</b><small>skills on projects you are 50% ready for</small></div>
        <div className="tile"><span>Passport</span><b>{passportDone}</b><small>verified contribution{passportDone === 1 ? '' : 's'}, {s.contributions.length - passportDone} waiting</small></div>
      </section>

      <div className="row r-9-3">
        <section className="panel" aria-labelledby="m-h">
          <div className="panel-head"><h2 id="m-h">Projects matched to your evidence <span className="chip-count">{PROJECTS.length}</span></h2><Link to="/app/projects" className="more">View all</Link></div>
          <ul className="match-list">
            {ranked.slice(0, 5).map(({ p, r }) => {
              const app = s.applications.find((a) => a.project === p.id)
              return (
                <li key={p.id}>
                  <Link to={`/app/projects/${p.id}`} className="match">
                    <Avatar pi={p.pi} />
                    <span className="match-t"><b>{p.title}</b><small>{PEOPLE[p.pi].lab} · {p.hours} h a week · closes {fmtDate(p.deadline)}</small></span>
                    <span className="match-r"><Bar value={r.score} /><b className="num">{r.score}%</b></span>
                    <span className="match-gap">{r.missing.length === 0 ? <span className="ready-chip">Fully evidenced</span> : <>Missing: {r.missing.slice(0, 2).map((m) => SKILL_IN[m.skill]).join(', ')}{r.missing.length > 2 ? ` and ${r.missing.length - 2} more` : ''}</>}</span>
                    {app && <span className={`state is-${app.state}`}>{app.state === 'draft' ? 'Draft' : app.state === 'shortlisted' ? 'Shortlisted' : 'Sent'}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
          <p className="fine">The line on each bar is 75%, where we count you as ready. <Link to="/app/projects/bus-stop-heat">See how a score is worked out</Link>.</p>
        </section>

        <section className="panel" aria-labelledby="g-h">
          <div className="panel-head"><h2 id="g-h">Close a gap</h2></div>
          <ol className="gaps">
            {gaps.slice(0, 4).map((g) => (
              <li key={g.skill}>
                <b>{SKILLS[g.skill]}</b>
                <span>{CLOSERS[g.skill].what}.</span>
                <span className="gain">{g.on.map(({ p, gap }) => <span key={p.id}>+{Math.round(gap)} on {p.short}</span>)}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="row r-6-6">
        <section className="panel" aria-labelledby="a-h">
          <div className="panel-head"><h2 id="a-h">Applications <span className="chip-count">{s.applications.length}</span></h2><Link to="/app/applications" className="more">View all</Link></div>
          {s.applications.length ? (
            <ul className="rows">
              {s.applications.map((a) => { const p = projectOf(a.project); return (
                <li key={a.project}><Link to={`/app/projects/${p.id}`} className="row-card"><span className={`state is-${a.state}`}>{a.state === 'draft' ? 'Draft' : a.state === 'shortlisted' ? 'Shortlisted' : 'Sent'}</span><span><b>{p.title}</b><small>{a.note}</small></span></Link></li>
              ) })}
            </ul>
          ) : <p className="fine">No applications yet. Projects at 75% or more are worth a try.</p>}
        </section>
        <section className="panel" aria-labelledby="e-h">
          <div className="panel-head"><h2 id="e-h">Latest evidence <span className="chip-count">{s.evidence.length}</span></h2><Link to="/app/evidence" className="more">View all</Link></div>
          <ul className="rows">
            {s.evidence.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).map((e) => (
              <li key={e.id} className="row-card"><Strength s={e.strength} /><span><b>{e.title}</b><small>{SKILLS[e.skill]} · {e.kind} · {fmtDate(e.date, { month: 'short', year: 'numeric' })}</small></span></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
