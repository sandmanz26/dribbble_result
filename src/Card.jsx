import { AiOutlinePlus } from 'react-icons/ai'
import { Go } from './App.jsx'
import { useCart } from './store.jsx'
import { tilt, untilt } from './motion.js'
import { usd } from './data.js'

// A coffee as an object on the shelf: the bag leans toward the pointer, the price is one tap away.
export default function Card({ c, i = 0 }) {
  const cart = useCart()
  const mark = (e) => { const img = e.currentTarget.closest('.card')?.querySelector('.card-bag img'); if (img) img.style.viewTransitionName = 'bag' }
  return (
    <article className="card" style={{ '--c': c.colour, '--ink-c': c.ink, '--i': i }} onPointerMove={tilt} onPointerLeave={untilt} data-r>
      <Go to={`/coffee/${c.id}`} vt="bag" className="card-bag" onClick={mark} aria-label={`${c.name}, ${c.origin}`}>
        <span className="card-disc" aria-hidden="true" />
        <img src={`img/${c.img}.webp`} alt="" width="720" height="900" loading="lazy" />
      </Go>
      <div className="card-body">
        <p className="card-origin">{c.origin}, {c.roast.toLowerCase()} roast</p>
        <h3><Go to={`/coffee/${c.id}`} vt="bag" onClick={mark}>{c.name}</Go></h3>
        <p className="card-notes">{c.notes.join(', ')}</p>
        <div className="card-buy">
          <span><b>{usd(c.price[250])}</b> 250 g</span>
          <button className="add" onClick={() => cart.add({ id: c.id, size: 250, grind: 'whole' })} aria-label={`Add ${c.name}, 250 g whole bean`}><AiOutlinePlus aria-hidden="true" />Add</button>
        </div>
      </div>
    </article>
  )
}
