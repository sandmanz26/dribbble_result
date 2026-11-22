// Sample people and records for the student, parent and teacher dashboards.
// All names, the school and every mark are samples. Demo clock: Sunday 22 November 2026.

export const TODAY = new Date('2026-11-22T18:40:00')
export const EXAMS_START = new Date('2027-05-10T09:00:00') // A-Level exams start the week of 10 May 2027 (provisional timetable)
export const daysBetween = (a, b) => Math.round((b - a) / 86400000)
export const DAYS_TO_EXAMS = daysBetween(new Date('2026-11-22'), new Date('2027-05-10'))

export const SCHOOL = 'Riverside Sixth Form'

export const STUDENT = {
  first: 'Maya',
  last: 'Patel',
  year: 'Year 13',
  courses: [
    { id: 'econ', subject: 'Economics', board: 'AQA 7136', lessonsDone: 41, lessonsTotal: 118, plan: 'Complete' },
    { id: 'bus', subject: 'Business', board: 'AQA 7132', lessonsDone: 22, lessonsTotal: 104, plan: 'Core' },
  ],
  target: 'A',
}

// Economics spec, by area: lessons done of lessons in the area (AQA 7136 headings, sample counts).
export const SPEC = [
  { code: '4.1.1', name: 'Economic methodology and the economic problem', done: 6, total: 6 },
  { code: '4.1.2', name: 'Individual economic decision making', done: 5, total: 7 },
  { code: '4.1.3', name: 'Price determination in a competitive market', done: 11, total: 12 },
  { code: '4.1.4', name: 'Production, costs and revenue', done: 9, total: 14 },
  { code: '4.1.5', name: 'Perfect competition, imperfectly competitive markets and monopoly', done: 4, total: 16 },
  { code: '4.1.6', name: 'The labour market', done: 6, total: 10 },
  { code: '4.1.7', name: 'Distribution of income and wealth', done: 0, total: 6 },
  { code: '4.1.8', name: 'The market mechanism, market failure and government intervention', done: 0, total: 15 },
  { code: '4.2', name: 'The national and international economy', done: 0, total: 32 },
]

// Marked answers in Economics, oldest first. AO marks out of the question's tariff split.
export const ANSWERS = [
  { id: 'a1', date: '2026-10-06', q: 'Explain how a subsidy affects the market for electric cars.', tariff: 9, ao: { AO1: [2, 3], AO2: [1, 2], AO3: [2, 4] }, attempt: 1 },
  { id: 'a2', date: '2026-10-13', q: 'Evaluate whether a national minimum wage increase reduces poverty.', tariff: 25, ao: { AO1: [4, 5], AO2: [4, 5], AO3: [5, 7], AO4: [2, 8] }, attempt: 1 },
  { id: 'a3', date: '2026-10-20', q: 'Explain why demand for cigarettes is price inelastic.', tariff: 9, ao: { AO1: [3, 3], AO2: [1, 2], AO3: [3, 4] }, attempt: 1 },
  { id: 'a4', date: '2026-11-03', q: 'Evaluate the case for a sugar tax on soft drinks.', tariff: 25, ao: { AO1: [4, 5], AO2: [4, 5], AO3: [5, 7], AO4: [3, 8] }, attempt: 1 },
  { id: 'a5', date: '2026-11-10', q: 'Evaluate whether monopolies are always against the public interest.', tariff: 25, ao: { AO1: [5, 5], AO2: [3, 5], AO3: [6, 7], AO4: [3, 8] }, attempt: 1 },
  { id: 'a6', date: '2026-11-17', q: 'Evaluate whether a national minimum wage increase reduces poverty.', tariff: 25, ao: { AO1: [5, 5], AO2: [4, 5], AO3: [6, 7], AO4: [5, 8] }, attempt: 2 },
  { id: 'a7', date: '2026-11-21', q: 'Explain how the price elasticity of demand for petrol affects fuel duty revenue.', tariff: 9, ao: { AO1: [3, 3], AO2: [2, 2], AO3: [3, 4] }, attempt: 1 },
]

