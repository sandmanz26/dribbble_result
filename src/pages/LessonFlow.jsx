import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AoBar, Icon, MarginCode } from '../ui/kit.jsx'
import { EXTRACT, LESSON, QUESTION, SAMPLES } from '../data/taster.js'
import { markAnswer, splitSentences } from '../data/marker.js'
import { getState, setState } from '../store.js'

export const STEPS = ['Learn', 'Check', 'Answer', 'Your mark']

// The tutor's scripted replies in the prototype, keyed by question.
const TUTOR = {
  why: (r) =>
    r.next
      ? `You lost most marks on ${r.next.ao}. ${r.next.text} Your sentence “${(r.annotated.find((a) => a.codes.includes('?')) || r.annotated[0] || { text: '' }).text.slice(0, 90)}” makes a claim without saying why, so it earns nothing yet.`
      : 'Nothing lost here. For a 25-mark version you would also need a judgement: does the long-run PED of −0.6 change your answer?',
  chain: () =>
    'A chain is three links. Duty rises, so the pump price rises. Demand is inelastic, so quantity falls by a smaller percentage than price rises. So price × quantity, the tax take, goes up. Each “so” is a link an examiner can tick.',
  inelastic: () =>
    'Inelastic means the PED is between 0 and −1. At −0.2, a 10% price rise cuts petrol bought by only about 2%. People still need to get to work.',
}

