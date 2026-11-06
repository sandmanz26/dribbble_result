import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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

// Two small dots, green and blue, always labeled: flavor is never told by color alone.
export function FlavorDots({ label = 'Flavor', className = '' }) {
  const s = useStore()
  return (
    <div className={`dots ${className}`} role="radiogroup" aria-label={label}>
      {Object.values(FLAVORS).map((f) => (
        <button key={f.id} role="radio" aria-checked={s.flavor === f.id} onClick={() => s.setFlavor(f.id)} style={{ '--c': f.field }}>
          <i /><span>{f.name}</span>
        </button>
      ))}
    </div>
  )
}

const clamp = (v) => Math.min(1, Math.max(0, v))
const phone = () => innerWidth < 760

// The signature: a short entrance spray on the first visit, then the visitor scrolls a bigger spray.
export function useTwistHero() {
  const sec = useRef(null)
  const mist = useRef(null)
  const [open, setOpen] = useState(reduced() ? 1 : 0)
  const [intro, setIntro] = useState(() => { if (reduced()) return 'done'; try { return sessionStorage.getItem('brth-intro') ? 'done' : 'play' } catch { return 'done' } })
  const last = useRef(0)
  const nozzle = () => { const d = sec.current?.querySelector('.stage .device'); if (!d) return [0.75, 0.3]; const r = d.getBoundingClientRect(); const p = sec.current.querySelector('.hero-pin').getBoundingClientRect(); return [(r.left + r.width / 2 - p.left) / p.width, (r.top + r.height * 0.08 - p.top) / p.height] }

  // Part 2: scroll position drives the frames while the hero is pinned.
  useEffect(() => {
    if (reduced()) return
    let raf = 0
    const run = () => {
      raf = 0
      const el = sec.current; if (!el) return
      const r = el.getBoundingClientRect()
      const p = clamp(-r.top / (r.height - innerHeight))
      el.style.setProperty('--grow', clamp(p / 0.3).toFixed(3))
      el.style.setProperty('--fade', clamp((p - 0.62) / 0.1).toFixed(3))
      el.style.setProperty('--wipe', clamp((p - 0.7) / 0.08).toFixed(3))
      el.classList.toggle('through', p > 0.8)
      setOpen(clamp((p - 0.3) / 0.2))
      const m = mist.current
      if (m) {
        if (p > 0.5 && p < 0.74 && p > last.current) { const [x, y] = nozzle(); m.burst(x, y, phone() ? 16 : 38, 2.6, 'left') }
        m.haze(p < 0.52 ? 0 : p < 0.72 ? ((p - 0.52) / 0.2) * 0.97 : p < 0.8 ? 0.97 : 0.97 * (1 - (p - 0.8) / 0.2))
      }
      last.current = p
    }
    const ask = () => { if (!raf) raf = requestAnimationFrame(run) }
    addEventListener('scroll', ask, { passive: true }); addEventListener('resize', ask)
    return () => { removeEventListener('scroll', ask); removeEventListener('resize', ask) }
  }, [])
  return { sec, mist, open, intro, setIntro }
}

// Part 1: the entrance, about 2 seconds, first visit of the session only. The page loads on a full
// flavor field with the closed device in the middle; it twists, the nozzle rises, mist bursts toward
// the viewer, and as it clears the headline, CTAs and nav are there underneath. Any input skips it.
export function IntroCover({ flavor, onDone }) {
  const [step, setStep] = useState('field')
  const [open, setOpen] = useState(0)
  const [to, setTo] = useState(null)
  const dev = useRef(null)
  const mist = useRef(null)
  useLayoutEffect(() => { try { sessionStorage.setItem('brth-intro', '1') } catch { /* private mode */ } }, [])
  useEffect(() => {
    const ts = []
    const at = (ms, fn) => ts.push(setTimeout(fn, ms))
    at(300, () => setOpen(0.3))
    at(800, () => setOpen(1))
    at(1100, () => { const r = dev.current.querySelector('svg').getBoundingClientRect(); mist.current?.burst((r.left + r.width / 2) / innerWidth, (r.top + r.height * 0.08) / innerHeight, phone() ? 100 : 220, 1.25, 'out') })
    at(1400, () => {
      const a = dev.current.querySelector('svg').getBoundingClientRect(), b = document.querySelector('.hero .stage .device')?.getBoundingClientRect()
      if (b) setTo(`translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(${b.height / a.height})`)
      setStep('clear'); setOpen(0)
    })
    at(3000, onDone)
    const skip = () => { ts.forEach(clearTimeout); onDone() }
    const evs = ['pointerdown', 'keydown', 'wheel', 'touchstart']
    evs.forEach((e) => addEventListener(e, skip, { once: true, passive: true }))
    return () => { ts.forEach(clearTimeout); evs.forEach((e) => removeEventListener(e, skip)) }
  }, []) // eslint-disable-line
  return createPortal(
    <div className={`intro-cover ${step}`} aria-hidden="true" style={{ '--field': flavor.field }}>
      <div className="ic-field" />
      <div className="ic-dev" ref={dev} style={{ transform: to || undefined }}><Device flavor={flavor} open={open} /></div>
      <Mist ref={mist} tint={flavor.mist} />
    </div>,
    document.body,
  )
}

export function TwistStage({ open, flavor, className = '' }) {
  return <div className={`stage ${className}`}><div className="stage-dev"><Device flavor={flavor} open={open} still={reduced()} /></div></div>
}

// Small looping illustration for the twist cards: 'twist' turns a quarter and back, 'rise' raises the nozzle.
// It only runs while on screen and holds the open state for reduced motion.
export function LoopDevice({ flavor, mode = 'twist' }) {
  const box = useRef(null)
  const [on, setOn] = useState(false)
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    if (reduced()) return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting))
    io.observe(box.current); return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!on) return
    const t = setInterval(() => setPhase((p) => (p + 1) % 2), 1500)
    return () => clearInterval(t)
  }, [on])
  const open = reduced() ? (mode === 'twist' ? 0.3 : 1) : mode === 'twist' ? (phase ? 0.3 : 0) : (phase ? 1 : 0.3)
  return <div className={`loopdev ${mode}`} ref={box}><Device flavor={flavor} open={open} /></div>
}
export { Mist }
