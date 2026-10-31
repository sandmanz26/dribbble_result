import { useEffect, useState } from 'react'
import { startScroll, goTo, ScrollTrigger } from './motion.js'
import { Hero, Story, Courses, Menu, Rooms, Guests, Visit } from './Scenes.jsx'
import { BookingBar, Dock, Reserve, useBooking } from './Reserve.jsx'

function Nav() {
  const go = (id) => (e) => { e.preventDefault(); goTo(id) }
  return (
    <header className="nav">
      <a href="#top" className="nav-word" onClick={go('top')} aria-label="Osier, back to top">OSIER</a>
      <nav aria-label="Sections">
        <a href="#menu" onClick={go('menu')}>Menu</a>
        <a href="#room" onClick={go('room')}>The rooms</a>
        <a href="#visit" onClick={go('visit')}>Visit</a>
        <a href="#reserve" onClick={go('reserve')}>Reserve</a>
      </nav>
    </header>
  )
}

export default function App() {
  const [b, set] = useBooking()
  const [ready, setReady] = useState(false)
  useEffect(() => { (document.fonts?.ready || Promise.resolve()).then(() => setReady(true)) }, [])
  useEffect(() => {
    startScroll()
    const r = () => ScrollTrigger.refresh()
    window.addEventListener('load', r)
    document.fonts?.ready.then(r)
    return () => window.removeEventListener('load', r)
  }, [])
  return (
    <>
      <Nav />
      <main className={ready ? 'is-ready' : ''}>
        <Hero><BookingBar b={b} set={set} /></Hero>
        {ready && <><Story />
        <Courses />
        <Menu />
        <Rooms />
        <Guests /></>}
        <Reserve b={b} set={set} />
        <Visit />
      </main>
      {ready && <Dock />}
    </>
  )
}
