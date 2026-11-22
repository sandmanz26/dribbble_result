import { useState } from 'react'
import { Link } from 'react-router-dom'
import Shell, { Panel } from './Shell.jsx'
import { AoBar, Icon, MarginCode } from '../ui/kit.jsx'
import { AO_MAX_25, HOMEWORK, REVIEW_ANSWER, REVIEW_QUEUE, levelOf25 } from '../data/people.js'

const NAMES = { AO1: 'Knowledge', AO2: 'Application', AO3: 'Analysis', AO4: 'Evaluation' }

export default function TeacherReview() {
  const [marks, setMarks] = useState(REVIEW_ANSWER.aiMarks)
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)
  const total = Object.values(marks).reduce((a, b) => a + b, 0)
  const aiTotal = Object.values(REVIEW_ANSWER.aiMarks).reduce((a, b) => a + b, 0)
  const changed = total !== aiTotal
  const queuePos = REVIEW_QUEUE.findIndex((s) => s.name === REVIEW_ANSWER.student) + 1
  const lowCount = REVIEW_QUEUE.filter((s) => s.confidence === 'low').length

  const bump = (ao, d) => setMarks((m) => ({ ...m, [ao]: Math.max(0, Math.min(AO_MAX_25[ao], m[ao] + d)) }))

  return (
    <Shell
      role="teacher"
      title={`Check: ${REVIEW_ANSWER.student}`}
      sentence={
        <>
          {queuePos} of {lowCount} marks to check. The AI gave {aiTotal}/25, Level {levelOf25(aiTotal)}, and is not sure: it sits one mark under Level 4.
        </>
      }
      action={
        <Link to="/teacher" className="btn is-quiet">
          <Icon name="arrowLeft" /> Back to 13E
        </Link>
      }
    >
      <div className="grid-review">
        <Panel title="Answer" className="g-script" aside={<span className="muted">{HOMEWORK.tariff} marks</span>}>
          <p className="hw-q">{HOMEWORK.title}</p>
          <div className="script" data-ui>
            <ol className="script-lines">
              {REVIEW_ANSWER.paragraphs.map((p, i) => (
                <li key={i}>
                  <p>{p.text}</p>
                  <span className="script-codes">
                    {p.codes.map((c) => (
                      <MarginCode key={c} code={c} />
                    ))}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Panel>

        <div className="g-marks">
          <Panel title="Marks" aside={<span className="kpi-inline tnum">{total}/25 · Level {levelOf25(total)}</span>}>
            <ul className="steppers">
              {Object.entries(AO_MAX_25).map(([ao, max]) => (
                <li key={ao}>
                  <span className="st-name">
                    <strong>{ao}</strong> {NAMES[ao]}
                  </span>
                  <AoBar mark={marks[ao]} max={max} size="s" />
                  <span className="stepper">
                    <button aria-label={`Lower ${ao}`} onClick={() => bump(ao, -1)} disabled={done}>
                      −
                    </button>
                    <span className="tnum" aria-live="polite">
                      {marks[ao]}/{max}
                    </span>
                    <button aria-label={`Raise ${ao}`} onClick={() => bump(ao, 1)} disabled={done}>
                      +
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            {changed && (
              <p className="evidence">
                You changed the AI’s {aiTotal} to {total}. Your mark is the one Aisha sees, and the change teaches the marker for this question.
              </p>
            )}
          </Panel>

          <Panel title="Why the AI held it at Level 3">
            <p>{REVIEW_ANSWER.aiNote}</p>
            <p className="evidence">{REVIEW_ANSWER.descriptorMissed}</p>
          </Panel>

          <Panel title="Your comment to Aisha">
            <label className="sr-only" htmlFor="tnote">
              Comment
            </label>
            <textarea id="tnote" className="note-box" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional. Shown under the AI’s feedback." disabled={done} />
            <div className="row-actions">
              {done ? (
                <p className="released" role="status">
                  <Icon name="check" size={18} /> Released to Aisha at {total}/25. Next: Olivia Grant.
                </p>
              ) : (
                <button className="btn" onClick={() => setDone(true)}>
                  Release {total}/25 to Aisha
                </button>
              )}
              <Link to="/teacher" className="btn is-quiet">
                {done ? 'Back to the queue' : 'Skip for now'}
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
