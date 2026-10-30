import { C } from './palette.js'
import { bayer } from './gfx.js'

// Photo thumbnails, drawn the way the device would: a downscaled preview mapped onto the
// palette with ordered dithering. Each "photo" is a seeded landscape so the card looks real.
function rand(seed) {
  let s = seed * 9301 + 49297
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280)
}

export function thumb(f, x0, y0, w, h, seed) {
  const r = rand(seed)
  const horizon = 0.45 + r() * 0.25
  const sunX = r(), sunY = 0.15 + r() * 0.25
  const night = r() < 0.25
  const peaks = Array.from({ length: 4 }, () => [r(), 0.08 + r() * 0.22])
  const water = r() < 0.35
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = x / w, v = y / h
    const d = bayer(x0 + x, y0 + y)
    let c
    let ridge = horizon
    for (const [px, ph] of peaks) ridge = Math.min(ridge, horizon - Math.max(0, ph - Math.abs(u - px) * 1.4))
    if (v < ridge) {
      const sun = Math.hypot((u - sunX) * 1.3, v - sunY)
      if (sun < 0.09) c = night ? C.PAPER : C.SAFE_L
      else if (night) c = v / ridge > d * 1.4 ? C.PANEL : C.VOID
      else c = v / ridge > d ? C.SKY : C.SKY_L
    } else if (v < horizon) {
      c = night ? C.RAISE : (v - ridge) / (horizon - ridge + 0.001) > d ? C.LINE : C.DIM
    } else if (water) {
      c = (v - horizon) / (1 - horizon) > d ? C.SKY : night ? C.PANEL : C.SKY_L
    } else {
      c = (v - horizon) / (1 - horizon) > d * 0.9 ? C.VOID : C.OK_D
    }
    f.px(x0 + x, y0 + y, c)
  }
}
