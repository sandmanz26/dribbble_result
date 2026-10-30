import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Lock1, Warning2, TickCircle } from 'iconsax-react'
import { useStore } from '../store.jsx'
import { TopBar, Status, Button, Sheet, Field, Empty, Avatar } from '../ui/kit.jsx'

// A = absent, X = exempt. Anything else must be a whole number from 0 to max.
function check(v, max) {
  if (v === '' || v == null) return null
  const t = String(v).trim().toUpperCase()
  if (t === 'A' || t === 'X') return null
  if (!/^\d+$/.test(t)) return 'Use a number, A for absent or X for exempt'
  if (Number(t) > max) return `Out of ${max}. Check this one.`
  return null
}

export default function MarkEntry() {
  const { id } = useParams()
  const { state, dispatch, user, toast, log } = useStore()
  const a = state.assessments.find((x) => x.id === id)
  const roster = useMemo(() => (a ? state.students.filter((s) => s.cls === a.cls && s.status !== 'withdrawn') : []), [a, state.students])
  const [vals, setVals] = useState(() => Object.fromEntries(roster.map((s) => [s.id, a?.marks[s.id] ?? ''])))
  const [confirm, setConfirm] = useState(false)
  const [ret, setRet] = useState(false)
  const [note, setNote] = useState('')
  const refs = useRef({})

  const canEdit = a && a.teacher === user.name && (a.status === 'open' || a.status === 'draft')
  const isReviewer = user.can.approveMarks

  // Save every change as a draft, quietly. Teachers enter marks in bits between lessons.
  useEffect(() => {
    if (!canEdit) return
    const t = setTimeout(() => {
      const marks = {}
      for (const [k, v] of Object.entries(vals)) {
        const t2 = String(v).trim().toUpperCase()
        if (t2 === '' || check(t2, a.max)) continue
        marks[k] = t2 === 'A' || t2 === 'X' ? t2 : Number(t2)
      }
      if (JSON.stringify(marks) !== JSON.stringify(a.marks)) dispatch({ type: 'updateAssessment', id: a.id, patch: { marks, status: Object.keys(marks).length ? 'draft' : a.status }, label: `${a.cls} ${a.subject} marks`, silent: !!state.queue.find((q) => q.label === `${a.cls} ${a.subject} marks`) })
    }, 600)
    return () => clearTimeout(t)
  }, [vals]) // eslint-disable-line

  if (!a) return <div className="page"><TopBar title="Marks" back="/marks" /><Empty title="Mark sheet not found" /></div>

  const nums = Object.values(vals).map((v) => String(v).trim()).filter((v) => /^\d+$/.test(v)).map(Number).filter((n) => n <= a.max)
  const errors = roster.filter((s) => check(vals[s.id], a.max))
  const blank = roster.filter((s) => String(vals[s.id]).trim() === '')
  const absent = Object.values(vals).filter((v) => String(v).toUpperCase() === 'A').length
  const avg = nums.length ? Math.round(nums.reduce((x, y) => x + y, 0) / nums.length) : null
  const bins = [0, 0, 0, 0, 0]
  nums.forEach((n) => { bins[Math.min(4, Math.floor(n / 20))]++ })
  const binMax = Math.max(1, ...bins)
  const below = nums.filter((n) => n < 40).length

  const submit = () => {
    const marks = {}
    roster.forEach((s) => {
      const t = String(vals[s.id]).trim().toUpperCase()
      if (t === '') return
      marks[s.id] = t === 'A' || t === 'X' ? t : Number(t)
    })
    dispatch({ type: 'updateAssessment', id: a.id, patch: { marks, status: 'submitted', note: '' }, label: `Submit ${a.cls} ${a.subject}` })
    log({ action: 'Submitted', target: `${a.cls} ${a.subject}`, detail: `${Object.keys(marks).length} marks, term 2 midterm` })
    toast(state.online ? 'Sent to the registrar for review' : 'Saved. Sends when you are back online.')
    setConfirm(false)
  }

  const onKey = (e, i) => {
    if (e.key === 'Enter' || (e.key === 'ArrowDown')) { e.preventDefault(); refs.current[roster[i + 1]?.id]?.focus() }
    if (e.key === 'ArrowUp') { e.preventDefault(); refs.current[roster[i - 1]?.id]?.focus() }
  }

  return (
    <div className="page page-marks">
      <TopBar title={`${a.cls} ${a.subject}`} back="/marks" />
      <div className="marks-head">
        <div>
          <h1>{a.title}</h1>
          <p>Out of {a.max}. {a.teacher || 'Subject teacher'}.</p>
        </div>
        <Status value={a.status} />
      </div>

      {a.note && a.status === 'draft' && <p className="return-note"><Warning2 size={18} color="currentColor" variant="Bold" /> Returned by the registrar: "{a.note}"</p>}

      <div className="marks-stats" aria-live="polite">
        <div><b>{roster.length - blank.length - errors.length}</b><span>of {roster.length} in</span></div>
        <div><b>{avg ?? 'None'}</b><span>average</span></div>
        <div className="histo" role="img" aria-label={`Spread: ${bins.map((b, i) => `${i * 20} to ${i * 20 + 19}: ${b}`).join(', ')}`}>
          {bins.map((b, i) => <span key={i} style={{ height: `${(b / binMax) * 100}%` }} className={i < 2 ? 'is-low' : ''} />)}
        </div>
      </div>
      {below > 0 && <p className="quiet small">{below} below 40. Worth a look before you submit.</p>}

      {canEdit && <p className="quiet small">Type a mark and press Enter for the next student. A for absent, X for exempt. Saves as you go.</p>}
      {!canEdit && a.status === 'locked' && <p className="locked-line"><Lock1 size={16} color="currentColor" /> Published to student records. Changes need the registrar.</p>}
      {!canEdit && !isReviewer && a.teacher !== user.name && <p className="locked-line"><Lock1 size={16} color="currentColor" /> Only {a.teacher || 'the subject teacher'} can enter these marks.</p>}

      <ol className="roster">
        {roster.map((s, i) => {
          const e = check(vals[s.id], a.max)
          return (
            <li key={s.id} className={`roster-row ${e ? 'has-error' : ''}`}>
              <span className="roster-n">{i + 1}</span>
              <Avatar s={s} size={32} />
              <label htmlFor={`m-${s.id}`} className="roster-name">{s.first} {s.last}{e && <small role="alert">{e}</small>}</label>
              {canEdit ? (
                <input
                  id={`m-${s.id}`}
                  ref={(el) => (refs.current[s.id] = el)}
                  className="mark-input"
                  inputMode="text"
                  autoComplete="off"
                  enterKeyHint="next"
                  maxLength={3}
                  value={vals[s.id]}
                  onChange={(ev) => setVals({ ...vals, [s.id]: ev.target.value.toUpperCase() })}
                  onKeyDown={(ev) => onKey(ev, i)}
                  aria-invalid={!!e}
                />
              ) : (
                <span className="mark-read">{a.marks[s.id] === 'A' ? 'Absent' : a.marks[s.id] === 'X' ? 'Exempt' : a.marks[s.id] ?? ''}</span>
              )}
            </li>
          )
        })}
      </ol>

      {canEdit && (
        <div className="sticky-foot">
          <Button disabled={errors.length > 0 || blank.length === roster.length} onClick={() => setConfirm(true)}>
            {errors.length ? `Fix ${errors.length} mark${errors.length > 1 ? 's' : ''} first` : 'Submit for review'}
          </Button>
        </div>
      )}
      {isReviewer && a.status === 'submitted' && (
        <div className="sticky-foot two">
          <Button variant="ghost" onClick={() => setRet(true)}>Return</Button>
          <Button onClick={() => {
            dispatch({ type: 'updateAssessment', id: a.id, patch: { status: 'locked' }, label: `Publish ${a.cls} ${a.subject}` })
            log({ action: 'Published', target: `${a.cls} ${a.subject}`, detail: 'Term 2 midterm marks locked' })
            toast('Published. Marks now show on each student record.')
          }}>Approve and publish</Button>
        </div>
      )}

      <Sheet open={confirm} onClose={() => setConfirm(false)} title="Submit marks?" footer={<Button onClick={submit}>Submit {roster.length - blank.length} marks</Button>}>
        {blank.length ? (
          <p className="dup-card"><Warning2 size={18} color="currentColor" variant="Bold" /> {blank.length} student{blank.length > 1 ? 's have' : ' has'} no mark: {blank.slice(0, 4).map((s) => s.first).join(', ')}{blank.length > 4 ? ` and ${blank.length - 4} more` : ''}. They will show as missing.</p>
        ) : <p className="ok-line"><TickCircle size={18} color="currentColor" variant="Bold" /> Every student has a mark{absent ? ` (${absent} absent)` : ''}.</p>}
        <p className="quiet">The registrar checks the sheet and publishes it. You can't edit it after that without asking.</p>
      </Sheet>

      <Sheet open={ret} onClose={() => setRet(false)} title="Return to teacher" footer={<Button disabled={note.trim().length < 4} onClick={() => {
        dispatch({ type: 'updateAssessment', id: a.id, patch: { status: 'draft', note: note.trim() }, label: `Return ${a.cls} ${a.subject}` })
        log({ action: 'Returned', target: `${a.cls} ${a.subject}`, detail: note.trim() })
        toast(`Returned to ${a.teacher || 'the teacher'}`, 'info'); setRet(false); setNote('')
      }}>Send back</Button>}>
        <Field label="What should they check?"><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="For example, row 12 looks like a typo" /></Field>
      </Sheet>
    </div>
  )
}
