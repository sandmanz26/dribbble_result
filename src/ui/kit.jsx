import { useStore } from '../store.jsx'
import { STATUS } from '../data/engine.js'

// The aisle's colour class: aisles 1 to 4 take the store's four sign colours, endcaps take ink.
export const aisleClass = (a) => (a.kind === 'end' ? 'c-e' : `c-${((a.n - 1) % 4) + 1}`)
export const aisleTag = (a) => (a.kind === 'end' ? `E${a.n}` : a.code)

// The mark: four shelf tags in the four aisle colours.
export function Mark() {
  return <span className="mark" aria-hidden="true"><i style={{ background: 'var(--a1)' }} /><i style={{ background: 'var(--a2)' }} /><i style={{ background: 'var(--a3)' }} /><i style={{ background: 'var(--a4)' }} /></span>
}

export function Pill({ status, done }) {
  if (done != null) return <span className="pill done">Done, moved {done}</span>
  return <span className={`pill ${status}`}>{STATUS[status].label}</span>
}

export function Toast() {
  const { toast, notify } = useStore()
  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {toast && <div className="toast"><span>{toast.text}</span>{toast.undo && <button onClick={() => { toast.undo(); notify(null) }}>Undo</button>}</div>}
    </div>
  )
}
