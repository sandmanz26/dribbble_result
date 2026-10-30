import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Call, Sms, Eye, Lock1, Edit2, Health, Warning2, ShieldTick, TickCircle, CloseCircle, More, Copy, DocumentText, ArrowUp, ArrowDown } from 'iconsax-react'
import { useStore } from '../store.jsx'
import { NOW, SUBJECTS } from '../data/school.js'
import { TopBar, Avatar, Status, Sheet, Button, Field, Chip, Segmented, Empty, fmtDate, fmtTime, age, ICON, useLoading } from '../ui/kit.jsx'

const MISSING_LABEL = { address: 'Home address', nationalId: 'National ID', guardianPhone: 'Guardian phone', medicalConsent: 'Medical consent' }
const REASONS = ['Nurse or first aid', 'Trip or event planning', 'Parent asked', 'Safeguarding', 'Other']

export default function Student() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const { state, dispatch, user, visible, log, toast } = useStore()
  const s = state.students.find((x) => x.id === id)
  const [tab, setTab] = useState(params.get('tab') || 'overview')
  const [revealed, setRevealed] = useState({})
  const [askReveal, setAskReveal] = useState(null)
  const [edit, setEdit] = useState(false)
  const [suggest, setSuggest] = useState(false)
  const [menu, setMenu] = useState(false)
  const loading = useLoading(320, [id])

  useEffect(() => {
    if (!s) return
    dispatch({ type: 'visit', id: s.id })
    log({ action: 'Viewed', target: `${s.first} ${s.last}`, detail: 'Profile' })
  }, [id]) // eslint-disable-line

  if (!s || !visible.includes(s)) {
    return (
      <div className="page">
        <TopBar title="Student" back="/search" />
        <Empty icon={<Lock1 size={28} color="currentColor" />} title={s ? 'Not in your classes' : 'Record not found'}>
          {s ? 'You can open students in the classes you teach. Ask the office if you need this record.' : 'It may have been merged or the link is out of date.'}
        </Empty>
      </div>
    )
  }

  const isReg = user.can.viewSensitive
  const req = state.requests.find((r) => r.id === params.get('req') && r.status === 'open' && r.studentId === s.id)
  const reveal = (key) => (isReg ? setAskReveal(key) : toast('Only the office can see this. Ask the registrar.', 'info'))
  const primary = s.guardians[0]

  return (
    <div className="page page-profile">
      <TopBar title="" back="/search" action={<button className="icon-btn" onClick={() => setMenu(true)} aria-label="More actions"><More {...ICON} /></button>} />

      <header className="profile-head">
        <Avatar s={s} size={72} />
        <div>
          <h1>{s.first} {s.last}</h1>
          <p><span>{s.cls}</span><span className="mono">{s.id}</span><span>{s.house}</span></p>
          <div className="profile-tags">
            <Status value={s.status} />
            {(s.health.allergies.length + s.health.conditions.length > 0) && (
              <button className="alert-tag" onClick={() => setTab('health')}><Health size={14} color="currentColor" variant="Bold" />{[...s.health.allergies, ...s.health.conditions].join(', ')}</button>
            )}
            {s.guardians.some((g) => g.note) && <span className="alert-tag is-strong"><Warning2 size={14} color="currentColor" variant="Bold" />Pickup restriction</span>}
          </div>
        </div>
      </header>

      <div className="profile-actions">
        <a className="action" href={primary.phone ? `tel:${primary.phone.replace(/\s/g, '')}` : undefined} aria-disabled={!primary.phone} onClick={(e) => { e.preventDefault(); if (!primary.phone) return toast('No phone number on file', 'warn'); log({ action: 'Called', target: primary.name, detail: `Guardian of ${s.first} ${s.last}` }); toast(`Calling ${primary.name}`, 'info') }}>
          <Call size={20} color="currentColor" /><span>Call {primary.relation.toLowerCase()}</span>
        </a>
        <button className="action" onClick={() => toast(`Message drafted to ${primary.name}`, 'info')}><Sms size={20} color="currentColor" /><span>Message</span></button>
        {isReg ? (
          <button className="action" onClick={() => setEdit(true)}><Edit2 size={20} color="currentColor" /><span>Edit</span></button>
        ) : (
          <button className="action" onClick={() => setSuggest(true)}><Edit2 size={20} color="currentColor" /><span>Suggest fix</span></button>
        )}
      </div>

      {req && (
        <div className="request-card" role="region" aria-label="Suggested correction">
          <p><strong>{req.by} suggested a correction</strong></p>
          <p>{req.field}: <b>{req.value}</b>{req.note ? `. "${req.note}"` : ''}</p>
          <div className="row-actions">
            <Button size="sm" onClick={() => {
              if (req.field === 'Guardian phone') {
                const guardians = s.guardians.map((g, i) => (i === 0 ? { ...g, phone: req.value } : g))
                dispatch({ type: 'updateStudent', id: s.id, patch: { guardians }, label: `${s.first} ${s.last}` })
              }
              dispatch({ type: 'resolveRequest', id: req.id, status: 'applied' })
              log({ action: 'Edited', target: `${s.first} ${s.last}`, detail: `${req.field} from ${req.by}'s suggestion` })
              toast(`Applied. ${req.by} will see it was accepted.`)
              setParams({}, { replace: true })
            }}>Apply change</Button>
            <Button size="sm" variant="ghost" onClick={() => { dispatch({ type: 'resolveRequest', id: req.id, status: 'declined' }); toast('Declined', 'info'); setParams({}, { replace: true }) }}>Decline</Button>
          </div>
        </div>
      )}

      <div className="tabs-inline" role="tablist">
        {[['overview', 'Overview'], ['exams', 'Exams'], ['family', 'Family'], ['health', 'Health'], ...(isReg ? [['log', 'Access']] : [])].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {loading ? <div className="sk-block"><span className="sk" /><span className="sk" /><span className="sk" /></div> : (
        <>
          {tab === 'overview' && <Overview s={s} isReg={isReg} revealed={revealed} reveal={reveal} onFix={() => (isReg ? setEdit(true) : setSuggest(true))} />}
          {tab === 'exams' && <Exams s={s} />}
          {tab === 'family' && <Family s={s} isReg={isReg} />}
          {tab === 'health' && <HealthTab s={s} isReg={isReg} revealed={revealed.health} reveal={() => reveal('health')} />}
          {tab === 'log' && <AccessLog s={s} />}
        </>
      )}

      <RevealSheet field={askReveal} onClose={() => setAskReveal(null)} onConfirm={(reason) => {
        setRevealed({ ...revealed, [askReveal]: true })
        log({ action: 'Revealed', target: `${s.first} ${s.last}`, detail: `${askReveal === 'health' ? 'Health details' : 'National ID'}. Reason: ${reason.toLowerCase()}` })
        setAskReveal(null)
      }} />
      {edit && <EditSheet s={s} onClose={() => setEdit(false)} />}
      {suggest && <SuggestSheet s={s} onClose={() => setSuggest(false)} />}
      <Sheet open={menu} onClose={() => setMenu(false)} title={`${s.first} ${s.last}`}>
        <div className="menu-list">
          <button onClick={() => { navigator.clipboard?.writeText(s.id); toast('Admission number copied'); setMenu(false) }}><Copy {...ICON} />Copy admission number</button>
          {user.can.exportData && <button onClick={() => { log({ action: 'Exported', target: `${s.first} ${s.last}`, detail: 'Record summary PDF' }); toast('Record summary saved as PDF'); setMenu(false) }}><DocumentText {...ICON} />Export record summary</button>}
          {isReg && s.status !== 'withdrawn' && <button className="is-danger" onClick={() => { dispatch({ type: 'updateStudent', id: s.id, patch: { status: 'withdrawn' }, label: `${s.first} ${s.last}` }); log({ action: 'Edited', target: `${s.first} ${s.last}`, detail: 'Marked as withdrawn' }); toast('Marked as withdrawn. The record is kept, not deleted.'); setMenu(false) }}><CloseCircle {...ICON} />Mark as withdrawn</button>}
          {isReg && s.status === 'withdrawn' && <button onClick={() => { dispatch({ type: 'updateStudent', id: s.id, patch: { status: 'enrolled' }, label: `${s.first} ${s.last}` }); toast('Re-enrolled'); setMenu(false) }}><TickCircle {...ICON} />Re-enrol</button>}
        </div>
      </Sheet>
    </div>
  )
}

