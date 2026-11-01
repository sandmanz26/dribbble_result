import { priceOf, clashOf, BRANDS, FORMATS, fmtDay, rp } from './data/studio.js'

// The offer checker's verdict: clash first, then the budget against the rate card.
export function ratesFrom(rates) { return Object.fromEntries(Object.entries(FORMATS).map(([k, f]) => [k, { ...f, rate: rates[k] ?? f.rate }])) }
export function verdictOf(o, rates) { return verdictFrom(o, priceOf(o, ratesFrom(rates))) }
export function verdictFrom(o, price) {
  const clash = clashOf(o.category, o.postBy)
  if (clash) return { tone: 'neg', short: `Clashes with ${BRANDS[clash.deal.brand].name}`, text: `${o.category} exclusivity with ${BRANDS[clash.deal.brand].name} runs until ${fmtDay(clash.until)}`, clash, price }
  if (o.budget == null) return { tone: '', short: 'No budget given', text: `Your rate for this is ${rp(price.total)}`, price }
  const diff = o.budget / price.total - 1
  const pct = Math.round(Math.abs(diff) * 100)
  if (diff <= -0.1) return { tone: 'warn', short: `${pct}% under your rate`, text: `${rp(price.total - o.budget)} under your rate card`, diff, price }
  if (diff < -0.005) return { tone: '', short: 'Close to your rate', text: `${pct}% under your rate card`, diff, price }
  if (diff <= 0.005) return { tone: 'pos', short: 'At your rate', text: 'Matches your rate card', diff, price }
  return { tone: 'pos', short: `${pct}% above your rate`, text: `${rp(o.budget - price.total)} above your rate card`, diff, price }
}
