import { Link } from 'react-router-dom'
import { NEVER, dateOf, fmtDate } from '../data/awards.js'
import { photo, Night } from '../ui.jsx'

const ROUNDS = [
  ['November to February', 'Entries', 'One entry per product per category: a 400-word answer for each criterion, a demo account and evidence for every number.'],
  ['March', 'Eligibility and declarations', 'We check every entry within ten days and refund the ineligible. Jurors declare interests and are recused where they have one.'],
  ['March to April', 'Scoring', 'At least two jurors score each entry, alone, out of 10 per criterion. Shortlists are the top four weighted totals.'],
  ['May to June', 'Final and citation', 'Finalists demo to the full jury. The highest total wins; the chair breaks ties. Citation and scorecard are published on the night.'],
]
const RULES = [
  'Any company selling software can enter, from any country. Products must have paying customers or active users on the day entries close.',
  'A product may enter up to three categories. Each entry is written for its category and scored separately.',
  'Every number in an entry needs evidence the jury can check. Numbers without evidence are ignored, not penalised.',
  'Jurors score alone first, then meet. A juror may change a score after the meeting, but both scores are kept on record.',
  'A juror connected to an entrant, as investor, adviser, employee or client in the last two years, does not score that entry or category.',
  'The winner is the highest weighted total. If two totals are equal to one decimal, the chair decides and says why on the winner’s page.',
  'Winners’ scorecards are published in full. Finalists receive their own scores privately and may publish them.',
  'If a published result is shown to be wrong, we correct it on the winner’s page and say what changed.',
]

export default function Judging() {
  return (
    <>
      <section className="page-head" aria-labelledby="ph">
        <h1 id="ph" data-rise>How judging works</h1>
        <p data-rise>Four rounds, published criteria, named jurors and printed scores. The rules below are the whole rulebook.</p>
      </section>
      <section className="wrap" style={{ marginTop: 56 }} aria-labelledby="rounds-h">
        <h2 id="rounds-h" className="sr-only">The four rounds</h2>
        <ol className="rounds">
          {ROUNDS.map(([when, t, d]) => <li key={t} data-rise><span className="when">{when}</span><h3>{t}</h3><p>{d}</p></li>)}
        </ol>
      </section>
      <section className="section wrap" aria-labelledby="rules-h">
        <div className="two w48">
          <div>
            <h2 id="rules-h" className="head" data-rise>The rules</h2>
            <img src={photo('keynote')} alt="A speaker presenting to a seated audience" width="1024" height="683" loading="lazy" style={{ marginTop: 32, aspectRatio: '4 / 5', objectFit: 'cover', filter: 'grayscale(1)' }} data-rise />
          </div>
          <ul className="rules" data-rise>{RULES.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      </section>
      <section className="section wrap" aria-labelledby="night-h">
        <h2 id="night-h" className="head" style={{ marginBottom: 32 }} data-rise>Results read aloud, scores printed</h2>
        <Night />
      </section>
      <section className="section wrap" aria-labelledby="never-h">
        <div className="never" style={{ padding: 'clamp(28px,4vw,56px)' }}>
          <h2 id="never-h" className="head" style={{ marginBottom: 28 }} data-rise>What money never buys</h2>
          <ul data-rise style={{ fontSize: 'var(--step-lead)', gap: '12px 48px' }}>{NEVER.map((n) => <li key={n}>{n}</li>)}</ul>
          <p className="muted" style={{ marginTop: 28, maxWidth: '62ch' }} data-rise>Partners sponsor the evening in New York, never a category. Entry fees are the same for every company of the same size, and are listed in full on the front page.</p>
          <p style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}><Link to="/enter" className="btn">Enter by {fmtDate(dateOf('close'))}</Link><a href="#/" onClick={() => setTimeout(() => document.getElementById('fees')?.scrollIntoView(), 60)} className="link">See the fees</a></p>
        </div>
      </section>
    </>
  )
}
