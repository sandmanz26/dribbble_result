import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from './store.jsx'
import { ROLES, PEOPLE, STORES } from './data/world.js'
import { DECISIONS } from './data/ai.js'
import { Mark, Avatar } from './ui/kit.jsx'
import * as I from './ui/icons.js'
import Case from './screens/Case.jsx'
import Today from './screens/Today.jsx'
import AskPage, { AskPanel } from './screens/Ask.jsx'
import Decisions from './screens/Decisions.jsx'
import Stock, { Product } from './screens/Stock.jsx'
import Clients, { Client } from './screens/Clients.jsx'
import Selling from './screens/Selling.jsx'
import Autopilot from './screens/Autopilot.jsx'
import Redacted, { REDACTED } from './screens/Redacted.jsx'
import Guide from './screens/Guide.jsx'
import Credits from './screens/Credits.jsx'

export function useOpen() {
  const { s, role } = useStore()
  // Decisions waiting for the person viewing: the owner's, or this boutique's manager's.
  return DECISIONS.filter((d) => !s.decided[d.id] && (role.id === 'owner' ? d.owner === 'ratna' : role.id === 'manager' ? (d.store === 'psn' || d.owner === 'dimas') : false))
}

function Side({ onNav }) {
  const { s, dispatch, role, me } = useStore()
  const open = useOpen()
  const nav = useNavigate()
  const link = (to, Icon, label, extra) => (
    <NavLink to={to} onClick={onNav} className={({ isActive }) => (isActive ? 'active' : '')}><Icon />{label}{extra}</NavLink>
  )
  return (
    <aside className="side" aria-label="Main">
      <div className="brand"><Mark /><span className="brand-name">Selvedge</span></div>
      <div className="org">
        <span><b><span className="redact" style={{ width: 74 }} aria-label="Client name redacted" /> Group</b><small>{role.id === 'owner' ? `${STORES.length} boutiques, 1 warehouse` : 'Plaza Senayan, Jakarta'}</small></span>
      </div>
      <nav className="nav">
        {link('/today', I.Home, 'Today')}
        <button onClick={() => { dispatch({ type: 'panel', open: true }); onNav?.() }}><I.Ask />Ask<span className="kbd">Ctrl J</span></button>
        {role.id !== 'advisor' && link('/decisions', I.Decisions, 'Decisions', open.length ? <span className="count" aria-label={`${open.length} waiting for you`}>{open.length}</span> : null)}
        {link('/stock', I.Stock, 'Stock')}
        {link('/clients', I.Clients, 'Clients')}
        {link('/selling', I.Selling, 'Selling')}
        {role.id !== 'advisor' && link('/autopilot', I.Autopilot, 'Autopilot')}
        <p className="nav-group">Redacted under NDA</p>
        {REDACTED.filter((r) => role.id === 'owner' || r.store).map((r) => (
          <NavLink key={r.id} to={`/r/${r.id}`} onClick={onNav} className={({ isActive }) => `is-redacted ${isActive ? 'active' : ''}`}><r.icon />{r.name}<span className="lock"><I.Lock /></span></NavLink>
        ))}
        <p className="nav-group">About this work</p>
        {link('/', I.Case, 'Case notes')}
      </nav>
      <div className="side-foot">
        <div className="viewas">
          <p>View as</p>
          <div className="viewas-opts">
            {ROLES.map((r) => (
              <button key={r.id} aria-pressed={s.role === r.id} onClick={() => { dispatch({ type: 'role', role: r.id }); nav('/today'); onNav?.() }}>
                <Avatar id={r.person} size="sm" /><span>{PEOPLE[r.person].name}<small>{r.label}</small></span>
              </button>
            ))}
          </div>
        </div>
        <span className="sr">Signed in as {me.name}</span>
      </div>
    </aside>
  )
}

export default function App() {
  const { s, dispatch, role } = useStore()
  const loc = useLocation()
  const [menu, setMenu] = useState(false)
  const onCase = loc.pathname === '/'

  useEffect(() => {
    const k = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') { e.preventDefault(); dispatch({ type: 'panel', open: !s.panel }) } }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [s.panel, dispatch])
  useEffect(() => { window.scrollTo(0, 0); setMenu(false) }, [loc.pathname])
  // Review links: #/today?as=manager
  useEffect(() => { const as = new URLSearchParams(loc.search).get('as'); if (as && ROLES.some((r) => r.id === as) && as !== role.id) dispatch({ type: 'role', role: as }) }, [loc.search]) // eslint-disable-line react-hooks/exhaustive-deps

  if (onCase) return <><Case /><Nda /></>

  return (
    <div className={`shell ${s.panel ? 'has-panel' : ''}`}>
      <div className="phone-bar">
        <span className="brand"><Mark /><span className="brand-name">Selvedge</span></span>
        <button className="btn is-quiet is-sm" onClick={() => dispatch({ type: 'panel', open: true })} aria-label="Ask Selvedge"><I.Ask /></button>
        <button className="btn is-sm" onClick={() => setMenu(true)} aria-expanded={menu}>Menu</button>
      </div>
      <div className={`side-wrap ${menu ? 'is-open' : ''}`}>
        {menu && <button className="side-close btn is-sm" onClick={() => setMenu(false)}><I.Close /> Close</button>}
        <Side onNav={() => setMenu(false)} />
      </div>
      <main className="canvas" id="main">
        <Routes>
          <Route path="/today" element={<Today />} />
          <Route path="/ask" element={<AskPage />} />
          <Route path="/decisions" element={<Decisions />} />
          <Route path="/decisions/:id" element={<Decisions />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/stock/:id" element={<Product />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<Client />} />
          <Route path="/selling" element={<Selling />} />
          <Route path="/autopilot" element={<Autopilot />} />
          <Route path="/r/:id" element={<Redacted />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="*" element={<Today />} />
        </Routes>
      </main>
      <AskPanel />
      <Guide />
      <Nda />
    </div>
  )
}

function Nda() {
  return (
    <p className="nda"><I.Lock /> Portfolio piece. The client and about a third of the product are redacted under NDA. All names, figures and products are synthetic. <NavLink to="/">Case notes</NavLink></p>
  )
}
