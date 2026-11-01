// Tomorrow's call sheet for the production Mara is on. All sample data.
// Demo clock: Tuesday 17 November 2026, London.

export const DEMO_DATE = '2026-11-17'

export const production = {
  title: 'Saltmarsh',
  kind: 'Feature film',
  day: 14,
  days: 32,
  dates: '29 Oct to 11 Dec 2026',
  photo: 'set-warehouse',
}

export const callSheet = {
  unitCall: '07:00',
  myCall: '06:30',
  myCallNote: 'Pre-call for lighting: rig the night look in the office set first',
  breakfast: '06:00 to 06:45 at base',
  lunch: '13:00',
  wrap: '19:00',
  sunrise: '07:22',
  sunset: '16:03',
  weather: { temp: 9, text: 'Light drizzle until 10:00, then cloudy', wind: '14 km/h SW' },
  location: {
    name: 'Clarence Wharf Warehouse',
    address: 'Unit 4, Wharf Road, London E14',
    photo: 'loc-brick',
    base: 'Unit base in car park B, enter from Ferry Lane',
    parking: 'Crew parking on the wharf, 40 spaces. Overflow at Ferry Lane NCP',
    transit: 'Wharf Road DLR, 6 minutes on foot',
    hospital: 'Riverside General A&E, 9 minutes by car',
  },
  // Stripboard colours follow the industry convention: day interior white,
  // day exterior yellow, night interior blue. They are data, not decoration.
  scenes: [
    { id: 41, ie: 'INT', dn: 'DAY', set: 'Harbour warehouse, main floor', what: 'Ada finds the ledger in the crane cab', eighths: 12, cast: [1, 3], start: '07:30', status: 'done' },
    { id: 42, ie: 'INT', dn: 'DAY', set: 'Harbour warehouse, main floor', what: 'Ada and Pell argue over the ledger', eighths: 7, cast: [1, 3, 5], start: '09:40', status: 'now' },
    { id: 18, ie: 'EXT', dn: 'DAY', set: 'Warehouse yard', what: 'Ada leaves through the side gate', eighths: 2, cast: [1], start: '11:30', status: 'next' },
    { id: 57, ie: 'INT', dn: 'NIGHT', set: 'Warehouse office, windows blacked out', what: 'Ada calls the harbour master', eighths: 18, cast: [1, 2], start: '14:00', status: 'next', nick: 'Abby Singer' },
    { id: 58, ie: 'INT', dn: 'NIGHT', set: 'Warehouse office', what: 'The phone rings back', eighths: 5, cast: [2], start: '17:45', status: 'next', nick: 'Martini shot' },
  ],
  onSet: ['june', 'ruben', 'arlo', 'theo', 'dele', 'ines', 'noor', 'ella', 'milo'],
  notes: [
    'Haze in use on the main floor from 09:00',
    'Blackout drapes on the office windows by lunch, electrical and grip',
    'Closed set for scene 57',
  ],
}

export const pages = (e) => {
  const w = Math.floor(e / 8)
  const r = e % 8
  if (!w) return `${r}/8`
  return r ? `${w} ${r}/8` : `${w}`
}
