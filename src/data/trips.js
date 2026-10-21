import commons from './photos.json'

// Mock data only, no backend.
// Photos are location-matched, openly licensed images from Wikimedia Commons
// (found via Openverse, credited on /credits), standing in for the gang's own
// photos. They are self-hosted as WebP in /public/photos at 480px and 1600px.
const first = (key) => (commons[key] || []).find((p) => p.file)
export const photo = (key, w = 1600) => {
  const p = first(key)
  return p ? `photos/${p.file}-${w <= 480 ? 480 : 1600}.webp` : null
}
export const postPhoto = (trip, post, w) => photo(post.id, w) || photo(trip.slug, w)
export const credits = () => Object.entries(commons).map(([k]) => [k, first(k)]).filter(([, p]) => p)

export const trips = [
  // 2026
  {
    slug: 'lofoten-winter-light',
    year: 2026, start: '2026-02-06', end: '2026-02-13',
    title: 'Lofoten in Winter Light', place: 'Lofoten', country: 'Norway',
    crew: ['maya', 'dimas', 'lena'], tag: 'Arctic',
    summary: 'Fishing villages, red cabins and four hours of daylight. We came for the aurora and stayed for the cinnamon buns.',
    stats: { distance: '1,840 km', days: 8, budget: '$1,120 pp' },
    posts: [
      { id: 'chasing-the-aurora', title: 'Chasing the aurora from a rented Volvo', date: '2026-02-08', author: 'dimas', read: 6,
        body: ['We landed in Leknes at 2pm and the sun was already going down. The rental was a 2009 Volvo with a heated steering wheel, which Maya called the best feature of the trip.',
               'The aurora forecast said KP 4. We drove to Uttakleiv beach with a thermos of coffee and waited. Just before midnight the sky turned green for about twenty minutes. Dimas shot 212 frames and kept three.',
               'One tip: bring a second pair of thin gloves for handling the camera. A metal tripod at -9°C is not something you want to touch bare-handed.'] },
      { id: 'a-cabin-called-rorbu', title: 'Four nights in a fisherman’s cabin', date: '2026-02-10', author: 'lena', read: 4,
        body: ['Rorbuer were built for seasonal fishermen. Ours had a wood stove, a window over the harbour and a kettle that took ten minutes to boil.',
               'We tried to cook stockfish stew and got it mostly wrong. The owner stopped by to tell us the cod run was late this year, and we nodded as if we knew what that meant.'] },
      { id: 'budget-notes', title: 'What Lofoten actually cost us', date: '2026-02-14', author: 'sari', read: 3,
        body: ['Norway is expensive, so we budgeted $160 a day each. We ended at $140 by cooking breakfast and dinner in the cabin.',
               'The ferry back to Bodø cost less than the airport taxi on day one. Book the ferry early and skip the taxi.'] },
    ],
  },
  {
    slug: 'kyoto-in-bloom',
    year: 2026, start: '2026-04-01', end: '2026-04-07',
    title: 'Kyoto in Bloom', place: 'Kyoto', country: 'Japan',
    crew: ['lena', 'theo', 'sari', 'maya'], tag: 'Culture',
    summary: 'A week of cherry blossoms, early mornings at the temples and far too many convenience-store breakfasts.',
    stats: { distance: '620 km', days: 7, budget: '$1,480 pp' },
    posts: [
      { id: 'hanami-at-dawn', title: 'Hanami at dawn, before the crowds', date: '2026-04-02', author: 'lena', read: 5,
        body: ['Get there at 5:30am. At that hour the Philosopher’s Path has a few joggers, two photographers and a heron. By 9am it is shoulder to shoulder.',
               'We walked the full two kilometres, then sat by the canal with coffee from a vending machine until the first tour group arrived.'] },
      { id: 'onigiri-ranking', title: 'Ranking 23 convenience-store onigiri', date: '2026-04-04', author: 'theo', read: 3,
        body: ['Over seven days we tried 23 onigiri from three chains. Salted salmon came first, tuna mayo second and pickled plum last. Sari disagreed on the last one.'] },
    ],
  },
  {
    slug: 'sahara-slow-drive',
    year: 2026, start: '2026-06-12', end: '2026-06-20',
    title: 'The Slow Drive to Merzouga', place: 'Merzouga', country: 'Morocco',
    crew: ['maya', 'dimas', 'theo', 'sari', 'lena'], tag: 'Desert',
    summary: 'All five of us, one dusty 4x4 and a night at a desert camp under more stars than we could photograph.',
    stats: { distance: '2,310 km', days: 9, budget: '$960 pp' },
    posts: [
      { id: 'dunes-by-camel', title: 'Two hours on a camel named Hamid', date: '2026-06-15', author: 'maya', read: 5,
        body: ['Hamid stopped every ten minutes and nothing we did changed his schedule. We reached camp an hour late and nobody minded.',
               'Camp had rugs, mint tea and drums after dinner. Dimas put his camera down for a full hour, which has never happened before.'] },
      { id: 'tagine-economics', title: 'Feeding five people on $9', date: '2026-06-17', author: 'sari', read: 3,
        body: ['A shared tagine for five in Rissani cost about the same as one coffee back home. We ordered lamb, chicken and vegetable and finished all three.'] },
    ],
  },
  {
    slug: 'dolomites-hut-to-hut',
    year: 2026, start: '2026-08-21', end: '2026-08-28',
    title: 'Dolomites, Hut to Hut', place: 'South Tyrol', country: 'Italy',
    crew: ['dimas', 'theo', 'lena'], tag: 'Hiking',
    summary: 'Seven mountain huts in seven days, with long climbs, short nights and the best polenta any of us have eaten.',
    stats: { distance: '96 km on foot', days: 8, budget: '$870 pp' },
    posts: [
      { id: 'day-three-ladder', title: 'Day three: the iron ladder', date: '2026-08-23', author: 'theo', read: 4,
        body: ['Via ferrata means “iron path”, and it is steeper than it sounds. Dimas found out he is afraid of heights around the 41st rung.',
               'At the hut that night we had barley soup, and all three of us agreed it was the best meal of the trip.'] },
    ],
  },
  {
    slug: 'lisbon-tram-weekend',
    year: 2026, start: '2026-10-09', end: '2026-10-12',
    title: 'Lisbon Tram Weekend', place: 'Lisbon', country: 'Portugal',
    crew: ['maya', 'sari'], tag: 'City break',
    summary: 'A long weekend on tram 28, walking the hills of Alfama and comparing custard tarts across the city.',
    stats: { distance: '340 km', days: 4, budget: '$610 pp' },
    posts: [
      { id: 'pastel-de-nata-crawl', title: 'Nine bakeries, one custard tart each', date: '2026-10-10', author: 'maya', read: 3,
        body: ['Nine bakeries in one day, one tart at each. The best was a small place in Alfama with no sign and a queue of locals outside.'] },
    ],
  },
  {
    slug: 'iceland-ring-road',
    year: 2026, start: '2026-12-04', end: '2026-12-14',
    title: 'Iceland Ring Road', place: 'Ring Road', country: 'Iceland',
    crew: ['maya', 'dimas', 'lena', 'theo', 'sari'], tag: 'Road trip', upcoming: true,
    summary: 'Our biggest trip yet: the whole group, one campervan and ten days to drive around the island.',
    stats: { distance: '1,330 km (planned)', days: 11, budget: 'To be confirmed' },
    posts: [
      { id: 'packing-list', title: 'The packing list, third draft', date: '2026-10-15', author: 'sari', read: 2,
        body: ['Everyone gets one carry-on and one duffel for the van. Layers over bulk, and Theo is in charge of snacks again.'] },
    ],
  },
  // 2025
  {
    slug: 'patagonia-w-trek',
    year: 2025, start: '2025-01-18', end: '2025-01-29',
    title: 'Patagonia, the W Trek', place: 'Torres del Paine', country: 'Chile',
    crew: ['maya', 'dimas', 'theo'], tag: 'Hiking',
    summary: 'Five days on the W circuit with strong wind, granite towers and one very welcome rainbow on day four.',
    stats: { distance: '80 km on foot', days: 12, budget: '$1,640 pp' },
    posts: [
      { id: 'wind-and-towers', title: 'Wind, towers and one lost hat', date: '2025-01-22', author: 'maya', read: 5,
        body: ['At sunrise the towers turn orange for about ten minutes. My hat blew off at the lookout and I did not see it again.'] },
    ],
  },
  {
    slug: 'hokkaido-ski-week',
    year: 2025, start: '2025-02-20', end: '2025-02-26',
    title: 'Hokkaido Ski Week', place: 'Niseko', country: 'Japan',
    crew: ['dimas', 'theo'], tag: 'Snow',
    summary: 'Deep powder, ramen at the bottom of every run and a hot spring at the end of each day.',
    stats: { distance: '280 km', days: 7, budget: '$1,380 pp' },
    posts: [
      { id: 'powder-day', title: 'Forty centimetres overnight', date: '2025-02-22', author: 'theo', read: 3,
        body: ['The lifts opened at 8:30 and we were in the queue by 7:55. It was worth it.'] },
    ],
  },
  {
    slug: 'amalfi-off-season',
    year: 2025, start: '2025-05-09', end: '2025-05-14',
    title: 'Amalfi, Off-Season', place: 'Amalfi Coast', country: 'Italy',
    crew: ['lena', 'sari'], tag: 'Coast',
    summary: 'Quiet villages, huge lemons and a ferry we only just caught.',
    stats: { distance: '410 km', days: 6, budget: '$1,050 pp' },
    posts: [
      { id: 'the-ferry-we-missed', title: 'The ferry we almost missed', date: '2025-05-11', author: 'lena', read: 3,
        body: ['We ran down 300 steps with two backpacks and a bag of lemons, and stepped on board with seconds to spare.'] },
    ],
  },
  {
    slug: 'balkan-bus-loop',
    year: 2025, start: '2025-09-05', end: '2025-09-17',
    title: 'The Balkan Bus Loop', place: 'Balkans', country: 'Croatia to Albania',
    crew: ['maya', 'lena', 'theo', 'sari'], tag: 'Multi-city',
    summary: 'Twelve days, five countries and nine bus rides, none of which left on time.',
    stats: { distance: '1,450 km', days: 13, budget: '$780 pp' },
    posts: [
      { id: 'nine-buses', title: 'Nine buses, ranked', date: '2025-09-10', author: 'sari', read: 4,
        body: ['Best ride: Kotor to Shkodër, with a driver who played jazz the whole way. Worst ride: the night bus out of Mostar.'] },
    ],
  },
  // 2024
  {
    slug: 'scottish-highlands-loop',
    year: 2024, start: '2024-05-17', end: '2024-05-23',
    title: 'Scottish Highlands Loop', place: 'Highlands', country: 'Scotland',
    crew: ['maya', 'dimas', 'lena'], tag: 'Road trip',
    summary: 'Single-track roads, sheep in the middle of them and a warm pub at the end of every day.',
    stats: { distance: '1,100 km', days: 7, budget: '$730 pp' },
    posts: [
      { id: 'sheep-have-right-of-way', title: 'Sheep have right of way', date: '2024-05-19', author: 'dimas', read: 3,
        body: ['A ewe stood in front of our car for four minutes. We waited until she decided to move.'] },
    ],
  },
  {
    slug: 'oaxaca-day-of-colour',
    year: 2024, start: '2024-10-29', end: '2024-11-04',
    title: 'Oaxaca for Día de Muertos', place: 'Oaxaca', country: 'Mexico',
    crew: ['lena', 'theo', 'sari'], tag: 'Culture',
    summary: 'Marigolds, seven kinds of mole and an evening procession none of us will forget.',
    stats: { distance: '220 km', days: 7, budget: '$840 pp' },
    posts: [
      { id: 'seven-moles', title: 'Seven moles in one afternoon', date: '2024-10-31', author: 'theo', read: 4,
        body: ['Negro, coloradito, amarillo, verde, rojo, chichilo and manchamanteles. Nobody spoke for the first ten minutes.'] },
    ],
  },
]

export const years = [...new Set(trips.map((t) => t.year))].sort((a, b) => b - a)
export const getTrip = (slug) => trips.find((t) => t.slug === slug)
export const tripsByYear = (y) => trips.filter((t) => t.year === y).sort((a, b) => a.start.localeCompare(b.start))
export const recentTrips = () => trips.filter((t) => !t.upcoming).sort((a, b) => b.start.localeCompare(a.start))
export const upcomingTrip = () => trips.find((t) => t.upcoming)
export const allPosts = () => trips.flatMap((t) => t.posts.map((p) => ({ ...p, trip: t })))

const mon = (d) => d.toLocaleString('en-US', { month: 'short' })
export const fmtRange = (s, e) => {
  const a = new Date(s + 'T00:00:00')
  const b = new Date(e + 'T00:00:00')
  return a.getMonth() === b.getMonth()
    ? `${mon(a)} ${a.getDate()}-${b.getDate()}`
    : `${mon(a)} ${a.getDate()} - ${mon(b)} ${b.getDate()}`
}
export const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
