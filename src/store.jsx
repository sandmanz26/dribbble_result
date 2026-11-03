import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { byId } from './data/catalog.js'

const KEY = 'kr-state-v1'
const Ctx = createContext(null)

const empty = { cart: [], delivery: 'post', window: null, orders: [], drawer: false, toast: null }

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty
    const s = JSON.parse(raw)
    return { ...empty, ...s, drawer: false, toast: null }
  } catch { return empty }
}

function reducer(s, a) {
  switch (a.type) {
    case 'add': {
      const p = byId(a.id)
      const key = a.copy ? `${a.id}:${a.copy}` : a.id
      const have = s.cart.find((l) => l.key === key)
      const inCart = s.cart.filter((l) => l.id === a.id).reduce((t, l) => t + l.qty, 0)
      if (!p || inCart >= p.stock) return { ...s, toast: { kind: 'limit', id: a.id, at: Date.now() } }
      const cart = have
        ? s.cart.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l))
        : [...s.cart, { key, id: a.id, copy: a.copy || null, qty: 1 }]
      return { ...s, cart, toast: { kind: 'added', id: a.id, at: Date.now() } }
    }
    case 'qty': {
      const p = byId(a.id)
      const others = s.cart.filter((l) => l.id === a.id && l.key !== a.key).reduce((t, l) => t + l.qty, 0)
      const qty = Math.max(0, Math.min(a.qty, p.stock - others))
      return { ...s, cart: qty ? s.cart.map((l) => (l.key === a.key ? { ...l, qty } : l)) : s.cart.filter((l) => l.key !== a.key) }
    }
    case 'remove': return { ...s, cart: s.cart.filter((l) => l.key !== a.key) }
    case 'delivery': return { ...s, delivery: a.value }
    case 'window': return { ...s, window: a.value }
    case 'drawer': return { ...s, drawer: a.open }
    case 'toast': return { ...s, toast: null }
    case 'order': return { ...s, orders: [a.order, ...s.orders], cart: [], window: null }
    case 'reset': return { ...empty }
    default: return s
  }
}

export function StoreProvider({ children }) {
  const [s, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ cart: s.cart, delivery: s.delivery, window: s.window, orders: s.orders })) } catch { /* private mode */ }
  }, [s.cart, s.delivery, s.window, s.orders])
  const lines = useMemo(() => s.cart.map((l) => ({ ...l, p: byId(l.id) })).filter((l) => l.p), [s.cart])
  const count = lines.reduce((t, l) => t + l.qty, 0)
  const subtotal = lines.reduce((t, l) => t + l.qty * l.p.price, 0)
  const value = { ...s, lines, count, subtotal, dispatch }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
