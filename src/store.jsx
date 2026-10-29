import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { ITEMS, DIPS, SIDES, FREE_DIPS, DIP_PRICE, CATS, money } from './data/menu.js'
import { ADDRESSES, DELIVERY, DEMO_MS, HOLD_MIN, branchOf, feeFor, planFor } from './data/service.js'

// One store for the whole prototype, saved on this phone under its own key (the hub shares an origin).
// v3: orders became a real lifecycle (outbox, checks, kitchen, rider), so older saves are dropped.
const KEY = 'ff-state-v3'

const fresh = () => ({
  bag: [],
  orders: [],
  setup: { mode: 'delivery', address: 'home', drop: 'hand', branch: 'ring', style: 'counter', car: '', when: 'asap' },
  addresses: ADDRESSES,
  checkout: { pay: 'card', change: 0, tip: 0, cutlery: false, note: '' },
  name: 'Nadia',
  // Manage: `draft` is what the owner is editing, `live` is what every phone shows.
  live: { v: 14, at: '2026-10-26T09:12:00', special: 'half', items: {} },
  draft: { special: 'half', items: {} },
  net: 'online', // the reviewer's network switch: online, weak or offline
  demoSold: false, // the next order the shop accepts has a dish that just ran out
  seq: 26,
})

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.live) return { ...fresh(), ...s } } catch { /* first visit */ }
  return fresh()
}

const extras = (line) => Math.max(0, line.dips.length - FREE_DIPS) * DIP_PRICE + (SIDES.find((s) => s.id === line.side)?.price || 0)
export const linePrice = (line, item) => (item.price + extras(line)) * line.qty
export const lineAt = (line, unit) => (unit + extras(line)) * line.qty

const liveMenu = (s) => ITEMS.map((i) => ({ ...i, ...(s.live.items[i.id] || {}) }))
export const addressOf = (s) => s.addresses.find((a) => a.id === s.setup.address) || s.addresses[0]

// Prices an order from its own saved unit prices, so a menu change never silently alters it.
function priceOrder(o) {
  const food = o.lines.reduce((t, l) => t + lineAt(l, o.unit[l.key]), 0)
  const fee = o.mode === 'delivery' ? feeFor(o.address.km) : 0
  const tip = o.mode === 'delivery' ? o.tip : 0
  return { food, fee, tip, total: food + fee + tip }
}

// What changed between the menu the order was built from and the menu now. Checked before sending,
// the way a server answers "prices changed" instead of quietly charging a different amount.
function recheck(s, o, now) {
  const menu = liveMenu(s)
  const out = []
  for (const l of o.lines) {
    const it = menu.find((i) => i.id === l.id)
    if (it.soldOut) out.push({ kind: 'sold', key: l.key, text: `${it.name} sold out while your order waited`, d: -lineAt(l, o.unit[l.key]) })
    else if (Math.abs(it.price - o.unit[l.key]) > 0.001) out.push({ kind: 'price', key: l.key, price: it.price, text: `${it.name} is now ${money(it.price)}, it was ${money(o.unit[l.key])}`, d: (it.price - o.unit[l.key]) * l.qty })
  }
  if (now > o.holdUntil) out.push({ kind: 'late', text: `It waited more than ${HOLD_MIN} minutes, so the time is worked out again from now`, d: 0 })
  return out
}

const ev = (o, id, title, note) => ({ ...o, events: [...o.events, { id, t: o.vclock, title, note }] })

function advance(o, now) {
  const plan = planFor(o)
  const next = o.step + 1
  if (next >= plan.length) return { ...o, status: 'done', due: null }
  const st = plan[next]
  let n = { ...o, step: next, vclock: o.vclock + (st.min + (o.pend || 0)) * 60000, pend: 0 }
  n = ev(n, st.id, st.title, st.note)
  if (next === plan.length - 1) return { ...n, status: 'done', due: null }
  const held = st.wait === 'arrival' && !n.arrived
  return { ...n, due: held ? null : now + plan[next + 1].min * DEMO_MS }
}

