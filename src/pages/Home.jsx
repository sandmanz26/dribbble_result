import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GrDeliver, GrLocation, GrView, GrFormDown, GrAdd, GrSubtract } from 'react-icons/gr'
import { FAECHER, PRODUCTS, byId, chf, stockText, langText, title } from '../data/catalog.js'
import { useTilt, useReveal, reduced, useScroll } from '../motion.js'
import { FachStack, NewTrack, Marquee, Pack } from './Scenes.jsx'
import { AddButton } from '../ui.jsx'

export default function Home() {
  useEffect(() => { document.title = 'Kartenregal TCG, Pokémon-Karten aus Wetzikon' }, [])
  return (
    <>
      <Hero />
      <FachStack />
      <NewTrack />
      <Shelf />
      <Exemplar />
      <Post />
      <Pack />
      <Marquee />
      <Know />
      <Faq />
    </>
  )
}

function Hero() {
  const tilt = useTilt({ max: 7 })
  const top = byId('ascended-heroes-etb-de')
  const img = useRef(null)
  const sc = useScroll()
  return (
    <section className="hero" aria-labelledby="hero-h" ref={sc}>
      <div className="wrap">
        <div>
          <h1 id="hero-h"><span><i style={{ '--i': 0 }}>Pokémon-Karten</i></span><span><i style={{ '--i': 1 }}>aus Wetzikon</i></span></h1>
          <p className="lede">Neu und versiegelt, jedes Stück bei uns fotografiert. Booster im Brief ab CHF 2, Abholung gratis.</p>
          <div className="cta">
            <a className="btn buy" href="#regal" onClick={(e) => { e.preventDefault(); document.getElementById('regal')?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' }) }}>Zum Regal</a>
            <Link className="btn" to="/fach/neu">Neu diese Woche</Link>
          </div>
          <ul className="facts">
            <li><GrView aria-hidden="true" />Fotos vom echten Stück</li>
            <li><GrDeliver aria-hidden="true" />Versand innert 3 Werktagen</li>
            <li><GrLocation aria-hidden="true" />Abholung in Wetzikon ZH</li>
          </ul>
        </div>
        <div className="stage" ref={tilt}>
          <div className="fan" aria-hidden="true">
            <span className="pk a"><img className="pack" src="products/pitch-black-booster-en-0.webp" alt="" width="602" height="1100" /></span>
            <span className="pk b"><img className="pack" src="products/30-jahre-booster-en-0.webp" alt="" width="602" height="1100" /></span>
            <span className="pk c"><img className="pack" src="products/booster-perfect-order-en-0.webp" alt="" width="602" height="1100" /></span>
            <div className="box"><img ref={img} src={top.hero} alt="" width="1100" height="1049" fetchpriority="high" /></div>
          </div>
          <div className="tagcard" data-item>
            <span className="k">Top im Regal · {stockText(top.stock)}</span>
            <Link to={`/p/${top.id}`} className="n" style={{ display: 'block', textDecoration: 'none' }}>{top.name}, {langText(top.lang)}</Link>
            <div className="row"><span className="p num">{chf(top.price)}</span><AddButton p={top} imgRef={img} /></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Shelf() {
  const [lang, setLang] = useState('all')
  const [active, setActive] = useState('ascended-heroes-etb-de')
  const list = useMemo(() => PRODUCTS.filter((p) => lang === 'all' || p.lang === lang), [lang])
  const groups = FAECHER.filter((f) => f.id !== 'neu').map((f) => ({ ...f, items: list.filter((p) => p.fach === f.id).sort((a, b) => (b.stock > 0) - (a.stock > 0) || b.price - a.price) })).filter((g) => g.items.length)
  const listRef = useRef(null)
  const ref = useReveal([lang])
  // On scroll, the row nearest the middle of the screen becomes active, like a finger running along the shelf.
  useEffect(() => {
    const root = listRef.current
    if (!root || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.dataset.id)), { rootMargin: '-48% 0px -48% 0px' })
    root.querySelectorAll('[data-id]').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [lang])
  const a = byId(active)
  const inStock = PRODUCTS.filter((p) => p.stock > 0).length
  return (
    <section className="shelf-sec wrap" id="regal" aria-labelledby="regal-h" ref={ref}>
      <div className="shelf-grid">
        <div className="shelf-pic" aria-hidden="true">
          <div className="cap"><span className="no">Fach {FAECHER.find((f) => f.id === a.fach).no}</span><span>{stockText(a.stock)}</span></div>
          {PRODUCTS.map((p) => <img key={p.id} src={p.hero} alt="" className={p.id === active ? 'on' : ''} data-low={p.lowres ? '' : undefined} loading="lazy" />)}
          <div className="board" />
        </div>
        <div>
          <div className="shelf-head">
            <h2 id="regal-h" data-reveal>Das ganze Regal</h2>
            <p data-reveal style={{ '--i': 1 }}>{PRODUCTS.length} Produkte, {inStock} davon an Lager. Kein Stöbern durch Kategorien: alles steht hier.</p>
            <div className="seg" role="group" aria-label="Sprache" data-reveal style={{ '--i': 2 }}>
              {[['all', 'Alle'], ['DE', 'Deutsch'], ['EN', 'Englisch']].map(([k, l]) => <button key={k} aria-pressed={lang === k} onClick={() => setLang(k)}>{l} <span className="muted">{k === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.lang === k).length}</span></button>)}
            </div>
          </div>
          <div ref={listRef}>
            {groups.map((g) => (
              <div className="fachgroup" key={g.id}>
                <h3 data-reveal><span className="no">{g.no}</span>{g.name}<Link to={`/fach/${g.id}`} className="link">Ganzes Fach</Link></h3>
                <ul>
                  {g.items.map((p, i) => (
                    <li key={p.id} data-id={p.id} data-item data-reveal style={{ '--i': i % 6 }} className={`row ${p.id === active ? 'on' : ''} ${p.stock === 0 ? 'out' : ''}`} onPointerEnter={() => setActive(p.id)} onFocus={() => setActive(p.id)}>
                      <img src={p.hero.replace('.webp', '-s.webp')} alt="" className="sr" />
                      <Link className="nm" to={`/p/${p.id}`}>
                        <b>{title(p)}</b>
                        <span>{langText(p.lang)} · <span className={`stock ${p.stock === 0 ? 'out' : p.stock === 1 ? 'low' : ''}`}>{stockText(p.stock)}</span>{p.copies ? ' · 2 Exemplare zur Wahl' : ''}</span>
                      </Link>
                      <span className="pr num">{chf(p.price)}</span>
                      <AddButton p={p} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Scroll progress (0..1) through a tall section with a sticky stage.
function useProgress() {
  const ref = useRef(null)
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const span = r.height - window.innerHeight
        setP(span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0)
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])
  return [ref, p]
}

function Exemplar() {
  const [ref, p] = useProgress()
  const s = p < 0.33 ? 0 : p < 0.66 ? 1 : 2
  const shots = [
    { src: 'products/ascended-heroes-etb-de-1.webp', label: 'Ganzes Stück', t: 'scale(1)', o: '50% 50%' },
    { src: 'products/ascended-heroes-etb-de-2.webp', label: 'Rückseite', t: 'scale(1.35)', o: '50% 45%' },
    { src: 'products/ascended-heroes-etb-de-3.webp', label: 'Siegel', t: 'scale(1.5)', o: '52% 40%' },
  ]
  return (
    <section className="exemplar" ref={ref} data-s={s} aria-labelledby="ex-h">
      <div className="sticky">
        <h2 id="ex-h" className="sr">Was du siehst, liegt im Paket.</h2>
        <p className="t1" aria-hidden="true">Was du siehst,</p>
        <div className="frame">
          {shots.map((x, i) => (
            <img key={i} src={x.src} alt={i === s ? `Ascended Heroes ETB, unser Exemplar: ${x.label}` : ''} className={i === s ? 'on' : ''} style={{ transform: i === s ? x.t : 'scale(1.08)', transformOrigin: x.o }} loading="lazy" />
          ))}
          <span className="lbl">{shots[s].label}</span>
        </div>
        <p className="t2" aria-hidden="true">liegt im Paket.</p>
        <ol className="steps" aria-hidden="true">{shots.map((x, i) => <li key={i} className={i === s ? 'on' : ''}>{x.label}</li>)}</ol>
        <div className="side">
          <p>Wir fotografieren jedes Stück von vorne, hinten und am Siegel. Hat eine Box eine Macke, siehst du die Macke.</p>
          <Link to="/p/pitch-black-etb-en" className="link">Pitch Black ETB: zwei Exemplare, du wählst</Link>
        </div>
      </div>
    </section>
  )
}

const STAGES = [
  { word: ['Brief'], price: 'CHF 2', say: 'Ein oder zwei Booster reisen im gepolsterten Couvert. Einzelkarten in Sleeve und Toploader.' },
  { word: ['Dicker', 'Brief'], price: 'CHF 4', say: 'Drei bis sechs Booster, immer noch im Brief. Das ist der Grund, mehr als einen zu nehmen.' },
  { word: ['Paket'], price: 'CHF 9', say: 'Boxen, Bundles und Bestellungen ab sieben Boostern gehen im Karton mit Polsterung.' },
  { word: ['Abholen'], price: 'gratis', say: 'In Wetzikon ZH. Du wählst eine Wunschzeit, wir bestätigen per E-Mail.' },
]
const stageOf = (n) => (n <= 2 ? 0 : n <= 6 ? 1 : n <= 8 ? 2 : 3)

function Post() {
  const [ref, p] = useProgress()
  const n = Math.min(9, Math.floor(p * 9) + 1)
  const s = stageOf(n)
  const st = STAGES[s]
  const go = (m) => {
    const el = ref.current
    if (!el) return
    const span = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + span * ((Math.max(1, Math.min(9, m)) - 0.5) / 9), behavior: reduced() ? 'auto' : 'smooth' })
  }
  const packs = ['pitch-black-booster-en-0', '30-jahre-booster-en-0', 'booster-perfect-order-en-0', 'pitch-black-booster-en-0', '30-jahre-booster-en-0', 'booster-perfect-order-en-0']
  const rot = [-8, 5, -3, 9, -6, 4]
  return (
    <section className="post" ref={ref} data-s={s} aria-labelledby="post-h">
      <div className="sticky">
        <div>
          <h2 id="post-h" className="sr">Versand: Brief, dicker Brief, Paket oder Abholen</h2>
          <p className="word" aria-hidden="true" key={s}>{st.word.map((w) => <span key={w}>{w}</span>)}</p>
          <span className="price num">{st.price}</span>
          <p className="say">{st.say}</p>
          <div className="try">
            <span id="try-l">Probier es:</span>
            <div className="stepper" role="group" aria-labelledby="try-l">
              <button onClick={() => go(n - 1)} aria-label="Ein Booster weniger" disabled={n <= 1}><GrSubtract /></button>
              <output aria-live="polite">{n === 9 ? 'Abholen' : `${n} Booster`}</output>
              <button onClick={() => go(n + 1)} aria-label="Ein Booster mehr" disabled={n >= 9}><GrAdd /></button>
            </div>
          </div>
        </div>
        {s < 3 ? (
          <div className={`env ${s === 2 ? 'parcel' : ''}`} aria-hidden="true">
            <div className="back" />
            {s < 2 && <div className="bubble" />}
            {s === 2 && <img className={`box in`} src="products/pitch-black-etb-en-0.webp" alt="" />}
            <div className="packs">
              {packs.map((f, k) => <img key={k} src={`products/${f}.webp`} alt="" className={k < Math.min(n, 6) && s < 2 ? 'in' : ''} style={{ '--k': k, '--r': `${rot[k]}deg` }} />)}
            </div>
            {s === 2 && <div className="tape" />}
            <div className="front" />
            {s < 2 && <div className="stamp" />}
          </div>
        ) : (
          <div className="env pickup" aria-hidden="true"><div className="pin"><div className="sign"><b>Abholung Wetzikon ZH</b><span>Bereit nach 2 bis 4 Tagen. Bestellnummer mitbringen, Folie gleich vor Ort prüfen.</span></div></div></div>
        )}
        <div className="dots" aria-hidden="true">{STAGES.map((_, i) => <i key={i} className={i === s ? 'on' : ''} />)}</div>
      </div>
    </section>
  )
}

const POINTS = [
  ['Fotos vom echten Stück', 'Herstellerbilder sind als solche markiert. Alle anderen zeigen genau dein Exemplar.'],
  ['Bezahlen mit TWINT', 'Oder mit Karte, Apple Pay und Google Pay. Bezahlt wird beim Bestellen.'],
  ['Versand innert 3 Werktagen', 'Nach Zahlungseingang, mit B-Post. Nur an Adressen in der Schweiz.'],
  ['Sleeve und Toploader', 'Einzelkarten reisen geschützt im gepolsterten Couvert, ab CHF 50 eingeschrieben.'],
  ['Deutsch oder Englisch', 'Die Sprache steht bei jedem Produkt dabei, und das Regal lässt sich danach filtern.'],
  ['Ehrlicher Bestand', 'Die Zahl im Fach ist die Zahl im Regal. Letztes Stück heisst letztes Stück.'],
  ['14 Tage für Meldungen', 'Stimmt etwas nicht, schicken wir auf unsere Kosten zurück und zahlen den vollen Betrag.'],
  ['Gratis abholen', 'In Wetzikon ZH, mit Bestellnummer. Die Folie prüfst du gleich vor Ort.'],
  ['Unabhängiger Händler', 'Ein kleines Regal statt ein Lagerhaus. Fragen beantworten wir selbst, per E-Mail.'],
]

function Know() {
  const ref = useReveal()
  const px = useScroll()
  return (
    <section className="know" aria-labelledby="know-h" ref={ref}>
      <div className="wrap grid">
        <figure className="shape" data-reveal ref={px}>
          <img src="mood/siegel-s.webp" srcSet="mood/siegel-s.webp 700w, mood/siegel.webp 1400w" sizes="(max-width: 900px) 88vw, 40vw" alt="Hände prüfen die Folie einer versiegelten Box" loading="lazy" width="1045" height="1400" />
          <figcaption>Folie prüfen, bevor es ins Paket geht</figcaption>
        </figure>
        <div>
          <h2 id="know-h" data-reveal>Gut zu wissen, bevor du bestellst</h2>
          <ul className="points">
            {POINTS.map(([t, d], i) => <li key={t} data-reveal style={{ '--i': i % 3 }}><b>{t}</b><p>{d}</p></li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

const FAQ = [
  ['Wie schnell kommt meine Bestellung?', 'Wir versenden innert drei Werktagen nach Zahlungseingang mit B-Post. B-Post braucht meistens ein bis drei weitere Werktage. Das voraussichtliche Datum siehst du im Korb.'],
  ['Was kostet der Versand?', 'Ein bis zwei Booster CHF 2, drei bis sechs Booster CHF 4, jeweils im gepolsterten Brief. Boxen, Bundles und ab sieben Boostern CHF 9 im Paket. Einzelkarten unter CHF 50 im Brief, ab CHF 50 eingeschrieben. Alles kommt in einer Sendung.'],
  ['Kann ich in Wetzikon abholen?', 'Ja, gratis. Wähle im Korb «Abholung» und eine Wunschzeit. Sobald alles bereitliegt, meist nach zwei bis vier Tagen, bekommst du eine E-Mail mit der Adresse. Vor Ort brauchst du nur die Bestellnummer.'],
  ['Sind die Fotos wirklich mein Exemplar?', 'Ja, ausser wo «Herstellerbild» steht. Bei Produkten mit zufälligem Motiv zeigen die Fotos ein Beispiel; auch das steht dabei. Gibt es zwei Exemplare mit unterschiedlichen Macken, wählst du deins aus.'],
  ['Was, wenn etwas nicht stimmt?', 'Melde dich innert 14 Tagen nach Erhalt. Die Rücksendung geht auf unsere Kosten und du erhältst den vollen Betrag zurück.'],
  ['Nehmt ihr geöffnete Ware zurück?', 'Geöffnete versiegelte Ware nehmen wir nicht zurück, so steht es in den Rückgabebedingungen. Prüf die Folie deshalb gleich beim Auspacken oder bei der Abholung.'],
]

function Faq() {
  return (
    <section className="faq wrap" aria-labelledby="faq-h">
      <h2 id="faq-h">Fragen, die oft kommen</h2>
      <div className="qs">
        {FAQ.map(([q, a], i) => (
          <details key={q} open={i === 0}>
            <summary>{q}<GrFormDown aria-hidden="true" /></summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
