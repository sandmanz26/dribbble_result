import { useEffect, useState } from 'react'
import { HashRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Home2, SearchNormal1, TaskSquare, Setting2, CloudCross, Refresh } from 'iconsax-react'
import { useStore } from './store.jsx'
import { Toast } from './ui/kit.jsx'
import Panel from './ui/Panel.jsx'
import Lock from './screens/Lock.jsx'
import Today from './screens/Today.jsx'
import Search from './screens/Search.jsx'
import Student from './screens/Student.jsx'
import NewStudent from './screens/NewStudent.jsx'
import Marks from './screens/Marks.jsx'
import MarkEntry from './screens/MarkEntry.jsx'
import More from './screens/More.jsx'
import Activity from './screens/Activity.jsx'

function useTheme() {
  const { state, brand } = useStore()
  const [sysDark, setSysDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => {
    const m = window.matchMedia('(prefers-color-scheme: dark)')
    const on = (e) => setSysDark(e.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  const dark = state.theme === 'dark' || (state.theme === 'system' && sysDark)
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = dark ? 'dark' : 'light'
    root.style.setProperty('--accent', dark ? brand.accentDark : brand.accent)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#121315' : '#f2f2ef')
  }, [dark, brand])
}

function OfflineBar() {
  const { state, dispatch, toast } = useStore()
  if (state.online && !state.queue.length) return null
  if (state.online) {
    return (
      <div className="netbar is-sync" role="status">
        <Refresh size={16} color="currentColor" />
        <span>{state.queue.length} change{state.queue.length > 1 ? 's' : ''} waiting to sync</span>
        <button onClick={() => { dispatch({ type: 'sync' }); toast('All changes synced to the school server') }}>Sync now</button>
      </div>
    )
  }
  return (
    <div className="netbar" role="status">
      <CloudCross size={16} color="currentColor" />
      <span>Offline. {state.queue.length ? `${state.queue.length} change${state.queue.length > 1 ? 's' : ''} saved on this phone.` : 'Changes save on this phone.'}</span>
    </div>
  )
}

function Tabs() {
  const { pathname } = useLocation()
  if (/^\/(students\/new|marks\/.+)/.test(pathname)) return null
  const tabs = [
    { to: '/', label: 'Today', I: Home2, end: true },
    { to: '/search', label: 'Students', I: SearchNormal1 },
    { to: '/marks', label: 'Marks', I: TaskSquare },
    { to: '/more', label: 'More', I: Setting2 },
  ]
  return (
    <nav className="tabbar" aria-label="Main">
      {tabs.map(({ to, label, I, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `tab ${isActive || (to === '/search' && pathname.startsWith('/students')) ? 'is-on' : ''}`}>
          {({ isActive }) => {
            const on = isActive || (to === '/search' && pathname.startsWith('/students'))
            return <><I size={22} color="currentColor" variant={on ? 'Bold' : 'Linear'} /><span>{label}</span></>
          }}
        </NavLink>
      ))}
    </nav>
  )
}

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { document.querySelector('.screen')?.scrollTo(0, 0) }, [pathname])
  return null
}

// Review links: ?as=teacher, ?brand=harbour, ?offline=1, ?reset=1
function DemoParams() {
  const { dispatch } = useStore()
  const { search, pathname } = useLocation()
  const nav = useNavigate()
  useEffect(() => {
    const p = new URLSearchParams(search)
    if (!['as', 'brand', 'offline', 'theme', 'reset'].some((k) => p.has(k))) return
    if (p.get('reset')) dispatch({ type: 'reset' })
    const patch = {}
    if (p.get('as')) patch.role = p.get('as') === 'teacher' ? 'teacher' : 'registrar'
    if (p.get('brand')) patch.brandId = p.get('brand')
    if (p.get('offline')) patch.online = false
    if (p.get('theme')) patch.theme = p.get('theme')
    dispatch({ type: 'set', patch })
    const rest = new URLSearchParams(search)
    ;['as', 'brand', 'offline', 'theme', 'reset'].forEach((k) => rest.delete(k))
    nav(`${pathname}${rest.toString() ? `?${rest}` : ''}`, { replace: true })
  }, [search]) // eslint-disable-line
  return null
}

// Lock after 5 minutes without a touch or key press, like a banking app.
function useIdleLock() {
  const { state, dispatch } = useStore()
  useEffect(() => {
    if (state.locked) return
    let t
    const arm = () => { clearTimeout(t); t = setTimeout(() => dispatch({ type: 'set', patch: { locked: true } }), 5 * 60 * 1000) }
    const evs = ['pointerdown', 'keydown']
    evs.forEach((e) => window.addEventListener(e, arm))
    arm()
    return () => { clearTimeout(t); evs.forEach((e) => window.removeEventListener(e, arm)) }
  }, [state.locked, dispatch])
}

function Phone() {
  const { state } = useStore()
  useIdleLock()
  return (
    <div className="app">
      {state.locked ? <Lock /> : (
        <>
          <OfflineBar />
          <main className="screen">
            <Routes>
              <Route path="/" element={<Today />} />
              <Route path="/search" element={<Search />} />
              <Route path="/students/new" element={<NewStudent />} />
              <Route path="/students/:id" element={<Student />} />
              <Route path="/marks" element={<Marks />} />
              <Route path="/marks/:id" element={<MarkEntry />} />
              <Route path="/more" element={<More />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="*" element={<Today />} />
            </Routes>
          </main>
          <Tabs />
        </>
      )}
      <Toast />
    </div>
  )
}

export default function App() {
  useTheme()
  return (
    <HashRouter>
      <DemoParams />
      <ScrollTop />
      <div className="stage">
        <div className="device"><Phone /></div>
        <Panel />
      </div>
    </HashRouter>
  )
}
