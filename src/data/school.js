// Mock school. Every figure on screen is computed from the rows built here, so totals
// always agree with their parts. Generation is seeded per grade: the same grade always
// shows the same classes, people and marks. Sample data: replace with the school's records.
import { GIVEN, SURNAMES, TEACHERS } from './names.js'

export const SCHOOL = {
  en: 'Nelum Vidyalaya',
  si: 'නෙළුම් විද්‍යාලය',
  placeEn: 'Colombo 05',
  placeSi: 'කොළඹ 05',
}

// The prototype runs on a fixed school day so every state is there to see:
// Thursday of the third term, during period 4.
export const DEMO_NOW = { date: '2026-10-23', minutes: 10 * 60 + 5 }
export const TERM = { n: 3, startsEn: '1 Sep', startsSi: 'සැප් 1', daysSoFar: 38 }
export const NEXT_TEST = { date: '2026-11-23', daysAway: 31 }
export const ATTENDANCE_FLOOR = 80 // % of school days. A/L school candidates need it to sit the exam.

// The school day: assembly, eight 40-minute periods, one interval.
export const PERIODS = [
  { n: 1, start: '07:50', end: '08:30' },
  { n: 2, start: '08:30', end: '09:10' },
  { n: 3, start: '09:10', end: '09:50' },
  { n: 4, start: '09:50', end: '10:30' },
  { n: 5, start: '10:50', end: '11:30' },
  { n: 6, start: '11:30', end: '12:10' },
  { n: 7, start: '12:10', end: '12:50' },
  { n: 8, start: '12:50', end: '13:30' },
]
export const INTERVAL = { start: '10:30', end: '10:50' }
export const DAY = { start: '07:30', end: '13:30' }
export const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
export function periodState(p, now = DEMO_NOW.minutes) {
  if (now >= toMin(p.end)) return 'past'
  if (now >= toMin(p.start)) return 'now'
  return 'next'
}

export const SUBJECTS = {
  sin: { en: 'Sinhala', si: 'සිංහල', short: 'SIN' },
  mat: { en: 'Mathematics', si: 'ගණිතය', short: 'MAT' },
  env: { en: 'Environment', si: 'පරිසරය', short: 'ENV' },
  eng: { en: 'English', si: 'ඉංග්‍රීසි', short: 'ENG' },
  bud: { en: 'Buddhism', si: 'බුද්ධ ධර්මය', short: 'BUD' },
  art: { en: 'Art', si: 'චිත්‍ර', short: 'ART' },
  sci: { en: 'Science', si: 'විද්‍යාව', short: 'SCI' },
  his: { en: 'History', si: 'ඉතිහාසය', short: 'HIS' },
  geo: { en: 'Geography', si: 'භූගෝල විද්‍යාව', short: 'GEO' },
  civ: { en: 'Civics', si: 'පුරවැසි අධ්‍යාපනය', short: 'CIV' },
  hpe: { en: 'Health and PE', si: 'සෞඛ්‍ය හා ශාරීරික', short: 'HPE' },
  ict: { en: 'ICT', si: 'තොරතුරු තාක්ෂණය', short: 'ICT' },
  tam: { en: 'Tamil', si: 'දෙමළ', short: 'TAM' },
  com: { en: 'Commerce', si: 'ව්‍යාපාර අධ්‍යයනය', short: 'COM' },
  cmt: { en: 'Combined Maths', si: 'සංයුක්ත ගණිතය', short: 'CMT' },
  phy: { en: 'Physics', si: 'භෞතික විද්‍යාව', short: 'PHY' },
  che: { en: 'Chemistry', si: 'රසායන විද්‍යාව', short: 'CHE' },
  bio: { en: 'Biology', si: 'ජීව විද්‍යාව', short: 'BIO' },
  acc: { en: 'Accounting', si: 'ගිණුම්කරණය', short: 'ACC' },
  bst: { en: 'Business Studies', si: 'ව්‍යාපාර අධ්‍යයනය', short: 'BST' },
  eco: { en: 'Economics', si: 'ආර්ථික විද්‍යාව', short: 'ECO' },
  pol: { en: 'Political Science', si: 'දේශපාලන විද්‍යාව', short: 'POL' },
  sfl: { en: 'Sinhala Literature', si: 'සිංහල සාහිත්‍යය', short: 'SLT' },
  et: { en: 'Engineering Tech', si: 'ඉංජිනේරු තාක්ෂණය', short: 'ET' },
  sft: { en: 'Science for Tech', si: 'තාක්ෂණය සඳහා විද්‍යාව', short: 'SFT' },
  gen: { en: 'General English', si: 'සාමාන්‍ය ඉංග්‍රීසි', short: 'GEN' },
}

