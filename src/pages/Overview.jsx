import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiUsers, FiAward, FiClock, FiSmile, FiDownload, FiUserPlus, FiAlertTriangle, FiArrowRight } from 'react-icons/fi'
import { useStore } from '../store.jsx'
import { Kpi, Card, Chart, base, Avatar, Stage, Progress, Badge } from '../ui.jsx'
import { STAGES, PROGRAMS, SESSIONS, TODAY, weeklyLanded, coach, fmtShort } from '../data.js'

export default function Overview() {
  const { people, role, isHR, toast } = useStore()
  const st = useMemo(() => {
    const landed = people.filter((p) => p.landed)
    const active = people.filter((p) => !p.landed)
    const avgDays = Math.round(landed.reduce((a, p) => a + p.landed.days, 0) / Math.max(1, landed.length))
    const mood = people.reduce((a, p) => a + p.mood[5], 0) / people.length
    const week = people.filter((p) => p.lastActive <= 7 && !p.landed).length
    return { landed, active, avgDays, mood, week, rate: Math.round((landed.length / people.length) * 100), flagged: active.filter((p) => p.risk.length) }
  }, [people])
  const wk = weeklyLanded(role.programs)
  const funnel = STAGES.map((_, i) => people.filter((p) => p.stage >= i).length)
  const today = SESSIONS.filter((s) => s.at.toDateString() === TODAY.toDateString() && s.at >= TODAY && people.some((p) => p.id === s.person)).slice(0, 5)
  const first = role.name.split(' ')[0]
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Good morning, {first}</h1>
          <p>{isHR ? 'How your people are moving on, from the Northwind Logistics transition programme.' : `Here is how ${people.length} participants across ${role.programs.length} programmes are doing this week.`}</p>
        </div>
        <div className="head-actions">
          <button className="btn white" onClick={() => toast('Weekly summary exported as PDF (prototype)')}><FiDownload aria-hidden="true" />Export</button>
          {!isHR && <button className="btn" onClick={() => toast('Invite link created for 12 new seats (prototype)')}><FiUserPlus aria-hidden="true" />Add participants</button>}
        </div>
      </div>

      <div className="kpis">
        <Kpi icon={FiUsers} label="Active participants" value={st.active.length} delta={6} note={`${st.week} active in the last 7 days`} />
        <Kpi icon={FiAward} label="Landed a new role" value={`${st.rate}%`} delta={4} tone="green" note={`${st.landed.length} people, ${st.landed.filter((p) => p.landed.internal).length} redeployed inside`} />
        <Kpi icon={FiClock} label="Average days to land" value={st.avgDays} delta={-9} good={false} tone="amber" note="Industry benchmark used: 90 days" />
        <Kpi icon={FiSmile} label="Average weekly mood" value={`${st.mood.toFixed(1)} / 5`} delta={2} tone="pink" note="From the Friday check-in" />
      </div>

      <div className="grid-2-1">
        <Card title="Placements over time" sub="People who landed a role each week, last 10 weeks" action={<select className="mini-select" aria-label="Range" defaultValue="10"><option value="10">10 weeks</option><option value="6">6 weeks</option></select>}>
          <Chart type="bar" height={280} series={wk.series}
            options={base({ chart: { stacked: true }, colors: PROGRAMS.filter((p) => role.programs.includes(p.id)).map((p) => p.colour), xaxis: { categories: wk.labels, labels: { rotate: 0, hideOverlappingLabels: true } }, plotOptions: { bar: { columnWidth: '46%', borderRadius: 4 } }, legend: { position: 'top', horizontalAlign: 'right' }, yaxis: { tickAmount: 4, labels: { formatter: (v) => Math.round(v) } } })} />
        </Card>
        <Card title="Journey funnel" sub="How far each person has come">
          <div className="funnel">
            {STAGES.map((s, i) => (
              <div key={s} className="fn-row">
                <span>{s}</span>
                <Progress value={Math.round((funnel[i] / people.length) * 100)} tone={i === 5 ? 'green' : 'blue'} />
                <b>{funnel[i]}</b>
              </div>
            ))}
          </div>
          <p className="muted small">Biggest drop: from Applying to Interviewing. Mock interviews are booked for everyone stuck there over 3 weeks.</p>
        </Card>
      </div>

      <div className="grid-3">
        {isHR ? (
          <Card title="Engagement" sub="Shared as totals only">
            <div className="ring-wrap">
              <Chart type="radialBar" height={230} series={[Math.round((st.week / Math.max(1, st.active.length)) * 100)]}
                options={base({ colors: ['#4c6fff'], plotOptions: { radialBar: { hollow: { size: '62%' }, track: { background: '#eef0f6' }, dataLabels: { name: { offsetY: 22, fontSize: '12px', color: '#8a92a6' }, value: { offsetY: -12, fontSize: '28px', fontWeight: 600, color: '#1b2559' } } } }, labels: ['active this week'], stroke: { lineCap: 'round' } })} />
            </div>
            <p className="muted small">Individual mood and coach notes are private to the participant and their coach.</p>
          </Card>
        ) : (
          <Card title="Needs a check-in" sub={`${st.flagged.length} people flagged by the weekly scan`} action={<Link to="/participants?flag=1" className="link">See all</Link>}>
            <ul className="list">
              {st.flagged.slice(0, 5).map((p) => (
                <li key={p.id}><Link to={`/participants/${p.id}`} className="row-link">
                  <Avatar name={p.name} size={36} />
                  <span className="grow"><b>{p.name}</b><small><FiAlertTriangle className="warn" aria-hidden="true" />{p.risk[0]}</small></span>
                  <FiArrowRight className="muted" aria-hidden="true" />
                </Link></li>
              ))}
            </ul>
          </Card>
        )}
        <Card title="Today's sessions" sub={`${fmtShort(TODAY)}, from 10:20`} action={<Link to="/sessions" className="link">Calendar</Link>}>
          <ul className="list">
            {today.length ? today.map((s) => {
              const p = people.find((x) => x.id === s.person)
              const hidden = isHR && !p.consent
              return (
                <li key={s.id} className="sess">
                  <span className="time">{s.at.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                  <span className="grow"><b>{s.type}</b><small>{hidden ? 'Participant' : p.name} with {coach(s.coach).name}</small></span>
                  <Badge tone="blue">{s.mins} min</Badge>
                </li>
              )
            }) : <li className="muted">No more sessions today.</li>}
          </ul>
        </Card>
        <Card title="Seats by programme" sub="Used of purchased">
          <ul className="list seats">
            {PROGRAMS.filter((p) => role.programs.includes(p.id)).map((p) => {
              const used = people.filter((x) => x.program === p.id).length
              return (
                <li key={p.id}>
                  <span className="org-logo" style={{ background: p.colour }}>{p.logo}</span>
                  <span className="grow"><b>{p.employer}</b><Progress value={Math.round((used / p.seats) * 100)} tone={used / p.seats > 0.85 ? 'amber' : 'blue'} /></span>
                  <span className="seat-n"><b>{used}</b>/{p.seats}</span>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <Card title="Recently landed" sub="Celebrate these" pad={false}>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Participant</th><th>From</th><th>Landed as</th><th>Days</th><th>Pay change</th><th>Stage</th></tr></thead>
            <tbody>
              {[...st.landed].sort((a, b) => b.landed.on - a.landed.on).slice(0, 6).map((p) => {
                const hidden = isHR && !p.consent
                return (
                  <tr key={p.id}>
                    <td>{hidden ? <span className="who"><Avatar hidden size={32} /><span><b>Not shared</b><small>{p.id}</small></span></span> : <Link to={`/participants/${p.id}`} className="who"><Avatar name={p.name} size={32} /><span><b>{p.name}</b><small>{p.id}</small></span></Link>}</td>
                    <td>{p.title}<small className="block muted">{p.employer}</small></td>
                    <td>{p.landed.as}</td>
                    <td>{p.landed.days}</td>
                    <td><span className={p.landed.pay >= 0 ? 'pos' : 'neg'}>{p.landed.pay >= 0 ? '+' : ''}{p.landed.pay}%</span></td>
                    <td><Stage i={5} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
