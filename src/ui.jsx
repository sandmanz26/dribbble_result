import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { GrSearch, GrCart, GrClose, GrAdd, GrSubtract, GrMenu, GrFormDown } from 'react-icons/gr'
import { useStore } from './store.jsx'
import { FAECHER, PRODUCTS, chf, stockText, langText, title, byId } from './data/catalog.js'
import { postFor, boosterLoad, METHODS, arrival, pickupReady, fmtDate } from './data/shipping.js'
import { flyToCart } from './motion.js'

export function Mark() {
  return (
    <Link to="/" className="mark" aria-label="Kartenregal TCG, Startseite">
      <span className="shelf" aria-hidden="true"><i /><i /><i /><i /></span>
      KARTENREGAL <span className="tag">TCG</span>
    </Link>
  )
}

export function Header({ onSearch }) {
  const { count, dispatch } = useStore()
  const [menu, setMenu] = useState(false)
  const loc = useLocation()
  useEffect(() => setMenu(false), [loc.pathname])
  const nav = FAECHER.map((f) => (
    <NavLink key={f.id} to={`/fach/${f.id}`}><b>{f.no}</b>{f.name}</NavLink>
  ))
  return (
    <header className="bar">
      <div className="wrap">
        <Mark />
        <nav className="nav" aria-label="Fächer">{nav}<NavLink to="/abholung"><b>05</b>Abholung</NavLink></nav>
        <div className="tools">
          <button className="icon-btn" onClick={onSearch} aria-label="Suchen"><GrSearch /></button>
          <button className="icon-btn" data-cart-target onClick={() => dispatch({ type: 'drawer', open: true })} aria-label={`Korb, ${count} ${count === 1 ? 'Artikel' : 'Artikel'}`}>
            <GrCart />{count > 0 && <span className="count" aria-hidden="true">{count}</span>}
          </button>
          <button className="icon-btn menu-btn" onClick={() => setMenu(true)} aria-label="Menü" aria-expanded={menu}><GrMenu /></button>
        </div>
      </div>
      <nav className="fachbar" aria-label="Fächer">{FAECHER.map((f) => <NavLink key={f.id} to={`/fach/${f.id}`} aria-label={f.name}><b>{f.no}</b>{f.short}</NavLink>)}</nav>
      {menu && (
        <div className="sheet" role="dialog" aria-modal="true" aria-label="Menü">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 48 }}>
            <Mark />
            <button className="icon-btn" onClick={() => setMenu(false)} aria-label="Menü schliessen"><GrClose /></button>
          </div>
          <nav style={{ marginTop: 24 }}>
            {FAECHER.map((f, i) => <Link key={f.id} to={`/fach/${f.id}`} style={{ '--i': i }}><b>{f.no}</b>{f.name}</Link>)}
            <Link to="/abholung" style={{ '--i': 4 }}><b>05</b>Abholung</Link>
            <Link to="/versand" style={{ '--i': 5 }}><b>06</b>Versand</Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export function ProtoStrip() {
  return (
    <div className="proto">
      <div className="wrap">
        <span className="long">Redesign-Prototyp für Kartenregal TCG. Echte Produkte und Preise vom 3. November 2026, keine echte Bestellung.</span><span className="short">Prototyp, keine echte Bestellung</span>
        <span style={{ display: 'flex', gap: 16 }}><Link to="/review">Design review (EN)</Link><Link to="/system">Components (EN)</Link></span>
      </div>
    </div>
  )
}

export function AddButton({ p, imgRef, copy, label }) {
  const { dispatch, lines } = useStore()
  const inCart = lines.filter((l) => l.id === p.id).reduce((t, l) => t + l.qty, 0)
  const out = p.stock === 0
  const full = !out && inCart >= p.stock
  return (
    <button
      className="add"
      disabled={out || full}
      onClick={(e) => { flyToCart(imgRef?.current || e.currentTarget.closest('[data-item]')?.querySelector('img')); dispatch({ type: 'add', id: p.id, copy }) }}
      aria-label={out ? `${title(p)} ist ausverkauft` : full ? `Alle ${p.stock} im Korb` : label || `${title(p)} in den Korb, ${chf(p.price)}`}
      title={out ? 'Ausverkauft' : full ? 'Alle im Korb' : 'In den Korb'}
    >
      {out || full ? <GrClose /> : <GrAdd />}
    </button>
  )
}

export function Qty({ value, min = 1, max, onChange, label }) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Weniger"><GrSubtract /></button>
      <output aria-live="polite">{value}</output>
      <button onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Mehr"><GrAdd /></button>
    </div>
  )
}

