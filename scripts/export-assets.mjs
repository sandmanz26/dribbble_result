// Renders every sprite sheet in src/data/assets.js at 1x and 2x for each wear stage, writes
// layered SVG sources for the rotating parts, and a manifest the plugin developer can load.
//
//   npm run build && npx vite preview --port 4174 &
//   node scripts/export-assets.mjs http://localhost:4174
//
// Needs Playwright with Chromium. Set PLAYWRIGHT_PATH if it is not resolvable from here.
import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { ASSETS, fileName } from '../src/data/assets.js'
import { CONTROLS, HATCH, JACKS, KNOB_R, PADS, PANEL, SCREWS, STEP, WEAR } from '../src/data/controls.js'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright')
const BASE = process.argv[2] || 'http://localhost:4174'
const OUT = 'public/sprites'
const LAYERED = ['knob-lg', 'knob-md', 'knob-sm', 'selector', 'momentary']

const browser = await chromium.launch()
const files = []
for (const scale of [1, 2]) {
  const ctx = await browser.newContext({ deviceScaleFactor: scale, viewport: { width: 1400, height: 900 } })
  const page = await ctx.newPage()
  for (const a of ASSETS) {
    mkdirSync(`${OUT}/${a.id}`, { recursive: true })
    for (const wear of WEAR) {
      await page.goto(`${BASE}/#/render?asset=${a.id}&wear=${wear}`)
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(250)
      const path = `${OUT}/${a.id}/${fileName(a.id, wear, scale)}`
      await page.locator('#sheet').screenshot({ path, omitBackground: true })
      files.push(path.replace(`${OUT}/`, ''))
      if (scale === 1 && LAYERED.includes(a.id)) {
        const mid = Math.floor(a.frames / 2)
        const svg = await page.evaluate((f) => {
          const defs = document.querySelector('svg defs').outerHTML
          const el = document.querySelector(`#sheet svg[data-frame="${f}"][data-state="idle"]`).cloneNode(true)
          el.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
          el.insertAdjacentHTML('afterbegin', defs)
          return el.outerHTML
        }, mid)
        const named = svg.replace(/data-layer="([^"]+)"/g, 'id="$1"')
        writeFileSync(`${OUT}/${a.id}/${a.id}-${wear}.svg`, named)
        files.push(`${a.id}/${a.id}-${wear}.svg`)
      }
      console.log(scale + 'x', a.id, wear)
    }
  }
  await ctx.close()
}
await browser.close()

const layout = {
  panel: PANEL,
  units: 'Logical pixels at 1x. Multiply by 2 for the @2x assets.',
  controls: CONTROLS.map(({ fmt, ...c }) => ({
    ...c,
    sprite: c.kind === 'knob' ? `knob-${c.size}` : { selector: 'selector', toggle3: 'toggle3', bat: 'bat', momentary: 'momentary' }[c.kind],
    hitRadius: c.kind === 'knob' ? KNOB_R[c.size] + 16 : 28,
  })),
  steps: Array.from({ length: 16 }, (_, i) => ({ index: i, x: STEP.x0 + i * STEP.dx, y: STEP.y, ledY: STEP.ledY, sprite: 'step' })),
  scope: { x: 240, y: 142, w: 424, h: 196, drawnInCode: true },
  meter: { face: 'vu-face', needle: 'vu-needle', x: 732 - 8, y: 136 - 8, w: 200, h: 120 },
  hatch: { ...HATCH, bay: 'hatch-bay', screws: SCREWS, jacks: JACKS, pads: PADS },
}
writeFileSync(`${OUT}/layout.json`, JSON.stringify(layout, null, 2))
writeFileSync(`${OUT}/manifest.json`, JSON.stringify({ wear: WEAR, scales: [1, 2], sheets: ASSETS, files }, null, 2))
console.log(`Wrote ${files.length} files`)
