import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { SlMenu, SlClose, SlCheck, SlSocialInstagram } from 'react-icons/sl'
import { CAFE, isOpen } from './data.js'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import About from './pages/About.jsx'

// A small pick-up order kept in memory, so the menu works like a counter.
const Ctx = createContext(null)
export const useOrder = () => useContext(Ctx)
function OrderProvider({ children }) {
  const [lines, setLines] = useState([])
  const [toast, setToast] = useState(null)
  const say = (t) => { setToast(t); clearTimeout(say.t); say.t = setTimeout(() => setToast(null), 2800) }
  const api = useMemo(() => ({
    lines, toast, say,
    count: lines.reduce((a, l) => a + l.qty, 0),
    total: lines.reduce((a, l) => a + l.qty * l.price, 0),
    add: (l) => { setLines((x) => [...x, { ...l, qty: 1 }]); say(`${l.name} added. We whisk it when you arrive.`) },
    clear: () => setLines([]),
  }), [lines, toast])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

// One scroll loop for every soft effect on the page.
const subs = new Set(); let raf = 0
const tick = () => { raf = 0; subs.forEach((f) => f()) }
if (typeof window !== 'undefined') { addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick) }, { passive: true }); addEventListener('resize', tick) }
export function useScroll(fn) {
  const f = useRef(fn); f.current = fn
  useEffect(() => { const run = () => f.current(); subs.add(run); run(); return () => subs.delete(run) }, [])
}

// Things float up softly when they reach the screen.
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

// A few foam bubbles that drift upward, used around bowls and in the footer.
export function Bubbles({ n = 9 }) {
  return <span className="bubbles" aria-hidden="true">{Array.from({ length: n }).map((_, i) => <i key={i} style={{ '--i': i, '--x': `${(i * 37) % 100}%`, '--s': `${8 + ((i * 13) % 22)}px` }} />)}</span>
}

function Header() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const o = useOrder()
  const st = isOpen()
  useEffect(() => setOpen(false), [loc.pathname])
  return (
    <header className="hdr">
      <Link to="/" className="brand" aria-label="Fuwa Matcha Club, home">fuwa<span>matcha club</span></Link>
      <nav className={open ? 'open' : ''} aria-label="Main">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/about">About us</NavLink>
      </nav>
      <span className={`status ${st.open ? 'on' : ''}`}><i />{st.open ? `Whisking until ${st.until - 12} pm` : `Back at ${st.from} am`}</span>
      <Link to="/menu" className="btn sm">{o.count ? `Your order (${o.count})` : 'Order ahead'}</Link>
      <button className="burger" onClick={() => setOpen((x) => !x)} aria-expanded={open} aria-label="Menu">{open ? <SlClose /> : <SlMenu />}</button>
    </header>
  )
}

function Footer() {
  return (
    <footer className="foot">
      <div className="foot-word" aria-hidden="true">fuwa<Bubbles n={12} /></div>
      <div className="foot-row">
        <p><b>Fuwa Matcha Club</b><br />{CAFE.street}<br />{CAFE.suburb}</p>
        <p>Weekdays 7 am to 5 pm<br />Weekends 8 am to 5 pm<br />Quiet hour 8 to 9 daily</p>
        <p><Link to="/menu">Menu</Link><br /><Link to="/about">About us</Link><br /><span><SlSocialInstagram aria-hidden="true" /> fuwa.club (sample)</span></p>
        <p className="small">Concept website. Brand, address, prices and sourcing details are samples. Photographs are AI-generated.</p>
      </div>
    </footer>
  )
}

function Toast() {
  const { toast } = useOrder()
  return <div className={`toast ${toast ? 'on' : ''}`} role="status" aria-live="polite">{toast && <><SlCheck aria-hidden="true" />{toast}</>}</div>
}

function Routed() {
  const loc = useLocation()
  useEffect(() => {
    scrollTo(0, 0)
    document.title = loc.pathname === '/menu' ? 'Menu · Fuwa Matcha Club' : loc.pathname === '/about' ? 'About us · Fuwa Matcha Club' : 'Fuwa Matcha Club, whisked until fluffy'
  }, [loc.pathname])
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
