import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePortal } from '../store.jsx'

// Reviewer controls, kept apart from both designs: switch version, theme and data state.
export default function Prototype() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const nav = useNavigate()
  const { theme, setTheme, mode, setMode, resetDemo } = usePortal()
  const isV2 = loc.pathname.startsWith('/v2')
  const inPortal = /portal|today/.test(loc.pathname)

  const go = (v) => {
    const target = v === 2 ? (inPortal ? '/v2/today' : '/v2') : inPortal ? '/v1/portal' : '/v1'
    nav(target)
  }

  return (
    <div className={`proto ${isV2 ? 'proto-v2' : 'proto-v1'}`}>
      {open && (
        <div className="proto-card" role="dialog" aria-label="Prototype controls">
          <div>
            <h2>Version</h2>
            <div className="proto-seg">
              <button aria-pressed={!isV2} onClick={() => go(1)}>V1 Brief</button>
              <button aria-pressed={isV2} onClick={() => go(2)}>V2 Concept</button>
            </div>
          </div>
          <div>
            <h2>Theme</h2>
            <div className="proto-seg">
              {['system', 'light', 'dark'].map((x) => (
                <button key={x} aria-pressed={theme === x} onClick={() => setTheme(x)}>
                  {x === 'system' ? 'Auto' : x[0].toUpperCase() + x.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2>Data state</h2>
            <div className="proto-seg">
              {[['live', 'Live'], ['loading', 'Loading'], ['error', 'Error'], ['empty', 'Before 07:50']].map(([k, l]) => (
                <button key={k} aria-pressed={mode === k} onClick={() => setMode(k)}>{l}</button>
              ))}
            </div>
          </div>
          <p className="proto-note">Demo clock: Thursday 23 October 2026, 10:05, period 4. School, people and marks are sample data.</p>
          <button className="proto-link" onClick={() => { resetDemo(); setMode('live') }}>Reset relief assignments</button>
        </div>
      )}
      <button className="proto-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        Prototype · {isV2 ? 'V2' : 'V1'}
      </button>
    </div>
  )
}
