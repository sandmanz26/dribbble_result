import { Link } from 'react-router-dom'
import { CiLocationArrow1 } from 'react-icons/ci'
import { CANS, FACTS } from '../data.js'
import { useReveal, useDrift } from '../App.jsx'

export default function Home() {
  const ref = useReveal()
  useDrift()
  return (
    <div ref={ref}>
      <section className="hero" aria-labelledby="h-h">
        <div className="hero-img"><img src="img/hero.webp" alt="A KUMO can on a limestone plinth with leaf shadows on the wall" width="2200" height="1238" /></div>
        <div className="hero-text">
          <span className="vert" lang="ja" aria-hidden="true">抹茶ラテ</span>
          <h1 id="h-h">A quiet can<br />of matcha.</h1>
          <p>First-harvest matcha from Kagoshima, whisked cold into milk and sealed the same day. Nothing to add, nothing to hurry.</p>
          <Link to="/shop/original" className="btn">Shop the cans<CiLocationArrow1 aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="sec ings" aria-labelledby="i-h">
        <div className="ings-img" data-r><img src="img/powder.webp" alt="A small mound of matcha powder and tencha leaves on limestone" loading="lazy" data-drift /></div>
        <div className="ings-text">
          <h2 id="i-h" data-r>Three ingredients.<br />Nothing to hide.</h2>
          <ol className="three" data-r>
            <li><b>Matcha</b><span>2 g of first-harvest, stone-milled matcha in every can. Not an extract, the whole leaf.</span></li>
            <li><b>Milk</b><span>Whole milk, or oat in the Oat can. Cold, so the matcha stays sweet.</span></li>
            <li><b>Cane sugar</b><span>9 g, about half a usual latte. The Pure can has none.</span></li>
          </ol>
          <p className="note" data-r>No preservatives, no flavourings, no colour added. The green is the tea.</p>
        </div>
      </section>

      <section className="sec origin" aria-labelledby="o-h">
        <div className="origin-head">
          <h2 id="o-h" data-r>Grown in shade,<br />picked once a year.</h2>
        </div>
        <div className="origin-img" data-r><img src="img/field.webp" alt="Rows of tea under black shade cloth in morning mist, Kagoshima" loading="lazy" data-drift /></div>
        <dl className="facts">
          {FACTS.map(([n, a, b], i) => <div key={a} data-r style={{ '--i': i }}><dt>{n}</dt><dd><b>{a}</b>{b}</dd></div>)}
        </dl>
      </section>

      <section className="sec range" aria-labelledby="r-h">
        <div className="range-head">
          <h2 id="r-h" data-r>Three ways.</h2>
        </div>
        <div className="cans">
          {CANS.map((c, i) => (
            <Link key={c.id} to={`/shop/${c.id}`} className="can-card" style={{ '--i': i }} data-r>
              <div className="can-img"><img src={`img/${c.img}.webp`} alt={`KUMO ${c.name}`} loading="lazy" /></div>
              <span className="can-name"><i style={{ background: c.dot }} />{c.name}</span>
              <span className="can-line">{c.line}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="moment" aria-labelledby="m-h">
        <div className="moment-img"><img src="img/engawa.webp" alt="A person sitting on a wooden veranda facing a moss garden, a KUMO can beside them" loading="lazy" data-drift /></div>
        <div className="moment-text">
          <h2 id="m-h" data-r>Open it slowly.</h2>
          <p data-r>Turn the can over once, crack it, and give it a minute somewhere quiet. It was made to be noticed.</p>
          <Link to="/shop/original" className="btn light" data-r>Find your can</Link>
        </div>
      </section>
    </div>
  )
}
