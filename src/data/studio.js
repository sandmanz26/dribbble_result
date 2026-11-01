// Sample data for Riuh Studio. Every person, brand, amount and date is a placeholder.
// Totals are computed from the rows below; nothing is typed in twice.

export const NOW = new Date('2026-11-03T09:30:00+07:00') // demo clock: Tuesday morning in Jakarta
export const day = (s) => new Date(`${s}T12:00:00+07:00`)
export const daysBetween = (a, b) => Math.round((day(b) - day(a)) / 86400000)
export const TODAY = '2026-11-03'

export const AGENCY = { name: 'Riuh Talent', city: 'Jakarta', commission: 0.2 }
export const TAX = { name: 'PPh 23', rate: 0.02, note: 'Withheld by the brand when Riuh invoices. Sample assumption: confirm the rate with your tax adviser.' }

export const CREATOR = {
  name: 'Kirana Larasati', handle: '@makankira', niche: 'Food and street eats', city: 'Jakarta Selatan',
  manager: 'Bima Prasetyo', hue: 330,
  platforms: [
    { key: 'tiktok', name: 'TikTok', followers: 412300, avgViews: 186000, er: 6.1 },
    { key: 'instagram', name: 'Instagram', followers: 186900, avgViews: 74000, er: 3.4 },
    { key: 'youtube', name: 'YouTube', followers: 58200, avgViews: 21000, er: 4.2 },
  ],
  audience: {
    gender: [['Women', 64], ['Men', 36]],
    age: [['13-17', 6], ['18-24', 38], ['25-34', 41], ['35-44', 11], ['45+', 4]],
    cities: [['Jakarta', 31], ['Surabaya', 9], ['Bandung', 8], ['Medan', 5], ['Makassar', 4]],
  },
}
console.assert(CREATOR.audience.age.reduce((s, [, v]) => s + v, 0) === 100, 'age bands add up')
console.assert(CREATOR.audience.gender.reduce((s, [, v]) => s + v, 0) === 100, 'gender adds up')

export const ROSTER = [
  { name: 'Kirana Larasati', handle: '@makankira', niche: 'Food', hue: 330, me: true },
  { name: 'Dimas Arya', handle: '@dimasngoprek', niche: 'Tech', hue: 205 },
  { name: 'Sekar Ayu', handle: '@sekarglow', niche: 'Beauty', hue: 20 },
  { name: 'Raka Wibisono', handle: '@rakajalan', niche: 'Travel', hue: 150 },
]

// Rate card in rupiah. Add-ons are a share of the deliverable fee they apply to.
export const FORMATS = {
  'tt-video': { name: 'TikTok video', short: 'TikTok', rate: 18000000 },
  'ig-reel': { name: 'Instagram Reel', short: 'Reel', rate: 12000000 },
  'ig-stories': { name: 'Instagram Stories, 3 frames', short: 'Stories', rate: 4500000 },
  'yt-integration': { name: 'YouTube integration, 60 s', short: 'YouTube 60 s', rate: 15000000 },
  'yt-dedicated': { name: 'YouTube dedicated video', short: 'YouTube video', rate: 35000000 },
  'tt-live': { name: 'TikTok Live, 2 hours', short: 'Live', rate: 10000000 },
}
export const ADDONS = {
  usage: { name: 'Paid ads usage', unit: 'per 3 months', pct: 0.3 },
  exclusivity: { name: 'Category exclusivity', unit: 'per month', pct: 0.15 },
  whitelisting: { name: 'Whitelisting (partnership ads)', unit: 'flat', pct: 0.4 },
}

export const STAGES = [
  { key: 'negotiating', name: 'Negotiating', hint: 'Price and terms' },
  { key: 'contracted', name: 'Contracted', hint: 'Signed, waiting for deposit or brief' },
  { key: 'production', name: 'In production', hint: 'Script, draft, revisions' },
  { key: 'posted', name: 'Posted', hint: 'Insight and final payment' },
  { key: 'paid', name: 'Paid', hint: 'Done' },
]

