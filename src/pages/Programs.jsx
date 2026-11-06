import { FiCalendar, FiUsers, FiAward, FiRepeat, FiPlus } from 'react-icons/fi'
import { useStore } from '../store.jsx'
import { Card, Chart, base, Badge, Progress } from '../ui.jsx'
import { PROGRAMS, STAGES, fmt, TODAY } from '../data.js'

export default function Programs() {
  const { people, role, isHR, toast } = useStore()
  const list = PROGRAMS.filter((p) => role.programs.includes(p.id))
  return (
    <>
      <div className="page-head">
        <div><h1>Programmes</h1><p>{isHR ? 'Your transition programme with Pathwell.' : 'Each employer buys a programme with a number of seats and a support level.'}</p></div>
        {!isHR && <div className="head-actions"><button className="btn" onClick={() => toast('New programme draft created (prototype)')}><FiPlus aria-hidden="true" />New programme</button></div>}
      </div>
      <div className="prog-grid">
        {list.map((p) => {
          const ps = people.filter((x) => x.program === p.id)
          const landed = ps.filter((x) => x.landed)
          const end = new Date(p.start); end.setMonth(end.getMonth() + p.months)
          const done = Math.min(100, Math.round(((TODAY - p.start) / (end - p.start)) * 100))
          return (
            <section key={p.id} className="card prog">
              <header>
                <span className="org-logo lg" style={{ background: p.colour }}>{p.logo}</span>
                <div className="grow"><h2>{p.employer}</h2><p>{p.name}</p></div>
                <Badge tone={p.tier === 'Executive' ? 'pink' : p.tier === 'Plus' ? 'blue' : 'grey'}>{p.tier}</Badge>
              </header>
              <div className="prog-stats">
                <div><FiUsers aria-hidden="true" /><b>{ps.length}/{p.seats}</b><small>seats used</small></div>
                <div><FiAward aria-hidden="true" /><b>{Math.round((landed.length / ps.length) * 100)}%</b><small>landed</small></div>
                <div><FiRepeat aria-hidden="true" /><b>{p.redeploy ? landed.filter((x) => x.landed.internal).length : 'Off'}</b><small>redeployed</small></div>
              </div>
              <div className="prog-time">
                <span><FiCalendar aria-hidden="true" />{fmt(p.start)} to {fmt(end)}</span>
                <Progress value={done} /><small>{done}% of the programme time used</small>
              </div>
              <Chart type="bar" height={150} series={[{ name: 'People', data: STAGES.map((_, i) => ps.filter((x) => x.stage === i).length) }]}
                options={base({ colors: [p.colour], plotOptions: { bar: { columnWidth: '50%', borderRadius: 4, distributed: false } }, xaxis: { categories: ['Onb.', 'Profile', 'Apply', 'Interv.', 'Offer', 'Landed'], labels: { style: { fontSize: '10px' } } }, yaxis: { show: false }, grid: { show: false } })} />
              <footer><span>HR contact: <b>{p.hr}</b></span><span>Included: coaching, resume tools, job market data{p.redeploy ? ', internal redeployment' : ''}</span></footer>
            </section>
          )
        })}
      </div>
    </>
  )
}
