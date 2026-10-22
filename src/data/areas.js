// Mock service area. ZIP prefixes map to a metro.
export const METROS = [
  { id: 'austin', name: 'Austin', prefixes: ['786', '787'], sample: '78704', since: 2019 },
  { id: 'houston', name: 'Houston', prefixes: ['770', '772', '773', '774', '775'], sample: '77007', since: 2021 },
  { id: 'dfw', name: 'Dallas and Fort Worth', prefixes: ['750', '751', '752', '760', '761'], sample: '75206', since: 2021 },
  { id: 'san-antonio', name: 'San Antonio', prefixes: ['780', '781', '782'], sample: '78209', since: 2023 },
]

export const COMING = ['Phoenix', 'Atlanta', 'Charlotte', 'Nashville']

export function metroFor(zip) {
  if (!/^\d{5}$/.test(zip || '')) return null
  return METROS.find((m) => m.prefixes.some((p) => zip.startsWith(p))) || null
}

const STREETS = {
  austin: ['1407 S Congress Ave', '2100 Barton Springs Rd', '901 W 6th St', '4500 Duval St', '6011 Burnet Rd', '3108 Manor Rd'],
  houston: ['2400 Washington Ave', '1201 Westheimer Rd', '4410 Montrose Blvd', '800 Heights Blvd', '5115 Buffalo Speedway'],
  dfw: ['3001 Knox St', '5800 Ross Ave', '1712 Magnolia Ave', '4200 Lemmon Ave', '2900 Greenville Ave'],
  'san-antonio': ['1400 Broadway', '700 E Grayson St', '2310 N St Mary’s St', '5300 Broadway'],
}

export const LOCATION_TYPES = [
  { id: 'driveway', label: 'Home driveway', hint: 'Best option. Flat and off the street.' },
  { id: 'garage', label: 'Home garage', hint: 'Leave about 3 ft of space on each side of the car.' },
  { id: 'apartment', label: 'Apartment lot', hint: 'Some complexes ban repairs. Check your lease or ask the office.' },
  { id: 'work', label: 'Workplace lot', hint: 'Make sure your lot allows service vehicles.' },
  { id: 'street', label: 'Street parking', hint: 'Only on a flat street where a van can park behind you.' },
]

export function suggestAddresses(query, metroId) {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const pool = metroId ? STREETS[metroId] || [] : Object.values(STREETS).flat()
  const hits = pool.filter((s) => s.toLowerCase().includes(q))
  // Typed house numbers match any street so the mock feels like a real geocoder.
  if (!hits.length && /^\d+\s*\w*/.test(q)) {
    const word = q.replace(/^\d+\s*/, '')
    return pool
      .filter((s) => !word || s.toLowerCase().includes(word))
      .slice(0, 4)
      .map((s) => s.replace(/^\d+/, q.match(/^\d+/)[0]))
  }
  return hits.slice(0, 5)
}
