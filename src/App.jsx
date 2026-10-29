import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from './store.jsx'
import { STUDENT, PEOPLE } from './data/bridge.js'
import * as I from './ui/icons.js'
import { Avatar, Dialog } from './ui/kit.jsx'
import Landing from './pages/Landing.jsx'
import StudentHome from './pages/StudentHome.jsx'
import Projects from './pages/Projects.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import Evidence from './pages/Evidence.jsx'
import Passport, { PublicPassport } from './pages/Passport.jsx'
import Applications from './pages/Applications.jsx'
import Privacy from './pages/Privacy.jsx'
import LabHome from './pages/LabHome.jsx'
import Applicants from './pages/Applicants.jsx'
import Verify from './pages/Verify.jsx'
import Credits from './pages/Credits.jsx'

export default function App() {
  const loc = useLocation()
  useEffect(() => { window.scrollTo(0, 0); document.querySelector('.sheet')?.scrollTo?.(0, 0) }, [loc.pathname])
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/credits" element={<Credits />} />
      <Route path="/p/:id" element={<PublicPassport />} />
      <Route path="/app/*" element={<Shell role="student"><Routes>
        <Route index element={<StudentHome />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectPage />} />
        <Route path="evidence" element={<Evidence />} />
        <Route path="passport" element={<Passport />} />
        <Route path="applications" element={<Applications />} />
        <Route path="privacy" element={<Privacy />} />
      </Routes></Shell>} />
      <Route path="/lab/*" element={<Shell role="lab"><Routes>
        <Route index element={<LabHome />} />
        <Route path="applicants" element={<Applicants />} />
        <Route path="verify" element={<Verify />} />
      </Routes></Shell>} />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}

const NAVS = {
  student: [['/app', 'Home', I.Home, 'h'], ['/app/projects', 'Projects', I.Projects, 'p'], ['/app/evidence', 'Evidence', I.Evidence, 'e'], ['/app/passport', 'Passport', I.Passport, 'c'], ['/app/applications', 'Applications', I.Applications, 'a'], ['/app/privacy', 'Privacy', I.Privacy, 'v']],
  lab: [['/lab', 'Home', I.Home, 'h'], ['/lab/applicants', 'Applicants', I.People, 'a'], ['/lab/verify', 'Verify work', I.Verify, 'v']],
}

function Mark() {
  return <span className="mark" aria-hidden="true"><span /></span>
}

function Shell({ role, children }) {
  const { s, dispatch } = useStore()
  const nav = useNavigate(); const loc = useLocation()
  const [open, setOpen] = useState(false)
  const [keys, setKeys] = useState(false)
  const g = useRef(false)
  useEffect(() => setOpen(false), [loc.pathname])
  // Keyboard: g then a letter moves between screens, / searches projects, ? lists the shortcuts.
  useEffect(() => {
    const on = (e) => {
      const tag = e.target.tagName
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === '?') { setKeys(true); return }
      if (e.key === '/' && role === 'student') { e.preventDefault(); nav('/app/projects?focus=1'); return }
      if (e.key === 'g') { g.current = true; setTimeout(() => { g.current = false }, 900); return }
      if (g.current) { const hit = NAVS[role].find((n) => n[3] === e.key); if (hit) { nav(hit[0]); g.current = false } }
    }
    document.addEventListener('keydown', on)
    return () => document.removeEventListener('keydown', on)
  }, [role, nav])
  const counts = role === 'student'
    ? { '/app/applications': s.applications.filter((a) => a.state === 'draft').length }
    : { '/lab/applicants': s.applicants.filter((a) => a.state === 'new').length, '/lab/verify': s.verify.length }
  const countNoun = { '/app/applications': 'draft', '/lab/applicants': 'new', '/lab/verify': 'waiting' }
  const me = role === 'student' ? { name: STUDENT.name, sub: STUDENT.programme } : { name: PEOPLE.okonkwo.name, sub: PEOPLE.okonkwo.lab, pi: 'okonkwo' }
  const side = (
    <>
      <Link to="/" className="brand"><Mark /><span><b>Bridge</b><small>Skill-to-Research</small></span></Link>
      <div className="scope"><I.Org size={16} aria-hidden="true" /><span>{STUDENT.university}</span></div>
      <nav className="side-nav" aria-label="Screens">
        {NAVS[role].map(([to, label, Icon]) => (
          <NavLink key={to} to={to} end={to === '/app' || to === '/lab'}>
            <Icon size={16} aria-hidden="true" /><span>{label}</span>
            {counts[to] > 0 && <span className="count" aria-label={`${counts[to]} ${countNoun[to]}`}>{counts[to]} {countNoun[to]}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="side-foot">
        <button className="side-link" onClick={() => setKeys(true)}><span className="kbd">?</span> Keyboard shortcuts</button>
        <Link className="side-link" to={role === 'student' ? '/lab' : '/app'}><I.Sync size={16} aria-hidden="true" /> {role === 'student' ? 'Switch to the researcher view' : 'Switch to the student view'}</Link>
        <button className="side-link" onClick={() => { dispatch({ type: 'reset' }); nav(role === 'student' ? '/app' : '/lab') }}><I.Undo size={16} aria-hidden="true" /> Reset the demo</button>
        <div className="me">{me.pi ? <Avatar pi={me.pi} /> : <span className="avatar is-me" aria-hidden="true">LH</span>}<span><b>{me.name}</b><small>{me.sub}</small></span></div>
      </div>
    </>
  )
  return (
    <div className="shell">
      <a className="skip" href="#content">Skip to content</a>
      <aside className="side">{side}</aside>
      <header className="topbar">
        <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Open the menu" aria-expanded={open}><I.Menu /></button>
        <Link to="/" className="brand"><Mark /><b>Bridge</b></Link>
        <span className="topbar-who">{role === 'student' ? 'Student' : 'Researcher'}</span>
      </header>
      {open && <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}><aside className="side is-sheet" role="dialog" aria-modal="true" aria-label="Menu"><button className="icon-btn side-x" onClick={() => setOpen(false)} aria-label="Close the menu"><I.X /></button>{side}</aside></div>}
      <main className="sheet" id="content" tabIndex={-1}>{children}</main>
      {s.toast && <p className="toast" role="status">{s.toast}</p>}
      <Dialog open={keys} onClose={() => setKeys(false)} title="Keyboard shortcuts">
        <dl className="keys">
          {NAVS[role].map(([, label, , k]) => <div key={k}><dt><span className="kbd">g</span> <span className="kbd">{k}</span></dt><dd>Go to {label.toLowerCase()}</dd></div>)}
          {role === 'student' && <div><dt><span className="kbd">/</span></dt><dd>Search projects</dd></div>}
          <div><dt><span className="kbd">?</span></dt><dd>Show this list</dd></div>
          <div><dt><span className="kbd">Esc</span></dt><dd>Close a dialog or menu</dd></div>
        </dl>
      </Dialog>
    </div>
  )
}
