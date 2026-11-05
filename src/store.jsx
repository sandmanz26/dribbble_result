import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { byId } from './data.js'

const KEY = 'ripe-cart-v1'
const Ctx = createContext(null)

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { lines: [] } } catch { return { lines: [] } }
}

export function CartProvider({ children }) {
  const [state, setState] = useState(load)
  const [open, setOpen] = useState(false)
  const [bump, setBump] = useState(0)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* private mode */ } }, [state])

  const api = useMemo(() => {
    const lines = state.lines
    const priced = lines.map((l) => {
      const c = byId(l.id)
      const each = c.price[l.size] * (l.sub ? 0.9 : 1)
      return { ...l, c, each, total: each * l.qty }
    })
    const sub = priced.reduce((a, l) => a + l.total, 0)
    const count = lines.reduce((a, l) => a + l.qty, 0)
    const hasSub = lines.some((l) => l.sub)
    return {
      lines: priced, sub, count, hasSub, open, bump,
      setOpen,
      add(line, { show = true } = {}) {
        setState((s) => {
          const key = `${line.id}|${line.size}|${line.grind}|${line.sub || ''}`
          const found = s.lines.find((l) => l.key === key)
          const next = found
            ? s.lines.map((l) => (l.key === key ? { ...l, qty: l.qty + (line.qty || 1) } : l))
            : [...s.lines, { ...line, qty: line.qty || 1, key }]
          return { ...s, lines: next }
        })
        setBump((b) => b + 1)
        if (show) setOpen(true)
      },
      qty(key, d) { setState((s) => ({ ...s, lines: s.lines.map((l) => (l.key === key ? { ...l, qty: Math.max(0, l.qty + d) } : l)).filter((l) => l.qty > 0) })) },
      remove(key) { setState((s) => ({ ...s, lines: s.lines.filter((l) => l.key !== key) })) },
      clear() { setState({ lines: [] }) },
    }
  }, [state, open, bump])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useCart = () => useContext(Ctx)
