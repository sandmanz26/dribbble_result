import { useMemo } from 'react'
import { StaticScreen } from '../ui/Screen.jsx'
import { PALETTE, C } from '../engine/palette.js'
import { SPRITES, colorsIn, spriteBytes, battery } from '../engine/sprites.js'
import { FONT, fontBytes } from '../engine/font.js'
import { initial, draw, goto, tick, CAMERAS } from '../engine/device.js'

// Every screen state worth showing, rebuilt from the same engine as the simulator.
const SHOTS = [
  ['Intro, curtains closing', (s) => { s.t = 520 }],
  ['Intro, logo', (s) => { s.t = 2500 }],
  ['Tutorial 1 of 4', (s) => { goto(s, 'tutorial') }],
  ['Tutorial 2 of 4', (s) => { goto(s, 'tutorial'); s.page = 1; s.t = 600 }],
  ['Home, no camera', (s) => { goto(s, 'home') }],
  ['Home, ready to sync', (s) => { s.cam = { ...CAMERAS[0] }; goto(s, 'home') }],
  ['Pair, choose link', (s) => { goto(s, 'pair') }],
  ['Pair, scanning', (s) => { goto(s, 'pair'); s.pair.phase = 'scan'; s.pair.method = 'wifi'; s.t = 700 }],
  ['Pair, cameras found', (s) => { goto(s, 'pair'); s.pair.method = 'wifi'; s.pair.phase = 'found'; s.pair.found = CAMERAS.filter((c) => c.link === 'wifi') }],
  ['Pair, check the code', (s) => { goto(s, 'pair'); s.pair.method = 'wifi'; s.pair.phase = 'code' }],
  ['Pair, storage mode', (s) => { goto(s, 'pair'); s.pair.phase = 'fail' }],
  ['Pair, connected', (s) => { s.cam = { ...CAMERAS[0] }; goto(s, 'pair'); s.pair.phase = 'done' }],
  ['Sync, running', (s) => { goto(s, 'sync') }],
  ['Sync, cable pulled', (s) => { goto(s, 'sync'); s.sync.phase = 'error'; s.sync.errorAt = 87; s.cam = null }],
  ['Sync, done', (s) => { goto(s, 'sync'); s.sync.done = s.sync.total; s.sync.phase = 'done' }],
  ['Remote trigger', (s) => { goto(s, 'trigger'); s.trigger.sel = 2 }],
  ['Time-lapse running', (s) => { goto(s, 'trigger'); Object.assign(s.trigger, { running: true, taken: 17, next: 3200 }) }],
  ['Settings', (s) => { goto(s, 'settings'); s.sel = 1 }],
  ['System', (s) => { goto(s, 'system') }],
  ['Alert, battery low', (s) => { s.cam = { ...CAMERAS[0] }; goto(s, 'home'); s.battery = 1; s.alert = { kind: 'lowBattery' } }],
  ['Alert, shut down', (s) => { goto(s, 'system'); s.sel = 2; s.alert = { kind: 'shutdown' } }],
]

function shot(setup) {
  return (f) => { const s = initial(); s.firstRun = false; setup(s); tick(s, 0); draw(f, s) }
}

function SpriteTile({ sp }) {
  const draw = useMemo(() => (f) => { f.clear(C.VOID); f.sprite(sp, 0, 0) }, [sp])
  const n = [...colorsIn(sp)].filter((c) => c !== C.KEY).length
  return (
    <figure className="sprite">
      <div className="sprite-px" style={{ width: sp.w * 5, height: sp.h * 5 }}>
        <MiniCanvas sp={sp} />
      </div>
      <figcaption><b>{sp.name}</b><span>{sp.w}x{sp.h}, {n} colour{n > 1 ? 's' : ''}, {spriteBytes(sp)} B</span></figcaption>
    </figure>
  )
}

