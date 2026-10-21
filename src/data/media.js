import pool from './portfolio.json'

// Portfolio stills are openly licensed images from Wikimedia Commons, found via
// Openverse and credited under Profile > Photo credits. Each creator references
// [category, index, duration?]; a duration marks the item as a video.
const SIZES = [330, 500, 960, 1280]
const sized = (p, w) => {
  const m = p.src.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/(\w\/\w\w)\/([^/]+)$/)
  const size = SIZES.find((s) => s >= w) || 1280
  if (!m || (p.w && p.w <= size)) return p.src
  return `${m[1]}/thumb/${m[2]}/${m[3]}/${size}px-${m[3]}`
}
export function mediaSrc(cat, i, w = 500) {
  const list = pool[cat] || []
  return list.length ? sized(list[i % list.length], w) : null
}
export const mediaRatio = (cat, i) => {
  const list = pool[cat] || []
  const it = list.length ? list[i % list.length] : null
  return it && it.w && it.h ? it.w / it.h : 4 / 5
}
export const creatorMedia = (c, w) => c.media.map(([cat, i, duration], n) => ({ key: `${c.id}-${n}`, src: mediaSrc(cat, i, w), ratio: mediaRatio(cat, i), duration }))
export const coverOf = (c, w = 960) => mediaSrc(c.media[0][0], c.media[0][1], w)
export const mediaCredits = () => Object.values(pool).flat()
