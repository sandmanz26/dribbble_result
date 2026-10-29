import { createContext, useContext, useEffect, useReducer } from 'react'

// Saved on this phone under the project's own key. In the real product this lives on the server,
// scoped by club and coach, so a second coach can be added without moving any data.
const KEY = 'og-state-v1'

const fresh = () => ({
  setups: [
    { id: 'S-014', area: 'putting', exercise: 'OB-012', variant: 0, overrides: {}, created: 'Tue 27 Oct, 09:40', group: 'Juniors U16', used: 2 },
    { id: 'S-013', area: 'range', exercise: 'OB-005', variant: 0, overrides: {}, created: 'Mon 26 Oct, 17:15', group: 'Private lesson', used: 1 },
  ],
  photos: {}, // area id -> { src, cam } for photos the coach took in this prototype
  seq: 14,
})
function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.setups) return { ...fresh(), ...s, photos: {} } } catch { /* first visit */ } return fresh() }

function reducer(s, a) {
  switch (a.type) {
    case 'save': { const seq = s.seq + 1; return { ...s, seq, setups: [{ ...a.setup, id: `S-${String(seq).padStart(3, '0')}`, used: 0 }, ...s.setups] } }
    case 'update': return { ...s, setups: s.setups.map((x) => (x.id === a.id ? { ...x, ...a.patch } : x)) }
    case 'remove': return { ...s, setups: s.setups.filter((x) => x.id !== a.id) }
    case 'photo': return { ...s, photos: { ...s.photos, [a.area]: a.photo } }
    case 'reset': return fresh()
    default: return s
  }
}
const Ctx = createContext(null)
export function StoreProvider({ children }) {
  const [s, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ ...s, photos: {} })) } catch { /* storage blocked */ } }, [s])
  return <Ctx.Provider value={{ s, dispatch }}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
