import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import UilSun from '@iconscout/react-unicons/icons/uil-sun'
import UilEnvelopeReceive from '@iconscout/react-unicons/icons/uil-envelope-receive'
import UilColumns from '@iconscout/react-unicons/icons/uil-columns'
import UilCalendarAlt from '@iconscout/react-unicons/icons/uil-calendar-alt'
import UilWallet from '@iconscout/react-unicons/icons/uil-wallet'
import UilStore from '@iconscout/react-unicons/icons/uil-store'
import UilPresentation from '@iconscout/react-unicons/icons/uil-presentation'
import UilSearch from '@iconscout/react-unicons/icons/uil-search'
import UilAngleDown from '@iconscout/react-unicons/icons/uil-angle-down'
import UilApps from '@iconscout/react-unicons/icons/uil-apps'
import UilRedo from '@iconscout/react-unicons/icons/uil-redo'
import UilWhatsapp from '@iconscout/react-unicons/icons/uil-whatsapp'
import { useStore } from './store.jsx'
import { CREATOR, ROSTER, OFFERS, BRANDS } from './data/studio.js'
import { Mark, Mono } from './ui.jsx'
import Today from './pages/Today.jsx'
import Offers from './pages/Offers.jsx'
import Deals from './pages/Deals.jsx'
import Deal from './pages/Deal.jsx'
import Calendar from './pages/Calendar.jsx'
import Money from './pages/Money.jsx'
import Brands from './pages/Brands.jsx'
import Kit from './pages/Kit.jsx'
import Credits from './pages/Credits.jsx'

const NAV = [
  ['/', 'Today', UilSun], ['/offers', 'Offers', UilEnvelopeReceive], ['/deals', 'Deals', UilColumns], ['/calendar', 'Calendar', UilCalendarAlt],
  ['/money', 'Money', UilWallet], ['/brands', 'Brands', UilStore], ['/kit', 'Media kit', UilPresentation],
]

