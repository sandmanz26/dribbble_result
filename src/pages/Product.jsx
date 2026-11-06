import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { IoIosLeaf, IoIosAirplane, IoIosHappy, IoIosWater, IoIosRefresh, IoIosSync } from 'react-icons/io'
import { flavorBySlug, FLAVORS, PACKS, FREQ, SUB_OFF, FAQ, INGREDIENTS, usd } from '../data.js'
import { useStore } from '../store.jsx'
import { useReveal, Arrow } from '../App.jsx'
import { AddBtn } from '../Twist.jsx'

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
  const gallery = [
    [f.img, `${f.name} device, three-quarter view`], ['spearmint-open', 'The device twisted open with a fine mist'], [`carton-${f.id === 'arctic' ? 'arctic' : 'spearmint'}`, `${f.name} carton front`],
    [f.id === 'arctic' ? 'pocket' : 'in-hand', 'In-hand and in-pocket scale'], ['devices', 'Both devices side by side'], ['m-coffee', 'Lifestyle moment'],
  ]
  const line = { id: f.id, name: f.name, flavor: f.id, img: f.img, packs: P.n, price: each, qty, every: plan === 'sub' ? every : 0 }
  return (
    <div ref={ref} className="pdp" style={{ '--field': f.field, '--accent': f.accent }}>
      <section className="pdp-top wrap">
        <div className="gallery">
          <div className="g-main" key={shot}><img src={`img/${gallery[shot][0]}.webp`} alt={gallery[shot][1]} /></div>
          <div className="g-thumbs" role="tablist" aria-label="Product photos">{gallery.map(([g, a], i) => <button key={g + i} role="tab" aria-selected={shot === i} onClick={() => setShot(i)} aria-label={a}><img src={`img/${g}.webp`} alt="" /></button>)}</div>
        </div>
        <div className="buy">
          <p className="eyebrow">Breath spray · 2-pack</p>
          <h1>{f.name}</h1>
          <p className="one">{f.line}</p>
          <div className="swatches" role="group" aria-label="Flavor">
            {Object.values(FLAVORS).map((x) => <Link key={x.id} to={x.path} aria-current={x.id === f.id ? 'true' : undefined} style={{ '--c': x.field }}><i />{x.name}</Link>)}
          </div>
          <fieldset className="plans">
            <legend className="sr">Purchase option</legend>
            <label className={plan === 'one' ? 'on' : ''}><input type="radio" name="plan" checked={plan === 'one'} onChange={() => setPlan('one')} /><span><b>One-time</b><small>{P.n} × 2-pack</small></span><em>{usd(P.price)}</em></label>
            <label className={plan === 'sub' ? 'on' : ''}><input type="radio" name="plan" checked={plan === 'sub'} onChange={() => setPlan('sub')} /><span><b>Subscribe & save 20%</b><small>Delivered every {every} month{every > 1 ? 's' : ''}. Skip or cancel anytime.</small>
              {plan === 'sub' && <span className="freq" role="group" aria-label="Every">{FREQ.map((n) => <button key={n} type="button" aria-pressed={every === n} onClick={() => setEvery(n)}>{n} mo</button>)}</span>}
            </span><em>{usd(+(P.price * (1 - SUB_OFF)).toFixed(2))}</em></label>
          </fieldset>
          <div className="packs" role="group" aria-label="Pack size">{PACKS.map((x, i) => <button key={x.n} aria-pressed={pack === i} onClick={() => setPack(i)}><b>{x.label}</b><small>{usd(x.price)}{x.save ? ` · ${x.save}` : ''}</small></button>)}</div>
          <div className="buyrow" ref={btn}>
            <span className="qty"><button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="One less">−</button><output>{qty}</output><button onClick={() => setQty((q) => q + 1)} aria-label="One more">+</button></span>
            <AddBtn className="accent grow" line={line}>Add to bag · {usd(each * qty)}</AddBtn>
          </div>
          <p className="under">Free shipping on 2+ packs · 30-day happiness guarantee</p>
          <ul className="icons4">{[[IoIosHappy, 'Sugar free'], [IoIosLeaf, 'Vegan'], [IoIosAirplane, 'TSA ready'], [IoIosWater, '2 × 10 mL']].map(([I, t]) => <li key={t}><span className="ring"><I aria-hidden="true" /></span>{t}</li>)}</ul>
          <div className="acc">
            <details open><summary>How to use</summary><div className="how3">{[[IoIosRefresh, 'Twist to reveal'], [IoIosWater, 'Spray 1 to 2 times'], [IoIosSync, 'Twist closed']].map(([I, t], i) => <span key={t}><span className="ring"><I aria-hidden="true" /></span>{i + 1}. {t}</span>)}</div></details>
            <details><summary>Ingredients</summary><ul className="mini-ings">{INGREDIENTS.map(([n, d]) => <li key={n}><b>{n}</b> {d}</li>)}</ul><p className="small-print">Contains xylitol. Keep out of reach of children and pets.</p></details>
            <details><summary>Size and details</summary><p>2 × 10 mL (0.34 fl oz each). Sprays per device to be confirmed by the manufacturer. TSA compliant.</p></details>
            <details><summary>Shipping and returns</summary><p>Ship times to be set with fulfilment. Free shipping on 2+ packs. 30-day happiness guarantee.</p></details>
          </div>
        </div>
      </section>

      <section className="pdp-twist" data-r><img src="img/spearmint-open.webp" alt="" loading="lazy" /><div><h2>The twist, up close.</h2><p className="ph">VIDEO: full-width loop of the mechanism. Still shown until the shoot.</p></div></section>

      <section className="wrap pdp-more">
        <div className="notes" data-r><h2>Taste notes</h2><p className="big">{f.notes}</p></div>
        <div className="pair" data-r style={{ '--field': other.field }}>
          <h2>Pair it.</h2>
          <Link to={other.path} className="pair-card"><img src={`img/${other.img}.webp`} alt="" /><span><b>{other.name}</b>{other.line}</span><Arrow /></Link>
          <AddBtn className="ghost sm" line={{ id: 'duo', name: 'Duo', flavor: 'duo', img: 'devices', packs: 2, price: 14.99 }}>Or add the Duo, $14.99</AddBtn>
        </div>
        <div className="reviews" data-r><h2>Reviews</h2><p className="muted">Star rating and reviews show once there are 10+ reviews. Filter by flavor and photo reviews come from the reviews app.</p></div>
        <div className="faqsnip" data-r><h2>Asked a lot</h2>{FAQ.flatMap(([, q]) => q).slice(0, 4).map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}<Link to="/faq" className="more">All questions<Arrow /></Link></div>
      </section>

      <div className={`sticky-buy ${sticky ? 'on' : ''}`} aria-hidden={!sticky}>
        <img src={`img/${f.img}.webp`} alt="" /><span><b>{f.name}</b><small>{usd(each)}{plan === 'sub' ? ' · subscribe' : ''}</small></span>
        <AddBtn className="accent sm" line={line}>Add to bag</AddBtn>
      </div>
    </div>
  )
}
