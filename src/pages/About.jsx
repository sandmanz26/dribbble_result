import { Link } from 'react-router-dom'
import { SlArrowRight as ImArrowRight, SlDrop as ImLeaf, SlEmotsmile as ImHappy, SlClock as ImHourGlass } from 'react-icons/sl'
import { useReveal, Bubbles } from '../App.jsx'

export default function About() {
  const ref = useReveal()
  return (
    <div ref={ref}>
      <section className="ab-hero">
        <div className="wrap ab-grid">
          <div>
            <h1><span>fuwa</span><span>means</span><span className="wob">fluffy.</span></h1>
            <p className="lede">It is the sound Japanese people make for soft things: clouds, pillows, the foam on a well-whisked matcha. We opened Fuwa because we wanted a matcha place that felt that way. Soft, cheerful, and still serious about the tea.</p>
          </div>
          <div className="ab-photo" data-r><img src="img/whisk.webp" alt="A bamboo whisk making fluffy matcha foam in a speckled bowl" /></div>
        </div>
      </section>

      <section className="ab-farm">
        <div className="wrap">
          <h2 data-r>one farm, one spring picking</h2>
          <div className="farm-grid">
            <img className="farm-wide" src="img/field.webp" alt="Tea rows under black shade cloth on a misty hillside in Wazuka" loading="lazy" data-r />
            <div className="farm-text" data-r>
              <p>Our matcha comes from a family tea farm in Wazuka, a quiet valley south-east of Kyoto that has grown tea for about 800 years. They shade the bushes for three weeks, pick once in May, steam and dry the leaves into tencha and mill them on granite.</p>
              <p>We buy the whole lot we need each spring, have it tested by an outside lab for what it says on the tin, and ship it cold. When it runs out, it runs out, and the new season starts.</p>
            </div>
            <img className="farm-sq" src="img/mill.webp" alt="Granite stone mill with matcha powder at the rim" loading="lazy" data-r />
          </div>
        </div>
      </section>

      <section className="ab-values">
        <div className="wrap">
          <h2 data-r>what we care about</h2>
          <ul className="values">
            <li data-r style={{ '--i': 0 }}><ImLeaf aria-hidden="true" /><b>Proper tea</b><p>First harvest only, no cooking grade, no premixed powders, no syrups pretending to be matcha.</p></li>
            <li data-r style={{ '--i': 1 }}><ImHourGlass aria-hidden="true" /><b>Slow on purpose</b><p>Every cup is sifted and whisked by hand. It takes a minute longer. That minute is the point.</p></li>
            <li data-r style={{ '--i': 2 }}><ImHappy aria-hidden="true" /><b>Never precious</b><p>Ask anything, add strawberries, bring the kids. Matcha is a treat, not a test.</p></li>
          </ul>
        </div>
      </section>

      <section className="ab-sift">
        <div className="wrap ab-grid rev">
          <div className="ab-photo" data-r><img src="img/sift.webp" alt="Matcha being sifted into a ceramic bowl" loading="lazy" /></div>
          <div>
            <h2 data-r>how we make your cup</h2>
            <ol className="how" data-r>
              <li><b>Sift</b>2 grams through a fine sieve, so there is not a single lump.</li>
              <li><b>Pour</b>60 ml of water at 80°C. Boiling water burns the sweetness away.</li>
              <li><b>Whisk</b>Fast, in an M shape, for about 20 seconds, until the foam is fine and fluffy.</li>
              <li><b>Serve</b>Straight away, before the foam settles.</li>
            </ol>
            <Link to="/menu" className="btn" data-r>See what we make<ImArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