export default function App() {
  const { s, dispatch, deals } = useStore()
  const loc = useLocation()
  const [pal, setPal] = useState(false)
  const [more, setMore] = useState(false)
  const [who, setWho] = useState(false)
  useEffect(() => { window.scrollTo(0, 0); setMore(false); setWho(false) }, [loc.pathname])
  useEffect(() => {
    const on = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal(true) } if (e.key === 'Escape') { setPal(false); setWho(false); setMore(false) } }
    window.addEventListener('keydown', on); return () => window.removeEventListener('keydown', on)
  }, [])
  const newOffers = OFFERS.filter((o) => !s.offers[o.id]).length
  return (
    <div className="shell">
      <aside className="side" aria-label="Riuh Studio">
        <Link to="/" className="brand"><Mark /><span>Riuh Studio<small>by Riuh Talent</small></span></Link>
        <nav className="nav" aria-label="Main">
          {NAV.slice(0, 5).map(([to, label, I]) => (
            <NavLink key={to} to={to} end={to === '/'}><I size={18} />{label}{to === '/offers' && newOffers > 0 && <span className="count" aria-label={`${newOffers} offers to answer`}>{newOffers}</span>}</NavLink>
          ))}
          <p className="nav-group">Relationships</p>
          {NAV.slice(5).map(([to, label, I]) => <NavLink key={to} to={to}><I size={18} />{label}</NavLink>)}
        </nav>
        <div className="side-foot">
          <div className="row"><Mono name={CREATOR.manager} hue={200} size={30} /><div><b>{CREATOR.manager}</b><p>Your manager at Riuh</p></div></div>
          <p style={{ marginTop: 8 }}>Replies within the hour on weekdays. <a className="link" href="#/" onClick={(e) => { e.preventDefault(); dispatch({ type: 'toast', text: 'Message to Bima opens here in the real app' }) }}>Message Bima</a></p>
        </div>
      </aside>

      <header className="top">
        <Link to="/" className="brand-m" aria-label="Riuh Studio, Today"><Mark size={26} />Riuh Studio</Link>
        <button className="search" onClick={() => setPal(true)} aria-label="Search deals, brands and offers"><UilSearch size={16} /><span>Search deals, brands, offers</span><kbd>Ctrl K</kbd></button>
        <div className="top-right">
          <button className="switcher" onClick={() => setWho((v) => !v)} aria-expanded={who} aria-haspopup="menu">
            <Mono name={CREATOR.name} hue={CREATOR.hue} size={34} />
            <span className="who"><b>{CREATOR.name}</b><span className="h">{CREATOR.handle} · Food</span></span>
            <UilAngleDown size={18} />
          </button>
          {who && (
            <div className="menu" role="menu" style={{ top: 58, right: 20 }}>
              <p className="small muted" style={{ padding: '6px 10px' }}>Riuh Talent roster</p>
              {ROSTER.map((r) => (
                <button key={r.handle} role="menuitem" onClick={() => { setWho(false); if (!r.me) dispatch({ type: 'toast', text: `${r.name}'s studio is not part of this prototype` }) }}>
                  <Mono name={r.name} hue={r.hue} size={28} /><span><b style={{ fontWeight: 500 }}>{r.name}</b><span className="small muted" style={{ display: 'block' }}>{r.handle} · {r.niche}</span></span>{r.me && <span className="pill acc" style={{ marginLeft: 'auto' }}>You</span>}
                </button>
              ))}
              <button role="menuitem" onClick={() => { setWho(false); dispatch({ type: 'reset' }) }}><UilRedo size={16} />Reset the demo</button>
            </div>
          )}
        </div>
      </header>

      <main className="canvas" id="main">
        <div className="wrap">
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/offers/:id" element={<Offers />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/deals/:id" element={<Deal />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/money" element={<Money />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/kit" element={<Kit />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="*" element={<Today />} />
          </Routes>
        </div>
      </main>

      <nav className="tabbar" aria-label="Main">
        {NAV.slice(0, 4).map(([to, label, I]) => <NavLink key={to} to={to} end={to === '/'}><I size={22} />{label}{to === '/offers' && newOffers > 0 ? ` ${newOffers}` : ''}</NavLink>)}
        <button onClick={() => setMore(true)} aria-expanded={more}><UilApps size={22} />More</button>
      </nav>
      {more && (
        <div className="scrim" onClick={() => setMore(false)} style={{ placeItems: 'end stretch', padding: 0 }}>
          <div className="palette" style={{ width: '100%', borderRadius: '16px 16px 0 0', padding: 8 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="More screens">
            <ul>{NAV.slice(4).map(([to, label, I]) => <li key={to}><Link to={to}><I size={20} />{label}</Link></li>)}<li><Link to="/credits"><UilWhatsapp size={20} />Photo credits</Link></li></ul>
          </div>
        </div>
      )}
      {pal && <Palette deals={deals} onClose={() => setPal(false)} />}
      {s.toast && <p className="toast" role="status">{s.toast}</p>}
    </div>
  )
}

// Ctrl K: jump to any deal, brand, offer or screen.
function Palette({ deals, onClose }) {
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const nav = useNavigate()
  const input = useRef(null)
  useEffect(() => { input.current?.focus() }, [])
  const items = useMemo(() => {
    const all = [
      ...NAV.map(([to, label]) => ({ to, label, k: 'Screen' })),
      ...deals.map((d) => ({ to: `/deals/${d.id}`, label: `${BRANDS[d.brand].name}: ${d.title}`, k: d.id })),
      ...OFFERS.map((o) => ({ to: `/offers/${o.id}`, label: `Offer from ${o.brand}`, k: o.channel })),
      ...Object.entries(BRANDS).map(([key, b]) => ({ to: `/brands?b=${key}`, label: b.name, k: b.category })),
    ]
    const t = q.trim().toLowerCase()
    return (t ? all.filter((x) => x.label.toLowerCase().includes(t) || x.k.toLowerCase().includes(t)) : all.slice(0, 8)).slice(0, 9)
  }, [q, deals])
  const go = (x) => { onClose(); nav(x.to) }
  return (
    <div className="scrim" onClick={onClose}>
      <div className="palette" role="dialog" aria-label="Search" onClick={(e) => e.stopPropagation()}>
        <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setI(0) }} placeholder="Search deals, brands, offers" aria-label="Search"
          onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setI((v) => Math.min(items.length - 1, v + 1)) } if (e.key === 'ArrowUp') { e.preventDefault(); setI((v) => Math.max(0, v - 1)) } if (e.key === 'Enter' && items[i]) go(items[i]) }} />
        <ul role="listbox">
          {items.map((x, n) => <li key={x.to + x.label} className={n === i ? 'sel' : ''} role="option" aria-selected={n === i}><a href={`#${x.to}`} onClick={(e) => { e.preventDefault(); go(x) }}>{x.label}<span className="k">{x.k}</span></a></li>)}
          {!items.length && <li className="muted" style={{ padding: 14 }}>Nothing matches “{q}”.</li>}
        </ul>
      </div>
    </div>
  )
}
