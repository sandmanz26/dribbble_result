// Mock API. No network: every call resolves locally after a delay so the UI has real
// loading states. The prototype panel can slow calls down or make the first attempt fail.
import { PLATES } from './vehicles.js'
import { metroFor } from './areas.js'
import { priceQuote, SERVICES } from './services.js'
import { TECHNICIANS, windowsFor } from './schedule.js'
import { BRAND_META } from '../brand/tokens.js'

export const simulation = { slow: false, failures: false }
const attempts = {}

const wait = (ms) => new Promise((r) => setTimeout(r, simulation.slow ? ms * 3 : ms))

class ApiError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

// With failures on, the first attempt of each call fails and the retry works.
function maybeFail(name, code = 'network', message = 'We could not reach our servers.') {
  if (!simulation.failures) return
  attempts[name] = (attempts[name] || 0) + 1
  if (attempts[name] % 2 === 1) throw new ApiError(code, message)
}

export async function lookupPlate(state, plate) {
  await wait(900)
  maybeFail('plate')
  const hit = PLATES[`${state}:${plate.replace(/\s+/g, '').toUpperCase()}`]
  if (!hit) throw new ApiError('not_found', 'We could not match that plate.')
  return hit
}

export async function checkZip(zip) {
  await wait(450)
  maybeFail('zip')
  return metroFor(zip)
}

export async function joinWaitlist(email, zip) {
  await wait(700)
  return { email, zip }
}

export async function getQuote(input) {
  await wait(1100)
  maybeFail('quote', 'network', 'Parts prices did not load.')
  return {
    standard: priceQuote({ ...input, tier: 'standard' }),
    premium: priceQuote({ ...input, tier: 'premium' }),
  }
}

export async function getAvailability(day, metroId) {
  await wait(550)
  maybeFail('availability', 'network', 'Arrival windows did not load.')
  return windowsFor(day, metroId)
}

const KEY = 'nb-bookings'
export function readBookings() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}
function writeBookings(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {}
}

// Only booking fields are stored; quote drafts carry transient flags (priceChange, lastStep...).
export async function createBooking(draft, brand = 'nubrakes') {
  await wait(1200)
  maybeFail('book', 'slot_taken', 'Someone just booked that arrival window.')
  const techs = TECHNICIANS[draft.metro] || TECHNICIANS.austin
  const q = draft.quote?.[draft.tier] || draft.quote?.standard
  const booking = {
    id: `${BRAND_META[brand].bookingPrefix}${String(Date.now()).slice(-5)}`,
    brand,
    vehicle: draft.vehicle,
    size: draft.size,
    service: draft.service,
    axle: draft.axle,
    tier: q?.hasTiers ? draft.tier : 'standard',
    lines: q ? { parts: q.parts, labor: q.labor, tax: q.tax, total: q.total } : null,
    total: q?.total ?? 0,
    metro: draft.metro,
    zip: draft.zip,
    address: draft.address,
    locationType: draft.locationType,
    accessNotes: draft.accessNotes,
    spotOk: draft.spotOk,
    slot: draft.slot,
    presence: draft.presence,
    keysNote: draft.presence === 'keys' ? draft.keysAt : '',
    contact: draft.contact,
    createdAt: new Date().toISOString(),
    status: 'scheduled',
    tech: techs[0],
    extra: null,
  }
  writeBookings([booking, ...readBookings()])
  return booking
}

export async function getBooking(id) {
  await wait(500)
  const b = readBookings().find((x) => x.id === id)
  if (!b) throw new ApiError('not_found', 'We could not find that booking.')
  return b
}

export async function listBookings() {
  await wait(600)
  maybeFail('list', 'network', 'Your visits did not load.')
  return readBookings()
}

// Warranty check booked from a WarrantyCard: same car and address, no charge.
export async function createWarrantyCheck(from, { symptom, slot }, brand = 'nubrakes') {
  await wait(1000)
  maybeFail('warranty', 'network', 'That request did not go through.')
  const techs = TECHNICIANS[from.metro] || TECHNICIANS.austin
  const booking = {
    id: `${BRAND_META[brand].bookingPrefix}${String(Date.now()).slice(-5)}`,
    brand,
    vehicle: from.vehicle,
    size: from.size,
    service: 'warranty-check',
    axle: from.axle,
    tier: 'standard',
    lines: { parts: 0, labor: 0, tax: 0, total: 0 },
    total: 0,
    warrantyFor: from.id,
    symptom,
    metro: from.metro,
    zip: from.zip,
    address: from.address,
    locationType: from.locationType,
    accessNotes: from.accessNotes,
    slot,
    presence: from.presence,
    keysNote: from.keysNote,
    contact: from.contact,
    createdAt: new Date().toISOString(),
    status: 'scheduled',
    tech: techs[0],
    extra: null,
  }
  writeBookings([booking, ...readBookings()])
  return booking
}

// Find a booking by number and the last 4 digits of the phone. Old NB- numbers keep working
// after the move to Valvoline, so both prefixes are accepted.
export async function findBooking(id, last4) {
  await wait(800)
  maybeFail('find')
  const want = String(id).trim().toUpperCase().replace(/\s+/g, '')
  if (!/^(NB|VMB)-?\w+$/.test(want)) throw new ApiError('not_found', 'No visit matches that number and phone.')
  const norm = (x) => x.toUpperCase().replace('-', '')
  const hit = readBookings().find(
    (b) => norm(b.id) === norm(want) && (b.contact?.phone || '').replace(/\D/g, '').endsWith(String(last4).trim()),
  )
  if (!hit) throw new ApiError('not_found', 'No visit matches that number and phone.')
  return hit
}

export function writeBookingList(list) {
  writeBookings(list)
}

export async function updateBooking(id, patch) {
  await wait(700)
  maybeFail('update', 'network', 'That change did not save.')
  const list = readBookings().map((b) => (b.id === id ? { ...b, ...patch } : b))
  writeBookings(list)
  return list.find((b) => b.id === id)
}

// Finding raised by the technician during the job, for the approval flow.
export function extraFinding(booking) {
  const size = booking.size || 'suv'
  const rotors = SERVICES['pads-rotors'].price[size] - SERVICES.pads.price[size]
  return booking.service === 'pads'
    ? {
        service: 'pads-rotors',
        title: 'Front rotors below minimum thickness',
        reading: 'Measured 25.1 mm. Minimum for this vehicle is 26.0 mm.',
        why: 'New pads on thin rotors can shake and wear out early.',
        price: rotors,
      }
    : {
        service: 'fluid',
        title: 'Brake fluid failed the moisture test',
        reading: 'Measured 3.5% water. Replace above 3%.',
        why: 'Wet fluid boils sooner under hard braking and makes the pedal soft.',
        price: SERVICES.fluid.price[size],
      }
}
