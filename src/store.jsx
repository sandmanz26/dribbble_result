import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { buildStudents, buildAssessments } from './data/students.js'
import { BRANDS, USERS, NOW } from './data/school.js'

const KEY = 'roll-state-v1'

function fresh() {
  const students = buildStudents()
  return {
    role: 'registrar',
    brandId: 'kestrel',
    theme: 'system',
    online: true,
    locked: false,
    students,
    assessments: buildAssessments(students),
    audit: [
      { at: '2027-02-18T08:10:00', who: 'Tomasz Wilk', action: 'Viewed', target: 'Kofi Mensah', detail: 'Profile, class list' },
      { at: '2027-02-17T15:32:00', who: 'Marisol Ventura', action: 'Revealed', target: 'Lucía Haddad', detail: 'Health details. Reason: nurse asked for allergy list' },
      { at: '2027-02-17T11:05:00', who: 'Marisol Ventura', action: 'Edited', target: 'Ethan Novak', detail: 'Address changed' },
      { at: '2027-02-16T09:47:00', who: 'Marisol Ventura', action: 'Exported', target: 'Grade 11', detail: 'Emergency contacts, science museum trip' },
    ],
    requests: [
      { id: 'rq-1', at: '2027-02-17T14:20:00', by: 'Tomasz Wilk', studentId: null, field: 'Guardian phone', value: '+44 7412 550918', note: 'Mother called, new number', status: 'open' },
    ],
    recent: [],
    queue: [],
    draft: null,
    toast: null,
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...JSON.parse(raw), toast: null, locked: false }
  } catch {}
  return null
}

function seedRequest(s) {
  // Point the sample correction request at a real 9B student.
  const rq = s.requests[0]
  if (rq && !rq.studentId) {
    const st = s.students.find((x) => x.cls === '9B' && x.status !== 'withdrawn')
    rq.studentId = st.id
  }
  return s
}

function reducer(s, a) {
  switch (a.type) {
    case 'set': return { ...s, ...a.patch }
    case 'reset': return seedRequest(fresh())
    case 'log': return { ...s, audit: [{ at: stamp(), who: USERS[s.role].name, ...a.entry }, ...s.audit].slice(0, 200) }
    case 'visit': return { ...s, recent: [a.id, ...s.recent.filter((x) => x !== a.id)].slice(0, 6) }
    case 'updateStudent': {
      const students = s.students.map((x) => (x.id === a.id ? recompute({ ...x, ...a.patch }) : x))
      return queued({ ...s, students }, `Update ${a.label}`)
    }
    case 'addStudent': return queued({ ...s, students: [...s.students, recompute(a.student)], draft: null }, `New record ${a.student.first} ${a.student.last}`)
    case 'updateAssessment': {
      const assessments = s.assessments.map((x) => (x.id === a.id ? { ...x, ...a.patch } : x))
      return a.silent ? { ...s, assessments } : queued({ ...s, assessments }, a.label || 'Marks')
    }
    case 'request': return { ...s, requests: [{ id: `rq-${Date.now()}`, at: stamp(), by: USERS[s.role].name, status: 'open', ...a.request }, ...s.requests] }
    case 'resolveRequest': return { ...s, requests: s.requests.map((r) => (r.id === a.id ? { ...r, status: a.status } : r)) }
    case 'sync': return { ...s, queue: [] }
    case 'toast': return { ...s, toast: a.toast ? { id: Date.now(), ...a.toast } : null }
    default: return s
  }
}

// When offline, writes still land on the phone and wait in a queue (shown in the banner).
function queued(s, label) {
  return s.online ? s : { ...s, queue: [...s.queue, { label, at: stamp() }] }
}

export function recompute(st) {
  const missing = []
  if (!st.address) missing.push('address')
  if (!st.nationalId) missing.push('nationalId')
  if (!st.guardians?.[0]?.phone) missing.push('guardianPhone')
  if (st.consents?.medical == null) missing.push('medicalConsent')
  const status = st.status === 'withdrawn' ? 'withdrawn' : missing.length ? 'pending' : 'enrolled'
  return { ...st, missing, status }
}

// The prototype's clock starts at the demo time and moves forward with real time.
const started = Date.now()
export function stamp() {
  const d = new Date(NOW.getTime() + (Date.now() - started))
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 19)
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => load() || seedRequest(fresh()))
  const timer = useRef()

  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      try { const { toast, ...rest } = state; localStorage.setItem(KEY, JSON.stringify(rest)) } catch {}
    }, 250)
  }, [state])

  const user = USERS[state.role]
  const brand = BRANDS.find((b) => b.id === state.brandId) || BRANDS[0]

  const toast = useCallback((text, tone = 'ok') => dispatch({ type: 'toast', toast: { text, tone } }), [])
  const log = useCallback((entry) => dispatch({ type: 'log', entry }), [])

  // Teachers only see their own classes. The rule lives here so every screen gets it.
  const visible = useMemo(
    () => (user.classes ? state.students.filter((s) => user.classes.includes(s.cls)) : state.students),
    [state.students, user],
  )

  const value = useMemo(() => ({ state, dispatch, user, brand, toast, log, visible }), [state, user, brand, toast, log, visible])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
