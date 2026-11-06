import { FiDownload, FiFileText } from 'react-icons/fi'
import { useStore } from '../store.jsx'
import { Card, Chart, base } from '../ui.jsx'
import { PROGRAMS } from '../data.js'

export default function Reports() {
  const { people, role, toast } = useStore()
  const progs = PROGRAMS.filter((p) => role.programs.includes(p.id))
  const rate = progs.map((p) => { const ps = people.filter((x) => x.program === p.id); return Math.round((ps.filter((x) => x.landed).length / ps.length) * 100) })
  const levels = ['IC', 'Manager', 'Director']
  const days = levels.map((l) => { const ls = people.filter((x) => x.level === l && x.landed); return ls.length ? Math.round(ls.reduce((a, x) => a + x.landed.days, 0) / ls.length) : 0 })
  const landed = people.filter((x) => x.landed)
  const pay = [['Less', (x) => x < 0], ['Same', (x) => x >= 0 && x <= 3], ['Up to 10% more', (x) => x > 3 && x <= 10], ['Over 10% more', (x) => x > 10]].map(([n, f]) => [n, landed.filter((x) => f(x.landed.pay)).length])
  const reports = [['Monthly outcomes', 'Landing rate, days to land, pay change', 'PDF'], ['Engagement', 'Logins, sessions, check-ins by week', 'CSV'], ['Seat usage', 'Seats used and left by programme', 'CSV'], ['Board summary', 'One page for leadership', 'PDF']]
  return (
    <>
      <div className="page-head"><div><h1>Reports</h1><p>Outcomes the employer pays for, ready to share.</p></div></div>
      <div className="grid-2">
        <Card title="Landing rate by programme" sub="Share of participants with a new role">
          <Chart type="bar" height={240} series={[{ name: 'Landed', data: rate }]} options={base({ colors: progs.map((p) => p.colour), plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: '46%', distributed: true } }, xaxis: { categories: progs.map((p) => p.employer), max: 100, labels: { formatter: (v) => `${v}%` } }, legend: { show: false } })} />
        </Card>
        <Card title="Average days to land, by level">
          <Chart type="bar" height={240} series={[{ name: 'Days', data: days }]} options={base({ colors: ['#4c6fff'], plotOptions: { bar: { columnWidth: '38%', borderRadius: 6 } }, xaxis: { categories: ['Individual contributor', 'Manager', 'Director'] } })} />
        </Card>
        <Card title="Pay in the new role" sub={`${landed.length} people who landed`}>
          <Chart type="donut" height={260} series={pay.map((x) => x[1])} options={base({ labels: pay.map((x) => x[0]), colors: ['#f2994a', '#c9d4ff', '#8ea3ff', '#4c6fff'], legend: { position: 'right' }, plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Landed', color: '#8a92a6' } } } } }, stroke: { width: 3 } })} />
        </Card>
        <Card title="Scheduled exports" pad={false}>
          <ul className="list reports">{reports.map(([t, d, f]) => (
            <li key={t}><span className="kpi-ico blue"><FiFileText aria-hidden="true" /></span><span className="grow"><b>{t}</b><small>{d}</small></span><button className="btn sm white" onClick={() => toast(`${t} downloaded as ${f} (prototype)`)}><FiDownload aria-hidden="true" />{f}</button></li>
          ))}</ul>
        </Card>
      </div>
    </>
  )
}
