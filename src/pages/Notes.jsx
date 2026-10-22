import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { UX_NOTES } from '../data/uxnotes.js'
import { Alert } from '../ui/index.jsx'
import { PROPOSED } from './System.jsx'

const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty']
const asWord = (n) => WORDS[n] || String(n)

// What the role description asks for, and where this prototype answers it.
const BRIEF = [
  ['Translate existing pages and flows into Valvoline’s system', 'Home, services, service detail, quote, booking and my bookings, all built from one component set.', '/'],
  ['Extend the system for both brands', 'Shared components, brand themes as tokens. NuBrakes and Valvoline, light and dark, side by side.', '/system'],
  ['Redesign key flows from path-to-purchase findings', `${asWord(UX_NOTES.length)} small, reasoned changes to quote, book and after the visit, each with a metric. Numbered on the screens.`, '/quote/vehicle'],
  ['Responsive hi-fi screens with empty, loading and error states', 'Every data surface has all three. The Prototype panel can slow the network or fail requests.', '/bookings'],
  ['Propose components where the system has no mobile-service pattern', `${asWord(PROPOSED.length)} components, from service area check to the receipt and warranty after the job.`, '/system'],
  ['Clean, developer-ready files', 'Tokens export as W3C DTCG JSON. Component props match the Figma properties listed on the System page.', '/system'],
]

const PLAN = [
  ['Week 1', 'Audit current NuBrakes pages and flows against the Valvoline library. Map every screen to existing components and list the gaps. Read the path-to-purchase study with the PM.'],
  ['Weeks 2 to 3', 'Theme layer: Semantic collection with NuBrakes and Valvoline modes in Figma. Reskin home and service pages on desktop and mobile. First review with the Valvoline UX lead.'],
  ['Weeks 4 to 6', 'Quote and booking flows with all states. Recommendations from the study annotated on the frames, ranked by expected impact and effort.'],
  ['Weeks 7 to 8', 'New mobile-service components proposed into the system with variants and documentation. Handoff files, review rounds, fixes from engineering questions.'],
]

