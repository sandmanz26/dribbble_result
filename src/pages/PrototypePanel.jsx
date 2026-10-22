// Reviewer panel. Not part of the product: switches brand and theme, and makes the
// mock API slow or fail so loading and error states can be seen inside the real flows.
// Desktop: a small toggle in the bottom right corner opens a popover. Under 820px the toggle is an
// icon button in the header row (ProtoTrigger) and the panel opens as a bottom sheet, so nothing
// floats over the content or the sticky flow actions.
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Monitor, Moon, SlidersHorizontal, Sun, X } from 'lucide-react'
import { useBrand } from '../brand/BrandContext.jsx'
import { useDraft } from '../flows/draft.jsx'
import { clearDemo, hasHistory, seedHistory } from '../data/history.js'
import { Check, IconButton, Segmented, Sheet } from '../ui/index.jsx'

const ProtoCtx = createContext({ open: false, setOpen: () => {} })

export function ProtoProvider({ children }) {
  const [open, setOpen] = useState(false)
  return <ProtoCtx.Provider value={{ open, setOpen }}>{children}</ProtoCtx.Provider>
}

const PHONE = '(max-width: 820px)'
function usePhone() {
  const [q] = useState(() => (typeof matchMedia === 'function' ? matchMedia(PHONE) : null))
  const [on, setOn] = useState(q ? q.matches : false)
  useEffect(() => {
    if (!q) return
    const fn = (e) => setOn(e.matches)
    q.addEventListener('change', fn)
    return () => q.removeEventListener('change', fn)
  }, [q])
  return on
}

// Header button for phones. Hidden from 821px up by CSS.
export function ProtoTrigger() {
  const { open, setOpen } = useContext(ProtoCtx)
  return <IconButton className="proto-trigger" icon={SlidersHorizontal} label="Prototype controls" aria-expanded={open} onClick={() => setOpen(!open)} />
}

function Controls({ close }) {
  const b = useBrand()
  const { reset } = useDraft()
  const [returning, setReturning] = useState(hasHistory)
  return (
    <>
      <div className="proto-group">
        <p className="proto-label">Design direction</p>
        <Segmented
          size="sm"
          label="Design direction"
          value={b.style}
          onChange={b.setStyle}
          options={[{ value: 'v1', label: 'V1 Editorial' }, { value: 'v2', label: 'V2 Job ticket' }]}
        />
      </div>
      <div className="proto-group">
        <p className="proto-label">Brand theme</p>
        <Segmented
          size="sm"
          label="Brand theme"
          value={b.brand}
          onChange={b.setBrand}
          options={[{ value: 'nubrakes', label: 'NuBrakes' }, { value: 'valvoline', label: 'Valvoline' }]}
        />
      </div>
      <div className="proto-group">
        <p className="proto-label">Colour scheme</p>
        <Segmented
          size="sm"
          label="Colour scheme"
          value={b.schemePref}
          onChange={b.setSchemePref}
          options={[
            { value: 'system', label: 'Auto', icon: Monitor },
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
          ]}
        />
      </div>
      <div className="proto-group">
        <p className="proto-label">Review</p>
        <Check checked={b.uxNotes} onChange={b.setUxNotes} detail="Numbered markers with the reason and the metric">UX notes</Check>
      </div>
      <div className="proto-group">
        <p className="proto-label">Simulate</p>
        <Check checked={b.slow} onChange={b.setSlow} detail="Every request takes 3x longer">Slow network</Check>
        <Check checked={b.failures} onChange={b.setFailures} detail="First try fails, retry works">Errors</Check>
        <Check
          checked={returning}
          onChange={(on) => {
            if (on) seedHistory()
            else clearDemo()
            setReturning(on)
          }}
          detail="Two finished NuBrakes visits from 2025 in My bookings"
        >
          Returning NuBrakes customer
        </Check>
      </div>
      <div className="proto-group proto-links">
        <Link to="/" onClick={close}>Home</Link>
        <Link to="/quote/vehicle" onClick={close}>Quote flow</Link>
        <Link to="/bookings" onClick={close}>My bookings</Link>
        <Link to="/system" onClick={close}>Design system</Link>
        <Link to="/notes" onClick={close}>Project notes</Link>
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            reset()
            try {
              localStorage.removeItem('nb-bookings')
              localStorage.removeItem('nb-migr-dismissed')
            } catch {}
            setReturning(false)
            close()
            location.hash = '#/'
          }}
        >
          Reset demo data
        </button>
      </div>
    </>
  )
}

export function PrototypePanel() {
  const b = useBrand()
  const { open, setOpen } = useContext(ProtoCtx)
  const phone = usePhone()
  const ref = useRef(null)
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open || phone) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && !e.target.closest?.('.proto-trigger') && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open, phone, setOpen])

  if (phone) {
    return (
      <Sheet open={open} onClose={close} title="Prototype controls">
        <div className="proto-sheet">
          <Controls close={close} />
        </div>
      </Sheet>
    )
  }

  return (
    <div className="proto" ref={ref}>
      {open && (
        <div className="proto-panel" role="dialog" aria-label="Prototype controls">
          <div className="proto-head">
            <p className="proto-title">Prototype controls</p>
            <button className="icon-btn" aria-label="Close" onClick={close}><X size={18} /></button>
          </div>
          <Controls close={close} />
        </div>
      )}
      <button className="proto-toggle" aria-label="Prototype controls" aria-expanded={open} onClick={() => setOpen(!open)}>
        <SlidersHorizontal size={16} aria-hidden /> <span>Prototype · {b.styleMeta.name}</span>
      </button>
    </div>
  )
}
