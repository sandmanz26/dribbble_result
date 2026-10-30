import { GRADES, SECTIONS, HOUSES, SUBJECTS, NOW } from './school.js'

// Seeded so every reviewer sees the same school. Sample data only, no real people.
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const r = rng(1729)
const pick = (a) => a[Math.floor(r() * a.length)]
const int = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1))

const FIRST_F = ['Amara', 'Lucía', 'Hana', 'Priya', 'Zainab', 'Ingrid', 'Nadia', 'Chloe', 'Yuna', 'Folake', 'Mei', 'Sofia', 'Aisha', 'Freya', 'Leila', 'Rosa', 'Elif', 'Tamsin', 'Ayu', 'Mariam', 'Isla', 'Noor', 'Thandiwe', 'Clara', 'Saanvi', 'Wren', 'Esther', 'Kaia', 'Maya', 'Ines']
const FIRST_M = ['Mateo', 'Kofi', 'Arjun', 'Hiroshi', 'Omar', 'Lukas', 'Daniel', 'Tariq', 'Jonah', 'Rafael', 'Kwame', 'Ethan', 'Bima', 'Felix', 'Idris', 'Theo', 'Rohan', 'Emeka', 'Santiago', 'Joon', 'Ilya', 'Malik', 'Oscar', 'Yusuf', 'Ravi', 'Hamza', 'Leon', 'Tobias', 'Dimas', 'Callum']
const LAST = ['Okafor', 'Haddad', 'Nakamura', 'Fernández', 'Sharma', 'Lindqvist', 'Mensah', 'Kowalski', 'Rahman', 'Silva', 'Chen', 'Abara', 'Moreau', 'Novak', 'Santoso', 'Osei', 'Petrov', 'Kaya', 'Gallagher', 'Mbeki', 'Tanaka', 'Romero', 'Iyer', 'Brennan', 'Adeyemi', 'Kim', 'Lestari', 'Duarte', 'Hassan', 'Whitfield', 'Varga', 'Nguyen', 'Castillo', 'Ali', 'Park', 'Owusu', 'Becker', 'Pereira', 'Wiśniewska', 'Achieng']
const STREETS = ['Marlow Road', 'Quarry Lane', 'Linden Avenue', 'Harbour Street', 'Fenwick Close', 'Orchard Rise', 'Station Parade', 'Willow Crescent', 'Kiln Way', 'Beacon Hill']
const ALLERGIES = ['Peanuts', 'Tree nuts', 'Penicillin', 'Bee stings', 'Shellfish', 'Lactose']
const CONDITIONS = ['Asthma', 'Type 1 diabetes', 'Epilepsy', 'Eczema']
const MEDS = { Asthma: 'Salbutamol inhaler, kept in bag', 'Type 1 diabetes': 'Insulin pen, nurse office', Epilepsy: 'Buccal midazolam, nurse office', Eczema: 'Emollient cream' }
const SUPPORT = ['Dyslexia, extra time in exams', 'ADHD, seat near the front', 'Hearing aid, left ear', 'English as an additional language']

