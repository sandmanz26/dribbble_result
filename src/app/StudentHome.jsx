import { useState } from 'react'
import { Link } from 'react-router-dom'
import Shell, { Panel } from './Shell.jsx'
import { AoBar, Icon } from '../ui/kit.jsx'
import { useStore } from '../store.js'
import { markAnswer } from '../data/marker.js'
import { QUESTION } from '../data/taster.js'
import { ANSWERS, AO4_SHARE, DAYS_TO_EXAMS, NEXT_UP, SPEC, STUDENT, WEEK, WEEK_TOTAL, fmtMinutes, scoreOf } from '../data/people.js'

const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const KIND = { rewrite: 'Rewrite', lesson: 'Lesson', check: 'Check' }

export default function StudentHome() {
  const [course, setCourse] = useState('econ')
  const c = STUDENT.courses.find((x) => x.id === course)
  const top = NEXT_UP[0]
  const essays = ANSWERS.filter((a) => a.tariff === 25)
  const st = useStore()
  const mine = (st.attempts || []).slice(-1).map((a) => {
    const r = markAnswer(a.text)
    return { id: 'mine', date: new Date(a.at).toISOString(), q: QUESTION.text, tariff: 9, ao: Object.fromEntries(r.aos.map((x) => [x.id, [x.mark, x.max]])), attempt: st.attempts.length, mine: true }
  })
  const ledger = [...mine, ...[...ANSWERS].reverse()]
  const maxDay = Math.max(...WEEK.map((d) => d.minutes))

  return (
    <Shell
      role="student"
      title="Today"
      sentence={
        <>
          {DAYS_TO_EXAMS} days to the first A-Level papers. Evaluation is where your Economics marks go:{' '}
          <strong className="tnum">
            {AO4_SHARE.gained} of {AO4_SHARE.available}
          </strong>{' '}
          AO4 marks on your last {AO4_SHARE.count} essays.
        </>
      }
      action={
        <Link to="/app/lesson" className="btn">
          Start: {KIND[top.kind].toLowerCase()} <Icon name="arrowRight" />
        </Link>
      }
    >
      <div className="course-switch" role="tablist" aria-label="Subject">
        {STUDENT.courses.map((x) => (
          <button key={x.id} role="tab" aria-selected={course === x.id} className={`seg${course === x.id ? ' is-on' : ''}`} onClick={() => setCourse(x.id)}>
            {x.subject} <span>{x.board}</span>
          </button>
        ))}
      </div>

      {course === 'bus' ? (
        <Panel title="Business, AQA 7132" className="span-all">
          <p className="empty">
            {c.lessonsDone} of {c.lessonsTotal} lessons done. No marked answers yet: Core includes 10 a month.{' '}
            <Link className="link" to="/app/lesson">
              Answer your first Business question
            </Link>
          </p>
        </Panel>
      ) : (
        <div className="grid-student">
          <Panel title="Next up" className="g-next" aside={<span className="muted">In this order</span>}>
            <ol className="next-list">
              {NEXT_UP.map((n, i) => (
                <li key={n.title} className={i === 0 ? 'is-first' : ''}>
                  <span className="next-kind">{KIND[n.kind]}</span>
                  <div>
                    <p className="next-title">{n.title}</p>
                    <p className="next-why">{n.why}</p>
                  </div>
                  <span className="next-min tnum">{n.minutes} min</span>
                  <Link to="/app/lesson" className={`btn is-small${i === 0 ? '' : ' is-quiet'}`} aria-label={`Start ${n.title}`}>
                    Start
                  </Link>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Where your essay marks go" className="g-ao" aside={<span className="muted">Last {essays.length} 25-markers</span>}>
            <div className="ao-split">
              {['AO1', 'AO2', 'AO3', 'AO4'].map((ao) => {
                const g = essays.reduce((s, a) => s + a.ao[ao][0], 0)
                const x = essays.reduce((s, a) => s + a.ao[ao][1], 0)
                const pct = Math.round((g / x) * 100)
                return (
                  <div key={ao} className={`ao-col${ao === 'AO4' ? ' is-gap' : ''}`}>
                    <p className="ao-pct tnum">{pct}%</p>
                    <div className="ao-fill" aria-hidden="true">
                      <i style={{ height: `${pct}%` }} />
                    </div>
                    <p className="ao-name">
                      {ao} {{ AO1: 'Knowledge', AO2: 'Application', AO3: 'Analysis', AO4: 'Evaluation' }[ao]}
                    </p>
                    <p className="ao-raw tnum">
                      {g} of {x}
                    </p>
                  </div>
                )
              })}
            </div>
            <p className="evidence">
              Your evaluation went from 2 of 8 to 5 of 8 when you rewrote the minimum wage essay with a judgement. Do the same for monopolies.
            </p>
          </Panel>

          <Panel title="Marked answers" id="answers" className="g-answers" aside={<span className="muted tnum">{ledger.length} this term</span>}>
            <table className="ledger">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Question</th>
                  <th scope="col">AO1</th>
                  <th scope="col">AO2</th>
                  <th scope="col">AO3</th>
                  <th scope="col">AO4</th>
                  <th scope="col" className="num">
                    Mark
                  </th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((a) => {
                  const s = scoreOf(a)
                  return (
                    <tr key={a.id} className={a.mine ? 'is-new' : ''}>
                      <td className="tnum nowrap">{fmtDate(a.date)}</td>
                      <td>
                        {a.q}
                        {a.mine ? <span className="tag">Just now</span> : a.attempt > 1 && <span className="tag">Rewrite</span>}
                      </td>
                      {['AO1', 'AO2', 'AO3', 'AO4'].map((ao) => (
                        <td key={ao}>{a.ao[ao] ? <AoBar mark={a.ao[ao][0]} max={a.ao[ao][1]} size="s" /> : <span className="dash" aria-label="Not assessed on this question">-</span>}</td>
                      ))}
                      <td className="num tnum nowrap">
                        <strong>
                          {s.mark}/{s.max}
                        </strong>{' '}
                        L{s.level}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Panel>

          <Panel title="This week" className="g-week" aside={<span className="muted">16 to 22 Nov</span>}>
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

          <Panel title="My spec" id="spec" className="g-spec" aside={<span className="muted tnum">{c.lessonsDone} of {c.lessonsTotal} lessons</span>}>
            <ul className="spec">
              {SPEC.map((s) => (
                <li key={s.code}>
                  <span className="spec-code tnum">{s.code}</span>
                  <span className="spec-name">{s.name}</span>
                  <span className="spec-bar" aria-hidden="true">
                    <i style={{ width: `${(s.done / s.total) * 100}%` }} />
                  </span>
                  <span className="spec-n tnum">
                    {s.done}/{s.total}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}
    </Shell>
  )
}
