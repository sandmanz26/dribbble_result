import { PRODUCTS, CATS } from './data/products.js'

// Arabic normalisation: hamza forms, taa marbuta, alef maqsura, tatweel and harakat fold together,
// Arabic-Indic digits become Latin, and Latin is lower-cased. So "لبنه", "لبنة" and "labne" can meet.
export function norm(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 9
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) m[0][j] = j
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return m[a.length][b.length]
}

const index = PRODUCTS.map((p) => ({ p, words: [p.ar, p.en, ...p.alt, CATS.find((c) => c.id === p.cat).ar, CATS.find((c) => c.id === p.cat).en].map(norm) }))

// Returns products with how each matched: exact, starts with, other spelling, or close (typo).
export function search(q) {
  const t = norm(q)
  if (!t) return []
  const out = []
  for (const { p, words } of index) {
    let score = 0, how = ''
    for (const w of words) {
      if (w === t) { score = Math.max(score, 100); how = how || 'exact' }
      else if (w.startsWith(t) || w.split(' ').some((x) => x.startsWith(t))) { score = Math.max(score, 80); how = how || 'starts' }
      else if (t.length >= 3 && w.includes(t)) { score = Math.max(score, 60); how = how || 'contains' }
      else if (t.length >= 4 && w.split(' ').some((x) => lev(x, t) <= (t.length > 6 ? 2 : 1))) { score = Math.max(score, 40); how = how || 'typo' }
    }
    const isAlt = score && !norm(p.ar).includes(t) && !norm(p.en).includes(t)
    if (score) out.push({ p, score: score - (isAlt ? 5 : 0), how: isAlt && how !== 'typo' ? 'alt' : how })
  }
  return out.sort((a, b) => b.score - a.score)
}
