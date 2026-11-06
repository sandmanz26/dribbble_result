import { Link } from 'react-router-dom'
import { FiMapPin, FiDollarSign, FiBookOpen, FiCheck, FiSend, FiRepeat } from 'react-icons/fi'
import { useStore } from '../store.jsx'
import { Card, Avatar, Badge, Progress, Empty } from '../ui.jsx'
import { OPENINGS, matches, program } from '../data.js'

export default function Redeploy() {
  const { role, isHR, proposed, propose, toast } = useStore()
  const list = OPENINGS.filter((o) => role.programs.includes(o.program))
  return (
    <>
      <div className="page-head">
        <div><h1>Redeployment</h1><p>{isHR ? 'People Pathwell suggests for your open roles. Only people who share their profile are shown by name.' : 'Open roles the employer shared, matched to participants by skills. Propose a match and HR sees it here.'}</p></div>
      </div>
      {list.length === 0 ? <Card><Empty icon={FiRepeat} title="No internal roles shared" text="Ask the employer to share open roles to start matching." /></Card> : (
        <div className="redeploy">
          {list.map((o) => {
            const m = matches(o)
            const pr = program(o.program)
            return (
              <section key={o.id} className="card opening">
                <header>
                  <span className="org-logo" style={{ background: pr.colour }}>{pr.logo}</span>
                  <div className="grow"><h2>{o.title}</h2><p>{pr.employer}, {o.id}</p></div>
                  <Badge tone="green">{m.length} matches</Badge>
                </header>
                <ul className="op-facts">
                  <li><FiMapPin aria-hidden="true" />{o.site}</li>
                  <li><FiDollarSign aria-hidden="true" />{o.pay}</li>
                  <li><FiBookOpen aria-hidden="true" />{o.reskill}</li>
                </ul>
                <div className="chips">{o.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
                <ul className="matches">
                  {m.map(({ p, hit, pct }) => {
                    const key = `${o.id}|${p.id}`
                    const hidden = isHR && !p.consent
                    const done = proposed.includes(key)
                    if (isHR && !done && !hidden) return null
                    return (
                      <li key={p.id}>
                        {hidden ? <Avatar hidden size={34} /> : <Avatar name={p.name} size={34} />}
                        <span className="grow">
                          {hidden ? <b>Not shared</b> : <Link to={`/participants/${p.id}`}><b>{p.name}</b></Link>}
                          <small>{p.title}, has {hit.length} of {o.skills.length} skills</small>
                          <Progress value={pct} tone={pct >= 75 ? 'green' : 'blue'} />
                        </span>
                        <b className="pct">{pct}%</b>
                        {isHR ? (done && !hidden ? <button className="btn sm" onClick={() => toast(`Interview invite sent to ${p.name.split(' ')[0]} (prototype)`)}>Invite</button> : null)
                          : done ? <Badge tone="green"><FiCheck aria-hidden="true" />Proposed</Badge>
                            : <button className="btn sm white" onClick={() => { propose(key); toast(`${p.name} proposed to ${pr.hr} for ${o.title}`) }}><FiSend aria-hidden="true" />Propose</button>}
                      </li>
                    )
                  })}
                  {isHR && !m.some(({ p }) => proposed.includes(`${o.id}|${p.id}`)) && <li className="muted">No proposals yet. Pathwell proposes people once their coach agrees it fits.</li>}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </>
  )
}
