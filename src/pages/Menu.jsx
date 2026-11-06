import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { ImCross, ImPlus, ImMug, ImCart } from 'react-icons/im'
import { MENU, CATS, usd } from '../data.js'
import { useOrder, useReveal, useSectionColours } from '../App.jsx'

const MILKS = [['Dairy', 0], ['Oat', 0.8], ['Soy', 0.8], ['Coconut', 0.8]]
const SWEET = ['None', 'A little', 'Regular']

export default function Menu() {
  const [sp, setSp] = useSearchParams()
  const cat = sp.get('cat') || 'all'
  const open = MENU.find((m) => m.id === sp.get('item'))
  const list = useMemo(() => MENU.filter((m) => cat === 'all' || m.cat === cat), [cat])
  const ref = useReveal([cat])
  useSectionColours([])
  const o = useOrder()
  return (
    <div ref={ref} className="menu-page" data-bg="#fbf3e2">
      <section className="menu-hero wrap">
        <h1>the menu</h1>
        <p className="lede">Every drink starts with matcha sifted and whisked by hand. Order ahead and it will be waiting, or pick at the counter and watch.</p>
      </section>
      <div className="cats-bar">
        <div className="wrap cats" role="tablist" aria-label="Menu sections">
          <button role="tab" aria-selected={cat === 'all'} onClick={() => setSp({})}>Everything</button>
          {CATS.map((c) => <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => setSp({ cat: c.id })}>{c.name}</button>)}
        </div>
      </div>
      <section className="wrap menu-grid" key={cat}>
        {list.map((m, i) => (
          <button key={m.id} className="item" style={{ '--bg': m.bg, '--i': i }} onClick={() => setSp(cat === 'all' ? { item: m.id } : { cat, item: m.id })} data-r>
            <div className="item-pic"><img src={`img/${m.img}.webp`} alt="" loading="lazy" /></div>
            <div className="item-body">
              <span className="jp" lang="ja">{m.jp}</span>
              <h2>{m.name}</h2>
              <p>{m.line}</p>
              <div className="item-foot"><b>{usd(m.price)}</b><span className="add-dot" aria-hidden="true"><ImPlus /></span></div>
            </div>
          </button>
        ))}
      </section>
      {open && createPortal(<Sheet m={open} close={() => setSp(cat === 'all' ? {} : { cat })} />, document.body)}
      {o.count > 0 && createPortal(
        <div className="order-bar" role="region" aria-label="Your order">
          <ImCart aria-hidden="true" />
          <span><b>{o.count} {o.count === 1 ? 'item' : 'items'}, {usd(o.total)}</b><small>Pick up at the counter, ready about 8 minutes after you arrive</small></span>
          <button className="btn sm" onClick={() => { o.say(`Order FW-${Math.floor(100 + Math.random() * 900)} placed. See you soon. (prototype)`); o.clear() }}>Place pick-up order</button>
        </div>, document.body
      )}
    </div>
  )
}

function Sheet({ m, close }) {
  const o = useOrder()
  const drink = !['sweet', 'home'].includes(m.cat)
  const [milk, setMilk] = useState(0)
  const [sweet, setSweet] = useState(1)
  const [ice, setIce] = useState(m.tags.includes('Iced'))
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && close()
    addEventListener('keydown', k); document.body.style.overflow = 'hidden'
    return () => { removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, []) // eslint-disable-line
  const milky = drink && m.cat === 'latte'
  const price = m.price + (milky ? MILKS[milk][1] : 0)
  return (
    <div className="sheet-wrap" onClick={close}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={m.name} style={{ '--bg': m.bg }} onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={close} aria-label="Close"><ImCross /></button>
        <div className="sheet-pic"><img src={`img/${m.img}.webp`} alt={m.name} /></div>
        <div className="sheet-body">
          <span className="jp" lang="ja">{m.jp}</span>
          <h2>{m.name}</h2>
          <p>{m.line}</p>
          <ul className="tags">{m.tags.map((t) => <li key={t}>{t}</li>)}<li><ImMug aria-hidden="true" />Caffeine: {m.caf}</li></ul>
          {milky && (
            <fieldset><legend>Milk</legend><div className="pills">{MILKS.map(([n, p], i) => <button key={n} aria-pressed={milk === i} onClick={() => setMilk(i)}>{n}{p ? ` +${usd(p)}` : ''}</button>)}</div></fieldset>
          )}
          {drink && (
            <fieldset><legend>Sweetness</legend><div className="pills">{SWEET.map((n, i) => <button key={n} aria-pressed={sweet === i} onClick={() => setSweet(i)}>{n}</button>)}</div></fieldset>
          )}
          {drink && m.id !== 'float' && (
            <fieldset><legend>How</legend><div className="pills">{['Hot', 'Iced'].map((n) => <button key={n} aria-pressed={(n === 'Iced') === ice} onClick={() => setIce(n === 'Iced')}>{n}</button>)}</div></fieldset>
          )}
          <button className="btn wide" onClick={() => { o.add({ name: m.name, price }); close() }}>Add to pick-up order, {usd(price)}</button>
        </div>
      </div>
    </div>
  )
}
