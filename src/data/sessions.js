// The four trading sessions in UTC hours (winter hours; daylight saving shifts them by an hour,
// which a live build should take from the broker's own calendar). Forex trades Sunday 22:00 to
// Friday 22:00 UTC; crypto never closes.
export const SESSIONS = [
  { id: 'syd', city: 'Sydney', open: 22, close: 7, pairs: 'AUD/USD' },
  { id: 'tok', city: 'Tokyo', open: 0, close: 9, pairs: 'USD/JPY' },
  { id: 'lon', city: 'London', open: 8, close: 17, pairs: 'EUR/USD, GBP/USD, gold' },
  { id: 'nyc', city: 'New York', open: 13, close: 22, pairs: 'EUR/USD, gold' },
]

const inRange = (h, s) => (s.open < s.close ? h >= s.open && h < s.close : h >= s.open || h < s.close)

export function forexOpen(d) {
  const day = d.getUTCDay()
  const h = d.getUTCHours()
  if (day === 6) return false
  if (day === 0) return h >= 22
  if (day === 5) return h < 22
  return true
}

// What is open at this moment, and one plain sentence about it.
export function sessionNow(d = new Date()) {
  const h = d.getUTCHours() + d.getUTCMinutes() / 60
  const fx = forexOpen(d)
  const open = fx ? SESSIONS.filter((s) => inRange(h, s)) : []
  let line
  if (!fx) line = 'Forex and metals are closed for the weekend. Crypto keeps trading.'
  else if (open.some((s) => s.id === 'lon') && open.some((s) => s.id === 'nyc')) line = 'London and New York overlap now. This is usually the busiest stretch for EUR/USD and gold.'
  else if (open.some((s) => s.id === 'tok') && open.some((s) => s.id === 'syd')) line = 'Sydney and Tokyo are open. Yen and Aussie pairs lead the market.'
  else if (open.length) line = `${open.map((s) => s.city).join(' and ')} ${open.length > 1 ? 'are' : 'is'} open. Most traded here: ${open[open.length - 1].pairs}.`
  else line = 'Between sessions. Prices can move in thin trading.'
  const next = fx
    ? SESSIONS.map((s) => ({ s, wait: ((s.open - h + 24) % 24) || 24 })).filter((x) => !open.includes(x.s)).sort((a, b) => a.wait - b.wait)[0]
    : null
  return { open, line, fx, next, h }
}

export const hhmm = (h) => `${String(Math.floor(h) % 24).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`
