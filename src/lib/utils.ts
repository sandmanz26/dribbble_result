import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...v: ClassValue[]) => twMerge(clsx(v))

// "9 min ago", "2 h ago", "Mon"; the prototype keeps times relative to now.
export function ago(min: number) {
  if (min < 1) return 'just now'
  if (min < 60) return `${Math.round(min)} min ago`
  if (min < 60 * 24) return `${Math.floor(min / 60)} h ago`
  return `${Math.floor(min / 1440)} d ago`
}
export function clockAgo(min: number) {
  return new Date(Date.now() - min * 60000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
export function sla(min: number) {
  if (min < 0) return `${Math.abs(Math.round(min))} min late`
  if (min < 60) return `${Math.round(min)} min left`
  if (min < 1440) return `${Math.floor(min / 60)} h ${Math.round(min % 60)} min left`
  return `${Math.floor(min / 1440)} d left`
}
export const pct = (n: number) => `${Math.round(n * 100)}%`
