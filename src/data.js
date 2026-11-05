// Six sample coffees. Each bag is painted the colour of the fruit you taste in the cup.
export const COFFEES = [
  {
    id: 'guji', name: 'Guji Natural', origin: 'Ethiopia', region: 'Guji, Oromia', producer: 'Hambela washing station',
    alt: '1,950 to 2,200 m', process: 'Natural, dried 21 days on raised beds', variety: 'Ethiopian heirloom', harvest: 'November to January',
    notes: ['Strawberry', 'Jasmine', 'Cacao nib'], fruit: 9, body: 3, sweet: 7, roast: 'Light', colour: '#c98a92', ink: '#3b1a1f',
    img: 'bag-guji', price: { 250: 19, 1000: 62 }, kind: 'fruity', best: ['pourover', 'french'],
    line: 'Tastes like strawberry jam on cocoa toast.',
  },
  {
    id: 'huila', name: 'Huila Pink Bourbon', origin: 'Colombia', region: 'Pitalito, Huila', producer: 'Finca La Esperanza',
    alt: '1,700 m', process: 'Washed, 36 hour ferment', variety: 'Pink Bourbon', harvest: 'April to June',
    notes: ['Red apple', 'Orange', 'Panela'], fruit: 7, body: 4, sweet: 8, roast: 'Light', colour: '#ee9a55', ink: '#3e1e06',
    img: 'bag-huila', price: { 250: 18, 1000: 58 }, kind: 'fruity', best: ['pourover', 'espresso'],
    line: 'Bright like an orange, sweet like cane sugar.',
  },
  {
    id: 'cerrado', name: 'Cerrado Sweet', origin: 'Brazil', region: 'Cerrado Mineiro', producer: 'Fazenda Boa Vista',
    alt: '1,150 m', process: 'Pulped natural', variety: 'Yellow Catuai', harvest: 'May to August',
    notes: ['Milk chocolate', 'Hazelnut', 'Brown sugar'], fruit: 2, body: 8, sweet: 7, roast: 'Medium', colour: '#8b6447', ink: '#fff4e8',
    img: 'bag-cerrado', price: { 250: 15, 1000: 46 }, kind: 'chocolatey', best: ['espresso', 'moka', 'french'],
    line: 'The everyday one. Great with milk.',
  },
  {
    id: 'kirinyaga', name: 'Kirinyaga AA', origin: 'Kenya', region: 'Kirinyaga County', producer: 'Kii factory',
    alt: '1,800 m', process: 'Washed, double fermented', variety: 'SL28, SL34', harvest: 'October to December',
    notes: ['Blackcurrant', 'Grapefruit', 'Tomato leaf'], fruit: 10, body: 5, sweet: 5, roast: 'Light', colour: '#5e3550', ink: '#fbe9f3',
    img: 'bag-kirinyaga', price: { 250: 21, 1000: 68 }, kind: 'fruity', best: ['pourover'],
    line: 'Juicy and loud. For people who like a sharp cup.',
  },
  {
    id: 'gayo', name: 'Aceh Gayo', origin: 'Indonesia', region: 'Gayo Highlands, Aceh', producer: 'Ketiara cooperative',
    alt: '1,400 to 1,600 m', process: 'Wet hulled', variety: 'Ateng, Tim Tim', harvest: 'October to March',
    notes: ['Dark chocolate', 'Cedar', 'Clove'], fruit: 1, body: 10, sweet: 5, roast: 'Medium dark', colour: '#6c7f52', ink: '#f2f6ea',
    img: 'bag-gayo', price: { 250: 16, 1000: 49 }, kind: 'chocolatey', best: ['french', 'moka', 'espresso'],
    line: 'Heavy, earthy and calm. A rainy afternoon cup.',
  },
  {
    id: 'decaf', name: 'Sugarcane Decaf', origin: 'Colombia', region: 'Caldas', producer: 'Descafecol',
    alt: '1,600 m', process: 'Washed, decaffeinated with sugarcane', variety: 'Castillo, Caturra', harvest: 'All year',
    notes: ['Caramel', 'Red grape', 'Milk chocolate'], fruit: 4, body: 6, sweet: 8, roast: 'Medium', colour: '#9dbbd6', ink: '#13283b',
    img: 'bag-decaf', price: { 250: 17, 1000: 54 }, kind: 'decaf', best: ['espresso', 'pourover', 'french', 'moka'],
    line: 'All of the taste, none of the 3 am thoughts.',
  },
]

