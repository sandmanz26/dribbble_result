import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Icon, Wordmark } from '../ui/kit.jsx'
import { BOARDS, SUBJECTS } from '../data/taster.js'
import { getState, setState } from '../store.js'

// Sign-up after value: who you are, what you sit, then an email. No password field: a sign-in link is emailed.
const ROLES = [
  { id: 'student', title: 'I’m a student', line: 'Lessons, questions and marking for your subjects.', to: '/app' },
  { id: 'parent', title: 'I’m a parent', line: 'A free view of how revision is going. Link to your child’s account.', to: '/parent' },
  { id: 'teacher', title: 'I teach A-Level', line: 'Set questions, check the AI’s marks, see the class by AO.', to: '/teacher' },
]

export default function Start() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const fromTaster = params.get('from') === 'taster'
  const signin = params.get('mode') === 'signin'
  const attempts = getState().attempts || []
  const lastMark = attempts.length ? attempts[attempts.length - 1] : null

  const [role, setRole] = useState(params.get('role') || (fromTaster ? 'student' : null))
  const [subjects, setSubjects] = useState(['economics'])
  const [board, setBoard] = useState('AQA')
  const [year, setYear] = useState('2027')
  const [email, setEmail] = useState('')
  const [childEmail, setChildEmail] = useState('')
  const [school, setSchool] = useState('')
  const [sent, setSent] = useState(false)
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  const [touched, setTouched] = useState(false)
  const emailErr = touched && email && !emailOk ? 'That email looks incomplete: it needs an @ and a domain, like name@school.sch.uk.' : null

  const stepCount = role === 'parent' ? 2 : 3
  const step = !role ? 1 : sent ? stepCount + 1 : role === 'student' && !subjects.length ? 2 : 2

  const toggle = (id) => setSubjects((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const destination = useMemo(() => (ROLES.find((r) => r.id === role) || ROLES[0]).to, [role])

  const finish = (e) => {
    e.preventDefault()
    if (!emailOk) return
    setState({ role, subjects, board, examYear: year, email, account: true })
    setSent(true)
  }

  if (signin) {
    return (
      <Frame>
        <div className="start-card">
          <h1 className="start-h">Sign in</h1>
          <p className="lead">We email you a link. No password to remember.</p>
          <form className="start-form" onSubmit={(e) => { e.preventDefault(); if (emailOk) setSent(true) }}>
            <label className="field">
              <span>Email</span>
              <input type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched(true)} aria-invalid={!!emailErr} aria-describedby="email-err" placeholder="you@example.com" />
                {emailErr && <small id="email-err" className="field-err" role="alert">{emailErr}</small>}
            </label>
            <button className="btn" disabled={!emailOk}>
              Email me a sign-in link <Icon name="arrowRight" />
            </button>
          </form>
          {sent && <Sent email={email} onOpen={() => nav('/app')} label="Open the demo account" />}
          <p className="start-alt">
            New here? <Link className="link" to="/start">Create an account</Link> or{' '}
            <Link className="link" to="/taster/economics">try a free lesson first</Link>.
          </p>
        </div>
      </Frame>
    )
  }

  return (
    <Frame>
      <div className="start-grid">
        <div className="start-main">
          {fromTaster && lastMark && (
            <p className="start-kept">
              <Icon name="save" size={20} /> Your mark is waiting: <strong className="tnum">{lastMark.total} / 9</strong>, Level {lastMark.level}, Economics.
            </p>
          )}
          <h1 className="start-h">{fromTaster ? 'Save your mark and keep going' : 'Make a free ExamAce account'}</h1>
          {!fromTaster && <p className="lead">For A-Level Business, Economics, Psychology and Sociology. Free lessons and a free marked answer, no card.</p>}

          {!fromTaster && (
            <section className="start-step" aria-labelledby="who-h">
              <h2 id="who-h" className="start-sub">
                Who is it for?
              </h2>
              <div className="roles" role="radiogroup" aria-labelledby="who-h">
                {ROLES.map((r) => (
                  <button key={r.id} role="radio" aria-checked={role === r.id} className={`role${role === r.id ? ' is-on' : ''}`} onClick={() => { setRole(r.id); setSent(false) }}>
                    <strong>{r.title}</strong>
                    <span>{r.line}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {role === 'student' && !sent && (
            <form className="start-form" onSubmit={finish}>
              <fieldset className="opts opts-subjects">
                <legend>Your subjects</legend>
                {SUBJECTS.map((s) => (
                  <label key={s.id} className={`chip${subjects.includes(s.id) ? ' is-on' : ''}`}>
                    <input type="checkbox" checked={subjects.includes(s.id)} onChange={() => toggle(s.id)} />
                    {subjects.includes(s.id) && <Icon name="check" size={18} />}
                    {s.name}
                  </label>
                ))}
              </fieldset>
              <fieldset className="opts opts-subjects">
                <legend>Exam board</legend>
                {BOARDS.map((b) => (
                  <label key={b} className={`chip${board === b ? ' is-on' : ''}`}>
                    <input type="radio" name="board" checked={board === b} onChange={() => setBoard(b)} />
                    {b}
                  </label>
                ))}
              </fieldset>
              <fieldset className="opts opts-subjects">
                <legend>You sit your exams in</legend>
                {[
                  ['2027', 'May and June 2027 (Year 13)'],
                  ['2028', 'May and June 2028 (Year 12)'],
                ].map(([v, l]) => (
                  <label key={v} className={`chip${year === v ? ' is-on' : ''}`}>
                    <input type="radio" name="year" checked={year === v} onChange={() => setYear(v)} />
                    {l}
                  </label>
                ))}
              </fieldset>
              <label className="field">
                <span>Your email</span>
                <input type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched(true)} aria-invalid={!!emailErr} aria-describedby="email-err" placeholder="you@example.com" />
                {emailErr && <small id="email-err" className="field-err" role="alert">{emailErr}</small>}
                <small>We send a sign-in link here. No password.</small>
              </label>
              <button className="btn" disabled={!emailOk || !subjects.length}>
                {subjects.length ? 'Create my account' : 'Pick at least one subject'} <Icon name="arrowRight" />
              </button>
              <p className="start-small">Free to start. You choose a plan only when you want more than the free lessons and your free marked answers.</p>
            </form>
          )}

          {role === 'parent' && !sent && (
            <form className="start-form" onSubmit={finish}>
              <label className="field">
                <span>Your email</span>
                <input type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched(true)} aria-invalid={!!emailErr} aria-describedby="email-err" placeholder="you@example.com" />
                {emailErr && <small id="email-err" className="field-err" role="alert">{emailErr}</small>}
              </label>
              <label className="field">
                <span>Your child’s email (optional)</span>
                <input type="email" inputMode="email" value={childEmail} onChange={(e) => setChildEmail(e.target.value)} placeholder="Leave empty to invite them later" />
                <small>They accept the link from their own account and choose what you see.</small>
              </label>
              <button className="btn" disabled={!emailOk}>
                Create my parent view <Icon name="arrowRight" />
              </button>
            </form>
          )}

          {role === 'teacher' && !sent && (
            <form className="start-form" onSubmit={finish}>
              <label className="field">
                <span>School email</span>
                <input type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched(true)} aria-invalid={!!emailErr} aria-describedby="email-err" placeholder="name@school.sch.uk" />
                {emailErr && <small id="email-err" className="field-err" role="alert">{emailErr}</small>}
              </label>
              <label className="field">
                <span>School or college</span>
                <input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Start typing the name" />
              </label>
              <fieldset className="opts opts-subjects">
                <legend>You teach</legend>
                {SUBJECTS.map((s) => (
                  <label key={s.id} className={`chip${subjects.includes(s.id) ? ' is-on' : ''}`}>
                    <input type="checkbox" checked={subjects.includes(s.id)} onChange={() => toggle(s.id)} />
                    {subjects.includes(s.id) && <Icon name="check" size={18} />}
                    {s.name}
                  </label>
                ))}
              </fieldset>
              <button className="btn" disabled={!emailOk}>
                Set up my first class <Icon name="arrowRight" />
              </button>
              <p className="start-small">You get a class code to give students. Try it free with one class for this half term.</p>
            </form>
          )}

          {sent && <Sent email={email} onOpen={() => nav(destination)} label={role === 'parent' ? 'Open the parent view' : role === 'teacher' ? 'Open the teacher view' : 'Open my dashboard'} />}
          <p className="start-alt">
            Already have an account? <Link className="link" to="/start?mode=signin">Sign in</Link>
          </p>
        </div>
        <figure className="start-photo">
          <img className="photo" src={role === 'parent' ? 'img/parent.webp' : role === 'teacher' ? 'img/classroom.webp' : 'img/bus.webp'} alt="" width="1200" height="1600" />
        </figure>
      </div>
    </Frame>
  )
}

function Sent({ email, onOpen, label }) {
  return (
    <div className="sent" role="status">
      <h2>Check your email</h2>
      <p>
        We sent a sign-in link to <strong>{email}</strong>. It works for 30 minutes on this device.
      </p>
      <button className="btn is-paper" onClick={onOpen}>
        {label} <Icon name="arrowRight" />
      </button>
      <p className="start-small">In this prototype the button stands in for the link.</p>
    </div>
  )
}

function Frame({ children }) {
  return (
    <div className="start">
      <header className="tbar">
        <Wordmark />
        <Link to="/" className="tbar-exit">
          <Icon name="arrowLeft" size={20} />
          <span>Back to the site</span>
        </Link>
      </header>
      <main className="start-body">{children}</main>
    </div>
  )
}
