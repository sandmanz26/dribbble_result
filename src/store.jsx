import { createContext, useContext, useEffect, useMemo, useState } from 'react'

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
const read = () => {
  try { return { ...INITIAL, ...(JSON.parse(localStorage.getItem(KEY)) || {}) } } catch { return INITIAL }
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
  const value = useMemo(() => ({
    s,
    set: (p) => setS((c) => ({ ...c, ...(typeof p === 'function' ? p(c) : p) })),
    reset: () => setS(INITIAL),
    toast, notify: setToast,
  }), [s, toast])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
