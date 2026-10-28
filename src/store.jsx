import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { INSTRUMENTS, history, tick } from './data/market.js'
import { FUNDS, OPEN, CLOSED } from './data/account.js'
import { KYC, MOVES, TICKETS } from './data/staff.js'

// Everything a visitor changes in the demo, saved under one key prefixed for this project.
const KEY = 'gt-state-v1'
const INITIAL = {
  session: null, // 'client' or 'staff' once signed in
  signup: null, // the account created through the registration flow
  funds: FUNDS,
  open: OPEN,
  closed: CLOSED,
  kyc: {}, // id -> 'Approved' | 'Rejected' | 'More info'
  moves: {}, // id -> 'Released' | 'Returned'
  replies: {}, // ticket id -> [{ from, at, text }]
  solved: {}, // ticket id -> true
  access: {}, // client id -> 'Restricted' | 'Verified' (staff changes)
}
// Review links: #/client?demo=client or #/staff?demo=staff open that area signed in.
function demo() {
  const q = window.location.hash.split('?')[1]
  const d = q && new URLSearchParams(q).get('demo')
  return d === 'client' || d === 'staff' ? { session: d, who: 'demo' } : {}
}
const read = () => {
  let saved = {}
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {} } catch {}
  return { ...INITIAL, ...saved, ...demo() }
}

const Ctx = createContext(null)
export function Store({ children }) {
  const [s, setS] = useState(read)
  const [toast, setToast] = useState(null)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch {} }, [s])
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(null), 5000); return () => clearTimeout(id) }, [toast])
  const set = useCallback((p) => setS((c) => ({ ...c, ...(typeof p === 'function' ? p(c) : p) })), [])
  const value = useMemo(() => ({ s, set, reset: () => setS(INITIAL), toast, notify: setToast }), [s, set, toast])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)

// The demo price feed: a day of history per instrument, then a new tick every 1.5 seconds.
const PriceCtx = createContext(null)
export function Prices({ children }) {
  const [series, setSeries] = useState(() => Object.fromEntries(INSTRUMENTS.map((i) => [i.id, history(i.id)])))
  const open = useRef(Object.fromEntries(INSTRUMENTS.map((i) => [i.id, history(i.id)[0].p])))
  useEffect(() => {
    const id = setInterval(() => {
      if (document.hidden) return
      setSeries((cur) => {
        const next = {}
        for (const i of INSTRUMENTS) {
          const arr = cur[i.id]
          const last = arr[arr.length - 1]
          const p = tick(i.id, last.p)
          // Keep one point per five minutes; within the bucket, move the last point.
          const bucket = Math.floor(Date.now() / 300000) * 300000
          next[i.id] = last.t >= bucket ? [...arr.slice(0, -1), { t: last.t, p }] : [...arr.slice(1), { t: Date.now(), p }]
        }
        return next
      })
    }, 1500)
    return () => clearInterval(id)
  }, [])
  const value = useMemo(() => ({
    series,
    price: (id) => series[id][series[id].length - 1].p,
    change: (id) => { const a = series[id]; return (a[a.length - 1].p - open.current[id]) / open.current[id] },
  }), [series])
  return <PriceCtx.Provider value={value}>{children}</PriceCtx.Provider>
}
export const usePrices = () => useContext(PriceCtx)