function accept(s, o, now) {
  if (s.demoSold) {
    // The shop ran out of something: ask the customer before anything is cooked or charged.
    const l = o.lines.find((x) => ITEMS.find((i) => i.id === x.id)?.cat !== 'mayo') || o.lines[0]
    const it = ITEMS.find((i) => i.id === l.id)
    const alt = ITEMS.find((i) => i.cat === it.cat && i.id !== it.id && !o.lines.some((x) => x.id === i.id))
    return [{ ...o, status: 'needs', due: null, issue: { key: l.key, alt: alt.id } }, { demoSold: false }]
  }
  const plan = planFor(o)
  let n = { ...o, status: 'active', step: 0, vclock: o.vclock + plan[0].min * 60000 }
  n = ev(n, 'accepted', plan[0].title, plan[0].note)
  if (typeof o.when === 'number') {
    // Scheduled: the shop holds the ticket and the kitchen starts so it is ready at the chosen time.
    const left = plan.slice(1).reduce((t, st) => t + st.min, 0)
    const start = Math.max(n.vclock, o.when - left * 60000)
    n = { ...ev(n, 'scheduled', `Scheduled for ${new Date(o.when).toTimeString().slice(0, 5)}`, `The kitchen starts on it at ${new Date(start).toTimeString().slice(0, 5)}, so it is fresh at that time.`), vclock: start }
  }
  return [{ ...n, due: now + plan[1].min * DEMO_MS }, {}]
}

// One tick moves every order that is due. Network: online, weak (slow, first try times out), offline.
function tick(s, now, net) {
  let patch = {}
  let moved = false
  const orders = s.orders.map((o) => {
    const n = step(o)
    if (n !== o) moved = true
    return n
  })
  function step(o) {
    if (o.status === 'outbox' && net !== 'offline') return { ...o, status: 'sending', sendDue: now + (net === 'weak' ? 3200 : 1100) }
    if (o.status === 'sending') {
      if (net === 'offline') return { ...o, status: 'outbox', tries: [...o.tries, { t: now, ok: false, why: 'Signal lost while sending' }] }
      if (now < o.sendDue) return o
      if (net === 'weak' && !o.weakFailed) return { ...o, weakFailed: true, sendDue: now + 3200, tries: [...o.tries, { t: now, ok: false, why: 'Timed out on a weak signal, trying again' }] }
      const changes = o.checked ? [] : recheck(s, o, now)
      if (changes.length) return { ...o, status: 'review', changes, tries: [...o.tries, { t: now, ok: false, why: 'Held back: the menu changed since you saved it' }] }
      const b = branchOf(o.branch).name
      return { ...o, status: 'sent', sentAt: now, vclock: now, due: now + 2400, tries: [...o.tries, { t: now, ok: true, why: `Received by ${b}` }], events: [...o.events, { id: 'sent', t: now, title: `Sent to ${b}`, note: 'Waiting for the shop to accept, usually under a minute.' }] }
    }
    // With no signal the phone hears nothing new; the last known step stays on screen.
    if (net === 'offline' || !o.due || now < o.due) return o
    if (o.status === 'sent') { const [n, p] = accept(s, o, now); patch = { ...patch, ...p }; return n }
    if (o.status === 'active') return advance(o, now)
    return o
  }
  return moved ? { ...s, ...patch, orders } : s
}

const mapOrder = (s, id, fn) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? fn(o) : o)) })

