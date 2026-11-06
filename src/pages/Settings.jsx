import { useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import { useStore } from '../store.jsx'
import { Card, Avatar, Badge } from '../ui.jsx'

const TEAM = [['Maya Chen', 'Program lead', 'Admin'], ['Jon Bakker', 'Customer success', 'Editor'], ['Daniel Okafor', 'Northwind Logistics HR', 'Employer viewer'], ['Priya Raman', 'Halcyon Bank HR', 'Employer viewer']]
const INTEG = [['Workday', 'HRIS, imports who joins a programme', true], ['Google Calendar', 'Coach availability and booking', true], ['Greenhouse', 'Internal openings for redeployment', false], ['Slack', 'Alerts for flagged participants', false]]

function Toggle({ label, hint, on: init }) {
  const [on, setOn] = useState(init)
  return <label className="toggle-row"><span><b>{label}</b><small>{hint}</small></span><span className="switch"><input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} /><i aria-hidden="true" /></span></label>
}

export default function Settings() {
  const { isHR, reset, toast } = useStore()
  const [tab, setTab] = useState('org')
  return (
    <>
      <div className="page-head"><div><h1>Settings</h1><p>Organisation, people, privacy and connected tools.</p></div></div>
      <div className="tabs" role="tablist">{[['org', 'Organisation'], ['team', 'Team and roles'], ['privacy', 'Privacy'], ['apps', 'Integrations']].map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>)}</div>
      {tab === 'org' && (
        <Card title="Organisation">
          <form className="form" onSubmit={(e) => { e.preventDefault(); toast('Settings saved (prototype)') }}>
            <label>Company name<input defaultValue={isHR ? 'Northwind Logistics' : 'Pathwell Inc.'} /></label>
            <label>Support email shown to participants<input type="email" defaultValue={isHR ? 'people@northwind.example' : 'help@pathwell.example'} /></label>
            <label>Time zone<select defaultValue="et"><option value="et">Eastern Time (US)</option><option value="ct">Central Time (US)</option></select></label>
            <label>Weekly check-in day<select defaultValue="fri"><option value="fri">Friday</option><option value="mon">Monday</option></select></label>
            <div className="form-foot"><button className="btn">Save changes</button><button type="button" className="btn white" onClick={() => { reset(); toast('Prototype data reset') }}><FiRefreshCw aria-hidden="true" />Reset prototype data</button></div>
          </form>
        </Card>
      )}
      {tab === 'team' && (
        <Card title="Team and roles" sub="Employer viewers see their own programme, totals and shared profiles only" pad={false}>
          <table className="table"><thead><tr><th>Name</th><th>Role</th><th>Access</th></tr></thead>
            <tbody>{TEAM.map(([n, r, a]) => <tr key={n}><td><span className="who"><Avatar name={n} size={32} /><b>{n}</b></span></td><td>{r}</td><td><Badge tone={a === 'Admin' ? 'blue' : a === 'Editor' ? 'green' : 'grey'}>{a}</Badge></td></tr>)}</tbody>
          </table>
        </Card>
      )}
      {tab === 'privacy' && (
        <Card title="Privacy" sub="Defaults for every new programme">
          <Toggle label="Ask participants to share their profile with HR" hint="Asked once at onboarding, can be changed any time" on />
          <Toggle label="Show employer totals only below 5 people" hint="Hides small groups so no one can be identified" on />
          <Toggle label="Keep mood check-ins private to the coach" hint="Employers never see individual moods" on />
          <Toggle label="Delete data 12 months after the programme ends" hint="Participants can download their own data first" on />
        </Card>
      )}
      {tab === 'apps' && (
        <Card title="Integrations" pad={false}>
          <ul className="list reports">{INTEG.map(([n, d, on]) => (
            <li key={n}><span className="org-logo" style={{ background: '#1b2559' }}>{n[0]}</span><span className="grow"><b>{n}</b><small>{d}</small></span>{on ? <Badge tone="green">Connected</Badge> : <button className="btn sm white" onClick={() => toast(`${n} connection is a placeholder in this prototype`)}>Connect</button>}</li>
          ))}</ul>
        </Card>
      )}
    </>
  )
}
