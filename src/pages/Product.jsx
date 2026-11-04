import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GrDeliver, GrLocation, GrRotateRight, GrCart } from 'react-icons/gr'
import { byId, fachOf, inFach, chf, stockText, langText, title } from '../data/catalog.js'
import { postFor, arrival, pickupReady, fmtDate } from '../data/shipping.js'
import { useStore } from '../store.jsx'
import { useTilt, flyToCart } from '../motion.js'
import { Qty } from '../ui.jsx'
import { Boards } from './Fach.jsx'
import { NotFound } from './Info.jsx'

export default function Product() {
  const { id } = useParams()
  const p = byId(id)
  if (!p) return <NotFound />
  return <ProductView key={id} p={p} />
}

function ProductView({ p }) {
  const { dispatch, lines } = useStore()
  const f = fachOf(p.fach)
  const [copy, setCopy] = useState(p.copies ? p.copies[0].id : null)
  const photos = useMemo(() => (p.copies ? [...p.copies.find((c) => c.id === copy).photos, ...p.photos] : p.photos), [p, copy])
  const [at, setAt] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [flip, setFlip] = useState(false)
  const [qty, setQty] = useState(1)
  const tilt = useTilt({ max: p.kind === 'single' ? 14 : 6 })
  const imgRef = useRef(null)
  const buyRef = useRef(null)
  const [showBar, setShowBar] = useState(false)
  useEffect(() => { document.title = `${title(p)} | Kartenregal TCG` }, [p])
  useEffect(() => setAt(0), [copy])
  // The phone buy bar appears only while the real button is off screen, so it never covers what you read.
  useEffect(() => {
    let raf = 0
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const el = buyRef.current; if (el) setShowBar(el.getBoundingClientRect().bottom < 0) }) }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf) }
  }, [])
  const inCart = lines.filter((l) => l.id === p.id).reduce((t, l) => t + l.qty, 0)
  const copyInCart = copy && lines.some((l) => l.key === `${p.id}:${copy}`)
  const left = p.copies ? (copyInCart ? 0 : 1) : p.stock - inCart
  const out = p.stock === 0
  const add = () => {
    flyToCart(imgRef.current)
    for (let i = 0; i < (p.copies ? 1 : qty); i++) dispatch({ type: 'add', id: p.id, copy })
    setQty(1)
  }
  const would = postFor([...lines, { p, qty: p.copies ? 1 : qty }])
  const a = arrival(), r = pickupReady()
  const ph = photos[at] || photos[0]
  const dark = !ph.maker && p.kind !== 'single' && !['30-jahre-boosterbundle-de', '30-jahre-tech-sticker-kollektion-de'].includes(p.id) && !ph.src.includes('-0.webp')
  const related = inFach(p.fach).filter((x) => x.id !== p.id).slice(0, 4)
  const buyLabel = out ? 'Ausverkauft' : left <= 0 ? (p.copies ? `Exemplar ${copy} liegt im Korb` : 'Alle im Korb') : 'In den Korb'
  return (
    <div className="pdp wrap">
      <nav className="crumbs" aria-label="Pfad"><Link to="/">Regal</Link><span aria-hidden="true">/</span><Link to={`/fach/${f.id}`}>Fach {f.no}, {f.name}</Link><span aria-hidden="true">/</span><span aria-current="page">{p.name}</span></nav>
      <div className="pdp-grid">
        <div className="viewer">
          <div
            className={`main ${dark ? 'dark' : ''} ${zoom ? 'zoom' : ''}`}
            ref={tilt}
            onClick={(e) => { if (p.kind === 'single') return; const rr = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--gx', `${((e.clientX - rr.left) / rr.width) * 100}%`); e.currentTarget.style.setProperty('--gy', `${((e.clientY - rr.top) / rr.height) * 100}%`); setZoom((z) => !z) }}
            onPointerMove={(e) => { if (!zoom) return; const rr = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--gx', `${((e.clientX - rr.left) / rr.width) * 100}%`); e.currentTarget.style.setProperty('--gy', `${((e.clientY - rr.top) / rr.height) * 100}%`) }}
          >
            <span className={`lab ${ph.maker ? 'maker' : ''}`}>{ph.maker ? 'Herstellerbild' : `${p.copies ? `Exemplar ${copy}, ` : 'Unser Exemplar, '}${ph.label}`}</span>
            {p.kind === 'single' ? (
              <>
                <div className={`cardflip ${flip ? 'back' : ''}`}>
                  <div className="face"><img ref={imgRef} src={p.photos[0].src} alt={`${title(p)}, Vorderseite, unser Exemplar`} style={{ viewTransitionName: `p-${p.id}` }} /><span className="foil" aria-hidden="true" /></div>
                  <div className="face b"><img src={p.photos[1].src} alt={`${title(p)}, Rückseite, unser Exemplar`} /></div>
                </div>
                <button className="btn sm flipbtn" onClick={() => setFlip((x) => !x)} aria-pressed={flip}><GrRotateRight aria-hidden="true" />{flip ? 'Vorderseite' : 'Rückseite'}</button>
                <span className="hint">Bewege die Maus über die Karte</span>
              </>
            ) : (
              <>
                <img ref={imgRef} key={ph.src} src={ph.src} data-low={p.lowres && at === 0 ? '' : undefined} alt={`${title(p)}, ${ph.maker ? 'Herstellerbild' : ph.label}`} style={at === 0 ? { viewTransitionName: `p-${p.id}` } : undefined} />
                <span className="hint">{zoom ? 'Klicken zum Verkleinern' : 'Klicken zum Vergrössern'}</span>
              </>
            )}
          </div>
          {p.kind !== 'single' && photos.length > 1 && (
            <div className="thumbs" role="group" aria-label="Fotos">
              {photos.map((x, i) => (
                <button key={x.src} aria-pressed={i === at} onClick={() => { setAt(i); setZoom(false) }} aria-label={`Foto ${i + 1}: ${x.maker ? 'Herstellerbild' : x.label}`}>
                  <img src={x.src.replace('.webp', '-s.webp')} alt="" loading="lazy" /><span>{x.maker ? 'Hersteller' : x.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="buybox">
          <h1>{title(p)}</h1>
          <p className="de">{p.de ? `${p.de}, ` : ''}{langText(p.lang)}{p.kind === 'single' ? ', Einzelkarte' : ', neu und versiegelt'}</p>
          <p className="price num">{chf(p.price)}</p>
          <p className="st"><span className={`stock ${out ? 'out' : p.stock === 1 ? 'low' : ''}`}>{stockText(p.stock)}</span>{inCart > 0 && <span className="muted">{inCart} im Korb</span>}</p>

          {p.copies && (
            <fieldset className="copies" style={{ border: 0, padding: 0, margin: '24px 0 0' }}>
              <legend style={{ fontWeight: 600, padding: 0, marginBottom: 10 }}>Welches Exemplar?</legend>
              <div className="opts">
                {p.copies.map((c) => {
                  const taken = lines.some((l) => l.key === `${p.id}:${c.id}`)
                  return (
                    <label key={c.id}>
                      <input type="radio" name="copy" checked={copy === c.id} onChange={() => setCopy(c.id)} />
                      <img src={c.photos[0].src.replace('.webp', '-s.webp')} alt="" />
                      <span><b>{c.label}{taken ? ', im Korb' : ''}</b><span>{c.flaw}</span></span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          )}

          <div className="act" ref={buyRef}>
            {!p.copies && <Qty value={qty} min={1} max={Math.max(1, left)} onChange={setQty} label="Menge" />}
            <button className="btn buy" onClick={add} disabled={out || left <= 0} style={p.copies ? { gridColumn: '1 / -1' } : undefined}><GrCart aria-hidden="true" />{buyLabel}</button>
          </div>

          <div className="ship" aria-label="Lieferung">
            <div>
              <GrDeliver aria-hidden="true" />
              <span><b>{would?.name || 'B-Post'}</b><span>{inCart || lines.length ? 'Mit deinem Korb zusammen. ' : ''}Ankunft {fmtDate(a.from)} bis {fmtDate(a.to)}</span></span>
              <span className="v num">{would?.price == null ? 'im Checkout' : chf(would.price)}</span>
            </div>
            <div>
              <GrLocation aria-hidden="true" />
              <span><b>Abholung in Wetzikon</b><span>Bereit {fmtDate(r.from)} bis {fmtDate(r.to)}, Wunschzeit im Korb</span></span>
              <span className="v">gratis</span>
            </div>
          </div>
          <p className="pay">Bezahlen mit TWINT, Karte, Apple Pay oder Google Pay. Stimmt etwas nicht: Meldung innert 14 Tagen, Rücksendung auf unsere Kosten.</p>

          <section className="facts" aria-labelledby="facts-h">
            <h2 id="facts-h">Details</h2>
            <dl>{p.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <p className="note">{p.note} {p.kind === 'single' ? 'Versand im B-Post-Brief, Karte in Sleeve und Toploader.' : p.kind === 'booster' ? 'Bis 6 Booster im Brief, sonst im Paket.' : 'Versand im Paket, gut gepolstert.'}</p>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related" aria-labelledby="rel-h">
          <h2 className="sec" id="rel-h" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>Im selben Fach<Link to={`/fach/${f.id}`} className="link small">Ganzes Fach</Link></h2>
          <div className="boards" style={{ paddingBottom: 0 }}><Boards items={related} /></div>
        </section>
      )}

      <div className={`mbuy ${showBar ? 'show' : ''}`} aria-hidden={!showBar}>
        <div className="t"><b>{p.name}</b><span className="num">{chf(p.price)}</span></div>
        <button className="btn buy sm" onClick={add} disabled={out || left <= 0} tabIndex={showBar ? 0 : -1}>{out ? 'Ausverkauft' : left <= 0 ? 'Im Korb' : 'In den Korb'}</button>
      </div>
    </div>
  )
}
