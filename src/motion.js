import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

// Smooth scroll drives ScrollTrigger from one ticker, so scrubbed scenes never lag a frame
// behind the page. Skipped entirely for people who ask for less motion.
export function startScroll() {
  if (reduced() || lenis) return lenis
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: id === 'reserve' ? 0 : -20, duration: 1.4 })
  else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
}

export const getLenis = () => lenis
export { gsap, ScrollTrigger }