// The live thing: how full the B-Post letter is, and what that costs.
export function Meter({ lines }) {
  const load = boosterLoad(lines)
  const box = lines.some((l) => l.p.kind === 'box')
  const post = postFor(lines)
  const cells = [0, 1, 's', 2, 3, 4, 5, 's', 6]
  return (
    <div className="meter" aria-live="polite">
      <div className="hd"><b>{post ? post.name : 'Noch leer'}</b><span className="num">{post ? (post.price === null ? 'im Checkout' : chf(post.price)) : ''}</span></div>
      <div className="cells" aria-hidden="true">
        {cells.map((c, i) => c === 's' ? <i key={i} className="sep" /> : c === 6 ? <i key={i} className={`box ${box || load >= 7 ? 'full' : ''}`} /> : <i key={i} className={load > c && !box ? 'full' : ''} />)}
      </div>
      <div className="lg" aria-hidden="true"><span>Brief CHF 2</span><span /><span>Dicker Brief CHF 4</span><span /><span>Paket CHF 9</span></div>
      <p>{post ? post.why : 'Booster reisen im Brief: 1 bis 2 für CHF 2, 3 bis 6 für CHF 4.'}</p>
    </div>
  )
}

export function Delivery({ compact }) {
  const { delivery, window: win, dispatch, lines } = useStore()
  const post = postFor(lines)
  const a = arrival(), r = pickupReady()
  const windows = ['Werktags ab 18 Uhr', 'Samstag 10 bis 12 Uhr', 'Samstag 14 bis 16 Uhr']
  return (
    <div className="choice" role="radiogroup" aria-label="Lieferung">
      <label>
        <input type="radio" name="del" checked={delivery === 'post'} onChange={() => dispatch({ type: 'delivery', value: 'post' })} />
        <span><b>{post ? post.name : 'B-Post'}</b><span>Ankunft zwischen {fmtDate(a.from)} und {fmtDate(a.to)}</span></span>
        <span className="v num">{post ? (post.price === null ? 'im Checkout' : chf(post.price)) : ''}</span>
      </label>
      <label>
        <input type="radio" name="del" checked={delivery === 'pickup'} onChange={() => dispatch({ type: 'delivery', value: 'pickup' })} />
        <span><b>{METHODS.pickup.name}</b><span>Bereit zwischen {fmtDate(r.from)} und {fmtDate(r.to)}</span></span>
        <span className="v">gratis</span>
      </label>
      {delivery === 'pickup' && !compact && (
        <div style={{ paddingLeft: 2 }}>
          <span className="small" style={{ fontWeight: 600 }}>Wunschzeit, wir bestätigen per E-Mail</span>
          <div className="windows">
            {windows.map((w) => <button key={w} aria-pressed={win === w} onClick={() => dispatch({ type: 'window', value: win === w ? null : w })}>{w}</button>)}
          </div>
        </div>
      )}
    </div>
  )
}

export function totals(lines, delivery) {
  const sub = lines.reduce((t, l) => t + l.qty * l.p.price, 0)
  const post = postFor(lines)
  const ship = !lines.length ? 0 : delivery === 'pickup' ? 0 : post?.price ?? 0
  return { sub, ship, total: sub + ship, post }
}

