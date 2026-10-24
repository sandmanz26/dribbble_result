import { useEffect, useRef } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './store.jsx'
import Icon from './ui/Icon.jsx'
import { Toast } from './ui/kit.jsx'
import Frame from './Frame.jsx'
import Welcome from './screens/Welcome.jsx'
import Discover from './screens/Discover.jsx'
import Place from './screens/Place.jsx'
import Group from './screens/Group.jsx'
import Groups from './screens/Groups.jsx'
import NewGroup from './screens/NewGroup.jsx'
import Trips from './screens/Trips.jsx'
import Trip from './screens/Trip.jsx'
import Chats from './screens/Chats.jsx'
import Chat from './screens/Chat.jsx'
import Profile from './screens/Profile.jsx'
import Safety from './screens/Safety.jsx'
import Person from './screens/Person.jsx'
import Notifications from './screens/Notifications.jsx'
import Guidelines from './screens/Guidelines.jsx'

const TABS = [
  ['/', 'Discover', 'discover'],
  ['/groups', 'Groups', 'groups'],
  ['/trips', 'Trips', 'trips'],
  ['/chats', 'Chats', 'chats'],
  ['/me', 'You', 'me'],
]
const TAB_ROOTS = ['/', '/groups', '/trips', '/chats', '/me']

function Tabs() {
  const { s } = useStore()
  const requests = s.accepted.includes('sam') || s.blocked.includes('sam') ? 0 : 1
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map(([to, label, icon]) => (
        <NavLink key={to} to={to} end={to === '/'} className="tab">
          <span className="tab-icon">
            <Icon name={icon} size={24} />
            {to === '/chats' && requests > 0 && <i className="tab-dot" aria-label={`${requests} message request`} />}
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default function App() {
  const { s } = useStore()
  const loc = useLocation()
  const scroller = useRef(null)
  // Every new screen starts at the top, like a native push.
  useEffect(() => { scroller.current?.scrollTo(0, 0) }, [loc.pathname])
  const showTabs = s.onboarded && TAB_ROOTS.includes(loc.pathname)

  return (
    <Frame>
      <div className="app">
        <div className="screen" ref={scroller}>
          {!s.onboarded ? (
            <Routes>
              <Route path="/welcome/*" element={<Welcome />} />
              <Route path="*" element={<Navigate to="/welcome" replace />} />
            </Routes>
          ) : (
          <Routes>
            <Route path="/welcome/*" element={<Navigate to="/" replace />} />
            <Route path="/" element={<Discover />} />
            <Route path="/d/:id" element={<Place />} />
            <Route path="/g/:id" element={<Group />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/new" element={<NewGroup />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trip/:id/:tab?" element={<Trip />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/chats/:id" element={<Chat />} />
            <Route path="/me" element={<Profile />} />
            <Route path="/me/safety" element={<Safety />} />
            <Route path="/me/guidelines" element={<Guidelines />} />
            <Route path="/u/:id" element={<Person />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          )}
        </div>
        {showTabs && <Tabs />}
        <Toast />
      </div>
    </Frame>
  )
}
