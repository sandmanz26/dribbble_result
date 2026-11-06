import { useEffect, useRef, useState } from 'react'
import { useStore } from './store.jsx'
import { FLAVORS } from './data.js'
import { reduced } from './App.jsx'
import Device from './Device.jsx'
import Mist from './Mist.jsx'

// Add to bag with the brief's tiny mist puff: the button shows a spray burst and "Added".
export function AddBtn({ line, children = 'Add to bag', className = '' }) {
  const s = useStore()
  const [added, setAdded] = useState(false)
  return (
    <button className={`btn add ${added ? 'added' : ''} ${className}`} onClick={() => { s.add(line); setAdded(true); setTimeout(() => setAdded(false), 1400) }}>
      <span className="puff" aria-hidden="true">{Array.from({ length: 8 }).map((_, i) => <i key={i} style={{ '--i': i }} />)}</span>
      <span>{added ? 'Added' : children}</span>
    </button>
  )
}

export function FlavorDots({ label = 'Flavor' }) {
  const s = useStore()
  return (
    <div className="dots" role="radiogroup" aria-label={label}>
      {Object.values(FLAVORS).map((f) => (
        <button key={f.id} role="radio" aria-checked={s.flavor === f.id} onClick={() => s.setFlavor(f.id)} style={{ '--c': f.field }}>
          <i /><span>{f.name}</span>
        </button>
      ))}
    </div>
  )
}

// The signature: a short entrance spray on first visit, then the visitor scrolls a bigger spray.
export function useTwistHero() {
  const sec = useRef(null)
  const mist = useRef(null)
  const [open, setOpen] = useState(reduced() ? 1 : 0)
  const [intro, setIntro] = useState(() => { if (reduced()) return 'done'; try { return sessionStorage.getItem('brth-intro') ? 'done' : 'play' } catch { return 'done' } })
  const last = useRef(0)
  const nozzle = () => { const d = sec.current?.querySelector('.device'); if (!d) return [0.5, 0.35]; const r = d.getBoundingClientRect(); return [(r.left + r.width / 2) / innerWidth, (r.top + r.height * 0.1) / innerHeight] }

  // Part 1: entrance, about 2 seconds, skipped by any input.
  useEffect(() => {
    if (intro !== 'play') return
    try { sessionStorage.setItem('brth-intro', '1') } catch { /* */ }
    const ts = []
    const at = (ms, fn) => ts.push(setTimeout(fn, ms))
    at(300, () => setOpen(0.35))
    at(800, () => setOpen(1))
    at(1100, () => { const [x, y] = nozzle(); mist.current?.burst(x, y, innerWidth < 700 ? 110 : 220, 1) })
    at(1400, () => setIntro('reveal'))
    at(2400, () => { setOpen(0); setIntro('done') })
    const skip = () => { ts.forEach(clearTimeout); setOpen(0); setIntro('done') }
    const evs = ['pointerdown', 'keydown', 'wheel', 'touchstart']
    evs.forEach((e) => addEventListener(e, skip, { once: true, passive: true }))
    return () => { ts.forEach(clearTimeout); evs.forEach((e) => removeEventListener(e, skip)) }
  }, []) // eslint-disable-line

  // Part 2: scroll position drives the frames while the hero is pinned.
  useEffect(() => {
    if (reduced()) return
    let raf = 0
    const run = () => {
      raf = 0
      const el = sec.current; if (!el) return
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)))
      const grow = Math.min(1, p / 0.3)
      el.style.setProperty('--grow', grow.toFixed(3))
      el.style.setProperty('--wipe', Math.min(1, Math.max(0, (p - 0.75) / 0.25)).toFixed(3))
      el.style.setProperty('--fade', Math.min(1, Math.max(0, (p - 0.45) / 0.2)).toFixed(3))
      if (p > 0.02) setOpen(Math.min(1, Math.max(0, (p - 0.3) / 0.2)))
      const m = mist.current
      if (m) {
        if (p > 0.5 && p < 0.78 && p > last.current) { const [x, y] = nozzle(); m.burst(x, y, innerWidth < 700 ? 18 : 40, 2.2) }
        m.haze(p < 0.5 ? 0 : p < 0.75 ? ((p - 0.5) / 0.25) * 0.5 : 0.5 * (1 - (p - 0.75) / 0.2))
      }
      last.current = p
    }
    const ask = () => { if (!raf) raf = requestAnimationFrame(run) }
    addEventListener('scroll', ask, { passive: true })
    return () => removeEventListener('scroll', ask)
  }, [])
  return { sec, mist, open, intro }
}

export function TwistStage({ open, flavor, className = '' }) {
  return <div className={`stage ${className}`}><div className="stage-dev"><Device flavor={flavor} open={open} /></div></div>
}
export { Mist }