export const BRANDS = {
  serasa: { name: 'Kopi Serasa', category: 'Coffee', hue: 28, pic: 'Anindya Putri', role: 'Brand manager', channel: 'Email', lastContact: '2026-11-02', next: 'Draft 1 review on 4 Nov' },
  lumbung: { name: 'Lumbung Pay', category: 'Fintech', hue: 205, pic: 'Reza Mahendra', role: 'Marketing lead', channel: 'Email', lastContact: '2026-10-29', next: 'Chase the final payment' },
  dapur: { name: 'Dapur Nusa', category: 'Cookware', hue: 12, pic: 'Maya Kusuma', role: 'Social media lead', channel: 'WhatsApp', lastContact: '2026-10-31', next: 'Brief call on 5 Nov' },
  juwita: { name: 'Sambal Juwita', category: 'Condiments', hue: 0, pic: 'Teguh Santoso', role: 'Founder', channel: 'WhatsApp', lastContact: '2026-11-01', next: 'Waiting on our counter' },
  temanjalan: { name: 'Teman Jalan', category: 'Travel app', hue: 175, pic: 'Clarissa Wijaya', role: 'Partnerships', channel: 'Email', lastContact: '2026-10-27', next: 'Their legal is reviewing usage' },
  lajur: { name: 'Mie Lajur', category: 'Noodles', hue: 45, pic: 'Fajar Nugroho', role: 'Marketing manager', channel: 'Email', lastContact: '2026-10-19', next: 'Ask about a Ramadan series' },
  susupagi: { name: 'Susu Pagi', category: 'Dairy', hue: 210, pic: 'Dewi Lestari', role: 'Brand executive', channel: 'Email', lastContact: '2026-10-30', next: 'Send insight by 4 Nov' },
  rotikala: { name: 'Roti Kala', category: 'Bakery', hue: 35, pic: 'Hendra Gunawan', role: 'Owner', channel: 'WhatsApp', lastContact: '2026-09-28', next: '-' },
  tehseduh: { name: 'Teh Seduh Kita', category: 'Tea', hue: 95, pic: 'Sinta Rahayu', role: 'Digital marketing', channel: 'Email', lastContact: '2026-11-02', next: 'Post goes live today 18:00' },
}

