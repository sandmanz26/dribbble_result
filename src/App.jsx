import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Routes, Route, NavLink, Link, useLocation, useNavigationType } from 'react-router-dom'
import { MdHome, MdSearch, MdChecklist, MdAutoAwesome, MdShoppingBasket, MdTranslate, MdRefresh } from 'react-icons/md'
import { useStore } from './store.jsx'
import { BRANDS } from './data/brands.js'
import { t, num } from './i18n.js'
import { Home, Search, Category, Product, Lists, ListDetail, Assistant, Cart, Done, Member } from './screens.jsx'
import { Audit, IA, System } from './docs.jsx'

const TABS = [['/', MdHome, 'home'], ['/search', MdSearch, 'search'], ['/lists', MdChecklist, 'lists'], ['/assistant', MdAutoAwesome, 'assistant'], ['/cart', MdShoppingBasket, 'cart']]
const isTab = (p) => TABS.some(([to]) => to === p)

function Phone() {
  const { lang, dir, count, pulse } = useStore()
  const loc = useLocation()
  const type = useNavigationType()
  const prev = useRef(loc.pathname)
  const [anim, setAnim] = useState('none')
  // Push slides in from the reading end, back slides out the other way, tabs cross-fade. RTL mirrors it.
  useLayoutEffect(() => {
    const from = prev.current, to = loc.pathname
    if (from !== to) setAnim(isTab(to) && isTab(from) ? 'tab' : type === 'POP' ? 'pop' : 'push')
    prev.current = to
  }, [loc.pathname, type])
  const badge = useRef(null)
  useEffect(() => { if (pulse && badge.current) badge.current.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.45)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'cubic-bezier(.3,1.6,.5,1)' }) }, [pulse])
  const showTabs = !/^\/(p\/|done)/.test(loc.pathname)
  return (
    <div className="phone" dir={dir} lang={lang}>
      <div className="status" aria-hidden="true"><span>{num('9:41', lang)}</span><span className="notch" /><span>5G</span></div>
      <div className={`stage a-${anim}`} key={loc.pathname}>
        <Routes location={loc}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/c/:id" element={<Category />} />
          <Route path="/p/:id" element={<Product />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/lists/:id" element={<ListDetail />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/done/:no" element={<Done />} />
          <Route path="/member" element={<Member />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      {showTabs && (
        <nav className="tabs" aria-label="tabs">
          {TABS.map(([to, I, k]) => (
            <NavLink key={to} to={to} end className="tab">
              <span className="ti"><I aria-hidden="true" />{k === 'cart' && count > 0 && <b ref={badge} className="badge">{num(count, lang)}</b>}</span>
              <span>{t(k, lang)}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}

function Panel() {
  const { lang, brand, persona, latin, dispatch } = useStore()
  return (
    <aside className="panel" aria-label="Reviewer panel">
      <p className="p-kicker">Cooperative app redesign · prototype</p>
      <h1 className="p-title">One app, any co-op, Arabic and English</h1>
      <p className="p-lede">Switch the language to see the layout mirror, and switch the co-op to see the white-label tokens change while every screen stays the same.</p>
      <fieldset><legend>Language</legend>
        <div className="seg2">{[['ar', 'العربية'], ['en', 'English']].map(([k, l]) => <button key={k} aria-pressed={lang === k} onClick={() => dispatch({ type: 'set', v: { lang: k } })}>{l}</button>)}</div>
        <label className="chk"><input type="checkbox" checked={latin} onChange={(e) => dispatch({ type: 'set', v: { latin: e.target.checked } })} />Latin digits in Arabic</label>
      </fieldset>
      <fieldset><legend>Co-op (white label)</legend>
        <div className="brands">{Object.values(BRANDS).map((b) => <button key={b.id} aria-pressed={brand.id === b.id} onClick={() => dispatch({ type: 'set', v: { brand: b.id } })} style={{ '--c': b.primary }}><i />{b.name.en}</button>)}</div>
      </fieldset>
      <fieldset><legend>Member</legend>
        <div className="seg2">{[['shareholder', 'Shareholder'], ['guest', 'Not a shareholder']].map(([k, l]) => <button key={k} aria-pressed={persona === k} onClick={() => dispatch({ type: 'set', v: { persona: k } })}>{l}</button>)}</div>
      </fieldset>
      <fieldset><legend>Jump to</legend>
        <div className="jumps">
          <Link to="/search">Search, try “labne” or “halumi”</Link>
          <Link to="/lists/home">Family list sorted by aisle</Link>
          <Link to="/assistant">AI assistant, “Dinner for six”</Link>
          <Link to="/p/dates">Product page</Link>
          <Link to="/member">Shareholder card and dividend</Link>
        </div>
      </fieldset>
      <fieldset><legend>Phase 1 and the system</legend>
        <div className="jumps docs"><Link to="/audit">UX audit</Link><Link to="/ia">Information architecture and journeys</Link><Link to="/system">White-label design system</Link></div>
      </fieldset>
      <button className="reset" onClick={() => dispatch({ type: 'reset' })}><MdRefresh aria-hidden="true" />Reset demo</button>
      <p className="p-note">Sample co-ops, people and prices. Product pictures are AI-generated studio packshots. Nothing is charged.</p>
    </aside>
  )
}

export default function App() {
  const { brand, lang, dispatch } = useStore()
  const loc = useLocation()
  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty('--brand', brand.primary)
    r.style.setProperty('--on-brand', brand.onPrimary)
    r.style.setProperty('--brand-tint', brand.tint)
    r.style.setProperty('--brand-ink', brand.ink)
    document.title = `${brand.name[lang]} · ${lang === 'ar' ? 'نموذج أولي' : 'prototype'}`
  }, [brand, lang])
  if (/^\/(audit|ia|system)/.test(loc.pathname)) {
    return (
      <div className="docwrap" key={loc.pathname}>
        <nav className="docnav"><Link to="/">← Prototype</Link><Link to="/audit">Audit</Link><Link to="/ia">IA and journeys</Link><Link to="/system">Design system</Link></nav>
        <Routes><Route path="/audit" element={<Audit />} /><Route path="/ia" element={<IA />} /><Route path="/system" element={<System />} /></Routes>
      </div>
    )
  }
  return (
    <div className="desk">
      <Panel />
      <div className="phone-wrap"><Phone /></div>
      <button className="lang-fab" onClick={() => dispatch({ type: 'set', v: { lang: lang === 'ar' ? 'en' : 'ar' } })} aria-label={lang === 'ar' ? 'English' : 'العربية'}><MdTranslate aria-hidden="true" />{lang === 'ar' ? 'EN' : 'ع'}</button>
    </div>
  )
}
