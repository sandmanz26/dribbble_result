import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { PEOPLE, readiness, projectOf, daysUntil } from '../data/bridge.js'
import { Avatar, Empty, fmtDate } from '../ui/kit.jsx'

const STEPS = ['Draft', 'Sent', 'Shortlisted', 'Interview', 'Decision']
const AT = { draft: 0, sent: 1, shortlisted: 2 }

export default function Applications() {
  const { s } = useStore()
  return (
    <div className="page">
      <header className="title-row"><div><h1>Applications</h1><p className="sub">Where each one stands. Labs see your name only once they shortlist you.</p></div></header>
      {s.applications.length ? (
        <div className="stack">
          {s.applications.map((a) => {
            const p = projectOf(a.project); const r = readiness(p, s.evidence); const at = AT[a.state]
            return (
              <section key={a.project} className="panel app-card" aria-labelledby={`ap-${p.id}`}>
                <div className="panel-head">
                  <h2 id={`ap-${p.id}`}><Link to={`/app/projects/${p.id}`}>{p.title}</Link></h2>
                  <span className="muted">{r.score}% ready · closes {fmtDate(p.deadline)} ({daysUntil(p.deadline)} days)</span>
                </div>
                <div className="pi"><Avatar pi={p.pi} /><span><b>{PEOPLE[p.pi].name}</b><small>{PEOPLE[p.pi].lab}</small></span></div>
                <ol className="steps" aria-label="Progress">{STEPS.map((x, i) => <li key={x} className={i < at ? 'is-done' : i === at ? 'is-now' : ''} aria-current={i === at ? 'step' : undefined}>{x}</li>)}</ol>
                <p className="prose">{a.note}</p>
              </section>
            )
          })}
        </div>
      ) : <Empty title="No applications yet"><p>Projects at 75% or more are a good place to start.</p><Link className="btn" to="/app/projects">See projects</Link></Empty>}
    </div>
  )
}
