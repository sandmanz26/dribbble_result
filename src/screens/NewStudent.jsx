import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Warning2, TickCircle, Lock1 } from 'iconsax-react'
import { useStore, stamp } from '../store.jsx'
import { GRADES, SECTIONS, HOUSES, NOW } from '../data/school.js'
import { findDuplicates } from '../lib/search.js'
import { TopBar, Button, Field, Chip, Segmented, Avatar, Empty, fmtDate } from '../ui/kit.jsx'

const STEPS = ['Student', 'Class', 'Family', 'Health', 'Check']
const BLANK = {
  first: '', last: '', preferred: '', dob: '', sex: '', nationalId: '', address: '',
  grade: null, section: '', house: '',
  g1: { name: '', relation: '', phone: '', email: '' }, g2: { name: '', relation: '', phone: '' }, pickup2: true,
  allergies: '', conditions: '', support: '', consentPhoto: null, consentTrips: null, consentMedical: null,
  notDuplicate: false,
}

export default function NewStudent() {
  const { state, dispatch, user, toast, log } = useStore()
  const nav = useNavigate()
  const [step, setStep] = useState(state.draft?.step || 0)
  const [f, setF] = useState(state.draft?.f || BLANK)
  const [err, setErr] = useState({})
  const [savedAt, setSavedAt] = useState(state.draft ? 'restored' : null)

  // Autosave the draft so a phone call or a dead battery never loses the form.
  useEffect(() => {
    const t = setTimeout(() => {
      if (JSON.stringify(f) === JSON.stringify(BLANK)) return
      dispatch({ type: 'set', patch: { draft: { f, step } } })
      setSavedAt(stamp())
    }, 500)
    return () => clearTimeout(t)
  }, [f, step, dispatch])

  const dups = useMemo(() => (f.first && f.last ? findDuplicates(state.students, f) : []), [f.first, f.last, f.dob, state.students]) // eslint-disable-line
  const set = (k, v) => { setF((p) => ({ ...p, [k]: v })); setErr((e) => ({ ...e, [k]: undefined })) }
  const setG = (g, k, v) => setF((p) => ({ ...p, [g]: { ...p[g], [k]: v } }))

  if (!user.can.addStudents) {
    return (
      <div className="page"><TopBar title="Add student" back="/" />
        <Empty icon={<Lock1 size={28} color="currentColor" />} title="Only the office adds students">New students are added by the registrar so every record is checked once.</Empty>
      </div>
    )
  }

  const validate = () => {
    const e = {}
    if (step === 0) {
      if (!f.first.trim()) e.first = 'Enter a first name'
      if (!f.last.trim()) e.last = 'Enter a surname'
      if (!f.dob) e.dob = 'Enter the date of birth'
      else {
        const a = (NOW - new Date(f.dob)) / 31557600000
        if (a < 10 || a > 20) e.dob = 'That makes the student younger than 10 or older than 20. Check the year.'
      }
      if (!f.sex) e.sex = 'Choose one'
      if (dups.length && !f.notDuplicate) e.dup = 'Check the possible match above first'
    }
    if (step === 1) {
      if (!f.grade) e.grade = 'Choose a grade'
      if (!f.section) e.section = 'Choose a class'
      if (!f.house) e.house = 'Choose a house'
    }
    if (step === 2) {
      if (!f.g1.name.trim()) e.g1name = 'Enter at least one guardian'
      if (!f.g1.relation) e.g1rel = 'Choose a relationship'
      if (f.g1.phone && f.g1.phone.replace(/\D/g, '').length < 10) e.g1phone = 'Phone looks too short. Include the country code.'
      if (f.g1.email && !/^\S+@\S+\.\S+$/.test(f.g1.email)) e.g1email = 'This email is missing something'
    }
    if (step === 3) {
      if (f.consentPhoto == null) e.consentPhoto = 'Record an answer, even if it is no'
      if (f.consentTrips == null) e.consentTrips = 'Record an answer, even if it is no'
    }
    setErr(e)
    return !Object.keys(e).length
  }

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)) }

  const finish = () => {
    const n = state.students.filter((s) => s.id.startsWith('27-')).length
    const id = `27-${String(900 + n + 1).padStart(4, '0')}`
    const split = (t) => t.split(',').map((x) => x.trim()).filter(Boolean)
    const student = {
      id, first: f.first.trim(), last: f.last.trim(), preferred: f.preferred.trim(), sex: f.sex, dob: f.dob,
      grade: f.grade, section: f.section, cls: `${f.grade}${f.section}`, house: f.house, status: 'enrolled',
      enrolled: NOW.toISOString().slice(0, 10), address: f.address.trim(), nationalId: f.nationalId.trim().toUpperCase(),
      guardians: [
        { ...f.g1, primary: true, pickup: true },
        ...(f.g2.name.trim() ? [{ ...f.g2, email: '', primary: false, pickup: f.pickup2 }] : []),
      ],
      health: { allergies: split(f.allergies), conditions: split(f.conditions), medication: [], support: split(f.support), doctor: '' },
      consents: { photo: f.consentPhoto, trips: f.consentTrips, medical: f.consentMedical },
      exams: Object.fromEntries(['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art'].map((s) => [s, { T1: null }])),
      attendance: 100, updated: NOW.toISOString().slice(0, 10), missing: [],
    }
    dispatch({ type: 'addStudent', student })
    log({ action: 'Added', target: `${student.first} ${student.last}`, detail: `New record ${id}, ${student.cls}` })
    toast(state.online ? `${student.first} added to ${student.cls}` : `${student.first} saved on this phone. Syncs when online.`)
    nav(`/students/${id}`, { replace: true })
  }

  const missingNow = [!f.address && 'home address', !f.nationalId && 'national ID', !f.g1.phone && 'guardian phone', f.consentMedical == null && 'medical consent'].filter(Boolean)

  return (
    <div className="page page-form">
      <TopBar title="Add student" back="/" action={<button className="text-btn" onClick={() => { dispatch({ type: 'set', patch: { draft: null } }); setF(BLANK); setStep(0); setSavedAt(null) }}>Clear</button>} />
      <div className="stepper" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        {STEPS.map((s, i) => (
          <button key={s} className={`step ${i === step ? 'is-on' : ''} ${i < step ? 'is-done' : ''}`} disabled={i > step} onClick={() => setStep(i)}>
            <span className="step-bar" /><span className="step-label">{s}</span>
          </button>
        ))}
      </div>
      <p className="autosave" aria-live="polite">{savedAt === 'restored' ? 'Draft restored from earlier' : savedAt ? 'Draft saved on this phone' : 'Saves as you type'}</p>

      <div className="form">
        {step === 0 && (
          <>
            <div className="field-pair">
              <Field label="First name" error={err.first}><input value={f.first} onChange={(e) => set('first', e.target.value)} autoComplete="off" autoCapitalize="words" /></Field>
              <Field label="Surname" error={err.last}><input value={f.last} onChange={(e) => set('last', e.target.value)} autoComplete="off" autoCapitalize="words" /></Field>
            </div>
            {dups.length > 0 && (
              <div className={`dup-card ${err.dup ? 'has-error' : ''}`} role="alert">
                <p><Warning2 size={18} color="currentColor" variant="Bold" /><strong>This might already be on the roll</strong></p>
                {dups.map((d) => (
                  <Link key={d.id} to={`/students/${d.id}`} className="row">
                    <Avatar s={d} size={36} />
                    <span className="row-main"><strong>{d.first} {d.last}</strong><small>{d.cls}, born {fmtDate(d.dob)}</small></span>
                  </Link>
                ))}
                <label className="check"><input type="checkbox" checked={f.notDuplicate} onChange={(e) => set('notDuplicate', e.target.checked)} /> This is a different student</label>
              </div>
            )}
            <Field label="Preferred name" optional><input value={f.preferred} onChange={(e) => set('preferred', e.target.value)} /></Field>
            <DobField value={f.dob} error={err.dob} onChange={(v) => set('dob', v)} />
            <div className={`field ${err.sex ? 'has-error' : ''}`}><span className="field-label">Sex</span>
              <Segmented label="Sex" value={f.sex} onChange={(v) => set('sex', v)} options={[{ value: 'Female', label: 'Female' }, { value: 'Male', label: 'Male' }]} />
              {err.sex && <span className="field-error">{err.sex}</span>}
            </div>
            <Field label="National ID" optional help="Can be added later. Format QK 12 34 56 A"><input className="mono" value={f.nationalId} onChange={(e) => set('nationalId', e.target.value)} /></Field>
            <Field label="Home address" optional><input value={f.address} onChange={(e) => set('address', e.target.value)} autoComplete="off" /></Field>
          </>
        )}

        {step === 1 && (
          <>
            <div className={`field ${err.grade ? 'has-error' : ''}`}><span className="field-label">Grade</span>
              <div className="chips-wrap">{GRADES.map((g) => <Chip key={g} on={f.grade === g} onClick={() => set('grade', g)}>Grade {g}</Chip>)}</div>
              {err.grade && <span className="field-error">{err.grade}</span>}
            </div>
            <div className={`field ${err.section ? 'has-error' : ''}`}><span className="field-label">Class</span>
              <div className="option-list">
                {SECTIONS.map((sec) => {
                  const n = f.grade ? state.students.filter((s) => s.grade === f.grade && s.section === sec && s.status !== 'withdrawn').length : null
                  return (
                    <button key={sec} type="button" className={`option ${f.section === sec ? 'is-on' : ''}`} onClick={() => set('section', sec)} disabled={!f.grade}>
                      <b>{f.grade || ''}{sec}</b><span>{n == null ? 'Choose a grade first' : `${n} students${n >= 22 ? ', nearly full' : ''}`}</span>
                    </button>
                  )
                })}
              </div>
              {err.section && <span className="field-error">{err.section}</span>}
            </div>
            <div className={`field ${err.house ? 'has-error' : ''}`}><span className="field-label">House</span>
              <div className="chips-wrap">{HOUSES.map((h) => <Chip key={h} on={f.house === h} onClick={() => set('house', h)}>{h}</Chip>)}</div>
              {err.house && <span className="field-error">{err.house}</span>}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="form-h">First contact</h2>
            <Field label="Full name" error={err.g1name}><input value={f.g1.name} onChange={(e) => { setG('g1', 'name', e.target.value); setErr({ ...err, g1name: undefined }) }} autoComplete="off" /></Field>
            <div className={`field ${err.g1rel ? 'has-error' : ''}`}><span className="field-label">Relationship</span>
              <div className="chips-wrap">{['Mother', 'Father', 'Grandparent', 'Carer', 'Other'].map((r) => <Chip key={r} on={f.g1.relation === r} onClick={() => setG('g1', 'relation', r)}>{r}</Chip>)}</div>
              {err.g1rel && <span className="field-error">{err.g1rel}</span>}
            </div>
            <Field label="Mobile" error={err.g1phone} optional><input type="tel" inputMode="tel" value={f.g1.phone} onChange={(e) => setG('g1', 'phone', e.target.value)} placeholder="+44 7700 900123" /></Field>
            <Field label="Email" error={err.g1email} optional><input type="email" inputMode="email" value={f.g1.email} onChange={(e) => setG('g1', 'email', e.target.value)} /></Field>
            <h2 className="form-h">Second contact <em>optional</em></h2>
            <Field label="Full name" optional><input value={f.g2.name} onChange={(e) => setG('g2', 'name', e.target.value)} autoComplete="off" /></Field>
            <Field label="Mobile" optional><input type="tel" inputMode="tel" value={f.g2.phone} onChange={(e) => setG('g2', 'phone', e.target.value)} /></Field>
            {f.g2.name && <label className="check"><input type="checkbox" checked={f.pickup2} onChange={(e) => set('pickup2', e.target.checked)} /> Can collect the student from school</label>}
          </>
        )}

        {step === 3 && (
          <>
            <Field label="Allergies" optional help="Separate with commas. Shown to every teacher."><input value={f.allergies} onChange={(e) => set('allergies', e.target.value)} /></Field>
            <Field label="Medical conditions" optional help="Shown to every teacher as an alert."><input value={f.conditions} onChange={(e) => set('conditions', e.target.value)} /></Field>
            <Field label="Learning support" optional help="Office and nurse only."><input value={f.support} onChange={(e) => set('support', e.target.value)} /></Field>
            {[['consentPhoto', 'Photos in school media'], ['consentTrips', 'Standing consent for local trips'], ['consentMedical', 'Emergency medical treatment']].map(([k, l]) => (
              <div key={k} className={`field ${err[k] ? 'has-error' : ''}`}><span className="field-label">{l}</span>
                <Segmented label={l} value={f[k] == null ? '' : f[k] ? 'yes' : 'no'} onChange={(v) => set(k, v === 'yes')} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
                {err[k] && <span className="field-error">{err[k]}</span>}
              </div>
            ))}
          </>
        )}

        {step === 4 && (
          <div className="review">
            <div className="review-head">
              <Avatar s={{ first: f.first || '?', last: f.last || '?' }} size={56} />
              <div><strong>{f.first} {f.last}</strong><small>{f.grade}{f.section}, {f.house}. Born {fmtDate(f.dob)}</small></div>
            </div>
            <dl className="kv">
              <div><dt>First contact</dt><dd>{f.g1.name}, {f.g1.relation.toLowerCase()}{f.g1.phone ? `, ${f.g1.phone}` : ''}</dd></div>
              {f.g2.name && <div><dt>Second contact</dt><dd>{f.g2.name}{f.pickup2 ? ', can collect' : ', cannot collect'}</dd></div>}
              <div><dt>Health alerts</dt><dd>{[f.allergies, f.conditions].filter(Boolean).join(', ') || 'None'}</dd></div>
              <div><dt>Consents</dt><dd>Photos {f.consentPhoto ? 'yes' : 'no'}, trips {f.consentTrips ? 'yes' : 'no'}, medical {f.consentMedical == null ? 'not yet' : f.consentMedical ? 'yes' : 'no'}</dd></div>
            </dl>
            {missingNow.length ? (
              <p className="missing-card inline"><Warning2 size={18} color="currentColor" /> Saves as incomplete. Still needed: {missingNow.join(', ')}.</p>
            ) : (
              <p className="ok-line"><TickCircle size={18} color="currentColor" variant="Bold" /> Everything the school needs is here.</p>
            )}
          </div>
        )}
      </div>

      <div className="form-foot">
        {step > 0 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
        {step < STEPS.length - 1 ? <Button onClick={next}>Continue</Button> : <Button onClick={finish}>Add to the roll</Button>}
      </div>
    </div>
  )
}