// AQA 25-mark level boundaries (Level 5 is 21–25).
const LEVELS_25 = [[21, 5], [16, 4], [11, 3], [6, 2], [1, 1]]
const LEVELS_9 = [[7, 3], [4, 2], [1, 1]]
export function scoreOf(a) {
  const mark = Object.values(a.ao).reduce((s, [m]) => s + m, 0)
  const max = Object.values(a.ao).reduce((s, [, x]) => s + x, 0)
  console.assert(max === a.tariff, 'AO maxima must add up to the tariff', a)
  const table = a.tariff === 25 ? LEVELS_25 : LEVELS_9
  const level = (table.find(([min]) => mark >= min) || [0, 0])[1]
  return { mark, max, level, pct: Math.round((mark / max) * 100) }
}

// AO4 on the 25-markers: the finding on Maya's home.
const essays = ANSWERS.filter((a) => a.tariff === 25)
export const AO4_SHARE = {
  gained: essays.reduce((s, a) => s + a.ao.AO4[0], 0),
  available: essays.reduce((s, a) => s + a.ao.AO4[1], 0),
  count: essays.length,
}

// This week, Monday 16 to Sunday 22 November, minutes per day.
export const WEEK = [
  { day: 'Mon', minutes: 45, lessons: 2, marked: 0 },
  { day: 'Tue', minutes: 40, lessons: 0, marked: 1 },
  { day: 'Wed', minutes: 70, lessons: 3, marked: 0 },
  { day: 'Thu', minutes: 35, lessons: 1, marked: 0 },
  { day: 'Fri', minutes: 0, lessons: 0, marked: 0 },
  { day: 'Sat', minutes: 55, lessons: 2, marked: 1 },
  { day: 'Sun', minutes: 45, lessons: 1, marked: 0 },
]
export const WEEK_TOTAL = WEEK.reduce((s, d) => ({ minutes: s.minutes + d.minutes, lessons: s.lessons + d.lessons, marked: s.marked + d.marked }), { minutes: 0, lessons: 0, marked: 0 })
export const fmtMinutes = (m) => `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} m`

export const NEXT_UP = [
  { kind: 'rewrite', title: 'Rewrite: Are monopolies always against the public interest?', why: 'Your judgement earned 3 of 8 for evaluation. Add a “depends on” and a final verdict.', minutes: 25 },
  { kind: 'lesson', title: '4.1.5.6 Monopoly and price discrimination', why: 'Next lesson in spec order.', minutes: 8 },
  { kind: 'check', title: 'Knowledge check: market structures', why: '12 quick questions on 4.1.5 before you move on.', minutes: 10 },
]

export const PARENT = {
  first: 'Priya',
  last: 'Patel',
  child: 'Maya',
  billing: [
    { subject: 'Economics', plan: 'Complete', price: 20.99 },
    { subject: 'Business', plan: 'Core', price: 9.99 },
  ],
  renews: 'Thursday 3 December',
}
export const PARENT_MONTHLY = Math.round(PARENT.billing.reduce((s, b) => s + b.price * 100, 0)) / 100

// Teacher: Mr Daniel Mensah, Economics, class 13E.
export const TEACHER = { title: 'Mr', first: 'Daniel', last: 'Mensah', subject: 'Economics', board: 'AQA 7136', className: '13E Economics' }

export const HOMEWORK = {
  title: 'Evaluate whether an increase in the national minimum wage reduces poverty.',
  tariff: 25,
  set: 'Monday 16 November',
  due: 'Friday 27 November',
}

