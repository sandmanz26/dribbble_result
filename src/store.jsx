import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { FLAVORS } from './data.js'

const Ctx = createContext(null)
const read = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* private mode */ } }

export const VARIANTS = [
  { id: 'quiet', name: 'Quiet', note: 'Brief default. Paper ground, flavor bands, editorial space.' },
  { id: 'field', name: 'Field', note: 'The flavor floods the page. Big vertical wordmark, pill buttons.' },
  { id: 'carton', name: 'Carton', note: 'Laid out like the box: ruled panels, small caps labels, square.' },
]

export function StoreProvider({ children }) {
  const fromUrl = new URLSearchParams(location.hash.split('?')[1] || '').get('v') || new URLSearchParams(location.search).get('v')
  const [variant, setVariant] = useState(() => (VARIANTS.some((v) => v.id === fromUrl) ? fromUrl : read('brth-variant-v1', 'quiet')))
  const [flavor, setFlavor] = useState('spearmint')
  const [lines, setLines] = useState(() => read('brth-cart-v1', []))
  const [open, setOpen] = useState(false)
  const [puff, setPuff] = useState(0)
  useEffect(() => write('brth-variant-v1', variant), [variant])
  useEffect(() => write('brth-cart-v1', lines), [lines])
  useEffect(() => { document.documentElement.dataset.v = variant }, [variant])

  const api = useMemo(() => {
    const packs = lines.reduce((a, l) => a + l.packs * l.qty, 0)
    const sub = lines.reduce((a, l) => a + l.price * l.qty, 0)
    return {
      variant, setVariant, flavor, setFlavor, f: FLAVORS[flavor],
      lines, open, setOpen, puff, packs, sub,
      freeShip: packs >= 2,
      count: lines.reduce((a, l) => a + l.qty, 0),
      add(line, { show = true } = {}) {
        setLines((x) => {
          const key = `${line.id}|${line.packs}|${line.every || 0}`
          const f = x.find((y) => y.key === key)
          return f ? x.map((y) => (y.key === key ? { ...y, qty: y.qty + (line.qty || 1) } : y)) : [...x, { ...line, qty: line.qty || 1, key }]
        })
        setPuff((p) => p + 1)
        if (show) setTimeout(() => setOpen(true), 450)
      },
      qty: (key, d) => setLines((x) => x.map((y) => (y.key === key ? { ...y, qty: Math.max(0, y.qty + d) } : y)).filter((y) => y.qty > 0)),
      toSub: (key) => setLines((x) => x.map((y) => (y.key === key && !y.every ? { ...y, every: 1, price: +(y.price * 0.8).toFixed(2), key: `${y.key}|s` } : y))),
      clear: () => setLines([]),
    }
  }, [variant, flavor, lines, open, puff])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
