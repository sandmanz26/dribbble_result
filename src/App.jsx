import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { ImMenu, ImCross, ImCheckmark, ImLocation, ImInstagram } from 'react-icons/im'
import { CAFE, isOpen } from './data.js'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import About from './pages/About.jsx'

// A tiny pick-up order kept in memory, so the menu feels like a real counter.
const Ctx = createContext(null)
export const useOrder = () => useContext(Ctx)
function OrderProvider({ children }) {
  const [lines, setLines] = useState([])
  const [toast, setToast] = useState(null)
  const say = (t) => { setToast(t); clearTimeout(say.t); say.t = setTimeout(() => setToast(null), 2600) }
  const api = useMemo(() => ({
    lines, toast, say,
    count: lines.reduce((a, l) => a + l.qty, 0),
    total: lines.reduce((a, l) => a + l.qty * l.price, 0),
    add: (l) => { setLines((x) => [...x, { ...l, qty: 1, key: Math.random().toString(36).slice(2) }]); say(`${l.name} added. We start whisking when you arrive.`) },
    clear: () => setLines([]),
  }), [lines, toast])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

// Sections carry data-bg; the page takes the colour of the one in view, like pouring a new drink.
export function useSectionColours(deps = []) {
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-bg]')]
    if (!els.length) return
    document.body.style.setProperty('--page', els[0].dataset.bg)
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) document.body.style.setProperty('--page', e.target.dataset.bg) })
    }, { rootMargin: '-45% 0px -45% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, deps) // eslint-disable-line
}

// Things that pop in when they reach the screen.
export function useReveal(deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    const els = ref.current?.querySelectorAll('[data-r]:not([data-in])') || []
    if (reduced() || !('IntersectionObserver' in window)) { els.forEach((e) => (e.dataset.in = '1')); return }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.dataset.in = '1'; io.unobserve(e.target) } }), { rootMargin: '0px 0px -10% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, deps) // eslint-disable-line
  return ref
}

export function Logo() {
  return <span className="logo" aria-hidden="true">fuwa<i /></span>
}

function Header() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const o = useOrder()
  const st = isOpen()
  useEffect(() => setOpen(false), [loc.pathname])
  return (
    <header className="hdr">
      <Link to="/" className="brand" aria-label="Fuwa Matcha Club, home"><Logo /></Link>
      <nav className={open ? 'open' : ''} aria-label="Main">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/about">About us</NavLink>
        <a href="#/#visit">Visit</a>
      </nav>
      <span className={`open-now ${st.open ? 'on' : ''}`}><i />{st.open ? `Open till ${st.until > 12 ? st.until - 12 : st.until} pm` : `Opens ${st.from} am`}</span>
      <Link to="/menu" className="btn sm">{o.count ? `Order (${o.count})` : 'Order ahead'}</Link>
      <button className="burger" onClick={() => setOpen((x) => !x)} aria-expanded={open} aria-label="Menu">{open ? <ImCross /> : <ImMenu />}</button>
    </header>
  )
}

function Footer() {
  return (
    <footer className="foot" data-bg="#1f3b1c">
      <div className="foot-big" aria-hidden="true">{'fuwa'.split('').map((c, i) => <span key={i} style={{ '--i': i }}>{c}</span>)}</div>
      <div className="foot-row">
        <p><b>Fuwa Matcha Club</b><br />{CAFE.street}, {CAFE.suburb}</p>
        <p>Mon to Fri 7 am to 5 pm<br />Sat and Sun 8 am to 5 pm</p>
        <p><a href="#/menu">Menu</a><br /><a href="#/about">About us</a></p>
        <p className="small">Concept website. Brand, address, prices and sourcing details are samples. Photos are AI-generated.<br /><ImInstagram aria-hidden="true" /> fuwa.club (sample)</p>
      </div>
    </footer>
  )
}

function Toast() {
  const { toast } = useOrder()
  return <div className={`toast ${toast ? 'on' : ''}`} role="status" aria-live="polite">{toast && <><ImCheckmark aria-hidden="true" />{toast}</>}</div>
}

function Routed() {
  const loc = useLocation()
  useEffect(() => {
    if (loc.hash && loc.hash.includes('#')) return
    scrollTo(0, 0)
    document.title = loc.pathname === '/menu' ? 'Menu · Fuwa Matcha Club' : loc.pathname === '/about' ? 'About us · Fuwa Matcha Club' : 'Fuwa Matcha Club, matcha made fluffy'
  }, [loc.pathname])
  // "#/#visit" style links: scroll to the section after the page is in.
  useEffect(() => {
    const m = window.location.hash.match(/#\/#(\w+)/)
    if (m) setTimeout(() => document.getElementById(m[1])?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' }), 120)
  }, [loc])
  return (
    <main className="page" key={loc.pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </main>
  )
}

export default function App() {
  return (
    <OrderProvider>
      <Header />
      <Routed />
      <Footer />
      <Toast />
    </OrderProvider>
  )
}
