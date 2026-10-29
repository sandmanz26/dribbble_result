// The synthetic world of the case: one luxury fashion group in Indonesia, six boutiques and a
// distribution centre. Every figure on every screen is read or computed from here, so a fact shown
// twice is one value. Amounts are in rupiah (IDR), tax included.

export const NOW = new Date('2026-10-29T10:40:00+07:00') // Thursday, 10:40 WIB
export const TODAY = 'Thursday 29 October'
export const SEASON = { name: 'Autumn Winter 26', since: '1 August' }

// ---------- formatting ----------
export const idr = (n) => {
  const a = Math.abs(n)
  if (a >= 1e9) return `IDR ${(n / 1e9).toFixed(2)}B`
  if (a >= 1e6) return `IDR ${(n / 1e6).toFixed(1)}M`
  if (a >= 1e3) return `IDR ${Math.round(n / 1e3)}k`
  return `IDR ${n}`
}
export const full = (n) => n.toLocaleString('en-US')
export const pct = (n, d = 1) => `${(n * 100).toFixed(d)}%`
export const signPct = (n, d = 1) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n * 100).toFixed(d)}%`

// ---------- people ----------
export const PEOPLE = {
  ratna: { id: 'ratna', name: 'Ratna Wijaya', role: 'Founder and CEO', short: 'Ratna', hue: 12 },
  dimas: { id: 'dimas', name: 'Dimas Prakoso', role: 'Boutique manager, Plaza Senayan', short: 'Dimas', hue: 200 },
  sekar: { id: 'sekar', name: 'Sekar Ayuningtyas', role: 'Client advisor, Plaza Senayan', short: 'Sekar', hue: 140, day: 4 },
  melati: { id: 'melati', name: 'Melati Kusuma', role: 'Senior client advisor', short: 'Melati', hue: 320 },
  bayu: { id: 'bayu', name: 'Bayu Saputra', role: 'Client advisor', short: 'Bayu', hue: 40 },
  intan: { id: 'intan', name: 'Intan Permatasari', role: 'Client advisor', short: 'Intan', hue: 260 },
  hendra: { id: 'hendra', name: 'Hendra Gunawan', role: 'Merchandise planner', short: 'Hendra', hue: 80 },
  yohana: { id: 'yohana', name: 'Yohana Sitompul', role: 'Boutique manager, Plaza Indonesia', short: 'Yohana', hue: 290 },
  rendra: { id: 'rendra', name: 'Rendra Wibisono', role: 'Boutique manager, Pacific Place', short: 'Rendra', hue: 170 },
  fitri: { id: 'fitri', name: 'Fitri Handayani', role: 'Boutique manager, Pondok Indah Mall', short: 'Fitri', hue: 60 },
  arief: { id: 'arief', name: 'Arief Nugroho', role: 'Boutique manager, Tunjungan Plaza', short: 'Arief', hue: 220 },
  kadek: { id: 'kadek', name: 'Kadek Ayu Lestari', role: 'Boutique manager, Seminyak', short: 'Kadek', hue: 100 },
  raka: { id: 'raka', name: 'Raka Pratama', role: 'Part-time advisor, Tunjungan Plaza', short: 'Raka', hue: 30 },
}

// The three people the brief names. The prototype can be viewed as each of them.
export const ROLES = [
  { id: 'owner', person: 'ratna', label: 'Owner', test: 'Understand the whole company from one interface' },
  { id: 'manager', person: 'dimas', label: 'Store manager', test: 'See immediately what matters' },
  { id: 'advisor', person: 'sekar', label: 'New advisor', test: 'Learn the system with little training' },
]

// ---------- boutiques ----------
// yesterday: Wednesday 28 October. plan and sales in IDR. conv: share of visitors who bought.
export const STORES = [
  { id: 'psn', name: 'Plaza Senayan', city: 'Jakarta', manager: 'dimas', sales: 612e6, plan: 540e6, conv: 0.21, usual: 0.19, floor: 5, staffed: 5, appts: 4 },
  { id: 'pi', name: 'Plaza Indonesia', city: 'Jakarta', manager: 'yohana', sales: 488e6, plan: 520e6, conv: 0.18, usual: 0.18, floor: 5, staffed: 5, appts: 3 },
  { id: 'pp', name: 'Pacific Place', city: 'Jakarta', manager: 'rendra', sales: 236e6, plan: 300e6, conv: 0.12, usual: 0.14, floor: 4, staffed: 4, appts: 1 },
  { id: 'pim', name: 'Pondok Indah Mall', city: 'Jakarta', manager: 'fitri', sales: 182e6, plan: 190e6, conv: 0.15, usual: 0.15, floor: 3, staffed: 3, appts: 1 },
  { id: 'tp', name: 'Tunjungan Plaza', city: 'Surabaya', manager: 'arief', sales: 148e6, plan: 215e6, conv: 0.09, usual: 0.17, floor: 2, staffed: 4, appts: 0 },
  { id: 'smy', name: 'Seminyak', city: 'Bali', manager: 'kadek', sales: 174e6, plan: 195e6, conv: 0.14, usual: 0.15, floor: 3, staffed: 3, appts: 2 },
]
export const DC = { id: 'dc', name: 'Cikarang DC', city: 'Bekasi' }
export const PLACES = [...STORES.map((s) => s.id), 'dc']
export const placeName = (id) => (id === 'dc' ? DC.name : STORES.find((s) => s.id === id)?.name)
export const storeOf = (id) => STORES.find((s) => s.id === id)

export const YESTERDAY = {
  sales: STORES.reduce((t, s) => t + s.sales, 0),
  plan: STORES.reduce((t, s) => t + s.plan, 0),
}
console.assert(YESTERDAY.sales === 1840e6 && YESTERDAY.plan === 1960e6, 'yesterday totals')

// ---------- October, day by day (group, IDR millions) ----------
// Plan by weekday shape; actual is the plan times what happened. 1 Oct 2026 is a Thursday.
const planFor = (d) => { const wd = new Date(2026, 9, d).getDay(); return wd === 6 ? 2350 : wd === 0 ? 2200 : wd === 5 ? 1850 : 1640 }
const FACTORS = [1.04, 0.97, 1.08, 1.02, 0.95, 0.99, 1.06, 1.01, 0.93, 1.1, 1.04, 0.96, 0.98, 1.03, 0.97, 0.92, 1.05, 0.99, 0.94, 1.0, 0.96, 1.02, 0.95, 1.07, 0.97, 0.91, 0.98]
export const OCTOBER = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1
  const plan = planFor(day) * 1e6
  if (day <= 27) return { day, plan, actual: Math.round(plan * FACTORS[i] / 1e6) * 1e6 }
  if (day === 28) return { day, plan, actual: YESTERDAY.sales }
  return { day, plan, forecast: { 29: 1650e6, 30: 1800e6, 31: 2250e6 }[day] }
})
// The plan for 28 October is the boutiques' plan, one fact in two places.
OCTOBER[27].plan = YESTERDAY.plan
export const MTD = {
  sales: OCTOBER.filter((d) => d.actual).reduce((t, d) => t + d.actual, 0),
  plan: OCTOBER.filter((d) => d.actual).reduce((t, d) => t + d.plan, 0),
  monthPlan: OCTOBER.reduce((t, d) => t + d.plan, 0),
}
MTD.landing = MTD.sales + OCTOBER.filter((d) => d.forecast).reduce((t, d) => t + d.forecast, 0)

export const SELL_THROUGH = { actual: 0.584, plan: 0.61 } // full-price, season to date
export const COVER_WEEKS = 14.2 // group stock cover at the current rate of sale

// Today so far (opened 10:00)
export const TODAY_SO_FAR = { sales: 31.6e6, transactions: 3, psn: { sales: 4.2e6, transactions: 1 } }

// ---------- products ----------
// stock: units at [psn, pi, pp, pim, tp, smy, dc]. weekly: group units sold, last 8 weeks, oldest first.
export const PRODUCTS = [
  { id: 'kirana-top-handle', name: 'Kirana top-handle', variant: 'Rosso calf', cat: 'Bags', price: 38.5e6, stock: [2, 3, 4, 1, 1, 1, 0], weekly: [3, 2, 4, 3, 4, 3, 5, 4], psnFour: 7, ppFive: 0, storeSold: [7, 4, 0, 2, 1, 2] },
  { id: 'sabda-tote', name: 'Sabda tote', variant: 'Cognac calf', cat: 'Bags', price: 29.8e6, stock: [4, 3, 2, 3, 2, 2, 12], weekly: [4, 5, 3, 4, 6, 4, 5, 5] },
  { id: 'laras-mini', name: 'Laras mini crossbody', variant: 'Cognac calf', cat: 'Bags', price: 18.9e6, stock: [3, 2, 2, 2, 1, 2, 6], weekly: [5, 4, 6, 5, 4, 6, 5, 6] },
  { id: 'senja-hobo', name: 'Senja hobo', variant: 'Nero calf', cat: 'Bags', price: 31.0e6, stock: [2, 1, 2, 1, 1, 5, 4], weekly: [2, 1, 2, 1, 2, 1, 1, 2], smyFive: 0, storeSold: [1, 4, 1, 0, 0, 0] },
  { id: 'arunika-structured', name: 'Arunika structured', variant: 'Slate box calf', cat: 'Bags', price: 52.0e6, stock: [1, 1, 0, 0, 0, 0, 0], weekly: [1, 0, 1, 1, 0, 1, 0, 1], inbound: 2, waitlist: 5 },
  { id: 'wening-weekender', name: 'Wening weekender', variant: 'Khaki canvas', cat: 'Bags', price: 24.5e6, stock: [2, 2, 1, 1, 1, 3, 4], weekly: [2, 3, 2, 2, 1, 2, 3, 2] },
  { id: 'lintang-barrel', name: 'Lintang barrel', variant: 'Tangerine calf', cat: 'Bags', price: 21.7e6, stock: [1, 2, 3, 1, 2, 1, 5], weekly: [2, 2, 1, 2, 3, 2, 2, 3] },
  { id: 'tirta-pump-nero', name: 'Tirta pump 105', variant: 'Nero patent', cat: 'Shoes', price: 14.9e6, stock: [5, 4, 3, 2, 2, 2, 0], weekly: [6, 5, 7, 6, 8, 7, 6, 7], broken: '37 and 38 sold out in 4 boutiques' },
  { id: 'tirta-pump-rosso', name: 'Tirta pump 105', variant: 'Rosso patent', cat: 'Shoes', price: 15.4e6, stock: [3, 3, 2, 2, 1, 1, 4], weekly: [3, 4, 3, 2, 4, 3, 3, 4] },
  { id: 'gending-sandal', name: 'Gending sandal', variant: 'Gold nappa', cat: 'Shoes', price: 13.2e6, stock: [2, 3, 2, 1, 1, 4, 6], weekly: [3, 2, 3, 2, 2, 3, 2, 3] },
  { id: 'bintang-pump', name: 'Bintang studded pump', variant: 'Argento', cat: 'Shoes', price: 17.6e6, stock: [2, 1, 1, 1, 1, 1, 3], weekly: [1, 2, 1, 1, 2, 1, 1, 2] },
  { id: 'aruna-boot', name: 'Aruna ankle boot', variant: 'Smoke suede', cat: 'Shoes', price: 16.8e6, stock: [3, 2, 2, 2, 3, 1, 8], weekly: [2, 3, 3, 4, 3, 4, 4, 5] },
  { id: 'malam-bootie', name: 'Malam bootie', variant: 'Nero patent', cat: 'Shoes', price: 15.9e6, stock: [2, 2, 1, 1, 1, 0, 4], weekly: [2, 1, 2, 2, 1, 2, 2, 1] },
  { id: 'envelope-wallet', name: 'Envelope wallet', variant: 'Tan calf', cat: 'Small leather', price: 8.4e6, stock: [4, 3, 3, 2, 2, 3, 10], weekly: [5, 6, 4, 5, 6, 5, 7, 6] },
  { id: 'card-holder', name: 'Card holder', variant: 'Cognac calf', cat: 'Small leather', price: 4.2e6, stock: [6, 5, 4, 4, 3, 4, 20], weekly: [9, 8, 11, 10, 9, 12, 10, 11] },
  { id: 'continental-wallet', name: 'Continental wallet', variant: 'Ostrich', cat: 'Small leather', price: 19.5e6, stock: [1, 2, 1, 1, 0, 1, 2], weekly: [1, 1, 0, 1, 1, 0, 1, 1] },
  { id: 'pearl-collar', name: 'Mutiara collar', variant: 'Three rows', cat: 'Jewellery', price: 46.0e6, stock: [1, 1, 0, 0, 0, 1, 1], weekly: [0, 1, 0, 0, 1, 0, 0, 1] },
  { id: 'riviera-necklace', name: 'Riviera necklace', variant: 'Citrine', cat: 'Jewellery', price: 88.0e6, stock: [1, 1, 0, 0, 0, 0, 0], weekly: [0, 0, 1, 0, 0, 0, 0, 0] },
  { id: 'pendant', name: 'Kecubung pendant', variant: 'Amethyst', cat: 'Jewellery', price: 27.5e6, stock: [1, 1, 1, 1, 0, 1, 2], weekly: [1, 0, 1, 1, 0, 1, 1, 0] },
  { id: 'tweed-jacket', name: 'Tweed jacket', variant: 'Blush', cat: 'Ready to wear', price: 34.0e6, stock: [3, 3, 2, 2, 1, 1, 6], weekly: [1, 2, 2, 3, 2, 3, 3, 4] },
  { id: 'officer-coat', name: 'Officer coat', variant: 'Olive wool', cat: 'Ready to wear', price: 39.5e6, stock: [2, 2, 1, 1, 1, 0, 5], weekly: [1, 1, 2, 1, 2, 2, 1, 2] },
  { id: 'slip-dress', name: 'Silk slip dress', variant: 'Blush', cat: 'Ready to wear', price: 22.0e6, stock: [2, 3, 2, 1, 1, 3, 4], weekly: [2, 2, 3, 2, 2, 3, 2, 2] },
  { id: 'plaid-scarf', name: 'Cashmere scarf', variant: 'Tartan', cat: 'Accessories', price: 9.8e6, stock: [3, 3, 2, 2, 2, 1, 8], weekly: [2, 3, 2, 4, 3, 4, 5, 5] },
  { id: 'field-watch', name: 'Field watch 40', variant: 'Steel', cat: 'Accessories', price: 42.0e6, stock: [1, 1, 1, 0, 1, 0, 2], weekly: [1, 0, 1, 1, 1, 0, 1, 1] },
]
export const productOf = (id) => PRODUCTS.find((p) => p.id === id)
export const units = (p) => p.stock.reduce((t, n) => t + n, 0)
export const rate = (p) => p.weekly.slice(-4).reduce((t, n) => t + n, 0) / 4 // units a week, last 4 weeks
// Units sold in the last 4 weeks per boutique; shares that always add up to the group's figure.
const SHARE = [0.32, 0.26, 0.12, 0.1, 0.08, 0.12]
export function soldByStore(p) {
  if (p.storeSold) return p.storeSold
  const total = p.weekly.slice(-4).reduce((t, n) => t + n, 0)
  const raw = SHARE.map((x) => x * total); const out = raw.map(Math.floor)
  let left = total - out.reduce((t, n) => t + n, 0)
  raw.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { out[i] += 1; left -= 1 } })
  return out
}
export const cover = (p) => (rate(p) ? units(p) / rate(p) : Infinity)

// ---------- clients ----------
export const CLIENTS = [
  { id: 'anindya', name: 'Anindya Paramitha', tier: 'Platinum', store: 'psn', advisor: 'melati', spend: 486e6, visits: 9, since: 2019, last: '12 Sep',
    sizes: 'Shoes 37, RTW 36', likes: 'Structured bags, rosso and slate, box calf, no logos', birthday: '14 Nov', contact: 'WhatsApp, mornings',
    owns: ['kirana-top-handle', 'tirta-pump-rosso', 'pearl-collar'], waitlist: { item: 'arunika-structured', since: '3 Aug' },
    note: 'Prefers a private viewing room. Brings her daughter on weekends.' },
  { id: 'citra', name: 'Citra Lesmana', tier: 'Platinum', store: 'pi', advisor: 'yohana', spend: 620e6, visits: 14, since: 2017, last: '21 Oct',
    sizes: 'Shoes 38, RTW 38', likes: 'Jewellery, slate and nero, minimal hardware', birthday: '2 Mar', contact: 'Phone call',
    owns: ['riviera-necklace', 'senja-hobo', 'officer-coat'], waitlist: { item: 'arunika-structured', since: '28 Jul' }, note: 'Buys for herself only, never gifts.' },
  { id: 'rizal', name: 'Rizal Mahendra', tier: 'Gold', store: 'psn', advisor: 'bayu', spend: 210e6, visits: 6, since: 2021, last: '30 Sep',
    sizes: 'Gifts for his wife: shoes 37', likes: 'Watches for himself; gifts for anniversaries', birthday: '9 Jan', contact: 'WhatsApp, evenings',
    owns: ['field-watch', 'pendant', 'laras-mini'], waitlist: { item: 'arunika-structured', since: '20 Aug', gift: 'Wedding anniversary, 18 December' }, note: 'Wants gift wrap and a handwritten card.' },
  { id: 'dewi', name: 'Dewi Anggraini', tier: 'Gold', store: 'psn', advisor: 'melati', spend: 175e6, visits: 7, since: 2020, last: '2 Oct',
    sizes: 'Shoes 36', likes: 'Shoes and small leather, tan and cognac', birthday: '27 Jun', contact: 'WhatsApp',
    owns: ['sabda-tote', 'envelope-wallet', 'gending-sandal'], waitlist: { item: 'arunika-structured', since: '9 Sep' }, note: '' },
  { id: 'kevin', name: 'Kevin Halim', tier: 'Gold', store: 'pp', advisor: 'rendra', spend: 158e6, visits: 5, since: 2022, last: '14 Oct',
    sizes: 'Gifts', likes: 'Gifts for his mother; asks for advice', birthday: '5 May', contact: 'WhatsApp',
    owns: ['pearl-collar', 'plaid-scarf'], waitlist: { item: 'arunika-structured', since: '1 Oct' }, note: 'Asked for an Arunika in nero if slate is not possible.' },
  { id: 'wulan', name: 'Wulan Sasmita', tier: 'Gold', store: 'psn', advisor: 'sekar', spend: 142e6, visits: 6, since: 2021, last: '27 Oct',
    sizes: 'Shoes 38', likes: 'Crossbody bags, cognac', birthday: '19 Feb', contact: 'WhatsApp',
    owns: ['card-holder', 'gending-sandal'], hold: { item: 'laras-mini', until: 'Today 17:00', placed: 'Tue 27 Oct, 15:10' }, note: 'Was Intan’s client; handed to Sekar on 26 Oct.' },
  { id: 'nadia', name: 'Nadia Prameswari', tier: 'Silver', store: 'psn', advisor: 'sekar', spend: 36e6, visits: 1, since: 2026, last: '15 Oct',
    sizes: 'RTW 34', likes: 'Bought the slip dress for a wedding', birthday: '-', contact: 'WhatsApp',
    owns: ['slip-dress'], note: 'First purchase. Thank-you note due two weeks after.' },
  { id: 'ayu', name: 'Ayu Wardhani', tier: 'Silver', store: 'psn', advisor: 'sekar', spend: 62e6, visits: 3, since: 2024, last: '20 Oct',
    sizes: 'RTW 36', likes: 'Coats and tailoring', birthday: '30 Aug', contact: 'WhatsApp',
    owns: ['officer-coat'], alteration: 'Officer coat hem taken up 3 cm, ready since Wed 28 Oct', note: '' },
]
export const clientOf = (id) => CLIENTS.find((c) => c.id === id)

// Plaza Senayan today: appointments and the floor.
export const APPOINTMENTS = [
  { time: '11:00', client: 'anindya', with: 'melati', also: 'sekar', what: 'Private viewing, new season bags', room: 'Viewing room' },
  { time: '13:30', client: 'rizal', with: 'bayu', what: 'Anniversary gift', room: 'Floor' },
  { time: '16:30', client: 'ayu', with: 'sekar', what: 'Alteration pick-up, officer coat', room: 'Floor', solo: true },
  { time: '18:00', client: 'dewi', with: 'melati', what: 'Shoes, new arrivals', room: 'Floor' },
]
export const ROSTER = [
  { who: 'dimas', from: '10:00', to: '19:00' }, { who: 'melati', from: '10:00', to: '19:00' }, { who: 'bayu', from: '10:00', to: '19:00' },
  { who: 'sekar', from: '10:00', to: '19:00', note: 'Day 4' }, { who: 'intan', from: '13:00', to: '22:00' },
]
console.assert(ROSTER.length === storeOf('psn').floor && APPOINTMENTS.length === storeOf('psn').appts, 'PSN roster and appointments')
