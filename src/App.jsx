import { createContext, useContext, useEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { HalfMoon, SunLight } from 'iconoir-react'
import { WEAR, WEAR_LABEL } from './data/controls.js'
import Instrument from './pages/Instrument.jsx'
import States from './pages/States.jsx'
import Motion from './pages/Motion.jsx'
import Assets from './pages/Assets.jsx'
import Widgets from './pages/Widgets.jsx'
import Notes from './pages/Notes.jsx'
import Render from './pages/Render.jsx'

const KEY = 'bz-ui'
const Ctx = createContext(null)
export const useUi = () => useContext(Ctx)

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

const NAV = [
  ['/', 'Instrument'],
  ['/states', 'Control states'],
  ['/motion', 'Motion'],
  ['/assets', 'Assets'],
  ['/widgets', 'Code widgets'],
  ['/notes', 'Notes'],
]

export function WearPicker() {
  const { wear, setWear } = useUi()
  return (
    <div className="seg" role="radiogroup" aria-label="Wear stage">
      {WEAR.map((w) => (
        <button key={w} type="button" role="radio" aria-checked={wear === w} className={wear === w ? 'is-on' : ''} onClick={() => setWear(w)}>
          {WEAR_LABEL[w]}
        </button>
      ))}
    </div>
  )
}

function Shell({ children }) {
  const { scheme, setScheme } = useUi()
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>Skip to content</a>
      <header className="top">
        <div className="wrap top-row">
          <NavLink to="/" className="maker">
            <span className="maker-name">The Busticated Co.</span>
            <span className="maker-sub">Scrapyard BC-01, interface proposal</span>
          </NavLink>
          <nav aria-label="Main" className="nav">
            {NAV.map(([to, label]) => (
              <NavLink key={to} to={to} end>{label}</NavLink>
            ))}
          </nav>
          <button
            type="button"
            className="icon-btn"
            aria-label={scheme === 'dark' ? 'Switch page to light' : 'Switch page to dark'}
            onClick={() => setScheme(scheme === 'dark' ? 'light' : 'dark')}
          >
            {scheme === 'dark' ? <SunLight /> : <HalfMoon />}
          </button>
        </div>
      </header>
      <main id="main" tabIndex={-1}>{children}</main>
      <footer className="foot">
        <div className="wrap">
          <p>Concept interface for a design brief. The plugin name, presets and sounds are placeholders. Audio is synthesised in your browser; nothing is recorded or sent anywhere.</p>
        </div>
      </footer>
    </>
  )
}

export default function App() {
  const saved = load()
  const [wear, setWear] = useState(saved.wear || 'worn')
  const [scheme, setScheme] = useState(saved.scheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ wear, scheme }))
    } catch {}
    document.documentElement.dataset.scheme = scheme
  }, [wear, scheme])

  return (
    <Ctx.Provider value={{ wear, setWear, scheme, setScheme }}>
      <Routes>
        <Route path="/render" element={<Render />} />
        <Route path="/" element={<Shell><Instrument /></Shell>} />
        <Route path="/states" element={<Shell><States /></Shell>} />
        <Route path="/motion" element={<Shell><Motion /></Shell>} />
        <Route path="/assets" element={<Shell><Assets /></Shell>} />
        <Route path="/widgets" element={<Shell><Widgets /></Shell>} />
        <Route path="/notes" element={<Shell><Notes /></Shell>} />
        <Route path="*" element={<Shell><Instrument /></Shell>} />
      </Routes>
    </Ctx.Provider>
  )
}
