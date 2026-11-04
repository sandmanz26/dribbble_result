import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { fachOf, inFach, chf, stockText, langText, title, FAECHER } from '../data/catalog.js'
import { useTilt, useReveal, reduced, TLink } from '../motion.js'
import { AddButton } from '../ui.jsx'
import { NotFound } from './Info.jsx'

export function Item({ p, i = 0 }) {
  const tilt = useTilt({ max: 9 })
  const img = useRef(null)
  const self = useRef(null)
  // Each item reveals itself, so it works on any page that lists products.
  useEffect(() => {
    const el = self.current
    if (!el) return
    if (reduced() || !('IntersectionObserver' in window)) { el.classList.add('is-in'); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect() } }, { rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <article ref={self} className={`item ${p.stock === 0 ? 'out' : ''}`} data-item data-reveal style={{ '--i': i }}>
      {p.isNew && <span className="flag">Neu</span>}
      <TLink to={`/p/${p.id}`} className="pic" ref={tilt} aria-label={`${title(p)}, ${chf(p.price)}`} tabIndex={-1}>
        <img ref={img} src={p.lowres ? p.hero : p.hero.replace('.webp', '-s.webp')} data-low={p.lowres ? '' : undefined} alt="" loading="lazy" style={{ viewTransitionName: `p-${p.id}` }} />
      </TLink>
      <div className="meta">
        <TLink to={`/p/${p.id}`}>{title(p)}</TLink>
        <span className="sub">{langText(p.lang)} · <span className={`stock ${p.stock === 0 ? 'out' : p.stock === 1 ? 'low' : ''}`}>{stockText(p.stock)}</span></span>
        <span />
        <span className="pr num">{chf(p.price)}</span>
        <AddButton p={p} imgRef={img} />
      </div>
    </article>
  )
}

export function Boards({ items, per = 4 }) {
  const [w, setW] = useState(() => window.innerWidth)
  useEffect(() => { const r = () => setW(window.innerWidth); window.addEventListener('resize', r); return () => window.removeEventListener('resize', r) }, [])
  const n = w <= 700 ? 2 : w <= 1100 ? 3 : per
  const rows = []
  for (let i = 0; i < items.length; i += n) rows.push(items.slice(i, i + n))
  return rows.map((r, k) => <div className="board-row" key={k}>{r.map((p, i) => <Item key={p.id} p={p} i={i} />)}</div>)
}

const HEAD = { neu: { tone: 'red', img: 'camp/booster' }, booster: { tone: 'red', img: 'camp/booster' }, 'bundles-boxen': { tone: 'dark', img: 'camp/boxen' }, einzelkarten: { tone: 'rose', img: 'camp/karten' } }

export default function Fach() {
  const { id } = useParams()
  const f = fachOf(id)
  const [sp, setSp] = useSearchParams()
  const lang = sp.get('lang') || 'all'
  const stockOnly = sp.get('lager') === '1'
  const sort = sp.get('sort') || 'neu'
  const set = (k, v) => { const n = new URLSearchParams(sp); if (v === null) n.delete(k); else n.set(k, v); setSp(n, { replace: true }) }
  const all = f ? inFach(id) : []
  const items = useMemo(() => {
    let l = all.filter((p) => (lang === 'all' || p.lang === lang) && (!stockOnly || p.stock > 0))
    l = [...l].sort((a, b) => sort === 'preis-auf' ? a.price - b.price : sort === 'preis-ab' ? b.price - a.price : (b.stock > 0) - (a.stock > 0) || b.added.localeCompare(a.added))
    return l
  }, [all, lang, stockOnly, sort])
  const ref = useReveal([id, lang, stockOnly, sort])
  useEffect(() => { if (f) document.title = `Fach ${f.no}, ${f.name} | Kartenregal TCG` }, [f])
  if (!f) return <NotFound />
  return (
    <>
      <section className={`fach-head tone-${HEAD[f.id].tone}`}>
        <img className="fach-photo" src={`${HEAD[f.id].img}-s.webp`} srcSet={`${HEAD[f.id].img}-s.webp 900w, ${HEAD[f.id].img}.webp 1800w`} sizes="100vw" alt="" />
        <div className="wrap">
          <span className="no" aria-hidden="true" style={{ viewTransitionName: `fach-${f.id}` }}>{f.no}</span>
          <div><h1>{f.name}</h1><p>{f.line}. {all.length} {all.length === 1 ? 'Produkt' : 'Produkte'} im Fach.</p></div>
        </div>
      </section>
      <div className="wrap" ref={ref}>
        <nav className="crumbs" aria-label="Pfad"><Link to="/">Regal</Link><span aria-hidden="true">/</span><span aria-current="page">Fach {f.no}, {f.name}</span></nav>
        <div className="filters" role="group" aria-label="Filter">
          <div className="seg" role="group" aria-label="Sprache" style={{ marginTop: 0 }}>
            {[['all', 'Alle'], ['DE', 'Deutsch'], ['EN', 'Englisch']].map(([k, l]) => <button key={k} aria-pressed={lang === k} onClick={() => set('lang', k === 'all' ? null : k)}>{l}</button>)}
          </div>
          <label className="chk"><input type="checkbox" checked={stockOnly} onChange={(e) => set('lager', e.target.checked ? '1' : null)} />Nur an Lager</label>
          <span className="gap" />
          <label className="sel">Sortieren
            <select value={sort} onChange={(e) => set('sort', e.target.value === 'neu' ? null : e.target.value)}>
              <option value="neu">Neueste zuerst</option>
              <option value="preis-auf">Preis aufsteigend</option>
              <option value="preis-ab">Preis absteigend</option>
            </select>
          </label>
        </div>
        <p className="small muted" style={{ marginTop: 12 }} aria-live="polite">{items.length} von {all.length} sichtbar</p>
        {items.length ? (
          <div className="boards"><Boards items={items} /></div>
        ) : (
          <div className="empty-state">
            <h2>In diesem Fach passt nichts zu deinem Filter.</h2>
            <p className="muted">{lang !== 'all' ? `Auf ${lang === 'DE' ? 'Deutsch' : 'Englisch'} haben wir hier gerade nichts.` : 'Alles ist gerade ausverkauft.'}</p>
            <button className="btn" onClick={() => setSp({}, { replace: true })}>Filter zurücksetzen</button>
          </div>
        )}
        <nav aria-label="Andere Fächer" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingBottom: 96 }}>
          {FAECHER.filter((x) => x.id !== id).map((x) => <Link key={x.id} className="btn sm" to={`/fach/${x.id}`}>{x.no} {x.name}</Link>)}
        </nav>
      </div>
    </>
  )
}
