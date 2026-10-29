import { createContext, useContext, useEffect, useReducer } from 'react'
import { ROLES, PEOPLE } from './data/world.js'

// Everything a reviewer changes is kept in this browser under the project's own key.
const KEY = 'sv-state-v1'

const fresh = () => ({
  role: 'owner',
  decided: {}, // decision id -> { status, by, at, note, picks }
  log: [], // AI log entries added during the session
  holds: [], // { product, store, client, hours, by, at }
  sales: [], // completed sales
  thread: [], // assistant conversation: { q, answerId | null }
  panel: false, // assistant side panel open
  guide: null, // { id, step }
  undone: [],
  rules: {}, // rule id -> level override
  learned: ['hold-intro'],
})

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.role) return { ...fresh(), ...s, panel: false, guide: null } } catch { /* first visit */ }
  return fresh()
}

function reducer(s, a) {
  switch (a.type) {
    case 'role': return { ...s, role: a.role, thread: [] }
    case 'decide': return { ...s, decided: { ...s.decided, [a.id]: { status: a.status, by: a.by, at: a.at, note: a.note, picks: a.picks } }, log: a.log ? [a.log, ...s.log] : s.log }
    case 'undoDecision': { const d = { ...s.decided }; delete d[a.id]; return { ...s, decided: d, log: [{ id: `L-${Date.now()}`, when: 'Just now', what: `Undid ${a.id}`, detail: 'Nothing had shipped yet', kind: 'undo' }, ...s.log] } }
    case 'undoLog': return { ...s, undone: [...s.undone, a.id] }
    case 'hold': return { ...s, holds: [a.hold, ...s.holds] }
    case 'sale': return { ...s, sales: [a.sale, ...s.sales] }
    case 'ask': return { ...s, thread: [...s.thread, { q: a.q, answer: a.answer, key: Date.now() }], panel: a.panel ?? s.panel }
    case 'clearThread': return { ...s, thread: [] }
    case 'panel': return { ...s, panel: a.open }
    case 'guide': return { ...s, guide: a.guide }
    case 'rule': return { ...s, rules: { ...s.rules, [a.id]: a.level }, log: [{ id: `L-${Date.now()}`, when: 'Just now', what: `${a.by} changed “${a.name}” to ${a.levelName}`, detail: 'Autonomy changes are logged and only the owner can make them', kind: 'rule' }, ...s.log] }
    case 'learned': return { ...s, learned: [...new Set([...s.learned, a.id])] }
    case 'reset': return fresh()
    default: return s
  }
}

const Ctx = createContext(null)
export function StoreProvider({ children }) {
  const [s, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ ...s, panel: false, guide: null })) } catch { /* storage blocked */ } }, [s])
  const role = ROLES.find((r) => r.id === s.role)
  const me = PEOPLE[role.person]
  return <Ctx.Provider value={{ s, dispatch, role, me }}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
