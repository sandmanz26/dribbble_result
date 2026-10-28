import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './store.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Client from './pages/Client.jsx'
import Staff from './pages/Staff.jsx'

// Public site at /, the sign-up and log-in flows, then two areas behind a demo sign-in:
// the client area for a trader and the staff area for the back office.
export default function App() {
  const { s } = useStore()
  const loc = useLocation()
  useEffect(() => { if (!loc.hash) window.scrollTo(0, 0) }, [loc.pathname, loc.hash])
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/client/*" element={s.session === 'client' ? <Client /> : <Navigate to="/login" replace />} />
      <Route path="/staff/*" element={s.session === 'staff' ? <Staff /> : <Navigate to="/login?as=staff" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
