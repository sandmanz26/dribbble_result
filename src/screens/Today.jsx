import { Link, useNavigate } from 'react-router-dom'
import { SearchNormal1, UserAdd, ArrowRight2, Warning2, DocumentText, TaskSquare, Health, Edit2 } from 'iconsax-react'
import { useStore } from '../store.jsx'
import { NOW } from '../data/school.js'
import { Avatar, Status, fmtDate } from '../ui/kit.jsx'

const MISSING_LABEL = { address: 'Home address', nationalId: 'National ID', guardianPhone: 'Guardian phone', medicalConsent: 'Medical consent' }

export default function Today() {
  const { state, user, brand, visible } = useStore()
  const nav = useNavigate()
  const isReg = user.role === 'registrar'

  const incomplete = visible.filter((s) => s.status === 'pending')
  const byField = Object.keys(MISSING_LABEL).map((k) => ({ k, n: incomplete.filter((s) => s.missing.includes(k)).length })).filter((x) => x.n)
  const toReview = state.assessments.filter((a) => a.status === 'submitted')
  const openReq = state.requests.filter((r) => r.status === 'open')
  const mine = state.assessments.filter((a) => a.teacher === user.name)
  const alerts = visible.filter((s) => s.status !== 'withdrawn' && (s.health.allergies.length || s.health.conditions.length))
  const recent = state.recent.map((id) => state.students.find((s) => s.id === id)).filter((s) => s && visible.includes(s))

  const hour = NOW.getHours()
  const hello = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="page">
      <header className="today-head">
        <div className="today-school"><span className="crest">{brand.crest}</span><span>{brand.name}</span></div>
        <h1>{hello}, {user.first}</h1>
        <p>{fmtDate(NOW.toISOString(), { weekday: 'long', day: 'numeric', month: 'long' })}. {user.title}.</p>
      </header>

      <button className="search-trigger" onClick={() => nav('/search?focus=1')}>
        <SearchNormal1 size={20} color="currentColor" />
        <span>Name, admission no., class or parent</span>
      </button>

      {isReg ? (
        <>
          <section className="block">
            <h2 className="block-title">Needs you</h2>
            <div className="todo">
              {toReview.length > 0 && (
                <Link to="/marks?view=review" className="todo-item">
                  <span className="todo-icon"><TaskSquare size={20} color="currentColor" /></span>
                  <span className="todo-text"><strong>{toReview.length} mark sheets to review</strong><small>Term 2 midterm. Teachers are waiting to hear back.</small></span>
                  <ArrowRight2 size={18} color="currentColor" />
                </Link>
              )}
              {openReq.length > 0 && (
                <Link to={`/students/${openReq[0].studentId}?req=${openReq[0].id}`} className="todo-item">
                  <span className="todo-icon"><Edit2 size={20} color="currentColor" /></span>
                  <span className="todo-text"><strong>{openReq.length} correction{openReq.length > 1 ? 's' : ''} suggested</strong><small>{openReq[0].by}: {openReq[0].field.toLowerCase()}</small></span>
                  <ArrowRight2 size={18} color="currentColor" />
                </Link>
              )}
              <Link to="/search?filter=incomplete" className="todo-item">
                <span className="todo-icon"><DocumentText size={20} color="currentColor" /></span>
                <span className="todo-text"><strong>{incomplete.length} records are incomplete</strong><small>{byField.map((f) => `${f.n} ${MISSING_LABEL[f.k].toLowerCase()}`).join(', ')}</small></span>
                <ArrowRight2 size={18} color="currentColor" />
              </Link>
            </div>
          </section>
          <Link to="/students/new" className="add-student">
            <UserAdd size={22} color="currentColor" />
            <span><strong>Add a student</strong><small>About 3 minutes. Saves as you go.</small></span>
          </Link>
        </>
      ) : (
        <>
          <section className="block">
            <h2 className="block-title">Your marking</h2>
            <div className="marking">
              {mine.map((a) => {
                const roster = state.students.filter((s) => s.cls === a.cls && s.status !== 'withdrawn').length
                const done = Object.keys(a.marks).length
                return (
                  <Link key={a.id} to={`/marks/${a.id}`} className="marking-item">
                    <span className="marking-cls">{a.cls}</span>
                    <span className="marking-text"><strong>{a.title}</strong><Status value={a.status} /></span>
                    <span className="marking-count"><b>{done}</b>/{roster}</span>
                  </Link>
                )
              })}
            </div>
          </section>
          <section className="block">
            <h2 className="block-title">Health alerts in your classes</h2>
            <p className="block-sub">Shown so you know before a lesson or trip. Full details stay with the office.</p>
            <div className="list">
              {alerts.slice(0, 4).map((s) => (
                <Link key={s.id} to={`/students/${s.id}`} className="row">
                  <Avatar s={s} size={38} />
                  <span className="row-main"><strong>{s.first} {s.last}</strong><small>{s.cls}</small></span>
                  <span className="alert-tag"><Health size={14} color="currentColor" variant="Bold" />{[...s.health.allergies, ...s.health.conditions].join(', ')}</span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="block">
        <h2 className="block-title">Recently opened</h2>
        {recent.length ? (
          <div className="list">
            {recent.map((s) => (
              <Link key={s.id} to={`/students/${s.id}`} className="row">
                <Avatar s={s} size={38} />
                <span className="row-main"><strong>{s.first} {s.last}</strong><small>{s.cls}, {s.id}</small></span>
                {s.status !== 'enrolled' && <Status value={s.status} />}
              </Link>
            ))}
          </div>
        ) : (
          <p className="quiet">Students you open will show here for quick return.</p>
        )}
      </section>

      {isReg && (
        <section className="block">
          <h2 className="block-title">On roll today</h2>
          <Roll />
        </section>
      )}
      {!isReg && incomplete.length > 0 && (
        <p className="quiet with-icon"><Warning2 size={16} color="currentColor" /> {incomplete.length} students in your classes have incomplete records. The office is following up.</p>
      )}
    </div>
  )
}

function Roll() {
  const { state } = useStore()
  const active = state.students.filter((s) => s.status !== 'withdrawn')
  const grades = [7, 8, 9, 10, 11, 12].map((g) => ({ g, n: active.filter((s) => s.grade === g).length }))
  const max = Math.max(...grades.map((x) => x.n))
  return (
    <div className="roll">
      <div className="roll-total"><b>{active.length}</b><span>students enrolled<br />{state.students.length - active.length} withdrawn this year</span></div>
      <div className="roll-bars" role="img" aria-label={grades.map((x) => `Grade ${x.g}: ${x.n}`).join(', ')}>
        {grades.map((x) => (
          <Link key={x.g} to={`/search?grade=${x.g}`} className="roll-bar">
            <span className="roll-n">{x.n}</span>
            <span className="roll-fill" style={{ height: `${(x.n / max) * 100}%` }} />
            <span className="roll-g">G{x.g}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