function Masked({ value, shown, onReveal, label }) {
  if (!value) return <span className="missing">Missing</span>
  if (shown) return <span className="mono">{value}</span>
  return (
    <button className="masked" onClick={onReveal} aria-label={`Reveal ${label}`}>
      <span className="mono">{value.replace(/[A-Z0-9]/g, '•').slice(0, -2)}{value.slice(-2)}</span><Eye size={16} color="currentColor" />
    </button>
  )
}

function Overview({ s, isReg, revealed, reveal, onFix }) {
  return (
    <div className="tabpanel">
      {s.missing.length > 0 && (
        <div className="missing-card">
          <Warning2 size={20} color="currentColor" />
          <div>
            <strong>{s.missing.length} detail{s.missing.length > 1 ? 's' : ''} missing</strong>
            <p>{s.missing.map((m) => MISSING_LABEL[m]).join(', ')}</p>
          </div>
          <Button size="sm" variant="secondary" onClick={onFix}>{isReg ? 'Add now' : 'Tell office'}</Button>
        </div>
      )}
      <dl className="facts">
        <div><dt>Born</dt><dd>{fmtDate(s.dob)}<small>Age {age(s.dob, NOW)}</small></dd></div>
        <div><dt>Attendance</dt><dd>{s.attendance}%<small>This year</small></dd></div>
        <div><dt>Enrolled</dt><dd>{fmtDate(s.enrolled, { month: 'short', year: 'numeric' })}<small>Grade {s.grade}, section {s.section}</small></dd></div>
        <div><dt>Sex</dt><dd>{s.sex}<small>{s.preferred ? `Goes by ${s.preferred}` : 'No preferred name'}</small></dd></div>
      </dl>
      <section className="block">
        <h2 className="block-title">Personal details</h2>
        <dl className="kv">
          <div><dt>Home address</dt><dd>{isReg ? (s.address || <span className="missing">Missing</span>) : <span className="locked"><Lock1 size={14} color="currentColor" /> Office only</span>}</dd></div>
          <div><dt>National ID</dt><dd>{isReg ? <Masked value={s.nationalId} shown={revealed.nationalId} onReveal={() => reveal('nationalId')} label="national ID" /> : <span className="locked"><Lock1 size={14} color="currentColor" /> Office only</span>}</dd></div>
          <div><dt>Photo consent</dt><dd>{s.consents.photo ? 'Yes' : <b className="warn-text">No. Keep out of photos and posts.</b>}</dd></div>
          <div><dt>Trips consent</dt><dd>{s.consents.trips ? 'Yes, standing consent' : 'Ask per trip'}</dd></div>
        </dl>
        <p className="quiet small">Last updated {fmtDate(s.updated)}</p>
      </section>
    </div>
  )
}

