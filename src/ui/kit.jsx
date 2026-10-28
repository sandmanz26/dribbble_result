import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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

// A bottom sheet, the way the phone's own pickers and detail views open: it rises over the tab
// bar, dims the screen behind it, closes on the scrim, on Escape or when its handle is dragged
// down, keeps focus inside while open and gives it back to whatever opened it.
export function Sheet({ labelledBy, onClose, children, className = '' }) {
  const box = useRef(null)
  const drag = useRef(null)
  useEffect(() => {
    const back = document.activeElement
    const first = box.current?.querySelector('[aria-selected="true"], [data-autofocus]') || box.current?.querySelector('button, [href], input')
    first?.focus({ preventScroll: true })
    // Bring the chosen option into view inside the sheet, not by scrolling the page behind it.
    const sc = first?.closest('[data-scroll]') || box.current
    if (first && sc) sc.scrollTop = Math.max(0, first.offsetTop - sc.offsetTop - sc.clientHeight / 2 + first.offsetHeight / 2)
    const key = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
      if (e.key === 'Tab') {
        const f = [...box.current.querySelectorAll('button:not([disabled]), [href], input, [tabindex="0"]')]
        if (!f.length) return
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus() }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus() }
      }
    }
    document.addEventListener('keydown', key)
    return () => { document.removeEventListener('keydown', key); back?.focus?.({ preventScroll: true }) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // Pull the handle down to dismiss; a short pull springs back.
  const down = (e) => { drag.current = { y: e.clientY, dy: 0 }; e.currentTarget.setPointerCapture(e.pointerId) }
  const move = (e) => {
    if (!drag.current) return
    drag.current.dy = Math.max(0, e.clientY - drag.current.y)
    box.current.style.transform = `translateY(${drag.current.dy}px)`
  }
  const up = () => {
    if (!drag.current) return
    const far = drag.current.dy > 90
    drag.current = null
    box.current.style.transform = ''
    if (far) onClose()
  }
  // Rendered into the app's overlay layer, so it covers the whole phone screen wherever it opens.
  return createPortal(
    <>
      <div className="scrim" onClick={onClose} />
      <section ref={box} className={`bsheet ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <div className="grab-zone" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}><span className="grab" /></div>
        {children}
      </section>
    </>,
    document.getElementById('overlay') || document.body,
  )
}

export function Toast() {
  const { toast, notify } = useStore()
  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {toast && <div className="toast"><span>{toast.text}</span>{toast.undo && <button onClick={() => { toast.undo(); notify(null) }}>Undo</button>}</div>}
    </div>
  )
}
