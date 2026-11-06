import { useEffect, useRef, useState } from 'react'
import { Routes, Route, NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { FiGrid, FiUsers, FiBriefcase, FiUserCheck, FiCalendar, FiRepeat, FiMap, FiBarChart2, FiSettings, FiSearch, FiBell, FiChevronDown, FiMenu, FiX, FiHelpCircle, FiCheckCircle, FiLogOut } from 'react-icons/fi'
import { useStore, ROLES } from './store.jsx'
import { Avatar } from './ui.jsx'
import { PEOPLE, TODAY } from './data.js'
import Overview from './pages/Overview.jsx'
import Participants from './pages/Participants.jsx'
import Participant from './pages/Participant.jsx'
import Programs from './pages/Programs.jsx'
import Coaches from './pages/Coaches.jsx'
import Sessions from './pages/Sessions.jsx'
import Redeploy from './pages/Redeploy.jsx'
import Market from './pages/Market.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'

const NAV = [
  ['Main', [['/', 'Overview', FiGrid], ['/participants', 'Participants', FiUsers], ['/programs', 'Programs', FiBriefcase]]],
  ['Coaching', [['/coaches', 'Coaches', FiUserCheck, 'ops'], ['/sessions', 'Sessions', FiCalendar]]],
  ['Insights', [['/redeployment', 'Redeployment', FiRepeat], ['/market', 'Job market', FiMap], ['/reports', 'Reports', FiBarChart2]]],
  ['Account', [['/settings', 'Settings', FiSettings]]],
]

function Sidebar({ open, close }) {
  const { role } = useStore()
  return (
    <aside className={`side ${open ? 'open' : ''}`} aria-label="Main navigation">
      <div className="side-top">
        <Link to="/" className="logo" onClick={close}><span className="logo-mark">P</span>Pathwell<em>Admin</em></Link>
        <button className="icon-btn only-m" onClick={close} aria-label="Close menu"><FiX /></button>
      </div>
      <nav>
        {NAV.map(([group, items]) => (
          <div key={group} className="nav-group">
            <p>{group}</p>
            {items.filter((x) => !x[3] || x[3] === role.id).map(([to, label, Icon]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={close}><Icon aria-hidden="true" />{label}</NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="side-help">
        <span className="kpi-ico blue"><FiHelpCircle aria-hidden="true" /></span>
        <b>Need a hand?</b>
        <p>The admin guide covers seats, consent and exports.</p>
        <a href="#/settings" className="btn sm white">Open guide</a>
      </div>
    </aside>
  )
}

function Search() {
  const { people, isHR } = useStore()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const k = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); ref.current?.focus() } }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [])
  const hits = q.trim().length < 2 ? [] : people.filter((p) => (!isHR || p.consent) && (p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase()) || p.title.toLowerCase().includes(q.toLowerCase()))).slice(0, 6)
  return (
    <div className="search">
      <FiSearch aria-hidden="true" />
      <input ref={ref} value={q} onChange={(e) => { setQ(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} placeholder="Search participants, IDs, roles" aria-label="Search participants" />
      <kbd>Ctrl K</kbd>
      {open && q.trim().length >= 2 && (
        <div className="search-pop" role="listbox">
          {hits.length ? hits.map((p) => (
            <button key={p.id} role="option" aria-selected="false" onMouseDown={() => { nav(`/participants/${p.id}`); setQ('') }}>
              <Avatar name={p.name} size={30} /><span><b>{p.name}</b><small>{p.id}, {p.title}, {p.employer}</small></span>
            </button>
          )) : <p className="search-none">No participant matches "{q}".</p>}
        </div>
      )}
    </div>
  )
}

function Bell() {
  const { people, isHR } = useStore()
  const [open, setOpen] = useState(false)
  const items = [
    ...people.filter((p) => p.landed && (TODAY - p.landed.on) / 864e5 < 6).slice(0, 3).map((p) => ({ t: isHR && !p.consent ? 'A participant landed a new role' : `${p.name} landed: ${p.landed.as}`, when: 'This week', icon: 'green' })),
    { t: 'Halcyon Bank seats are 87% used', when: 'Yesterday', icon: 'amber' },
    ...(!isHR ? [{ t: `${people.filter((p) => p.risk.length).length} participants flagged for a check-in`, when: 'Today, 08:00', icon: 'red' }] : []),
  ]
  return (
    <div className="bell">
      <button className="icon-btn" onClick={() => setOpen((o) => !o)} aria-label={`Notifications, ${items.length} new`} aria-expanded={open}><FiBell /><i /></button>
      {open && (
        <div className="pop" onMouseLeave={() => setOpen(false)}>
          <p className="pop-title">Notifications</p>
          {items.map((x, i) => <div key={i} className="pop-item"><span className={`dot ${x.icon}`} /><span><b>{x.t}</b><small>{x.when}</small></span></div>)}
        </div>
      )}
    </div>
  )
}

function Me() {
  const { role, setRole, toast } = useStore()
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  return (
    <div className="me">
      <button className="me-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Avatar name={role.name} size={38} />
        <span className="me-txt"><b>{role.name}</b><small>{role.title}</small></span>
        <FiChevronDown aria-hidden="true" />
      </button>
      {open && (
        <div className="pop right" onMouseLeave={() => setOpen(false)}>
          <p className="pop-title">View the console as</p>
          {Object.values(ROLES).map((r) => (
            <button key={r.id} className={`pop-item btnlike ${role.id === r.id ? 'on' : ''}`} onClick={() => { setRole(r.id); setOpen(false); nav('/'); toast(`Viewing as ${r.name}, ${r.title}`) }}>
              <Avatar name={r.name} size={30} /><span><b>{r.name}</b><small>{r.title}</small></span>{role.id === r.id && <FiCheckCircle className="ok" aria-hidden="true" />}
            </button>
          ))}
          <p className="pop-foot"><FiLogOut aria-hidden="true" />Sign out is off in this prototype</p>
        </div>
      )}
    </div>
  )
}

function Toasts() {
  const { toasts } = useStore()
  return <div className="toasts" aria-live="polite">{toasts.map((t) => <div key={t.id} className="toast"><FiCheckCircle aria-hidden="true" />{t.t}</div>)}</div>
}

export default function App() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const { isHR } = useStore()
  useEffect(() => { window.scrollTo(0, 0); setOpen(false) }, [loc.pathname])
  return (
    <div className="shell">
      <Sidebar open={open} close={() => setOpen(false)} />
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="main">
        <header className="top">
          <button className="icon-btn only-m" onClick={() => setOpen(true)} aria-label="Open menu"><FiMenu /></button>
          <Search />
          <div className="top-right">
            <span className="today">{TODAY.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <Bell />
            <Me />
          </div>
        </header>
        {isHR && <div className="hr-bar">You are viewing as Northwind Logistics HR. Names and details show only for participants who agreed to share them; mood and coach notes stay private.</div>}
        <main className="content" key={loc.pathname}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/participants" element={<Participants />} />
            <Route path="/participants/:id" element={<Participant />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/redeployment" element={<Redeploy />} />
            <Route path="/market" element={<Market />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Overview />} />
          </Routes>
        </main>
        <footer className="foot">Pathwell Admin, concept prototype. Companies, people and figures are samples. {PEOPLE.length} sample participants.</footer>
      </div>
      <Toasts />
    </div>
  )
}
