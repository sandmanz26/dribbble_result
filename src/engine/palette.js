// The whole UI uses one 16-entry palette. Every entry is snapped to RGB565, the
// 16-bit format the ILI9341 panel takes over SPI, so what you see here is exactly
// what the panel can show. Index 0 is the transparency key and is never drawn.

export function to565(hex) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return ((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3)
}

export function from565(v) {
  const r = (v >> 11) & 31, g = (v >> 5) & 63, b = v & 31
  return [(r << 3) | (r >> 2), (g << 2) | (g >> 4), (b << 3) | (b >> 2)]
}

const hex = (rgb) => '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('')

const SOURCE = [
  ['KEY', '#ff00ff', 'Transparency key. Never drawn.'],
  ['VOID', '#0a0b0e', 'Screen background'],
  ['PANEL', '#16181d', 'Cards and list rows'],
  ['RAISE', '#262a31', 'Selected row, pressed state'],
  ['LINE', '#3d424b', 'Borders and dividers'],
  ['DIM', '#6b717c', 'Disabled and hint text'],
  ['SOFT', '#a5aab2', 'Secondary text'],
  ['PAPER', '#eceee8', 'Primary text'],
  ['SAFE', '#ff5a2c', 'Safelight. The one accent: focus, progress, record'],
  ['SAFE_D', '#9a2a12', 'Safelight shadow, two-tone sprites'],
  ['SAFE_L', '#ffb088', 'Safelight highlight'],
  ['OK', '#5ed38a', 'Done, connected'],
  ['OK_D', '#1e6a3d', 'OK shadow, grass in thumbnails'],
  ['WARN', '#ffd04a', 'Low battery, card almost full'],
  ['SKY', '#4e7ebe', 'Photo thumbnails only'],
  ['SKY_L', '#9cc4e8', 'Photo thumbnails only'],
]

export const PALETTE = SOURCE.map(([name, h, use], i) => {
  const v = to565(h)
  const rgb = from565(v)
  return { i, name, hex: hex(rgb), source: h, rgb565: v, use }
})

export const C = Object.fromEntries(PALETTE.map((p) => [p.name, p.i]))
export const RGB = PALETTE.map((p) => from565(p.rgb565))
