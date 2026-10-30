import { useCallback, useEffect, useRef, useState } from 'react'
import Screen from '../ui/Screen.jsx'
import { initial, input, tick, draw, scenario, goto, SCREENS } from '../engine/device.js'
import { msFor, FULL_FRAME_MS, W, H } from '../engine/gfx.js'
import { PALETTE } from '../engine/palette.js'

const KEYS = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  z: 'a', Z: 'a', Enter: 'a', ' ': 'a', x: 'b', X: 'b', Backspace: 'b', Escape: 'b', m: 'menu', M: 'menu', p: 'pwr', P: 'pwr',
}
const FPS = 30

export default function Simulator() {
  const screen = useRef()
  const state = useRef(initial())
  const [stats, setStats] = useState({ changed: 0, colors: 0, peak: 0 })
  const [view, setView] = useState({ screen: 'boot', alert: null })
  const [overlay, setOverlay] = useState(true)
  const [held, setHeld] = useState(null)
  const [scale, setScale] = useState(2)

  const press = useCallback((btn) => {
    input(state.current, btn)
    setHeld(btn)
    setTimeout(() => setHeld((h) => (h === btn ? null : h)), 140)
  }, [])

  useEffect(() => {
    const fit = () => setScale(window.innerWidth < 560 ? Math.max(1, Math.floor((window.innerWidth - 90) / W * 10) / 10) : window.innerHeight < 780 || window.innerWidth < 900 ? 1.5 : 2)
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      const b = KEYS[e.key]
      if (!b || e.target.closest('input, textarea, select')) return
      e.preventDefault()
      if (!e.repeat || ['up', 'down', 'left', 'right'].includes(b)) press(b)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [press])

  // Fixed 30 fps loop, like the device's render task.
  useEffect(() => {
    let raf, last = performance.now(), acc = 0, peak = 0, n = 0
    const loop = (now) => {
      acc += now - last; last = now
      if (acc >= 1000 / FPS) {
        const dt = Math.min(100, acc); acc = 0
        tick(state.current, dt)
        const st = screen.current.paint((f) => draw(f, state.current))
        peak = Math.max(peak * 0.96, st.changed)
        if (++n % 6 === 0) {
          setStats({ ...st, peak })
          setView({ screen: state.current.screen, alert: state.current.alert?.kind })
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const ms = msFor(stats.changed)
  const budget = 1000 / FPS
  const btn = (b, label, cls = '') => (
    <button className={`hw ${cls} ${held === b ? 'is-down' : ''}`} onPointerDown={(e) => { e.preventDefault(); press(b) }} aria-label={label}>
      <span>{cls.includes('round') ? label : ''}</span>
    </button>
  )

  return (
    <div className="sim">
      <section className="device-wrap" aria-label="Hotshoe device simulator">
        <div className="device" style={{ '--s': scale }}>
          <div className="top-keys">
            <button className={`hw slim ${held === 'menu' ? 'is-down' : ''}`} onPointerDown={(e) => { e.preventDefault(); press('menu') }}>MENU</button>
            <button className={`hw slim ${held === 'pwr' ? 'is-down' : ''}`} onPointerDown={(e) => { e.preventDefault(); press('pwr') }}>PWR</button>
          </div>
          <div className="dpad" role="group" aria-label="D-pad">
            {btn('up', 'Up', 'd-up')}{btn('left', 'Left', 'd-left')}<span className="d-mid" />{btn('right', 'Right', 'd-right')}{btn('down', 'Down', 'd-down')}
          </div>
          <div className="bezel">
            <Screen ref={screen} scale={scale} overlay={overlay} label="Device screen, 240 by 320 pixels" />
          </div>
          <div className="ab">
            {btn('a', 'A', 'round a')}
            {btn('b', 'B', 'round b')}
          </div>
        </div>
        <p className="keys-hint">Keyboard: arrows, <kbd>Z</kbd> or <kbd>Enter</kbd> = A, <kbd>X</kbd> or <kbd>Esc</kbd> = B, <kbd>M</kbd> menu, <kbd>P</kbd> power</p>
      </section>

      <aside className="side">
        <section>
          <h2>Jump to</h2>
          <div className="chips">
            {SCREENS.map(([k, l]) => (
              <button key={k} className={view.screen === k ? 'is-on' : ''} onClick={() => goto(state.current, k)}>{l}</button>
            ))}
          </div>
        </section>
        <section>
          <h2>Make something happen</h2>
          <div className="chips">
            <button onClick={() => scenario(state.current, 'plugCamera')}>Plug in camera</button>
            <button onClick={() => scenario(state.current, 'unplug')}>Pull the cable</button>
            <button onClick={() => scenario(state.current, 'lowBattery')}>Battery low</button>
            <button onClick={() => scenario(state.current, 'cardFull')}>Pi card full</button>
            <button onClick={() => scenario(state.current, 'ptpFail')}>Camera in storage mode</button>
            <button onClick={() => scenario(state.current, 'reset')}>Restart from boot</button>
          </div>
          <p className="note">Try: Jump to Sync, then Pull the cable. Or set the camera to storage mode and pair over USB.</p>
        </section>
        <section className="meter">
          <h2>This frame on the hardware</h2>
          <dl>
            <div><dt>Colours on screen</dt><dd className={stats.colors > 16 ? 'bad' : ''}>{stats.colors} <small>of 16</small></dd></div>
            <div><dt>Pixels sent</dt><dd>{stats.changed.toLocaleString('en')} <small>of {(W * H).toLocaleString('en')}</small></dd></div>
            <div><dt>SPI time</dt><dd className={ms > budget ? 'bad' : ''}>{ms.toFixed(1)} ms <small>budget {budget.toFixed(1)}</small></dd></div>
          </dl>
          <div className="spi" aria-hidden="true"><span style={{ width: `${Math.min(100, (ms / FULL_FRAME_MS) * 100)}%` }} className={ms > budget ? 'bad' : ''} /><i style={{ left: `${(budget / FULL_FRAME_MS) * 100}%` }} /></div>
          <p className="note">A full redraw takes {FULL_FRAME_MS.toFixed(1)} ms at 32 MHz, more than one 30 fps frame. So screens change with a cut, and only small areas animate.</p>
          <label className="toggle"><input type="checkbox" checked={overlay} onChange={(e) => setOverlay(e.target.checked)} /> Outline the area being redrawn</label>
        </section>
        <section>
          <h2>Palette in use</h2>
          <div className="pal">{PALETTE.slice(1).map((p) => <span key={p.i} title={`${p.name} ${p.hex}`} style={{ background: p.hex }} />)}</div>
        </section>
        <section>
          <button className="ghost" onClick={() => {
            const c = screen.current.canvas()
            const a = document.createElement('a')
            a.download = `hotshoe-${view.screen}.png`
            a.href = c.toDataURL('image/png')
            a.click()
          }}>Save this screen as PNG (1x)</button>
        </section>
      </aside>
    </div>
  )
}
