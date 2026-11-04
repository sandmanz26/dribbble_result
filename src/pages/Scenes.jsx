import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { GrFormNext, GrLocation } from 'react-icons/gr'
import { FAECHER, PRODUCTS, inFach, chf, stockText, langText, title } from '../data/catalog.js'
import { useScroll, TLink } from '../motion.js'
import { AddButton } from '../ui.jsx'

// Stacking compartments: each Fach is a board that slides up and settles on the one before,
// which shrinks back and darkens like a drawer being pushed in.
const STACK = [
  { id: 'booster', tone: 'light', line: 'Einzelne Packs, im gepolsterten Brief ab CHF 2.' },
  { id: 'bundles-boxen', tone: 'dark', line: 'Top-Trainer-Boxen, Bundles und Tins, jede einzeln fotografiert.' },
  { id: 'einzelkarten', tone: 'red', line: 'Near Mint, in Sleeve und Toploader verschickt.' },
]

export function FachStack() {
  const cards = useRef([])
  const ref = useScroll(({ vh }) => {
    const els = cards.current.filter(Boolean)
    els.forEach((el, i) => {
      const next = els[i + 1]
      let cover = 0
      if (next) {
        const r = next.getBoundingClientRect()
        const stick = parseFloat(getComputedStyle(next).top) || 0
        cover = Math.min(1, Math.max(0, (vh - r.top) / Math.max(1, vh - stick)))
      }
      el.style.setProperty('--cover', cover.toFixed(4))
      const r = el.getBoundingClientRect()
      el.style.setProperty('--enter', Math.min(1, Math.max(0, (vh - r.top) / vh)).toFixed(4))
    })
  })
  const items = [...STACK.map((s) => ({ ...s, f: FAECHER.find((f) => f.id === s.id) })), { id: 'abholung', tone: 'rose', f: { no: '05', name: 'Abholung', id: 'abholung' }, line: 'Gratis in Wetzikon ZH. Wunschzeit wählen, wir bestätigen per E-Mail.' }]
  return (
    <section className="stack wrap" ref={ref} aria-labelledby="stack-h">
      <h2 id="stack-h" className="stack-h">Vier Fächer, ein Regal</h2>
      <div className="stack-list">
        {items.map((s, i) => {
          const list = s.id === 'abholung' ? [] : inFach(s.id).filter((p) => p.stock > 0).slice(0, 3)
          const to = s.id === 'abholung' ? '/abholung' : `/fach/${s.id}`
          return (
            <article key={s.id} className={`sc tone-${s.tone}`} ref={(el) => (cards.current[i] = el)} style={{ '--k': i }}>
              <div className="sc-text">
                <span className="sc-no num" style={{ viewTransitionName: `fach-${s.f.id}` }}>{s.f.no}</span>
                <h3>{s.f.name}</h3>
                <p>{s.line}</p>
                <p className="sc-count">{s.id === 'abholung' ? 'Bereit nach 2 bis 4 Tagen' : `${inFach(s.id).length} im Fach, ab ${chf(Math.min(...inFach(s.id).map((p) => p.price)))}`}</p>
                <TLink to={to} className="btn sc-btn">{s.id === 'abholung' ? 'So läuft die Abholung' : 'Fach öffnen'}<GrFormNext aria-hidden="true" /></TLink>
              </div>
              <div className="sc-pics" aria-hidden="true">
                {list.length ? list.map((p, j) => <img key={p.id} src={p.hero} alt="" loading="lazy" data-low={p.lowres ? '' : undefined} style={{ '--j': j }} />) : (
                  <>
                    <img className="sc-photo" src="mood/pfaeffikersee.webp" alt="" loading="lazy" />
                    <div className="sc-sign"><GrLocation /><b>Wetzikon ZH</b><span>Bestellnummer mitbringen, Folie vor Ort prüfen.</span></div>
                  </>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

// Pinned horizontal track: scrolling down moves the new arrivals sideways past the screen.
export function NewTrack() {
  const items = PRODUCTS.filter((p) => p.isNew || p.added >= '2026-10-31')
  const track = useRef(null)
  const ref = useScroll(({ pin }) => {
    const t = track.current
    if (!t || window.innerWidth < 700) return
    const max = Math.max(0, t.scrollWidth - t.parentElement.clientWidth)
    t.style.transform = `translate3d(${(-pin * max).toFixed(1)}px,0,0)`
  })
  // The section is as tall as the track is wide, so one screen of vertical scroll moves one screen sideways.
  useEffect(() => {
    const sec = ref.current, t = track.current
    if (!sec || !t) return
    const size = () => {
      if (window.innerWidth < 700 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { sec.style.height = ''; t.style.transform = ''; return }
      const max = Math.max(0, t.scrollWidth - t.parentElement.clientWidth)
      sec.style.height = `${window.innerHeight + max}px`
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(t)
    window.addEventListener('resize', size)
    return () => { ro.disconnect(); window.removeEventListener('resize', size) }
  }, [ref])
  return (
    <section className="track" ref={ref} aria-labelledby="new-h" style={{ '--n': items.length }}>
      <div className="track-stick">
        <div className="wrap track-head">
          <h2 id="new-h">Neu im Regal</h2>
          <p>{items.length} Produkte kamen diese Woche dazu. <Link to="/fach/neu" className="link">Alle neuen</Link></p>
        </div>
        <div className="track-view">
          <ol className="track-row" ref={track}>
            {items.map((p, i) => (
              <li key={p.id} className="tcard" data-item style={{ '--i': i }}>
                <TLink to={`/p/${p.id}`} className="tpic" tabIndex={-1} aria-hidden="true"><img src={p.hero} alt="" loading="lazy" /></TLink>
                <div className="tmeta">
                  <span className="tno num">{String(i + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}</span>
                  <TLink to={`/p/${p.id}`} className="tname">{title(p)}</TLink>
                  <span className="small muted">{langText(p.lang)} · <span className={`stock ${p.stock === 1 ? 'low' : ''}`}>{stockText(p.stock)}</span></span>
                  <span className="tbuy"><b className="num">{chf(p.price)}</b><AddButton p={p} /></span>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="wrap"><div className="track-bar" aria-hidden="true"><i /></div></div>
      </div>
    </section>
  )
}

// A band of the shop's facts that moves with the scroll and leans with its speed.
export function Marquee() {
  const ref = useScroll()
  const a = ['Booster im Brief ab CHF 2', 'Abholung gratis in Wetzikon', 'Fotos vom echten Stück', 'Versand innert 3 Werktagen']
  const b = ['Deutsch und Englisch', 'Ehrlicher Bestand', '14 Tage für Meldungen', 'Sleeve und Toploader']
  const row = (xs) => [...xs, ...xs, ...xs].map((t, i) => <span key={i}>{t}<i aria-hidden="true" /></span>)
  return (
    <section className="mq" ref={ref} aria-label="Gut zu wissen in Kürze">
      <div className="mq-band b1"><p className="mq-row r1" aria-hidden="true">{row(a)}</p></div>
      <div className="mq-band b2"><p className="mq-row r2" aria-hidden="true">{row(b)}</p></div>
      <p className="sr">{[...a, ...b].join('. ')}.</p>
    </section>
  )
}

// Packing, three ways: the photo columns drift at different speeds while the words stay put.
const PACK = [
  { img: 'mood/toploader', h: 'Einzelkarten', t: 'In Sleeve und Toploader, im gepolsterten Couvert. Ab CHF 50 eingeschrieben.' },
  { img: 'mood/couvert', h: 'Booster', t: 'Bis sechs Packs im gepolsterten B-Post-Brief, für CHF 2 oder CHF 4.' },
  { img: 'mood/karton', h: 'Boxen und Bundles', t: 'Im Karton mit Papierpolster, damit die Ecken heil ankommen. CHF 9.' },
]
export function Pack() {
  const ref = useScroll()
  return (
    <section className="pack-sec" ref={ref} aria-labelledby="pack-h">
      <div className="wrap pack-grid">
        <div className="pack-head">
          <h2 id="pack-h">So verpacken wir</h2>
          <p>Jede Bestellung geht in einer Sendung raus, innert drei Werktagen nach der Zahlung.</p>
          <Link to="/versand" className="link">Alle Versandpreise</Link>
        </div>
        <div className="pack-cols">
          {PACK.map((x, i) => (
            <figure key={x.h} className="pack-fig" style={{ '--k': i }}>
              <div className="pack-pic"><img src={`${x.img}-s.webp`} srcSet={`${x.img}-s.webp 800w, ${x.img}.webp 1600w`} sizes="(max-width: 800px) 90vw, 30vw" alt="" loading="lazy" width="800" height="597" /></div>
              <figcaption><b>{x.h}</b>{x.t}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