// Deliverable steps: script, draft, post, insight. A step has a due date and, when done, a done date.
const D = (fmt, steps, thumb) => ({ fmt, steps, thumb })
export const DEALS = [
  { id: 'RT-2611', brand: 'serasa', title: 'Pagi Serasa launch', stage: 'production', fee: 70000000, thumb: 'latte-cat',
    deliverables: [
      D('tt-video', { script: ['2026-10-28', '2026-10-27'], draft: ['2026-11-04'], post: ['2026-11-10'], insight: ['2026-11-17'] }, 'latte-cat'),
      D('tt-video', { script: ['2026-10-28', '2026-10-27'], draft: ['2026-11-11'], post: ['2026-11-17'], insight: ['2026-11-24'] }, 'latte-daun'),
      D('ig-reel', { script: ['2026-10-28', '2026-10-28'], draft: ['2026-11-06'], post: ['2026-11-12'], insight: ['2026-11-19'] }, 'latte-daun'),
      D('ig-stories', { draft: ['2026-11-06'], post: ['2026-11-12'], insight: ['2026-11-19'] }, 'latte-cat'),
    ],
    usage: 3, exclusivity: { category: 'Coffee', until: '2026-12-15' }, whitelisting: false, revisions: 2,
    payments: [{ label: 'Deposit (DP) 50%', share: 0.5, due: '2026-10-20', paid: '2026-10-20' }, { label: 'Final 50%', share: 0.5, due: '2026-12-01', after: 'last insight' }],
    note: 'Brand wants the oat milk shown in the first 3 seconds. Two revision rounds included.' },
  { id: 'RT-2588', brand: 'lumbung', title: 'Bayar tagihan in one tap', stage: 'posted', fee: 22000000, thumb: 'nasi-daun-pisang',
    deliverables: [D('tt-video', { script: ['2026-10-08', '2026-10-07'], draft: ['2026-10-14', '2026-10-13'], post: ['2026-10-15', '2026-10-15'], insight: ['2026-10-20', '2026-10-20'] }, 'nasi-daun-pisang')],
    usage: 0, exclusivity: { category: 'Fintech', until: '2026-11-30' }, whitelisting: false, revisions: 1,
    payments: [{ label: 'Deposit (DP) 50%', share: 0.5, due: '2026-10-02', paid: '2026-10-02' }, { label: 'Final 50%', share: 0.5, due: '2026-10-27' }],
    note: 'Final payment was due 7 days after the insight. Reza says finance is on it.' },
  { id: 'RT-2620', brand: 'dapur', title: 'Wajan anti lengket, 30 days', stage: 'contracted', fee: 27000000, thumb: 'nasi-goreng-udang',
    deliverables: [
      D('yt-integration', { script: ['2026-11-12'], draft: ['2026-11-19'], post: ['2026-11-26'], insight: ['2026-12-03'] }, 'nasi-goreng-udang'),
      D('ig-reel', { script: ['2026-11-12'], draft: ['2026-11-19'], post: ['2026-11-27'], insight: ['2026-12-04'] }, 'nasi-goreng-hijau'),
    ],
    usage: 0, exclusivity: null, whitelisting: false, revisions: 2,
    payments: [{ label: 'Deposit (DP) 50%', share: 0.5, due: '2026-11-07' }, { label: 'Final 50%', share: 0.5, due: '2026-12-18', after: 'last insight' }],
    note: 'Contract signed 30 Oct. Deposit invoice sent 31 Oct.' },
  { id: 'RT-2627', brand: 'juwita', title: 'Pedasnya sampai Medan', stage: 'negotiating', fee: 26500000, thumb: 'cabai-merah',
    deliverables: [D('tt-live', { post: ['2026-11-21'] }, 'cabai-merah'), D('tt-video', { script: ['2026-11-14'], draft: ['2026-11-18'], post: ['2026-11-22'], insight: ['2026-11-29'] }, 'mie-pedas')],
    usage: 0, exclusivity: null, whitelisting: false, revisions: 1,
    payments: [{ label: 'Deposit (DP) 50%', share: 0.5, due: '2026-11-14' }, { label: 'Final 50%', share: 0.5, due: '2026-12-06' }],
    note: 'They offered Rp 20,000,000. Bima countered at Rp 26,500,000 on 1 Nov.' },
  { id: 'RT-2630', brand: 'temanjalan', title: 'Makan-makan di Makassar', stage: 'negotiating', fee: 38000000, thumb: 'laksa',
    deliverables: [D('yt-dedicated', { script: ['2026-11-25'], draft: ['2026-12-05'], post: ['2026-12-12'], insight: ['2026-12-19'] }, 'laksa')],
    usage: 3, exclusivity: null, whitelisting: false, revisions: 2,
    payments: [{ label: 'Deposit (DP) 50%', share: 0.5, due: '2026-11-20' }, { label: 'Final 50%', share: 0.5, due: '2027-01-02' }],
    note: 'Flights and hotel on them. Their legal wants 6 months of usage; we offered 3.' },
  { id: 'RT-2601', brand: 'tehseduh', title: 'Teh sore, cerita sore', stage: 'production', fee: 30000000, thumb: 'es-campur',
    deliverables: [
      D('tt-video', { script: ['2026-10-22', '2026-10-21'], draft: ['2026-10-29', '2026-10-29'], post: ['2026-11-03'], insight: ['2026-11-10'] }, 'es-campur'),
      D('ig-reel', { script: ['2026-10-22', '2026-10-22'], draft: ['2026-10-29', '2026-10-30'], post: ['2026-11-05'], insight: ['2026-11-12'] }, 'es-campur'),
    ],
    usage: 0, exclusivity: null, whitelisting: false, revisions: 1,
    payments: [{ label: 'Deposit (DP) 50%', share: 0.5, due: '2026-10-21', paid: '2026-10-23' }, { label: 'Final 50%', share: 0.5, due: '2026-11-26', after: 'last insight' }],
    note: 'TikTok goes live today at 18:00. Caption and tags approved.' },
  { id: 'RT-2594', brand: 'susupagi', title: 'Sarapan 5 menit', stage: 'posted', fee: 24000000, thumb: 'wafel-stroberi',
    deliverables: [
      D('ig-reel', { script: ['2026-10-12', '2026-10-12'], draft: ['2026-10-19', '2026-10-19'], post: ['2026-10-28', '2026-10-28'], insight: ['2026-11-04'] }, 'wafel-stroberi'),
      D('ig-reel', { script: ['2026-10-12', '2026-10-12'], draft: ['2026-10-19', '2026-10-20'], post: ['2026-10-30', '2026-10-30'], insight: ['2026-11-04'] }, 'wafel-stroberi'),
    ],
    usage: 0, exclusivity: null, whitelisting: false, revisions: 1,
    payments: [{ label: 'Deposit (DP) 50%', share: 0.5, due: '2026-10-09', paid: '2026-10-09' }, { label: 'Final 50%', share: 0.5, due: '2026-11-11', after: 'insight' }],
    note: 'Insight for both Reels due tomorrow. Final payment 7 days after.' },
  { id: 'RT-2552', brand: 'lajur', title: 'Mie malam, Jakarta', stage: 'paid', fee: 22500000, thumb: 'mie-kuah',
    deliverables: [D('tt-video', { script: ['2026-09-18', '2026-09-18'], draft: ['2026-09-25', '2026-09-24'], post: ['2026-10-01', '2026-10-01'], insight: ['2026-10-08', '2026-10-07'] }, 'mie-kuah'), D('ig-stories', { post: ['2026-10-01', '2026-10-01'] }, 'mie-kacang')],
    usage: 0, exclusivity: null, whitelisting: false, revisions: 1,
    payments: [{ label: 'Deposit (DP) 50%', share: 0.5, due: '2026-09-15', paid: '2026-09-16' }, { label: 'Final 50%', share: 0.5, due: '2026-10-15', paid: '2026-10-14' }],
    note: '' },
  { id: 'RT-2531', brand: 'rotikala', title: 'Roti sobek pagi', stage: 'paid', fee: 17000000, thumb: 'wafel-stroberi',
    deliverables: [D('tt-video', { script: ['2026-09-02', '2026-09-02'], draft: ['2026-09-08', '2026-09-08'], post: ['2026-09-12', '2026-09-12'], insight: ['2026-09-19', '2026-09-18'] }, 'wafel-stroberi')],
    usage: 0, exclusivity: null, whitelisting: false, revisions: 1,
    payments: [{ label: 'Full payment', share: 1, due: '2026-09-26', paid: '2026-09-28' }],
    note: '' },
]

