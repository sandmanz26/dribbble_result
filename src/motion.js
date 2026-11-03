import { useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'

export const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Pointer tilt with a damped spring: the object leans toward the pointer and settles back on leave.
// Writes --rx, --ry (degrees) and --gx, --gy (0..100, for the foil sheen) on the element.
export function useTilt({ max = 10, stiffness = 0.12, damping = 0.78 } = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced() || !window.matchMedia('(hover: hover)').matches) return
    let tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0, gx = 50, gy = 50
    const tick = () => {
      vx = (vx + (tx - x) * stiffness) * damping
      vy = (vy + (ty - y) * stiffness) * damping
      x += vx; y += vy
      el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`)
      el.style.setProperty('--gx', `${gx.toFixed(1)}%`)
      el.style.setProperty('--gy', `${gy.toFixed(1)}%`)
      if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) + Math.abs(vy) > 0.0005) raf = requestAnimationFrame(tick)
      else raf = 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick) }
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
      tx = px * 2 - 1; ty = py * 2 - 1; gx = px * 100; gy = py * 100
      el.dataset.live = '1'
      kick()
    }
    const leave = () => { tx = 0; ty = 0; gx = 50; gy = 50; delete el.dataset.live; kick() }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf) }
  }, [max, stiffness, damping])
  return ref
}

// Adds .is-in to every [data-reveal] child once it enters the viewport. Children stagger by --i.
export function useReveal(deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = root.querySelectorAll('[data-reveal]')
    if (reduced() || !('IntersectionObserver' in window)) { items.forEach((n) => n.classList.add('is-in')); return }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' })
    items.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
  return ref
}

// The product picture flies from where it was clicked into the basket in the header.
export function flyToCart(fromEl) {
  const to = document.querySelector('[data-cart-target]')
  if (!fromEl || !to || reduced()) return
  const a = fromEl.getBoundingClientRect(), b = to.getBoundingClientRect()
  const ghost = fromEl.cloneNode(true)
  ghost.removeAttribute('style')
  Object.assign(ghost.style, { position: 'fixed', left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`, margin: 0, zIndex: 90, pointerEvents: 'none', objectFit: 'contain' })
  document.body.appendChild(ghost)
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2)
  const s = Math.max(0.08, 28 / Math.max(a.width, a.height))
  const anim = ghost.animate([
    { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 80}px) scale(${(1 + s) / 2}) rotate(-8deg)`, opacity: 1, offset: 0.55 },
    { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(-14deg)`, opacity: 0.2 },
  ], { duration: 720, easing: 'cubic-bezier(.5,0,.2,1)' })
  anim.onfinish = () => {
    ghost.remove()
    to.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 320, easing: 'cubic-bezier(.3,1.6,.5,1)' })
  }
}

// Route change inside a view transition when the browser has one: the product picture keeps its place.
export function withTransition(fn) {
  if (!document.startViewTransition || reduced()) { fn(); return }
  document.startViewTransition(() => flushSync(fn))
}

// A link that changes route inside a view transition, so the product picture travels to the product page.
import { createElement, forwardRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
export const TLink = forwardRef(function TLink({ to, onClick, ...rest }, ref) {
  const nav = useNavigate()
  return createElement(Link, { to, ref, ...rest, onClick: (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    if (!document.startViewTransition || reduced()) return
    e.preventDefault()
    withTransition(() => nav(to))
  } })
})
