import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { CiShoppingBasket, CiMenuFries, CiCircleRemove, CiCircleCheck } from 'react-icons/ci'
import { usd, can } from './data.js'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Product from './pages/Product.jsx'

export const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

const KEY = 'kumo-bag-v1'
const Ctx = createContext(null)
export const useBag = () => useContext(Ctx)
function BagProvider({ children }) {
  const [lines, setLines] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } })
  const [open, setOpen] = useState(false)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(lines)) } catch { /* private */ } }, [lines])
  const api = useMemo(() => ({
    lines, open, setOpen,
    count: lines.reduce((a, l) => a + l.qty, 0),
    total: lines.reduce((a, l) => a + l.qty * l.price, 0),
    add: (l) => { setLines((x) => { const k = `${l.id}|${l.pack}|${l.sub}`; const f = x.find((y) => y.k === k); return f ? x.map((y) => (y.k === k ? { ...y, qty: y.qty + l.qty } : y)) : [...x, { ...l, k }] }); setOpen(true) },
    remove: (k) => setLines((x) => x.filter((y) => y.k !== k)),
    clear: () => setLines([]),
  }), [lines, open])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

// Slow reveals: text fades, images open like a sliding door.
export function useReveal(deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    const els = ref.current?.querySelectorAll('[data-r]:not([data-in])') || []
    if (reduced() || !('IntersectionObserver' in window)) { els.forEach((e) => (e.dataset.in = '1')); return }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.dataset.in = '1'; io.unobserve(e.target) } }), { rootMargin: '0px 0px -12% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, deps) // eslint-disable-line
  return ref
}

// A gentle drift for big images while they pass through the screen.
export function useDrift() {
  useEffect(() => {
    if (reduced()) return
    let raf = 0
    const run = () => {
      raf = 0
      document.querySelectorAll('[data-drift]').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < 0 || r.top > innerHeight) return
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight
        el.style.setProperty('--d', `${(p * -40).toFixed(1)}px`)
      })
    }
    const ask = () => { if (!raf) raf = requestAnimationFrame(run) }
    addEventListener('scroll', ask, { passive: true }); run()
    return () => removeEventListener('scroll', ask)
  }, [])
}

function Header() {
  const bag = useBag()
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  useEffect(() => { setOpen(false); bag.setOpen(false) }, [loc.pathname]) // eslint-disable-line
  useEffect(() => { const f = () => setSolid(scrollY > 40); f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  return (
    <header className={`hdr ${solid || loc.pathname !== '/' ? 'solid' : ''}`}>
      <Link to="/" className="brand" aria-label="KUMO, home"><span className="mark" aria-hidden="true" />KUMO</Link>
      <nav className={open ? 'open' : ''} aria-label="Main">
        <NavLink to="/shop/original">Shop</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <button className="bag-btn" onClick={() => bag.setOpen(true)} aria-label={`Bag, ${bag.count} cans`}><CiShoppingBasket aria-hidden="true" /><span>{bag.count}</span></button>
      <button className="burger" onClick={() => setOpen((x) => !x)} aria-label="Menu" aria-expanded={open}><CiMenuFries /></button>
    </header>
  )
}

function Bag() {
  const bag = useBag()
  const [done, setDone] = useState(false)
  useEffect(() => { if (!bag.open) setDone(false) }, [bag.open])
  useEffect(() => {
    if (!bag.open) return
    const k = (e) => e.key === 'Escape' && bag.setOpen(false)
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [bag.open]) // eslint-disable-line
  return (
    <div className={`bag ${bag.open ? 'open' : ''}`} aria-hidden={!bag.open}>
      <div className="bag-scrim" onClick={() => bag.setOpen(false)} />
      <aside className="bag-panel" role="dialog" aria-modal="true" aria-label="Your bag" inert={bag.open ? undefined : ''}>
        <div className="bag-head"><h2>Bag</h2><button onClick={() => bag.setOpen(false)} aria-label="Close bag"><CiCircleRemove /></button></div>
        {done ? (
          <div className="bag-empty"><CiCircleCheck className="ok" aria-hidden="true" /><p>Thank you. Your cans leave the cold room tomorrow morning.</p><small>Prototype: nothing was charged.</small></div>
        ) : bag.lines.length === 0 ? (
          <div className="bag-empty"><p>Nothing here yet.</p><Link to="/shop/original" className="link" onClick={() => bag.setOpen(false)}>Choose a can</Link></div>
        ) : (
          <>
            <ul className="bag-lines">
              {bag.lines.map((l) => (
                <li key={l.k}>
                  <img src={`img/${can(l.id).img}.webp`} alt="" />
                  <span><b>{can(l.id).name}</b><small>{l.pack} cans{l.sub ? ', every month' : ''} × {l.qty}</small></span>
                  <em>{usd(l.price * l.qty)}</em>
                  <button onClick={() => bag.remove(l.k)} aria-label="Remove">Remove</button>
                </li>
              ))}
            </ul>
            <div className="bag-foot">
              <p><span>Subtotal</span><b>{usd(bag.total)}</b></p>
              <small>Shipped cold in a recyclable box. Free over $45.</small>
              <button className="btn" onClick={() => { bag.clear(); setDone(true) }}>Check out</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

function Footer() {
  return (
    <footer className="foot">
      <div className="foot-grid">
        <p className="foot-jp" lang="ja" aria-hidden="true">雲</p>
        <div><b>KUMO</b><p>A quiet can of matcha.</p></div>
        <div><Link to="/shop/original">Shop</Link><Link to="/about">About</Link></div>
        <p className="small">Concept website. Brand, sourcing details, nutrition and prices are samples for illustration. Photographs are AI-generated.</p>
      </div>
    </footer>
  )
}

export default function App() {
  const loc = useLocation()
  useEffect(() => {
    scrollTo(0, 0)
    document.title = loc.pathname.startsWith('/shop') ? 'Shop · KUMO' : loc.pathname === '/about' ? 'About · KUMO' : 'KUMO, a quiet can of matcha'
  }, [loc.pathname])
  return (
    <BagProvider>
      <Header />
      <main className="page" key={loc.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop/:id" element={<Product />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <Bag />
    </BagProvider>
  )
}
