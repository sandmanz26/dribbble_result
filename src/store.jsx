import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CHATS, MY_PACKING, SHARED_PACKING } from './data/trip.js'

// Everything the user changes, in one saved object. The key is prefixed for this project.
const KEY = 'cv-state-v1'

const INITIAL = {
  onboarded: false,
  account: null, // set by sign-up: { phone, email, id: 'none' | 'pending' | 'done' }
  requests: {}, // groupId -> 'pending' | 'member' | 'waitlist'
  pollVotes: {}, // windowId -> 'yes' | 'maybe' | 'no'
  itinVotes: {}, // itemId -> 'yes' | 'no'
  itinAdded: [], // { id, day, time, title, where }
  expenses: [], // added by the user
  claims: Object.fromEntries(SHARED_PACKING.map((p) => [p.id, p.by])),
  mine: MY_PACKING,
  messages: {}, // chatId -> extra messages
  accepted: [], // message requests the user accepted
  blocked: [],
  reports: [],
  linked: [],
  saved: [],
  created: [], // groups the user started: { id, title, place, start, end, cap, budget, idOnly, who }
  read: [],
  prefs: { messages: 'verified', idOnly: false, hideProfile: false, shareTrip: true, contact: 'Aisha Rahman (sister)', live: false, push: true, emailNotes: false },
  theme: 'system',
}

const read = () => {
  try {
    return { ...INITIAL, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }
  } catch {
    return INITIAL
  }
}

const Ctx = createContext(null)

export function Store({ children }) {
  const [s, setS] = useState(read)
  const [toast, setToast] = useState(null)
  // Prototype only: make the next network call fail, or slow everything down.
  const [sim, setSim] = useState({ fail: false, slow: false })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s))
    } catch {}
  }, [s])

  useEffect(() => {
    const root = document.documentElement
    s.theme === 'system' ? root.removeAttribute('data-theme') : root.setAttribute('data-theme', s.theme)
  }, [s.theme])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(id)
  }, [toast])

  const set = useCallback((patch) => setS((cur) => ({ ...cur, ...(typeof patch === 'function' ? patch(cur) : patch) })), [])
  const reset = useCallback(() => setS(INITIAL), [])

  const value = useMemo(() => {
    const messagesFor = (id) => [...(CHATS[id]?.messages || []), ...(s.messages[id] || [])]
    const send = (id, text, from = 'nadia') =>
      set((c) => ({ messages: { ...c.messages, [id]: [...(c.messages[id] || []), { id: `m${Date.now()}`, from, at: 'Now', text }] } }))
    return { s, set, reset, toast, notify: setToast, sim, setSim, messagesFor, send }
  }, [s, set, reset, toast, sim])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)

// A fake network call with a real delay, so screens have honest loading and error states.
export function useFetch(deps = []) {
  const { sim } = useStore()
  const [state, setState] = useState('loading')
  const [nonce, setNonce] = useState(0)
  useEffect(() => {
    setState('loading')
    const id = setTimeout(() => setState(sim.fail ? 'error' : 'ready'), sim.slow ? 1800 : 450)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce, sim.fail, sim.slow, ...deps])
  return [state, () => setNonce((n) => n + 1)]
}
