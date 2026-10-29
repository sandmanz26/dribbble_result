import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import * as I from '../ui/icons.js'

// "Show me": Selvedge walks a new advisor through the real screen instead of describing it.
// The person does each step themselves; the guide only points.
const GUIDES = {
  hold: [
    { at: 'stock-table', text: 'Every boutique’s stock for this piece is here, live. Free to sell is what is not already on hold.', next: true },
    { at: 'hold-pi', text: 'Plaza Indonesia has 2 free. Press Hold on its row.' },
    { at: 'hold-client', text: 'Choose who it is for. Your clients and today’s appointments come first.' },
    { at: 'hold-confirm', text: 'Confirm. Plaza Indonesia sees the hold at once and sends the piece to you.' },
    { at: null, text: 'Done. You held a piece in another boutique, and you can find it under the client and the piece. That is lesson 4 of 6.', end: true },
  ],
}

export default function Guide() {
  const { s, dispatch } = useStore()
  const nav = useNavigate()
  const [rect, setRect] = useState(null)
  const steps = s.guide ? GUIDES[s.guide.id] : null
  const st = steps?.[s.guide.step]

  useEffect(() => {
    if (!st) return
    let raf; let first = true
    const tick = () => {
      const el = st.at && document.querySelector(`[data-guide="${st.at}"]`)
      if (el) {
        if (first) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); first = false }
        const r = el.getBoundingClientRect()
        setRect((o) => (o && o.top === r.top && o.left === r.left && o.width === r.width && o.height === r.height ? o : { top: r.top, left: r.left, width: r.width, height: r.height }))
      } else setRect(null)
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [st])

  if (!st) return null
  const close = () => dispatch({ type: 'guide', guide: null })
  const pad = 6
  const below = rect && rect.top + rect.height + 180 < window.innerHeight
  const tip = rect ? { top: below ? rect.top + rect.height + 14 : Math.max(12, rect.top - 170), left: Math.min(Math.max(12, rect.left), window.innerWidth - 372) } : { top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }
  return (
    <div className="guide" role="dialog" aria-live="polite" aria-label="Guided steps">
      {rect && <span className="spot" style={{ top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }} />}
      {!rect && <span className="spot-dim" />}
      <div className="guide-tip ai" style={tip}>
        <p className="ai-tag"><I.Spark /> Show me · step {Math.min(s.guide.step + 1, steps.length - 1)} of {steps.length - 1}</p>
        <p>{st.text}</p>
        <div className="row-acts">
          {st.next && <button className="btn is-sm is-primary" onClick={() => dispatch({ type: 'guide', guide: { ...s.guide, step: s.guide.step + 1 } })}>Next</button>}
          {st.end ? <button className="btn is-sm is-primary" onClick={() => { close(); nav('/today') }}>Back to my day</button> : <button className="btn is-sm is-quiet" onClick={close}>Stop</button>}
        </div>
      </div>
    </div>
  )
}
