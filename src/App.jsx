import { useEffect, useRef } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from './store.jsx'
import Home from './screens/Home.jsx'
import NewSetup from './screens/NewSetup.jsx'
import Saved from './screens/Saved.jsx'
import Bank, { Exercise } from './screens/Bank.jsx'
import Club from './screens/Club.jsx'
import Plan from './screens/Plan.jsx'
import Credits from './screens/Credits.jsx'
import * as I from './ui/icons.js'

function Tabs() {
  const tab = (to, Icon, label) => (
    <NavLink to={to} end={to === '/'} className="tab"><Icon aria-hidden="true" /><span>{label}</span></NavLink>
  )
  return <nav className="tabs" aria-label="Main">{tab('/', I.Home, 'Setups')}{tab('/new', I.New, 'New')}{tab('/bank', I.Bank, 'Exercises')}{tab('/club', I.Club, 'Club')}</nav>
}

export default function App() {
  const loc = useLocation()
  const scroller = useRef(null)
  useEffect(() => { scroller.current?.scrollTo(0, 0) }, [loc.pathname])
  const bare = loc.pathname.startsWith('/new') || loc.pathname.startsWith('/setup/')
  return (
    <div className="stage">
      <div className="phone">
        <div className="app">
          <main className="screen" ref={scroller}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<NewSetup />} />
              <Route path="/setup/:id" element={<Saved />} />
              <Route path="/bank" element={<Bank />} />
              <Route path="/bank/:id" element={<Exercise />} />
              <Route path="/club" element={<Club />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          {!bare && <Tabs />}
        </div>
      </div>
      <Panel />
    </div>
  )
}

function Panel() {
  const nav = useNavigate()
  const { dispatch } = useStore()
  return (
    <aside className="panel" aria-label="About this prototype">
      <p className="panel-brand"><span className="mark" aria-hidden="true" />Oppsett</p>
      <h2>Photograph the area, pick the exercise, get the setup drawn on the real photo.</h2>
      <p>A prototype of version 1 for one coach at Oslo Golf Club. The AI reads the photo for the ground, the hole or mat, and something of known size, then places each exercise’s equipment in metres and draws it in perspective. Drag any marker to adjust it.</p>
      <div className="panel-group">
        <h3>Try it</h3>
        <div className="panel-links">
          <button onClick={() => nav('/new?area=putting')}>Putting green, new setup</button>
          <button onClick={() => nav('/new?area=range&exercise=OB-009')}>Range bay, start line gate</button>
          <button onClick={() => nav('/new?area=pitching&exercise=OB-022')}>Short game, avoids a bag</button>
          <button onClick={() => nav('/new?area=trackman')}>Trackman room, no photo yet</button>
          <button onClick={() => nav('/plan')}>How version 1 gets built</button>
        </div>
        <button className="panel-reset" onClick={() => { dispatch({ type: 'reset' }); nav('/') }}><I.Again aria-hidden="true" /> Reset the demo</button>
      </div>
      <p className="panel-foot">Sample photos are real (Open Images, CC BY 2.0), standing in for Oslo Golf Club’s own. The AI step is simulated in this prototype; each sample photo carries the result a vision model would return. You can also upload your own photo and calibrate it with two taps.</p>
    </aside>
  )
}
