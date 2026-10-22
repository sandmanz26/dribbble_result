// Floating reviewer panel. Not part of the product: switches brand and theme, and makes the
// mock API slow or fail so loading and error states can be seen inside the real flows.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Monitor, Moon, SlidersHorizontal, Sun, X } from 'lucide-react'
import { useBrand } from '../brand/BrandContext.jsx'
import { useDraft } from '../flows/draft.jsx'
import { Check, Segmented } from '../ui/index.jsx'

export function PrototypePanel() {
  const b = useBrand()
  const { reset } = useDraft()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

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

  return (
    <div className="proto" ref={ref}>
      {open && (
        <div className="proto-panel" role="dialog" aria-label="Prototype controls">
          <div className="proto-head">
            <p className="proto-title">Prototype controls</p>
            <button className="icon-btn" aria-label="Close" onClick={() => setOpen(false)}><X size={18} /></button>
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
          </div>
          <div className="proto-group proto-links">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/quote/vehicle" onClick={() => setOpen(false)}>Quote flow</Link>
            <Link to="/bookings" onClick={() => setOpen(false)}>My bookings</Link>
            <Link to="/system" onClick={() => setOpen(false)}>Design system</Link>
            <Link to="/notes" onClick={() => setOpen(false)}>Project notes</Link>
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                reset()
                try { localStorage.removeItem('nb-bookings') } catch {}
                setOpen(false)
                location.hash = '#/'
              }}
            >
              Reset demo data
            </button>
          </div>
        </div>
      )}
      <button className="proto-toggle" aria-label="Prototype controls" aria-expanded={open} onClick={() => setOpen(!open)}>
        <SlidersHorizontal size={16} aria-hidden /> <span>Prototype</span>
      </button>
    </div>
  )
}
