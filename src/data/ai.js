// What the AI produced from the world: proposals, the morning brief, the activity log and the
// autonomy rules. Every number is read from world.js so a figure never disagrees with itself.
import { STORES, YESTERDAY, MTD, OCTOBER, productOf, clientOf, idr, signPct, storeOf, PEOPLE } from './world.js'

const kirana = productOf('kirana-top-handle')
const psn = storeOf('psn')
const tp = storeOf('tp')
export const KIRANA_DAYS = Math.round(kirana.stock[0] / (kirana.psnFour / 28)) // days of stock left at Plaza Senayan

// Autonomy ladder, per decision type. Only the owner can raise a level; every change is logged.
export const LEVELS = [
  { id: 'suggest', name: 'Suggest', note: 'Shows a proposal. People decide and do it.' },
  { id: 'ask', name: 'Ask first', note: 'Prepares the action. Nothing happens until someone approves.' },
  { id: 'act', name: 'Act and tell', note: 'Acts within the limit, tells the owner of the decision, and can be undone.' },
]
export const RULES = [
  { id: 'transfer', name: 'Transfers between boutiques', level: 'act', limit: 50e6, above: 'ask', who: 'ratna', note: 'Never takes a boutique below its display minimum of 2 per style.', accepted: [18, 19] },
  { id: 'replenish', name: 'Replenishment from Cikarang', level: 'act', limit: 25e6, above: 'ask', who: 'dimas', note: 'Store managers approve above the limit for their boutique.', accepted: [11, 11] },
  { id: 'reorder', name: 'Reorders from the house', level: 'ask', limit: null, who: 'ratna', note: 'Always asks. Buying is checked against open-to-buy.', accepted: [5, 6] },
  { id: 'holds', name: 'Holds for clients', level: 'act', limit: null, who: 'dimas', note: 'Extends a hold by 24 hours when the client has an appointment booked.', accepted: [4, 4] },
  { id: 'staffing', name: 'Staffing changes', level: 'suggest', limit: null, who: 'manager', note: 'Store managers decide.', accepted: [3, 4] },
  { id: 'allocation', name: 'Allocating scarce pieces', level: 'suggest', locked: 'Company policy: a person always chooses who is offered a scarce piece.', who: 'ratna', accepted: [2, 2] },
  { id: 'markdown', name: 'Markdowns', level: 'suggest', locked: 'Brand policy: only the owner can mark a price down.', who: 'ratna', accepted: [0, 1] },
  { id: 'messages', name: 'Messages to clients', level: 'suggest', locked: 'Drafts only. The AI never contacts a client; the advisor sends.', who: 'advisor', accepted: [9, 11] },
]
export const TRUST = RULES.reduce((t, r) => ({ a: t.a + r.accepted[0], n: t.n + r.accepted[1] }), { a: 0, n: 0 })

// ---------- proposals ----------
const arunika = productOf('arunika-structured')
const tirta = productOf('tirta-pump-nero')
const senja = productOf('senja-hobo')

