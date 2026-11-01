import { useEffect, useRef } from 'react'
import { HashRouter, NavLink, Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom'
import { BiBriefcase, BiCalendar, BiGroup, BiHomeAlt, BiMessageSquareDetail, BiUser } from 'react-icons/bi'
import { StoreProvider, useStore } from './store.jsx'
import Today from './screens/Today.jsx'
import Calls from './screens/Calls.jsx'
import Job from './screens/Job.jsx'
import Avails from './screens/Avails.jsx'
import Inbox from './screens/Inbox.jsx'
import Me from './screens/Me.jsx'
import CrewUp from './screens/CrewUp.jsx'
import Role from './screens/Role.jsx'
import Welcome from './screens/Welcome.jsx'
import Credits from './screens/Credits.jsx'
import Panel from './panel/Panel.jsx'

const clock = { precall: '05:42', rolling: '10:05', wrapped: '19:20' }

const tabsFor = (as) => as === 'production'
  ? [
      { to: '/', label: 'Today', icon: BiHomeAlt },
      { to: '/crew', label: 'Crew up', icon: BiGroup },
      { to: '/inbox', label: 'Inbox', icon: BiMessageSquareDetail },
      { to: '/me', label: 'Me', icon: BiUser },
    ]
  : [
      { to: '/', label: 'Today', icon: BiHomeAlt },
      { to: '/calls', label: 'Calls', icon: BiBriefcase },
      { to: '/avails', label: 'Avails', icon: BiCalendar },
      { to: '/inbox', label: 'Inbox', icon: BiMessageSquareDetail },
      { to: '/me', label: 'Me', icon: BiUser },
    ]

function Theme() {
  const { s } = useStore()
  useEffect(() => {
    const root = document.documentElement
    if (s.theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', s.theme)
  }, [s.theme])
  return null
}

// Review links like #/?as=production&scene=rolling set the demo state once.
function DemoParams() {
  const [params] = useSearchParams()
  const { set } = useStore()
  useEffect(() => {
    const as = params.get('as')
    const scene = params.get('scene')
    const patch = {}
    if (as === 'crew' || as === 'production') patch.as = as
    if (['precall', 'rolling', 'wrapped'].includes(scene)) patch.scene = scene
    if (params.get('demo') === 'tour') patch.onboarded = true
    if (Object.keys(patch).length) set({ ...patch, onboarded: true })
  }, [params, set])
  return null
}

function Shell() {
  const { s } = useStore()
  const loc = useLocation()
  const scroller = useRef(null)
  useEffect(() => { scroller.current?.scrollTo({ top: 0 }) }, [loc.pathname])

  const bare = loc.pathname === '/welcome'
  const tabs = tabsFor(s.as)

  return (
    <div className="stage">
      <div className="device">
        <div className="phone">
          <div className="statusbar" aria-hidden="true">
            <span className="mono">{clock[s.scene]}</span>
            <span className="statusbar__right"><i /><i /><i /><b /></span>
          </div>
          <main className="screen" ref={scroller} id="main">
            <Routes>
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/" element={s.onboarded ? <Today /> : <Navigate to="/welcome" replace />} />
              <Route path="/calls" element={<Calls />} />
              <Route path="/calls/:id" element={<Job />} />
              <Route path="/avails" element={<Avails />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/me" element={<Me />} />
              <Route path="/crew" element={<CrewUp />} />
              <Route path="/crew/:key" element={<Role />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          {!bare && (
            <nav className="tabbar" aria-label="Main">
              {tabs.map((t) => (
                <NavLink key={t.to} to={t.to} end={t.to === '/'} className="tab">
                  <t.icon aria-hidden="true" className="tab__icon" />
                  <span>{t.label}</span>
                </NavLink>
              ))}
            </nav>
          )}
          {s.toast && <div className="toast" role="status" key={s.toast.id}>{s.toast.text}</div>}
        </div>
      </div>
      <Panel />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Theme />
        <DemoParams />
        <Shell />
      </HashRouter>
    </StoreProvider>
  )
}
