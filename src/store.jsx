import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { ITEMS, DIPS, SIDES, FREE_DIPS, DIP_PRICE, SHOP, STATIONS } from './data/menu.js'

// One store for the whole prototype, saved on this phone under its own key (the hub shares an origin).
const KEY = 'ff-state-v1'
// The kitchen moves an order one station every STEP ms in the demo, so a reviewer sees it finish.
export const STEP = 25000

const fresh = () => ({
  bag: [],
  orders: [],
  mode: 'pickup',
  slot: 'asap',
  name: 'Nadia',
  // Manage: `draft` is what the owner is editing, `live` is what every phone shows.
  live: { v: 14, at: '2026-10-26T09:12:00', special: 'half', items: {} },
  draft: { special: 'half', items: {} },
  simOffline: false,
  seq: 26,
})

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.live) return { ...fresh(), ...s } } catch { /* first visit */ }
  return fresh()
}

export function linePrice(line, item) {
  const dips = Math.max(0, line.dips.length - FREE_DIPS) * DIP_PRICE
  const side = SIDES.find((s) => s.id === line.side)?.price || 0
  return (item.price + dips + side) * line.qty
}

function reducer(s, a) {
  switch (a.type) {
    case 'add': {
      const same = s.bag.find((l) => l.id === a.line.id && l.heat === a.line.heat && l.side === a.line.side && l.dips.join() === a.line.dips.join())
      const bag = same ? s.bag.map((l) => (l === same ? { ...l, qty: l.qty + a.line.qty } : l)) : [...s.bag, { ...a.line, key: `${a.line.id}-${Date.now()}` }]
      return { ...s, bag }
    }
    case 'qty': return { ...s, bag: s.bag.map((l) => (l.key === a.key ? { ...l, qty: l.qty + a.d } : l)).filter((l) => l.qty > 0) }
    case 'set': return { ...s, ...a.patch }
    case 'place': {
      const seq = s.seq + 1
      const order = { id: `A-${seq}`, lines: s.bag, total: a.total, mode: s.mode, slot: s.slot, name: s.name, madeAt: a.now, sentAt: a.online ? a.now : null, mins: a.mins, bump: 0 }
      return { ...s, seq, bag: [], orders: [order, ...s.orders] }
    }
    case 'flush': return { ...s, orders: s.orders.map((o) => (o.sentAt ? o : { ...o, sentAt: a.now })) }
    case 'bump': return { ...s, orders: s.orders.map((o) => (o.id === a.id ? { ...o, bump: o.bump + 1 } : o)) }
    case 'draftItem': {
      const cur = s.draft.items[a.id] || {}
      return { ...s, draft: { ...s.draft, items: { ...s.draft.items, [a.id]: { ...cur, ...a.patch } } } }
    }
    case 'draftSpecial': return { ...s, draft: { ...s.draft, special: a.id } }
    case 'discard': return { ...s, draft: { special: s.live.special, items: s.live.items } }
    case 'publish': return { ...s, live: { v: s.live.v + 1, at: a.now, special: s.draft.special, items: s.draft.items } }
    case 'reset': return fresh()
    default: return s
  }
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [s, dispatch] = useReducer(reducer, undefined, load)
  const [net, setNet] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)
  const [now, setNow] = useState(Date.now())

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* storage full or blocked */ } }, [s])
  useEffect(() => {
    const on = () => setNet(true); const off = () => setNet(false)
    window.addEventListener('online', on); window.addEventListener('offline', off)
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); clearInterval(t) }
  }, [])

  const online = net && !s.simOffline
  // Back online: anything waiting in the outbox goes to the kitchen.
  const waiting = s.orders.filter((o) => !o.sentAt).length
  useEffect(() => { if (online && waiting) dispatch({ type: 'flush', now: Date.now() }) }, [online, waiting])

  // The menu every phone sees: the file plus the published overrides.
  const menu = useMemo(() => ITEMS.map((i) => ({ ...i, ...(s.live.items[i.id] || {}) })), [s.live])
  const draftMenu = useMemo(() => ITEMS.map((i) => ({ ...i, ...(s.draft.items[i.id] || {}) })), [s.draft])
  const changes = useMemo(() => {
    const n = ITEMS.filter((i) => JSON.stringify(s.draft.items[i.id] || {}) !== JSON.stringify(s.live.items[i.id] || {})
      && ['price', 'soldOut'].some((k) => (s.draft.items[i.id]?.[k] ?? i[k]) !== (s.live.items[i.id]?.[k] ?? i[k]))).length
    return n + (s.draft.special !== s.live.special ? 1 : 0)
  }, [s.draft, s.live])

  const itemById = useCallback((id) => menu.find((i) => i.id === id), [menu])
  const subtotal = s.bag.reduce((t, l) => t + linePrice(l, itemById(l.id)), 0)
  const fee = s.mode === 'delivery' && s.bag.length ? SHOP.delivery : 0
  const count = s.bag.reduce((t, l) => t + l.qty, 0)

  const stageOf = useCallback((o) => {
    if (!o.sentAt) return -1
    const i = Math.floor((now - new Date(o.sentAt).getTime()) / STEP) + o.bump
    return Math.min(STATIONS.length - 1, Math.max(0, i))
  }, [now])

  const value = { s, dispatch, online, net, now, menu, draftMenu, changes, itemById, subtotal, fee, total: subtotal + fee, count, stageOf, waiting }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
export const dipName = (id) => DIPS.find((d) => d.id === id)?.name
export const sideOf = (id) => SIDES.find((d) => d.id === id)
