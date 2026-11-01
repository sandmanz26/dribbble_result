import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { LiaBarsSolid, LiaTimesSolid } from 'react-icons/lia'
import { Mark, photo, useRise } from './ui.jsx'
import { dateOf, fmtDate } from './data/awards.js'
import Home from './pages/Home.jsx'
import Categories from './pages/Categories.jsx'
import Category from './pages/Category.jsx'
import Winner from './pages/Winner.jsx'
import Jury from './pages/Jury.jsx'
import Judging from './pages/Judging.jsx'
import Enter from './pages/Enter.jsx'
import Notes from './pages/Notes.jsx'
import Credits from './pages/Credits.jsx'

const NAV = [['/categories', 'Categories'], ['/winners', 'Winners 2026'], ['/jury', 'Jury'], ['/judging', 'How judging works']]

export default function App() {
  const loc = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuBtn = useRef(null)
  const first = useRef(true)

  // Page to page: a view transition where the browser has one (the winner's portrait travels with it), a plain swap where not.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#/"]')
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return
      if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const to = a.getAttribute('href').slice(1)
      if (to === window.location.hash.slice(1)) return
      e.preventDefault(); e.stopPropagation()
      document.startViewTransition(() => flushSync(() => navigate(to)))
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [navigate])

  // After a route change: top of the page, the tab title from the page's heading, focus on that heading.
  useEffect(() => {
    setOpen(false)
    if (!loc.state?.keepScroll) window.scrollTo(0, 0)
    const h1 = document.querySelector('main h1')
    const name = h1 ? (h1.dataset.title || h1.textContent).trim() : ''
    document.title = loc.pathname === '/' || !name ? 'Tech Leader Awards 2027' : `${name}, Tech Leader Awards`
    if (first.current) { first.current = false; return }
    if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }) }
  }, [loc.pathname])

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    if (!open) return
    const on = (e) => { if (e.key === 'Escape') { setOpen(false); menuBtn.current?.focus() } }
    document.addEventListener('keydown', on)
    return () => document.removeEventListener('keydown', on)
  }, [open])
  useRise()
  return (
    <>
      <a href="#main" className="sr-only" onFocus={(e) => e.currentTarget.classList.remove('sr-only')} onBlur={(e) => e.currentTarget.classList.add('sr-only')} onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>Skip to content</a>
      <header className={`bar${scrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="mark" aria-label="Tech Leader Awards, home"><Mark />Tech Leader Awards</Link>
        <button ref={menuBtn} className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen((v) => !v)}>{open ? <LiaTimesSolid size={20} aria-hidden="true" /> : <LiaBarsSolid size={20} aria-hidden="true" />}Menu</button>
        <nav id="nav" className={open ? 'open' : ''} aria-label="Main">
          {NAV.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
          <NavLink to="/enter" className="mobile-only">Enter 2027</NavLink>
        </nav>
        <Link to="/enter" className="btn enter">Enter 2027</Link>
      </header>
      <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<Category />} />
          <Route path="/winners" element={<Categories winners />} />
          <Route path="/winners/:slug" element={<Winner />} />
          <Route path="/jury" element={<Jury />} />
          <Route path="/judging" element={<Judging />} />
          <Route path="/enter" element={<Enter />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function NotFound() {
  return (
    <section className="page-head" style={{ paddingBottom: 120 }}>
      <h1>That page is not in the programme</h1>
      <p>Try the <Link className="link" to="/categories">categories</Link> or the <Link className="link" to="/">front page</Link>.</p>
    </section>
  )
}

function Footer() {
  return (
    <footer className="foot">
      <div className="back">
        <div className="sign">
          <h2>See you in New York</h2>
          <p>Winners are named on {fmtDate(dateOf('ceremony'))}, and every scorecard goes up the same night. Entries close {fmtDate(dateOf('close'))}.</p>
        </div>
        <div className="addr">
          <span className="stamp" aria-hidden="true"><img src={photo('crystal')} alt="" width="88" height="117" loading="lazy" /></span>
          <Link to="/categories">All categories</Link>
          <Link to="/jury">The jury and its declarations</Link>
          <Link to="/judging">Rules and judging</Link>
          <a href="mailto:jury@techleaderawards.example?subject=Question%20about%20the%202027%20awards">jury@techleaderawards.example</a>
          <Link to="/notes">Design notes for the client</Link>
          <Link to="/credits">Photo credits</Link>
        </div>
        <p className="imprint">Tech Leader Awards 2027. A design prototype: names, companies, scores and dates are samples.</p>
      </div>
      <div className="footname" aria-hidden="true"><p>Tech Leader Awards</p></div>
    </footer>
  )
}
