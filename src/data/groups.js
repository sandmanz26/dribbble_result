// Travel groups. Dates are ISO; the demo's "today" is TODAY. Budgets are per person,
// excluding flights, in USD. Sample data.
export const TODAY = '2026-10-24'

export const GROUPS = {
  kyoto: {
    title: 'Kyoto in maple season', place: 'kyoto', start: '2026-11-14', end: '2026-11-21',
    host: 'kenji', members: ['kenji', 'nadia', 'ines', 'priya', 'tom'], cap: 6,
    budget: 1400, pace: 'Slow mornings, long walks', idOnly: true, ages: '25 to 40',
    about: 'Seven nights in a shared machiya in Higashiyama. Early starts for the famous spots, slow afternoons for the rest.',
    rules: ['Split the house evenly', 'Quiet after 22:00', 'Say so in the chat if you go off alone'],
    status: 'planning', linkable: ['kansai'],
  },
  kansai: {
    title: 'Kansai on a budget', place: 'kyoto', start: '2026-11-16', end: '2026-11-22',
    host: 'hana', members: ['hana', 'sam', 'lucas'], cap: 5,
    budget: 800, pace: 'Packed days, hostels', idOnly: false, ages: '21 to 35',
    about: 'Kyoto, Nara and Osaka from one hostel base. Night buses where they save a night.',
    rules: ['Hostel dorms', 'Cash kitty for shared food'],
    status: 'open', linkable: ['kyoto'],
  },
  oaxaca: {
    title: 'Oaxaca for Día de Muertos', place: 'oaxaca', start: '2026-10-30', end: '2026-11-04',
    host: 'oscar', members: ['oscar', 'zainab', 'sam'], cap: 6,
    budget: 900, pace: 'Late nights, festival days', idOnly: false, ages: '25 to 45',
    about: 'Five nights over the festival. Comparsas, the cemeteries at night, a mezcal day in the valley.',
    rules: ['Respect the altars: ask before photos'],
    status: 'open',
  },
  lisbon: {
    title: 'Lisbon slow week', place: 'lisbon', start: '2026-12-05', end: '2026-12-12',
    host: 'ines', members: ['ines', 'elena', 'mei'], cap: 6,
    budget: 950, pace: 'One plan a day', idOnly: false, ages: '28 to 45',
    about: 'An apartment in Graça, a day in Sintra, a day trip to Comporta if the weather holds.',
    rules: ['Shared apartment, own rooms'],
    status: 'open',
  },
  hoian: {
    title: 'Hội An food run', place: 'hoian', start: '2027-02-06', end: '2027-02-13',
    host: 'mei', members: ['mei', 'priya'], cap: 5,
    budget: 700, pace: 'Eat, walk, repeat', idOnly: false, ages: 'Any',
    about: 'Cooking class, the old town at night, a day in Huế by train.',
    rules: [],
    status: 'open',
  },
  lofoten: {
    title: 'Lofoten under the aurora', place: 'lofoten', start: '2027-02-20', end: '2027-02-27',
    host: 'freya', members: ['freya', 'tom', 'elena', 'hana', 'lucas', 'dawit'], cap: 6,
    budget: 1900, pace: 'Night shoots, slow days', idOnly: true, ages: '25 to 50',
    about: 'Two rorbu cabins in Reine. A rental car, aurora forecasts every evening.',
    rules: ['Winter driving: two drivers only'],
    status: 'full',
  },
  cusco: {
    title: 'Inca Trail permit crew', place: 'cusco', start: '2027-05-10', end: '2027-05-20',
    host: 'oscar', members: ['oscar', 'dawit', 'freya', 'zainab'], cap: 8,
    budget: 2100, pace: 'Acclimatise first, then hike', idOnly: true, ages: '25 to 50',
    about: 'Three days in Cusco to acclimatise, then the four-day trail with a licensed operator.',
    rules: ['Permits are booked by name: send passport details by 1 Feb'],
    status: 'open', deadline: 'Permits close 1 Feb',
  },
  tbilisi: {
    title: 'Tbilisi wine and walks', place: 'tbilisi', start: '2027-03-12', end: '2027-03-18',
    host: 'dawit', members: ['dawit', 'lucas'], cap: 6,
    budget: 750, pace: 'Easy', idOnly: false, ages: 'Any',
    about: 'Old town, the baths, a day in Kakheti with a winemaker.',
    rules: [],
    status: 'open',
  },
}

export const group = (id) => ({ id, ...GROUPS[id] })

const DAY = 86400000
export const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / DAY)
export const nights = (g) => days(g.start, g.end)
export const untilStart = (g) => days(TODAY, g.start)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const fmtDay = (iso) => {
  const d = new Date(iso + 'T00:00:00Z')
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
}
export const fmtWeekday = (iso) => WEEK[new Date(iso + 'T00:00:00Z').getUTCDay()]
export const fmtRange = (a, b) => {
  const A = new Date(a + 'T00:00:00Z')
  const B = new Date(b + 'T00:00:00Z')
  if (A.getUTCMonth() === B.getUTCMonth()) return `${A.getUTCDate()} to ${B.getUTCDate()} ${MONTHS[B.getUTCMonth()]}`
  return `${fmtDay(a)} to ${fmtDay(b)}`
}
export const addDays = (iso, n) => new Date(Date.parse(iso) + n * DAY).toISOString().slice(0, 10)
export const usd = (n) => `$${Math.round(n).toLocaleString('en-US')}`
export const usd2 = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
