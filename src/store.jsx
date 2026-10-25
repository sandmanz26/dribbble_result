import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Everything the person changes, saved under one key prefixed for this project.
const KEY = 'td-state-v1'
const INITIAL = {
  onboarded: false,
  name: 'Lena',
  goal: 'calm',
  flags: [],
  reminder: '07:30',
  sound: 'rain',
  time: 'morning', // the demo's time of day: morning or evening
  checkin: null, // today's answers
  done: [], // step kinds finished today
  journal: [], // entries written in the demo
  minutesToday: 0,
  theme: 'system',
}
// Review links: #/ritual?demo=stormy opens the app signed in with that check-in answered,
// ?demo=evening does the same at night, ?demo=fresh signs in with no check-in yet.
function demoState() {
  const q = window.location.hash.split('?')[1]
  const demo = q && new URLSearchParams(q).get('demo')
  if (!demo) return {}
  const evening = demo === 'evening'
  const time = evening ? 'evening' : 'morning'
  return { onboarded: true, time, done: [], checkin: demo === 'fresh' ? null : { mood: evening ? 'tired' : demo, sleep: 6, energy: 2, stress: 4, minutes: 10, goal: 'calm', time } }
}
const read = () => {
  let saved = {}
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {} } catch {}
  return { ...INITIAL, ...saved, ...demoState() }
}

const Ctx = createContext(null)
export function Store({ children }) {
  const [s, setS] = useState(read)
  const [toast, setToast] = useState(null)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch {} }, [s])
  useEffect(() => {
    const r = document.documentElement
    s.theme === 'system' ? r.removeAttribute('data-theme') : r.setAttribute('data-theme', s.theme)
  }, [s.theme])
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(null), 4500); return () => clearTimeout(id) }, [toast])
  const set = useCallback((p) => setS((c) => ({ ...c, ...(typeof p === 'function' ? p(c) : p) })), [])
  const value = useMemo(() => ({
    s,
    set,
    reset: () => setS(INITIAL),
    toast, notify: setToast,
  }), [s, toast, set])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
