import { useState } from 'react'
import { Link } from 'react-router-dom'
import Shell, { Panel } from './Shell.jsx'
import { Icon } from '../ui/kit.jsx'
import { AO_CLASS, AO_MAX_25, CLASS, HOMEWORK, REVIEW_QUEUE, STOPPED_AT_L3, SUBMITTED, TEACHER, classTotal, levelOf25 } from '../data/people.js'

const CONF = { low: 'Check first', medium: 'Worth a look', high: 'Confident' }

export default function TeacherHome() {
  const [released, setReleased] = useState(false)
  const [drill, setDrill] = useState(false)
  const [nudged, setNudged] = useState(false)
  const toCheck = REVIEW_QUEUE.filter((s) => s.confidence === 'low')
  const missing = CLASS.filter((s) => !s.sub)
  const highs = REVIEW_QUEUE.filter((s) => s.confidence === 'high')
  const ao4 = AO_CLASS.find((a) => a.ao === 'AO4')

  return (
    <Shell
      role="teacher"
      title={TEACHER.className}
      sentence={
        <>
          {SUBMITTED.length} of {CLASS.length} have answered the minimum wage essay. <strong>{toCheck.length} marks need your check</strong> before
          students see them. Evaluation is the class gap at {ao4.pct}%.
        </>
      }
      action={
        <Link to="/teacher/review" className="btn">
          Check {toCheck.length} marks <Icon name="arrowRight" />
        </Link>
      }
    >
      <div className="grid-teacher">
        <Panel
          title="AI marks waiting for you"
          id="homework"
          className="g-queue"
          aside={
            <span className="muted">
              Due {HOMEWORK.due} · {HOMEWORK.tariff} marks
            </span>
          }
        >
          <p className="hw-q">{HOMEWORK.title}</p>
          <table className="ledger queue">
            <thead>
              <tr>
                <th scope="col">Student</th>
                <th scope="col" className="num">
                  AI mark
                </th>
                <th scope="col">Level</th>
                <th scope="col">Marker</th>
                <th scope="col" className="num">
                  Words
                </th>
                <th scope="col">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {REVIEW_QUEUE.slice(0, 8).map((s) => {
                const t = classTotal(s)
                const isReleased = released && s.confidence === 'high'
                return (
                  <tr key={s.name} className={s.confidence === 'low' ? 'is-flag' : ''}>
                    <td>
                      <span className="person-inline">
                        <span className="who-mark is-small" aria-hidden="true">
                          {s.name
                            .split(' ')
                            .map((p) => p[0])
                            .join('')}
                        </span>
                        {s.name}
                      </span>
                    </td>
                    <td className="num tnum">
                      <strong>{t}</strong>/25
                    </td>
                    <td>Level {levelOf25(t)}</td>
                    <td>
                      <span className={`conf conf-${s.confidence}`}>{CONF[s.confidence]}</span>
                    </td>
                    <td className="num tnum">{s.words}</td>
                    <td className="num">
                      {isReleased ? (
                        <span className="muted">Released</span>
                      ) : (
                        <Link to="/teacher/review" className={`btn is-small${s.confidence === 'low' ? '' : ' is-quiet'}`}>
                          Check
                        </Link>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="row-actions">
            <button className="btn is-quiet is-small" onClick={() => setReleased(true)} disabled={released}>
              {released ? `${highs.length} confident marks released` : `Release the ${highs.length} confident marks`}
            </button>
            <span className="muted small">Showing 8 of {SUBMITTED.length}, least sure first.</span>
          </div>
        </Panel>

        <Panel title="Class by AO" id="class" className="g-heat" aside={<span className="muted">Share of marks gained</span>}>
          <div className="aoclass">
            {AO_CLASS.map((a) => (
              <div key={a.ao} className={`aoc${a.ao === 'AO4' ? ' is-gap' : ''}`}>
                <span className="aoc-name">{a.ao}</span>
                <span className="aoc-bar" aria-hidden="true">
                  <i style={{ width: `${a.pct}%` }} />
                </span>
                <span className="aoc-n tnum">{a.pct}%</span>
              </div>
            ))}
          </div>
          <table className="heat" aria-label="Each student’s share of marks by AO">
            <thead>
              <tr>
                <th scope="col">Student</th>
                {Object.keys(AO_MAX_25).map((ao) => (
                  <th scope="col" key={ao}>
                    {ao}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUBMITTED.map((s) => (
                <tr key={s.name}>
                  <th scope="row">{s.name}</th>
                  {Object.entries(AO_MAX_25).map(([ao, max]) => {
                    const p = s.sub[ao] / max
                    return (
                      <td key={ao} className="tnum" style={{ '--p': p }} data-band={p >= 0.75 ? 'hi' : p >= 0.5 ? 'mid' : 'lo'}>
                        {s.sub[ao]}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Stopped at Level 3 or below" className="g-drill">
          <p className="kpi tnum">{STOPPED_AT_L3.length}</p>
          <p className="kpi-sub">{STOPPED_AT_L3.map((s) => s.name.split(' ')[0]).join(', ')}</p>
          <p className="evidence">All {STOPPED_AT_L3.length} lost the most marks on AO4: no judgement, or “it depends” without saying on what.</p>
          <button className="btn is-small" onClick={() => setDrill(true)} disabled={drill}>
            {drill ? 'Drill set for Monday' : 'Set a 10-minute evaluation drill'}
          </button>
        </Panel>

        <Panel title="Not handed in" className="g-missing">
          <ul className="missing">
            {missing.map((s) => (
              <li key={s.name}>{s.name}</li>
            ))}
          </ul>
          <button className="btn is-quiet is-small" onClick={() => setNudged(true)} disabled={nudged}>
            {nudged ? 'Reminder sent' : `Remind all ${missing.length}`}
          </button>
        </Panel>
      </div>
    </Shell>
  )
}
