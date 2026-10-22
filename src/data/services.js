// Sample services and prices for the prototype. Not real NuBrakes pricing.
export const SERVICES = {
  pads: {
    id: 'pads',
    name: 'Brake pad replacement',
    short: 'Brake pads',
    perAxle: true,
    hours: '1 to 1.5 hours per axle',
    blurb: 'New pads, cleaned and lubricated slide pins, road test.',
    includes: ['New pads matched to your vehicle', 'Slide pins cleaned and greased', 'Hardware and clips replaced', 'Brake fluid level check', 'Road test with the technician'],
    signs: ['Squeal when you brake', 'Pads under 3 mm at inspection', 'Longer stopping distance'],
    price: { compact: 189, mid: 209, suv: 239, truck: 269, ev: 259 },
    premiumAdd: 60,
    partsShare: 0.45,
    warrantyMonths: 12,
    warrantyParts: 'pads',
  },
  'pads-rotors': {
    id: 'pads-rotors',
    name: 'Pads and rotors',
    short: 'Pads and rotors',
    perAxle: true,
    hours: '1.5 to 2 hours per axle',
    blurb: 'New pads and new rotors on the same axle, so they bed in together.',
    includes: ['New pads and rotors', 'Hub surfaces cleaned', 'Slide pins cleaned and greased', 'Hardware and clips replaced', 'Road test with the technician'],
    signs: ['Grinding noise', 'Pedal or steering wheel shakes when braking', 'Rotors below minimum thickness'],
    price: { compact: 359, mid: 389, suv: 449, truck: 519, ev: 489 },
    premiumAdd: 90,
    partsShare: 0.55,
    warrantyMonths: 24,
    warrantyParts: 'pads and rotors',
  },
  calipers: {
    id: 'calipers',
    name: 'Caliper replacement',
    short: 'Calipers',
    perAxle: true,
    hours: '1.5 to 2.5 hours per axle',
    blurb: 'Replaces sticking or leaking calipers, then bleeds the system.',
    includes: ['Two calipers on the axle', 'Brake system bleed', 'Fluid top-up', 'Road test with the technician'],
    signs: ['Car pulls to one side', 'Burning smell after driving', 'Fluid on the inside of a wheel'],
    price: { compact: 449, mid: 479, suv: 529, truck: 589, ev: 569 },
    premiumAdd: 0,
    partsShare: 0.6,
    warrantyMonths: 24,
    warrantyParts: 'calipers',
  },
  fluid: {
    id: 'fluid',
    name: 'Brake fluid flush',
    short: 'Fluid flush',
    perAxle: false,
    hours: 'About 45 minutes',
    blurb: 'Old fluid out, fresh fluid in at every wheel.',
    includes: ['Full flush at all four wheels', 'Moisture test before and after', 'Bleed to remove air'],
    signs: ['Soft or spongy pedal', 'Fluid dark or over 2 years old', 'Moisture test fails'],
    price: { compact: 129, mid: 129, suv: 139, truck: 149, ev: 149 },
    premiumAdd: 0,
    partsShare: 0.3,
    warrantyMonths: 6,
    warrantyParts: 'brake fluid',
  },
  inspection: {
    id: 'inspection',
    name: 'Brake inspection',
    short: 'Inspection',
    perAxle: false,
    hours: 'About 30 minutes',
    blurb: 'Measured pads, rotors and fluid with a written report. Credited if you book the repair.',
    includes: ['Pad and rotor measurements at each wheel', 'Fluid moisture test', 'Written report with photos', 'Fee credited to any repair you approve'],
    signs: ['Warning light on', 'Not sure what the noise is', 'Buying a used car'],
    price: { compact: 49, mid: 49, suv: 49, truck: 49, ev: 49 },
    premiumAdd: 0,
    partsShare: 0,
    warrantyMonths: 0,
  },
  // Booked from a WarrantyCard. Not sold, so no price and not in SERVICE_ORDER.
  'warranty-check': {
    id: 'warranty-check',
    name: 'Warranty check',
    short: 'Warranty check',
    perAxle: false,
    hours: 'About 30 minutes',
    blurb: 'The technician checks work we did that does not feel right.',
    free: true,
    warrantyMonths: 0,
  },
}

