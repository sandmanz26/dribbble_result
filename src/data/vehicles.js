// Mock vehicle catalogue. `size` drives parts pricing: compact, mid, suv, truck, ev.
export const MAKES = {
  Chevrolet: { Equinox: 'suv', Malibu: 'mid', 'Silverado 1500': 'truck', Tahoe: 'truck' },
  Ford: { Escape: 'suv', Explorer: 'suv', 'F-150': 'truck', Mustang: 'mid' },
  Honda: { Accord: 'mid', Civic: 'compact', 'CR-V': 'suv', Odyssey: 'suv', Pilot: 'suv' },
  Hyundai: { Elantra: 'compact', 'Santa Fe': 'suv', Tucson: 'suv' },
  Jeep: { 'Grand Cherokee': 'suv', Wrangler: 'suv' },
  Nissan: { Altima: 'mid', Rogue: 'suv', Sentra: 'compact' },
  Subaru: { Forester: 'suv', Outback: 'suv' },
  Tesla: { 'Model 3': 'ev', 'Model Y': 'ev' },
  Toyota: { Camry: 'mid', Corolla: 'compact', Highlander: 'suv', RAV4: 'suv', Tacoma: 'truck', Tundra: 'truck' },
}

export const YEARS = Array.from({ length: 2026 - 2009 + 1 }, (_, i) => 2026 - i)

export const SIZE_LABEL = {
  compact: 'Compact car',
  mid: 'Midsize car',
  suv: 'SUV or crossover',
  truck: 'Pickup or full-size SUV',
  ev: 'Electric vehicle',
}

export const STATES = ['TX', 'OK', 'LA', 'NM', 'AZ', 'CO', 'FL', 'GA']

// Plates the mock lookup recognises. Anything else returns "not found".
export const PLATES = {
  'TX:LKD4821': { year: 2019, make: 'Toyota', model: 'RAV4' },
  'TX:RHN2290': { year: 2021, make: 'Honda', model: 'Accord' },
  'TX:PVX7713': { year: 2017, make: 'Ford', model: 'F-150' },
  'TX:EVY3001': { year: 2023, make: 'Tesla', model: 'Model Y' },
}
export const SAMPLE_PLATE = 'LKD4821'

export const sizeOf = (v) => (v && MAKES[v.make] ? MAKES[v.make][v.model] : null)
export const vehicleLabel = (v) => (v ? `${v.year} ${v.make} ${v.model}` : '')
