import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useBrand } from '../brand/BrandContext.jsx'
import { Button, IconButton, Wordmark } from '../ui/index.jsx'

const NAV = [
  { to: '/services', label: 'Services and prices' },
  { to: '/', state: { scrollTo: 'how' }, label: 'How it works' },
  { to: '/', state: { scrollTo: 'areas' }, label: 'Where we work' },
  { to: '/bookings', label: 'My bookings' },
]

export function SiteHeader() {
  const { brand } = useBrand()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc])

  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link to="/" className="brand-link" aria-label="Home">
          <Wordmark brand={brand} />
        </Link>
        <nav className="header-nav" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.label} to={n.to} state={n.state} end className={({ isActive }) => (isActive && !n.state ? 'is-active' : '')}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-cta">
          <Button to="/quote/vehicle" size="sm">Get a quote</Button>
          <IconButton className="menu-btn" icon={open ? X : Menu} label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)} />
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} state={n.state}>{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  )
}

export function SiteFooter() {
  const { brand } = useBrand()
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="stack-sm">
          <Wordmark brand={brand} />
          <p className="muted small">
            {brand === 'valvoline'
              ? 'Mobile brake repair by the technicians who built NuBrakes, now part of Valvoline.'
              : 'Mobile brake repair at your home or work. Now part of Valvoline.'}
          </p>
        </div>
        <nav aria-label="Footer" className="footer-links">
          <Link to="/services">Services and prices</Link>
          <Link to="/quote/vehicle">Get a quote</Link>
          <Link to="/bookings">My bookings</Link>
          <Link to="/system">Design system</Link>
          <Link to="/notes">Project notes</Link>
        </nav>
      </div>
      <div className="wrap footer-note">
        <p className="small muted">
          Concept prototype for a design brief. Not a live service. Prices, reviews, technicians and availability are sample data.
          Colour values are placeholders until the brand design system is shared.
        </p>
      </div>
    </footer>
  )
}
