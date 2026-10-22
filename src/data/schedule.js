// Mock availability: arrival windows for the next 14 days. Deterministic per day and metro.
export const WINDOWS = [
  { id: '08', label: '8 to 10 am', start: 8 },
  { id: '10', label: '10 am to 12 pm', start: 10 },
  { id: '12', label: '12 to 2 pm', start: 12 },
  { id: '14', label: '2 to 4 pm', start: 14 },
  { id: '16', label: '4 to 6 pm', start: 16 },
]

export const TECHNICIANS = {
  austin: [
    { id: 't1', name: 'Marcus Reyes', years: 6, cert: 'ASE certified, Brakes (A5)', van: 'White Ford Transit' },
    { id: 't2', name: 'Dana Whitfield', years: 4, cert: 'ASE certified, Brakes (A5)', van: 'White Ram ProMaster' },
  ],
  houston: [{ id: 't3', name: 'Luis Ortega', years: 5, cert: 'ASE certified, Brakes (A5)', van: 'White Ford Transit' }],
  dfw: [{ id: 't4', name: 'Kendra Mills', years: 3, cert: 'ASE certified, Brakes (A5)', van: 'White Ford Transit' }],
  'san-antonio': [{ id: 't5', name: 'Sam Okafor', years: 2, cert: 'ASE certified, Brakes (A5)', van: 'White Ram ProMaster' }],
}

const hash = (s) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7)

// 'YYYY-MM-DD' strings are local calendar days. new Date('2026-10-24') would read them as UTC
// midnight and show the previous day anywhere west of Greenwich.
export const toDate = (x) =>
  typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) ? new Date(+x.slice(0, 4), +x.slice(5, 7) - 1, +x.slice(8, 10)) : new Date(x)

export const isoDay = (d) => {
  const x = toDate(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}

export function nextDays(n = 14, from = new Date()) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(from)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + i + 1)
    return d
  })
}

export function windowsFor(day, metroId = 'austin') {
  const d = toDate(day)
  if (d.getDay() === 0) return { closed: true, windows: [] }
  // The third open day is always full, so the empty state shows up in every demo.
  const full = isoDay(nextDays(14).filter((x) => x.getDay() !== 0)[2]) === isoDay(d)
  return {
    closed: false,
    windows: WINDOWS.map((w) => {
      const h = hash(`${isoDay(d)}:${metroId}:${w.id}`)
      const left = full ? 0 : h % 5 === 0 ? 0 : (h % 3) + 1
      return { ...w, left }
    }),
  }
}

export const fmtDay = (d, opts = { weekday: 'long', month: 'long', day: 'numeric' }) =>
  toDate(d).toLocaleDateString('en-US', opts)
