import { useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineShopping, AiOutlineClose, AiOutlineMinus, AiOutlinePlus, AiOutlineDelete, AiOutlineArrowRight } from 'react-icons/ai'
import { useCart } from './store.jsx'
import { usd, GRINDS } from './data.js'
import { transition } from './motion.js'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Product from './pages/Product.jsx'
import Checkout from './pages/Checkout.jsx'
import Done from './pages/Done.jsx'

export const FREE_SHIP = 45

// A link that changes page inside a view transition.
export function Go({ to, children, vt, className, onClick, ...rest }) {
  const nav = useNavigate()
  return (
    <a href={`#${to}`} className={className} {...rest}
      onClick={(e) => { onClick?.(e); if (e.defaultPrevented || e.metaKey || e.ctrlKey) return; e.preventDefault(); transition(nav, to, vt) }}>
      {children}
    </a>
  )
}

export function Wordmark() {
  return <span className="wordmark" aria-hidden="true">Ripe<i /></span>
}

function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}

function Header() {
  const cart = useCart()
  const loc = useLocation()
  const nav = useNavigate()
  const jump = (id) => (e) => {
    e.preventDefault()
    if (loc.pathname === '/') scrollToId(id)
    else { transition(nav, '/'); setTimeout(() => scrollToId(id), 450) }
  }
  return (
    <header className="hdr">
      <Go to="/" className="brand" aria-label="Ripe Coffee Co., home"><Wordmark /></Go>
      <nav className="nav" aria-label="Main">
        <Go to="/shop">Shop</Go>
        <a href="#brew" onClick={jump('brew')}>Brew match</a>
        <a href="#subscribe" onClick={jump('subscribe')}>Subscribe</a>
        <a href="#origins" onClick={jump('origins')}>Origins</a>
      </nav>
      <button className="cart-btn" onClick={() => cart.setOpen(true)} aria-label={`Bag, ${cart.count} items`}>
        <AiOutlineShopping aria-hidden="true" />
        <span>Bag</span>
        <b key={cart.bump} className={cart.count ? 'on' : ''}>{cart.count}</b>
      </button>
    </header>
  )
}

function Drawer() {
  const cart = useCart()
  const nav = useNavigate()
  useEffect(() => {
    if (!cart.open) return
    const k = (e) => e.key === 'Escape' && cart.setOpen(false)
    addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [cart.open]) // eslint-disable-line
  const left = Math.max(0, FREE_SHIP - cart.sub)
  const free = cart.hasSub || left === 0
  return (
    <div className={`drawer-wrap ${cart.open ? 'open' : ''}`} aria-hidden={!cart.open}>
      <div className="scrim" onClick={() => cart.setOpen(false)} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Your bag" inert={cart.open ? undefined : ''}>
        <div className="dr-head">
          <h2>Your bag</h2>
          <button className="icon" onClick={() => cart.setOpen(false)} aria-label="Close bag"><AiOutlineClose /></button>
        </div>
        {cart.lines.length === 0 ? (
          <div className="dr-empty">
            <img src="img/bean.webp" alt="" width="120" height="124" />
            <p>Nothing in here yet. Six coffees are waiting for Tuesday.</p>
            <button className="btn" onClick={() => { cart.setOpen(false); transition(nav, '/shop') }}>Shop the coffees<AiOutlineArrowRight aria-hidden="true" /></button>
          </div>
        ) : (
          <>
            <div className="ship-meter" role="status">
              <p>{free ? 'Delivery is free on this order.' : <>Add <b>{usd(left)}</b> for free delivery.</>}</p>
              <i><span style={{ width: `${free ? 100 : Math.min(100, (cart.sub / FREE_SHIP) * 100)}%` }} /></i>
            </div>
            <ul className="dr-lines">
              {cart.lines.map((l) => (
                <li key={l.key} style={{ '--c': l.c.colour }}>
                  <div className="dl-pic"><img src={`img/${l.c.img}.webp`} alt="" /></div>
                  <div className="dl-body">
                    <b>{l.c.name}</b>
                    <span>{l.size === 1000 ? '1 kg' : '250 g'}, {GRINDS.find((g) => g.id === l.grind)?.name.toLowerCase()}</span>
                    {l.sub && <span className="dl-sub">Every {l.sub} weeks, 10% off</span>}
                    <div className="dl-row">
                      <div className="stepper sm">
                        <button onClick={() => cart.qty(l.key, -1)} aria-label={`One less ${l.c.name}`}><AiOutlineMinus /></button>
                        <output>{l.qty}</output>
                        <button onClick={() => cart.qty(l.key, 1)} aria-label={`One more ${l.c.name}`}><AiOutlinePlus /></button>
                      </div>
                      <b>{usd(l.total)}</b>
                      <button className="icon sm" onClick={() => cart.remove(l.key)} aria-label={`Remove ${l.c.name}`}><AiOutlineDelete /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="dr-foot">
              <div className="dr-sum"><span>Subtotal</span><b>{usd(cart.sub)}</b></div>
              <button className="btn wide" onClick={() => { cart.setOpen(false); transition(nav, '/checkout') }}>Check out<AiOutlineArrowRight aria-hidden="true" /></button>
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
      <div className="foot-big" aria-hidden="true">
        {'Ripe'.split('').map((c, i) => <span key={i} style={{ '--i': i }}>{c}</span>)}
        <img src="img/cherry.webp" alt="" className="foot-cherry" />
      </div>
      <div className="foot-row">
        <div><b>Ripe Coffee Co.</b><span>Small-lot coffee, roasted every Tuesday.</span></div>
        <div><Link to="/shop">Shop</Link><a href="#/">Brew match</a><a href="#/">Subscribe</a></div>
        <div><span>Prototype. Nothing is charged or sent.</span><span>Brand, coffees and prices are samples. Images and the 3D bag are AI-generated.</span></div>
      </div>
    </footer>
  )
}

export default function App() {
  const loc = useLocation()
  useEffect(() => {
    const t = { '/': 'Ripe Coffee Co., coffee is a fruit', '/shop': 'Shop · Ripe Coffee Co.', '/checkout': 'Check out · Ripe Coffee Co.' }
    document.title = t[loc.pathname] || (loc.pathname.startsWith('/coffee') ? 'Coffee · Ripe Coffee Co.' : 'Ripe Coffee Co.')
  }, [loc.pathname])
  return (
    <>
      <Header />
      <main className="page" key={loc.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/coffee/:id" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:no" element={<Done />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <Drawer />
    </>
  )
}