// When the warranty on a finished job ends. Day strings are local YYYY-MM-DD.
export function warrantyEndFor(service, day) {
  const months = SERVICES[service]?.warrantyMonths
  if (!months || !day) return null
  const d = new Date(+day.slice(0, 4), +day.slice(5, 7) - 1 + months, +day.slice(8, 10))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const SERVICE_ORDER = ['pads', 'pads-rotors', 'calipers', 'fluid', 'inspection']

// Severity order decides which service a set of symptoms points to.
const SEVERITY = ['inspection', 'fluid', 'pads', 'calipers', 'pads-rotors']

export const SYMPTOMS = [
  { id: 'squeal', label: 'High squeal when braking', service: 'pads', note: 'Usually worn pads. The wear indicator makes that sound on purpose.' },
  { id: 'grind', label: 'Grinding or scraping', service: 'pads-rotors', note: 'Pads may be worn through and scoring the rotors.', urgent: true },
  { id: 'shake', label: 'Pedal or wheel shakes when braking', service: 'pads-rotors', note: 'Most often uneven rotors. New pads alone will not fix it.' },
  { id: 'soft', label: 'Soft or spongy pedal', service: 'fluid', note: 'Could be air or moisture in the fluid, or a leak. The technician checks for leaks first.', urgent: true },
  { id: 'pull', label: 'Car pulls to one side', service: 'calipers', note: 'Often a caliper that is sticking. The technician confirms before any work.' },
  { id: 'light', label: 'Brake warning light is on', service: 'inspection', note: 'Lights have several causes. An inspection finds which one, and the fee is credited to the repair.' },
  { id: 'due', label: 'No symptoms, just due', service: 'pads', note: 'We quote pads and the technician measures everything before starting.' },
]

export function recommend(symptomIds) {
  const picked = SYMPTOMS.filter((s) => symptomIds.includes(s.id))
  if (!picked.length) return null
  const service = picked.map((s) => s.service).sort((a, b) => SEVERITY.indexOf(b) - SEVERITY.indexOf(a))[0]
  return { service, urgent: picked.some((s) => s.urgent), notes: picked }
}

export const AXLES = [
  { id: 'front', label: 'Front', hint: 'Front brakes wear about twice as fast' },
  { id: 'rear', label: 'Rear', hint: '' },
  { id: 'both', label: 'Front and rear', hint: '' },
  { id: 'unsure', label: 'Not sure', hint: 'We quote the front. The technician confirms before starting' },
]

export const TIERS = {
  standard: { id: 'standard', name: 'Standard', detail: 'Ceramic pads, quiet and low dust. Meets OE spec.' },
  premium: { id: 'premium', name: 'Premium', detail: 'OE-grade pads, coated rotors that resist rust. Longest life.' },
}

const TAX = 0.0825

export function priceQuote({ service, axle, size, tier }) {
  const s = SERVICES[service]
  if (!s || !s.price || !size) return null
  const axles = s.perAxle ? (axle === 'both' ? 2 : 1) : 1
  const unit = s.price[size] + (tier === 'premium' ? s.premiumAdd : 0)
  const subtotal = unit * axles
  const parts = Math.round(subtotal * s.partsShare)
  const labor = subtotal - parts
  const tax = Math.round(parts * TAX * 100) / 100
  return {
    axles,
    parts,
    labor,
    tax,
    total: Math.round((subtotal + tax) * 100) / 100,
    hasTiers: s.premiumAdd > 0,
  }
}

export const money = (n) =>
  `$${Number.isInteger(n) ? n.toLocaleString('en-US') : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
