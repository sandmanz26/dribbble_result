import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { IoIosLeaf, IoIosAirplane, IoIosStarOutline, IoIosWater, IoIosRefresh, IoIosSync, IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { flavorBySlug, FLAVORS, PACKS, FREQ, SUB_OFF, FAQ, INGREDIENTS, usd } from '../data.js'
import { useStore } from '../store.jsx'
import { useReveal, Arrow, reduced } from '../App.jsx'
import { AddBtn, LoopDevice } from '../Twist.jsx'

export default function Product() {
  const { slug } = useParams()
  const [sp] = useSearchParams()
  const f = flavorBySlug(slug)
  const other = f.id === 'arctic' ? FLAVORS.spearmint : FLAVORS.arctic
  const s = useStore()
  useEffect(() => s.setFlavor(f.id), [f.id]) // eslint-disable-line
  const [plan, setPlan] = useState('sub')
  const [every, setEvery] = useState(1)
  const [pack, setPack] = useState(0)
  const [qty, setQty] = useState(1)
  const [shot, setShot] = useState(0)
  const [sticky, setSticky] = useState(false)
  const btn = useRef(null)
  const ref = useReveal([slug])
  useEffect(() => { if (sp.get('sub')) setPlan('sub') }, [sp])
  useEffect(() => {
    const el = btn.current; if (!el) return
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(el); return () => io.disconnect()
  }, [])
  const P = PACKS[pack]
  const each = plan === 'sub' ? +(P.price * (1 - SUB_OFF)).toFixed(2) : P.price
  // The brief's 8 slides: 3/4, twist sequence, open with mist, carton, in-hand, in-pocket, lifestyle, ingredients card.
  const gallery = [
    { img: f.img, alt: `${f.name} device, three-quarter view` },
    { node: <LoopDevice flavor={f} mode="twist" />, alt: 'Twist sequence', label: 'GIF: twist sequence, drawn stand-in', thumb: f.img },
    { img: f.open, alt: `${f.name} device twisted open with a fine mist` },
    { img: f.carton, alt: `${f.name} carton front, 2 × 10 mL (0.34 fl oz each)` },
    { img: f.hand, alt: `${f.name} device in hand, for scale` },
    { img: f.pocket, alt: `${f.name} device next to keys, earbuds, lipstick and a card wallet` },
    { img: f.life, alt: 'A real moment: leaning in to say hello' },
    { node: <div className="ing-card"><b>Six ingredients.</b>{INGREDIENTS.map(([n]) => <span key={n}>{n}</span>)}<small>Contains xylitol. Keep out of reach of children and pets.</small></div>, alt: 'Ingredients card', thumb: null },
  ]
  const track = useRef(null)
  const go = (i) => { const n = (i + gallery.length) % gallery.length; setShot(n); const t = track.current; t?.scrollTo({ left: t.clientWidth * n, behavior: reduced() ? 'auto' : 'smooth' }) }
  const onSwipe = () => { const t = track.current; if (t) setShot(Math.round(t.scrollLeft / t.clientWidth)) }
  const line = { id: f.id, name: f.name, flavor: f.id, img: f.img, packs: P.n, price: each, qty, every: plan === 'sub' ? every : 0 }
  return (
    <div ref={ref} className="pdp" style={{ '--field': f.field, '--accent': f.accent }}>
      <section className="pdp-top wrap">
        <div className="gallery" aria-roledescription="carousel" aria-label={`${f.name} photos`}>
          <div className="g-track" ref={track} onScroll={onSwipe}>
            {gallery.map((g, i) => (
              <div key={i} className="g-slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${gallery.length}: ${g.alt}`}>
                {g.img ? <img src={`img/${g.img}.webp`} alt={g.alt} loading={i ? 'lazy' : 'eager'} /> : g.node}
                {g.label && <span className="g-label">{g.label}</span>}
              </div>
            ))}
          </div>
          <button className="g-arrow prev" onClick={() => go(shot - 1)} aria-label="Previous photo"><IoIosArrowBack /></button>
          <button className="g-arrow next" onClick={() => go(shot + 1)} aria-label="Next photo"><IoIosArrowForward /></button>
          <div className="g-thumbs" role="tablist" aria-label="Choose a photo">{gallery.map((g, i) => <button key={i} role="tab" aria-selected={shot === i} onClick={() => go(i)} aria-label={g.alt}>{g.img || g.thumb ? <img src={`img/${g.img || g.thumb}.webp`} alt="" /> : <span className="t-ing">Ingredients</span>}</button>)}</div>
          <div className="g-dots" aria-hidden="true">{gallery.map((_, i) => <i key={i} className={shot === i ? 'on' : ''} />)}</div>
        </div>
        <div className="buy">
          <p className="eyebrow">Breath spray · 2-pack</p>{/* Star rating + count stays hidden until 10+ reviews */}
          <h1>{f.name}</h1>
          <p className="one">{f.line}</p>
          <div className="swatches" role="group" aria-label="Flavor">
            {Object.values(FLAVORS).map((x) => <Link key={x.id} to={x.path} aria-current={x.id === f.id ? 'true' : undefined} style={{ '--c': x.field }}><i />{x.name}</Link>)}
          </div>
          <fieldset className="plans">
            <legend className="sr">Purchase option</legend>
            <label className={plan === 'one' ? 'on' : ''}><input type="radio" name="plan" checked={plan === 'one'} onChange={() => setPlan('one')} /><span><b>One-time</b><small>{P.n} × 2-pack</small></span><em>{usd(P.price)}</em></label>
            <label className={plan === 'sub' ? 'on' : ''}><input type="radio" name="plan" checked={plan === 'sub'} onChange={() => setPlan('sub')} /><span><b>Subscribe & save 20%</b><small>{usd(+(P.price * (1 - SUB_OFF)).toFixed(2))} every {every} month{every > 1 ? 's' : ''}. Skip, pause or cancel anytime.</small>
              {plan === 'sub' && <span className="freq" role="group" aria-label="Every">{FREQ.map((n) => <button key={n} type="button" aria-pressed={every === n} onClick={() => setEvery(n)}>{n} mo</button>)}</span>}
            </span><em><s>{usd(P.price)}</s> {usd(+(P.price * (1 - SUB_OFF)).toFixed(2))}</em></label>
          </fieldset>
          <div className="packs" role="group" aria-label="Pack size">{PACKS.map((x, i) => <button key={x.n} aria-pressed={pack === i} onClick={() => setPack(i)}><b>{x.label}</b><small>{usd(plan === 'sub' ? +(x.price * (1 - SUB_OFF)).toFixed(2) : x.price)}</small>{x.save && <em>{x.save}</em>}</button>)}</div>
          <div className="buyrow" ref={btn}>
            <span className="qty"><button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="One less">−</button><output>{qty}</output><button onClick={() => setQty((q) => q + 1)} aria-label="One more">+</button></span>
            <AddBtn className="accent grow" line={line}>Add to bag · {usd(each * qty)}</AddBtn>
          </div>
          <p className="under">Free shipping on 2+ packs · 30-day happiness guarantee</p>
          <ul className="icons4">{[[IoIosStarOutline, 'Sugar free'], [IoIosLeaf, 'Vegan'], [IoIosAirplane, 'TSA ready'], [IoIosWater, '2 × 10 mL']].map(([I, t]) => <li key={t}><span className="ring"><I aria-hidden="true" /></span>{t}</li>)}</ul>
          <div className="acc">
            <details open><summary>How to use</summary><div className="how3">{[[IoIosRefresh, 'Twist to reveal'], [IoIosWater, 'Spray 1 to 2 times'], [IoIosSync, 'Twist closed']].map(([I, t], i) => <span key={t}><span className="ring"><I aria-hidden="true" /></span>{i + 1}. {t}</span>)}</div></details>
            <details><summary>Ingredients</summary><ul className="mini-ings">{INGREDIENTS.map(([n, d]) => <li key={n}><b>{n}</b> {d}</li>)}</ul><p className="small-print">Contains xylitol. Keep out of reach of children and pets.</p></details>
            <details><summary>Size and details</summary><p>2 × 10 mL (0.34 fl oz each). Sprays per device to be confirmed by the manufacturer. TSA compliant.</p></details>
            <details><summary>Shipping and returns</summary><p>Ship times to be set with fulfilment. Free shipping on 2+ packs. 30-day happiness guarantee.</p></details>
          </div>
        </div>
      </section>

      <section className="pdp-twist" aria-labelledby="up-h">
        <div className="tw-stage"><LoopDevice flavor={f} mode="rise" /><LoopDevice flavor={f} mode="twist" /></div>
        <div className="tw-copy"><h2 id="up-h">The twist, up close.</h2><p>Twist. Spray. Go.</p><p className="ph">VIDEO: full-width loop of the mechanism, muted, with a pause control. Drawn stand-in until the shoot.</p></div>
      </section>

      <section className="wrap pdp-more">
        <div className="notes" data-r><h2>Taste notes</h2><p className="big">{f.notes}</p></div>
        <div className="pair" data-r style={{ '--field': other.field }}>
          <h2>Pair it.</h2>
          <Link to={other.path} className="pair-card"><img src={`img/${other.img}.webp`} alt="" /><span><b>{other.name}</b>{other.line}</span><Arrow /></Link>
          <AddBtn className="ghost sm" line={{ id: 'duo', name: 'Duo', flavor: 'duo', img: 'devices', packs: 2, price: 14.99 }}>Or add the Duo, $14.99</AddBtn>
        </div>
        <div className="reviews" data-r><h2>Reviews</h2>
          <div className="rv-filter" role="group" aria-label="Filter reviews (placeholder)"><button aria-pressed="true">All</button><button aria-pressed="false">Spearmint</button><button aria-pressed="false">Arctic Mint</button><button aria-pressed="false">With photos</button></div>
          <p className="muted">No reviews yet. The star rating and review cards show once there are 10+ reviews, from the reviews app with photo reviews and a flavor filter.</p></div>
        <div className="faqsnip" data-r><h2>Asked a lot</h2>{FAQ.flatMap(([, q]) => q).slice(0, 4).map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}<Link to="/faq" className="more">All questions<Arrow /></Link></div>
      </section>

      <div className={`sticky-buy ${sticky ? 'on' : ''}`} aria-hidden={!sticky}>
        <img src={`img/${f.img}.webp`} alt="" /><span><b>{f.name}</b><small>{usd(each)}{plan === 'sub' ? ' · subscribe' : ''}</small></span>
        <AddBtn className="accent sm" line={line}>Add to bag</AddBtn>
      </div>
    </div>
  )
}
