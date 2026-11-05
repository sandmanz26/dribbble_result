import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineLock, AiOutlineArrowRight } from 'react-icons/ai'
import { useCart } from '../store.jsx'
import { usd, GRINDS, nextRoast, fmtDay } from '../data.js'
import { Go, FREE_SHIP } from '../App.jsx'
import { transition } from '../motion.js'

const SHIP = [
  { id: 'std', name: 'Standard', d: '2 to 3 days after posting', price: 5 },
  { id: 'next', name: 'Next day', d: 'The day after posting', price: 9 },
  { id: 'pick', name: 'Pick up at the roastery', d: 'From Wednesday 10:00', price: 0 },
]

export default function Checkout() {
  const cart = useCart()
  const nav = useNavigate()
  const [v, setV] = useState({ email: '', name: '', street: '', city: '', zip: '', country: 'United States' })
  const [ship, setShip] = useState('std')
  const [err, setErr] = useState({})
  const s = SHIP.find((x) => x.id === ship)
  const free = cart.hasSub || cart.sub >= FREE_SHIP
  const shipCost = ship === 'pick' ? 0 : free && ship === 'std' ? 0 : s.price
  const total = cart.sub + shipCost
  const rd = nextRoast()
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const x = {}
    if (!/^\S+@\S+\.\S+$/.test(v.email)) x.email = 'An email for the order and the tracking link.'
    if (v.name.trim().length < 2) x.name = 'Who is the coffee for?'
    if (ship !== 'pick') {
      if (v.street.trim().length < 3) x.street = 'Street and house number.'
      if (v.city.trim().length < 2) x.city = 'Town or city.'
      if (v.zip.trim().length < 3) x.zip = 'Postal code.'
    }
    setErr(x)
    if (Object.keys(x).length) { document.querySelector(`[name="${Object.keys(x)[0]}"]`)?.focus(); return }
    const no = `RP-${Math.floor(1000 + Math.random() * 9000)}`
    sessionStorage.setItem('ripe-last-order', JSON.stringify({ no, name: v.name, total, ship: s.name, lines: cart.lines.map((l) => ({ n: l.c.name, q: l.qty, img: l.c.img, c: l.c.colour })) }))
    cart.clear()
    transition(nav, `/order/${no}`)
  }
  if (!cart.lines.length) return (
    <section className="wrap co-empty">
      <h1>Your bag is empty</h1>
      <p>Pick a coffee first. Tuesday is roast day.</p>
      <Go to="/shop" className="btn">Shop the coffees<AiOutlineArrowRight aria-hidden="true" /></Go>
    </section>
  )
  const F = ({ k, label, auto, wide, type = 'text' }) => (
    <label className={wide ? 'full' : ''}>{label}<input name={k} type={type} value={v[k]} onChange={set(k)} autoComplete={auto} aria-invalid={!!err[k]} />{err[k] && <span className="err">{err[k]}</span>}</label>
  )
  return (
    <section className="wrap co">
      <form className="co-form" onSubmit={submit} noValidate>
        <h1>Check out</h1>
        <fieldset>
          <legend>You</legend>
          <div className="fields">{F({ k: 'email', label: 'Email', auto: 'email', type: 'email', wide: true })}{F({ k: 'name', label: 'Full name', auto: 'name', wide: true })}</div>
        </fieldset>
        <fieldset>
          <legend>Delivery</legend>
          <div className="ship-opts">
            {SHIP.map((x) => (
              <label key={x.id} className={ship === x.id ? 'on' : ''}>
                <input type="radio" name="ship" checked={ship === x.id} onChange={() => setShip(x.id)} />
                <span><b>{x.name}</b><small>{x.d}</small></span>
                <em>{x.id === 'pick' ? 'Free' : free && x.id === 'std' ? 'Free' : usd(x.price)}</em>
              </label>
            ))}
          </div>
          {ship !== 'pick' && (
            <div className="fields">{F({ k: 'street', label: 'Street and number', auto: 'address-line1', wide: true })}{F({ k: 'city', label: 'City', auto: 'address-level2' })}{F({ k: 'zip', label: 'Postal code', auto: 'postal-code' })}
              <label className="full">Country<select value={v.country} onChange={set('country')}>{['United States', 'Canada', 'United Kingdom', 'Australia'].map((c) => <option key={c}>{c}</option>)}</select></label>
            </div>
          )}
        </fieldset>
        <fieldset>
          <legend>Payment</legend>
          <p className="pay-note"><AiOutlineLock aria-hidden="true" />In the live shop the payment provider's own secure form opens here. This prototype takes no payment details.</p>
        </fieldset>
        <button className="btn wide">Place order, {usd(total)}</button>
      </form>
      <aside className="co-sum" aria-label="Order summary">
        <h2>Your order</h2>
        <ul>{cart.lines.map((l) => (
          <li key={l.key} style={{ '--c': l.c.colour }}>
            <div className="dl-pic"><img src={`img/${l.c.img}.webp`} alt="" /><em>{l.qty}</em></div>
            <span><b>{l.c.name}</b><small>{l.size === 1000 ? '1 kg' : '250 g'}, {GRINDS.find((g) => g.id === l.grind)?.name.toLowerCase()}{l.sub ? `, every ${l.sub} weeks` : ''}</small></span>
            <b>{usd(l.total)}</b>
          </li>
        ))}</ul>
        <dl>
          <div><dt>Subtotal</dt><dd>{usd(cart.sub)}</dd></div>
          <div><dt>Delivery</dt><dd>{shipCost ? usd(shipCost) : 'Free'}</dd></div>
          <div className="tot"><dt>Total</dt><dd>{usd(total)}</dd></div>
        </dl>
        <p className="co-roast">Roasted {fmtDay(rd.roast)}, posted {fmtDay(rd.post)}.</p>
      </aside>
    </section>
  )
}
