// Mock data only — no backend. `scene` picks the illustrated "photo" style,
// `palette` is [sky, sun, far, mid, near] drawn from the retro ink set.
export const trips = [
  // ---------- 2026 ----------
  {
    slug: 'lofoten-winter-light',
    year: 2026, start: '2026-02-06', end: '2026-02-13',
    title: 'Lofoten in Winter Light', place: 'Lofoten', country: 'Norway',
    scene: 'mountains', palette: ['#f4d9b0', '#e8563a', '#3b4a6b', '#2c3552', '#1c2238'],
    crew: ['maya', 'dimas', 'lena'], tag: 'Arctic',
    summary: 'Seven days of fishing villages, red cabins and a sky that never quite decided whether it was dawn or dusk.',
    stats: { distance: '1,840 km', days: 8, budget: '$1,120 pp' },
    posts: [
      { id: 'chasing-the-aurora', title: 'Chasing the aurora from a rented Volvo', date: '2026-02-08', author: 'dimas', read: 6, scene: 'mountains',
        body: ['We landed in Leknes at 2pm and the sun was already apologising for leaving. Our rental was a 2009 Volvo with a heated steering wheel, which Maya declared the best invention since the wheel itself.',
               'The aurora forecast said KP 4. We drove to Uttakleiv beach with a thermos of coffee and waited. At 11:40pm the sky did a slow green exhale. Dimas shot 212 frames; three were any good.',
               'Tip we wish we had: bring a second pair of gloves just for the camera. Touching a tripod at −9°C is a personality test.'] },
      { id: 'a-cabin-called-rorbu', title: 'A red cabin called rorbu', date: '2026-02-10', author: 'lena', read: 4, scene: 'coast',
        body: ['Rorbuer were built for fishermen; now they are built for people who say "just one more chapter" at 1am. Ours had a wood stove, a window onto the harbour and a kettle with attitude.',
               'We cooked stockfish stew badly, then ate it anyway. The owner stopped by to tell us the cod run was late this year. We nodded like experts.'] },
      { id: 'budget-notes', title: 'What Lofoten actually cost us', date: '2026-02-14', author: 'sari', read: 3, scene: 'lake',
        body: ['Norway has a reputation. We budgeted $160 a day and landed at $140 by cooking breakfast and dinner in the cabin. Lunch was a cinnamon bun, every day, on principle.',
               'Biggest surprise: the ferry to Bodø was cheaper than the taxi from the airport. Second biggest surprise: the taxi.'] },
    ],
  },
  {
    slug: 'kyoto-in-bloom',
    year: 2026, start: '2026-04-01', end: '2026-04-07',
    title: 'Kyoto in Bloom', place: 'Kyoto', country: 'Japan',
    scene: 'city', palette: ['#f6d5d0', '#e8563a', '#c9806f', '#8a4f5e', '#4a2c3c'],
    crew: ['lena', 'theo', 'sari', 'maya'], tag: 'Culture',
    summary: 'Cherry blossoms, vending-machine coffee, and one very serious debate about the best convenience-store onigiri.',
    stats: { distance: '620 km', days: 7, budget: '$1,480 pp' },
    posts: [
      { id: 'hanami-at-dawn', title: 'Hanami at dawn, before the crowds', date: '2026-04-02', author: 'lena', read: 5, scene: 'city',
        body: ['The trick is 5:30am. Philosopher’s Path at that hour belongs to joggers, two photographers and a heron. By 9 it belongs to everyone.',
               'Petals landed in Theo’s coffee and he drank it anyway. "Seasonal," he said.'] },
      { id: 'onigiri-ranking', title: 'The definitive onigiri ranking', date: '2026-04-04', author: 'theo', read: 3, scene: 'coast',
        body: ['After 23 onigiri across three chains, the verdict: salted salmon first, tuna mayo second, plum last — controversially, by everyone but Sari.',
               'Methodology: we are not scientists. We were hungry.'] },
    ],
  },
  {
    slug: 'sahara-slow-drive',
    year: 2026, start: '2026-06-12', end: '2026-06-20',
    title: 'The Slow Drive Through Merzouga', place: 'Merzouga', country: 'Morocco',
    scene: 'desert', palette: ['#f7e0a8', '#e8563a', '#e9a23b', '#c8702f', '#7a3b22'],
    crew: ['maya', 'dimas', 'theo', 'sari', 'lena'], tag: 'Desert',
    summary: 'Five friends, one dusty 4x4, and a night under more stars than any of us had agreed to count.',
    stats: { distance: '2,310 km', days: 9, budget: '$960 pp' },
    posts: [
      { id: 'dunes-by-camel', title: 'Dunes by camel (a bad idea, 10/10)', date: '2026-06-15', author: 'maya', read: 5, scene: 'desert',
        body: ['Camels do not care about your itinerary. Ours, Hamid, stopped every ten minutes for what we assume was scenery appreciation.',
               'Camp had rugs, tea, drums and a sky that made Dimas put the camera down for a full hour. Historic.'] },
      { id: 'tagine-economics', title: 'Tagine economics for five', date: '2026-06-17', author: 'sari', read: 3, scene: 'city',
        body: ['A tagine for five costs roughly what one coffee costs back home. We ate lamb, chicken and vegetable versions and tried not to look smug.'] },
    ],
  },
  {
    slug: 'dolomites-hut-to-hut',
    year: 2026, start: '2026-08-21', end: '2026-08-28',
    title: 'Dolomites, Hut to Hut', place: 'South Tyrol', country: 'Italy',
    scene: 'mountains', palette: ['#cfe3dc', '#f4e4c1', '#6f9a8e', '#3f6f73', '#1f3d44'],
    crew: ['dimas', 'theo', 'lena'], tag: 'Hiking',
    summary: 'Seven rifugi, forty thousand steps a day, and polenta so good it changed our relationship to polenta.',
    stats: { distance: '96 km on foot', days: 8, budget: '$870 pp' },
    posts: [
      { id: 'day-three-ladder', title: 'Day three: the iron ladder', date: '2026-08-23', author: 'theo', read: 4, scene: 'mountains',
        body: ['Via ferrata means "iron path". It does not mean "gentle". Dimas discovered a fear of heights somewhere around rung 41.',
               'At the rifugio, a bowl of barley soup became the single greatest meal in recorded history.'] },
    ],
  },
  {
    slug: 'lisbon-tram-weekend',
    year: 2026, start: '2026-10-09', end: '2026-10-12',
    title: 'Lisbon Tram Weekend', place: 'Lisbon', country: 'Portugal',
    scene: 'coast', palette: ['#f7e6c4', '#e8563a', '#e9a23b', '#2f6f73', '#17414a'],
    crew: ['maya', 'sari'], tag: 'City break',
    summary: 'A long weekend riding tram 28 the wrong way on purpose, chasing pastéis de nata and good light.',
    stats: { distance: '340 km', days: 4, budget: '$610 pp' },
    posts: [
      { id: 'pastel-de-nata-crawl', title: 'A pastel de nata crawl, nine stops', date: '2026-10-10', author: 'maya', read: 3, scene: 'coast',
        body: ['Nine bakeries. One rule: no repeats. Winner was an unmarked place in Alfama with a queue of grandmothers, which is always the right signal.'] },
    ],
  },
  {
    slug: 'iceland-ring-road',
    year: 2026, start: '2026-12-04', end: '2026-12-14',
    title: 'Iceland Ring Road (Upcoming)', place: 'Ring Road', country: 'Iceland',
    scene: 'lake', palette: ['#dfe9ee', '#f4e4c1', '#8fb2bf', '#4c7587', '#243d4f'],
    crew: ['maya', 'dimas', 'lena', 'theo', 'sari'], tag: 'Road trip', upcoming: true,
    summary: 'The big one: the whole crew, a campervan, and ten days to circle the island. Notes will land here as we go.',
    stats: { distance: '≈ 1,330 km', days: 11, budget: 'TBD' },
    posts: [
      { id: 'packing-list', title: 'The packing list (draft 3)', date: '2026-10-15', author: 'sari', read: 2, scene: 'lake',
        body: ['Rule one: nobody brings more than one pair of jeans. Rule two: Theo brings the snacks. Rule three: see rule two.'] },
    ],
  },
  // ---------- 2025 ----------
  {
    slug: 'patagonia-w-trek',
    year: 2025, start: '2025-01-18', end: '2025-01-29',
    title: 'Patagonia, the W Trek', place: 'Torres del Paine', country: 'Chile',
    scene: 'mountains', palette: ['#f1d7b8', '#e8563a', '#8a6f9e', '#4c3f72', '#241f3e'],
    crew: ['maya', 'dimas', 'theo'], tag: 'Hiking',
    summary: 'Wind that argues with you, towers that do not care, and a rainbow on day four that felt personally arranged.',
    stats: { distance: '80 km on foot', days: 12, budget: '$1,640 pp' },
    posts: [
      { id: 'wind-and-towers', title: 'Wind, towers, and one lost hat', date: '2025-01-22', author: 'maya', read: 5, scene: 'mountains',
        body: ['The base of the towers at sunrise glows the colour of a ripe apricot. The hat blew off at the mirador and is presumably in Argentina now.'] },
    ],
  },
  {
    slug: 'amalfi-off-season',
    year: 2025, start: '2025-05-09', end: '2025-05-14',
    title: 'Amalfi, Off-Season', place: 'Amalfi Coast', country: 'Italy',
    scene: 'coast', palette: ['#fbe3b4', '#e8563a', '#e9a23b', '#2f6f73', '#17414a'],
    crew: ['lena', 'sari'], tag: 'Coast',
    summary: 'Lemons the size of softballs, a ferry we nearly missed, and a village with more cats than residents.',
    stats: { distance: '410 km', days: 6, budget: '$1,050 pp' },
    posts: [
      { id: 'the-ferry-we-missed', title: 'The ferry we (almost) missed', date: '2025-05-11', author: 'lena', read: 3, scene: 'coast',
        body: ['We ran down 300 steps with two backpacks and a bag of lemons. The captain waited exactly four seconds. We made it with three.'] },
    ],
  },
  {
    slug: 'hokkaido-ski-week',
    year: 2025, start: '2025-02-20', end: '2025-02-26',
    title: 'Hokkaido Ski Week', place: 'Niseko', country: 'Japan',
    scene: 'forest', palette: ['#e6eef2', '#f4e4c1', '#9bb7c4', '#4d7a6a', '#1f4136'],
    crew: ['dimas', 'theo'], tag: 'Snow',
    summary: 'Powder up to the knees, ramen at every altitude, and a hot spring that fixed everything.',
    stats: { distance: '280 km', days: 7, budget: '$1,380 pp' },
    posts: [
      { id: 'powder-day', title: 'Powder day, honestly', date: '2025-02-22', author: 'theo', read: 3, scene: 'forest',
        body: ['Forty centimetres overnight. Lifts opened at 8:30; we were in line at 7:55 like children waiting for a bakery.'] },
    ],
  },
  {
    slug: 'balkan-bus-loop',
    year: 2025, start: '2025-09-05', end: '2025-09-17',
    title: 'The Balkan Bus Loop', place: 'Balkans', country: 'Croatia → Albania',
    scene: 'lake', palette: ['#f6e0b6', '#e8563a', '#e9a23b', '#3f8a8a', '#1b4a52'],
    crew: ['maya', 'lena', 'theo', 'sari'], tag: 'Multi-city',
    summary: 'Twelve days, five countries, nine buses — and a timetable that was more of a suggestion.',
    stats: { distance: '1,450 km', days: 13, budget: '$780 pp' },
    posts: [
      { id: 'nine-buses', title: 'Nine buses, ranked', date: '2025-09-10', author: 'sari', read: 4, scene: 'city',
        body: ['Best: Kotor → Shkodër, with a driver who played jazz. Worst: we do not talk about Mostar.'] },
    ],
  },
  // ---------- 2024 ----------
  {
    slug: 'scottish-highlands-loop',
    year: 2024, start: '2024-05-17', end: '2024-05-23',
    title: 'Scottish Highlands Loop', place: 'Highlands', country: 'Scotland',
    scene: 'lake', palette: ['#e8dfd2', '#f4e4c1', '#8a9aa6', '#566c5a', '#2c3d36'],
    crew: ['maya', 'dimas', 'lena'], tag: 'Road trip',
    summary: 'Single-track roads, sheep with right of way, and a pub where nobody asked us to leave.',
    stats: { distance: '1,100 km', days: 7, budget: '$730 pp' },
    posts: [
      { id: 'sheep-have-right-of-way', title: 'Sheep have right of way', date: '2024-05-19', author: 'dimas', read: 3, scene: 'lake',
        body: ['A ewe stared down our rental for four minutes. We lost.'] },
    ],
  },
  {
    slug: 'oaxaca-day-of-colour',
    year: 2024, start: '2024-10-29', end: '2024-11-04',
    title: 'Oaxaca, Day of Colour', place: 'Oaxaca', country: 'Mexico',
    scene: 'city', palette: ['#fadcb0', '#e8563a', '#e9a23b', '#a14b6e', '#4a2a4b'],
    crew: ['lena', 'theo', 'sari'], tag: 'Culture',
    summary: 'Marigolds, mole in seven colours, and an evening procession that none of us will forget.',
    stats: { distance: '220 km', days: 7, budget: '$840 pp' },
    posts: [
      { id: 'seven-moles', title: 'Seven moles in one afternoon', date: '2024-10-31', author: 'theo', read: 4, scene: 'city',
        body: ['Negro, coloradito, amarillo, verde, rojo, chichilo, manchamanteles. We were silent for eleven minutes, which is a record.'] },
    ],
  },
]

export const years = [...new Set(trips.map((t) => t.year))].sort((a, b) => b - a)
export const getTrip = (slug) => trips.find((t) => t.slug === slug)
export const tripsByYear = (y) => trips.filter((t) => t.year === y).sort((a, b) => a.start.localeCompare(b.start))
export const featuredTrips = () => trips.filter((t) => t.year === 2026 && !t.upcoming).sort((a, b) => b.start.localeCompare(a.start))
export const allPosts = () => trips.flatMap((t) => t.posts.map((p) => ({ ...p, trip: t })))

export const fmtRange = (s, e) => {
  const a = new Date(s + 'T00:00:00'); const b = new Date(e + 'T00:00:00')
  const m = (d) => d.toLocaleString('en-US', { month: 'short' })
  return a.getMonth() === b.getMonth()
    ? `${m(a)} ${a.getDate()}–${b.getDate()}`
    : `${m(a)} ${a.getDate()} – ${m(b)} ${b.getDate()}`
}
export const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
