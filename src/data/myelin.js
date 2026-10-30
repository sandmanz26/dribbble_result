// Sample workspace for the prototype: Fernwood Studio, a 40-person furniture brand. Every total on screen is computed
// from these rows. Prices are illustrative per-task costs in US dollars, not a real price list.

export const NOW = new Date('2026-10-30T09:12:00')
export const WORKSPACE = { name: 'Fernwood Studio', plan: 'Team', cap: 600, seats: 9 }

export const PATHS = {
  reflex: { id: 'reflex', name: 'Reflex', what: 'A habit or a verified answer, replayed', time: [0.03, 0.2], cost: [0.00001, 0.00004], color: 'var(--reflex)' },
  recall: { id: 'recall', name: 'Recall', what: 'Memory found, a small model writes it up', time: [0.6, 1.8], cost: [0.0004, 0.0014], color: 'var(--recall)' },
  reason: { id: 'reason', name: 'Reason', what: 'Thought through from scratch by the large model', time: [6, 45], cost: [0.02, 0.18], color: 'var(--reason)' },
}
export const PATH_ORDER = ['reflex', 'recall', 'reason']

export const PEOPLE = {
  maya: { name: 'Maya Okafor', role: 'Operations lead', hue: 32 },
  theo: { name: 'Theo Lindqvist', role: 'Customer care', hue: 200 },
  ines: { name: 'Ines Duarte', role: 'Founder', hue: 340 },
  jun: { name: 'Jun Park', role: 'Product designer', hue: 150 },
}
export const TYPES = ['Replies', 'Reports', 'Translations', 'Lookups', 'Drafting', 'Analysis']

// Seeded random, so the trace and the totals are the same on every visit.
function rng(seed) { let s = seed; return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296) }
const r = rng(1730)
const pick = (a) => a[Math.floor(r() * a.length)]
const span = ([a, b]) => a + (b - a) * r()

// The tasks people can open, in the order they happened (newest last).
export const FEATURED = [
  { id: 'T-2141', at: '2026-10-29T10:04', who: 'theo', type: 'Replies', path: 'reflex', habit: 'H-02', time: 0.05, cost: 0.00002, base: 0.031, conf: 0.97,
    ask: 'What is our refund rule for items damaged in delivery?',
    answer: 'Full refund or a free replacement, the customer chooses. They send photos within 14 days of delivery; no need to return the item if the damage is structural. Approved by Maya on 12 August.',
    used: ['F-07', 'F-11'] },
  { id: 'T-2168', at: '2026-10-29T13:40', who: 'maya', type: 'Analysis', path: 'reason', time: 31.4, cost: 0.142, base: 0.142, conf: 0.84,
    ask: 'Why did returns rise in September?',
    answer: 'Returns rose from 3.1% to 4.6% of orders. Two thirds of the rise is the Fjord sofa in Moss: 41 returns, 33 citing colour. The September photos were shot in warm light and the fabric reads green-brown on screen but grey in daylight. Other products are flat. Suggest re-shooting Moss in daylight and adding a swatch request link.',
    used: ['E-21', 'F-14'], why: 'New question: nothing similar in memory, and it needs reasoning over 1,420 orders.' },
  { id: 'T-2177', at: '2026-10-29T15:22', who: 'theo', type: 'Replies', path: 'reason', escalated: true, time: 1.1 + 14.2, cost: 0.0011 + 0.058, base: 0.06, conf: 0.62,
    ask: 'Summarise the call notes from Andersen Retail and list what we promised.',
    answer: 'Andersen want 60 Ash dining tables for spring, delivered in two drops (March and May). We promised: a 7% volume discount, oak samples by 14 November, and an answer on the May drop by Friday. Open: they asked about white-label packaging; nobody committed.',
    used: ['E-18'], why: 'Recall found the notes but was only 62% sure it had all the promises, under your 75% threshold, so it thought it through.' },
  { id: 'T-2203', at: '2026-10-30T08:31', who: 'maya', type: 'Reports', path: 'reflex', habit: 'H-01', time: 0.18, cost: 0.00004, base: 0.11, conf: 0.95,
    ask: 'Weekly sales summary for Monday',
    answer: 'Week 44: 312 orders, €184,920 (+6% on week 43). Best seller: Ash dining table (48). Slowest: Linnea lamp (3). Returns 3.4%. Rotterdam stock low on Fjord sofa in Sand (6 left).',
    used: ['H-01', 'E-24'] },
  { id: 'T-2207', at: '2026-10-30T08:52', who: 'jun', type: 'Translations', path: 'reflex', habit: 'H-03', time: 0.09, cost: 0.00003, base: 0.024, conf: 0.93,
    ask: 'Translate the Fjord sofa description into German',
    answer: 'Das Fjord Sofa: tiefe Sitze, abnehmbare Bezüge aus Leinen, ein Gestell aus FSC-zertifizierter Eiche. Drei Sitzplätze, 214 cm breit. In Sand, Moss und Slate.',
    used: ['H-03', 'F-03'] },
  { id: 'T-2211', at: '2026-10-30T09:06', who: 'maya', type: 'Replies', path: 'recall', time: 1.2, cost: 0.0009, base: 0.064, conf: 0.88,
    ask: 'Draft the reply to Lindgren Timber about the delayed oak shipment.',
    answer: 'Hi Erik, thanks for the heads-up on the oak. A two-week delay works if the boards land in Rotterdam by 20 November; after that we would have to move the Ash table launch. Could you confirm the new date in writing, and whether the moisture certificates travel with this load? Best, Maya',
    used: ['F-02', 'F-05', 'F-09'] },
]

