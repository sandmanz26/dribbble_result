import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiFilter, FiSend, FiUserCheck, FiAlertTriangle, FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronDown, FiSearch, FiInbox, FiDownload } from 'react-icons/fi'
import { useStore } from '../store.jsx'
import { Avatar, Stage, Progress, Empty } from '../ui.jsx'
import { STAGES, PROGRAMS, COACHES, coach } from '../data.js'

const PER = 12

export default function Participants() {
  const { people, isHR, role, assign, nudge, nudged, toast } = useStore()
  const [sp, setSp] = useSearchParams()
  const [q, setQ] = useState('')
  const [prog, setProg] = useState('all')
  const [stage, setStage] = useState(-1)
  const [co, setCo] = useState('all')
  const [flag, setFlag] = useState(sp.get('flag') === '1')
  const [sort, setSort] = useState(['lastActive', 1])
  const [page, setPage] = useState(0)
  const [sel, setSel] = useState([])
  const [bulkCoach, setBulkCoach] = useState('')

  const rows = useMemo(() => {
    let r = people.filter((p) => (prog === 'all' || p.program === prog) && (stage < 0 || p.stage === stage) && (co === 'all' || p.coach === co) && (!flag || p.risk.length))
    if (q.trim()) { const t = q.toLowerCase(); r = r.filter((p) => (!isHR || p.consent) && (p.name.toLowerCase().includes(t) || p.id.toLowerCase().includes(t) || p.title.toLowerCase().includes(t))) }
    const [k, dir] = sort
    return [...r].sort((a, b) => (k === 'name' ? a.name.localeCompare(b.name) : (a[k] - b[k])) * dir)
  }, [people, prog, stage, co, flag, q, sort, isHR])
  const pages = Math.max(1, Math.ceil(rows.length / PER))
  const view = rows.slice(page * PER, page * PER + PER)
  const counts = STAGES.map((_, i) => people.filter((p) => (prog === 'all' || p.program === prog) && p.stage === i).length)
  const allOn = view.length > 0 && view.every((p) => sel.includes(p.id))
  const reset = () => { setPage(0); setSel([]) }
  const th = (k, label) => (
    <th aria-sort={sort[0] === k ? (sort[1] > 0 ? 'ascending' : 'descending') : 'none'}>
      <button className="th-btn" onClick={() => setSort(([a, d]) => [k, a === k ? -d : 1])}>{label}{sort[0] === k && (sort[1] > 0 ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />)}</button>
    </th>
  )
  const exportCsv = () => {
    const head = ['ID', 'Name', 'Employer', 'Former role', 'Stage', 'Coach', 'Last active (days)', 'Resume score']
    const lines = rows.map((p) => [p.id, isHR && !p.consent ? 'Not shared' : p.name, p.employer, p.title, STAGES[p.stage], coach(p.coach).name, p.lastActive, p.resume].map((v) => `"${v}"`).join(','))
    const url = URL.createObjectURL(new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv' }))
    const a = document.createElement('a'); a.href = url; a.download = 'pathwell-participants.csv'; a.click(); URL.revokeObjectURL(url)
    toast(`${rows.length} rows exported to CSV`)
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Participants</h1><p>{people.length} people in {role.programs.length > 1 ? 'all programmes' : 'your programme'}. Click a row to open the profile.</p></div>
        <div className="head-actions"><button className="btn white" onClick={exportCsv}><FiDownload aria-hidden="true" />Export CSV</button></div>
      </div>

      <div className="stage-tabs" role="tablist" aria-label="Stage">
        <button role="tab" aria-selected={stage < 0} onClick={() => { setStage(-1); reset() }}>All<span>{people.filter((p) => prog === 'all' || p.program === prog).length}</span></button>
        {STAGES.map((s, i) => <button key={s} role="tab" aria-selected={stage === i} onClick={() => { setStage(i); reset() }}>{s}<span>{counts[i]}</span></button>)}
      </div>

      <section className="card">
        <div className="toolbar">
          <label className="field-search"><FiSearch aria-hidden="true" /><input value={q} onChange={(e) => { setQ(e.target.value); reset() }} placeholder="Name, ID or former role" aria-label="Filter by name, ID or role" /></label>
          {role.programs.length > 1 && (
            <select value={prog} onChange={(e) => { setProg(e.target.value); reset() }} aria-label="Programme"><option value="all">All programmes</option>{PROGRAMS.map((p) => <option key={p.id} value={p.id}>{p.employer}</option>)}</select>
          )}
          <select value={co} onChange={(e) => { setCo(e.target.value); reset() }} aria-label="Coach"><option value="all">All coaches</option>{COACHES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          {!isHR && <label className="switch"><input type="checkbox" checked={flag} onChange={(e) => { setFlag(e.target.checked); reset(); setSp(e.target.checked ? { flag: '1' } : {}) }} /><i aria-hidden="true" />Flagged only</label>}
          <span className="toolbar-count"><FiFilter aria-hidden="true" />{rows.length} shown</span>
        </div>

        {sel.length > 0 && !isHR && (
          <div className="bulk" role="region" aria-label="Bulk actions">
            <b>{sel.length} selected</b>
            <select value={bulkCoach} onChange={(e) => setBulkCoach(e.target.value)} aria-label="Coach to assign"><option value="">Assign to coach</option>{COACHES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <button className="btn sm" disabled={!bulkCoach} onClick={() => { assign(sel, bulkCoach); toast(`${sel.length} assigned to ${coach(bulkCoach).name}`); setSel([]); setBulkCoach('') }}><FiUserCheck aria-hidden="true" />Assign</button>
            <button className="btn sm white" onClick={() => { nudge(sel); toast(`Check-in nudge sent to ${sel.length} people`); setSel([]) }}><FiSend aria-hidden="true" />Send check-in nudge</button>
            <button className="link" onClick={() => setSel([])}>Clear</button>
          </div>
        )}

        {view.length === 0 ? (
          <Empty icon={FiInbox} title="Nobody matches these filters" text="Try another stage or clear the search."><button className="btn sm white" onClick={() => { setQ(''); setProg('all'); setStage(-1); setCo('all'); setFlag(false); reset() }}>Clear filters</button></Empty>
        ) : (
          <div className="table-wrap">
            <table className="table hover">
              <thead>
                <tr>
                  {!isHR && <th className="chk"><input type="checkbox" checked={allOn} onChange={() => setSel(allOn ? sel.filter((x) => !view.some((p) => p.id === x)) : [...new Set([...sel, ...view.map((p) => p.id)])])} aria-label="Select page" /></th>}
                  {th('name', 'Participant')}<th>Former role</th>{th('stage', 'Stage')}<th>Coach</th>{th('resume', 'Resume score')}{th('lastActive', 'Last active')}<th>{isHR ? 'Applications' : 'Flags'}</th>
                </tr>
              </thead>
              <tbody>
                {view.map((p) => {
                  const hidden = isHR && !p.consent
                  return (
                    <tr key={p.id} className={sel.includes(p.id) ? 'on' : ''}>
                      {!isHR && <td className="chk"><input type="checkbox" checked={sel.includes(p.id)} onChange={() => setSel((s) => s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id])} aria-label={`Select ${p.name}`} /></td>}
                      <td>{hidden ? <span className="who"><Avatar hidden size={34} /><span><b>Not shared</b><small>{p.id}</small></span></span> : <Link to={`/participants/${p.id}`} className="who"><Avatar name={p.name} size={34} /><span><b>{p.name}</b><small>{p.id}{role.programs.length > 1 ? `, ${p.employer}` : ''}</small></span></Link>}</td>
                      <td>{p.title}<small className="block muted">{p.level === 'IC' ? 'Individual contributor' : p.level}, {p.tenure} yrs</small></td>
                      <td><Stage i={p.stage} /></td>
                      <td>{coach(p.coach).name}</td>
                      <td><span className="score"><Progress value={p.resume} tone={p.resume < 55 ? 'red' : p.resume < 70 ? 'amber' : 'green'} /><b>{p.resume}</b></span></td>
                      <td>{p.lastActive === 0 ? 'Today' : `${p.lastActive}d ago`}</td>
                      <td>{isHR ? p.apps : p.risk.length ? <span className="flag" title={p.risk.join('. ')}><FiAlertTriangle aria-hidden="true" />{p.risk.length}{nudged.includes(p.id) && <em>nudged</em>}</span> : <span className="muted">None</span>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="pager">
          <span>Showing {rows.length ? page * PER + 1 : 0} to {Math.min(rows.length, page * PER + PER)} of {rows.length}</span>
          <div>
            <button className="icon-btn sm" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous page"><FiChevronLeft /></button>
            {Array.from({ length: pages }).slice(0, 7).map((_, i) => <button key={i} className={`pg ${page === i ? 'on' : ''}`} onClick={() => setPage(i)} aria-current={page === i ? 'page' : undefined}>{i + 1}</button>)}
            <button className="icon-btn sm" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} aria-label="Next page"><FiChevronRight /></button>
          </div>
        </div>
      </section>
    </>
  )
}
