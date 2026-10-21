import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// App state for the prototype, persisted to localStorage (no backend).
const KEY = 'proof-state-v1'
const seed = {
  user: null, // { name, email, role: 'client' | 'creator', specialty, area }
  saved: ['lucia-ferreyra', 'priya-raman'],
  bookings: [
    { id: 'PR-48213', creatorId: 'tom-bellamy', packageId: 'menu', date: '2026-09-14', time: '10:00', location: 'Borough Market kitchen', total: 307.4, status: 'completed' },
  ],
  requests: [
    { id: 'RQ-1', client: 'Grace Holloway', service: 'Headshots', date: '2026-10-30', time: '14:00', total: 180, status: 'new' },
    { id: 'RQ-2', client: 'Oliver Brandt', service: 'Personal brand', date: '2026-11-06', time: '10:00', total: 420, status: 'new' },
  ],
  uploads: [],
}

const load = () => {
  try { return { ...seed, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return seed }
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ ...state, uploads: [] })) } catch { /* private mode */ }
  }, [state])

  const api = useMemo(() => ({
    ...state,
    signUp: (user) => setState((s) => ({ ...s, user })),
    signOut: () => setState((s) => ({ ...s, user: null })),
    toggleSaved: (id) => setState((s) => ({ ...s, saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id] })),
    addBooking: (b) => setState((s) => ({ ...s, bookings: [b, ...s.bookings] })),
    cancelBooking: (id) => setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)) })),
    answerRequest: (id, status) => setState((s) => ({ ...s, requests: s.requests.map((r) => (r.id === id ? { ...r, status } : r)) })),
    addUpload: (u) => setState((s) => ({ ...s, uploads: [u, ...s.uploads] })),
    setRole: (role) => setState((s) => ({ ...s, user: s.user && { ...s.user, role } })),
  }), [state])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
