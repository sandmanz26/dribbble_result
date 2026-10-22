// Two finished NuBrakes visits for the "Returning NuBrakes customer" demo (Prototype panel).
// They show the brand migration: a Valvoline account that still lists NuBrakes visits and warranties.
import { readBookings, writeBookingList } from './api.js'
import { priceQuote } from './services.js'
import { TECHNICIANS } from './schedule.js'

const vehicle = { year: 2018, make: 'Honda', model: 'CR-V' }
const contact = { name: 'Jordan Lee', phone: '(512) 555-0142', email: 'jordan@example.com', sms: true }
const lines = (service, axle) => {
  const q = priceQuote({ service, axle, size: 'suv', tier: 'standard' })
  return { parts: q.parts, labor: q.labor, tax: q.tax, total: q.total }
}

export const HISTORY = [
  {
    id: 'NB-41873',
    brand: 'nubrakes',
    demo: true,
    vehicle,
    size: 'suv',
    service: 'pads-rotors',
    axle: 'front',
    tier: 'standard',
    lines: lines('pads-rotors', 'front'),
    total: lines('pads-rotors', 'front').total,
    metro: 'austin',
    zip: '78704',
    address: '2100 Barton Springs Rd',
    locationType: 'driveway',
    accessNotes: '',
    slot: { day: '2025-03-14', window: '10', label: '10 am to 12 pm' },
    presence: 'present',
    keysNote: '',
    contact,
    createdAt: '2025-03-10T15:02:00.000Z',
    status: 'done',
    paid: true,
    paidAt: '2025-03-14T17:40:00.000Z',
    tech: TECHNICIANS.austin[0],
    extra: 'declined',
    report: [['Front pads', 'New, 11 mm'], ['Rear pads', '5 mm, check at next visit'], ['Front rotors', 'New'], ['Brake fluid', '3.5% water, replace soon']],
    warrantyEnd: '2027-03-14',
  },
  {
    id: 'NB-40219',
    brand: 'nubrakes',
    demo: true,
    vehicle,
    size: 'suv',
    service: 'fluid',
    axle: 'front',
    tier: 'standard',
    lines: lines('fluid', 'front'),
    total: lines('fluid', 'front').total,
    metro: 'austin',
    zip: '78704',
    address: '2100 Barton Springs Rd',
    locationType: 'driveway',
    accessNotes: '',
    slot: { day: '2025-01-09', window: '14', label: '2 to 4 pm' },
    presence: 'keys',
    keysNote: 'Lockbox by the side door',
    contact,
    createdAt: '2025-01-06T19:20:00.000Z',
    status: 'done',
    paid: true,
    paidAt: '2025-01-09T21:05:00.000Z',
    tech: TECHNICIANS.austin[1],
    extra: null,
    report: [['Brake fluid', 'Replaced, 0% water'], ['Front pads', '4 mm, replace within 3 months'], ['Rear pads', '7 mm, good for now']],
    warrantyEnd: '2025-07-09',
  },
]

export const hasHistory = () => readBookings().some((b) => b.demo)

export function seedHistory() {
  const rest = readBookings().filter((b) => !b.demo)
  writeBookingList([...rest, ...HISTORY])
}

export function clearDemo() {
  writeBookingList(readBookings().filter((b) => !b.demo))
}