// Class 13E. Each submitted answer to the homework carries AO marks and the marker's confidence.
// confidence: how far the mark sits from a level boundary in the AI marker's own estimate (low = check first).
export const CLASS = [
  { name: 'Aisha Rahman', sub: { AO1: 4, AO2: 4, AO3: 5, AO4: 2 }, confidence: 'low', words: 712 },
  { name: 'Ben Carter', sub: { AO1: 4, AO2: 3, AO3: 4, AO4: 2 }, confidence: 'high', words: 488 },
  { name: 'Chloe Nwosu', sub: { AO1: 5, AO2: 5, AO3: 6, AO4: 6 }, confidence: 'high', words: 905 },
  { name: 'Dev Sharma', sub: { AO1: 4, AO2: 4, AO3: 5, AO4: 3 }, confidence: 'low', words: 640 },
  { name: 'Ella Hughes', sub: null },
  { name: 'Finn O’Brien', sub: { AO1: 3, AO2: 2, AO3: 3, AO4: 1 }, confidence: 'high', words: 351 },
  { name: 'Grace Lin', sub: { AO1: 5, AO2: 4, AO3: 6, AO4: 4 }, confidence: 'medium', words: 778 },
  { name: 'Harry Booth', sub: { AO1: 4, AO2: 3, AO3: 5, AO4: 2 }, confidence: 'medium', words: 560 },
  { name: 'Imran Qureshi', sub: { AO1: 5, AO2: 5, AO3: 7, AO4: 5 }, confidence: 'low', words: 860 },
  { name: 'Jess Morgan', sub: null },
  { name: 'Kofi Asante', sub: { AO1: 4, AO2: 4, AO3: 5, AO4: 2 }, confidence: 'high', words: 602 },
  { name: 'Lily Evans', sub: { AO1: 5, AO2: 4, AO3: 5, AO4: 3 }, confidence: 'medium', words: 690 },
  { name: 'Maya Patel', sub: { AO1: 5, AO2: 4, AO3: 6, AO4: 5 }, confidence: 'high', words: 834 },
  { name: 'Noah Price', sub: { AO1: 3, AO2: 3, AO3: 4, AO4: 2 }, confidence: 'medium', words: 455 },
  { name: 'Olivia Grant', sub: { AO1: 5, AO2: 4, AO3: 6, AO4: 3 }, confidence: 'low', words: 751 },
  { name: 'Priya Singh', sub: null },
  { name: 'Reece Walker', sub: null },
  { name: 'Sophie Ward', sub: { AO1: 4, AO2: 4, AO3: 5, AO4: 3 }, confidence: 'high', words: 599 },
]
export const AO_MAX_25 = { AO1: 5, AO2: 5, AO3: 7, AO4: 8 }
console.assert(Object.values(AO_MAX_25).reduce((a, b) => a + b, 0) === 25, 'AO maxima must add to 25')

export const SUBMITTED = CLASS.filter((s) => s.sub)
export const classTotal = (s) => Object.values(s.sub).reduce((a, b) => a + b, 0)
export const levelOf25 = (m) => (LEVELS_25.find(([min]) => m >= min) || [0, 0])[1]

// Class average share of each AO, from the submitted answers as shown.
export const AO_CLASS = Object.keys(AO_MAX_25).map((ao) => {
  const gained = SUBMITTED.reduce((s, x) => s + x.sub[ao], 0)
  const available = SUBMITTED.length * AO_MAX_25[ao]
  return { ao, gained, available, pct: Math.round((gained / available) * 100) }
})
export const STOPPED_AT_L3 = SUBMITTED.filter((s) => levelOf25(classTotal(s)) <= 3)

// Review order: least sure first, then lowest marks.
const ORDER = { low: 0, medium: 1, high: 2 }
export const REVIEW_QUEUE = [...SUBMITTED].sort((a, b) => ORDER[a.confidence] - ORDER[b.confidence] || classTotal(a) - classTotal(b))

// The answer the teacher opens first in the review screen (Aisha, low confidence: 15, one mark under Level 4).
export const REVIEW_ANSWER = {
  student: 'Aisha Rahman',
  paragraphs: [
    { text: 'A national minimum wage is a legal lowest hourly rate that employers must pay. In April 2026 it rose by 4.1% to £12.71 for workers aged 21 and over.', codes: ['K', 'APP'] },
    { text: 'If the minimum wage is set above the equilibrium wage, the supply of labour rises while the demand for labour falls, so there is a surplus of labour, which is unemployment. Low-paid workers who lose their jobs would be pushed further into poverty.', codes: ['K', 'AN'] },
    { text: 'However, workers who keep their jobs earn more per hour, which raises household income at the bottom of the distribution. Because poorer households spend a larger share of their income, this also increases consumer spending.', codes: ['AN', 'EV'] },
    { text: 'On the other hand, many people in poverty are not in work at all, for example pensioners and people who are ill, so a higher minimum wage does not help them.', codes: ['EV'] },
    { text: 'In conclusion, a minimum wage increase reduces poverty to some extent but it depends on how big the increase is.', codes: ['EV?'] },
  ],
  aiMarks: { AO1: 4, AO2: 4, AO3: 5, AO4: 2 },
  aiNote: 'The conclusion says “it depends” but does not say on what, or reach a judgement. That keeps AO4 at Level 3. Nearly Level 4: check the judgement.',
  descriptorMissed: 'Level 4 needs “evaluation that is supported and reaches a reasoned judgement”.',
}
console.assert(classTotal(CLASS[0]) === Object.values(REVIEW_ANSWER.aiMarks).reduce((a, b) => a + b, 0), 'review answer must match the queue')
