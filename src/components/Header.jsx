import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { List, X, Moon, Sun } from '@phosphor-icons/react'

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || null)
  const sysDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme ? theme === 'dark' : sysDark()
  const toggle = () => {
    const next = isDark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('wg-theme', next) } catch { /* private mode */ }
    setTheme(next)
  }
  return [isDark, toggle]
}

export function Mark() {
  // Simple geometric mark: a setting sun over the horizon.
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="var(--accent)" />
      <circle cx="16" cy="17" r="7" fill="var(--bg)" />
      <rect x="5" y="21" width="22" height="3" fill="var(--accent)" />
    </svg>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [isDark, toggle] = useTheme()
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="site-header">
      <div className="wrap">
        <Link to="/" className="brand" aria-label="Wanderlog Gang home"><Mark />Wanderlog Gang</Link>
        <nav id="nav" className={`nav ${open ? 'open' : ''}`} aria-label="Primary">
          <NavLink to="/calendar">Calendar</NavLink>
          <NavLink to="/journal">Journal</NavLink>
          <NavLink to="/subscribe" className="btn">Subscribe</NavLink>
        </nav>
        <button className="icon-btn" onClick={toggle} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="icon-btn menu-btn" aria-expanded={open} aria-controls="nav" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>
    </header>
  )
}
