import { useState } from 'react'
import { Link } from 'react-router-dom'
import Shell, { Panel } from './Shell.jsx'
import { Icon } from '../ui/kit.jsx'
import { ANSWERS, DAYS_TO_EXAMS, PARENT, PARENT_MONTHLY, WEEK, WEEK_TOTAL, fmtMinutes, scoreOf } from '../data/people.js'

const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

export default function ParentHome() {
  const share = { time: true, marks: true, answers: false, nudges: true }
  const [asked, setAsked] = useState(false)
  const daysActive = WEEK.filter((d) => d.minutes > 0).length
  const essays = ANSWERS.filter((a) => a.tariff === 25).map((a) => ({ ...a, s: scoreOf(a) }))
  const first = essays[0].s.level
  const last = essays[essays.length - 1].s.level
  const maxDay = Math.max(...WEEK.map((d) => d.minutes))

  return (
    <Shell
      role="parent"
      title="Maya this week"
      sentence={
        <>
          Revised on <strong>{daysActive} of 7 days</strong>, {fmtMinutes(WEEK_TOTAL.minutes)} in all. Her Economics essays moved from Level {first} to Level {last} since October.
        </>
      }
    >
      <div className="grid-parent">
        <Panel title="Worth asking about" className="g-ask">
          <p className="ask-big">“You rewrote the minimum wage essay and jumped a level. What did you change?”</p>
          <p className="evidence">
            Her first try scored 15 of 25 (Level 3). The rewrite on 17 November scored 20 of 25 (Level 4), mostly from a clearer final judgement.
          </p>
        </Panel>

        <Panel title="Time revised" className="g-pweek" aside={<span className="muted">16 to 22 Nov</span>}>
          <p className="kpi tnum">{fmtMinutes(WEEK_TOTAL.minutes)}</p>
          <p className="kpi-sub tnum">
            {WEEK_TOTAL.lessons} lessons · {WEEK_TOTAL.marked} answers marked
          </p>
          <div className="week" role="img" aria-label="Minutes revised each day this week">
            {WEEK.map((d) => (
              <div key={d.day} className="week-day">
                <span className="week-bar" style={{ height: `${(d.minutes / maxDay) * 100}%` }} data-zero={d.minutes === 0 || undefined} />
                <span className="week-label">{d.day}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Essay marks, Economics" id="marks" className="g-pmarks" aside={<span className="muted">25-mark essays, Level 1 to 5</span>}>
          <div className="levels" role="img" aria-label={`Essay levels: ${essays.map((e) => `Level ${e.s.level}`).join(', ')}`}>
            {[5, 4, 3, 2, 1].map((lv) => (
              <div className="lv-row" key={lv}>
                <span className="lv-label">Level {lv}</span>
                {essays.map((e) => (
                  <span key={e.id} className={`lv-cell${e.s.level === lv ? ' is-on' : ''}`}>
                    {e.s.level === lv && <span className="tnum">{e.s.mark}</span>}
                  </span>
                ))}
              </div>
            ))}
            <div className="lv-row lv-dates">
              <span className="lv-label" />
              {essays.map((e) => (
                <span key={e.id} className="lv-cell tnum">
                  {fmtDate(e.date)}
                </span>
              ))}
            </div>
          </div>
          <p className="evidence">AI marks are a guide to her level, not a grade. Her teacher checks homework marks before they count.</p>
        </Panel>

        <Panel title="Exams" className="g-exams">
          <p className="kpi tnum">{DAYS_TO_EXAMS} days</p>
          <p className="kpi-sub">to the first A-Level papers, week of 10 May 2027. Results day is Thursday 12 August 2027.</p>
          <p className="muted small">Dates are the boards’ provisional timetable.</p>
        </Panel>

        <Panel title="What Maya shares with you" id="sharing" className="g-share" aside={<span className="muted">Maya chose this</span>}>
          <ul className="toggles">
            {[
              ['time', 'Time revised and lessons done'],
              ['marks', 'Marks and levels'],
              ['answers', 'Her written answers'],
              ['nudges', 'A note if she misses three days'],
            ].map(([k, l]) => (
              <li key={k}>
                <span>{l}</span>
                <span className={`state${share[k] ? ' is-on' : ''}`}>{share[k] ? 'Shared' : 'Private'}</span>
              </li>
            ))}
          </ul>
          <p className="evidence">Only Maya can change these, from her own account. You can ask her to share an answer.</p>
          <button className="btn is-quiet is-small" onClick={() => setAsked(true)} disabled={asked}>
            <Icon name="send" size={18} /> {asked ? 'Request sent to Maya' : 'Ask Maya to share an answer'}
          </button>
        </Panel>

        <Panel title="Plan and billing" id="billing" className="g-bill" aside={<span className="muted">Renews {PARENT.renews}</span>}>
          <table className="bill">
            <tbody>
              {PARENT.billing.map((b) => (
                <tr key={b.subject}>
                  <td>
                    {b.subject}, {b.plan}
                  </td>
                  <td className="num tnum">£{b.price.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bill-total">
                <td>A month</td>
                <td className="num tnum">£{PARENT_MONTHLY.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div className="row-actions">
            <Link to="/pricing" className="btn is-quiet is-small">
              Change plan
            </Link>
            <button className="btn is-quiet is-small">Cancel a subject</button>
          </div>
          <p className="muted small">Business is on Core: 10 marked answers a month. She has used 0 this month.</p>
        </Panel>
      </div>
    </Shell>
  )
}