function MiniCanvas({ sp }) {
  const ref = (el) => {
    if (!el) return
    const ctx = el.getContext('2d')
    const img = ctx.createImageData(sp.w, sp.h)
    for (let y = 0; y < sp.h; y++) for (let x = 0; x < sp.w; x++) {
      const c = sp.map[sp.rows[y][x]]
      const i = (y * sp.w + x) * 4
      if (c === C.KEY) continue
      const p = PALETTE[c]
      const n = parseInt(p.hex.slice(1), 16)
      img.data[i] = n >> 16; img.data[i + 1] = (n >> 8) & 255; img.data[i + 2] = n & 255; img.data[i + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
  }
  return <canvas ref={ref} width={sp.w} height={sp.h} />
}

function exportSheet() {
  const list = Object.values(SPRITES)
  const cols = 8, cell = 16
  const c = document.createElement('canvas')
  c.width = cols * cell; c.height = Math.ceil(list.length / cols) * cell
  const ctx = c.getContext('2d')
  list.forEach((sp, k) => {
    const ox = (k % cols) * cell, oy = Math.floor(k / cols) * cell
    for (let y = 0; y < sp.h; y++) for (let x = 0; x < sp.w; x++) {
      const ci = sp.map[sp.rows[y][x]]
      ctx.fillStyle = ci === C.KEY ? '#ff00ff' : PALETTE[ci].hex
      ctx.fillRect(ox + x, oy + y, 1, 1)
    }
  })
  const a = document.createElement('a')
  a.download = 'hotshoe-sprites.png'
  a.href = c.toDataURL('image/png')
  a.click()
}

export default function Kit() {
  const groups = [['input', 'Controller inputs'], ['status', 'Status'], ['ui', 'Actions'], ['state', 'States']]
  const all = [...Object.values(SPRITES), battery(4), battery(1), battery(3, true)]
  const glyphs = Object.keys(FONT).filter((k) => k !== ' ')
  const fontDraw = useMemo(() => (f) => {
    f.clear(C.VOID)
    const rows = [glyphs.slice(0, 26).join(''), glyphs.slice(26).join('')]
    rows.forEach((r, i) => f.text(r, 4, 4 + i * 10, C.PAPER))
  }, [glyphs])

  return (
    <div className="page">
      <header className="page-head">
        <h1>Design kit</h1>
        <p>Everything here is drawn by the same code that runs the simulator, so the kit can't drift from the build.</p>
      </header>

      <section className="kit-block">
        <h2>Palette</h2>
        <p className="lede">16 entries, each snapped to RGB565. The left swatch is the hex we picked; the value under it is what the panel actually shows. One accent: safelight orange, borrowed from the red lamp of a darkroom.</p>
        <div className="pal-table">
          {PALETTE.map((p) => (
            <div key={p.i} className="pal-row">
              <span className="sw" style={{ background: p.i ? p.hex : 'repeating-conic-gradient(#ff00ff 0 25%, #000 0 50%) 0 0 / 8px 8px' }} />
              <b>{p.i}. {p.name}</b>
              <code>{p.hex}</code>
              <code>0x{p.rgb565.toString(16).padStart(4, '0').toUpperCase()}</code>
              <span>{p.use}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="kit-block">
        <h2>Font</h2>
        <p className="lede">Hotshoe 5x7, one bit per pixel. {glyphs.length} glyphs, {fontBytes()} bytes. Advance 6px, line 9px, so 40 characters fit across the screen. Titles use it at 2x, big numbers at 3x and 4x. Never scaled by a non-whole number.</p>
        <div className="font-spec"><StaticScreen draw={fontDraw} scale={3} label="Font specimen" /></div>
      </section>

      <section className="kit-block">
        <div className="kit-head">
          <h2>Icon set</h2>
          <button className="ghost" onClick={exportSheet}>Download sprite sheet PNG</button>
        </div>
        <p className="lede">Mostly 12x12, buttons 13x13. Stored at 2 bits per pixel, so each sprite can use at most 4 palette entries, one of them the transparent key (magenta in the exported sheet).</p>
        {groups.map(([g, l]) => (
          <div key={g} className="sprite-group">
            <h3>{l}</h3>
            <div className="sprites">{all.filter((sp) => sp.group === g).map((sp) => <SpriteTile key={sp.name} sp={sp} />)}</div>
          </div>
        ))}
      </section>

      <section className="kit-block">
        <h2>Screens</h2>
        <p className="lede">At 1x, the size of the real panel. Open them in the simulator to see them move.</p>
        <div className="gallery">
          {SHOTS.map(([label, setup]) => (
            <figure key={label}>
              <StaticScreen draw={shot(setup)} scale={1} label={label} />
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}