function reducer(s, a) {
  switch (a.type) {
    case 'add': {
      const same = s.bag.find((l) => l.id === a.line.id && l.heat === a.line.heat && l.side === a.line.side && l.dips.join() === a.line.dips.join())
      const bag = same ? s.bag.map((l) => (l === same ? { ...l, qty: l.qty + a.line.qty } : l)) : [...s.bag, { ...a.line, key: `${a.line.id}-${Date.now()}` }]
      return { ...s, bag }
    }
    case 'qty': return { ...s, bag: s.bag.map((l) => (l.key === a.key ? { ...l, qty: l.qty + a.d } : l)).filter((l) => l.qty > 0) }
    case 'set': return { ...s, ...a.patch }
    case 'setup': return { ...s, setup: { ...s.setup, ...a.patch } }
    case 'checkout': return { ...s, checkout: { ...s.checkout, ...a.patch } }
    case 'addAddress': return { ...s, addresses: [...s.addresses.filter((x) => x.id !== a.address.id), a.address], setup: { ...s.setup, mode: 'delivery', address: a.address.id } }
    case 'place': {
      const seq = s.seq + 1
      const menu = liveMenu(s)
      const c = s.checkout; const st = s.setup
      const delivery = st.mode === 'delivery'
      const address = delivery ? addressOf(s) : null
      const unit = Object.fromEntries(s.bag.map((l) => [l.key, menu.find((i) => i.id === l.id).price]))
      let o = {
        id: `A-${seq}`, key: `ff_${seq}_${Math.random().toString(36).slice(2, 8)}`, createdAt: a.now, name: s.name,
        mode: delivery ? 'delivery' : 'pickup', style: delivery ? null : st.style, branch: delivery ? address.branch : st.branch,
        address, drop: st.drop, car: st.car, when: delivery && st.when === 'arrive' ? 'asap' : st.when,
        pay: delivery || c.pay !== 'cash' ? c.pay : 'counter', change: c.change, tip: c.tip, cutlery: c.cutlery, note: c.note,
        lines: s.bag, unit, menuV: s.live.v, code: String(1000 + ((seq * 7919) % 9000)),
        status: a.net === 'offline' ? 'outbox' : 'sending', sendDue: a.now + (a.net === 'weak' ? 3200 : 1100),
        holdUntil: a.now + HOLD_MIN * 60000, tries: a.net === 'offline' ? [{ t: a.now, ok: false, why: 'No signal, saved on this phone' }] : [],
        events: [], step: -1, vclock: a.now, due: null, delay: 0, arrived: false, bay: null,
      }
      o = { ...o, priced: priceOrder(o) }
      return { ...s, seq, bag: [], orders: [o, ...s.orders], checkout: { ...s.checkout, note: '' } }
    }
    case 'tick': return tick(s, a.now, a.net)
    case 'confirmChanges': return mapOrder(s, a.id, (o) => {
      const sold = new Set(o.changes.filter((c) => c.kind === 'sold').map((c) => c.key))
      const unit = { ...o.unit }
      o.changes.filter((c) => c.kind === 'price').forEach((c) => { unit[c.key] = c.price })
      let n = { ...o, lines: o.lines.filter((l) => !sold.has(l.key)), unit, checked: true, changes: null, status: 'sending', sendDue: a.now + 900, holdUntil: a.now + HOLD_MIN * 60000 }
      n = { ...n, priced: priceOrder(n) }
      return n.lines.length ? n : { ...n, status: 'cancelled', cancelReason: 'Everything in it sold out, so there was nothing to send. Nothing was charged.' }
    })
    case 'resolve': return mapOrder(s, a.id, (o) => {
      const { key, alt } = o.issue
      const altItem = ITEMS.find((i) => i.id === alt)
      const old = ITEMS.find((i) => i.id === o.lines.find((l) => l.key === key).id)
      if (a.choice === 'cancel') return { ...o, status: 'cancelled', issue: null, cancelReason: `You cancelled when ${old.name} ran out. Nothing was charged.` }
      let lines = o.lines; const unit = { ...o.unit }
      if (a.choice === 'swap') { lines = lines.map((l) => (l.key === key ? { ...l, id: alt, heat: altItem.heat ? l.heat || 'medium' : null } : l)); unit[key] = altItem.price }
      else lines = lines.filter((l) => l.key !== key)
      if (!lines.length) return { ...o, status: 'cancelled', issue: null, cancelReason: 'Nothing was left to cook. Nothing was charged.' }
      let n = { ...o, lines, unit, issue: null, status: 'sent', due: a.now + 600 }
      n = { ...n, priced: priceOrder(n) }
      return { ...n, events: [...n.events, { id: 'changed', t: n.vclock, title: a.choice === 'swap' ? `Swapped ${old.name} for ${altItem.name}` : `Removed ${old.name}`, note: 'Your choice when the shop ran out. The total below is updated.' }] }
    })
    case 'arrive': return mapOrder(s, a.id, (o) => {
      const n = { ...o, arrived: true, bay: a.bay ?? o.bay, events: [...o.events, { id: 'here', t: o.vclock, title: a.bay ? `You are in bay ${a.bay}` : 'You are at the shop', note: 'The kitchen was told straight away.' }] }
      return o.status === 'active' && !o.due ? { ...n, due: a.now + 500 } : n
    })
    case 'delay': return mapOrder(s, a.id, (o) => ({ ...o, delay: o.delay + 8, pend: (o.pend || 0) + 8, due: o.due ? o.due + 8 * DEMO_MS : o.due, events: [...o.events, { id: `late-${o.delay}`, t: o.vclock, title: 'Running about 8 minutes late', note: 'Heavy traffic on the way. The new time is at the top.' }] }))
    case 'cancel': return mapOrder(s, a.id, (o) => ({ ...o, status: 'cancelled', due: null, cancelReason: ['outbox', 'sending', 'review'].includes(o.status) ? 'It never reached the shop, so nothing was charged.' : 'Cancelled before the kitchen started. Nothing was charged.' }))
    case 'skip': return mapOrder(s, a.id, (o) => (o.status === 'sending' ? { ...o, sendDue: a.now } : o.due ? { ...o, due: a.now } : o))
    case 'expire': return { ...s, orders: s.orders.map((o) => (o.status === 'outbox' ? { ...o, holdUntil: a.now - 1 } : o)) }
    case 'problem': return mapOrder(s, a.id, (o) => ({ ...o, problem: { keys: a.keys, reason: a.reason, refund: a.refund, t: a.now } }))
    case 'draftItem': {
      const cur = s.draft.items[a.id] || {}
      return { ...s, draft: { ...s.draft, items: { ...s.draft.items, [a.id]: { ...cur, ...a.patch } } } }
    }
    case 'draftSpecial': return { ...s, draft: { ...s.draft, special: a.id } }
    case 'discard': return { ...s, draft: { special: s.live.special, items: s.live.items } }
    case 'publish': return { ...s, live: { v: s.live.v + 1, at: a.now, special: s.draft.special, items: s.draft.items } }
    // Reviewer shortcut: the shop publishes a menu change while an order waits on the phone.
    case 'demoMenuChange': {
      const first = s.orders.find((o) => o.status === 'outbox')
      const ids = first ? [...new Set(first.lines.map((l) => l.id))] : ['wings-8', 'half']
      const items = { ...s.live.items }
      const base = (id) => ({ ...ITEMS.find((i) => i.id === id), ...(items[id] || {}) })
      items[ids[0]] = { ...(items[ids[0]] || {}), price: Math.round((base(ids[0]).price + 0.4) * 10) / 10 }
      if (ids[1]) items[ids[1]] = { ...(items[ids[1]] || {}), soldOut: true }
      return { ...s, live: { ...s.live, v: s.live.v + 1, at: new Date(a.now).toISOString(), items }, draft: { ...s.draft, items } }
    }
    case 'reset': return fresh()
    default: return s
  }
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [s, dispatch] = useReducer(reducer, undefined, load)
  const [browserOnline, setBrowserOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)
  const [now, setNow] = useState(Date.now())

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* storage full or blocked */ } }, [s])
  useEffect(() => {
    const on = () => setBrowserOnline(true); const off = () => setBrowserOnline(false)
    window.addEventListener('online', on); window.addEventListener('offline', off)
    const t = setInterval(() => setNow(Date.now()), 500)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); clearInterval(t) }
  }, [])

  const net = browserOnline ? s.net : 'offline'
  const online = net !== 'offline'
  useEffect(() => { dispatch({ type: 'tick', now, net }) }, [now, net])

  // The menu every phone sees: the file plus the published overrides.
  const menu = useMemo(() => liveMenu(s), [s.live]) // eslint-disable-line react-hooks/exhaustive-deps
  const draftMenu = useMemo(() => ITEMS.map((i) => ({ ...i, ...(s.draft.items[i.id] || {}) })), [s.draft])
  const changes = useMemo(() => {
    const n = ITEMS.filter((i) => JSON.stringify(s.draft.items[i.id] || {}) !== JSON.stringify(s.live.items[i.id] || {})
      && ['price', 'soldOut'].some((k) => (s.draft.items[i.id]?.[k] ?? i[k]) !== (s.live.items[i.id]?.[k] ?? i[k]))).length
    return n + (s.draft.special !== s.live.special ? 1 : 0)
  }, [s.draft, s.live])

  const itemById = useCallback((id) => menu.find((i) => i.id === id), [menu])
  const subtotal = s.bag.reduce((t, l) => t + linePrice(l, itemById(l.id)), 0)
  const delivery = s.setup.mode === 'delivery'
  const address = addressOf(s)
  const fee = delivery && s.bag.length ? feeFor(address.km) : 0
  const tip = delivery ? s.checkout.tip : 0
  const short = delivery ? Math.max(0, DELIVERY.minOrder - subtotal) : 0
  const count = s.bag.reduce((t, l) => t + l.qty, 0)
  const waiting = s.orders.filter((o) => ['outbox', 'sending', 'review'].includes(o.status)).length
  const active = s.orders.filter((o) => !['done', 'cancelled'].includes(o.status)).length

  const value = { s, dispatch, net, online, now, menu, draftMenu, changes, itemById, subtotal, fee, tip, total: subtotal + fee + tip, short, count, address, waiting, active }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
export const dipName = (id) => DIPS.find((d) => d.id === id)?.name
export const sideOf = (id) => SIDES.find((d) => d.id === id)
export const catName = (id) => CATS.find((c) => c.id === id)?.name

// When the order should reach the customer, from where it is in its plan.
export function etaOf(o, now) {
  const plan = planFor(o)
  const left = plan.slice(Math.max(0, o.step + 1)).reduce((t, st) => t + st.min, 0)
  const base = o.status === 'active' || o.status === 'done' ? o.vclock : (o.sentAt || now)
  const t = base + (left + (o.pend || 0)) * 60000
  return typeof o.when === 'number' ? Math.max(o.when, t) : t
}
