import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  return (
    <header className="site-header">
      <div className="wrap">
        <Link to="/" className="brand" aria-label="Wanderlog Gang — home">
          <span className="brand-mark"><span /></span>
          Wanderlog Gang
        </Link>
        <button className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>
          {open ? 'CLOSE' : 'MENU'}
        </button>
        <nav id="nav" className={`nav ${open ? 'open' : ''}`} aria-label="Primary">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/journal">Journal</NavLink>
          <Link to={{ pathname: '/', search: '' }} onClick={() => setTimeout(() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' }), 60)}>Calendar</Link>
          <NavLink to="/subscribe" className="btn sm" style={{ color: '#fff', marginLeft: 8 }}>Subscribe</NavLink>
        </nav>
      </div>
    </header>
  )
}
