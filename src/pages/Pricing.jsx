import { Link } from 'react-router-dom'
import { Icon, Section } from '../ui/kit.jsx'
import { SiteFooter, SiteNav } from '../ui/SiteChrome.jsx'
import Receipt, { PLANS } from './Receipt.jsx'

const ROWS = [
  ['Free lessons, one in each subject', [true, true, true]],
  ['Your first marked answer', [true, true, true]],
  ['Marked answers each month', ['10', 'Unlimited, fair use', 'Unlimited, fair use']],
  ['Question generator and topic explainer', [true, true, true]],
  ['Exam technique guide', [true, true, true]],
  ['Full-marks example answers', [false, true, true]],
  ['Photograph a handwritten answer', [false, true, true]],
  ['Extracts and case studies marked in context', [false, true, true]],
  ['Every lesson in your spec, in spec order', [false, false, true]],
  ['AI tutor inside every lesson', [false, false, true]],
  ['Free parent view', [true, true, true]],
]

export default function Pricing() {
  return (
    <div className="site">
      <SiteNav />
      <main id="main">
        <section className="page-head">
          <h1 className="page-h">Pricing</h1>
          <p className="lead">Try a lesson and get an answer marked before you pay anything. Then pay per subject, by the month.</p>
        </section>
        <section className="pricing-band is-page" aria-labelledby="pp-h">
          <Receipt headingId="pp-h" />
        </section>
        <Section className="compare" aria-labelledby="cmp-h">
          <h2 id="cmp-h" className="h-head" data-rise>
            What each plan includes
          </h2>
          <div className="compare-wrap" data-rise>
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Per subject, per month</th>
                  {PLANS.map((p) => (
                    <th scope="col" key={p.id}>
                      {p.name}
                      <span className="tnum">£{p.price.toFixed(2)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, vals]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {vals.map((v, i) => (
                      <td key={i}>
                        {v === true ? <Icon name="check" label="Included" /> : v === false ? <span className="no" aria-label="Not included">Not included</span> : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="compare-note" data-rise>
            Schools and colleges pay per class, with teacher checking of AI marks.{' '}
            <Link className="link" to="/start?role=teacher">
              Set up a class
            </Link>
          </p>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
