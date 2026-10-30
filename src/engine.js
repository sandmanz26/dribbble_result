// A stand-in for the router, so the prototype behaves like the product: attention looks for a habit, then for
// memories, and only thinks it through when nothing familiar is good enough. Answers are canned sample text.
import { HABITS, PROPOSALS, MEMORY, BUDGETS } from './data/myelin.js'

const HABIT_KEYS = {
  'H-01': /sales summary|weekly sales|monday report/i,
  'H-02': /refund|damaged|broken on arrival/i,
  'H-03': /translate|german|deutsch/i,
  'H-04': /where is (my|the) order|order status|#\d{5}/i,
  'P-07': /supplier.*(delay|late)|delay.*supplier|lindgren|shipment.*(late|delay)/i,
  'P-08': /return reasons?|why.*returns|returns? (by|breakdown)/i,
}
const MEMORY_KEYS = [
  [/oak|lindgren|timber/i, ['F-02', 'F-05', 'F-09'], 0.86],
  [/fjord|sofa|moss|sand|slate/i, ['F-03'], 0.84],
  [/andersen/i, ['E-18'], 0.66],
  [/return|refund/i, ['F-11', 'F-07'], 0.8],
  [/ash (dining )?table|launch/i, ['F-05', 'E-18'], 0.78],
  [/warehouse|rotterdam|stock/i, ['F-02', 'E-24'], 0.82],
]
const ANSWERS = {
  'H-01': 'Week 44: 312 orders, €184,920 (+6% on week 43). Best seller: Ash dining table (48). Slowest: Linnea lamp (3). Returns 3.4%.',
  'H-02': 'Full refund or a free replacement, the customer chooses. Photos within 14 days of delivery; no return needed for structural damage.',
  'H-03': 'Übersetzung im Hausstil, Maße in cm, Glossar mit 140 Möbelbegriffen angewendet.',
  'H-04': 'Order 40218 left Rotterdam yesterday at 17:40 and is with the carrier. Expected Monday 2 November, between 09:00 and 13:00.',
  'P-07': 'Hi Erik, thanks for letting us know. The new date works if the boards land in Rotterdam by 20 November; after that we would move the Ash table launch. Could you confirm in writing? Best, Maya',
  'P-08': 'October returns by reason: colour 38%, size 21%, damage 17%, late 9%, other 15%. Fjord sofa in Moss is over 3% (colour).',
}

export function route(text, { budget = 'balanced', approved = [], force = false } = {}) {
  const threshold = BUDGETS[budget].threshold
  const habits = [...HABITS.map((h) => h.id), ...approved]
  if (!force) {
    for (const [id, re] of Object.entries(HABIT_KEYS)) {
      if (re.test(text) && habits.includes(id)) {
        const name = HABITS.find((h) => h.id === id)?.name || PROPOSALS.find((p) => p.id === id)?.name
        return { path: 'reflex', habit: id, conf: 0.95, time: 0.08, cost: 0.00003, base: 0.06, used: [id], answer: ANSWERS[id], why: `Matched the habit "${name}". Replayed without calling a model.` }
      }
    }
    for (const [re, used, conf] of MEMORY_KEYS) {
      if (re.test(text)) {
        if (conf >= threshold) return { path: 'recall', conf, time: 1.1, cost: 0.0009, base: 0.062, used, answer: recallAnswer(used), why: `Found ${used.length} ${used.length === 1 ? 'memory' : 'memories'} that cover this, ${Math.round(conf * 100)}% sure, over your ${Math.round(threshold * 100)}% threshold.` }
        return { path: 'reason', escalated: true, conf, time: 1.1 + 15.6, cost: 0.0009 + 0.058, base: 0.059, used, answer: reasonAnswer(text, used), why: `Recall found related memories but was only ${Math.round(conf * 100)}% sure, under your ${Math.round(threshold * 100)}% threshold, so it thought it through.` }
      }
    }
  }
  return { path: 'reason', conf: 0.86, time: 21.4, cost: 0.074, base: 0.074, used: [], answer: reasonAnswer(text, []), why: force ? 'You asked it to think this through.' : 'Nothing like this in habits or memory, so it reasoned from scratch.' }
}

function recallAnswer(used) {
  const m = MEMORY.filter((x) => used.includes(x.id))
  return `From what we know: ${m.map((x) => x.text.replace(/\.$/, '')).join('. ')}.`
}
function reasonAnswer(text) {
  if (/job post|hiring|coordinator/i.test(text)) return 'Warehouse coordinator, Rotterdam. You will run inbound oak and fabric deliveries, keep stock counts honest and get 300 orders a week out the door. Full time, Monday to Friday, 08:00 to 16:30. You have run a small warehouse or a busy stockroom, you like a clean spreadsheet, and you can lift 25 kg. Apply with a short note about the last process you fixed.'
  return 'Here is a considered answer. It weighs what Fernwood already knows with what the question asks, lists the assumptions it made, and suggests one next step. In the product this is the large model’s reply; in the prototype it is sample text.'
}

export const PREDICT = (text, opts) => (text.trim().length < 4 ? null : route(text, opts))
