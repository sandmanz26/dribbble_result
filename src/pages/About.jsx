import { Link } from 'react-router-dom'
import { STEPS } from '../data.js'
import { useReveal, useDrift } from '../App.jsx'

export default function About() {
  const ref = useReveal()
  useDrift()
  return (
    <div ref={ref} className="about">
      <section className="ab-hero">
        <p className="ab-jp" lang="ja" aria-hidden="true">雲</p>
        <h1>Kumo means cloud.</h1>
        <p className="ab-lede">We wanted a matcha you could carry, without losing what makes matcha worth drinking: the shade, the first harvest, the stone, and a minute of calm. So we started with the tea and worked backwards to the can.</p>
      </section>

      <section className="ab-wide" data-r><img src="img/pond.webp" alt="A hand holding a KUMO can by a still pond at dawn" loading="lazy" data-drift /></section>

      <section className="ab-steps">
        <h2 data-r>From field to can</h2>
        <ol>
          {STEPS.map((s, i) => (
            <li key={s.t} className={i % 2 ? 'flip' : ''}>
              <div className="st-img" data-r><img src={`img/${s.img}.webp`} alt="" loading="lazy" data-drift /></div>
              <div className="st-text" data-r><span className="kicker">{String(i + 1).padStart(2, '0')}</span><h3>{s.t}</h3><p>{s.d}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="ab-promise">
        <h2 data-r>What we will not do</h2>
        <ul data-r>
          <li>Use matcha extract, flavouring or colour to make it look greener.</li>
          <li>Blend in second-harvest or autumn leaf to make it cheaper.</li>
          <li>Add preservatives to make the date longer.</li>
          <li>Print a grade on the can we cannot show you the lot number for.</li>
        </ul>
        <Link to="/shop/original" className="btn" data-r>Taste it</Link>
      </section>
    </div>
  )
}
