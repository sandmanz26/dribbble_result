// Two weeks of earlier check-ins and journal lines for the demo person. Sample data.
export const TODAY = '2026-10-25'
export const ME = { name: 'Lena', since: '2026-09-02' }

export const HISTORY = [
  { date: '2026-10-11', mood: 'steady', minutes: 12 },
  { date: '2026-10-12', mood: 'bright', minutes: 10 },
  { date: '2026-10-13', mood: 'stormy', minutes: 15 },
  { date: '2026-10-14', mood: 'stormy', minutes: 8 },
  { date: '2026-10-15', mood: null, minutes: 0 },
  { date: '2026-10-16', mood: 'heavy', minutes: 10 },
  { date: '2026-10-17', mood: 'steady', minutes: 20 },
  { date: '2026-10-18', mood: 'bright', minutes: 12 },
  { date: '2026-10-19', mood: 'steady', minutes: 10 },
  { date: '2026-10-20', mood: 'tired', minutes: 6 },
  { date: '2026-10-21', mood: null, minutes: 0 },
  { date: '2026-10-22', mood: 'stormy', minutes: 12 },
  { date: '2026-10-23', mood: 'steady', minutes: 10 },
  { date: '2026-10-24', mood: 'heavy', minutes: 9 },
]

export const JOURNAL = [
  { id: 'j1', date: '2026-10-24', mood: 'heavy', prompt: 'What would you say to a friend who felt like this?', text: 'That it is fine to do the minimum on a grey Saturday. Made soup. Called Mum.' },
  { id: 'j2', date: '2026-10-23', mood: 'steady', prompt: 'What would make today feel well spent?', text: 'Finished the draft before lunch, walked home the long way.' },
  { id: 'j3', date: '2026-10-22', mood: 'stormy', prompt: 'What is one thing you can leave until tomorrow?', text: 'The inbox. All of it. Slept better than expected.' },
  { id: 'j4', date: '2026-10-19', mood: 'steady', prompt: 'What is one small thing that went right today?', text: 'The basil on the windowsill finally came back.' },
]

const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const W = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const fmtDay = (iso) => { const d = new Date(iso + 'T00:00:00Z'); return `${W[d.getUTCDay()]} ${d.getUTCDate()} ${M[d.getUTCMonth()]}` }
export const weekday = (iso) => W[new Date(iso + 'T00:00:00Z').getUTCDay()]
export const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