export const byId = (id) => COFFEES.find((c) => c.id === id)

export const GRINDS = [
  { id: 'whole', name: 'Whole bean', hint: 'Best if you grind at home' },
  { id: 'espresso', name: 'Espresso', hint: 'Very fine' },
  { id: 'filter', name: 'Filter', hint: 'Pour-over and drip' },
  { id: 'press', name: 'French press', hint: 'Coarse' },
  { id: 'moka', name: 'Moka pot', hint: 'Fine, a little coarser than espresso' },
]

export const METHODS = [
  { id: 'pourover', name: 'Pour-over', grind: 'filter', recipe: [['Coffee', '15 g'], ['Water', '250 g at 94°C'], ['Grind', 'Medium fine'], ['Time', '3 min']] },
  { id: 'espresso', name: 'Espresso', grind: 'espresso', recipe: [['Coffee', '18 g'], ['In the cup', '40 g'], ['Grind', 'Fine'], ['Time', '28 s']] },
  { id: 'french', name: 'French press', grind: 'press', recipe: [['Coffee', '30 g'], ['Water', '500 g just off the boil'], ['Grind', 'Coarse'], ['Time', '4 min, then press']] },
  { id: 'moka', name: 'Moka pot', grind: 'moka', recipe: [['Coffee', '17 g, level, not packed'], ['Water', 'Hot, up to the valve'], ['Grind', 'Fine'], ['Time', 'Off the heat when it hisses']] },
]

export const STAGES = [
  { img: 'branch', t: 'Picked red', d: 'Coffee is the seed of a cherry. Pickers come back to the same tree every week or so and take only the deep red ones.', k: 'Week 1' },
  { img: 'green', t: 'Dried and sorted', d: 'The fruit dries around the seed for two to three weeks, then the green beans are hulled, sorted by hand and bagged for the trip.', k: 'Weeks 2 to 12' },
  { img: 'roasted', t: 'Roasted on Tuesday', d: 'We roast once a week in small batches, light enough to keep the fruit you would have tasted in the cherry.', k: 'Tuesday' },
  { img: 'cup', t: 'In your cup', d: 'Posted the next morning. Coffee tastes best from about day 5 to day 40, so every bag is stamped with its roast date.', k: 'Wednesday on' },
]

export const FAQ = [
  ['When will my coffee arrive?', 'We roast on Tuesday and post on Wednesday. Order by Monday 22:00 to make that week. Standard delivery takes two to three days.'],
  ['Which grind should I pick?', 'Pick the way you brew and we grind for it. Whole beans keep their taste longest if you have a grinder.'],
  ['How does the subscription work?', 'Pick a coffee or let us choose, how much and how often. You save 10%, shipping is free, and you can skip, swap or stop any time before Monday.'],
  ['Are the bags recyclable?', 'The bag is paper with a thin plant-based lining and goes in home compost. The tin tie and the valve come off and go with metal and plastic.'],
  ['What if I do not like it?', 'Tell us within 30 days and we send another coffee instead, on us.'],
]

// Next roast day (Tuesday) and the order cut-off (Monday 22:00), from the visitor's clock.
export function nextRoast(now = new Date()) {
  const d = new Date(now)
  const cut = new Date(now)
  const toMon = (1 - d.getDay() + 7) % 7
  cut.setDate(d.getDate() + toMon); cut.setHours(22, 0, 0, 0)
  if (cut <= now) cut.setDate(cut.getDate() + 7)
  const roast = new Date(cut); roast.setDate(cut.getDate() + 1)
  const post = new Date(cut); post.setDate(cut.getDate() + 2)
  return { cut, roast, post, ms: cut - now }
}
export const fmtDay = (d) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
export const usd = (n) => `$${n.toFixed(2).replace(/\.00$/, '')}`
