import { useEffect } from 'react'

// Parts of each section rise into place once, in order. Content is visible without script:
// the hidden state is only applied after this runs and marks the page with .js-reveal.
export function useReveal(deps) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.documentElement.classList.add('js-reveal')
    const els = [...document.querySelectorAll('[data-reveal]')]
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return
        const kids = en.target.querySelectorAll(':scope > *')
        kids.forEach((k, i) => k.style.setProperty('--d', `${i * 75}ms`))
        en.target.classList.add('is-in')
        io.unobserve(en.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
    const t = setTimeout(() => els.forEach((e) => (e.classList.contains('is-in') ? null : io.observe(e))), 30)
    return () => { clearTimeout(t); io.disconnect() }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