const ASKS = {
  Replies: ['Reply to a customer asking when the Fjord sofa restocks', 'Answer a question about care for oiled oak', 'Reply to a delivery complaint, order 40196', 'Draft a reply to a showroom booking request'],
  Reports: ['Daily orders summary', 'Low stock list for Rotterdam', 'Showroom visits this week', 'Open help desk tickets older than two days'],
  Translations: ['Translate the Ash table care card into Dutch', 'Translate a delivery update into German', 'Translate the Linnea lamp description into French'],
  Lookups: ['Where is order 40211?', 'Which fabrics come in Slate?', 'Lead time for the oak sideboard', 'Who is our contact at the Hamburg carrier?'],
  Drafting: ['Newsletter intro for the winter sale', 'Product page text for a new cushion', 'Agenda for the Monday ops meeting'],
  Analysis: ['Compare October delivery times by carrier', 'Which products sell together most often?', 'Is the winter sale cannibalising full-price orders?'],
}
// Background tasks that fill the last 24 hours, shaped like a working day.
function generate() {
  const out = []
  const start = new Date(NOW.getTime() - 24 * 3600 * 1000)
  let n = 2000
  for (let h = 0; h < 24; h++) {
    const hour = (start.getHours() + h) % 24
    const busy = hour >= 8 && hour <= 18 ? (hour === 12 ? 7 : 11) : hour >= 19 && hour <= 21 ? 3 : 1
    for (let k = 0; k < busy; k++) {
      const x = r()
      const path = x < 0.47 ? 'reflex' : x < 0.82 ? 'recall' : 'reason'
      const p = PATHS[path]
      const base = Math.round(span([0.02, 0.12]) * 10000) / 10000
      const cost = path === 'reason' ? base : Math.round(span(p.cost) * 1e6) / 1e6
      const type = path === 'reason' ? pick(['Analysis', 'Drafting', 'Replies']) : pick(TYPES.filter((x) => x !== 'Analysis'))
      out.push({ id: `T-${n++}`, at: new Date(start.getTime() + (h + r()) * 3600 * 1000), who: pick(Object.keys(PEOPLE)), type, ask: pick(ASKS[type]), path, cost, base, conf: path === 'reason' ? 0.8 : 0.78 + r() * 0.2, time: Math.round(span(p.time) * 100) / 100 })
    }
  }
  return out
}
const featured = FEATURED.map((t) => ({ ...t, at: new Date(t.at) }))
export const TASKS = [...generate().filter((t) => !featured.some((f) => Math.abs(f.at - t.at) < 60000)), ...featured].sort((a, b) => a.at - b.at)

export function totals(list = TASKS) {
  const by = Object.fromEntries(PATH_ORDER.map((k) => [k, { n: 0, cost: 0 }]))
  let cost = 0; let base = 0; let time = 0
  for (const t of list) { by[t.path].n++; by[t.path].cost += t.cost; cost += t.cost; base += t.base; time += t.time }
  const fast = (by.reflex.n + by.recall.n) / list.length
  return { n: list.length, cost, base, saved: base - cost, pct: 1 - cost / base, fast, by, medianTime: median(list.map((t) => t.time)) }
}
function median(a) { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] }
const T = totals()
console.assert(T.by.reflex.n + T.by.recall.n + T.by.reason.n === T.n, 'paths add up to all tasks')