function Exams({ s }) {
  const { state } = useStore()
  const rows = SUBJECTS.map((sub) => {
    const a = state.assessments.find((x) => x.cls === s.cls && x.subject === sub)
    const raw = a?.marks[s.id]
    const t2 = a && ['submitted', 'locked'].includes(a.status) ? raw : undefined
    const t1 = s.exams[sub].T1
    return { sub, t1, t2, status: a?.status }
  })
  const scored = rows.filter((r) => typeof r.t2 === 'number')
  const past = rows.filter((r) => typeof r.t1 === 'number')
  const avg1 = past.length ? Math.round(past.reduce((n, r) => n + r.t1, 0) / past.length) : null
  const avg2 = scored.length ? Math.round(scored.reduce((n, r) => n + r.t2, 0) / scored.length) : null
  return (
    <div className="tabpanel">
      <div className="exam-summary">
        <div><span>Term 1 average</span><b>{avg1 ?? 'New'}</b>{avg1 == null && <small>Joined this term</small>}</div>
        <div><span>Term 2 midterm so far</span><b>{avg2 ?? 'Not yet'}</b><small>{scored.length} of {rows.length} subjects published</small></div>
      </div>
      <div className="exam-list">
        {rows.map((r) => {
          const d = typeof r.t2 === 'number' && typeof r.t1 === 'number' ? r.t2 - r.t1 : null
          return (
            <div className="exam-row" key={r.sub}>
              <div className="exam-sub"><strong>{r.sub}</strong>
                {d !== null && Math.abs(d) >= 3 && <span className={`delta ${d > 0 ? 'up' : 'down'}`}>{d > 0 ? <ArrowUp size={12} color="currentColor" /> : <ArrowDown size={12} color="currentColor" />}{Math.abs(d)}</span>}
              </div>
              <div className="exam-bars" aria-label={`${r.sub}: term 1 ${r.t1}, term 2 ${typeof r.t2 === 'number' ? r.t2 : r.t2 === 'A' ? 'absent' : 'not published'}`}>
                <div className="bar-line"><span className="bar-k">T1</span>{typeof r.t1 === 'number' ? <><span className="bar is-past" style={{ width: `${r.t1 * 0.62}%` }} /><b>{r.t1}</b></> : <em>Not at school yet</em>}</div>
                <div className="bar-line"><span className="bar-k">T2</span>
                  {typeof r.t2 === 'number' ? <><span className="bar" style={{ width: `${r.t2 * 0.62}%` }} /><b>{r.t2}</b></>
                    : r.t2 === 'A' ? <em>Absent</em>
                    : <em>{r.status === 'draft' || r.status === 'open' ? 'Being marked' : 'Not published'}</em>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <p className="quiet small">Marks appear here once a teacher submits them. Out of 100.</p>
    </div>
  )
}

function Family({ s, isReg }) {
  return (
    <div className="tabpanel">
      {s.guardians.map((g, i) => (
        <div className="guardian" key={i}>
          <div className="guardian-head">
            <div><strong>{g.name}</strong><small>{g.relation}{g.primary ? ', first contact' : ''}</small></div>
            {g.pickup ? <span className="ok-tag"><ShieldTick size={14} color="currentColor" />Can collect</span> : <span className="muted-tag">Cannot collect</span>}
          </div>
          {g.note && <p className="guardian-note"><Warning2 size={16} color="currentColor" variant="Bold" />{g.note}</p>}
          <dl className="kv compact">
            <div><dt>Phone</dt><dd>{g.phone ? <span className="mono">{g.phone}</span> : <span className="missing">Missing</span>}</dd></div>
            <div><dt>Email</dt><dd>{isReg ? (g.email || <span className="quiet">None given</span>) : <span className="locked"><Lock1 size={14} color="currentColor" /> Office only</span>}</dd></div>
          </dl>
        </div>
      ))}
    </div>
  )
}

function HealthTab({ s, isReg, revealed, reveal }) {
  const h = s.health
  const any = h.allergies.length + h.conditions.length + h.support.length
  return (
    <div className="tabpanel">
      <section className="block">
        <h2 className="block-title">Alerts everyone can see</h2>
        {h.allergies.length + h.conditions.length ? (
          <div className="alerts">
            {h.allergies.map((a) => <div key={a} className="alert-line"><Health size={18} color="currentColor" variant="Bold" /><span><strong>{a}</strong><small>Allergy</small></span></div>)}
            {h.conditions.map((c) => <div key={c} className="alert-line"><Health size={18} color="currentColor" variant="Bold" /><span><strong>{c}</strong><small>Condition</small></span></div>)}
          </div>
        ) : <p className="quiet">No allergies or conditions recorded.</p>}
        <p className="quiet small">Medical consent: {s.consents.medical == null ? <span className="missing">Not given yet</span> : s.consents.medical ? 'Yes' : 'No, call a guardian first'}</p>
      </section>
      <section className="block">
        <h2 className="block-title">Details</h2>
        {!isReg ? (
          <div className="locked-card"><Lock1 size={20} color="currentColor" /><p>Medication, doctor and learning support notes are kept by the office and nurse. {any ? 'Ask them if you need more for a lesson or trip.' : ''}</p></div>
        ) : revealed ? (
          <dl className="kv">
            <div><dt>Medication</dt><dd>{h.medication.join(', ') || 'None'}</dd></div>
            <div><dt>Learning support</dt><dd>{h.support.join(', ') || 'None'}</dd></div>
            <div><dt>Doctor</dt><dd>{h.doctor}</dd></div>
          </dl>
        ) : (
          <button className="reveal-card" onClick={reveal}><Eye size={20} color="currentColor" /><span><strong>Show health details</strong><small>You will be asked why. Each view is recorded.</small></span></button>
        )}
      </section>
    </div>
  )
}

function AccessLog({ s }) {
  const { state } = useStore()
  const rows = state.audit.filter((a) => a.target === `${s.first} ${s.last}`)
  return (
    <div className="tabpanel">
      <p className="quiet small">Everyone who opened, revealed or changed this record. Kept for 7 years.</p>
      {rows.length ? (
        <ol className="timeline">
          {rows.map((a, i) => (
            <li key={i}><b>{a.who}</b> <span>{a.action.toLowerCase()}</span> <small>{a.detail}</small><time>{fmtDate(a.at, { day: 'numeric', month: 'short' })}, {fmtTime(a.at)}</time></li>
          ))}
        </ol>
      ) : <p className="quiet">No access recorded yet.</p>}
    </div>
  )
}

function RevealSheet({ field, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  useEffect(() => setReason(''), [field])
  return (
    <Sheet open={!!field} onClose={onClose} title={field === 'health' ? 'Show health details' : 'Show national ID'} footer={<Button disabled={!reason} onClick={() => onConfirm(reason)}>Show for this visit</Button>}>
      <p className="quiet">Why do you need it? Your name, the time and this reason go in the access log.</p>
      <div className="chips-wrap">{REASONS.map((r) => <Chip key={r} on={reason === r} onClick={() => setReason(r)}>{r}</Chip>)}</div>
    </Sheet>
  )
}

function EditSheet({ s, onClose }) {
  const { dispatch, log, toast } = useStore()
  const [f, setF] = useState({ address: s.address, nationalId: s.nationalId, phone: s.guardians[0].phone, medical: s.consents.medical, preferred: s.preferred })
  const [err, setErr] = useState({})
  const save = () => {
    const e = {}
    if (f.phone && f.phone.replace(/\D/g, '').length < 10) e.phone = 'Phone looks too short. Include the country code.'
    if (f.nationalId && !/^[A-Z]{2} ?\d{2} ?\d{2} ?\d{2} ?[A-D]$/i.test(f.nationalId.trim())) e.nationalId = 'Use the format QK 12 34 56 A'
    setErr(e)
    if (Object.keys(e).length) return
    const guardians = s.guardians.map((g, i) => (i === 0 ? { ...g, phone: f.phone } : g))
    dispatch({ type: 'updateStudent', id: s.id, label: `${s.first} ${s.last}`, patch: { address: f.address.trim(), nationalId: f.nationalId.trim().toUpperCase(), guardians, consents: { ...s.consents, medical: f.medical }, preferred: f.preferred.trim(), updated: NOW.toISOString().slice(0, 10) } })
    log({ action: 'Edited', target: `${s.first} ${s.last}`, detail: 'Personal details' })
    toast('Record saved')
    onClose()
  }
  return (
    <Sheet open onClose={onClose} title="Edit details" tall footer={<Button onClick={save}>Save changes</Button>}>
      <Field label="Preferred name" optional><input value={f.preferred} onChange={(e) => setF({ ...f, preferred: e.target.value })} /></Field>
      <Field label="Home address" error={err.address}><input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} autoComplete="off" /></Field>
      <Field label="National ID" error={err.nationalId} help="Format QK 12 34 56 A"><input className="mono" value={f.nationalId} onChange={(e) => setF({ ...f, nationalId: e.target.value })} /></Field>
      <Field label={`${s.guardians[0].relation}'s phone`} error={err.phone}><input type="tel" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
      <div className="field"><span className="field-label">Medical consent</span>
        <Segmented label="Medical consent" value={f.medical == null ? 'none' : f.medical ? 'yes' : 'no'} onChange={(v) => setF({ ...f, medical: v === 'none' ? null : v === 'yes' })} options={[{ value: 'yes', label: 'Given' }, { value: 'no', label: 'Refused' }, { value: 'none', label: 'Not yet' }]} />
      </div>
    </Sheet>
  )
}

function SuggestSheet({ s, onClose }) {
  const { dispatch, toast } = useStore()
  const fields = ['Guardian phone', 'Home address', 'Spelling of name', 'Health alert', 'Something else']
  const [field, setField] = useState('')
  const [value, setValue] = useState('')
  const [note, setNote] = useState('')
  const ok = field && value.trim().length > 1
  return (
    <Sheet open onClose={onClose} title="Suggest a correction" tall footer={<Button disabled={!ok} onClick={() => { dispatch({ type: 'request', request: { studentId: s.id, field, value: value.trim(), note: note.trim() } }); toast('Sent to the office. They will check it.'); onClose() }}>Send to office</Button>}>
      <p className="quiet">Teachers cannot change records directly. The registrar checks and applies it.</p>
      <div className="field"><span className="field-label">What is wrong?</span><div className="chips-wrap">{fields.map((x) => <Chip key={x} on={field === x} onClick={() => setField(x)}>{x}</Chip>)}</div></div>
      <Field label="Correct value"><input value={value} onChange={(e) => setValue(e.target.value)} /></Field>
      <Field label="How do you know?" optional><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="For example, mother called this morning" /></Field>
    </Sheet>
  )
}
