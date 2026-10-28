// Demo market data. Prices are simulated in the browser from a seeded random walk so the page
// moves like a live feed without calling any service. They are labelled as demo prices wherever
// they appear and must be replaced by the broker's real price feed.

export const INSTRUMENTS = [
  { id: 'XAUUSD', name: 'XAU/USD', long: 'Gold against the US dollar', kind: 'Metals', price: 3982.4, digits: 2, pip: 0.01, spread: 25, vol: 0.0011, unit: 'oz', lot: 100 },
  { id: 'EURUSD', name: 'EUR/USD', long: 'Euro against the US dollar', kind: 'Forex', price: 1.08421, digits: 5, pip: 0.0001, spread: 0.9, vol: 0.00035, unit: 'EUR', lot: 100000 },
  { id: 'GBPUSD', name: 'GBP/USD', long: 'Pound sterling against the US dollar', kind: 'Forex', price: 1.27164, digits: 5, pip: 0.0001, spread: 1.2, vol: 0.0004, unit: 'GBP', lot: 100000 },
  { id: 'USDJPY', name: 'USD/JPY', long: 'US dollar against the Japanese yen', kind: 'Forex', price: 151.326, digits: 3, pip: 0.01, spread: 1.1, vol: 0.00045, unit: 'USD', lot: 100000 },
  { id: 'AUDUSD', name: 'AUD/USD', long: 'Australian dollar against the US dollar', kind: 'Forex', price: 0.65873, digits: 5, pip: 0.0001, spread: 1.3, vol: 0.0005, unit: 'AUD', lot: 100000 },
  { id: 'XAGUSD', name: 'XAG/USD', long: 'Silver against the US dollar', kind: 'Metals', price: 47.618, digits: 3, pip: 0.001, spread: 30, vol: 0.0016, unit: 'oz', lot: 5000 },
  { id: 'BTCUSD', name: 'BTC/USD', long: 'Bitcoin against the US dollar', kind: 'Crypto', price: 68420.5, digits: 1, pip: 1, spread: 28, vol: 0.0022, unit: 'BTC', lot: 1 },
  { id: 'ETHUSD', name: 'ETH/USD', long: 'Ether against the US dollar', kind: 'Crypto', price: 2415.8, digits: 2, pip: 0.1, spread: 18, vol: 0.0026, unit: 'ETH', lot: 1 },
]
export const byId = Object.fromEntries(INSTRUMENTS.map((i) => [i.id, i]))

function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const seedOf = (id) => [...id].reduce((a, c) => a * 31 + c.charCodeAt(0), 7)

// A day of 5-minute closes ending at `end`, walking back from the instrument's reference price.
export function history(id, points = 288, stepMin = 5, end = Date.now()) {
  const ins = byId[id]
  const r = rng(seedOf(id) + Math.floor(end / 86400000))
  const out = []
  let p = ins.price
  for (let i = points - 1; i >= 0; i--) {
    out.unshift({ t: end - (points - 1 - i) * stepMin * 60000, p })
    p = p * (1 + (r() - 0.5) * ins.vol * 1.6 + (r() - 0.5) * ins.vol * 0.3)
  }
  return out.map((d, i) => ({ t: end - (points - 1 - i) * stepMin * 60000, p: d.p }))
}

// One tick: a small random move. The caller keeps the last price.
export function tick(id, last, r = Math.random) {
  const ins = byId[id]
  return last * (1 + (r() - 0.5) * ins.vol * 0.5)
}

export const fmt = (id, p) => p.toLocaleString('en-US', { minimumFractionDigits: byId[id].digits, maximumFractionDigits: byId[id].digits })
export const usd = (n, d = 2) => `${n < 0 ? '−' : ''}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}`
export const signedUsd = (n) => `${n > 0 ? '+' : n < 0 ? '−' : ''}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
export const spreadLabel = (ins) => (ins.kind === 'Forex' ? `${ins.spread} pips` : `${ins.spread} points`)