// Sri Lankan school stages and the national exams that sit inside them.
export const STAGES = [
  { id: 'primary', from: 1, to: 5, en: 'Primary', si: 'ප්‍රාථමික' },
  { id: 'junior', from: 6, to: 9, en: 'Junior secondary', si: 'කනිෂ්ඨ ද්විතීයික' },
  { id: 'senior', from: 10, to: 11, en: 'Senior secondary', si: 'ජ්‍යෙෂ්ඨ ද්විතීයික' },
  { id: 'collegiate', from: 12, to: 13, en: 'Collegiate', si: 'උසස් පෙළ' },
]
export const EXAMS = [
  { grade: 5, en: 'Grade 5 Scholarship', si: '5 ශ්‍රේණිය ශිෂ්‍යත්වය', short: { en: 'Scholarship', si: 'ශිෂ්‍යත්වය' } },
  { grade: 11, en: 'G.C.E. Ordinary Level', si: 'අ.පො.ස. සාමාන්‍ය පෙළ', short: { en: 'O/L', si: 'සා/පෙළ' } },
  { grade: 13, en: 'G.C.E. Advanced Level', si: 'අ.පො.ස. උසස් පෙළ', short: { en: 'A/L', si: 'උ/පෙළ' } },
]
export const stageOf = (g) => STAGES.find((s) => g >= s.from && g <= s.to)
export const nextExam = (g) => EXAMS.find((e) => e.grade >= g)

const STREAMS = [
  { id: 'maths', en: 'Maths', si: 'ගණිත', subjects: ['cmt', 'phy', 'che'] },
  { id: 'bio', en: 'Bio science', si: 'ජීව විද්‍යා', subjects: ['bio', 'phy', 'che'] },
  { id: 'commerce', en: 'Commerce', si: 'වාණිජ', subjects: ['acc', 'bst', 'eco'] },
  { id: 'arts', en: 'Arts', si: 'කලා', subjects: ['sfl', 'pol', 'geo'] },
  { id: 'tech', en: 'Technology', si: 'තාක්ෂණ', subjects: ['et', 'sft', 'ict'] },
]

const STAGE_SUBJECTS = {
  primary: ['sin', 'mat', 'env', 'eng', 'bud', 'art'],
  junior: ['sin', 'mat', 'sci', 'eng', 'bud', 'his', 'geo', 'civ', 'hpe', 'ict', 'tam'],
  senior: ['sin', 'mat', 'sci', 'eng', 'bud', 'his', 'com', 'ict'],
}
const CLASS_COUNT = [0, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5]

function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const pick = (r, list) => list[Math.floor(r() * list.length)]
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

const cache = new Map()

export function getGrade(g) {
  if (cache.has(g)) return cache.get(g)
  const data = buildGrade(g)
  cache.set(g, data)
  return data
}