// Thirty days of spend: actual against the same work done entirely by Reason.
export const DAYS = (() => {
  const g = rng(44); const out = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(NOW); d.setDate(d.getDate() - i); d.setHours(12)
    const wk = [0, 6].includes(d.getDay())
    const n = Math.round((wk ? 40 : 190) + g() * (wk ? 25 : 60))
    const learn = Math.min(1, (29 - i) / 29) // habits make each week cheaper than the last
    const base = Math.round(n * (0.055 + g() * 0.012) * 100) / 100
    const share = 0.3 - learn * 0.11 + g() * 0.04 // share of work that still needs Reason
    const cost = Math.round(base * share * 100) / 100
    out.push({ d, n, base, cost })
  }
  return out
})()
export const MONTH = { cost: DAYS.reduce((s, x) => s + x.cost, 0), base: DAYS.reduce((s, x) => s + x.base, 0), n: DAYS.reduce((s, x) => s + x.n, 0) }

export const MEMORY = [
  { id: 'F-02', kind: 'fact', text: 'Lindgren Timber (Erik Lindgren) supplies FSC oak boards; deliveries go to the Rotterdam warehouse.', strength: 92, uses: 41, last: '2026-10-30T09:06', source: 'Mail, 14 threads', scope: 'team' },
  { id: 'F-03', kind: 'fact', text: 'Fjord sofa: 214 cm, three seats, removable linen covers, FSC oak frame; colours Sand, Moss, Slate.', strength: 88, uses: 63, last: '2026-10-30T08:52', source: 'Product sheet', scope: 'team' },
  { id: 'F-05', kind: 'fact', text: 'The Ash dining table launch depends on oak arriving by 20 November.', strength: 71, uses: 9, last: '2026-10-30T09:06', source: 'Planning doc', scope: 'team' },
  { id: 'F-07', kind: 'fact', text: 'Damaged in delivery: full refund or free replacement; photos within 14 days; no return needed for structural damage.', strength: 97, uses: 128, last: '2026-10-29T10:04', source: 'Policy, approved by Maya 12 Aug', scope: 'team', pinned: true },
  { id: 'F-09', kind: 'fact', text: 'Maya signs supplier mail with first name only; tone: direct, warm, no exclamation marks.', strength: 84, uses: 57, last: '2026-10-30T09:06', source: 'Learned from 57 sent mails', scope: 'me' },
  { id: 'F-11', kind: 'fact', text: 'Change-of-mind returns: 30 days, customer pays return shipping.', strength: 79, uses: 44, last: '2026-10-28T16:20', source: 'Policy page', scope: 'team', conflict: 'F-12' },
  { id: 'F-12', kind: 'fact', text: 'Change-of-mind returns: 14 days.', strength: 22, uses: 3, last: '2026-09-02T11:00', source: 'Old help desk macro', scope: 'team', conflict: 'F-11' },
  { id: 'F-14', kind: 'fact', text: 'Return reasons are coded in the help desk: colour, size, damage, late, other.', strength: 66, uses: 12, last: '2026-10-29T13:40', source: 'Help desk', scope: 'team' },
  { id: 'E-18', kind: 'event', text: 'Call with Andersen Retail, 28 Oct: 60 Ash tables for spring, two drops, 7% discount discussed.', strength: 74, uses: 4, last: '2026-10-29T15:22', source: 'Call notes, Theo', scope: 'team' },
  { id: 'E-21', kind: 'event', text: 'September photo shoot for Moss colourway, warm studio light.', strength: 58, uses: 2, last: '2026-10-29T13:40', source: 'Shoot brief', scope: 'team' },
  { id: 'E-24', kind: 'event', text: 'Week 44 sales closed: 312 orders.', strength: 61, uses: 1, last: '2026-10-30T08:31', source: 'Shop export', scope: 'team' },
  { id: 'E-09', kind: 'event', text: 'Linnea lamp supplier switched in July.', strength: 18, uses: 0, last: '2026-07-21T09:00', source: 'Mail', scope: 'team', fading: true },
]