// Earlier brand payments (deals closed before this list starts), for the money history.
export const PAST_BRAND_PAYMENTS = [
  { brand: 'Kedai Bakso Pak Jo', paid: '2026-06-12', gross: 14000000 },
  { brand: 'Warung Nasi Mbok Darmi', paid: '2026-06-26', gross: 9000000 },
  { brand: 'Kopi Serasa', paid: '2026-07-08', gross: 30000000 },
  { brand: 'Es Teh Senja', paid: '2026-07-30', gross: 12000000 },
  { brand: 'Sambal Juwita', paid: '2026-08-14', gross: 18000000 },
  { brand: 'Dapur Nusa', paid: '2026-08-29', gross: 21000000 },
  { brand: 'Teman Jalan', paid: '2026-09-05', gross: 26000000 },
]

// Monthly platform income, already net of platform fees, in rupiah. Not commissioned by Riuh.
export const MONTHS = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11']
export const PLATFORM_INCOME = {
  affiliate: { name: 'TikTok Shop affiliate', values: [6200000, 7900000, 9400000, 8100000, 11300000, 900000] },
  adsense: { name: 'YouTube ads', values: [3100000, 2800000, 3400000, 3000000, 3600000, 0] },
  rewards: { name: 'TikTok creator rewards', values: [1400000, 1900000, 2200000, 1600000, 2400000, 0] },
  live: { name: 'Live gifts', values: [600000, 400000, 900000, 700000, 1100000, 250000] },
}

