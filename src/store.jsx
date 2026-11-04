import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { byId, priceOf } from './data/products.js'
import { BRANDS } from './data/brands.js'

const KEY = 'coop-state-v1'
const Ctx = createContext(null)

const initial = {
  lang: 'ar', brand: 'nakheel', persona: 'shareholder', latin: false, branch: 'main',
  cart: [],
  lists: [
    { id: 'home', name: { ar: 'البيت', en: 'Home' }, shared: ['أم سالم', 'سالم', 'نورة'], items: [
      { key: 'a', id: 'laban', qty: 2, done: false, by: 'نورة' },
      { key: 'b', id: 'khubz', qty: 2, done: false, by: 'سالم' },
      { key: 'c', id: 'tomatoes', qty: 1, done: true, by: 'أم سالم' },
      { key: 'd', id: 'eggs', qty: 1, done: false, by: 'أم سالم' },
      { key: 'e', text: 'بطاريات AA', qty: 1, done: false, by: 'سالم' },
      { key: 'f', id: 'cardamom', qty: 1, done: false, by: 'أم سالم' },
      { key: 'g', id: 'water', qty: 2, done: false, by: 'نورة' },
    ] },
    { id: 'gathering', name: { ar: 'عزيمة الخميس', en: 'Thursday gathering' }, shared: ['أم سالم'], items: [
      { key: 'h', id: 'rice', qty: 1, done: false, by: 'أم سالم' },
      { key: 'i', id: 'chicken', qty: 2, done: false, by: 'أم سالم' },
      { key: 'j', id: 'saffron', qty: 1, done: false, by: 'أم سالم' },
    ] },
  ],
  orders: [],
  recent: ['لبن', 'tamr', 'khubz'],
}

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); return s ? { ...initial, ...s } : initial } catch { return initial }
}

function reducer(s, a) {
  switch (a.type) {
    case 'set': return { ...s, ...a.v }
    case 'add': {
      const have = s.cart.find((l) => l.id === a.id)
      const cart = have ? s.cart.map((l) => (l.id === a.id ? { ...l, qty: l.qty + (a.qty || 1) } : l)) : [...s.cart, { id: a.id, qty: a.qty || 1, swap: true }]
      return { ...s, cart, pulse: Date.now() }
    }
    case 'qty': return { ...s, cart: a.qty <= 0 ? s.cart.filter((l) => l.id !== a.id) : s.cart.map((l) => (l.id === a.id ? { ...l, qty: a.qty } : l)) }
    case 'swap': return { ...s, cart: s.cart.map((l) => (l.id === a.id ? { ...l, swap: !l.swap } : l)) }
    case 'listToggle': return { ...s, lists: s.lists.map((L) => (L.id === a.list ? { ...L, items: L.items.map((i) => (i.key === a.key ? { ...i, done: !i.done } : i)) } : L)) }
    case 'listAdd': return { ...s, lists: s.lists.map((L) => (L.id === a.list ? { ...L, items: [...L.items, { key: String(Date.now()), qty: 1, done: false, by: 'أنت', ...a.item }] } : L)) }
    case 'listNew': return { ...s, lists: [...s.lists, { id: a.id, name: a.name, shared: [], items: a.items || [] }] }
    case 'listToCart': {
      const L = s.lists.find((x) => x.id === a.list)
      let cart = [...s.cart]
      L.items.filter((i) => i.id && !i.done).forEach((i) => {
        const h = cart.find((c) => c.id === i.id)
        cart = h ? cart.map((c) => (c.id === i.id ? { ...c, qty: c.qty + i.qty } : c)) : [...cart, { id: i.id, qty: i.qty, swap: true }]
      })
      return { ...s, cart, pulse: Date.now() }
    }
    case 'recent': return { ...s, recent: [a.q, ...s.recent.filter((r) => r !== a.q)].slice(0, 5) }
    case 'order': return { ...s, orders: [a.order, ...s.orders], cart: [] }
    case 'reset': return { ...initial, lang: s.lang, brand: s.brand }
    default: return s
  }
}

export function StoreProvider({ children }) {
  const [s, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => { try { const { pulse, ...rest } = s; localStorage.setItem(KEY, JSON.stringify(rest)) } catch { /* ignore */ } }, [s])
  const brand = BRANDS[s.brand]
  const lines = useMemo(() => s.cart.map((l) => ({ ...l, p: byId(l.id) })).filter((l) => l.p), [s.cart])
  const subtotal = lines.reduce((t, l) => t + priceOf(l.p) * l.qty, 0)
  const count = lines.reduce((t, l) => t + l.qty, 0)
  // Purchase dividend for shareholders, assumed 10% for the prototype (the law allows up to 15%).
  const rate = s.persona === 'shareholder' ? 0.10 : 0
  return <Ctx.Provider value={{ ...s, dispatch, brand, lines, subtotal, count, rate, dir: s.lang === 'ar' ? 'rtl' : 'ltr' }}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
