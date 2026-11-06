// Sample content for KUMO, a canned matcha latte. Brand, sourcing details, nutrition and prices are samples.
export const CANS = [
  {
    id: 'original', name: 'Matcha Latte', short: 'Original', img: 'can-original', dot: '#9aae74',
    line: 'First-harvest matcha, whole milk and a little cane sugar. Soft, green, gently sweet.',
    ings: ['Water', 'whole milk (32%)', 'cane sugar', 'matcha (0.8%)'], kcal: 120, sugar: 9, caf: 60,
  },
  {
    id: 'oat', name: 'Oat Matcha Latte', short: 'Oat', img: 'can-oat', dot: '#c9b49a',
    line: 'The same matcha with oat milk. A little nutty, fully plant based.',
    ings: ['Water', 'oat drink (30%)', 'cane sugar', 'matcha (0.8%)', 'sea salt'], kcal: 110, sugar: 8, caf: 60,
  },
  {
    id: 'pure', name: 'Pure Matcha', short: 'Unsweetened', img: 'can-pure', dot: '#3f5a37',
    line: 'Matcha and milk, nothing sweet. Deeper, grassier, for people who drink usucha.',
    ings: ['Water', 'whole milk (35%)', 'matcha (1%)'], kcal: 70, sugar: 4, caf: 75,
  },
]

export const PACKS = [{ n: 6, price: 27 }, { n: 12, price: 50 }, { n: 24, price: 94 }]

export const FACTS = [
  ['20', 'days in shade', 'before the first picking'],
  ['1', 'harvest a year', 'the first flush, in early May'],
  ['2 g', 'of matcha', 'in every 250 ml can'],
  ['3', 'ingredients', 'in the original, no flavourings'],
]

export const STEPS = [
  { img: 'hands', t: 'Shaded and picked', d: 'Tea bushes in Kagoshima rest under black cloth for about 20 days, then only the young top leaves of the first flush are picked.' },
  { img: 'powder', t: 'Stone milled', d: 'The leaves are steamed, dried, de-veined and ground on granite into matcha, slowly enough that the powder stays cool.' },
  { img: 'pour', t: 'Whisked cold', d: 'We whisk the matcha into cold milk instead of hot water, so it keeps its sweetness and the colour stays green.' },
  { img: 'tray', t: 'Canned the same day', d: 'Filled and sealed within hours of whisking, then kept cold. No preservatives, so the date on the can is short and honest.' },
]

export const FAQ = [
  ['How much caffeine is in a can?', 'About 60 mg in the Original and Oat, about 75 mg in Pure. Roughly a small coffee, released more slowly thanks to the L-theanine in shaded tea.'],
  ['Why does it settle?', 'Real matcha is ground leaf, not an extract, so a little settles at the bottom. Turn the can over gently before you open it.'],
  ['How long does it keep?', 'Nine months unopened, kept cool. Once open, finish it the same day.'],
  ['Where does the matcha come from?', 'First-harvest tencha from shaded fields in Kagoshima, milled in Japan. The lot number on the base tells you which picking.'],
]

export const usd = (n) => `$${n.toFixed(2).replace(/\.00$/, '')}`
export const can = (id) => CANS.find((c) => c.id === id) || CANS[0]
