import { STATUSES } from './data.js'
import { today } from './store.js'
import { diffDays } from './severance.js'

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
export const idr = (n) => 'Rp ' + Math.round(n || 0).toLocaleString('id-ID')
export const idrShort = (n) => n >= 1e9 ? 'Rp ' + (n / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' M' : 'Rp ' + (n / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt'

const D = (s) => new Date(s + 'T12:00:00')
export const fdate = (s) => s ? D(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
export const fshort = (s) => s ? D(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '-'
export const flong = (s) => D(s).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
export function rel(s) {
  const n = diffDays(s, today)
  if (n === 0) return 'today'
  if (n === 1) return 'tomorrow'
  if (n === -1) return 'yesterday'
  return n > 0 ? `in ${n} days` : `${-n} days ago`
}

const TONES = {
  stone: 'bg-stone-200/80 text-stone-700 dark:bg-stone-700/50 dark:text-stone-300',
  sky: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
  amber: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200',
  rose: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  lime: 'bg-lime-100 text-lime-900 dark:bg-lime-900/40 dark:text-lime-200',
  emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  ink: 'bg-ink text-ground',
}
const DOTS = { stone: 'bg-stone-400', sky: 'bg-sky-500', amber: 'bg-amber-500', teal: 'bg-teal-500', rose: 'bg-rose-500', red: 'bg-red-600', green: 'bg-green-600', lime: 'bg-lime-600', emerald: 'bg-emerald-600', ink: 'bg-ground' }
export const toneOf = (status) => STATUSES[status]?.tone || 'stone'
export const dot = (status) => DOTS[toneOf(status)]
export function pill(status, extra = '') {
  const s = STATUSES[status]
  return `<span class="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-medium whitespace-nowrap ${TONES[s.tone]} ${extra}"><span class="size-1.5 rounded-full ${DOTS[s.tone]}"></span>${esc(s.label)}</span>`
}

export const initials = (name) => name.split(' ').filter(Boolean).slice(0, 2).map((x) => x[0]).join('').toUpperCase()
const AV = ['bg-[#e9dccb] text-[#5b4126]', 'bg-[#d9e3dc] text-[#2e4b3a]', 'bg-[#dfdcea] text-[#3e3a5e]', 'bg-[#ebd8d6] text-[#6a2f2a]', 'bg-[#d8e1e8] text-[#2c4659]', 'bg-[#e6e3cf] text-[#55502a]']
export function avatar(name, size = 'size-9 text-xs') {
  let h = 0; for (const c of name) h = (h + c.charCodeAt(0)) % AV.length
  return `<span class="${size} ${AV[h]} shrink-0 rounded-full inline-grid place-items-center font-semibold" aria-hidden="true">${initials(name)}</span>`
}

export function toast(msg, tone = 'ink') {
  const box = document.getElementById('toasts')
  const el = document.createElement('div')
  el.className = 'rise pointer-events-auto flex items-center gap-2 rounded-[10px] bg-ink text-ground text-sm px-4 py-3 shadow-lg max-w-[92vw]'
  el.innerHTML = `<span class="icon-[majesticons--check-circle-line] size-5 shrink-0 ${tone === 'warn' ? 'hidden' : ''}"></span><span>${esc(msg)}</span>`
  box.appendChild(el)
  setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 320) }, 3200)
}

export function modal(html, { wide = false, onMount } = {}) {
  const dlg = document.createElement('dialog')
  dlg.className = `card p-0 w-[calc(100vw-32px)] ${wide ? 'max-w-[760px]' : 'max-w-[520px]'} max-h-[88vh] m-auto shadow-2xl`
  dlg.innerHTML = html
  document.body.appendChild(dlg)
  dlg.addEventListener('close', () => dlg.remove())
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close() })
  dlg.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dlg.close()))
  dlg.showModal()
  onMount?.(dlg)
  return dlg
}

export function modalHead(title, sub = '') {
  return `<div class="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-line">
    <div><h2 class="text-base font-semibold">${title}</h2>${sub ? `<p class="text-sm text-muted mt-0.5">${sub}</p>` : ''}</div>
    <button class="btn btn-quiet btn-sm -mr-2 -mt-1 px-2" data-close aria-label="Close"><span class="icon-[majesticons--close-line] size-5"></span></button></div>`
}

export function merge(text, vars) {
  return String(text).replace(/\{\{(\w+)\}\}/g, (m, k) => vars[k] ?? m)
}

export const on = (root, sel, ev, fn) => root.querySelectorAll(sel).forEach((el) => el.addEventListener(ev, (e) => fn(e, el)))
