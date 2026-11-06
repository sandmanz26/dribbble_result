import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiMail, FiCalendar, FiUserCheck, FiMapPin, FiBriefcase, FiFileText, FiSend, FiMessageSquare, FiCheck, FiLock, FiAlertTriangle } from 'react-icons/fi'
import { useStore } from '../store.jsx'
import { Avatar, Stage, Card, Chart, base, Badge, Progress, Empty } from '../ui.jsx'
import { STAGES, COACHES, SESSIONS, OPENINGS, coach, person as find, fmt, fmtShort, TODAY } from '../data.js'

export default function Participant() {
  const { id } = useParams()
  const { people, isHR, assign, toast } = useStore()
  const p = people.find((x) => x.id === id)
  const [tab, setTab] = useState('overview')
  const [pick, setPick] = useState('')
  if (!p) return <Card><Empty icon={FiLock} title="Not in your programmes" text="This participant is not in a programme you can see."><Link className="btn sm white" to="/participants">Back to participants</Link></Empty></Card>
  if (isHR && !p.consent) return <Card><Empty icon={FiLock} title="This person has not shared their profile" text="Totals still count them. Their coach can ask if they would like to share."><Link className="btn sm white" to="/participants">Back to participants</Link></Empty></Card>
  const c = coach(p.coach)
  const sess = SESSIONS.filter((s) => s.person === p.id)
  const fits = OPENINGS.filter((o) => o.program === p.program).map((o) => ({ o, hit: o.skills.filter((k) => p.skills.includes(k)) })).filter((x) => x.hit.length >= 2)
  const timeline = [
    { t: 'Enrolled in the programme', d: p.enrolled, icon: FiCheck },
    p.stage >= 1 && { t: `Resume rebuilt, score ${p.resume - 8} to ${p.resume}`, d: new Date(+p.enrolled + 9 * 864e5), icon: FiFileText },
    p.stage >= 2 && { t: `Started applying, ${p.apps} applications so far`, d: new Date(+p.enrolled + 16 * 864e5), icon: FiSend },
    p.stage >= 3 && { t: `${p.interviews} interviews`, d: new Date(+p.enrolled + 30 * 864e5), icon: FiMessageSquare },
    p.landed && { t: `Landed: ${p.landed.as}`, d: p.landed.on, icon: FiBriefcase },
  ].filter(Boolean)
  return (
    <>
      <Link to="/participants" className="back"><FiArrowLeft aria-hidden="true" />Participants</Link>
      <section className="card profile-head">
        <Avatar name={p.name} size={72} />
        <div className="grow">
          <h1>{p.name}</h1>
          <p className="meta"><span><FiBriefcase aria-hidden="true" />{p.title}, {p.tenure} years at {p.employer}</span><span><FiMapPin aria-hidden="true" />{p.city}</span><span>{p.id}</span></p>
          <div className="stepper" aria-label={`Stage: ${STAGES[p.stage]}`}>
            {STAGES.map((s, i) => <span key={s} className={i < p.stage ? 'done' : i === p.stage ? 'now' : ''}><i>{i < p.stage ? <FiCheck aria-hidden="true" /> : i + 1}</i>{s}</span>)}
          </div>
        </div>
        <div className="head-actions col">
          <button className="btn" onClick={() => toast(`Message sent to ${p.name.split(' ')[0]} (prototype)`)}><FiMail aria-hidden="true" />Message</button>
          <button className="btn white" onClick={() => toast(`Session request sent to ${c.name}`)}><FiCalendar aria-hidden="true" />Book a session</button>
        </div>
      </section>

      <div className="tabs" role="tablist">
        {[['overview', 'Overview'], ['activity', 'Activity'], ['sessions', `Sessions (${sess.length})`]].map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>)}
      </div>

      <div className="grid-2-1">
        <div className="stack">
          {tab === 'overview' && (
            <>
              <div className="mini-kpis">
                <div className="card mk"><span>Resume score</span><b>{p.resume}</b><Progress value={p.resume} tone={p.resume < 55 ? 'red' : p.resume < 70 ? 'amber' : 'green'} /></div>
                <div className="card mk"><span>Applications</span><b>{p.apps}</b><small>{p.interviews} interviews</small></div>
                <div className="card mk"><span>Coaching sessions</span><b>{p.sessions}</b><small>since {fmtShort(p.enrolled)}</small></div>
              </div>
              {!isHR && (
                <Card title="Weekly mood" sub="Friday check-in, 1 to 5. Private to the participant and coach.">
                  <Chart type="area" height={180} series={[{ name: 'Mood', data: p.mood }]}
                    options={base({ colors: ['#4c6fff'], stroke: { curve: 'smooth', width: 3 }, fill: { type: 'solid', opacity: 0.08 }, xaxis: { categories: ['6 wks ago', '5', '4', '3', '2', 'This week'] }, yaxis: { min: 1, max: 5, tickAmount: 4 }, markers: { size: 4 } })} />
                  {p.risk.length > 0 && <div className="alert"><FiAlertTriangle aria-hidden="true" /><span><b>Flagged:</b> {p.risk.join('. ')}.</span></div>}
                </Card>
              )}
              <Card title="Skills on file" sub="Used for job and internal matches">
                <div className="chips">{p.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
              </Card>
              {!isHR && <Card title="Coach note" sub={`${c.name}, last session`}><p>{p.note}</p></Card>}
            </>
          )}
          {tab === 'activity' && (
            <Card title="Activity">
              <ol className="timeline">{timeline.map((x, i) => <li key={i}><span className="kpi-ico blue sm"><x.icon aria-hidden="true" /></span><div><b>{x.t}</b><small>{fmt(x.d)}</small></div></li>)}</ol>
            </Card>
          )}
          {tab === 'sessions' && (
            <Card title="Sessions this week" pad={false}>
              {sess.length ? (
                <table className="table"><thead><tr><th>When</th><th>Type</th><th>Coach</th><th>Status</th></tr></thead>
                  <tbody>{sess.map((s) => <tr key={s.id}><td>{s.at.toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</td><td>{s.type}</td><td>{coach(s.coach).name}</td><td><Badge tone={s.status === 'Done' ? 'green' : s.status === 'No-show' ? 'red' : 'blue'}>{s.status}</Badge></td></tr>)}</tbody>
                </table>
              ) : <Empty icon={FiCalendar} title="No sessions this week" text={`Last one was ${Math.min(p.lastActive + 3, 20)} days ago.`}><button className="btn sm white" onClick={() => toast(`Session request sent to ${c.name}`)}>Book one</button></Empty>}
            </Card>
          )}
        </div>

        <div className="stack">
          <Card title="Coach">
            <div className="coach-card">
              <Avatar name={c.name} size={48} />
              <span><b>{c.name}</b><small>{c.focus}</small><small>{c.langs}, rated {c.rating}</small></span>
            </div>
            {!isHR && (
              <div className="reassign">
                <select value={pick} onChange={(e) => setPick(e.target.value)} aria-label="New coach"><option value="">Change coach</option>{COACHES.filter((x) => x.id !== c.id).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
                <button className="btn sm" disabled={!pick} onClick={() => { assign([p.id], pick); toast(`${p.name} now coached by ${coach(pick).name}`); setPick('') }}><FiUserCheck aria-hidden="true" />Save</button>
              </div>
            )}
          </Card>
          {p.landed ? (
            <Card title="New role">
              <div className="landed"><span className="kpi-ico green big"><FiBriefcase aria-hidden="true" /></span><b>{p.landed.as}</b><small>Started {fmt(p.landed.on)}, {p.landed.days} days in the programme</small><Badge tone={p.landed.pay >= 0 ? 'green' : 'amber'}>Pay {p.landed.pay >= 0 ? '+' : ''}{p.landed.pay}%</Badge></div>
            </Card>
          ) : (
            <Card title="Internal matches" sub="Open roles at the employer that fit their skills">
              {fits.length ? <ul className="list">{fits.map(({ o, hit }) => (
                <li key={o.id}><span className="grow"><b>{o.title}</b><small>{o.site}, {o.pay}</small><small className="muted">Matches {hit.join(', ')}</small></span><Badge tone="blue">{Math.round((hit.length / o.skills.length) * 100)}%</Badge></li>
              ))}</ul> : <p className="muted">No internal role fits yet. New openings are checked every Monday.</p>}
            </Card>
          )}
          <Card title="Details">
            <dl className="dl">
              <div><dt>Programme</dt><dd>{p.employer}</dd></div>
              <div><dt>Enrolled</dt><dd>{fmt(p.enrolled)}</dd></div>
              <div><dt>Level</dt><dd>{p.level === 'IC' ? 'Individual contributor' : p.level}</dd></div>
              <div><dt>Shares profile with HR</dt><dd>{p.consent ? 'Yes' : 'No'}</dd></div>
              <div><dt>Last active</dt><dd>{p.lastActive === 0 ? 'Today' : p.lastActive === 1 ? 'Yesterday' : `${p.lastActive} days ago`}</dd></div>
            </dl>
          </Card>
        </div>
      </div>
    </>
  )
}
