// Co-Ware sample content. Every price, size and date is a sample for the prototype.
export const TYPES = {
  shelf: { id: 'shelf', name: 'Shelf bay', colour: 'var(--lemon)', ink: 'var(--ink)', img: 'img/shelf', from: 89, unit: 'per bay a month',
    size: '2.4 m of shelving, 5 levels', fits: 'About 60 cartons. Brands with a few hundred SKUs.',
    incl: ['Picked and packed by you or by us', 'Coloured bins included', 'Access 7:00 to 22:00'] },
  pallet: { id: 'pallet', name: 'Pallet space', colour: 'var(--teal)', ink: 'var(--ink)', img: 'img/pallet', from: 39, unit: 'per pallet a month',
    size: '1.2 × 1.0 m, up to 1.8 m high', fits: 'Bulk stock that moves by the carton.',
    incl: ['Booked in and out at the dock', 'Forklift moves on request', 'Count report every month'] },
  bay: { id: 'bay', name: 'Private bay', colour: 'var(--cobalt)', ink: '#fff', img: 'img/bay', from: 690, unit: 'a month, 20 m²',
    size: '15, 20 or 30 m², lockable cage', fits: 'Teams who want their own door and their own rhythm.',
    incl: ['Roller door and your own lock', 'Racking set up to your layout', '24 hour access'] },
  desk: { id: 'desk', name: 'Packing desk', colour: 'var(--tangerine)', ink: 'var(--ink)', img: 'img/packing', from: 149, unit: 'a month',
    size: 'A 2 m station on the shared floor', fits: 'Founders who ship from home and need room to pack.',
    incl: ['Tape, scales and printers shared', 'Courier pickups twice a day', 'Lounge and wifi'] },
}

// The floor plan: a 16 × 10 grid of cells. Each unit has a position, a size and whether it is free.
export const FLOOR = { cols: 16, rows: 10 }
const U = (id, type, x, y, w, h, free, extra = {}) => ({ id, type, x, y, w, h, free, ...extra })
export const UNITS = [
  // Private bays along the top wall
  U('B1', 'bay', 0, 0, 3, 2, false, { m2: 20 }), U('B2', 'bay', 3, 0, 3, 2, true, { m2: 20 }), U('B3', 'bay', 6, 0, 2, 2, true, { m2: 15 }),
  U('B4', 'bay', 8, 0, 4, 2, false, { m2: 30 }), U('B5', 'bay', 12, 0, 2, 2, false, { m2: 15 }),
  // Shelf runs: two double rows
  ...[0, 1, 3, 4].flatMap((x, c) => [0, 1, 2, 3].map((r) => U(`S${c * 4 + r + 1}`, 'shelf', x, 3 + r, 1, 1, [1, 2, 5, 6, 8, 11, 15].includes(c * 4 + r)))),
  // Pallet grid
  ...Array.from({ length: 18 }, (_, i) => U(`P${i + 1}`, 'pallet', 6 + (i % 6), 3 + Math.floor(i / 6), 1, 1, ![2, 3, 7, 8, 9, 13, 16].includes(i))),
  // Packing desks
  ...Array.from({ length: 8 }, (_, i) => U(`D${i + 1}`, 'desk', 12.6 + (i % 2) * 1.7, 3.1 + Math.floor(i / 2), 1.5, 0.8, ![1, 4, 6].includes(i))),
]
export const ZONES = [
  { name: 'Loading dock', x: 14, y: 0, w: 2, h: 2, kind: 'dock' },
  { name: 'Receiving', x: 6, y: 7, w: 4, h: 3, kind: 'fixed' },
  { name: 'Lounge', x: 10, y: 7, w: 6, h: 3, kind: 'lounge' },
  { name: 'Goods lift', x: 0, y: 8, w: 2, h: 2, kind: 'fixed' },
]

export const SHARED = [
  { t: 'Loading dock', d: 'Two dock doors and a van bay. Book a slot, we have the pallet jack ready.', img: 'img/dock' },
  { t: 'Packing tables', d: 'Long tables, scales, label printers and tape, restocked every morning.', img: 'img/overhead' },
  { t: 'Receiving team', d: 'Deliveries signed for, counted and put away while you are out.', img: 'img/pallet' },
  { t: 'Courier pickups', d: 'Collections at 11:00 and 16:00 from the main couriers, no booking needed.', img: 'img/dock' },
  { t: 'Members lounge', d: 'Coffee, wifi and quiet desks on the mezzanine above the floor.', img: 'img/lounge' },
]

export const EVENTS = [
  { d: 'Tue 17 Nov', t: 'Pricing for repeat customers', who: 'Workshop, 18:30' },
  { d: 'Thu 26 Nov', t: 'Peak season: packing at speed', who: 'Floor session, 08:00' },
  { d: 'Wed 2 Dec', t: 'Members evening and swap table', who: 'Lounge, 18:00' },
]

export const FAQ = [
  ['How short can a contract be?', 'Shelf bays, pallets and desks run month to month with one month’s notice. Private bays start at three months.'],
  ['Can you pack orders for us?', 'Yes. Pick and pack is charged per order on top of your space, or you pack yourself at the shared tables.'],
  ['What can I not store?', 'Food that needs a cold chain, hazardous goods and anything that needs a licence. Ask if you are unsure.'],
  ['Is my stock insured?', 'The building is insured; stock is insured through your own policy. We can recommend brokers who know small brands.'],
  ['Can I visit before I sign?', 'Book a 30 minute tour. You will walk the floor, see the free units on the plan and meet the team that runs it.'],
]
