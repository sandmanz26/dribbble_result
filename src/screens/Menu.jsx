import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { CATS, money, SHOP, itemOf } from '../data/menu.js'
import { Toast, useToast, day, photoSrc } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

// The menu is one long page in four sections. The tabs jump between them and follow the scroll.
// Today's picks rotate at the top; every dish is a real photo.
export default function Menu({ scroller }) {
  const { menu, s, online, dispatch, count } = useStore()
  const loc = useLocation()
  const nav = useNavigate()
  const [cat, setCat] = useState(CATS[0].id)
  const [checking, setChecking] = useState(() => { try { return !sessionStorage.getItem('ff-checked') } catch { return false } })
  const [toast, show] = useToast()
  const [bump, setBump] = useState(0)
  const seenV = useRef(s.live.v)
  const sections = useRef({})
  const tabsRef = useRef(null)

  useEffect(() => {
    if (!checking) return
    const t = setTimeout(() => { setChecking(false); try { sessionStorage.setItem('ff-checked', '1') } catch { /* private mode */ } }, online ? 900 : 0)
    return () => clearTimeout(t)
  }, [checking, online])

  useEffect(() => {
    const a = loc.state?.added
    if (a) { show(<span>{a.qty} × {a.name} in your bag</span>, { action: <Link to="/bag" className="toast-link">View bag</Link> }); setBump((b) => b + 1); nav('.', { replace: true, state: null }) }
  }, [loc.state]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (s.live.v !== seenV.current) { show(<span>Menu updated to version {s.live.v}</span>); seenV.current = s.live.v } }, [s.live.v]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const on = () => {
      const top = (tabsRef.current?.getBoundingClientRect().bottom || 0) + 24
      let cur = CATS[0].id
      for (const c of CATS) { const r = sections.current[c.id]?.getBoundingClientRect(); if (r && r.top <= top) cur = c.id }
      setCat(cur)
    }
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [scroller])
  useEffect(() => { tabsRef.current?.querySelector(`[data-cat="${cat}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }) }, [cat])

  const jump = (id) => {
    const el = sections.current[id]; const sc = scroller.current
    if (!el || !sc) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    sc.scrollTo({ top: el.offsetTop - (tabsRef.current?.offsetHeight || 0) - 4, behavior: reduce ? 'auto' : 'smooth' })
  }
  const quickAdd = (it) => {
    dispatch({ type: 'add', line: { id: it.id, qty: 1, heat: it.heat ? 'medium' : null, dips: ['garlic'], side: 'none' } })
    setBump((b) => b + 1)
    show(<span>{it.name} in your bag{it.heat ? ', medium' : ''}</span>, { action: <Link to="/bag" className="toast-link">View bag</Link> })
  }

  const special = menu.find((i) => i.id === s.live.special) || itemOf('half')
  const picks = [special, ...['bucket-8', 'satay-platter'].map((id) => menu.find((i) => i.id === id)).filter((x) => x && x.id !== special.id)].slice(0, 3)
  const hour = new Date().getHours()

  return (
    <div className="menu">
      <header className="menu-top">
        <button className="where" onClick={() => nav('/bag')}>
          <span className="where-k">{s.mode === 'pickup' ? 'Pickup from' : 'Deliver to'}</span>
          <span className="where-v">{s.mode === 'pickup' ? `${SHOP.name}, ${SHOP.branch}` : '14 Palm Avenue'} <I.Right size={14} /></span>
        </button>
        <Link to="/bag" className="bag-btn" aria-label={`Bag, ${count} items`}><I.Bag size={22} />{count > 0 && <b key={bump}>{count}</b>}</Link>
      </header>

      <h1 className="menu-title">{hour >= 17 ? 'Tonight' : hour >= 11 ? 'Lunch' : 'Today'} at Flock &amp; Flame</h1>
      <p className={`sync ${online ? '' : 'is-off'}`} role="status">
        {checking ? <><I.Refresh size={14} className="spin" /> Checking for a newer menu</>
          : online ? <><span className="live-dot" /> Open until {SHOP.closes} · menu v{s.live.v}</>
            : <><I.Offline size={14} /> Offline · menu v{s.live.v} saved {day(s.live.at)}</>}
      </p>

      {checking ? <div className="hero skel" aria-hidden="true" /> : <Picks picks={picks} onAdd={quickAdd} />}

      <div className="cat-tabs" ref={tabsRef} role="tablist" aria-label="Menu sections">
        {CATS.map((c) => (
          <button key={c.id} data-cat={c.id} role="tab" aria-selected={cat === c.id} className="cat-tab" onClick={() => jump(c.id)}>
            <img src={photoSrc(c.cover)} alt="" />{c.name}
          </button>
        ))}
      </div>

      {CATS.map((c) => {
        const items = menu.filter((i) => i.cat === c.id)
        return (
          <section key={c.id} className="board" ref={(el) => (sections.current[c.id] = el)} aria-labelledby={`h-${c.id}`}>
            <div className="board-head">
              <h2 id={`h-${c.id}`}>{c.long}</h2>
              <p>{c.line}</p>
            </div>
            <ul className="grid2">
              {checking ? [0, 1, 2, 3].map((k) => <li key={k} className="card-dish is-skel"><span className="skel ph" /><span className="skel ln" /><span className="skel ln short" /></li>)
                : items.map((it, k) => (
                  <li key={it.id} className="card-dish" style={{ '--i': k }}>
                    <Link to={`/item/${it.id}`} className="dish-link" aria-label={`${it.name}, ${money(it.price)}${it.soldOut ? ', sold out today' : ''}`}>
                      <span className={`ph ${it.soldOut ? 'is-out' : ''}`}><img src={photoSrc(it.photo)} alt="" loading="lazy" decoding="async" />{it.soldOut && <em>Sold out today</em>}</span>
                      <b>{it.name}</b>
                      <span className="dish-desc">{it.desc}</span>
                      <span className="dish-price">{money(it.price)}</span>
                    </Link>
                    {!it.soldOut && <span className="ph-over"><button className="quick" aria-label={`Add ${it.name}`} onClick={() => quickAdd(it)}><I.Add size={18} /></button></span>}
                  </li>
                ))}
            </ul>
          </section>
        )
      })}
      <p className="menu-foot">Prices include tax. Every dish is made in one kitchen with nuts, sesame, egg and gluten; ask the counter about allergens. <Link to="/credits">Photo credits</Link></p>
      <Toast toast={toast} />
    </div>
  )
}

// Today's picks: a swipeable row of full photos, the special first. Advances by itself every 6 s.
function Picks({ picks, onAdd }) {
  const ref = useRef(null)
  const [i, setI] = useState(0)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const t = setInterval(() => setI((x) => { const n = (x + 1) % picks.length; ref.current?.scrollTo({ left: n * ref.current.clientWidth, behavior: 'smooth' }); return n }), 6000)
    return () => clearInterval(t)
  }, [picks.length])
  const onScroll = () => { const el = ref.current; if (el) setI(Math.round(el.scrollLeft / el.clientWidth)) }
  return (
    <div className="picks">
      <div className="picks-row" ref={ref} onScroll={onScroll}>
        {picks.map((it, k) => (
          <article key={it.id} className="hero" aria-label={it.name}>
            <img src={photoSrc(it.photo)} alt="" />
            <Link to={`/item/${it.id}`} className="hero-text">
              <span className="hero-tag">{k === 0 ? 'Today’s special' : 'Popular tonight'}</span>
              <span className="hero-name">{it.name}</span>
              <span className="hero-price">{money(it.price)}</span>
            </Link>
            <button className="hero-add" onClick={() => onAdd(it)} aria-label={`Add ${it.name}`}><I.Add size={22} /></button>
          </article>
        ))}
      </div>
      <div className="dots" aria-hidden="true">{picks.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>
    </div>
  )
}
