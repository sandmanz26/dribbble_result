// "Continue your quote" row for returning visitors. The draft is saved locally on every change;
// this is where it is offered back, above the quote starter on both home directions.
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { money, SERVICES } from '../data/services.js'
import { vehicleLabel } from '../data/vehicles.js'
import { Alert, Button } from '../ui/index.jsx'
import { UXNote } from '../ui/UXNote.jsx'
import { currentTotal, holdText, useDraft } from './draft.jsx'

export function ResumeQuote() {
  const { draft, reset } = useDraft()
  if (!draft.vehicle || !draft.lastStep || draft.lastStep === 'vehicle') return null
  const total = currentTotal(draft)
  const parts = [vehicleLabel(draft.vehicle), draft.service && SERVICES[draft.service].name.toLowerCase(), total != null && money(total)].filter(Boolean)
  return (
    <section className="resume note-anchor" aria-labelledby="resume-title">
      <UXNote id="resume" className="uxnote-corner" />
      <div className="resume-text">
        <h2 id="resume-title" className="resume-title">Continue your quote</h2>
        <p className="muted small">
          {parts.join(', ')}.{total != null && ` ${holdText(draft)}.`}
        </p>
      </div>
      <div className="row-actions">
        <Button to={`/quote/${draft.lastStep}`} iconEnd={ArrowRight}>Continue where you left off</Button>
        <Button variant="ghost" icon={RotateCcw} onClick={reset}>Start over</Button>
      </div>
    </section>
  )
}

// Shown once after "Save and exit" in the flow.
export function SavedNotice() {
  const loc = useLocation()
  const [open, setOpen] = useState(Boolean(loc.state?.saved))
  if (!open) return null
  return (
    <Alert
      tone="success"
      title="Saved. Your quote is here when you come back."
      action={<Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Dismiss</Button>}
    />
  )
}
