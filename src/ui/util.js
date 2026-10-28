import { useEffect, useState } from 'react'

export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), ms); return () => clearInterval(t) }, [ms])
  return now
}
export const timeIn = (d, tz) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz })
export const partsIn = (d, tz) => {
  const p = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', weekday: 'short', timeZone: tz }).formatToParts(d)
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.find((x) => x.type === 'weekday').value)
  return { hour: +p.find((x) => x.type === 'hour').value, wd }
}
export function dateFmt(d, lang) {
  return d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}
export function nextFriday(now) {
  const d = new Date(now); const add = (5 - d.getDay() + 7) % 7 || 7
  d.setDate(d.getDate() + add); return d
}
export const scrollToId = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: reduce ? 'auto' : 'smooth' })
}
// Sections ease in once as they enter the screen.
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }), { threshold: 0.12 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
