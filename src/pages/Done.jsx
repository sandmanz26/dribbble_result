import { useParams } from 'react-router-dom'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { nextRoast, fmtDay, usd } from '../data.js'
import { Go } from '../App.jsx'

export default function Done() {
  const { no } = useParams()
  let o = null
  try { o = JSON.parse(sessionStorage.getItem('ripe-last-order')) } catch { /* none */ }
  const rd = nextRoast()
  const steps = [
    ['Order in', 'Today', true],
    ['Roasted', fmtDay(rd.roast), false],
    ['Posted', fmtDay(rd.post), false],
    ['In your cup', 'Two or three days later', false],
  ]
  return (
    <section className="wrap done">
      <div className="done-bags" aria-hidden="true">{(o?.lines || []).slice(0, 4).map((l, i) => <img key={i} src={`img/${l.img}.webp`} alt="" style={{ '--k': i }} />)}</div>
      <h1>Thank you{o?.name ? `, ${o.name.split(' ')[0]}` : ''}. Order <span className="nowrap">{no}</span> is in.</h1>
      <p className="lede">Your coffee goes into the roaster on {fmtDay(rd.roast)}.{o ? ` Total ${usd(o.total)}, ${o.ship.toLowerCase()} delivery.` : ''} We email the tracking link when it leaves.</p>
      <ol className="timeline">{steps.map(([t, d, on], i) => <li key={t} className={on ? 'on' : ''} style={{ '--i': i }}><i /><b>{t}</b><span>{d}</span></li>)}</ol>
      <Go to="/shop" className="btn">Keep browsing<AiOutlineArrowRight aria-hidden="true" /></Go>
      <p className="note">Prototype: nothing was charged or sent.</p>
    </section>
  )
}