function buildGrade(g) {
  const r = rng(g * 7919 + 13)
  const stage = stageOf(g)
  const collegiate = stage.id === 'collegiate'
  const letters = 'ABCDE'.slice(0, CLASS_COUNT[g]).split('')

  // Teachers: a pool per grade, rotated so neighbouring grades do not share the same faces.
  const pool = TEACHERS.map((t, i) => TEACHERS[(i + g * 5) % TEACHERS.length])
  let nextTeacher = 0
  const teacherFor = new Map()
  const teachers = []
  const takeTeacher = (key, subject) => {
    if (teacherFor.has(key)) return teacherFor.get(key)
    const base = pool[nextTeacher++ % pool.length]
    const t = { id: `t${g}-${teachers.length}`, ...base, subject }
    teachers.push(t)
    teacherFor.set(key, t)
    return t
  }

  // Each subject has its own level this year and its own change since the first term.
  const subjectLevel = {}
  const subjectDrift = {}
  for (const k of Object.keys(SUBJECTS)) {
    subjectLevel[k] = Math.round((r() - 0.5) * 24)
    subjectDrift[k] = Math.round((r() - 0.5) * 12)
  }

  const classes = letters.map((L, ci) => {
    const stream = collegiate ? STREAMS[ci] : null
    // A/L classes are streams: three subjects plus General English, each taught as a double.
    const order = collegiate ? [...stream.subjects, 'gen'] : STAGE_SUBJECTS[stage.id]
    const size = g <= 5 ? 34 + Math.floor(r() * 7) : collegiate ? 24 + Math.floor(r() * 12) : 32 + Math.floor(r() * 8)
    const classTeacher = takeTeacher(collegiate ? `${stream.id}-${order[0]}` : `ct-${L}`, order[0])

    // Timetable: rotate subjects by class so a teacher shared by alternate classes is never in two rooms.
    const timetable = PERIODS.map((p) => {
      const subject = order[(p.n - 1 + ci) % order.length]
      const shareKey = collegiate ? `${stream.id}-${subject}` : `${subject}-${ci % 2}`
      const teacher = subject === order[0] ? classTeacher : takeTeacher(shareKey, subject)
      return { period: p.n, subject, teacherId: teacher.id }
    })

    const students = Array.from({ length: size }, (_, si) => {
      const given = pick(r, GIVEN)
      const sur = pick(r, SURNAMES)
      const ability = clamp(58 + (r() - 0.5) * 50 + (ci === 2 ? -6 : 0), 18, 96)
      const termAtt = Math.round(clamp(98 - Math.pow(r(), 5) * 34 - (ci === 2 ? 3 : 0), 58, 100))
      const marks = {}
      const prev = {}
      for (const s of order) {
        const bias = subjectLevel[s] + (s === 'mat' || s === 'cmt' ? -8 : s === 'bud' || s === 'sin' ? 6 : 0)
        marks[s] = Math.round(clamp(ability + bias + (r() - 0.5) * 24, 6, 100))
        prev[s] = Math.round(clamp(marks[s] - subjectDrift[s] + (r() - 0.5) * 12, 4, 100))
      }
      return {
        id: `${g}${L}${String(si + 1).padStart(2, '0')}`,
        admission: String(12000 + g * 400 + ci * 60 + si * 3 + Math.floor(r() * 3)),
        given,
        sur,
        termAtt,
        marks,
        prev,
      }
    })

    return {
      id: `${g}-${L}`,
      grade: g,
      letter: L,
      name: { en: collegiate ? `${g} ${stream.en}` : `${g}-${L}`, si: collegiate ? `${g} ${stream.si}` : `${g}-${L}` },
      stream,
      subjects: order,
      classTeacherId: classTeacher.id,
      students,
      timetable,
    }
  })

  // Today's register. One class is still unmarked, one is having a bad day.
  const unmarkedIndex = Math.floor(r() * classes.length)
  const lowIndex = (unmarkedIndex + 2) % classes.length
  for (const [ci, c] of classes.entries()) {
    const marked = ci !== unmarkedIndex
    const absentCount = ci === lowIndex ? Math.round(c.students.length * 0.17) : 1 + Math.floor(r() * 3)
    // The students who miss most days are the ones most likely to be away today.
    const byRisk = [...c.students].sort((a, b) => a.termAtt - b.termAtt)
    const absent = marked ? byRisk.slice(0, absentCount).map((s) => s.id) : []
    c.register = { marked, absent, markedAt: marked ? `07:${String(40 + ((ci * 3) % 15)).padStart(2, '0')}` : null }
  }

  // Teachers on leave today: their periods need a relief teacher.
  const teaching = teachers.filter((t) => classes.some((c) => c.timetable.some((x) => x.teacherId === t.id)))
  const leaveCount = classes.length >= 5 ? 2 : 1
  const onLeave = []
  for (let i = 0; onLeave.length < leaveCount && i < 40; i++) {
    const t = teaching[Math.floor(r() * teaching.length)]
    if (!onLeave.includes(t.id) && !classes.some((c) => c.classTeacherId === t.id)) onLeave.push(t.id)
  }

  return { grade: g, stage, classes, teachers, onLeave, unmarkedIndex, lowIndex }
}

// ---------- Derived figures. Screens read these, never their own sums. ----------

export const teacherById = (data, id) => data.teachers.find((t) => t.id === id)

