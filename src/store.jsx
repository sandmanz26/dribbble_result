import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { holds as seedHolds } from './data/avails.js'

const KEY = 'rol-state-v1'

const fresh = () => ({
  as: 'crew', // crew | production
  scene: 'precall', // precall | rolling | wrapped
  theme: 'system',
  onboarded: false,
  holds: seedHolds.map((h) => ({ ...h })),
  challenge: 'offer', // offer | sent | won | declined
  offers: {}, // jobId -> 'pencil2' | 'pencil1' | 'sent'
  saved: ['northlight-gaffer'],
  late: null, // { mins, reason }
  crew: {}, // replier id -> 'pencil' | 'booked'
  toast: null,
})

// Review links (#/avails?as=crew, #/?scene=rolling) skip the first-run screen
// on the very first visit, before any route decides where to go.
function fromLink() {
  const q = new URLSearchParams(window.location.hash.split('?')[1] || '')
  const patch = {}
  if (['crew', 'production'].includes(q.get('as'))) patch.as = q.get('as')
  if (['precall', 'rolling', 'wrapped'].includes(q.get('scene'))) patch.scene = q.get('scene')
  const path = window.location.hash.replace(/^#/, '').split('?')[0]
  if (Object.keys(patch).length || (path && path !== '/' && path !== '/welcome')) patch.onboarded = true
  return patch
}

function load() {
  return { ...loadSaved(), ...fromLink() }
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      const base = fresh()
      // Old or broken saved state falls back to the seed instead of crashing.
      if (!Array.isArray(saved.holds)) delete saved.holds
      if (!Array.isArray(saved.saved)) delete saved.saved
      return { ...base, ...saved, toast: null }
    }
  } catch {}
  return fresh()
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [s, setS] = useState(load)

  useEffect(() => {
    try {
      const { toast, ...keep } = s
      localStorage.setItem(KEY, JSON.stringify(keep))
    } catch {}
  }, [s])

  useEffect(() => {
    if (!s.toast) return
    const t = setTimeout(() => setS((p) => ({ ...p, toast: null })), 3200)
    return () => clearTimeout(t)
  }, [s.toast])

  const api = useMemo(() => {
    const set = (patch) => setS((p) => ({ ...p, ...(typeof patch === 'function' ? patch(p) : patch) }))
    return {
      set,
      toast: (text) => set({ toast: { text, id: Date.now() } }),
      reset: () => {
        try { localStorage.removeItem(KEY) } catch {}
        setS({ ...fresh(), onboarded: true })
      },
      toggleSave: (id) => set((p) => ({ saved: p.saved.includes(id) ? p.saved.filter((x) => x !== id) : [...p.saved, id] })),
      offer: (id, kind) => set((p) => ({ offers: { ...p.offers, [id]: kind } })),
      withdraw: (id) => set((p) => { const o = { ...p.offers }; delete o[id]; return { offers: o } }),
      // Second pencil asks to confirm. Mara challenges the first pencil holder.
      sendChallenge: () => set((p) => ({
        challenge: 'sent',
        holds: p.holds.map((h) => (h.id === 'halfway-house' ? { ...h, status: 'waiting' } : h)),
      })),
      // What happens when the 24 hours run out or the first pencil lets go.
      firstReleases: () => set((p) => ({
        challenge: 'won',
        holds: p.holds.map((h) =>
          h.id === 'paper-moon' ? { ...h, status: 'released' } : h.id === 'halfway-house' ? { ...h, status: 'confirmed' } : h),
      })),
      declineChallenge: () => set((p) => ({
        challenge: 'declined',
        holds: p.holds.map((h) => (h.id === 'halfway-house' ? { ...h, status: 'released' } : h)),
      })),
      releaseHold: (id) => set((p) => ({
        holds: p.holds.map((h) => (h.id === id ? { ...h, status: 'released' } : h)),
      })),
      crewAct: (who, kind) => set((p) => ({ crew: { ...p.crew, [who]: kind } })),
    }
  }, [])

  return <Ctx.Provider value={{ s, ...api }}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
