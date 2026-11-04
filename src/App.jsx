import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { withTransition } from './motion.js'
import { Header, Drawer, Toast, Search, Footer, ProtoStrip } from './ui.jsx'
import Home from './pages/Home.jsx'
import Fach from './pages/Fach.jsx'
import Product from './pages/Product.jsx'
import Checkout from './pages/Checkout.jsx'
import Done from './pages/Done.jsx'
import { Pickup, Shipping, NotFound } from './pages/Info.jsx'
import Review from './pages/Review.jsx'
import System from './pages/System.jsx'

try { const t = localStorage.getItem('kr-theme-v1'); if (t && t !== 'auto') document.documentElement.dataset.theme = t } catch { /* ignore */ }

const TITLES = [
  [/^\/$/, 'Kartenregal TCG, Pokémon-Karten aus Wetzikon'],
  [/^\/fach\//, 'Fach'],
  [/^\/p\//, 'Produkt'],
  [/^\/kasse/, 'Kasse'],
  [/^\/danke/, 'Danke'],
  [/^\/abholung/, 'Abholung in Wetzikon'],
  [/^\/versand/, 'Versand und Rückgabe'],
  [/^\/review/, 'Design review'],
  [/^\/system/, 'Components and interactions'],
]

export default function App() {
  const loc = useLocation()
  const [search, setSearch] = useState(false)
  const closeSearch = useCallback(() => setSearch(false), [])
  const nav = useNavigate()
  // Every in-app link changes page inside a view transition (where the browser has one).
  useEffect(() => {
    const click = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a[href^="#/"]')
      if (!a || a.target) return
      const to = a.getAttribute('href').slice(1)
      if (to === window.location.hash.slice(1)) return
      e.preventDefault()
      withTransition(() => nav(to))
    }
    document.addEventListener('click', click, true)
    return () => document.removeEventListener('click', click, true)
  }, [nav])
  useLayoutEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])
  useEffect(() => {
    const t = TITLES.find(([r]) => r.test(loc.pathname))
    if (t && !/^\/(fach|p)\//.test(loc.pathname)) document.title = t[1].startsWith('Kartenregal') ? t[1] : `${t[1]} | Kartenregal TCG`
    const main = document.getElementById('main')
    if (main && loc.pathname !== '/') main.focus({ preventScroll: true })
  }, [loc.pathname])
  useEffect(() => {
    const k = (e) => { if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !/input|textarea|select/i.test(e.target.tagName)) { e.preventDefault(); setSearch(true) } }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])
  return (
    <>
      <a href="#main" className="sr" onFocus={(e) => e.currentTarget.classList.remove('sr')} onBlur={(e) => e.currentTarget.classList.add('sr')} onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>Zum Inhalt</a>
      <ProtoStrip />
      <Header onSearch={() => setSearch(true)} />
      <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
        <div className="page" key={loc.pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fach/:id" element={<Fach />} />
            <Route path="/p/:id" element={<Product />} />
            <Route path="/kasse" element={<Checkout />} />
            <Route path="/danke/:no" element={<Done />} />
            <Route path="/abholung" element={<Pickup />} />
            <Route path="/versand" element={<Shipping />} />
            <Route path="/review" element={<Review />} />
            <Route path="/system" element={<System />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <Drawer />
      <Toast />
      {search && <Search onClose={closeSearch} />}
    </>
  )
}
