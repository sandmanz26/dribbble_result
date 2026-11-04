import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { CgMenu, CgClose, CgArrowTopRight } from 'react-icons/cg'
import { useWipe } from './motion.js'
import Home from './pages/Home.jsx'
import Space from './pages/Space.jsx'
import Tour from './pages/Tour.jsx'

export function WLink({ to, colour, children, className, ...rest }) {
  const wipe = useWipe()
  return <a href={`#${to}`} className={className} onClick={(e) => { if (e.metaKey || e.ctrlKey) return; e.preventDefault(); wipe(to, colour) }} {...rest}>{children}</a>
}

export function Logo() {
  return (
    <span className="logo" aria-hidden="true">
      <i className="lg-a" /><i className="lg-b" /><i className="lg-c" />
    </span>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  return (
    <header className="hdr">
      <WLink to="/" className="brand" aria-label="Co-Ware, home"><Logo /><b>Co-Ware</b></WLink>
      <nav className={`nav ${open ? 'open' : ''}`} aria-label="Main">
        <WLink to="/spaces/shelf" colour="var(--lemon)">Shelves</WLink>
        <WLink to="/spaces/pallet" colour="var(--teal)">Pallets</WLink>
        <WLink to="/spaces/bay" colour="var(--cobalt)">Private bays</WLink>
        <WLink to="/spaces/desk" colour="var(--tangerine)">Packing desks</WLink>
        <WLink to="/tour" colour="var(--tangerine)" className="tour-link">Book a tour</WLink>
        <a href="#plan" onClick={(e) => { if (loc.pathname !== '/') return; e.preventDefault(); document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' }) }}>Floor plan</a>
      </nav>
      <WLink to="/tour" colour="var(--tangerine)" className="btn sm">Book a tour<CgArrowTopRight aria-hidden="true" /></WLink>
      <button className="menu" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">{open ? <CgClose /> : <CgMenu />}</button>
    </header>
  )
}

function Footer() {
  return (
    <footer className="foot">
      <div className="foot-blocks" aria-hidden="true">{['C', 'O', '-', 'W', 'A', 'R', 'E'].map((c, i) => <span key={i} style={{ '--i': i }}>{c}</span>)}</div>
      <div className="foot-row">
        <span>Co-Ware, shared warehouse space for small brands. Sample address: Unit 4, Riverside Trade Park.</span>
        <span>Open 7:00 to 22:00, private bays 24 hours</span>
        <span>Photos are AI-generated concept images. Prices and units are samples.</span>
      </div>
    </footer>
  )
}

export default function App() {
  const loc = useLocation()
  useEffect(() => { document.title = loc.pathname.startsWith('/spaces') ? 'Spaces · Co-Ware' : loc.pathname === '/tour' ? 'Book a tour · Co-Ware' : 'Co-Ware, shared warehouse space for small brands' }, [loc.pathname])
  return (
    <>
      <div className="readbar" aria-hidden="true" />
      <Header />
      <main key={loc.pathname} className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spaces/:type" element={<Space />} />
          <Route path="/tour" element={<Tour />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <div id="wipe" className="wipe" aria-hidden="true" />
      <Link to="/" className="sr">Home</Link>
    </>
  )
}