export const DECISIONS = [
  {
    id: 'D-118', kind: 'transfer', rule: 'transfer', owner: 'ratna', store: 'psn', product: 'kirana-top-handle',
    title: 'Move 2 Kirana top-handles from Pacific Place to Plaza Senayan',
    value: 2 * kirana.price, valueLabel: 'Stock value moved',
    why: [
      `Plaza Senayan sold ${kirana.psnFour} in the last 4 weeks and has ${kirana.stock[0]} left: about ${KIRANA_DAYS} days of stock.`,
      `Pacific Place holds ${kirana.stock[2]} and sold ${kirana.ppFive} in 5 weeks. After the move it keeps 2, its display minimum.`,
      'Anindya Paramitha, who owns one in rosso and asks after new colours, is in at 11:00.',
    ],
    effect: { text: 'Likely 1 to 2 more full-price sales before the season ends', low: kirana.price, high: 2 * kirana.price },
    risk: 'If Pacific Place has a client asking this week, it would have to ask for one back. Nobody there has it on hold or in a wish list.',
    cost: 'Insured courier IDR 350k. Arrives Friday 14:00 if approved before 12:00 today.',
    confidence: 'Likely. Based on 8 weeks of sales in both boutiques.',
    asks: 'Asks first: above the IDR 50.0M limit for transfers.',
    sources: ['Sales by boutique, 1 Sep to 28 Oct', 'Stock on hand, 29 Oct 07:00', 'Holds and wish lists, Pacific Place', 'Today’s appointments, Plaza Senayan'],
    chart: { title: 'Kirana top-handle, units sold per week', a: { label: 'Plaza Senayan', data: [1, 1, 1, 2, 2, 1, 2, 2] }, b: { label: 'Pacific Place', data: [1, 0, 1, 0, 0, 0, 0, 0] } },
  },
  {
    id: 'D-119', kind: 'allocation', rule: 'allocation', owner: 'ratna', store: 'psn', product: 'arunika-structured',
    title: 'Who is offered the 2 Arunika in slate arriving Monday',
    value: 2 * arunika.price, valueLabel: 'Two pieces at full price',
    why: [
      `${arunika.waitlist} clients are on the waitlist; ${arunika.inbound} pieces arrive at Cikarang on Monday 2 November.`,
      'I ranked them by time on the waitlist, how closely the piece matches what they buy, and the relationship. Spend is a tiebreaker only.',
      'A person chooses. Allocation is never automated here.',
    ],
    ranking: [
      { client: 'citra', score: 'First on the list', reasons: ['Waiting since 28 Jul, the longest', 'Wears slate and nero, minimal hardware', 'Plaza Indonesia, 14 visits'] },
      { client: 'anindya', score: 'Strong match', reasons: ['Waiting since 3 Aug', 'Owns the Kirana; asks for structured bags in slate', 'In today at 11:00, so she can see it in person'] },
      { client: 'rizal', score: 'Good, with a date', reasons: ['Waiting since 20 Aug', 'A gift for 18 December. A December arrival would also work'] },
      { client: 'dewi', score: 'Weaker match', reasons: ['Waiting since 9 Sep', 'Buys shoes and small leather, tan and cognac'] },
      { client: 'kevin', score: 'Offer nero instead', reasons: ['Waiting since 1 Oct', 'Said nero is fine; 1 nero is due in November'] },
    ],
    effect: { text: 'Both pieces sold at full price within a week', low: arunika.price, high: 2 * arunika.price },
    risk: 'Clients lower on the list should hear from their advisor before they hear from someone else.',
    confidence: 'This is a judgement call. The ranking explains itself; it does not decide.',
    asks: 'Suggest only: company policy.',
    sources: ['Waitlist, Arunika structured', 'Client purchase history', 'Inbound shipment IB-2207'],
  },
  {
    id: 'D-120', kind: 'reorder', rule: 'reorder', owner: 'ratna', store: null, product: 'tirta-pump-nero',
    title: 'Reorder 18 pairs of Tirta pump 105 in nero, sizes 36 to 39',
    value: 120.7e6, valueLabel: 'At cost, inside open-to-buy',
    why: [
      `Sells ${tirta.weekly.slice(-4).reduce((t, n) => t + n, 0)} pairs in 4 weeks, the best-selling shoe of the season.`,
      `${tirta.broken}. Clients are being sent between boutiques for one pair.`,
      'The house can deliver in 3 weeks if ordered by Friday, in time for the December peak.',
    ],
    effect: { text: 'Likely 14 to 18 pairs sold by the end of December', low: 14 * tirta.price, high: 18 * tirta.price },
    risk: 'If December is as slow as last year, about 4 pairs carry into January at full price.',
    confidence: 'Likely. Based on this season and the same weeks last year.',
    asks: 'Asks first: reorders always do.',
    sources: ['Sales by size, 1 Aug to 28 Oct', 'Open-to-buy, November (redacted module)', 'House lead times'],
  },
  {
    id: 'D-121', kind: 'staffing', rule: 'staffing', owner: 'arief', store: 'tp', product: null,
    title: 'Bring Raka in on Saturday at Tunjungan Plaza',
    value: 0.65e6, valueLabel: 'Extra staff cost',
    why: [
      `Conversion fell to ${Math.round(tp.conv * 100)}% yesterday, against a usual ${Math.round(tp.usual * 100)}%. Footfall was normal.`,
      `Two of four advisors are off sick; ${tp.floor} are on the floor.`,
      'Saturday is the busiest day of the week in Surabaya.',
    ],
    effect: { text: 'Conversion back to about 15% on Saturday', low: 40e6, high: 70e6 },
    risk: 'Raka is part-time and has not sold the new season bags yet. Arief could brief him on Friday.',
    confidence: 'Fairly likely. Two similar weeks this year.',
    asks: 'Suggest: the store manager decides.',
    sources: ['Footfall counter, Tunjungan Plaza', 'Roster and sick leave', 'Conversion by day, October'],
  },
  {
    id: 'D-122', kind: 'markdown', rule: 'markdown', owner: 'ratna', store: 'smy', product: 'senja-hobo',
    title: 'Instead of 20% off the Senja hobo in Seminyak, move 3 to Plaza Indonesia',
    value: 3 * senja.price, valueLabel: 'Stock value kept at full price',
    why: [
      `Kadek asked for a 20% markdown: Seminyak holds ${senja.stock[5]} and sold ${senja.smyFive} in 5 weeks.`,
      `Plaza Indonesia sold 4 in the same weeks and has ${senja.stock[1]} left.`,
      'A markdown in one boutique shows up in every client’s chat within days.',
    ],
    effect: { text: 'Keeps full price; likely 2 of the 3 sell in Jakarta this season', low: 2 * senja.price, high: 3 * senja.price },
    risk: 'Seminyak keeps 2 for display. Courier from Bali takes 2 days.',
    confidence: 'Likely. Plaza Indonesia’s rate of sale is steady.',
    asks: 'Suggest only: brand policy on markdowns.',
    sources: ['Sales by boutique, Senja hobo', 'Markdown request MR-031 from Kadek Ayu Lestari'],
  },
]
export const decisionOf = (id) => DECISIONS.find((d) => d.id === id)