export const OFFERS = [
  { id: 'OF-118', brand: 'Bumbu Ibu Sari', category: 'Spices', hue: 18, from: 'Lukas Halim, brand manager', channel: 'Email', received: '2026-11-03T08:12', budget: 15000000,
    asks: [['tt-video', 1]], usage: 3, exclusivityMonths: 0, whitelisting: false, postBy: '2026-11-28',
    message: 'Hi Kirana! We love your nasi goreng series. One TikTok with our new bumbu instan, and we would like to run it as an ad for 3 months. Budget Rp 15 juta.' },
  { id: 'OF-117', brand: 'Kopi Pagiku', category: 'Coffee', hue: 25, from: 'Nadine Kurnia, marketing', channel: 'Instagram DM', received: '2026-11-02T21:40', budget: 18000000,
    asks: [['ig-reel', 1], ['ig-stories', 1]], usage: 0, exclusivityMonths: 0, whitelisting: false, postBy: '2026-12-01',
    message: 'Halo kak! Reel plus stories for our December menu, posting around 1 Dec. Budget 18 juta, can we talk?' },
  { id: 'OF-116', brand: 'Antar Cepat', category: 'Delivery app', hue: 140, from: 'Yosef Tanjung, partnerships', channel: 'Riuh inbox', received: '2026-11-02T14:05', budget: 45000000,
    asks: [['yt-integration', 1], ['tt-video', 1]], usage: 0, exclusivityMonths: 0, whitelisting: true, postBy: '2026-12-10',
    message: 'We are planning a year-end food delivery push. One YouTube integration and one TikTok we can boost from your handle. Rp 45 million.' },
  { id: 'OF-115', brand: 'Dapur Mama Lia', category: 'Catering', hue: 330, from: 'Lia Hartono, owner', channel: 'WhatsApp', received: '2026-11-01T10:20', budget: 10000000,
    asks: [['tt-live', 1]], usage: 0, exclusivityMonths: 0, whitelisting: false, postBy: '2026-11-20',
    message: 'Mau live 2 jam cobain menu katering kami? Budget 10 juta.' },
  { id: 'OF-114', brand: 'Toko Kue Sinar', category: 'Bakery', hue: 40, from: 'Rina Sinarto, owner', channel: 'Email', received: '2026-10-31T16:48', budget: null,
    asks: [['tt-video', 1]], usage: 0, exclusivityMonths: 0, whitelisting: false, postBy: null,
    message: 'Could you send your rate card? We are thinking of one TikTok for our anniversary in January.' },
]

/* ---------- money helpers ---------- */
export const rp = (v) => (v == null ? '-' : `Rp${Math.round(v).toLocaleString('en-US')}`)
export const rpShort = (v) => (v >= 1e6 ? `Rp${(v / 1e6).toLocaleString('en-US', { maximumFractionDigits: 1 })}M` : rp(v))
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const fmtDay = (s) => { const d = day(s); return `${d.getDate()} ${MON[d.getMonth()]}` }
export const fmtMonth = (m) => MON[Number(m.slice(5, 7)) - 1]
export const relDay = (s) => { const n = daysBetween(TODAY, s); return n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n === -1 ? 'Yesterday' : n > 1 && n < 7 ? `In ${n} days` : n < 0 ? `${-n} days ago` : fmtDay(s) }

