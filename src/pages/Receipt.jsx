import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, useReveal } from '../ui/kit.jsx'
import { SUBJECTS } from '../data/taster.js'

// ExamAce's live prices (November 2026). Each subject is its own subscription.
export const PLANS = [
  { id: 'core', name: 'Core', price: 9.99, line: 'Marking and practice', gets: ['10 marked answers a month', 'Question generator and topic explainer', 'Exam technique guide', 'Progress by topic'] },
  { id: 'aceit', name: 'Ace It', price: 12.99, line: 'Unlimited marking', gets: ['Everything in Core', 'Unlimited marked answers, fair use', 'Full-marks example answers', 'Photograph handwritten answers', 'Extracts and case studies marked in context'] },
  { id: 'complete', name: 'Complete', price: 20.99, line: 'Lessons, tutor and marking', gets: ['Everything in Ace It', 'Every lesson in your spec, in spec order', 'AI tutor inside every lesson', 'Progress across every paper'] },
]

const money = (n) => `£${n.toFixed(2)}`

export default function Receipt({ headingId = 'receipt-h', compact = false }) {
  const ref = useReveal()
  const [plan, setPlan] = useState('complete')
  const [subjects, setSubjects] = useState(['economics'])
  const p = PLANS.find((x) => x.id === plan)
  const chosen = SUBJECTS.filter((s) => subjects.includes(s.id))
  const total = Math.round(chosen.length * p.price * 100) / 100
  const toggle = (id) => setSubjects((cur) => (cur.includes(id) ? (cur.length > 1 ? cur.filter((x) => x !== id) : cur) : [...cur, id]))

  return (
    <div className="receipt" ref={ref}>
      <div className="receipt-left">
        <h2 id={headingId} className="h-head" data-rise>
          Pay per subject
        </h2>
        <p className="lead" data-rise>
          One price for each subject you take, monthly, cancel any time. Every plan starts with a free marked answer.
        </p>
        <fieldset className="opts" data-rise>
          <legend>Plan</legend>
          {PLANS.map((x) => (
            <label key={x.id} className={`opt${plan === x.id ? ' is-on' : ''}`}>
              <input type="radio" name={`plan-${headingId}`} value={x.id} checked={plan === x.id} onChange={() => setPlan(x.id)} />
              <span className="opt-name">{x.name}</span>
              <span className="opt-line">{x.line}</span>
              <span className="opt-price tnum">{money(x.price)}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="opts opts-subjects" data-rise>
          <legend>Subjects</legend>
          {SUBJECTS.map((s) => (
            <label key={s.id} className={`chip${subjects.includes(s.id) ? ' is-on' : ''}`}>
              <input type="checkbox" checked={subjects.includes(s.id)} onChange={() => toggle(s.id)} />
              {subjects.includes(s.id) && <Icon name="check" size={18} />}
              {s.name}
            </label>
          ))}
        </fieldset>
        {!compact && (
          <p className="receipt-school" data-rise>
            Teaching a class? School prices are per class, with teacher checking built in.{' '}
            <Link className="link" to="/start?role=teacher">
              Set up a class
            </Link>
          </p>
        )}
      </div>
      <div className="slip-wrap">
        <div className="slip" data-rise aria-live="polite">
          <p className="slip-name">ExamAce, {p.name}</p>
          <ul className="slip-rows">
            {chosen.map((s) => (
              <li key={s.id}>
                <span>{s.name}, monthly</span>
                <span className="tnum">{money(p.price)}</span>
              </li>
            ))}
            {p.gets.map((g) => (
              <li key={g} className="slip-inc">
                <span>{g}</span>
                <span>incl.</span>
              </li>
            ))}
            <li className="slip-inc">
              <span>First marked answer</span>
              <span>free</span>
            </li>
          </ul>
          <div className="slip-bar" />
          <p className="slip-total">
            <span>A month</span>
            <strong className="tnum">{money(total)}</strong>
          </p>
          <Link to={`/start?plan=${plan}`} className="btn slip-btn">
            Start with a free answer <Icon name="arrowRight" />
          </Link>
        </div>
      </div>
    </div>
  )
}