// Day, month, year as three number boxes. Faster to type than a calendar for a birth date
// years back, and it looks the same on every phone.
function DobField({ value, error, onChange }) {
  const [d, m, y] = value ? [value.slice(8, 10), value.slice(5, 7), value.slice(0, 4)] : ['', '', '']
  const [parts, setParts] = useState({ d, m, y })
  const update = (k, v) => {
    const next = { ...parts, [k]: v.replace(/\D/g, '') }
    setParts(next)
    const ok = next.d.length && next.m.length && next.y.length === 4
    const iso = ok ? `${next.y}-${next.m.padStart(2, '0')}-${next.d.padStart(2, '0')}` : ''
    const valid = iso && !Number.isNaN(new Date(`${iso}T12:00:00`).getTime()) && Number(next.m) <= 12 && Number(next.d) <= 31
    onChange(valid ? iso : '')
  }
  return (
    <div className={`field ${error ? 'has-error' : ''}`} role="group" aria-labelledby="dob-label">
      <span className="field-label" id="dob-label">Date of birth</span>
      <div className="dob">
        <label><span>Day</span><input inputMode="numeric" maxLength={2} value={parts.d} onChange={(e) => update('d', e.target.value)} placeholder="DD" /></label>
        <label><span>Month</span><input inputMode="numeric" maxLength={2} value={parts.m} onChange={(e) => update('m', e.target.value)} placeholder="MM" /></label>
        <label className="dob-y"><span>Year</span><input inputMode="numeric" maxLength={4} value={parts.y} onChange={(e) => update('y', e.target.value)} placeholder="YYYY" /></label>
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}
