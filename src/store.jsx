import { createContext, useContext, useEffect, useReducer } from 'react'
import { TASKS } from './data/myelin.js'

const KEY = 'myl-state-v1'
const fresh = () => ({ added: [], budget: 'balanced', forgotten: [], pinned: ['F-07'], approved: [], declined: [], paused: [], corrected: [], conflict: null, toast: null })

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.budget) return { ...fresh(), ...s, added: (s.added || []).map((t) => ({ ...t, at: new Date(t.at) })), toast: null } } catch { /* first visit */ }
  return fresh()
}

function reducer(s, a) {
  switch (a.type) {
    case 'reset': return fresh()
    case 'toast': return { ...s, toast: a.text }
    case 'add': return { ...s, added: [...s.added, a.task] }
    case 'update': return { ...s, added: s.added.map((t) => (t.id === a.id ? { ...t, ...a.patch } : t)) }
    case 'budget': return { ...s, budget: a.key, toast: `Thinking budget set to ${a.label}` }
    case 'forget': return { ...s, forgotten: [...s.forgotten, a.id], toast: 'Forgotten. Answers stop using it from now on.' }
    case 'pin': return { ...s, pinned: s.pinned.includes(a.id) ? s.pinned.filter((x) => x !== a.id) : [...s.pinned, a.id] }
    case 'approve': return { ...s, approved: [...s.approved, a.id], toast: `Habit approved. The next "${a.name}" runs on Reflex.` }
    case 'decline': return { ...s, declined: [...s.declined, a.id], toast: 'Declined. It will keep thinking these through.' }
    case 'pause': return { ...s, paused: s.paused.includes(a.id) ? s.paused.filter((x) => x !== a.id) : [...s.paused, a.id] }
    case 'correct': return { ...s, corrected: [...s.corrected, a.id], toast: 'Thanks. The memory is updated and the correction is logged.' }
    case 'conflict': return { ...s, conflict: a.keep, toast: 'Kept one answer; the other now fades.' }
    default: return s
  }
}

const Ctx = createContext(null)
export function StoreProvider({ children }) {
  const [s, dispatch] = useReducer(reducer, null, load)
  useEffect(() => { try { const { toast, ...keep } = s; localStorage.setItem(KEY, JSON.stringify(keep)) } catch { /* storage off */ } }, [s])
  useEffect(() => { if (!s.toast) return; const id = setTimeout(() => dispatch({ type: 'toast', text: null }), 3000); return () => clearTimeout(id) }, [s.toast])
  const tasks = [...TASKS, ...s.added]
  return <Ctx.Provider value={{ s, dispatch, tasks }}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
