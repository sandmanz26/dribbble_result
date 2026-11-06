import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { useReveal, reduced } from '../App.jsx'
import Device from '../Device.jsx'
import { Ingredients } from './Home.jsx'

// The device twists open step by step as you scroll: Twist, Spray, Go.
export default function HowItWorks() {
  const s = useStore()
  const ref = useReveal()
  const sec = useRef(null)
  const [p, setP] = useState(reduced() ? 1 : 0)
  useEffect(() => {
    if (reduced()) return
    let raf = 0
    const run = () => { raf = 0; const r = sec.current.getBoundingClientRect(); setP(Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)))) }
    const ask = () => { if (!raf) raf = requestAnimationFrame(run) }
    addEventListener('scroll', ask, { passive: true }); run()
    return () => removeEventListener('scroll', ask)
  }, [])
  const step = p < 0.34 ? 0 : p < 0.67 ? 1 : 2
  const caps = [['Twist', 'A quarter turn reveals the nozzle.'], ['Spray', 'One or two sprays into your mouth.'], ['Go', 'Twist it closed. Lean in. You’re good.']]
  return (
    <div ref={ref}>
      <section className="hiw" ref={sec} style={{ '--field': s.f.field, '--accent': s.f.accent }}>
        <div className="hiw-pin">
          <Device flavor={s.f} open={Math.min(1, p * 2.2) * (p > 0.9 ? Math.max(0, 1 - (p - 0.9) * 10) : 1)} className="hiw-dev" />
          <ol className="hiw-steps">{caps.map(([t, d], i) => <li key={t} className={i === step ? 'on' : ''}><b>{t}</b><span>{d}</span></li>)}</ol>
        </div>
      </section>
      <section className="wrap sec two">
        <div data-r><h2>Why a twist?</h2><p className="big">No cap to lose. No leaks in your pocket. And honestly, it’s fun.</p></div>
        <img src="img/spearmint-open.webp" alt="The nozzle revealed after a quarter turn" loading="lazy" data-r />
      </section>
      <Ingredients id="hiw-in" />
      <section className="wrap sec two">
        <div data-r><h2>How long does it last?</h2><p>Sprays per device and how long one lasts at 3 to 4 uses a day are being confirmed by the manufacturer. We will print the real number here, not a guess.</p></div>
        <div className="ph-block" data-r>NUMBER: sprays per device, from the manufacturer</div>
      </section>
      <section className="wrap sec two">
        <img src="img/pocket.webp" alt="The device next to keys, earbuds, lipstick and a card wallet" loading="lazy" data-r />
        <div data-r><h2>Take it anywhere.</h2><p>Each device is 10 mL, well under the 3.4 oz carry-on limit. Pocket, bag, glovebox, gym locker.</p></div>
      </section>
      <section className="ctaband"><h2>Shop the 2-pack.</h2><Link to={s.f.path} className="btn accent">Shop {s.f.name}, $7.99</Link></section>
    </div>
  )
}
