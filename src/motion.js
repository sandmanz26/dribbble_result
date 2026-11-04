import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// One scroll loop writes --p (0..1 as the element crosses the screen), --pin (0..1 while a sticky child is held)
// and --in (0..1 as it enters) on each registered element. CSS does the moving.
const els = new Set()
let ticking = false
function frame() {
  ticking = false
  const vh = innerHeight
  document.documentElement.style.setProperty('--read', (scrollY / Math.max(1, document.documentElement.scrollHeight - vh)).toFixed(4))
  els.forEach((w) => {
    const r = w.el.getBoundingClientRect()
    if (r.bottom < -vh || r.top > vh * 2) return
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
    const span = r.height - vh
    const pin = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0
    const inn = Math.min(1, Math.max(0, (vh - r.top) / Math.min(vh, r.height)))
    w.el.style.setProperty('--p', p.toFixed(4))
    w.el.style.setProperty('--pin', pin.toFixed(4))
    w.el.style.setProperty('--in', inn.toFixed(4))
    w.cb?.({ p, pin, inn, r, vh })
  })
}
const kick = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame) } }
addEventListener('scroll', kick, { passive: true })
addEventListener('resize', kick)

export function useScroll(cb) {
  const ref = useRef(null)
  const cbRef = useRef(cb)
  cbRef.current = cb
  useEffect(() => {
    if (!ref.current || reduced()) return
    const w = { el: ref.current, cb: (v) => cbRef.current?.(v) }
    els.add(w); kick()
    return () => els.delete(w)
  }, [])
  return ref
}

export function useReveal(deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    const items = ref.current?.querySelectorAll('[data-r]') || []
    if (reduced()) { items.forEach((n) => n.classList.add('in')); return }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -10% 0px' })
    items.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
  return ref
}

// Route change as a colour block: a slab of the destination's colour sweeps up over the page,
// the route changes underneath, then the slab leaves through the top.
export function useWipe() {
  const nav = useNavigate()
  return (to, colour = 'var(--ink)') => {
    const w = document.getElementById('wipe')
    if (!w || reduced()) { nav(to); return }
    w.style.background = colour
    w.className = 'wipe on'
    const a = w.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 420, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' })
    a.onfinish = () => {
      nav(to)
      window.scrollTo(0, 0)
      requestAnimationFrame(() => {
        const b = w.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { duration: 520, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' })
        b.onfinish = () => { w.className = 'wipe'; a.cancel(); b.cancel() }
      })
    }
  }
}