export function attendanceToday(data) {
  const rows = data.classes.map((c) => {
    const enrolled = c.students.length
    const absent = c.register.absent.length
    return { c, enrolled, marked: c.register.marked, present: c.register.marked ? enrolled - absent : null, absent }
  })
  const marked = rows.filter((x) => x.marked)
  const enrolledMarked = marked.reduce((s, x) => s + x.enrolled, 0)
  const present = marked.reduce((s, x) => s + x.present, 0)
  const total = {
    enrolled: rows.reduce((s, x) => s + x.enrolled, 0),
    enrolledMarked,
    present,
    absent: enrolledMarked - present,
    rate: enrolledMarked ? (present / enrolledMarked) * 100 : null,
    unmarked: rows.filter((x) => !x.marked).length,
  }
  console.assert(total.present + total.absent === total.enrolledMarked, 'attendance does not add up')
  const lowest = marked.length ? [...marked].sort((a, b) => a.present / a.enrolled - b.present / b.enrolled)[0] : null
  return { rows, total, lowest }
}

// Periods taught today by a teacher who is on leave. Assignments come from the relief store.
export function reliefSlots(data, assigned = {}, now = DEMO_NOW.minutes) {
  const slots = []
  for (const c of data.classes) {
    for (const x of c.timetable) {
      if (!data.onLeave.includes(x.teacherId)) continue
      const p = PERIODS[x.period - 1]
      const key = `${c.id}:${x.period}`
      slots.push({ key, c, period: p, subject: x.subject, absentTeacherId: x.teacherId, state: periodState(p, now), coverId: assigned[key] || null })
    }
  }
  return slots.sort((a, b) => a.period.n - b.period.n || a.c.letter.localeCompare(b.c.letter))
}

// Periods already over were covered this morning; the open ones are the grade head's job now.
export function defaultRelief(data) {
  const assigned = {}
  for (const slot of reliefSlots(data)) {
    if (slot.state !== 'past') continue
    const free = freeTeachers(data, slot.period.n, assigned)
    if (free[0]) assigned[slot.key] = free[0].t.id
  }
  return assigned
}

// Teachers of this grade who are in school and have no class in the given period.
export function freeTeachers(data, periodN, assigned = {}) {
  const busy = new Set()
  for (const c of data.classes) for (const x of c.timetable) if (x.period === periodN) busy.add(x.teacherId)
  for (const [k, id] of Object.entries(assigned)) if (Number(k.split(':')[1]) === periodN) busy.add(id)
  const load = (id) => data.classes.reduce((s, c) => s + c.timetable.filter((x) => x.teacherId === id).length, 0)
  return data.teachers
    .filter((t) => !busy.has(t.id) && !data.onLeave.includes(t.id))
    .map((t) => ({ t, load: load(t.id) }))
    .sort((a, b) => a.load - b.load || a.t.en.localeCompare(b.t.en))
}

const mean = (xs) => (xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : 0)

// Second term test, by subject across the grade, against the first term.
export function termResults(data) {
  const subjects = [...new Set(data.classes.flatMap((c) => c.subjects))]
  const rows = subjects.map((s) => {
    const sat = data.classes.flatMap((c) => (c.subjects.includes(s) ? c.students : []))
    const avg = Math.round(mean(sat.map((x) => x.marks[s])))
    const prev = Math.round(mean(sat.map((x) => x.prev[s])))
    const below35 = sat.filter((x) => x.marks[s] < 35).length
    return { s, avg, prev, change: avg - prev, sat: sat.length, below35 }
  })
  rows.sort((a, b) => a.avg - b.avg)
  const byClass = data.classes.map((c) => {
    const all = c.students.flatMap((x) => c.subjects.map((s) => x.marks[s]))
    return { c, avg: Math.round(mean(all)) }
  })
  return { rows, weakest: rows[0], byClass }
}

export function studentAverage(c, st) {
  return Math.round(mean(c.subjects.map((s) => st.marks[s])))
}

export function belowFloor(data) {
  return data.classes.flatMap((c) => c.students.filter((s) => s.termAtt < ATTENDANCE_FLOOR).map((s) => ({ c, s })))
}

export function gradeSummary(g) {
  const d = getGrade(g)
  return {
    grade: g,
    classes: d.classes.length,
    students: d.classes.reduce((s, c) => s + c.students.length, 0),
    stage: d.stage,
    exam: EXAMS.find((e) => e.grade === g) || null,
  }
}
