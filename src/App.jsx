import { Navigate, Route, Routes, useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from './app/store.jsx'
import { Wordmark } from './components/ui.jsx'
import Welcome from './screens/Welcome.jsx'
import SignUp from './screens/SignUp.jsx'
import Discover from './screens/Discover.jsx'
import Creator from './screens/Creator.jsx'
import Viewer from './screens/Viewer.jsx'
import Book from './screens/Book.jsx'
import Bookings from './screens/Bookings.jsx'
import Saved from './screens/Saved.jsx'
import Me from './screens/Me.jsx'
import Studio from './screens/Studio.jsx'
import Credits from './screens/Credits.jsx'

const FLOWS = [
  ['/welcome', 'Welcome'],
  ['/signup', 'Create an account'],
  ['/', 'Discover creators'],
  ['/creator/amara-okafor', 'Creator portfolio'],
  ['/creator/priya-raman/media/2', 'Portfolio viewer'],
  ['/book/lucia-ferreyra', 'Book and pay'],
  ['/bookings', 'My bookings'],
  ['/studio', 'Creator studio'],
]

function Guard({ children }) {
  const { user } = useStore()
  return user ? children : <Navigate to="/welcome" replace />
}

export default function App() {
  const loc = useLocation()
  return (
    <div className="stage">
      <aside className="stage-info">
        <Wordmark />
        <h1>Book photographers and videographers near you.</h1>
        <p className="muted">Interactive prototype with mock data. Pick a flow or use the app directly.</p>
        <nav aria-label="Prototype flows">{FLOWS.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</nav>
      </aside>
      <div className="device">
        <div className="device-screen">
          <span className="island" aria-hidden="true" />
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={loc.pathname.split('/').slice(0, 3).join('/')}
              style={{ position: 'absolute', inset: 0 }}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <Routes location={loc}>
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<Guard><Discover /></Guard>} />
                <Route path="/creator/:id" element={<Guard><Creator /></Guard>} />
                <Route path="/creator/:id/media/:index" element={<Guard><Viewer /></Guard>} />
                <Route path="/book/:id" element={<Guard><Book /></Guard>} />
                <Route path="/bookings" element={<Guard><Bookings /></Guard>} />
                <Route path="/saved" element={<Guard><Saved /></Guard>} />
                <Route path="/me" element={<Guard><Me /></Guard>} />
                <Route path="/studio" element={<Guard><Studio /></Guard>} />
                <Route path="/credits" element={<Credits />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