export default function Notes() {
  return (
    <section className="section">
      <div className="wrap stack-lg">
        <div className="page-head">
          <h1 className="display-lg">Project notes</h1>
          <p className="lede">
            The role is a reskin first: existing NuBrakes pages and flows, brought into Valvoline’s design system for both brands, with
            small UX improvements flagged where they make a real difference. This prototype shows how I would approach it.
          </p>
        </div>

        <div className="table-scroll" role="region" aria-label="What the role asks for" tabIndex={0}>
          <table className="notes-table">
            <thead><tr><th scope="col">The role asks for</th><th scope="col">In this prototype</th></tr></thead>
            <tbody>
              {BRIEF.map(([ask, answer, to]) => (
                <tr key={ask}>
                  <td data-label="The role asks for">{ask}</td>
                  <td data-label="In this prototype">{answer} <Link to={to} className="text-link">See it <ArrowRight size={14} aria-hidden /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Alert tone="info" title="What I did not have">
          The Valvoline design system file, the current NuBrakes screens and the path-to-purchase study are not public. Brand values are
          placeholders in one token file, pages follow how NuBrakes describes its service, and each recommendation below is written so the
          study can confirm, reprioritise or drop it.
        </Alert>

        <div className="stack-md">
          <div className="page-head">
            <h2 className="display-md">UX recommendations</h2>
            <p className="muted">Small changes inside the existing flow structure, each with how we would know it worked. The same numbers appear on the screens when UX notes are on.</p>
          </div>
          <div className="table-scroll" role="region" aria-label="UX recommendations" tabIndex={0}>
            <table className="notes-table notes-table-3">
              <thead><tr><th scope="col">Recommendation</th><th scope="col">Why</th><th scope="col">Measure</th></tr></thead>
              <tbody>
                {UX_NOTES.map((n, i) => (
                  <tr key={n.id}>
                    <td data-label="Recommendation">
                      <strong>{i + 1}. {n.title}</strong>
                      <Link to={n.where === '/booking' ? '/bookings' : n.where} className="text-link small">On screen <ArrowRight size={14} aria-hidden /></Link>
                    </td>
                    <td data-label="Why">{n.why}</td>
                    <td data-label="Measure" className="muted">{n.measure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="split">
          <div className="split-side">
            <h2 className="display-sm">Two directions</h2>
            <p className="muted">Switch between them in the Prototype panel. Same flows, data, brands and recommendations.</p>
          </div>
          <dl className="lines lines-directions">
            <div><dt>V1 Editorial</dt><dd>Large type, soft surfaces, quote card beside the headline, summary in a side column. Closer to a consumer brand site. Suits the NuBrakes voice.</dd></div>
            <div><dt>V2 Job ticket</dt><dd>Square edges, ruled lines, IBM Plex with mono figures. Quote as one search strip, prices as a board, the visit as a timeline with times, steps as a rail. Closer to a service desk. Suits Valvoline's retail and fleet tone.</dd></div>
            <div><dt>What stays fixed</dt><dd>Components, props, colour tokens and the single accent per brand. V2 only changes type, shape and layout tokens plus a few layouts, which is the same mechanism the brand switch uses.</dd></div>
          </dl>
        </div>

        <div className="split">
          <div className="split-side">
            <h2 className="display-sm">Dual brand</h2>
          </div>
          <div className="stack-sm">
            <p>NuBrakes keeps its name with a Valvoline endorsement. The Valvoline version runs the same product as "Mobile Brake Service". Both are token sets on one component library, so the business can run both, or move markets from one to the other, without a redesign.</p>
            <p className="muted">Found while theming: Valvoline red read as the primary action, the selected state and the error colour at once. Selection is now navy and the cancel button an outline, so red fill only means the main action. To confirm with the UX lead.</p>
            <Link to="/system" className="text-link">See the design system <ArrowRight size={16} aria-hidden /></Link>
          </div>
        </div>

        <div className="split">
          <div className="split-side">
            <h2 className="display-sm">How the Figma files would be set up</h2>
          </div>
          <ul className="dash-list">
            <li>Valvoline library stays the source. A Semantic variable collection adds four modes: NuBrakes light and dark, Valvoline light and dark. Frames switch brand by mode.</li>
            <li>New mobile-service components live in a separate page as proposals until the UX lead signs them off, then move into the library.</li>
            <li>Every component uses auto layout and variants for size, state and tone. Property names match the code props.</li>
            <li>Flows are laid out left to right per step, mobile above desktop, with loading, empty and error frames next to the happy path.</li>
            <li>Recommendations sit as numbered annotations on the frames, so product and UX can accept or reject each one in review.</li>
          </ul>
        </div>

        <div className="split">
          <div className="split-side">
            <h2 className="display-sm">A plan for November and December</h2>
            <p className="muted">Based on 20 to 40 hours a week, async, with check-ins in US East Coast hours.</p>
          </div>
          <ol className="flow-list flow-list-plan">
            {PLAN.map(([when, what]) => <li key={when}><strong>{when}</strong><span className="muted">{what}</span></li>)}
          </ol>
        </div>

        <div className="split">
          <div className="split-side">
            <h2 className="display-sm">Questions for the PM and UX lead</h2>
          </div>
          <ul className="dash-list">
            <li>Does Valvoline’s system define an error colour separate from brand red?</li>
            <li>Is payment taken after the job today, or is a card held at booking?</li>
            <li>Which markets stay NuBrakes and which move to the Valvoline brand, and when?</li>
            <li>Which flows does the path-to-purchase study cover, and what are the current drop-off points?</li>
            <li>Can the technician app send measurements, so approval requests carry real readings?</li>
          </ul>
        </div>

        <div className="split">
          <div className="split-side">
            <h2 className="display-sm">How I use AI</h2>
          </div>
          <ul className="dash-list">
            <li>Exploring options faster: several layout and hierarchy directions for a screen before choosing one to refine by hand.</li>
            <li>Research synthesis: grouping study notes and reviews into themes, which I then check against the source.</li>
            <li>Token plumbing: generating token tables and the DTCG file from one source so Figma and code do not drift.</li>
            <li>Prototyping in code, like this one, so states and edge cases are real instead of drawn.</li>
            <li>Design decisions, copy and sign-off stay with people: me, the PM and the Valvoline UX lead.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
