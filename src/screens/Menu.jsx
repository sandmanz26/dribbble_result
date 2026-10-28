import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { CATS, money, SHOP, itemOf } from '../data/menu.js'
import Food from '../ui/Food.jsx'
import { Tile, Toast, useToast, day } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

// The menu is one long board with four coloured sections; the tabs jump between them and follow
// the scroll, so the reader always knows which board they are standing in front of.
export default function Menu({ scroller }) {
  const { menu, s, online, dispatch, count } = useStore()
  const loc = useLocation()
  const nav = useNavigate()
  const [cat, setCat] = useState(CATS[0].id)
  const [checking, setChecking] = useState(() => !sessionStorage.getItem('ff-checked'))
  const [toast, show] = useToast()
  const seenV = useRef(s.live.v)
  const sections = useRef({})
  const tabsRef = useRef(null)

  // First open in a session: check for a newer menu (instant when there is no signal).
  useEffect(() => {
    if (!checking) return
    const t = setTimeout(() => { setChecking(false); try { sessionStorage.setItem('ff-checked', '1') } catch { /* private mode */ } }, online ? 900 : 0)
    return () => clearTimeout(t)
  }, [checking, online])

  useEffect(() => {
    const a = loc.state?.added
    if (a) {
      show(<span>{a.qty} × {a.name} in your bag</span>, { action: <Link to="/bag" className="toast-link">View bag</Link> })
      nav('.', { replace: true, state: null })
    }
  }, [loc.state]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (s.live.v !== seenV.current) { show(<span>Menu updated to version {s.live.v}</span>); seenV.current = s.live.v }
  }, [s.live.v]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll spy: the section whose header passed under the sticky tabs is the active tab.
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

  useEffect(() => {
    tabsRef.current?.querySelector(`[data-cat="${cat}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [cat])

  const jump = (id) => {
    const el = sections.current[id]; const sc = scroller.current
    if (!el || !sc) return
    const off = (tabsRef.current?.offsetHeight || 0) + 8
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    sc.scrollTo({ top: el.offsetTop - off, behavior: reduce ? 'auto' : 'smooth' })
  }

  const special = menu.find((i) => i.id === s.live.special) || itemOf('half')
  const sc = CATS.find((c) => c.id === special.cat)
  const hour = new Date().getHours()

  return (
    <div className="menu">
      <header className="menu-top">
        <div className="brand"><span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>Flock &amp; Flame</div>
        <button className="where" onClick={() => nav('/bag')}>
          <I.Store size={16} /> {SHOP.branch} · {s.mode === 'pickup' ? 'Pickup' : 'Delivery'}
        </button>
      </header>

      <p className={`sync ${checking ? 'is-checking' : ''} ${online ? '' : 'is-off'}`} role="status">
        {checking ? <><I.Refresh size={15} className="spin" /> Checking for a newer menu</>
          : online ? <><I.CheckCircle size={15} /> Menu version {s.live.v}, up to date</>
            : <><I.Offline size={15} /> Menu version {s.live.v}, saved {day(s.live.at)}</>}
      </p>

      <h1 className="menu-title">{hour >= 17 ? 'Evening' : hour >= 12 ? 'Afternoon' : 'Morning'}, {s.name}.<br /><span>The grill is lit.</span></h1>

      {checking ? <SpecialSkeleton /> : (
        <Link to={`/item/${special.id}`} className="special" style={{ '--field': sc.field, '--ink': sc.ink }}>
          <span className="special-tag"><I.Star size={14} /> Today&apos;s special</span>
          <span className="special-name">{special.name}</span>
          <span className="special-desc">{special.desc}</span>
          <span className="special-price">{money(special.price)}<I.Right size={18} /></span>
          <Food art={special.art} heat={2} className="special-art" />
        </Link>
      )}

      <div className="cat-tabs" ref={tabsRef} role="tablist" aria-label="Menu sections">
        {CATS.map((c) => {
          return (
            <button key={c.id} data-cat={c.id} role="tab" aria-selected={cat === c.id} className="cat-tab" style={{ '--field': c.field, '--ink': c.ink }} onClick={() => jump(c.id)}>
              <span className="cat-dot" aria-hidden="true" />{c.name}
            </button>
          )
        })}
      </div>

      {CATS.map((c) => {
        const items = menu.filter((i) => i.cat === c.id)
        const hero = items.find((i) => !i.soldOut) || items[0]
        return (
          <section key={c.id} className="board" ref={(el) => (sections.current[c.id] = el)} aria-labelledby={`h-${c.id}`}>
            <div className="board-head" style={{ '--field': c.field, '--ink': c.ink }}>
              <h2 id={`h-${c.id}`}>{c.name}</h2>
              <p>{c.line}</p>
              <Food art={hero.art} className="board-art" />
            </div>
            <ul className="rows">
              {checking ? [0, 1, 2].map((k) => <li key={k} className="row is-skel"><span className="tile tile-md skel" /><span className="skel-lines"><i /><i /><i /></span></li>)
                : items.map((it) => (
                  <li key={it.id} className="row">
                    <Link to={`/item/${it.id}`} className="row-link" aria-label={`${it.name}, ${money(it.price)}${it.soldOut ? ', sold out today' : ''}`}>
                      <Tile item={it} />
                      <span className="row-text">
                        <b>{it.name}</b>
                        <span className="row-desc">{it.desc}</span>
                        <span className="row-meta">{it.soldOut ? <em>Sold out today</em> : <>{money(it.price)}{it.heat && <span className="row-heat"><I.Fire size={13} /> Pick your heat</span>}</>}</span>
                      </span>
                    </Link>
                    {!it.soldOut && (
                      <button className="quick" aria-label={`Add ${it.name}`} onClick={() => {
                        dispatch({ type: 'add', line: { id: it.id, qty: 1, heat: it.heat ? 'medium' : null, dips: ['garlic'], side: 'none' } })
                        show(<span>{it.name} in your bag{it.heat ? ', medium heat' : ''}</span>, { action: <Link to="/bag" className="toast-link">View bag</Link> })
                      }}><I.Add size={20} /></button>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        )
      })}
      <p className="menu-foot">Prices include tax. Ask the counter about allergens, every dish is made in one kitchen with nuts, sesame, egg and gluten.</p>
      {count > 0 && <div className="bag-spacer" />}
      <Toast toast={toast} />
    </div>
  )
}

function SpecialSkeleton() {
  return <div className="special skel" aria-hidden="true" />
}
