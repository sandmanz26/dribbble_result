// The assistant's answers in this prototype. There is no model behind it: each answer is written
// from the same data the screens use, and the matching is by keywords. What it shows is the shape
// of a good answer: what it looked at, the answer with its sources, and the next step.
import { STORES, YESTERDAY, MTD, productOf, storeOf, clientOf, idr, pct } from './world.js'
import { DECISIONS, KIRANA_DAYS, LOG, TRUST } from './ai.js'

const tp = storeOf('tp')
const kirana = productOf('kirana-top-handle')

export const ANSWERS = [
  {
    id: 'tunjungan', q: 'Why is Tunjungan Plaza under plan?', keys: ['tunjungan', 'surabaya', 'under plan', 'behind'],
    looked: ['Sales and plan by boutique, October', 'Footfall counters', 'Conversion by day', 'Roster and sick leave'],
    blocks: [
      { t: 'p', text: `Tunjungan Plaza sold ${idr(tp.sales)} yesterday against a plan of ${idr(tp.plan)}, ${Math.round((1 - tp.sales / tp.plan) * 100)}% under. It is not footfall: visitors were in line with a normal Wednesday.` },
      { t: 'p', text: `It is conversion. ${Math.round(tp.conv * 100)}% of visitors bought, against a usual ${Math.round(tp.usual * 100)}%. Two of the four advisors are off sick, so ${tp.floor} were on the floor, and appointments could not be taken.` },
      { t: 'bars', title: 'Conversion at Tunjungan Plaza, last 7 days', unit: '%', data: [['Thu', 17], ['Fri', 18], ['Sat', 16], ['Sun', 17], ['Mon', 12], ['Tue', 10], ['Wed', 9]], mark: 4, markLabel: 'Two advisors off sick from Monday' },
      { t: 'p', text: 'I have suggested bringing in Raka Pratama, part-time, on Saturday. Arief decides.' },
      { t: 'decision', id: 'D-121' },
    ],
    sources: ['Sales and plan, 28 Oct', 'Footfall, Tunjungan Plaza', 'Roster, week 44'],
  },
  {
    id: 'move', q: 'Which pieces should we move before the season ends?', keys: ['move', 'transfer', 'rebalance', 'slow', 'before the season'],
    looked: ['Stock by boutique', 'Rate of sale, last 8 weeks', 'Display minimums', 'Holds and wish lists'],
    blocks: [
      { t: 'p', text: 'Three moves would keep more of the season at full price. Each one takes stock from where it is not selling to where it is, and none leaves a boutique below its display minimum of 2.' },
      { t: 'table', head: ['Piece', 'From', 'To', 'Units', 'Why'], rows: [
        ['Kirana top-handle, rosso', 'Pacific Place', 'Plaza Senayan', '2', `About ${KIRANA_DAYS} days of stock left at Plaza Senayan`],
        ['Senja hobo, nero', 'Seminyak', 'Plaza Indonesia', '3', 'Seminyak: 0 sold in 5 weeks'],
        ['Aruna ankle boot, smoke', 'Tunjungan Plaza', 'Plaza Senayan', '1', 'Size 37 asked for twice this week'],
      ], num: [3] },
      { t: 'p', text: 'The first two wait for Ratna. The third is under IDR 50.0M, so I would normally do it and tell you; I held it because Tunjungan is short-staffed and should not be packing parcels today.' },
      { t: 'decision', id: 'D-118' },
    ],
    sources: ['Stock on hand, 29 Oct 07:00', 'Sales by boutique, 1 Sep to 28 Oct'],
  },
  {
    id: 'hold', q: 'How do I hold a bag for a client at another boutique?', keys: ['how do i', 'hold', 'reserve', 'keep', 'another boutique'],
    looked: ['Your role: client advisor, Plaza Senayan', 'Hold policy: 48 hours, 24 more with an appointment'],
    blocks: [
      { t: 'p', text: 'You can hold any piece in the group for a client for 48 hours, from the piece’s page. If it is in another boutique, the hold also asks that boutique to send it to you.' },
      { t: 'steps', items: ['Open the piece from Stock or search', 'In "Stock by boutique", choose the boutique that has it', 'Choose the client and how long', 'Confirm. The other boutique sees it at once'] },
      { t: 'guide', id: 'hold', label: 'Show me on the Laras mini' },
    ],
    sources: ['Hold policy, store handbook p. 14'],
  },
  {
    id: 'draft', q: 'Draft a message to Anindya about the new Arunika', keys: ['draft', 'message', 'whatsapp', 'write to', 'anindya'],
    looked: ['Anindya Paramitha’s profile and purchases', 'Her advisor’s past messages (tone)', 'Arunika waitlist'],
    blocks: [
      { t: 'p', text: 'Here is a draft in Melati’s usual tone. It does not mention the waitlist order, because allocation is not decided yet.' },
      { t: 'draft', to: 'anindya', via: 'WhatsApp', text: 'Good morning, Ibu Anindya. See you at 11:00 today. Alongside the new season pieces, I would love to show you the Arunika in slate box calf, very close to what you described in August. I have set the viewing room aside for us. Melati' },
      { t: 'p', text: 'I never send messages to clients. Melati can edit it and send it from her WhatsApp in Selvedge.' },
    ],
    sources: ['Client profile', 'Message history, 2023 to 2026'],
  },
  {
    id: 'month', q: 'How will October end?', keys: ['october', 'month', 'end', 'land', 'forecast'],
    looked: ['Sales to date, October', 'Plan by day', 'Same weeks last year'],
    blocks: [
      { t: 'p', text: `October to date is ${idr(MTD.sales)} against a plan of ${idr(MTD.plan)}. If Thursday to Saturday go as they usually do, the month lands near ${idr(MTD.landing)}, against a monthly plan of ${idr(MTD.monthPlan)}.` },
      { t: 'month' },
      { t: 'p', text: 'This is likely, not certain: Saturday is the swing day and it moved by 12% either way in the last six Saturdays.' },
    ],
    sources: ['Daily sales, 1 to 28 Oct', 'Plan, October'],
  },
  {
    id: 'auto', q: 'What did the AI do this week without asking?', keys: ['without asking', 'on its own', 'did the ai', 'autopilot', 'log'],
    looked: ['Activity log, 26 to 29 Oct', 'Autopilot rules'],
    blocks: [
      { t: 'p', text: `I acted on my own ${LOG.filter((l) => l.kind === 'act').length} times this week, each inside a limit you set, and I can undo the most recent one until it ships. Everything else I wrote or flagged.` },
      { t: 'log' },
      { t: 'p', text: `In the last 30 days, ${TRUST.a} of ${TRUST.n} proposals were accepted, some after edits.` },
    ],
    sources: ['Activity log'],
  },
  {
    id: 'cash', q: 'What will our cash position be in March?', keys: ['cash', 'march', 'finance', 'bank', 'payable'],
    looked: ['Your access: Finance'],
    blocks: [
      { t: 'limit', text: 'Cash flow is one of the modules redacted from this portfolio piece. In the product, I answer this from the bank feeds and payables, and show the weeks where the balance gets thin.' },
    ],
    sources: [],
  },
]

// Suggested questions, by where the assistant is opened from.
export const SUGGEST = {
  owner: ['tunjungan', 'month', 'move', 'auto'],
  manager: ['move', 'draft', 'tunjungan', 'hold'],
  advisor: ['hold', 'draft', 'move'],
  product: ['move', 'hold'],
  client: ['draft', 'hold'],
  decisions: ['move', 'auto'],
}

export function match(text) {
  const t = text.toLowerCase()
  let best = null; let score = 0
  for (const a of ANSWERS) {
    const s = a.keys.reduce((n, k) => n + (t.includes(k) ? k.length : 0), 0)
    if (s > score) { score = s; best = a }
  }
  return best
}

export const answerOf = (id) => ANSWERS.find((a) => a.id === id)
export { DECISIONS, STORES, YESTERDAY, clientOf, pct }
