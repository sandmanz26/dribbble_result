import { RGB, C } from './palette.js'
import { FONT, ADVANCE, measure } from './font.js'
import { SPRITES } from './sprites.js'

export const W = 240
export const H = 320

// An 8-bit indexed framebuffer. Drawing writes palette indexes only, so the UI cannot
// use a colour the panel does not have, and there is no alpha channel to reach for.
// `present` diffs against the last frame: only changed pixels would go over SPI.
export class Frame {
  constructor() {
    this.buf = new Uint8Array(W * H)
    this.prev = new Uint8Array(W * H).fill(255)
    this.stats = { changed: 0, box: null, colors: 0 }
  }

  clear(c = C.VOID) { this.buf.fill(c) }

  px(x, y, c) {
    // Whole pixels only: a half-pixel y would land half a row (120px) off in the buffer.
    x = Math.floor(x); y = Math.floor(y)
    if (c === C.KEY || x < 0 || y < 0 || x >= W || y >= H) return
    this.buf[y * W + x] = c
  }

  rect(x, y, w, h, c) {
    const x0 = Math.max(0, x | 0), y0 = Math.max(0, y | 0)
    const x1 = Math.min(W, (x + w) | 0), y1 = Math.min(H, (y + h) | 0)
    for (let j = y0; j < y1; j++) this.buf.fill(c, j * W + x0, j * W + x1)
  }

  box(x, y, w, h, c) {
    this.rect(x, y, w, 1, c); this.rect(x, y + h - 1, w, 1, c)
    this.rect(x, y, 1, h, c); this.rect(x + w - 1, y, 1, h, c)
  }

  // Panel with 1px chamfered corners: the device's only "rounded" shape.
  panel(x, y, w, h, fill, border) {
    x = Math.round(x); y = Math.round(y)
    this.rect(x + 1, y, w - 2, h, fill)
    this.rect(x, y + 1, w, h - 2, fill)
    if (border != null) {
      this.rect(x + 1, y, w - 2, 1, border); this.rect(x + 1, y + h - 1, w - 2, 1, border)
      this.rect(x, y + 1, 1, h - 2, border); this.rect(x + w - 1, y + 1, 1, h - 2, border)
    }
  }

  // The stand-in for a translucent scrim: every other pixel becomes `c`.
  dither(x, y, w, h, c, density = 2) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) {
      if (density === 2 ? (i + j) % 2 === 0 : density === 4 ? i % 2 === 0 && j % 2 === 0 : (i + j) % 2 === 0 || (i % 2 === 0)) this.px(i, j, c)
    }
  }

  text(str, x, y, c = C.PAPER, { scale = 1, align = 'left', max } = {}) {
    x = Math.round(x); y = Math.round(y)
    let t = String(str).toUpperCase()
    if (max) while (t.length > 1 && measure(t, scale) > max) t = t.slice(0, -2) + '.'
    let cx = align === 'center' ? Math.round(x - measure(t, scale) / 2) : align === 'right' ? x - measure(t, scale) : x
    for (const ch of t) {
      const g = FONT[ch] || FONT['?']
      for (let gy = 0; gy < 7; gy++) for (let gx = 0; gx < 5; gx++) {
        if (g[gy][gx]) {
          if (scale === 1) this.px(cx + gx, y + gy, c)
          else this.rect(cx + gx * scale, y + gy * scale, scale, scale, c)
        }
      }
      cx += ADVANCE * scale
    }
    return cx
  }

  sprite(sp, x, y, { scale = 1, recolor } = {}) {
    if (typeof sp === 'string') sp = SPRITES[sp]
    if (!sp) return
    x = Math.round(x); y = Math.round(y)
    for (let j = 0; j < sp.h; j++) {
      const row = sp.rows[j]
      for (let i = 0; i < sp.w; i++) {
        let c = sp.map[row[i]]
        if (c === C.KEY || c == null) continue
        if (recolor && recolor[c] != null) c = recolor[c]
        if (scale === 1) this.px(x + i, y + j, c)
        else this.rect(x + i * scale, y + j * scale, scale, scale, c)
      }
    }
  }

  // Progress bar: track is LINE, fill is the accent. Square ends, 1px inset.
  bar(x, y, w, h, t, fill = C.SAFE) {
    this.rect(x, y, w, h, C.LINE)
    this.rect(x + 1, y + 1, Math.round((w - 2) * Math.max(0, Math.min(1, t))), h - 2, fill)
  }

  present(image) {
    const d = image.data
    let changed = 0, minX = W, minY = H, maxX = -1, maxY = -1
    const seen = new Set()
    for (let i = 0; i < this.buf.length; i++) {
      const c = this.buf[i]
      seen.add(c)
      if (c !== this.prev[i]) {
        changed++
        const x = i % W, y = (i / W) | 0
        if (x < minX) minX = x; if (x > maxX) maxX = x
        if (y < minY) minY = y; if (y > maxY) maxY = y
        const [r, g, b] = RGB[c]
        d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = 255
      }
    }
    this.prev.set(this.buf)
    this.stats = { changed, box: changed ? { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 } : null, colors: seen.size }
    return this.stats
  }
}

// What one frame costs on the wire. 16 bits per pixel at a 32 MHz SPI clock, which is
// what ILI9341 panels on a Pi run reliably (fbcp-ili9341 users report 32 to 64 MHz).
export const SPI_HZ = 32_000_000
export const msFor = (pixels) => (pixels * 16 * 1000) / SPI_HZ
export const FULL_FRAME_MS = msFor(W * H)

// Ordered dithering for photo thumbnails: 4x4 Bayer.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
export const bayer = (x, y) => (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16
