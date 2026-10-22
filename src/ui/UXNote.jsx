// Numbered annotation marker for review. Not product UI: hidden unless "UX notes" is on in the
// Prototype panel. Opens a small card with the recommendation, the reason and how to measure it.
import { useEffect, useId, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useBrand } from '../brand/BrandContext.jsx'
import { noteById, noteNumber } from '../data/uxnotes.js'

export function UXNote({ id, className = '' }) {
  const { uxNotes } = useBrand()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const cardId = useId()
  const note = noteById(id)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  if (!uxNotes || !note) return null
  const n = noteNumber(id)
  return (
    <span className={`uxnote ${className}`} ref={ref}>
      <button
        type="button"
        className="uxnote-pin"
        aria-expanded={open}
        aria-controls={cardId}
        aria-label={`UX note ${n}: ${note.title}`}
        onClick={() => setOpen(!open)}
      >
        {n}
      </button>
      {open && (
        <span className="uxnote-card" id={cardId} role="note">
          <span className="uxnote-head">
            <strong>{n}. {note.title}</strong>
            <button type="button" className="uxnote-close" aria-label="Close note" onClick={() => setOpen(false)}>
              <X size={16} aria-hidden />
            </button>
          </span>
          <span className="uxnote-why">{note.why}</span>
          <span className="uxnote-measure"><b>Measure:</b> {note.measure}</span>
        </span>
      )}
    </span>
  )
}
