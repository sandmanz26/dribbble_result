import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import Simulator from './pages/Simulator.jsx'
import Kit from './pages/Kit.jsx'
import Spec from './pages/Spec.jsx'

export default function App() {
  return (
    <HashRouter>
      <header className="top">
        <div className="brand"><span className="dot" aria-hidden="true" />Hotshoe</div>
        <nav aria-label="Main">
          <NavLink to="/" end>Simulator</NavLink>
          <NavLink to="/kit">Design kit</NavLink>
          <NavLink to="/spec">Hardware rules</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Simulator />} />
          <Route path="/kit" element={<Kit />} />
          <Route path="/spec" element={<Spec />} />
          <Route path="*" element={<Simulator />} />
        </Routes>
      </main>
    </HashRouter>
  )
}
