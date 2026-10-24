// Figures the trip screens show, always computed from the rows so the parts add up.
import { DATE_POLL, EXPENSES, ITINERARY, PLAN, SHARED_PACKING } from './trip.js'
import { GROUPS } from './groups.js'

export const KYOTO = GROUPS.kyoto
const round2 = (n) => Math.round(n * 100) / 100

export function poll(myVotes) {
  const voters = KYOTO.members
  const all = { ...DATE_POLL.votes, ...(Object.keys(myVotes).length ? { nadia: myVotes } : {}) }
  const rows = DATE_POLL.windows.map((w) => {
    const by = voters.map((m) => ({ m, v: all[m]?.[w.id] || null }))
    const yes = by.filter((x) => x.v === 'yes').length
    const maybe = by.filter((x) => x.v === 'maybe').length
    const no = by.filter((x) => x.v === 'no').length
    return { ...w, by, yes, maybe, no, score: yes * 2 + maybe }
  })
  const lead = [...rows].sort((a, b) => b.score - a.score || b.yes - a.yes)[0]
  const waiting = voters.filter((m) => !all[m] || Object.keys(all[m]).length < DATE_POLL.windows.length)
  return { rows, lead, waiting }
}

export function costs(added) {
  const list = [...EXPENSES, ...added]
  const people = KYOTO.members
  const paid = Object.fromEntries(people.map((m) => [m, 0]))
  const share = Object.fromEntries(people.map((m) => [m, 0]))
  for (const e of list) {
    paid[e.paidBy] += e.amount
    const each = e.amount / e.split.length
    for (const m of e.split) share[m] += each
  }
  const net = Object.fromEntries(people.map((m) => [m, round2(paid[m] - share[m])]))
  // Settle-up payments move money between people; they are not trip costs.
  const spend = list.filter((e) => e.kind !== 'settle')
  const total = round2(spend.reduce((s, e) => s + e.amount, 0))
  console.assert(Math.abs(Object.values(net).reduce((a, b) => a + b, 0)) < 0.05, 'balances do not net to zero')

  // Settle up with the fewest transfers: the largest debtor pays the largest creditor first.
  const debt = people.filter((m) => net[m] < -0.004).map((m) => ({ m, v: -net[m] })).sort((a, b) => b.v - a.v)
  const cred = people.filter((m) => net[m] > 0.004).map((m) => ({ m, v: net[m] })).sort((a, b) => b.v - a.v)
  const transfers = []
  let i = 0
  let j = 0
  while (i < debt.length && j < cred.length) {
    const v = round2(Math.min(debt[i].v, cred[j].v))
    transfers.push({ from: debt[i].m, to: cred[j].m, v })
    debt[i].v = round2(debt[i].v - v)
    cred[j].v = round2(cred[j].v - v)
    if (debt[i].v < 0.01) i++
    if (cred[j].v < 0.01) j++
  }

  // How much of each person's plan is already committed, by category, for the demo user.
  const mineByCat = Object.fromEntries(PLAN.map((p) => [p.id, 0]))
  for (const e of spend) if (e.split.includes('nadia')) mineByCat[e.cat] = round2((mineByCat[e.cat] || 0) + e.amount / e.split.length)
  const planTotal = PLAN.reduce((s, p) => s + p.amount, 0)
  console.assert(planTotal === KYOTO.budget, 'plan does not add up to the group budget')
  const committed = round2(Object.values(mineByCat).reduce((a, b) => a + b, 0))
  return { list: spend, paid, share, net, total, transfers, mineByCat, planTotal, committed }
}

export function itinerary(votes, added) {
  return ITINERARY.map((d) => ({
    ...d,
    items: [...d.items, ...added.filter((a) => a.day === d.day)].map((it) => {
      if (!it.proposed) return it
      const all = { ...it.votes, ...(votes[it.id] ? { nadia: votes[it.id] } : {}) }
      const yes = Object.values(all).filter((v) => v === 'yes').length
      const no = Object.values(all).filter((v) => v === 'no').length
      return { ...it, all, yes, no, mine: votes[it.id] || null }
    }).sort((a, b) => a.time.localeCompare(b.time)),
  }))
}

export function packing(claims, mine) {
  const shared = SHARED_PACKING.map((p) => ({ ...p, by: claims[p.id] ?? null }))
  return { shared, open: shared.filter((p) => !p.by).length, mineDone: mine.filter((m) => m.done).length, mineTotal: mine.length }
}
