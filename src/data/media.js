import pool from './portfolio.json'

// Portfolio stills are Unsplash photos (via Picsum) and openly licensed Wikimedia
// Commons images, credited under Profile > Photo credits. They are self-hosted as
// WebP in /public/portfolio at 480px and 1280px. Each creator references
// [category, index, duration?]; a duration marks the item as a video.
const ready = (cat) => (pool[cat] || []).filter((p) => p.file)
export function mediaSrc(cat, i, w = 480) {
  const list = ready(cat)
  return list.length ? `portfolio/${list[i % list.length].file}-${w <= 480 ? 480 : 1280}.webp` : null
}
export const mediaRatio = (cat, i) => {
  const list = ready(cat)
  const it = list.length ? list[i % list.length] : null
  return it && it.w && it.h ? it.w / it.h : 4 / 5
}
export const creatorMedia = (c, w) => c.media.map(([cat, i, duration], n) => ({ key: `${c.id}-${n}`, src: mediaSrc(cat, i, w), ratio: mediaRatio(cat, i), duration }))
export const coverOf = (c, w = 960) => mediaSrc(c.media[0][0], c.media[0][1], w)
export const mediaCredits = () => Object.values(pool).flat().filter((p) => p.file)