export function Drawer() {
  const { drawer, dispatch, lines, delivery } = useStore()
  const nav = useNavigate()
  const closeRef = useRef(null)
  const close = () => dispatch({ type: 'drawer', open: false })
  useEffect(() => {
    if (!drawer) return
    closeRef.current?.focus()
    const k = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [drawer]) // eslint-disable-line react-hooks/exhaustive-deps
  const t = totals(lines, delivery)
  const suggest = PRODUCTS.filter((p) => p.kind === 'booster' && p.stock > 0).slice(0, 3)
  return (
    <>
      <div className={`scrim ${drawer ? 'open' : ''}`} onClick={close} aria-hidden="true" />
      <aside className={`drawer ${drawer ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Korb" aria-hidden={!drawer} inert={!drawer ? '' : undefined}>
        <header><h2>Dein Korb</h2><button ref={closeRef} className="icon-btn" onClick={close} aria-label="Korb schliessen"><GrClose /></button></header>
        <div className="body">
          {lines.length === 0 ? (
            <div className="empty-cart">
              <h3>Der Korb ist noch leer.</h3>
              <p className="muted">Ein Booster reist für CHF 2 im Brief. Drei Packs aus dem Fach:</p>
              <ul style={{ width: '100%' }}>
                {suggest.map((p) => (
                  <li key={p.id} className="line" data-item>
                    <img src={p.hero.replace('.webp', '-s.webp')} alt="" />
                    <span><Link className="n" to={`/p/${p.id}`} onClick={close}>{p.name}</Link><span className="s">{langText(p.lang)} · {stockText(p.stock)}</span></span>
                    <span className="r"><b className="num">{chf(p.price)}</b><AddButton p={p} /></span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <ul>
                {lines.map((l) => {
                  const others = lines.filter((x) => x.id === l.id && x.key !== l.key).reduce((s, x) => s + x.qty, 0)
                  return (
                    <li key={l.key} className="line">
                      <img src={l.p.hero.replace('.webp', '-s.webp')} alt="" />
                      <span>
                        <Link className="n" to={`/p/${l.id}`} onClick={close}>{title(l.p)}</Link>
                        <span className="s">{langText(l.p.lang)}{l.copy ? ` · Exemplar ${l.copy}` : ''} · {chf(l.p.price)}</span>
                        <button className="rm" onClick={() => dispatch({ type: 'remove', key: l.key })}>Entfernen</button>
                      </span>
                      <span className="r">
                        <b className="num">{chf(l.qty * l.p.price)}</b>
                        <Qty value={l.qty} min={0} max={l.copy ? 1 : l.p.stock - others} onChange={(q) => dispatch({ type: 'qty', key: l.key, id: l.id, qty: q })} label={`Menge ${title(l.p)}`} />
                      </span>
                    </li>
                  )
                })}
              </ul>
              <Meter lines={lines} />
              <Delivery />
            </>
          )}
        </div>
        {lines.length > 0 && (
          <footer>
            <div className="totals">
              <div><span>Zwischensumme</span><span className="num">{chf(t.sub)}</span></div>
              <div><span>{delivery === 'pickup' ? 'Abholung' : t.post?.name}</span><span className="num">{delivery === 'pickup' ? 'gratis' : t.post?.price === null ? 'im Checkout' : chf(t.ship)}</span></div>
              <div className="t"><span>Total</span><span className="num">{chf(t.total)}</span></div>
            </div>
            <button className="btn buy wide" style={{ marginTop: 14 }} onClick={() => { close(); nav('/kasse') }}>Zur Kasse</button>
            <p className="small muted" style={{ marginTop: 8 }}>Bezahlen mit TWINT, Karte, Apple Pay oder Google Pay.</p>
          </footer>
        )}
      </aside>
    </>
  )
}

export function Toast() {
  const { toast, dispatch } = useStore()
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => dispatch({ type: 'toast' }), 3200)
    return () => clearTimeout(t)
  }, [toast, dispatch])
  if (!toast) return null
  const p = byId(toast.id)
  return (
    <div className="toast" role="status" key={toast.at}>
      <span>{toast.kind === 'added' ? <><b>{p.name}</b> liegt im Korb.</> : <>Mehr als {p.stock} haben wir nicht im Fach.</>}</span>
      {toast.kind === 'added' && <button onClick={() => dispatch({ type: 'drawer', open: true })}>Korb ansehen</button>}
    </div>
  )
}

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
export function Search({ onClose }) {
  const [q, setQ] = useState('')
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.focus()
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose])
  const terms = norm(q).split(/\s+/).filter(Boolean)
  const hay = (p) => norm(`${title(p)} ${p.de || ''} ${p.lang === 'DE' ? 'deutsch german' : 'englisch english'} ${p.facts.map((f) => f[1]).join(' ')} ${p.kind}`)
  const res = terms.length ? PRODUCTS.filter((p) => terms.every((t) => hay(p).includes(t))) : PRODUCTS.filter((p) => p.isNew)
  const hl = (s) => {
    if (!terms.length) return s
    const t = terms[0]; const i = norm(s).indexOf(t)
    return i < 0 ? s : <>{s.slice(0, i)}<mark>{s.slice(i, i + t.length)}</mark>{s.slice(i + t.length)}</>
  }
  return (
    <div className="search" role="dialog" aria-modal="true" aria-label="Suche">
      <div className="top">
        <div className="wrap">
          <label htmlFor="q" className="sr">Suchen</label>
          <input id="q" ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Set, Pokémon oder Sprache" autoComplete="off" />
          <button className="icon-btn" onClick={onClose} aria-label="Suche schliessen"><GrClose /></button>
        </div>
      </div>
      <div className="res">
        <div className="wrap">
          <p className="small muted" aria-live="polite">{terms.length ? `${res.length} ${res.length === 1 ? 'Treffer' : 'Treffer'}` : 'Neu im Regal'}</p>
          {res.map((p) => (
            <Link key={p.id} to={`/p/${p.id}`} onClick={onClose}>
              <img src={p.hero.replace('.webp', '-s.webp')} alt="" />
              <span><b style={{ fontWeight: 600 }}>{hl(title(p))}</b><span className="small muted" style={{ display: 'block' }}>{langText(p.lang)} · {stockText(p.stock)}</span></span>
              <b className="num">{chf(p.price)}</b>
            </Link>
          ))}
          {terms.length > 0 && res.length === 0 && (
            <div style={{ paddingTop: 24 }}>
              <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>Nichts im Regal zu «{q}».</p>
              <p className="muted" style={{ marginTop: 8 }}>Versuch es mit dem Set-Namen, zum Beispiel Pitch Black, oder mit Deutsch und Englisch.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Footer() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'auto')
  const cycle = () => {
    const next = theme === 'auto' ? 'dark' : theme === 'dark' ? 'light' : 'auto'
    setTheme(next)
    if (next === 'auto') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = next
    try { localStorage.setItem('kr-theme-v1', next) } catch { /* ignore */ }
  }
  return (
    <footer className="foot">
      <img src="products/ascended-heroes-etb-de-3.webp" alt="" loading="lazy" width="750" height="750" />
      <div className="wrap top">
        <div><h2>Regal</h2>{FAECHER.map((f) => <Link key={f.id} to={`/fach/${f.id}`}>{f.no} {f.name}</Link>)}</div>
        <div><h2>Service</h2><Link to="/abholung">Abholung</Link><Link to="/versand">Versand und Rückgabe</Link><a href="#/" onClick={(e) => e.preventDefault()}>Impressum</a><a href="#/" onClick={(e) => e.preventDefault()}>AGB und Datenschutz</a></div>
        <div><h2>Abholung und Zahlung</h2><p>Gratis abholen in Wetzikon ZH, Termin nach der Bestellung. Versand mit B-Post in der ganzen Schweiz.</p><p style={{ marginTop: 8 }}>TWINT, Karte, Apple Pay, Google Pay.</p></div>
        <div><h2>Darstellung</h2><button onClick={cycle} aria-label={`Darstellung: ${theme === 'auto' ? 'wie System' : theme === 'dark' ? 'dunkel' : 'hell'}. Wechseln`}>{theme === 'auto' ? 'Wie System' : theme === 'dark' ? 'Dunkel' : 'Hell'} <GrFormDown style={{ verticalAlign: 'middle' }} /></button><Link to="/review">Design review</Link><Link to="/system">Components</Link></div>
      </div>
      <div className="name">
        <b aria-hidden="true">KARTENREGAL</b>
        <div className="legal">
          <span>© 2026 Kartenregal TCG, unabhängiger Händler aus Wetzikon. Pokémon ist eine Marke von Nintendo, Creatures und GAME FREAK; Kartenregal steht mit diesen Firmen in keiner Verbindung.</span>
          <span>Fotos: Kartenregal und Hersteller</span>
        </div>
      </div>
    </footer>
  )
}