const phone = () => `+44 7${int(100, 999)} ${int(100000, 999999)}`
const pad = (n, w = 2) => String(n).padStart(w, '0')
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function makeStudent(i, grade, section) {
  const female = r() < 0.5
  const first = female ? pick(FIRST_F) : pick(FIRST_M)
  const last = pick(LAST)
  const birthYear = NOW.getFullYear() - (grade + 5) - (r() < 0.3 ? 1 : 0)
  const dob = new Date(birthYear, int(0, 11), int(1, 28))
  const enrolYear = Math.max(2020, NOW.getFullYear() - 1 - (grade - 7))
  const id = `${String(enrolYear).slice(2)}-${pad(i + 101, 4)}`
  const g1Last = r() < 0.85 ? last : pick(LAST)
  const g1First = pick(r() < 0.6 ? FIRST_F : FIRST_M)
  const guardians = [
    { name: `${g1First} ${g1Last}`, relation: pick(['Mother', 'Father', 'Mother', 'Father', 'Grandmother', 'Aunt']), phone: phone(), email: `${g1First.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}.${g1Last.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}@mail.example`, primary: true, pickup: true },
  ]
  if (r() < 0.7) {
    const g2First = pick(r() < 0.5 ? FIRST_F : FIRST_M)
    guardians.push({ name: `${g2First} ${r() < 0.8 ? last : pick(LAST)}`, relation: pick(['Father', 'Mother', 'Stepfather', 'Uncle']), phone: phone(), email: '', primary: false, pickup: r() < 0.7 })
  }
  if (r() < 0.04) guardians[guardians.length - 1].note = 'Court order on file: no pickup without registrar check'

  const health = { allergies: [], conditions: [], medication: [], support: [], doctor: `Dr ${pick(LAST)}, ${pick(['Marlow', 'Fenwick', 'Kiln'])} Medical Practice` }
  if (r() < 0.12) health.allergies.push(pick(ALLERGIES))
  if (r() < 0.1) { const c = pick(CONDITIONS); health.conditions.push(c); health.medication.push(MEDS[c]) }
  if (r() < 0.1) health.support.push(pick(SUPPORT))

  // Records are messy in real schools: some fields are missing on purpose.
  const missing = []
  const address = r() < 0.97 ? `${int(2, 188)} ${pick(STREETS)}, Marlow ${pick(['SL7', 'SL8'])} ${int(1, 9)}${pick(['AB', 'DE', 'HQ', 'LR', 'TW'])}` : ''
  const nationalId = r() < 0.95 ? `${pick(['QK', 'TR', 'NH', 'BW'])} ${int(10, 99)} ${int(10, 99)} ${int(10, 99)} ${pick(['A', 'B', 'C', 'D'])}` : ''
  const consents = { photo: r() < 0.82, trips: r() < 0.9, medical: r() < 0.88 }
  if (!address) missing.push('address')
  if (!nationalId) missing.push('nationalId')
  if (r() < 0.03) { guardians[0].phone = ''; missing.push('guardianPhone') }
  if (r() < 0.03) { consents.medical = null; missing.push('medicalConsent') }

  // Marks: a stable ability per student, a subject tilt, and term noise.
  const ability = 48 + r() * 42
  const exams = {}
  for (const s of SUBJECTS) {
    const tilt = (r() - 0.5) * 18
    const t1 = Math.round(Math.min(100, Math.max(12, ability + tilt + (r() - 0.5) * 14)))
    exams[s] = { T1: t1 }
  }

  const status = r() < 0.03 ? 'withdrawn' : missing.length ? 'pending' : 'enrolled'
  return {
    id, first, last, preferred: r() < 0.1 ? first.slice(0, 3) : '', sex: female ? 'Female' : 'Male',
    dob: iso(dob), grade, section, cls: `${grade}${section}`, house: pick(HOUSES),
    status, enrolled: `${enrolYear}-09-0${int(1, 8)}`, address, nationalId, guardians, health, consents, missing, exams,
    attendance: Math.round((0.86 + r() * 0.14) * 1000) / 10,
    updated: iso(new Date(NOW.getTime() - int(0, 120) * 86400000)),
  }
}

export function buildStudents() {
  const list = []
  let i = 0
  for (const g of GRADES) for (const s of SECTIONS) {
    const n = int(18, 22)
    for (let k = 0; k < n; k++) list.push(makeStudent(i++, g, s))
  }
  // Two near-identical names so the duplicate check and search ranking have something to do.
  list[37].first = 'Amara'; list[37].last = 'Okafor'
  list[121].first = 'Amarah'; list[121].last = 'Okafor'
  return list.sort((a, b) => a.last.localeCompare(b.last) || a.first.localeCompare(b.first))
}

// Term 2 midterm assessments, one per class and subject. Some are in flight.
export function buildAssessments(students) {
  const out = []
  const classes = [...new Set(students.map((s) => s.cls))]
  for (const cls of classes) for (const subject of SUBJECTS) {
    const roster = students.filter((s) => s.cls === cls && s.status !== 'withdrawn')
    const seed = (cls.charCodeAt(0) + cls.charCodeAt(cls.length - 1) + subject.length) % 7
    let status = ['locked', 'submitted', 'draft', 'open', 'locked', 'draft', 'open'][seed]
    if (cls === '9B' && subject === 'Mathematics') status = 'draft'
    if (cls === '10B' && subject === 'Mathematics') status = 'submitted'
    if (cls === '9A' && subject === 'Mathematics') status = 'open'
    const marks = {}
    roster.forEach((s, idx) => {
      const base = s.exams[subject].T1
      const v = Math.round(Math.min(100, Math.max(8, base + (((idx * 37) % 17) - 8))))
      if (status === 'open') return
      if (status === 'draft' && idx > roster.length * 0.6) return
      marks[s.id] = idx % 23 === 5 ? 'A' : v
    })
    out.push({
      id: `${cls}-${subject.slice(0, 4).toLowerCase()}`, cls, subject, term: 'T2', max: 100,
      title: `${subject} midterm`, date: '2027-02-10', due: '2027-02-24', status, marks,
      teacher: subject === 'Mathematics' && ['9A', '9B', '10B'].includes(cls) ? 'Tomasz Wilk' : null,
      note: '',
    })
  }
  return out
}
