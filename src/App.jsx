import { useEffect, useRef } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './store.jsx'
import Icon from './ui/Icon.jsx'
import { Toast } from './ui/kit.jsx'
import Frame from './Frame.jsx'
import Welcome from './screens/Welcome.jsx'
import Home from './screens/Home.jsx'
import CheckIn from './screens/CheckIn.jsx'
import Ritual from './screens/Ritual.jsx'
import Breath from './screens/Breath.jsx'
import Sit from './screens/Sit.jsx'
import Herb from './screens/Herb.jsx'
import Journal from './screens/Journal.jsx'
import Write from './screens/Write.jsx'
import Profile from './screens/Profile.jsx'
import System from './screens/System.jsx'

const TABS = [['/', 'Today', 'home'], ['/journal', 'Journal', 'book'], ['/you', 'You', 'user']]

export default function App() {
  const { s } = useStore()
  const loc = useLocation()
  const scroller = useRef(null)
  useEffect(() => { scroller.current?.scrollTo(0, 0) }, [loc.pathname])
  if (loc.pathname === '/system') return <System />
  const tabs = s.onboarded && ['/', '/journal', '/you'].includes(loc.pathname)
  // The players fill the whole phone, status bar included, with their print's exposure.
  const player = s.onboarded && ['/ritual/breath', '/ritual/sit'].includes(loc.pathname)
  const ex = loc.pathname === '/ritual/sit' ? 'tired' : s.checkin?.mood || 'steady'
  return (
    <Frame>
      <div className={`app ${player ? `on-player ex-${ex}` : ''}`}>
        <div className="screen" ref={scroller}>
          {!s.onboarded ? (
            <Routes>
              <Route path="/welcome" element={<Welcome />} />
              <Route path="*" element={<Navigate to="/welcome" replace />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/check-in" element={<CheckIn />} />
              <Route path="/ritual" element={<Ritual />} />
              <Route path="/ritual/breath" element={<Breath />} />
              <Route path="/ritual/sit" element={<Sit />} />
              <Route path="/ritual/herb" element={<Herb />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/new" element={<Write />} />
              <Route path="/you" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </div>
        {tabs && (
          <nav className="tabbar" aria-label="Main">
            {TABS.map(([to, l, i]) => <NavLink key={to} to={to} end className="tab"><Icon name={i} size={24} /><span>{l}</span></NavLink>)}
          </nav>
        )}
        <Toast />
      </div>
    </Frame>
  )
}
