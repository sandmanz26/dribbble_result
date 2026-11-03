// Shipping rules from kartenregal.ch/policies/shipping-policy (3 Nov 2026).
// 1-2 boosters: B-Post letter, CHF 2. 3-6: thick letter, CHF 4. Boxes or 7+ boosters: parcel, CHF 9.
// Single cards under CHF 50: letter in sleeve and toploader. Single cards from CHF 50: registered (price shown at checkout).
// Pickup in Wetzikon: free.

export const METHODS = {
  brief: { id: 'brief', name: 'B-Post Brief', price: 2, line: 'Gepolstertes Couvert' },
  dick: { id: 'dick', name: 'B-Post Brief, dick', price: 4, line: 'Gepolstertes Couvert, 3 bis 6 Booster' },
  paket: { id: 'paket', name: 'B-Post Paket', price: 9, line: 'Karton mit Polsterung' },
  pickup: { id: 'pickup', name: 'Abholung in Wetzikon', price: 0, line: 'Termin nach der Bestellung' },
}

// Works out the cheapest post option the rules allow for a basket.
export function postFor(lines) {
  const boosters = lines.filter((l) => l.p.kind === 'booster').reduce((t, l) => t + l.qty, 0)
  const boxes = lines.filter((l) => l.p.kind === 'box').reduce((t, l) => t + l.qty, 0)
  const singles = lines.filter((l) => l.p.kind === 'single')
  const singleValue = singles.reduce((t, l) => t + l.qty * l.p.price, 0)
  if (!lines.length) return null
  if (boxes > 0) return { ...METHODS.paket, why: 'Boxen gehen immer im Paket.' }
  if (boosters >= 7) return { ...METHODS.paket, why: 'Ab 7 Boostern passt es nicht mehr in den Brief.' }
  if (boosters >= 3) return { ...METHODS.dick, why: boosters < 6 ? `Noch ${6 - boosters} Booster passen in denselben Brief.` : 'Der Brief ist voll. Ein Booster mehr, und es wird ein Paket.' }
  if (singleValue >= 50) return { ...METHODS.brief, name: 'Einschreiben', price: null, why: 'Einzelkarten ab CHF 50 gehen eingeschrieben.' }
  if (boosters > 0) return { ...METHODS.brief, why: boosters === 1 ? 'Ein Booster mehr passt in denselben Brief.' : 'Ab dem dritten Booster wird es ein dicker Brief für CHF 4.' }
  return { ...METHODS.brief, why: 'Karten reisen in Sleeve und Toploader.' }
}

// Booster count for the envelope meter: 0 to 7, where 7 means parcel.
export function boosterLoad(lines) {
  return lines.filter((l) => l.p.kind === 'booster').reduce((t, l) => t + l.qty, 0)
}

// Working days: shipping within 3 working days of payment, B-Post usually within 3 more.
export function addWorkdays(date, n) {
  const d = new Date(date)
  let left = n
  while (left > 0) {
    d.setDate(d.getDate() + 1)
    const w = d.getDay()
    if (w !== 0 && w !== 6) left--
  }
  return d
}
export const fmtDate = (d) => d.toLocaleDateString('de-CH', { weekday: 'short', day: 'numeric', month: 'long' })
export function arrival(today = new Date()) {
  return { from: addWorkdays(today, 2), to: addWorkdays(today, 6) }
}
export function pickupReady(today = new Date()) {
  return { from: addWorkdays(today, 2), to: addWorkdays(today, 4) }
}
