// Prototype marker for the one taster question (9 marks, AO1 3 / AO2 2 / AO3 4).
// It stands in for the live AI marker so the route can be clicked through end to end.
// It reads the answer sentence by sentence, the way an examiner annotates a script:
// K = knowledge, APP = application to the extract, AN = a link in a chain of reasoning, ? = assertion.

import { QUESTION } from './taster.js'

const has = (s, re) => re.test(s)

const K = {
  definition: /(responsive|responsiveness|percentage change in (the )?quantity|% change in quantity|how much quantity demanded)/i,
  inelastic: /\b(price )?inelastic\b/i,
  reason: /(substitut|necessit|no (practical )?alternative|habit|need (it|petrol|to drive))/i,
  revenue: /(total (tax )?revenue|tax revenue|revenue)/i,
}
const APP = {
  figure: /(−|-)\s?0\.2|0\.2\b|−0\.6|-0\.6|53p|140p/i,
  context: /(driver|commut|drive to work|motorist|electric car|public transport|pump price|petrol station|households?)/i,
}
const CHAIN = /(therefore|this means|which means|as a result|so total|so the government|leads to|because|consequently|hence|this is because|so demand|so quantity)/i
const LESS = /(smaller percentage|by less|falls? (only )?(slightly|a little)|only a few|small(er)? fall|less than (the )?(price|proportion))/i

export function splitSentences(text) {
  // Split after . ! ? when a space and a new sentence follow, so −0.2 stays whole.
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z"'‘“(])/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function markAnswer(text) {
  const sentences = splitSentences(text)
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const found = { definition: false, inelastic: false, reason: false, revenue: false, figure: false, context: false }
  let chains = 0
  let lessLink = false

  const annotated = sentences.map((s) => {
    const codes = []
    const kHit = ['definition', 'inelastic', 'reason'].filter((k) => has(s, K[k]))
    kHit.forEach((k) => (found[k] = true))
    if (has(s, K.revenue)) found.revenue = true
    if (kHit.length) codes.push('K')
    const appHit = ['figure', 'context'].filter((k) => has(s, APP[k]))
    appHit.forEach((k) => (found[k] = true))
    if (appHit.length) codes.push('APP')
    if (has(s, CHAIN) && (has(s, K.revenue) || /quantity|demand|price|buy|sales|litre|money|tax/i.test(s))) {
      chains += 1
      codes.push('AN')
    }
    if (has(s, LESS)) lessLink = true
    if (!codes.length) codes.push('?')
    return { text: s, codes }
  })

  const ao1 = Math.min(3, Number(found.definition) + Number(found.inelastic) + Number(found.reason))
  const ao2 = Math.min(2, Number(found.figure) + Number(found.context))
  let ao3 = Math.min(3, chains)
  if (lessLink && found.revenue) ao3 = Math.min(4, ao3 + 1)
  if (words < 40) ao3 = Math.min(ao3, 1)

  const total = ao1 + ao2 + ao3
  const level = total >= 7 ? 3 : total >= 4 ? 2 : total >= 1 ? 1 : 0

  const aos = [
    { id: 'AO1', name: 'Knowledge', mark: ao1, max: 3 },
    { id: 'AO2', name: 'Application', mark: ao2, max: 2 },
    { id: 'AO3', name: 'Analysis', mark: ao3, max: 4 },
  ]

  const comments = []
  if (!found.definition) comments.push({ ao: 'AO1', text: 'Define PED in your first sentence: how responsive quantity demanded is to a change in price.' })
  if (!found.inelastic) comments.push({ ao: 'AO1', text: 'Name the idea the question rests on: demand for petrol is price inelastic.' })
  if (!found.reason) comments.push({ ao: 'AO1', text: 'Say why it is inelastic, for example no close substitute in the short run.' })
  if (!found.figure) comments.push({ ao: 'AO2', text: 'Quote the figure from Extract A (about −0.2) and say what it tells you.' })
  if (!found.context) comments.push({ ao: 'AO2', text: 'Bring in the drivers in the extract, such as workers who have to commute.' })
  if (!lessLink) comments.push({ ao: 'AO3', text: 'Say that quantity falls by a smaller percentage than the price rises. That is the link that earns Level 3.' })
  if (chains < 3) comments.push({ ao: 'AO3', text: 'Finish the chain: higher duty per litre, only a few litres lost, so total revenue rises.' })

  const strengths = []
  if (found.definition) strengths.push('Accurate definition of PED.')
  if (found.figure) strengths.push('Uses the figure from Extract A.')
  if (lessLink) strengths.push('Explains that quantity falls by less than price rises.')
  if (chains >= 3) strengths.push('A developed chain from price to revenue.')
  if (!strengths.length && found.revenue) strengths.push('You know the government gains revenue: now explain why.')

  // The one next step: the AO with the largest share of marks still missing.
  const gap = [...aos].sort((a, b) => b.max - b.mark - (a.max - a.mark))[0]
  const next = comments.find((c) => c.ao === gap.id) || comments[0] || null

  const lv = QUESTION.levels.find((l) => l.level === level)
  return {
    total,
    max: QUESTION.marks,
    level,
    levelText: lv ? lv.text : 'No creditworthy material yet.',
    aos,
    annotated,
    comments,
    strengths,
    next,
    words,
  }
}

// Self-check: the three sample answers must land in three different levels.
export function selfCheck(samples) {
  const r = Object.fromEntries(Object.entries(samples).map(([k, v]) => [k, markAnswer(v.text)]))
  console.assert(r.weak.level === 1, 'weak sample should be Level 1', r.weak)
  console.assert(r.middle.level === 2, 'middle sample should be Level 2', r.middle)
  console.assert(r.strong.level === 3, 'strong sample should be Level 3', r.strong)
  return r
}
