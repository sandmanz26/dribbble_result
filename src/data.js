// Content from the BRTH Labs website brief (Nov 4, 2026). Prices and offers are the brief's placeholders.
export const FLAVORS = {
  spearmint: {
    id: 'spearmint', name: 'Spearmint', field: '#0F4D2E', accent: '#C8F04B', onAccent: '#0A0A0A',
    line: 'Clean, bright, classic. The everyday fresh.', notes: 'Bright, sweet, classic mint.',
    img: 'spearmint-34', open: 'spearmint-open', hand: 'in-hand', pocket: 'spearmint-pocket', life: 'm-hello', carton: 'carton-spearmint',
    mist: '#d9f5e3', path: '/products/spearmint',
  },
  arctic: {
    id: 'arctic', name: 'Arctic Mint', field: '#0B2E6B', accent: '#8FD8F2', onAccent: '#0A0A0A',
    line: 'Icy and intense. For when you need the cold blast.', notes: 'Icy, sharp, long cool finish.',
    img: 'arctic-34', open: 'arctic-open', hand: 'arctic-hand', pocket: 'pocket', life: 'm-coffee', carton: 'carton-arctic',
    mist: '#d6f1fb', path: '/products/arctic-mint',
  },
}
export const flavorBySlug = (slug) => (slug === 'arctic-mint' ? FLAVORS.arctic : FLAVORS.spearmint)

// Pack sizes on the PDP and the bundles on /shop.
export const PACKS = [
  { n: 1, price: 7.99, label: '1 pack', save: '' },
  { n: 3, price: 21.99, label: '3 packs', save: 'Save 8%' },
  { n: 6, price: 39.99, label: '6 packs', save: 'Save 17%' },
]
export const SUB_OFF = 0.2
export const FREQ = [1, 2, 3]

export const SHOP = [
  { id: 'spearmint', name: 'Spearmint', sub: '2-pack, 2 × 10 mL', price: 7.99, flavor: 'spearmint', img: 'spearmint-34', to: '/products/spearmint' },
  { id: 'arctic', name: 'Arctic Mint', sub: '2-pack, 2 × 10 mL', price: 7.99, flavor: 'arctic', img: 'arctic-34', to: '/products/arctic-mint' },
  { id: 'duo', name: 'Duo', sub: '1 Spearmint + 1 Arctic Mint 2-pack', price: 14.99, flavor: 'duo', img: 'devices', default: true },
  { id: 'squad', name: 'Squad gift set', sub: '6 × 2-packs in a gift box', price: 39.99, flavor: 'duo', img: 'gift', seasonal: true },
]

export const INGREDIENTS = [
  ['Water', 'The base.'],
  ['Vegetable glycerin', 'Smooth texture.'],
  ['Natural flavor', 'The mint.'],
  ['Xylitol', 'Sugar-free sweetness.'],
  ['Sodium benzoate', 'Keeps it fresh.'],
  ['Citric acid', 'Balances the pH.'],
]

export const MOMENTS = [
  { t: 'Before the first hello.', tag: 'Dates', img: 'm-hello' },
  { t: 'Before the big pitch.', tag: 'Work', img: 'm-pitch' },
  { t: 'After the third coffee.', tag: 'Everyday', img: 'm-coffee' },
  { t: 'Before the slow dance.', tag: 'Weddings', img: 'm-dance' },
  { t: 'Before the group photo.', tag: 'Everyday', img: 'm-group' },
  { t: 'Before the close talker finds you.', tag: 'Everyday', img: 'm-close' },
]

// true = yes, false = no, a string = said as is. Only rows the product team confirms ship.
export const COMPARE = [
  ['Twist-to-reveal nozzle', true, false],
  ['No cap to lose', true, false],
  ['Sugar free', true, 'Varies'],
  ['Vegan', true, 'Varies'],
  ['Designed to be seen', true, false],
]

// Sample creator posts for the pre-launch social proof grid. Handles are placeholders.
export const UGC = [
  { h: '@sample.creator', q: 'The twist is so satisfying I keep doing it in meetings.', img: 'm-group' },
  { h: '@sample.dates', q: 'Pulled it out before dinner. Got asked where it was from.', img: 'm-hello' },
  { h: '@sample.travels', q: 'Lives in my jacket now. Fits next to my keys.', img: 'pocket' },
]

export const RETAIL = ['CVS', 'Walgreens', 'Walmart', 'Target']

export const FAQ = [
  ['Product', [
    ['How do I use it?', 'Twist the top a quarter turn to reveal the nozzle. Spray 1 to 2 times into your mouth. Twist it closed.'],
    ['How many sprays are in each device?', 'To be confirmed by the manufacturer before launch.'],
    ['Is it refillable?', 'To be confirmed. If no refill product launches, this answer and the refill line on the carton offer change.'],
    ['Does it whiten or treat anything?', 'No. It is for fresh breath.'],
  ]],
  ['Ingredients and safety', [
    ['Is it sugar free?', 'Yes. It is sweetened with xylitol.'],
    ['Is it vegan?', 'Yes, once vegetable glycerin and a vegan flavor are confirmed in writing by the manufacturer.'],
    ['What is xylitol?', 'A sugar alcohol that tastes sweet without sugar. Keep BRTH away from young children and pets.'],
    ['Is it safe for kids?', 'Keep out of reach of young children and pets.'],
    ['Is it kosher?', 'Only if certified. We will confirm before answering.'],
  ]],
  ['Travel', [['Can I take it on a plane?', 'Yes. Each device is 10 mL, well under the 3.4 oz carry-on limit.']]],
  ['Orders', [
    ['How long does shipping take?', 'Placeholder: ship times to be set with fulfilment.'],
    ['Do you ship internationally?', 'Placeholder: to be decided.'],
    ['Returns and guarantee', '30-day happiness guarantee. If you do not love it, tell us.'],
  ]],
  ['Subscriptions', [['How do I skip or pause?', 'From your account, any time. No email needed.'], ['Can I change flavor or how often it comes?', 'Yes. Swap flavor or switch between every 1, 2 or 3 months from your account.'], ['How do I cancel?', 'One tap in your account. No call, no email.']]],
]

export const usd = (n) => `$${n.toFixed(2)}`
export const ANNOUNCE = [['Free shipping on 2+ packs', '/shop'], ['Subscribe & save 20%', '/products/spearmint'], ['Now at [retailer]. Find a store.', '/where-to-buy']]
export const FREE_AT = 2 // packs; open decision in the brief (2+ packs or a dollar amount)

// Sample subscription for the account portal.
export const SAMPLE_SUB = { flavor: 'spearmint', packs: 1, every: 1, next: 'Dec 4, 2026', price: 6.39 }