// ---------- the morning brief, built from the same figures ----------
const gap = YESTERDAY.sales / YESTERDAY.plan - 1
const best = [...STORES].sort((a, b) => b.sales / b.plan - a.sales / a.plan)[0]
const worst = [...STORES].sort((a, b) => a.sales / a.plan - b.sales / b.plan)[0]
const mine = DECISIONS.filter((d) => d.owner === 'ratna')
export const BRIEF = {
  written: '07:00',
  lines: [
    { text: `Yesterday the group sold ${idr(YESTERDAY.sales)}, ${Math.abs(Math.round(gap * 100))}% below the plan of ${idr(YESTERDAY.plan)}.`, source: 'stores' },
    { text: `${best.name} carried the day at ${idr(best.sales)}, ${signPct(best.sales / best.plan - 1, 0)} on plan.`, source: 'stores' },
    { text: `${worst.name} was ${Math.round((1 - worst.sales / worst.plan) * 100)}% under. Footfall was normal, but conversion fell to ${Math.round(worst.conv * 100)}% with two advisors off sick.`, source: 'D-121' },
    { text: `The Kirana top-handle in rosso runs out at Plaza Senayan in about ${KIRANA_DAYS} days, while Pacific Place has ${kirana.stock[2]} that have not sold in 5 weeks.`, source: 'D-118' },
    { text: `For October, the month lands near ${idr(MTD.landing)} against a plan of ${idr(MTD.monthPlan)} if the weekend goes as usual.`, source: 'month' },
  ],
  needs: mine.length,
  needsValue: mine.reduce((t, d) => t + d.value, 0),
}

// ---------- what the AI did on its own this week ----------
export const LOG = [
  { id: 'L-311', when: 'Thu 29 Oct, 07:05', rule: 'transfer', what: 'Flagged Tunjungan Plaza conversion: 9% against a usual 17%', detail: 'Proposal D-121 sent to Arief Nugroho', kind: 'flag' },
  { id: 'L-310', when: 'Thu 29 Oct, 07:00', rule: null, what: 'Wrote the morning brief for Ratna, Dimas and the five other managers', detail: '5 sources, 7 numbers cited', kind: 'write' },
  { id: 'L-309', when: 'Wed 28 Oct, 07:30', rule: 'replenish', what: 'Replenished 2 card holders to Seminyak from Cikarang', detail: idr(2 * productOf('card-holder').price) + ', under the IDR 25.0M limit', kind: 'act', undo: 'Can be undone until it ships at 13:00 today' },
  { id: 'L-307', when: 'Tue 27 Oct, 18:40', rule: 'holds', what: 'Extended Wulan Sasmita’s hold on the Laras mini to today, 17:00', detail: 'She had an appointment; it was moved', kind: 'act' },
  { id: 'L-305', when: 'Tue 27 Oct, 09:00', rule: 'messages', what: 'Drafted 9 follow-up messages for advisors at Plaza Senayan', detail: '7 sent by advisors after edits, 2 discarded', kind: 'write' },
  { id: 'L-302', when: 'Mon 26 Oct, 08:10', rule: 'transfer', what: 'Moved 1 Sabda tote from Cikarang to Pondok Indah Mall', detail: idr(productOf('sabda-tote').price) + ', under the IDR 50.0M limit. Sold on Tuesday', kind: 'act' },
]

export const personOf = (id) => PEOPLE[id]
export const ownerName = (d) => PEOPLE[d.owner]?.name
export { clientOf, OCTOBER }
