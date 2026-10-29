import { money } from './menu.js'

// How the shop serves orders: branches, saved addresses, the delivery area and the steps an order
// goes through after it reaches the kitchen. Sample values for the prototype; the shop replaces them.

export const BRANCHES = [
  { id: 'ring', name: 'Ring Road', area: 'Ring Road, opposite the bus station, open late', opens: 10, closes: 26, delivery: true, curbside: false, wait: 15 },
  { id: 'harbour', name: 'Harbour Street', area: 'Harbour Street, next to the fish market', opens: 11, closes: 23, delivery: true, curbside: true, wait: 20 },
  { id: 'mall', name: 'Airport Mall', area: 'Airport Mall food court, level 2', opens: 10, closes: 22, delivery: false, curbside: false, wait: 10 },
]
export const branchOf = (id) => BRANCHES.find((b) => b.id === id) || BRANCHES[0]

// Delivery is priced by distance from the branch that serves the address.
export const DELIVERY = { radiusKm: 6, minOrder: 12, base: 1.9, perKm: 0.3 }
export const feeFor = (km) => Math.round((DELIVERY.base + km * DELIVERY.perKm) * 10) / 10

export const ADDRESSES = [
  { id: 'home', label: 'Home', line: '14 Palm Avenue', unit: 'Flat 3, second floor', note: 'Blue gate, ring the top bell', branch: 'ring', km: 2.1 },
  { id: 'work', label: 'Work', line: 'Unit 5, Kingsway Business Park', unit: 'Reception', note: 'Ask for Nadia at the front desk', branch: 'harbour', km: 3.8 },
]

// What the address search returns in the prototype. The last one is outside the delivery area.
export const LOOKUP = [
  { line: '9 Cedar Close', area: 'Palm Estate', branch: 'ring', km: 1.4 },
  { line: '41 Market Lane', area: 'Old Town', branch: 'harbour', km: 2.6 },
  { line: '7 Lagoon Drive', area: 'Harbour side', branch: 'harbour', km: 4.9 },
  { line: '120 Ridge Hill Road', area: 'Ridge Hill', branch: null, km: 11.2 },
]

export const CARD = 'Card ending 4821'
export const TIPS = [0, 1, 2, 3]
export const HOLD_MIN = 30 // an order saved with no signal is held this long before we ask again

// Minutes from the kitchen's door to a customer, used for the delivery window.
export const rideMins = (km) => Math.round(6 + km * 4)
export const windowFor = (branch, km) => {
  const a = Math.round((branch.wait + rideMins(km)) / 5) * 5
  return [a, a + 10]
}

// Hours past 24 mean after midnight: closes 26 is 02:00 the next morning.
export const isOpen = (b, d = new Date()) => {
  const h = new Date(d).getHours()
  return (h >= b.opens && h < b.closes) || (b.closes > 24 && h < b.closes - 24)
}
export const hour = (h) => `${String(h % 24).padStart(2, '0')}:00`

export const RIDER = { name: 'Kofi', ride: 'Red scooter', plate: 'GR 2291' }

// The steps after the shop accepts. `min` is how long the step takes in real minutes; the demo plays
// one minute in DEMO_MS. `wait` steps pause until the customer does something.
export const DEMO_MS = 2000
export const MILESTONES = {
  delivery: ['Confirmed', 'In the kitchen', 'On the way', 'Delivered'],
  counter: ['Confirmed', 'In the kitchen', 'Ready', 'Collected'],
  curbside: ['Confirmed', 'In the kitchen', 'Ready', 'At your car'],
}

export function planFor(o) {
  const b = branchOf(o.branch)
  if (o.mode === 'delivery') {
    const ride = rideMins(o.address.km)
    return [
      { id: 'accepted', m: 0, min: 1, title: `${b.name} accepted your order`, note: o.pay === 'card' ? `${CARD} charged ${money(o.priced.total)}` : `Pay ${money(o.priced.total)} in cash to the rider` },
      { id: 'cooking', m: 1, min: 1, title: 'In the kitchen', note: 'Fried to order. Grill dishes go on the coals.' },
      { id: 'rider', m: 1, min: 6, title: `${RIDER.name} will bring it`, note: `${RIDER.ride}, ${RIDER.plate}. Riding to the shop now.` },
      { id: 'packed', m: 1, min: Math.max(4, b.wait - 8), title: 'Packed and sealed', note: 'Dips counted, bag sealed with a sticker until it reaches you.' },
      { id: 'pickedup', m: 2, min: 2, title: 'On the way', note: `${RIDER.name} left the shop, ${o.address.km} km to go.` },
      { id: 'near', m: 2, min: Math.max(3, ride - 3), title: 'Almost there', note: o.drop === 'hand' ? 'Under 500 m away. Have your hand-off code ready.' : 'Under 500 m away.' },
      { id: 'delivered', m: 3, min: 3, title: o.drop === 'hand' ? 'Delivered to you' : 'Left at your door', note: o.drop === 'hand' ? 'Code checked by the rider.' : `${RIDER.name} marked it left at the door.` },
    ]
  }
  const pay = o.pay === 'card' ? `${CARD} charged ${money(o.priced.total)}` : `Pay ${money(o.priced.total)} at the counter`
  const steps = [{ id: 'accepted', m: 0, min: 1, title: `${b.name} accepted your order`, note: pay }]
  if (o.when === 'arrive') steps.push({ id: 'await', m: 0, min: 0, wait: 'arrival', title: 'Waiting for you', note: 'We start cooking when you tap I’m here, so it comes out hot.' })
  steps.push({ id: 'cooking', m: 1, min: 1, title: 'In the kitchen', note: 'Fried to order. Grill dishes go on the coals.' })
  if (o.style === 'curbside') {
    steps.push(
      { id: 'ready', m: 2, min: o.when === 'arrive' ? 9 : b.wait - 2, wait: 'arrival', title: 'Ready, packed and sealed', note: 'Tap I’m here when you park in a curbside bay.' },
      { id: 'bringing', m: 2, min: 1, title: 'Bringing it out', note: 'Look for the red jacket.' },
      { id: 'handed', m: 3, min: 2, title: 'Handed to you at your car', note: 'Enjoy it while it is hot.' },
    )
  } else {
    steps.push(
      { id: 'ready', m: 2, min: o.when === 'arrive' ? 9 : b.wait - 2, title: 'Ready on the pickup shelf', note: `Shelf by the door, under number ${o.id}.` },
      { id: 'collected', m: 3, min: 5, title: 'Collected', note: 'Scanned at the shelf.' },
    )
  }
  return steps
}
