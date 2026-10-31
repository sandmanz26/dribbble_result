import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

// A slower, heavier scroll than v1: the page should feel like walking, not flicking.
export function startScroll() {
  if (reduced() || lenis) return
  lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.85, touchMultiplier: 1.2 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

export function goTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
}

export const pauseScroll = (on) => (on ? lenis?.stop() : lenis?.start())

// Lines rise from behind a mask as they enter: text is split once into line wrappers.
export function splitLines(el) {
  if (!el || el.dataset.split) return el?.querySelectorAll('.ln > span') || []
  const words = el.textContent.trim().split(/\s+/)
  el.textContent = ''
  const spans = words.map((w) => { const s = document.createElement('span'); s.textContent = w; el.appendChild(s); el.appendChild(document.createTextNode(' ')); return s })
  const lines = []
  let top = null
  for (const s of spans) { if (s.offsetTop !== top) { lines.push([]); top = s.offsetTop } lines[lines.length - 1].push(s.textContent) }
  for (let i = 0; i < lines.length; i++) lines[i] = lines[i].join(' ')
  el.innerHTML = lines.map((l) => `<span class="ln"><span>${l}</span></span>`).join('')
  el.dataset.split = '1'
  el.dataset.text = words.join(' ')
  return el.querySelectorAll('.ln > span')
}

export { gsap, ScrollTrigger }