// One payment's trail: what the brand pays, what is withheld, Riuh's cut, what lands with the creator.
export function trail(gross) {
  const tax = Math.round(gross * TAX.rate)
  const cut = Math.round(gross * AGENCY.commission)
  return { gross, tax, cut, net: gross - tax - cut }
}
export const brandOf = (k) => BRANDS[k]
export const dealOf = (id) => DEALS.find((d) => d.id === id)
export function paymentsOf(d) {
  return d.payments.map((p) => {
    const t = trail(Math.round(d.fee * p.share))
    const state = p.paid ? 'paid' : daysBetween(p.due, TODAY) > 0 ? 'late' : 'due'
    return { ...p, ...t, deal: d, state, lateBy: state === 'late' ? daysBetween(p.due, TODAY) : 0 }
  })
}
DEALS.forEach((d) => console.assert(Math.abs(d.payments.reduce((s, p) => s + p.share, 0) - 1) < 1e-9, `${d.id} payment shares add to 100%`))

export const ALL_PAYMENTS = DEALS.flatMap(paymentsOf)
export const OPEN_PAYMENTS = ALL_PAYMENTS.filter((p) => p.state !== 'paid').sort((a, b) => day(a.due) - day(b.due))

// Steps across all deals, for Today and the calendar.
const STEP_NAMES = { script: 'Script', draft: 'Draft', post: 'Post', insight: 'Insight' }
export const STEPS = DEALS.flatMap((d) => d.deliverables.flatMap((dl, i) => Object.entries(dl.steps).map(([k, [due, done]]) => ({
  key: `${d.id}-${i}-${k}`, deal: d, deliverable: dl, kind: k, name: STEP_NAMES[k], due, done: done || null, fmt: FORMATS[dl.fmt],
}))))

// Rate card pricing for a set of asks, used by the offer checker and the media kit.
export function priceOf({ asks, usage = 0, exclusivityMonths = 0, whitelisting = false }, rates = FORMATS) {
  const base = asks.reduce((s, [f, n]) => s + rates[f].rate * n, 0)
  const lines = asks.map(([f, n]) => ({ label: `${n} × ${rates[f].name}`, amount: rates[f].rate * n }))
  if (usage) lines.push({ label: `Paid ads usage, ${usage} months`, amount: Math.round(base * ADDONS.usage.pct * (usage / 3)) })
  if (exclusivityMonths) lines.push({ label: `Exclusivity, ${exclusivityMonths} months`, amount: Math.round(base * ADDONS.exclusivity.pct * exclusivityMonths) })
  if (whitelisting) {
    const ttBase = asks.filter(([f]) => f.startsWith('tt-') || f.startsWith('ig-')).reduce((s, [f, n]) => s + rates[f].rate * n, 0)
    lines.push({ label: 'Whitelisting on short videos', amount: Math.round(ttBase * ADDONS.whitelisting.pct) })
  }
  return { lines, total: lines.reduce((s, l) => s + l.amount, 0) }
}

// Exclusivity windows that are running on a date.
export const EXCLUSIVE = DEALS.filter((d) => d.exclusivity).map((d) => ({ deal: d, category: d.exclusivity.category, from: d.payments[0].paid || d.payments[0].due, until: d.exclusivity.until }))
export const clashOf = (category, date) => EXCLUSIVE.find((x) => x.category === category && date && day(date) <= day(x.until))

/* ---------- money by month ---------- */
export function cashByMonth() {
  return MONTHS.map((m, i) => {
    const brandGross = ALL_PAYMENTS.filter((p) => p.paid && p.paid.startsWith(m)).reduce((s, p) => s + p.gross, 0)
      + PAST_BRAND_PAYMENTS.filter((p) => p.paid.startsWith(m)).reduce((s, p) => s + p.gross, 0)
    const brand = trail(brandGross)
    const platform = Object.values(PLATFORM_INCOME).reduce((s, x) => s + x.values[i], 0)
    return { month: m, brandGross, brandNet: brand.net, tax: brand.tax, cut: brand.cut, platform, takeHome: brand.net + platform }
  })
}
const cm = cashByMonth()
cm.forEach((r) => console.assert(r.takeHome === r.brandGross - r.tax - r.cut + r.platform, `${r.month} take-home adds up`))
