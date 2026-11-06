import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PEOPLE, PROGRAMS } from './data.js'

const KEY = 'pw-state-v1'
const Ctx = createContext(null)
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } }

export const ROLES = {
  ops: { id: 'ops', name: 'Maya Chen', title: 'Program lead, Pathwell', programs: PROGRAMS.map((p) => p.id) },
  hr: { id: 'hr', name: 'Daniel Okafor', title: 'HR partner, Northwind Logistics', programs: ['northwind'] },
}

export function StoreProvider({ children }) {
  const [st, setSt] = useState(() => ({ role: 'ops', coach: {}, nudged: [], proposed: [], ...load() }))
  const [toasts, setToasts] = useState([])
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(st)) } catch { /* private mode */ } }, [st])
  const toast = useCallback((t) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((x) => [...x, { id, t }])
    setTimeout(() => setToasts((x) => x.filter((y) => y.id !== id)), 3200)
  }, [])
  const api = useMemo(() => {
    const role = ROLES[st.role]
    const people = PEOPLE.filter((p) => role.programs.includes(p.program)).map((p) => ({ ...p, coach: st.coach[p.id] || p.coach }))
    return {
      role, people, toasts, toast,
      isHR: st.role === 'hr',
      nudged: st.nudged, proposed: st.proposed,
      setRole: (r) => setSt((x) => ({ ...x, role: r })),
      assign: (ids, coachId) => setSt((x) => ({ ...x, coach: { ...x.coach, ...Object.fromEntries(ids.map((i) => [i, coachId])) } })),
      nudge: (ids) => setSt((x) => ({ ...x, nudged: [...new Set([...x.nudged, ...ids])] })),
      propose: (key) => setSt((x) => ({ ...x, proposed: x.proposed.includes(key) ? x.proposed : [...x.proposed, key] })),
      reset: () => setSt({ role: st.role, coach: {}, nudged: [], proposed: [] }),
    }
  }, [st, toasts, toast])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
