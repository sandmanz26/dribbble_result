import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Alert } from '../ui/index.jsx'

const FINDINGS = [
  {
    finding: 'Price is the first question, and asking for a phone number before a price loses people.',
    change: 'Vehicle and ZIP on the home page, price on step 4, contact details last. The hero says "No phone number or email until you book".',
  },
  {
    finding: 'Many customers know the symptom, not the repair.',
    change: 'Two ways in: "What I am noticing" maps symptoms to a service and explains why. "I know what I need" skips straight to the list.',
  },
  {
    finding: 'Failed visits come from the location, not the technician: apartment rules, sloped streets, no keys.',
    change: 'Location type and access notes before scheduling, with a specific warning for apartment, workplace and street parking. "Will you be there?" is asked up front.',
  },
  {
    finding: 'Trust drops when someone unknown comes to the house.',
    change: 'Technician card with name, certification and the van to look for. Texts at assignment and 30 minutes out.',
  },
  {
    finding: 'Fear of on-site upselling is a reason not to book mobile.',
    change: 'Extra work is a request in the app with the measurement, the reason and the price. "Not now" never changes the original quote.',
  },
  {
    finding: 'After the acquisition, customers are unsure if their booking and warranty still count.',
    change: 'One plain sentence on home and in the FAQ: history and warranty carry over. Same wording in both brands.',
  },
]

const FLOW = [
  ['Vehicle', 'Plate lookup with year, make, model fallback'],
  ['Brakes', 'Symptoms or service, then axle'],
  ['Location', 'ZIP check, address, spot type, access notes'],
  ['Price', 'Itemised quote, Standard or Premium parts'],
  ['Time', 'Arrival window, will you be there'],
  ['Book', 'Name, mobile, email. No payment, pay after the job'],
]

export default function Notes() {
  return (
    <section className="section">
      <div className="wrap stack-lg">
        <div className="page-head">
          <h1 className="display-lg">Project notes</h1>
          <p className="lede">
            How the brief became this prototype: what changed in the quote and booking flow, why, and what is still open.
          </p>
        </div>

        <Alert tone="info" title="The path-to-purchase study was not shared with the brief">
          The findings below are working hypotheses from public reviews of mobile repair services and the brief itself.
          Each one maps to a design change, so when the real study arrives the table is easy to confirm or rewrite.
        </Alert>

        <div className="table-scroll" role="region" aria-label="Findings and design changes" tabIndex={0}>
          <table className="notes-table">
            <thead><tr><th scope="col">Hypothesis from the path to purchase</th><th scope="col">What changed in the design</th></tr></thead>
            <tbody>
              {FINDINGS.map((f) => (
                <tr key={f.finding}><td data-label="Hypothesis">{f.finding}</td><td data-label="Design change">{f.change}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="split">
          <div className="split-side">
            <h2 className="display-sm">The redesigned quote flow</h2>
            <p className="muted">Six short steps. Each one can be resumed: the draft is saved on the device.</p>
            <Link to="/quote/vehicle" className="text-link">Try it <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <ol className="flow-list">
            {FLOW.map(([a, b]) => <li key={a}><strong>{a}</strong><span className="muted">{b}</span></li>)}
          </ol>
        </div>

        <div className="split">
          <div className="split-side">
            <h2 className="display-sm">Dual brand</h2>
          </div>
          <div className="stack-sm">
            <p>NuBrakes keeps its name with a Valvoline endorsement. The Valvoline version runs the same product as "Mobile Brake Service". Both are token sets on one component library, so the business can run both, or move markets from one to the other, without a redesign.</p>
            <Link to="/system" className="text-link">See the design system <ArrowRight size={16} aria-hidden /></Link>
          </div>
        </div>

        <div className="split">
          <div className="split-side">
            <h2 className="display-sm">Open questions</h2>
          </div>
          <ul className="dash-list">
            <li>Does Valvoline's system already define an error colour separate from brand red?</li>
            <li>Is payment taken after the job today, or is a card held at booking?</li>
            <li>Which markets stay NuBrakes and which move to the Valvoline brand, and when?</li>
            <li>Can technicians send readings from their own app, so approval requests carry real measurements?</li>
          </ul>
        </div>

        <div className="split">
          <div className="split-side">
            <h2 className="display-sm">How AI fits in the process</h2>
          </div>
          <ul className="dash-list">
            <li>Research synthesis: clustering reviews and study notes into themes, which I then check against the source.</li>
            <li>Token plumbing: generating the token tables and DTCG file from one source so Figma and code do not drift.</li>
            <li>Building prototypes like this one in code, so states and edge cases are real instead of drawn.</li>
            <li>Design decisions, copy tone and sign-off stay with people: me, the product manager and the Valvoline UX lead.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
