import { useEffect } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Home, MessageText, Database, Repeat, Coins, Sliders, Monitor, Phone, Undo, Zap } from 'pixelarticons/react'
import { useStore } from './store.jsx'
import { WORKSPACE } from './data/myelin.js'
import { Tip } from './components/ui/tooltip.jsx'
import Overview from './pages/Overview.jsx'
import Today from './app/Today.jsx'
import Tasks from './app/Tasks.jsx'
import TaskView from './app/TaskView.jsx'
import Memory from './app/Memory.jsx'
import Habits from './app/Habits.jsx'
import Spend from './app/Spend.jsx'
import Settings from './app/Settings.jsx'
import Sleep from './app/Sleep.jsx'
import Desktop from './pages/Desktop.jsx'
import MobileFrame, { MobileApp } from './mobile/Mobile.jsx'
import Credits from './pages/Credits.jsx'

export default function App() {
  const loc = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/desktop" element={<Desktop />} />
      <Route path="/mobile" element={<MobileFrame />} />
      <Route path="/m/*" element={<MobileApp />} />
      <Route path="/credits" element={<Credits />} />
      <Route path="/app/*" element={<Shell />} />
      <Route path="*" element={<Overview />} />
    </Routes>
  )
}

export const NAV = [
  ['/app', 'Today', Home, 'g t'], ['/app/tasks', 'Tasks', MessageText, 'g k'], ['/app/memory', 'Memory', Database, 'g m'],
  ['/app/habits', 'Habits', Repeat, 'g h'], ['/app/spend', 'Spend', Coins, 'g s'], ['/app/settings', 'Settings', Sliders, 'g ,'],
]

export function Mark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#1d1d21" /><path d="M4 20h6l3-9 4 14 3-9h8" fill="none" stroke="#f0b04a" strokeWidth="2.5" /></svg>
  )
}

export function Shell({ embedded = false }) {
  const { s, dispatch } = useStore()
  const nav = useNavigate()
  // Keyboard: g then a letter moves between screens; n starts a new task from anywhere.
  useEffect(() => {
    let g = false; let timer
    const on = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.metaKey || e.ctrlKey) return
      if (e.key === 'n') { e.preventDefault(); nav('/app?focus=1'); return }
      if (e.key === 'g') { g = true; clearTimeout(timer); timer = setTimeout(() => { g = false }, 900); return }
      if (g) { const hit = NAV.find((x) => x[3] === `g ${e.key}`); if (hit) nav(hit[0]); g = false }
    }
    document.addEventListener('keydown', on)
    return () => document.removeEventListener('keydown', on)
  }, [nav])
  const habitsWaiting = 2 - s.approved.length - s.declined.length
  return (
    <div className="min-h-screen md:grid md:grid-cols-[56px_1fr]">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-amber focus:px-4 focus:py-2 focus:text-amber-ink">Skip to content</a>
      <aside className="sticky top-0 hidden h-screen flex-col items-center gap-1 border-r border-line py-3 md:flex" aria-label="Screens">
        <Tip label="Myelin overview"><Link to="/" className="mb-4" aria-label="Myelin overview"><Mark /></Link></Tip>
        {NAV.map(([to, label, Icon, keys]) => (
          <Tip key={to} label={<span>{label} <span className="num text-muted">{keys}</span></span>}>
            <span className="inline-flex"><NavLink to={to} end={to === '/app'} aria-label={label} className={({ isActive }) => `relative grid size-10 place-items-center rounded-[6px] text-muted hover:bg-raised hover:text-ink ${isActive ? 'text-ink before:absolute before:-left-2 before:top-2 before:bottom-2 before:w-px before:bg-amber' : ''}`}>
              <Icon width={18} height={18} />
              {to === '/app/habits' && habitsWaiting > 0 && <span className="num absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-amber text-[10px] font-semibold text-amber-ink" aria-label={`${habitsWaiting} habits to approve`}>{habitsWaiting}</span>}
            </NavLink></span>
          </Tip>
        ))}
        <div className="mt-auto flex flex-col items-center gap-1">
          <Tip label="Desktop app"><Link to="/desktop" aria-label="Desktop app" className="grid size-10 place-items-center rounded-[6px] text-muted hover:bg-raised hover:text-ink"><Monitor width={18} height={18} /></Link></Tip>
          <Tip label="Mobile app"><Link to="/mobile" aria-label="Mobile app" className="grid size-10 place-items-center rounded-[6px] text-muted hover:bg-raised hover:text-ink"><Phone width={18} height={18} /></Link></Tip>
          <Tip label="Reset the demo"><button onClick={() => { dispatch({ type: 'reset' }); nav('/app') }} aria-label="Reset the demo" className="grid size-10 place-items-center rounded-[6px] text-muted hover:bg-raised hover:text-ink"><Undo width={18} height={18} /></button></Tip>
        </div>
      </aside>
      <div className="min-w-0 pb-20 md:pb-0">
        <header className="flex h-12 items-center gap-3 border-b border-line px-5 md:px-8">
          <Link to="/" className="md:hidden" aria-label="Myelin overview"><Mark size={24} /></Link>
          <span className="text-[13px] font-semibold">{WORKSPACE.name}</span>
          <span className="text-[13px] text-muted">· {WORKSPACE.plan} · {WORKSPACE.seats} people</span>
          <Link to="/app/settings" className="ml-auto hidden items-center gap-2 rounded-full px-2 py-1 text-[12.5px] text-muted hover:bg-raised hover:text-ink sm:flex"><Zap width={14} height={14} className="text-amber" />Thinking budget <span className="text-ink">{s.budget[0].toUpperCase() + s.budget.slice(1)}</span></Link>
        </header>
        <main id="content" tabIndex={-1} className="mx-auto w-full max-w-[1240px] px-5 py-7 outline-none md:px-8">
          <Routes>
            <Route index element={<Today />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/:id" element={<TaskView />} />
            <Route path="memory" element={<Memory />} />
            <Route path="habits" element={<Habits />} />
            <Route path="spend" element={<Spend />} />
            <Route path="settings" element={<Settings />} />
            <Route path="sleep" element={<Sleep />} />
          </Routes>
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-line bg-ground px-3 md:hidden" aria-label="Screens">
        {NAV.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} end={to === '/app'} className={({ isActive }) => `sel-under flex flex-col items-center gap-0.5 py-2 text-[10.5px] ${isActive ? 'active text-ink' : 'text-muted'}`}><Icon width={18} height={18} />{label}</NavLink>
        ))}
      </nav>
      {s.toast && <p role="status" className="rise fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line bg-raised px-4 py-2 text-[13px] shadow-[0_12px_28px_rgba(0,0,0,.45)] md:bottom-6">{s.toast}</p>}
    </div>
  )
}
