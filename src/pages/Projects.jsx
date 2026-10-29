import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { PROJECTS, PEOPLE, SKILLS, readiness, daysUntil } from '../data/bridge.js'
import { Bar, Avatar, Empty, fmtDate } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

export default function Projects() {
  const { s } = useStore()
  const loc = useLocation()
  const search = useRef(null)
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('all')
  const [onlyReady, setOnlyReady] = useState(false)
  const [paid, setPaid] = useState(false)
  const [sort, setSort] = useState('ready')
  useEffect(() => { if (new URLSearchParams(loc.search).get('focus')) search.current?.focus() }, [loc.search])
  const depts = [...new Set(PROJECTS.map((p) => PEOPLE[p.pi].dept))].sort()
  let rows = PROJECTS.map((p) => ({ p, r: readiness(p, s.evidence) }))
  rows = rows.filter(({ p, r }) => (!q || `${p.title} ${p.summary} ${PEOPLE[p.pi].lab} ${p.reqs.map((x) => SKILLS[x.skill]).join(' ')}`.toLowerCase().includes(q.toLowerCase()))
    && (dept === 'all' || PEOPLE[p.pi].dept === dept) && (!onlyReady || r.ready) && (!paid || p.pay.startsWith('Paid')))
  rows.sort((a, b) => (sort === 'ready' ? b.r.score - a.r.score : a.p.deadline.localeCompare(b.p.deadline)))
  const clear = () => { setQ(''); setDept('all'); setOnlyReady(false); setPaid(false) }
  return (
    <div className="page">
      <header className="title-row"><div><h1>Projects</h1><p className="sub">{PROJECTS.length} open at Northgate University this term, ranked by how much of each one your evidence covers.</p></div></header>
      <div className="filters" role="search">
        <label className="search"><I.Search size={16} aria-hidden="true" /><span className="sr">Search projects</span><input ref={search} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by topic, lab or skill" /><span className="kbd" aria-hidden="true">/</span></label>
        <label className="sel"><span className="sr">Department</span><select value={dept} onChange={(e) => setDept(e.target.value)}><option value="all">All departments</option>{depts.map((d) => <option key={d}>{d}</option>)}</select><I.Down size={16} aria-hidden="true" /></label>
        <label className="check"><input type="checkbox" checked={onlyReady} onChange={(e) => setOnlyReady(e.target.checked)} /> Ready only</label>
        <label className="check"><input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} /> Paid only</label>
        <label className="sel"><span className="sr">Sort</span><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="ready">Most ready first</option><option value="deadline">Closing soonest</option></select><I.Down size={16} aria-hidden="true" /></label>
      </div>
      {rows.length ? (
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Project</th><th>Hours</th><th>Pay</th><th>Closes</th><th className="num">Readiness</th></tr></thead>
            <tbody>
              {rows.map(({ p, r }) => (
                <tr key={p.id}>
                  <td><Link to={`/app/projects/${p.id}`} className="cell-proj"><Avatar pi={p.pi} /><span><b>{p.title}</b><small>{PEOPLE[p.pi].name} · {PEOPLE[p.pi].lab}</small></span></Link></td>
                  <td className="num">{p.hours} h/wk</td>
                  <td>{p.pay.split(',')[0]}</td>
                  <td>{fmtDate(p.deadline)} <small className="muted">in {daysUntil(p.deadline)} days</small></td>
                  <td className="num"><span className="tbl-ready"><Bar value={r.score} /><b>{r.score}%</b></span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty title="No projects match these filters">
          <p>{onlyReady ? 'None of the matching projects is at 75% yet. Closing one gap often gets you there.' : 'Try a broader search.'}</p>
          <button className="btn" onClick={clear}>Clear filters</button>
        </Empty>
      )}
    </div>
  )
}
