import { createContext, useContext, useEffect, useReducer } from 'react'
import { DEALS, FORMATS } from './data/studio.js'

const KEY = 'rs-state-v1'
const fresh = () => ({ stages: {}, done: {}, offers: {}, rates: Object.fromEntries(Object.entries(FORMATS).map(([k, f]) => [k, f.rate])), showRates: true, reminded: {}, toast: null })
function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.rates) return { ...fresh(), ...s, toast: null } } catch { /* private mode */ } return fresh() }

function reducer(s, a) {
  switch (a.type) {
    case 'stage': return { ...s, stages: { ...s.stages, [a.id]: a.stage }, toast: a.toast || null }
    case 'done': { const done = { ...s.done }; if (done[a.key]) delete done[a.key]; else done[a.key] = a.date; return { ...s, done, toast: done[a.key] ? a.toast : null } }
    case 'offer': return { ...s, offers: { ...s.offers, [a.id]: a.status }, toast: a.toast }
    case 'rate': return { ...s, rates: { ...s.rates, [a.key]: Math.max(0, a.value) } }
    case 'showRates': return { ...s, showRates: !s.showRates }
    case 'remind': return { ...s, reminded: { ...s.reminded, [a.id]: a.date }, toast: a.toast }
    case 'toast': return { ...s, toast: a.text }
    case 'reset': return { ...fresh(), toast: 'Demo reset' }
    default: return s
  }
}

const Ctx = createContext(null)
export function StoreProvider({ children }) {
  const [s, dispatch] = useReducer(reducer, null, load)
  useEffect(() => { try { const { toast, ...keep } = s; localStorage.setItem(KEY, JSON.stringify(keep)) } catch { /* ignore */ } }, [s])
  useEffect(() => { if (!s.toast) return; const t = setTimeout(() => dispatch({ type: 'toast', text: null }), 2800); return () => clearTimeout(t) }, [s.toast])
  // Deals with the stage the creator moved them to.
  const deals = DEALS.map((d) => ({ ...d, stage: s.stages[d.id] || d.stage }))
  return <Ctx.Provider value={{ s, dispatch, deals }}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
