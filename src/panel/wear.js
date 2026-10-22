// Deterministic wear: every control gets the same chips and scratches on every render, keyed
// by its id, so exported filmstrips and the live panel match frame for frame.
export function rng(seedStr) {
  let h = 2166136261
  for (const ch of seedStr) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const LEVEL = { mint: 0, worn: 1, busted: 2 }
export const wearLevel = (w) => LEVEL[w] ?? 0

// Chips on a round edge: short arcs where the finish has broken off.
export function edgeChips(id, r, wear) {
  const n = [0, 3, 8][wearLevel(wear)]
  const rand = rng(`chips:${id}`)
  return Array.from({ length: n }, () => {
    const a = rand() * Math.PI * 2
    const span = 0.08 + rand() * (wear === 'busted' ? 0.28 : 0.12)
    const depth = 1.5 + rand() * (wear === 'busted' ? 4 : 2)
    return { a, span, depth, r }
  })
}

export function chipPath({ a, span, depth, r }) {
  const p = (ang, rad) => `${(Math.cos(ang) * rad).toFixed(2)} ${(Math.sin(ang) * rad).toFixed(2)}`
  const mid = a + span / 2
  return `M ${p(a, r)} A ${r} ${r} 0 0 1 ${p(a + span, r)} L ${p(mid + span * 0.15, r - depth)} L ${p(mid - span * 0.2, r - depth * 0.7)} Z`
}

// Fine scratches across a cap or a panel area.
export function scratches(id, w, h, wear) {
  const n = [0, 4, 11][wearLevel(wear)]
  const rand = rng(`scr:${id}`)
  return Array.from({ length: n }, () => {
    const x = rand() * w
    const y = rand() * h
    const len = 6 + rand() * (wear === 'busted' ? 40 : 18)
    const ang = rand() * Math.PI
    return { x1: x, y1: y, x2: x + Math.cos(ang) * len, y2: y + Math.sin(ang) * len, o: 0.2 + rand() * 0.4 }
  })
}
