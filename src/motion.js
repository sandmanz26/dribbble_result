import { useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'

export const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

// One rAF loop for every scroll effect on the page.
const subs = new Set()
let raf = 0
const tick = () => { raf = 0; subs.forEach((f) => f()) }
const ask = () => { if (!raf) raf = requestAnimationFrame(tick) }
if (typeof window !== 'undefined') {
  addEventListener('scroll', ask, { passive: true })
  addEventListener('resize', ask)
}
export function useScrollFx(fn, deps = []) {
  const f = useRef(fn); f.current = fn
  useEffect(() => {
    const run = () => f.current()
    subs.add(run); run()
    return () => subs.delete(run)
  }, deps) // eslint-disable-line
}

// Progress of an element through the viewport, 0 when its top hits the bottom, 1 when its bottom leaves the top.
export function through(el) {
  const r = el.getBoundingClientRect()
  return Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)))
}
// Progress while a tall section is pinned: 0 at its top, 1 when its end reaches the bottom of the screen.
export function pinned(el) {
  const r = el.getBoundingClientRect()
  const len = r.height - innerHeight
  return len <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / len))
}

// Reveal: anything with data-r fades up once. Uses data-in so React never wipes it on re-render.
export function useReveal(deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const els = root.querySelectorAll('[data-r]:not([data-in])')
    if (reduced() || !('IntersectionObserver' in window)) { els.forEach((e) => (e.dataset.in = '1')); return }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.dataset.in = '1'; io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, deps) // eslint-disable-line
  return ref
}

// Pointer tilt for anything that should feel like an object in the hand.
export function tilt(e) {
  if (reduced() || e.pointerType === 'touch') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`)
  el.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`)
  el.style.setProperty('--mx', `${(x * 100 + 50).toFixed(1)}%`)
  el.style.setProperty('--my', `${(y * 100 + 50).toFixed(1)}%`)
}
export function untilt(e) {
  const el = e.currentTarget
  el.style.removeProperty('--rx'); el.style.removeProperty('--ry')
}

// Route change inside a view transition, so a bag can travel from the card to its page.
export function transition(navigate, to, name) {
  const doc = document
  if (!doc.startViewTransition || reduced()) { navigate(to); scrollTo(0, 0); return }
  doc.documentElement.dataset.vt = name || 'page'
  const t = doc.startViewTransition(() => { flushSync(() => navigate(to)); scrollTo(0, 0) })
  t.finished.finally(() => { delete doc.documentElement.dataset.vt })
}