export const HABITS = [
  { id: 'H-01', name: 'Monday sales summary', trigger: 'Weekly sales summary, any phrasing', runs: 23, accuracy: 0.98, saved: 2.48, since: '2026-04-06', owner: 'maya', steps: ['Pull last week from the shop export', 'Compare with the week before', 'Best and slowest seller, returns, low stock'] },
  { id: 'H-02', name: 'Damage refund answer', trigger: 'Refund or damage questions from customers', runs: 128, accuracy: 0.99, saved: 3.96, since: '2026-08-12', owner: 'theo', steps: ['Policy F-07', 'Ask for photos if missing', 'Offer refund or replacement'] },
  { id: 'H-03', name: 'Product description to German', trigger: 'Translate a product description into German', runs: 61, accuracy: 0.96, saved: 1.44, since: '2026-06-18', owner: 'jun', steps: ['Glossary of 140 furniture terms', 'House style: no exclamation marks', 'Keep measurements in cm'] },
  { id: 'H-04', name: 'Order status lookup', trigger: 'Where is my order, with an order number', runs: 402, accuracy: 0.99, saved: 9.62, since: '2026-05-02', owner: 'theo', steps: ['Read carrier status', 'Translate carrier codes into plain words', 'Give the next date'] },
]
export const PROPOSALS = [
  { id: 'P-07', name: 'Supplier delay reply', evidence: 'You asked for this 6 times since September. Reason wrote the same structure each time: thank them, the date that still works, what moves if it slips, ask for written confirmation. You sent all six with small edits.', perRun: { now: 0.061, then: 0.0009 }, perMonth: 8, owner: 'maya', steps: ['Supplier and order from mail', 'The latest date that still works', 'Ask for written confirmation'] },
  { id: 'P-08', name: 'Return reason breakdown', evidence: 'Asked 4 times in October by Maya and Ines. Reason grouped returns by the help desk reason codes and product each time.', perRun: { now: 0.12, then: 0.0011 }, perMonth: 5, owner: 'ines', steps: ['Help desk export', 'Group by reason code and product', 'Flag anything over 3%'] },
]

export const SLEEP = {
  from: '02:00', to: '02:14', merged: 12, faded: 31, strengthened: 58, proposed: PROPOSALS.length,
  conflict: { a: 'F-11', b: 'F-12', text: 'Two answers for change-of-mind returns: 30 days (policy page) and 14 days (an old help desk macro). Fast answers now use 30 days. Which is right?' },
  notes: ['Merged 12 near-identical facts about Rotterdam warehouse hours into one.', 'Let 31 memories fade that nobody used in 90 days, including the Linnea lamp supplier switch.', 'Strengthened 58 memories used yesterday, most of them about the Ash table launch.'],
}

export const BUDGETS = {
  frugal: { name: 'Frugal', threshold: 0.6, cap: 0.1, says: 'Fast paths answer unless they are less than 60% sure. Reason is held to about 1 task in 10.' },
  balanced: { name: 'Balanced', threshold: 0.75, cap: 0.2, says: 'Fast paths answer when they are at least 75% sure. Anything new or unsure is thought through.' },
  thorough: { name: 'Thorough', threshold: 0.9, cap: 0.4, says: 'Fast paths answer only when they are 90% sure. Better for legal, money and anything sent outside.' },
}
// Forecast of the month's spend at each budget, from this month's work.
export function forecast(key) {
  const b = BUDGETS[key]
  const raw = (r) => r + (1 - r) * 0.012
  const share = { frugal: 0.11, balanced: 0.2, thorough: 0.34 }
  // Scaled so Balanced, the current setting, matches what this month really cost.
  const k = MONTH.cost / raw(share.balanced)
  return { cost: k * raw(share[key]), share: share[key], threshold: b.threshold }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const fmt = {
  usd: (v) => (v < 0.01 ? `$${v.toFixed(v < 0.001 ? 5 : 4)}` : v < 100 ? `$${v.toFixed(2)}` : `$${Math.round(v).toLocaleString('en-US')}`),
  pct: (v) => `${Math.round(v * 100)}%`,
  time: (s) => (s < 1 ? `${Math.round(s * 1000)} ms` : s < 60 ? `${s.toFixed(1)} s` : `${Math.floor(s / 60)} m ${Math.round(s % 60)} s`),
  clock: (d) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  day: (d) => { const x = new Date(d); return `${x.getDate()} ${MONTHS[x.getMonth()]}` },
}
export const taskOf = (id) => TASKS.find((t) => t.id === id)
export const memoryOf = (id) => MEMORY.find((m) => m.id === id) || (id.startsWith('H-') ? { id, kind: 'habit', text: HABITS.find((h) => h.id === id)?.name } : null)
