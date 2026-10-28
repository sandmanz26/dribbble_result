import { useEffect, useRef } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { BarChart, ClipboardCheck, Files as FilesIcon, Signpost2 } from 'react-bootstrap-icons'
import { useStore } from './store.jsx'
import Frame from './Frame.jsx'
import Walk from './screens/Walk.jsx'
import Check from './screens/Check.jsx'
import Files from './screens/Files.jsx'
import Summary from './screens/Summary.jsx'
import { Mark, Toast } from './ui/kit.jsx'
import { STORE } from './data/sample.js'

export default function App() {
  const { s, result, loadSamples } = useStore()
  const loc = useLocation()
  const sheet = useRef(null)
  useEffect(() => { sheet.current?.scrollTo(0, 0) }, [loc.pathname])
  // Review link: #/?demo=walk opens the walk with the sample files loaded.
  useEffect(() => { if (/demo=walk/.test(window.location.hash) && !s.files.plano) loadSamples() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const problems = result && !result.unmapped ? result.issues.missing.length + result.issues.badRows.length : 0
  const tabs = [['/', 'Walk', Signpost2], ['/check', 'Check', ClipboardCheck], ['/files', 'Files', FilesIcon], ['/summary', 'Summary', BarChart]]
  return (
    <Frame>
      <div className="app">
        <header className="topbar"><span className="store"><Mark /> {STORE.name} <small>Store {STORE.id}</small></span><small className="muted">Wed 28 Oct</small></header>
        <main className="sheet" ref={sheet}>
          <Routes>
            <Route path="/" element={s.files.plano && s.files.inv ? <Walk /> : <Files />} />
            <Route path="/check" element={<Check />} />
            <Route path="/files" element={<Files />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="*" element={<Walk />} />
          </Routes>
        </main>
        <nav className="tabbar" aria-label="Main">
          {tabs.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end className="tab"><Icon size={22} aria-hidden="true" /><span>{label}</span>{to === '/check' && problems > 0 && <span className="badge num" aria-label={`${problems} problems`}>{problems}</span>}</NavLink>
          ))}
        </nav>
        <Toast />
      </div>
    </Frame>
  )
}
