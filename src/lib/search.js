// Search the way office staff actually look people up: part of a name, a misspelling,
// an admission number, a class, or a parent's name or phone ending.
const fold = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

function within1(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false
  let i = 0, j = 0, edits = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue }
    if (++edits > 1) return false
    if (a.length > b.length) i++
    else if (b.length > a.length) j++
    else { i++; j++ }
  }
  return edits + (a.length - i) + (b.length - j) <= 1
}

export function fullName(s) {
  return `${s.first} ${s.last}`
}

// Returns [{ student, score, why }] best first. `why` tells the user what matched.
export function searchStudents(list, query) {
  const q = fold(query).trim()
  if (!q) return []
  const terms = q.split(/\s+/)
  const digits = q.replace(/\D/g, '')
  const out = []
  for (const s of list) {
    const first = fold(s.first), last = fold(s.last), pref = fold(s.preferred)
    let score = 0, why = 'Name'
    if (fold(s.id) === q || s.id.replace('-', '') === digits) { score = 100; why = 'Admission no.' }
    else if (digits.length >= 3 && s.id.replace('-', '').includes(digits)) { score = 60; why = 'Admission no.' }
    else if (fold(s.cls) === q || `grade ${s.grade}` === q) { score = 40; why = 'Class' }
    else {
      let all = true, sum = 0
      for (const t of terms) {
        let best = 0
        for (const w of [first, last, pref]) {
          if (!w) continue
          if (w === t) best = Math.max(best, 30)
          else if (w.startsWith(t)) best = Math.max(best, 22)
          else if (t.length >= 4 && within1(w.slice(0, t.length + 1), t)) best = Math.max(best, 14)
          else if (t.length >= 4 && within1(w, t)) best = Math.max(best, 14)
          else if (t.length >= 3 && w.includes(t)) best = Math.max(best, 10)
        }
        if (fold(s.cls) === t) best = Math.max(best, 12)
        if (!best) { all = false; break }
        sum += best
      }
      if (all) score = sum
      if (!score) {
        for (const g of s.guardians) {
          if (terms.every((t) => fold(g.name).split(' ').some((w) => w.startsWith(t)))) { score = 18; why = `Guardian, ${g.name}`; break }
          if (digits.length >= 4 && g.phone.replace(/\D/g, '').endsWith(digits)) { score = 20; why = `Guardian phone, ${g.name}`; break }
        }
      }
      if (score && score < 20 && why === 'Name') why = 'Similar spelling'
    }
    if (score) out.push({ student: s, score: score - (s.status === 'withdrawn' ? 5 : 0), why })
  }
  return out.sort((a, b) => b.score - a.score || a.student.last.localeCompare(b.student.last))
}

export function applyFilters(list, f) {
  return list.filter((s) =>
    (!f.grades.length || f.grades.includes(s.grade)) &&
    (!f.houses.length || f.houses.includes(s.house)) &&
    (!f.status.length || f.status.includes(s.status)) &&
    (!f.flags.includes('health') || s.health.allergies.length + s.health.conditions.length > 0) &&
    (!f.flags.includes('support') || s.health.support.length > 0) &&
    (!f.flags.includes('incomplete') || s.missing.length > 0) &&
    (!f.flags.includes('noPhoto') || !s.consents.photo),
  )
}

export const EMPTY_FILTERS = { grades: [], houses: [], status: [], flags: [] }
export const filterCount = (f) => f.grades.length + f.houses.length + f.status.length + f.flags.length

// Find likely duplicates before a new record is saved.
export function findDuplicates(list, { first, last, dob }) {
  const f = fold(first), l = fold(last)
  if (f.length < 2 || l.length < 2) return []
  return list.filter((s) => {
    const sf = fold(s.first), sl = fold(s.last)
    const nameClose = (sl === l || within1(sl, l)) && (sf === f || within1(sf, f) || sf.startsWith(f) || f.startsWith(sf))
    return nameClose && (!dob || s.dob === dob || nameClose)
  }).slice(0, 3)
}
