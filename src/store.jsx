import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { autoMap, build, readText } from './data/engine.js'

// What the associate has loaded and done, saved under one key prefixed for this project.
const KEY = 'fu-state-v1'
const INITIAL = {
  files: { plano: null, inv: null }, // { fileName, headers, rows }
  maps: { plano: {}, inv: {} },
  done: {}, // stop key -> units moved
  skipped: {}, // stop key -> reason
  view: 'place', // 'place' shows every location; 'item' combines a SKU's locations
  filter: 'todo',
}
const read = () => {
  try { return { ...INITIAL, ...(JSON.parse(localStorage.getItem(KEY)) || {}) } } catch { return INITIAL }
}

export const SAMPLE = { plano: 'samples/planogram-store-214.csv', inv: 'samples/inventory-store-214.csv' }

const Ctx = createContext(null)
export function Store({ children }) {
  const [s, setS] = useState(read)
  const [toast, setToast] = useState(null)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch {} }, [s])
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(null), 4500); return () => clearTimeout(id) }, [toast])
  const set = useCallback((p) => setS((c) => ({ ...c, ...(typeof p === 'function' ? p(c) : p) })), [])

  // A file arrives: keep its rows and guess its columns.
  const load = useCallback((kind, parsed) => {
    setS((c) => ({ ...c, files: { ...c.files, [kind]: parsed }, maps: { ...c.maps, [kind]: autoMap(parsed.headers, kind) }, done: {}, skipped: {} }))
  }, [])
  const loadSamples = useCallback(async () => {
    const [p, i] = await Promise.all([fetch(SAMPLE.plano).then((r) => r.text()), fetch(SAMPLE.inv).then((r) => r.text())])
    const pp = readText(p, 'planogram-store-214.csv')
    const ii = readText(i, 'inventory-store-214.csv')
    setS((c) => ({ ...c, files: { plano: pp, inv: ii }, maps: { plano: autoMap(pp.headers, 'plano'), inv: autoMap(ii.headers, 'inv') }, done: {}, skipped: {} }))
  }, [])

  const ready = s.files.plano && s.files.inv
  const result = useMemo(() => {
    if (!ready) return null
    const need = (k, ids) => ids.every((id) => s.maps[k][id] != null)
    if (!need('plano', ['sku', 'aisle', 'bay', 'shelf', 'facings']) || !need('inv', ['sku', 'floor', 'back'])) return { unmapped: true }
    return build(s.files.plano, s.files.inv, s.maps)
  }, [ready, s.files, s.maps])

  const value = useMemo(() => ({ s, set, load, loadSamples, result, toast, notify: setToast, reset: () => setS(INITIAL) }), [s, set, load, loadSamples, result, toast])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
