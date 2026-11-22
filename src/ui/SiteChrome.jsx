import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Icon, Wordmark } from './kit.jsx'

const LINKS = [
  ['/#route', 'How it works'],
  ['/#subjects', 'Subjects'],
  ['/pricing', 'Pricing'],
  ['/team', 'Examiners'],
  ['/#families', 'Parents and teachers'],
]

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname, loc.hash])
  return (
    <header className="snav">
      <Wordmark />
      <nav className={`snav-links${open ? ' is-open' : ''}`} aria-label="Main">
        {LINKS.map(([to, label]) =>
          to.includes('#') ? (
            <Link key={to} to={to} className="snav-link">
              {label}
            </Link>
          ) : (
            <NavLink key={to} to={to} className="snav-link">
              {label}
            </NavLink>
          ),
        )}
        <NavLink to="/start?mode=signin" className="snav-link snav-signin">
          Sign in
        </NavLink>
      </nav>
      <div className="snav-end">
        <Link to="/start?mode=signin" className="snav-link snav-signin-wide">
          Sign in
        </Link>
        <Link to="/taster/economics" className="btn is-small">
          Mark my first answer
        </Link>
        <button className="snav-menu" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          <Icon name={open ? 'cross' : 'menu'} size={24} />
        </button>
      </div>
    </header>
  )
}

export function SiteFooter() {
  const letters = ['E', 'x', 'a', 'm', 'A', 'c', 'e']
  const heights = [100, 72, 78, 84, 100, 70, 80]
  return (
    <footer className="sfoot on-ox">
      <div className="sfoot-mark" aria-hidden="true">
        {letters.map((l, i) => (
          <span key={i} style={{ height: `${heights[i]}%` }}>
            {l}
          </span>
        ))}
      </div>
      <div className="sfoot-cols">
        <div>
          <h2 className="sfoot-h">Revise</h2>
          <Link to="/taster/economics">Free Economics lesson</Link>
          <Link to="/#subjects">Business</Link>
          <Link to="/#subjects">Psychology</Link>
          <Link to="/#subjects">Sociology</Link>
        </div>
        <div>
          <h2 className="sfoot-h">ExamAce</h2>
          <Link to="/team">The examiners</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/start">Create an account</Link>
          <Link to="/start?mode=signin">Sign in</Link>
        </div>
        <div>
          <h2 className="sfoot-h">Schools</h2>
          <Link to="/teacher">Teacher dashboard</Link>
          <Link to="/teacher/review">Checking AI marks</Link>
          <Link to="/start?role=teacher">Set up a class</Link>
        </div>
        <div>
          <h2 className="sfoot-h">Families</h2>
          <Link to="/parent">Parent view</Link>
          <Link to="/#faq">Questions</Link>
        </div>
        <div className="sfoot-note">
          <p>Lessons and marking for AQA, Edexcel, OCR, Cambridge International and Edexcel International A-Levels.</p>
          <p>ExamAce is not affiliated with any exam board. AI marking is a guide to your level, not a grade.</p>
        </div>
      </div>
      <div className="sfoot-last">
        <p>Design prototype for ExamAce, November 2026. Sample people and marks. Photographs generated for this prototype.</p>
        <Link to="/audit" className="btn is-paper is-small">
          Read the UX audit
        </Link>
      </div>
    </footer>
  )
}