export default function LessonFlow({ mode = 'taster', onStepChange }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [text, setTextRaw] = useState(() => getState().draft || '')
  const [reached, setReached] = useState(0)
  const setText = (v) => {
    setTextRaw(v)
    setState({ draft: v })
  }
  const [attempts, setAttempts] = useState(() => getState().attempts || [])
  const [marking, setMarking] = useState(false)
  const topRef = useRef(null)
  const firstRender = useRef(true)

  useEffect(() => {
    onStepChange && onStepChange(step)
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }, [step])

  const go = (n) => {
    setStep(n)
    setReached((r) => Math.max(r, n))
  }

  const submit = () => {
    const r = markAnswer(text)
    const entry = { at: Date.now(), total: r.total, level: r.level, text }
    const next = [...attempts, entry]
    setAttempts(next)
    setState({ attempts: next })
    setMarking(true)
    go(3)
  }

  return (
    <div className={`flow flow-${mode}`} ref={topRef}>
      <ol className="flow-steps" aria-label="Lesson steps">
        {STEPS.map((s, i) => {
          const canGo = i !== step && i <= reached && !(i === 3 && !attempts.length) && !marking
          return (
            <li key={s} className={i === step ? 'is-now' : i <= reached ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
              {canGo ? (
                <button className="flow-jump" onClick={() => go(i)}>
                  <span className="flow-dot">
                    <Icon name="check" size={14} />
                  </span>
                  {s}
                </button>
              ) : (
                <span className="flow-jump is-static">
                  <span className="flow-dot">{i < step ? <Icon name="check" size={14} /> : null}</span>
                  {s}
                </span>
              )}
            </li>
          )
        })}
      </ol>

      {step === 0 && <Learn onNext={() => go(1)} onSkip={() => go(2)} mode={mode} />}
      {step === 1 && <Checks answers={answers} setAnswers={setAnswers} onNext={() => go(2)} onBack={() => go(0)} />}
      {step === 2 && <Answer text={text} setText={setText} onSubmit={submit} onBack={() => go(1)} attempts={attempts} />}
      {step === 3 && (
        <Result
          text={text}
          attempts={attempts}
          marking={marking}
          doneMarking={() => setMarking(false)}
          onRewrite={() => go(2)}
          mode={mode}
        />
      )}
    </div>
  )
}

function Learn({ onNext, onSkip, mode }) {
  const [ask, setAsk] = useState(null)
  return (
    <div className="learn">
      <header className="lesson-head">
        <p className="lesson-meta">
          {LESSON.subject} · {LESSON.spec}
        </p>
        <h1 className="lesson-h">{LESSON.title}</h1>
        <div className="lesson-start">
          <p className="lesson-time">
            <Icon name="clock" size={18} /> About {LESSON.minutes} minutes, then one exam question
          </p>
          <button className="btn is-quiet is-small" onClick={onSkip}>
            I know this, go to the question <Icon name="arrowRight" size={18} />
          </button>
        </div>
      </header>

      <section className="learn-block" aria-labelledby="idea-h">
        <h2 id="idea-h">{LESSON.idea.heading}</h2>
        {LESSON.idea.body.map((p, i) => (
          <p key={i} className={i === 1 ? 'formula' : ''}>
            {p}
          </p>
        ))}
      </section>

      <aside className="examiner-note" aria-label="Examiner’s note">
        <h2 className="examiner-who">{LESSON.author}, A-Level examiner</h2>
        <p>{LESSON.examinerNote}</p>
        {mode === 'app' && (
          <div className="note-tutor">
            <p className="note-tutor-h">Ask the tutor about this lesson</p>
            <div className="tutor-chips">
              <button className={`pick is-light${ask === 'inelastic' ? ' is-on' : ''}`} onClick={() => setAsk('inelastic')}>
                Explain inelastic again
              </button>
              <button className={`pick is-light${ask === 'chain' ? ' is-on' : ''}`} onClick={() => setAsk('chain')}>
                How do I write a chain?
              </button>
            </div>
            {ask && (
              <p className="tutor-reply" role="status">
                {TUTOR[ask]()}
              </p>
            )}
          </div>
        )}
      </aside>

      <section className="learn-block" aria-labelledby="worked-h">
        <h2 id="worked-h">{LESSON.worked.heading}</h2>
        <figure className="worked-photo">
          <img className="photo" src="img/petrol.webp" width="1600" height="900" alt="A driver filling a car at a petrol station on a rainy evening" />
        </figure>
        <table className="worked">
          <tbody>
            {LESSON.worked.steps.map(([a, b]) => (
              <tr key={a}>
                <td>{a}</td>
                <td className="tnum">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>{LESSON.worked.takeaway}</p>
      </section>

      <div className="flow-actions">
        <button className="btn" onClick={onNext}>
          Check I’ve got it <Icon name="arrowRight" />
        </button>
      </div>
    </div>
  )
}

function Checks({ answers, setAnswers, onNext, onBack }) {
  const right = LESSON.checks.filter((c, i) => answers[i] === c.answer).length
  const done = Object.keys(answers).length === LESSON.checks.length
  return (
    <div className="checks">
      <header className="lesson-head">
        <h1 className="lesson-h is-small">Three quick checks</h1>
        <p className="lesson-time">Tap an answer. You see why straight away.</p>
      </header>
      {LESSON.checks.map((c, i) => {
        const picked = answers[i]
        const isDone = picked !== undefined
        return (
          <fieldset className="check" key={i}>
            <legend>{c.q}</legend>
            <div className="check-opts">
              {c.options.map((o, j) => {
                const state = !isDone ? '' : j === c.answer ? ' is-right' : j === picked ? ' is-wrong' : ' is-dim'
                return (
                  <button
                    key={o}
                    className={`check-opt${state}`}
                    disabled={isDone}
                    onClick={() => setAnswers({ ...answers, [i]: j })}
                    aria-pressed={picked === j}
                  >
                    {isDone && j === c.answer && <Icon name="check" size={18} />}
                    {isDone && j === picked && j !== c.answer && <Icon name="cross" size={18} />}
                    {o}
                  </button>
                )
              })}
            </div>
            {isDone && (
              <p className="check-why" role="status">
                {picked === c.answer ? 'Right. ' : 'Not quite. '}
                {c.why}
              </p>
            )}
          </fieldset>
        )
      })}
      <div className="flow-actions">
        <button className="btn" onClick={onNext} disabled={!done}>
          {done ? `${right} of 3. Now the exam question` : 'Answer all three to go on'} <Icon name="arrowRight" />
        </button>
        <button className="btn is-quiet" onClick={onBack}>
          Back to the lesson
        </button>
      </div>
    </div>
  )
}

function Answer({ text, setText, onSubmit, onBack, attempts }) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const [timer, setTimer] = useState(null)
  useEffect(() => {
    if (timer === null || timer <= 0) return
    const t = setTimeout(() => setTimer((x) => x - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])
  const mmss = (n) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`
  const onKey = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && words >= 8) onSubmit()
  }
  const last = attempts[attempts.length - 1]
  const lastResult = useMemo(() => (last ? markAnswer(last.text) : null), [last])
  const area = useRef(null)
  const addStarter = (s) => {
    const sep = text && !/\s$/.test(text) ? ' ' : ''
    setText(text + sep + s)
    requestAnimationFrame(() => {
      if (area.current) {
        area.current.focus()
        area.current.selectionStart = area.current.selectionEnd = area.current.value.length
      }
    })
  }
  return (
    <div className="answer">
      <header className="lesson-head">
        <p className="lesson-meta">
          {QUESTION.marks} marks · about {QUESTION.suggestedMinutes} minutes in the exam
        </p>
        <h1 className="lesson-h is-q">{QUESTION.text}</h1>
      </header>

      <div className="answer-grid">
        <div className="answer-main">
          {lastResult && lastResult.next && (
            <p className="rewrite-goal">
              <strong>Your goal this time ({lastResult.next.ao}).</strong> {lastResult.next.text}
            </p>
          )}
          <label htmlFor="ans" className="answer-label">
            Your answer
          </label>
          <textarea
            id="ans"
            ref={area}
            className="answer-box"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
            placeholder="Write as you would in the exam. Full sentences, no bullet points."
            rows={11}
          />
          <div className="answer-bar">
            <span className="tnum">{words} words</span>
            <span>{words ? 'Saved as you type.' : 'Most Level 3 answers to a 9-marker run to 150 to 250 words.'}</span>
            {timer === null ? (
              <button className="timer-btn" onClick={() => setTimer(QUESTION.suggestedMinutes * 60)}>
                <Icon name="timer" size={18} /> Time me ({QUESTION.suggestedMinutes} min)
              </button>
            ) : (
              <button className={`timer-btn is-on${timer === 0 ? ' is-up' : ''}`} onClick={() => setTimer(null)} aria-live="off">
                <Icon name="timer" size={18} /> <span className="tnum">{timer === 0 ? 'Time is up' : mmss(timer)}</span>
              </button>
            )}
          </div>
          <div className="starters">
            <p>Stuck? Start a sentence:</p>
            {QUESTION.starters.map((s) => (
              <button key={s.ao} className="starter" onClick={() => addStarter(s.text)}>
                <MarginCode code={s.ao === 'AO1' ? 'K' : s.ao === 'AO2' ? 'APP' : 'AN'} />
                {s.text.length > 60 ? s.text.slice(0, 58) + '…' : s.text}
              </button>
            ))}
          </div>
          <div className="flow-actions">
            <button className="btn" onClick={onSubmit} disabled={words < 8}>
              {words < 8 ? 'Write a few sentences to get marked' : 'Mark my answer'} <Icon name="arrowRight" />
            </button>
            {words >= 8 && <span className="kbd-hint">or Ctrl + Enter</span>}
            <button className="btn is-quiet" onClick={onBack}>
              Back
            </button>
          </div>
          <details className="samples">
            <summary>Just looking? Use a sample answer</summary>
            <div>
              {Object.entries(SAMPLES).map(([k, v]) => (
                <button key={k} className="btn is-quiet is-small" onClick={() => setText(v.text)}>
                  {v.label}
                </button>
              ))}
            </div>
          </details>
        </div>

        <aside className="answer-side">
          <section className="extract" aria-labelledby="extract-h">
            <p className="extract-label">
              {EXTRACT.label} <span>{EXTRACT.note}</span>
            </p>
            <h2 id="extract-h">{EXTRACT.title}</h2>
            {EXTRACT.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
          <section className="aos-ask" aria-labelledby="aos-h">
            <h2 id="aos-h">How the 9 marks split</h2>
            <ul>
              {QUESTION.aos.map((a) => (
                <li key={a.id}>
                  <span className="aos-ask-top">
                    <strong>
                      {a.id} {a.name}
                    </strong>
                    <span className="tnum">{a.max} marks</span>
                  </span>
                  <span>{a.ask}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}

function Result({ text, attempts, marking, doneMarking, onRewrite, mode }) {
  const r = useMemo(() => markAnswer(text), [text])
  const sentences = useMemo(() => splitSentences(text), [text])
  const [reading, setReading] = useState(marking ? 0 : sentences.length)
  const [ask, setAsk] = useState(null)
  const prev = attempts.length > 1 ? attempts[attempts.length - 2] : null

  useEffect(() => {
    if (!marking) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setReading(sentences.length)
      doneMarking()
      return
    }
    let i = 0
    const t = setInterval(() => {
      i += 1
      setReading(i)
      if (i >= sentences.length) {
        clearInterval(t)
        setTimeout(doneMarking, 350)
      }
    }, 420)
    return () => clearInterval(t)
  }, [marking])

  const finished = !marking
  return (
    <div className="result">
      <div className="result-top" aria-live="polite">
        {finished ? (
          <>
            <p className="result-level">Level {r.level}</p>
            <p className="result-mark tnum">
              {r.total}
              <span> / {r.max}</span>
            </p>
            <p className="result-desc">{r.levelText}</p>
            {prev && (
              <p className={`result-delta${r.total > prev.total ? ' is-up' : ''}`}>
                {r.total > prev.total
                  ? `+${r.total - prev.total} on your last try (${prev.total} / 9)`
                  : r.total === prev.total
                    ? `Same as your last try (${prev.total} / 9). Try the next step below.`
                    : `${prev.total} / 9 last time. Check the margin to see what changed.`}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="result-level">Marking</p>
            <p className="result-reading">
              Reading sentence {Math.min(reading + 1, sentences.length)} of {sentences.length}
            </p>
          </>
        )}
      </div>

      <div className="result-grid">
        <div className="script" data-ui>
          <ol className="script-lines">
            {r.annotated.map((s, i) => (
              <li key={i} className={i === reading && !finished ? 'is-reading' : ''}>
                <p>{s.text}</p>
                <span className="script-codes">{i < reading && s.codes.map((c) => <MarginCode key={c} code={c} />)}</span>
              </li>
            ))}
          </ol>
          <p className="script-key">
            <MarginCode code="K" /> knowledge <MarginCode code="APP" /> application <MarginCode code="AN" /> a link in your chain{' '}
            <MarginCode code="?" /> a claim not yet explained
          </p>
        </div>

        {finished && (
          <div className="result-side">
            <ul className="result-aos">
              {r.aos.map((a) => (
                <li key={a.id}>
                  <span className="tnum">
                    <strong>
                      {a.id} {a.name}
                    </strong>
                    {a.mark} / {a.max}
                  </span>
                  <AoBar mark={a.mark} max={a.max} size="l" />
                </li>
              ))}
            </ul>
            {r.strengths.length > 0 && (
              <div className="result-good">
                <h2>What earned marks</h2>
                <ul>
                  {r.strengths.map((s) => (
                    <li key={s}>
                      <Icon name="check" size={18} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {r.next ? (
              <div className="result-next">
                <h2>One step to the next level</h2>
                <p>{r.next.text}</p>
                <button className="btn" onClick={onRewrite}>
                  Rewrite with this step <Icon name="edit" />
                </button>
              </div>
            ) : (
              <div className="result-next">
                <h2>Full marks</h2>
                <p>Every AO met. A 25-mark version adds evaluation: does the long-run PED of −0.6 change the answer?</p>
              </div>
            )}

            <div className="tutor-ask">
              <h2>Ask the tutor</h2>
              <div className="tutor-chips">
                <button className={`pick${ask === 'why' ? ' is-on' : ''}`} onClick={() => setAsk('why')}>
                  Why did I lose marks?
                </button>
                <button className={`pick${ask === 'chain' ? ' is-on' : ''}`} onClick={() => setAsk('chain')}>
                  What is a chain of reasoning?
                </button>
                <button className={`pick${ask === 'inelastic' ? ' is-on' : ''}`} onClick={() => setAsk('inelastic')}>
                  Explain inelastic again
                </button>
              </div>
              {ask && (
                <p className="tutor-reply" role="status">
                  {TUTOR[ask](r)}
                </p>
              )}
            </div>

            {mode === 'app' && (
              <div className="keep">
                <h2>Saved to your record</h2>
                <p>This mark is now the first row of Marked answers on Today.</p>
                <Link to="/app" className="btn is-paper">
                  Back to Today <Icon name="arrowRight" />
                </Link>
              </div>
            )}

            {mode === 'taster' && (
              <div className="keep">
                <h2>Keep this mark</h2>
                <p>Make an account to save it, carry on through the Economics spec and get your next answer marked.</p>
                <Link to="/start?from=taster" className="btn is-paper">
                  Save my mark and carry on <Icon name="arrowRight" />
                </Link>
                <p className="keep-small">Email only. No card. Under a minute.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
