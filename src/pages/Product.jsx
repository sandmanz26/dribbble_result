import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci'
import { CANS, PACKS, FAQ, can, usd } from '../data.js'
import { useBag, useReveal } from '../App.jsx'

export default function Product() {
  const { id } = useParams()
  const c = can(id)
  const nav = useNavigate()
  const bag = useBag()
  const [pack, setPack] = useState(12)
  const [sub, setSub] = useState(false)
  const [qty, setQty] = useState(1)
  const [shot, setShot] = useState(0)
  const ref = useReveal([id])
  const p = PACKS.find((x) => x.n === pack)
  const price = p.price * (sub ? 0.85 : 1)
  const shots = [c.img, 'pour', 'pond', 'tray']
  return (
    <div ref={ref} className="product">
      <section className="pd">
        <div className="pd-gallery">
          <div className="pd-main" key={shots[shot] + c.id}><img src={`img/${shots[shot]}.webp`} alt={shot === 0 ? `KUMO ${c.name} can` : ''} /></div>
          <div className="pd-thumbs">{shots.map((s, i) => <button key={s} aria-pressed={shot === i} onClick={() => setShot(i)} aria-label={`Photo ${i + 1}`}><img src={`img/${s}.webp`} alt="" /></button>)}</div>
        </div>
        <div className="pd-info">
          <h1>{c.name}</h1>
          <p className="pd-line">{c.line}</p>
          <div className="pd-opt">
            <span>Flavour</span>
            <div className="variants">{CANS.map((x) => <button key={x.id} aria-pressed={x.id === c.id} onClick={() => { nav(`/shop/${x.id}`, { replace: true }); setShot(0) }}><i style={{ background: x.dot }} />{x.short}</button>)}</div>
          </div>
          <div className="pd-opt">
            <span>Pack</span>
            <div className="packs">{PACKS.map((x) => <button key={x.n} aria-pressed={pack === x.n} onClick={() => setPack(x.n)}><b>{x.n} cans</b><small>{usd(x.price / x.n)} a can</small></button>)}</div>
          </div>
          <label className="sub"><input type="checkbox" checked={sub} onChange={(e) => setSub(e.target.checked)} /><i aria-hidden="true" /><span><b>Every month, 15% off</b><small>Skip or stop any time before the next box.</small></span></label>
          <div className="pd-buy">
            <div className="qty"><button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="One less"><CiCircleMinus /></button><output>{qty}</output><button onClick={() => setQty((q) => Math.min(9, q + 1))} aria-label="One more"><CiCirclePlus /></button></div>
            <button className="btn grow" onClick={() => bag.add({ id: c.id, pack, sub, qty, price })}>Add to bag · {usd(price * qty)}</button>
          </div>
          <p className="pd-ship">Ships cold within two days. Free over $45.</p>
          <div className="pd-details">
            <details open><summary>Ingredients</summary><p>{c.ings.join(', ')}.</p></details>
            <details><summary>Per can (250 ml)</summary><dl><div><dt>Energy</dt><dd>{c.kcal} kcal</dd></div><div><dt>Sugars</dt><dd>{c.sugar} g</dd></div><div><dt>Caffeine</dt><dd>about {c.caf} mg</dd></div></dl></details>
            <details><summary>Keeping</summary><p>Nine months unopened, kept cool. Turn the can over gently before opening, a little real matcha settles.</p></details>
          </div>
        </div>
      </section>

      <section className="pd-faq">
        <h2 data-r>Questions</h2>
        <div className="qs">{FAQ.map(([q, a]) => <details key={q} data-r><summary>{q}</summary><p>{a}</p></details>)}</div>
      </section>

      <section className="pd-others">
        <h2 data-r>Also in the range</h2>
        <div className="cans small">
          {CANS.filter((x) => x.id !== c.id).map((x, i) => (
            <Link key={x.id} to={`/shop/${x.id}`} className="can-card" style={{ '--i': i }} data-r>
              <div className="can-img"><img src={`img/${x.img}.webp`} alt={`KUMO ${x.name}`} loading="lazy" /></div>
              <span className="can-name"><i style={{ background: x.dot }} />{x.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
