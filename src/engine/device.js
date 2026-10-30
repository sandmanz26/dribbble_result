import { C } from './palette.js'
import { W, H } from './gfx.js'
import { battery } from './sprites.js'
import { thumb } from './scenes.js'
import { measure } from './font.js'

// Hotshoe: a Raspberry Pi Zero 2 W with a 2.4" 240x320 panel that clips to a camera's
// hot shoe and pulls photos off the camera over USB (PTP) or Wi-Fi.
// Controls: D-pad, A (select), B (back), MENU (home), PWR (sleep / power).

export const CAMERAS = [
  { id: 'xt4', name: 'FUJIFILM X-T4', link: 'usb', newCount: 214, sizeMb: 31 },
  { id: 'a7', name: 'SONY A7 IV', link: 'wifi', newCount: 86, sizeMb: 44 },
  { id: 'r6', name: 'CANON R6', link: 'wifi', newCount: 0, sizeMb: 26 },
]

const SETTINGS = [
  { k: 'autoSync', label: 'AUTO SYNC ON PLUG', values: ['ON', 'OFF'] },
  { k: 'files', label: 'FILES', values: ['RAW+JPG', 'JPG ONLY', 'RAW ONLY'] },
  { k: 'after', label: 'AFTER SYNC', values: ['KEEP ON CARD', 'MARK SYNCED'] },
  { k: 'clock', label: 'CLOCK', values: ['MATCH CAMERA', 'MATCH PI'] },
  { k: 'bright', label: 'BRIGHTNESS', values: ['1', '2', '3', '4', '5'] },
  { k: 'sleep', label: 'SLEEP AFTER', values: ['1 MIN', '2 MIN', '5 MIN', 'NEVER'] },
  { k: 'click', label: 'BUTTON CLICK', values: ['OFF', 'ON'] },
]

export const SCREENS = [
  ['boot', 'Intro'], ['tutorial', 'Tutorial'], ['home', 'Home'], ['pair', 'Pairing'], ['sync', 'Sync'],
  ['trigger', 'Remote trigger'], ['settings', 'Settings'], ['system', 'System'], ['off', 'Shut down'],
]

export function initial() {
  return {
    screen: 'boot', t: 0, sel: 0, page: 0, firstRun: true,
    cam: null, pair: { phase: 'method', sel: 0, method: 'usb', found: [], fail: false },
    battery: 3, charging: false, cardUsedGb: 41.2, cardGb: 64, wifi: true,
    sync: { done: 0, total: 0, phase: 'idle', speed: 0, errorAt: 0, acc: 0 },
    settings: { autoSync: 0, files: 0, after: 0, clock: 0, bright: 3, sleep: 1, click: 0 },
    trigger: { interval: 5, shots: 60, sel: 0, running: false, taken: 0, next: 0 },
    alert: null, pressed: null, pressedAt: 0, log: [],
  }
}

const go = (s, screen, extra = {}) => Object.assign(s, { screen, t: 0, sel: 0, page: 0, ...extra })

export function input(s, btn) {
  s.pressed = btn; s.pressedAt = s.t
  if (btn === 'pwr') {
    if (s.screen === 'off') return go(s, 'boot')
    s.alert = { kind: 'shutdown' }; return
  }
  if (s.alert) return alertInput(s, btn)
  if (btn === 'menu' && !['boot', 'tutorial', 'off'].includes(s.screen)) return go(s, 'home')
  const h = HANDLERS[s.screen]
  if (h) h(s, btn)
}

function alertInput(s, btn) {
  const a = s.alert
  if (a.kind === 'shutdown') {
    if (btn === 'a') { s.alert = null; go(s, 'off') }
    if (btn === 'b') s.alert = null
  } else if (a.kind === 'stopSync') {
    if (btn === 'a') { s.alert = null; s.sync.phase = 'paused'; go(s, 'home') }
    if (btn === 'b') s.alert = null
  } else if (btn === 'a' || btn === 'b') {
    s.alert = null
  }
}

const move = (s, n, btn) => {
  if (btn === 'up') s.sel = (s.sel + n - 1) % n
  if (btn === 'down') s.sel = (s.sel + 1) % n
}

const HOME_ITEMS = [
  { k: 'sync', label: 'SYNC NOW', icon: 'sync' },
  { k: 'trigger', label: 'REMOTE TRIGGER', icon: 'shutter' },
  { k: 'pair', label: 'PAIR CAMERA', icon: 'link' },
  { k: 'settings', label: 'SETTINGS', icon: 'gear' },
  { k: 'system', label: 'SYSTEM', icon: 'chip' },
]

const HANDLERS = {
  boot(s, btn) { if (btn === 'a') endBoot(s) },
  tutorial(s, btn) {
    if (btn === 'right' || btn === 'a') { if (s.page < 3) s.page++; else { s.firstRun = false; go(s, 'home') } }
    if (btn === 'left' && s.page > 0) s.page--
    if (btn === 'b') { s.firstRun = false; go(s, 'home') }
  },
  home(s, btn) {
    move(s, HOME_ITEMS.length, btn)
    if (btn !== 'a') return
    const k = HOME_ITEMS[s.sel].k
    if ((k === 'sync' || k === 'trigger') && !s.cam) { s.alert = { kind: 'noCamera' }; return }
    if (k === 'sync') return startSync(s)
    if (k === 'pair') { s.pair = { phase: 'method', sel: 0, method: 'usb', found: [], fail: s.pair.fail }; return go(s, 'pair') }
    go(s, k)
  },
  pair(s, btn) {
    const p = s.pair
    if (btn === 'b') { if (p.phase === 'method' || p.phase === 'done') return go(s, 'home'); p.phase = 'method'; s.t = 0; return }
    if (p.phase === 'method') {
      if (btn === 'up' || btn === 'down') p.sel = 1 - p.sel
      if (btn === 'a') { p.method = p.sel ? 'wifi' : 'usb'; p.phase = 'scan'; s.t = 0 }
    } else if (p.phase === 'found') {
      if (btn === 'up') p.sel = (p.sel + p.found.length - 1) % p.found.length
      if (btn === 'down') p.sel = (p.sel + 1) % p.found.length
      if (btn === 'a') { p.cam = p.found[p.sel]; p.phase = p.method === 'wifi' ? 'code' : 'done'; s.t = 0; if (p.phase === 'done') connect(s, p.cam) }
    } else if (p.phase === 'code') {
      if (btn === 'a') { p.phase = 'done'; s.t = 0; connect(s, p.cam) }
    } else if (p.phase === 'fail') {
      if (btn === 'a') { p.phase = 'scan'; s.t = 0; p.fail = false }
    } else if (p.phase === 'done') {
      if (btn === 'a') go(s, 'home', { sel: 0 })
    }
  },
  sync(s, btn) {
    const y = s.sync
    if (btn === 'a') {
      if (y.phase === 'running') y.phase = 'paused'
      else if (y.phase === 'paused' || y.phase === 'error') { if (s.cam) y.phase = 'running' }
      else if (y.phase === 'done') go(s, 'home')
    }
    if (btn === 'b') {
      if (y.phase === 'running') s.alert = { kind: 'stopSync' }
      else go(s, 'home')
    }
  },
  trigger(s, btn) {
    const tr = s.trigger
    if (tr.running) { if (btn === 'b' || btn === 'a') { tr.running = false } return }
    if (btn === 'b') return go(s, 'home')
    if (btn === 'up') tr.sel = (tr.sel + 2) % 3
    if (btn === 'down') tr.sel = (tr.sel + 1) % 3
    const steps = [1, 2, 5, 10, 30, 60], shots = [10, 30, 60, 120, 300, 999]
    const step = (arr, v, d) => arr[Math.max(0, Math.min(arr.length - 1, arr.indexOf(v) + d))]
    if (btn === 'left' || btn === 'right') {
      const d = btn === 'left' ? -1 : 1
      if (tr.sel === 0) tr.interval = step(steps, tr.interval, d)
      if (tr.sel === 1) tr.shots = step(shots, tr.shots, d)
    }
    if (btn === 'a') {
      if (tr.sel === 2) { tr.running = true; tr.taken = 0; tr.next = tr.interval * 1000 }
      else tr.sel = Math.min(2, tr.sel + 1)
    }
  },
  settings(s, btn) {
    move(s, SETTINGS.length, btn)
    if (btn === 'b') return go(s, 'home', { sel: 3 })
    const it = SETTINGS[s.sel]
    const n = it.values.length
    if (btn === 'right' || btn === 'a') s.settings[it.k] = it.k === 'bright' ? Math.min(4, s.settings[it.k] + 1) : (s.settings[it.k] + 1) % n
    if (btn === 'left') s.settings[it.k] = it.k === 'bright' ? Math.max(0, s.settings[it.k] - 1) : (s.settings[it.k] + n - 1) % n
  },
  system(s, btn) {
    move(s, 3, btn)
    if (btn === 'b') return go(s, 'home', { sel: 4 })
    if (btn === 'a') {
      if (s.sel === 0) s.alert = { kind: 'update' }
      if (s.sel === 1) s.alert = { kind: 'logs' }
      if (s.sel === 2) s.alert = { kind: 'shutdown' }
    }
  },
  off() {},
}

function endBoot(s) { s.firstRun ? go(s, 'tutorial') : go(s, 'home') }

function connect(s, cam) {
  s.cam = { ...cam }
  if (s.settings.autoSync === 0 && cam.newCount) s.log.push(`AUTO SYNC READY: ${cam.newCount} NEW`)
}

function startSync(s) {
  const y = s.sync
  if (!s.cam.newCount && y.phase !== 'paused' && y.phase !== 'error') { s.alert = { kind: 'nothingNew' }; return }
  if (y.phase === 'paused' || y.phase === 'error') { y.phase = 'running'; return go(s, 'sync') }
  Object.assign(y, { done: 0, total: s.cam.newCount, phase: 'running', speed: 0, acc: 0 })
  go(s, 'sync')
}

// Scenario hooks for the reviewer panel.
export function scenario(s, kind) {
  if (kind === 'plugCamera') { connect(s, CAMERAS[0]); if (s.screen === 'home') s.alert = { kind: 'plugged' } }
  if (kind === 'unplug') {
    if (s.sync.phase === 'running') { s.sync.phase = 'error'; s.sync.errorAt = s.sync.done }
    s.cam = null; s.alert = { kind: 'camLost' }
  }
  if (kind === 'lowBattery') { s.battery = 1; s.alert = { kind: 'lowBattery' } }
  if (kind === 'cardFull') { s.cardUsedGb = 62.6; s.alert = { kind: 'cardFull' } }
  if (kind === 'ptpFail') { s.pair.fail = true }
  if (kind === 'reset') Object.assign(s, initial())
  if (kind === 'skipIntro') { s.firstRun = false; go(s, 'home') }
}

export function goto(s, screen) {
  if (screen === 'sync' && !s.cam) connect(s, CAMERAS[0])
  if (screen === 'sync') { Object.assign(s.sync, { done: 87, total: s.cam.newCount || 214, phase: 'running', acc: 0 }); return go(s, 'sync') }
  if (screen === 'trigger' && !s.cam) connect(s, CAMERAS[0])
  if (screen === 'pair') s.pair = { phase: 'method', sel: 0, method: 'usb', found: [], fail: s.pair.fail }
  if (screen === 'tutorial') s.firstRun = true
  go(s, screen)
}

export function tick(s, dt) {
  s.t += dt
  if (s.screen === 'boot' && s.t > 2900) endBoot(s)
  const p = s.pair
  if (s.screen === 'pair' && p.phase === 'scan' && s.t > 2200) {
    if (p.fail && p.method === 'usb') { p.phase = 'fail' }
    else { p.found = CAMERAS.filter((c) => c.link === p.method); p.phase = 'found'; p.sel = 0 }
    s.t = 0
  }
  const y = s.sync
  if (y.phase === 'running' && s.cam) {
    y.acc += dt
    const per = 260
    while (y.acc > per && y.done < y.total) {
      y.acc -= per
      y.done++
      s.cardUsedGb = Math.min(s.cardGb, s.cardUsedGb + s.cam.sizeMb / 1024)
    }
    y.speed = s.cam.link === 'usb' ? 38.4 : 11.7
    if (y.done >= y.total) { y.phase = 'done'; s.cam.newCount = 0 }
  }
  const tr = s.trigger
  if (tr.running) {
    tr.next -= dt
    if (tr.next <= 0) { tr.taken++; tr.next = tr.interval * 1000; tr.flash = s.t; if (tr.taken >= tr.shots) tr.running = false }
  }
}

/* ---------- drawing ---------- */

function statusBar(f, s) {
  f.rect(0, 0, W, 18, C.VOID)
  if (s.cam) {
    f.sprite(s.cam.link === 'usb' ? 'usb' : 'wifi', 4, 3)
    f.text(s.cam.name, 20, 6, C.SOFT, { max: 120 })
  } else {
    f.sprite('camera', 4, 3, { recolor: { [C.PAPER]: C.DIM, [C.SAFE]: C.DIM } })
    f.text('NO CAMERA', 20, 6, C.DIM)
  }
  f.sprite(battery(s.battery, s.charging), W - 19, 5)
  f.text('09:41', W - 24, 6, C.SOFT, { align: 'right' })
  f.rect(0, 18, W, 1, C.PANEL)
}

function hints(f, items) {
  f.rect(0, H - 22, W, 22, C.VOID)
  f.rect(0, H - 22, W, 1, C.PANEL)
  let x = 6
  for (const [icon, label] of items) {
    f.sprite(icon, x, H - 17)
    x = f.text(label, x + 17, H - 14, C.SOFT) + 10
  }
}

function title(f, t, sub) {
  f.text(t, 12, 30, C.PAPER, { scale: 2 })
  if (sub) f.text(sub, 12, 50, C.DIM)
}

function row(f, y, label, { selected, icon, value, dim, sub, h = 26 } = {}) {
  f.panel(8, y, W - 16, h, selected ? C.RAISE : C.PANEL, selected ? C.SAFE : null)
  let x = 16
  if (icon) { f.sprite(icon, 16, y + (h - 12) / 2, dim ? { recolor: { [C.PAPER]: C.DIM, [C.SAFE]: C.DIM } } : undefined); x = 36 }
  const ly = sub ? y + 8 : y + (h - 7) / 2
  f.text(label, x, ly, dim ? C.DIM : C.PAPER)
  if (sub) f.text(sub, x, y + 21, C.DIM, { max: W - 16 - x - 8 })
  if (value != null) {
    const vx = W - 18
    if (selected) {
      f.text('<', vx - 9 - measure(value) - 10, y + (h - 7) / 2, C.SAFE)
      f.text('>', vx, y + (h - 7) / 2, C.SAFE, { align: 'right' })
      f.text(value, vx - 9, y + (h - 7) / 2, C.SAFE, { align: 'right' })
    } else f.text(value, vx, y + (h - 7) / 2, C.SOFT, { align: 'right' })
  }
}

const DRAW = {
  boot(f, s) {
    // Focal plane shutter: two curtains of slats close, then open on the logo.
    const t = s.t
    f.clear(C.VOID)
    const open = Math.max(0, Math.min(1, (t - 1100) / 500))
    const close = Math.min(1, t / 700)
    const cover = t < 1100 ? close : 1 - open
    if (t >= 1100) {
      f.text('HOTSHOE', W / 2, 130, C.PAPER, { scale: 3, align: 'center' })
      f.rect(W / 2 + measure('HOTSHOE', 3) / 2 + 4, 130, 6, 6, C.SAFE)
      f.text('CAMERA SYNC', W / 2, 162, C.SOFT, { align: 'center' })
      if (t > 1800) {
        const p = Math.min(1, (t - 1800) / 1000)
        f.bar(70, 200, 100, 4, p)
        f.text(p < 0.5 ? 'MOUNTING CARD' : p < 0.9 ? 'LOOKING FOR CAMERA' : 'READY', W / 2, 212, C.DIM, { align: 'center' })
      }
    }
    const slats = 8
    const slatH = H / 2 / slats
    for (let i = 0; i < slats; i++) {
      const top = Math.round(i * slatH * cover)
      f.rect(0, top, W, Math.ceil(slatH * cover) + 1, i % 2 ? C.PANEL : C.RAISE)
      f.rect(0, H - top - Math.ceil(slatH * cover) - 1, W, Math.ceil(slatH * cover) + 1, i % 2 ? C.PANEL : C.RAISE)
    }
    if (cover > 0.98) f.rect(0, H / 2 - 1, W, 2, C.SAFE)
  },

  tutorial(f, s) {
    f.clear(C.VOID)
    const pages = [
      ['dpad', 'MOVE', ['USE THE D-PAD TO MOVE', 'UP AND DOWN LISTS AND', 'CHANGE VALUES LEFT', 'AND RIGHT.']],
      ['btn-a-on', 'SELECT', ['PRESS A TO OPEN,', 'CONFIRM OR START.', '', 'IT IS ALWAYS THE', 'BUTTON ON THE RIGHT.']],
      ['btn-b-on', 'BACK', ['PRESS B TO GO BACK', 'OR CANCEL. NOTHING', 'IS LOST: A RUNNING', 'SYNC KEEPS GOING.']],
      ['btn-menu-on', 'HOME', ['MENU TAKES YOU HOME', 'FROM ANY SCREEN.', '', 'HOLD PWR TO SLEEP', 'OR SHUT DOWN.']],
    ]
    const [icon, head, lines] = pages[s.page]
    f.text(`${s.page + 1}/4`, W - 12, 10, C.DIM, { align: 'right' })
    f.text('HOW IT WORKS', 12, 10, C.DIM)
    const pulse = Math.floor(s.t / 500) % 2
    f.panel(70, 50, 100, 100, C.PANEL, C.LINE)
    f.sprite(icon === 'dpad' ? ['dpad-up', 'dpad-right', 'dpad-down', 'dpad-left'][Math.floor(s.t / 500) % 4] : pulse ? icon : icon.replace('-on', ''), 120 - 26, 100 - 26, { scale: 4 })
    f.text(head, W / 2, 172, C.PAPER, { scale: 2, align: 'center' })
    lines.forEach((l, i) => f.text(l, W / 2, 200 + i * 12, C.SOFT, { align: 'center' }))
    for (let i = 0; i < 4; i++) f.rect(W / 2 - 22 + i * 12, 272, 8, 3, i === s.page ? C.SAFE : C.LINE)
    hints(f, [['btn-a', s.page < 3 ? 'NEXT' : 'START'], ['btn-b', 'SKIP']])
  },

  home(f, s) {
    f.clear(C.VOID)
    statusBar(f, s)
    // Hero card: what matters right now.
    f.panel(8, 26, W - 16, 74, C.PANEL, null)
    if (s.cam) {
      const y = s.sync
      if (y.phase === 'paused' || y.phase === 'error') {
        f.text('SYNC PAUSED', 16, 34, C.WARN)
        f.text(`${y.done}`, 16, 48, C.PAPER, { scale: 3 })
        f.text(`/${y.total} PHOTOS`, 16 + measure(`${y.done}`, 3) + 4, 62, C.SOFT)
        f.bar(16, 84, W - 32, 6, y.done / y.total)
      } else if (s.cam.newCount) {
        f.text('READY TO SYNC', 16, 34, C.SOFT)
        f.text(`${s.cam.newCount}`, 16, 48, C.PAPER, { scale: 3 })
        f.text('NEW PHOTOS', 16 + measure(`${s.cam.newCount}`, 3) + 6, 62, C.SOFT)
        f.text(`ABOUT ${((s.cam.newCount * s.cam.sizeMb) / 1024).toFixed(1)} GB`, 16, 84, C.DIM)
      } else {
        f.sprite('check', 16, 34)
        f.text('ALL SYNCED', 34, 37, C.OK)
        f.text('NOTHING NEW ON THE CARD', 16, 60, C.SOFT)
        f.text('LAST SYNC 2 MIN AGO', 16, 74, C.DIM)
      }
    } else {
      f.text('NO CAMERA', 16, 36, C.PAPER, { scale: 2 })
      f.text('PLUG IN USB OR PAIR', 16, 62, C.SOFT)
      f.text('OVER WI-FI TO START', 16, 74, C.SOFT)
    }
    // Card storage
    const used = s.cardUsedGb / s.cardGb
    f.sprite('card', 10, 108)
    f.text(`PI CARD ${s.cardUsedGb.toFixed(1)}/${s.cardGb} GB`, 28, 111, used > 0.9 ? C.WARN : C.SOFT)
    f.bar(28, 121, W - 44, 3, used, used > 0.9 ? C.WARN : C.SOFT)
    HOME_ITEMS.forEach((it, i) => {
      const need = (it.k === 'sync' || it.k === 'trigger') && !s.cam
      row(f, 134 + i * 31, it.label, { selected: s.sel === i, icon: it.icon, dim: need })
    })
    hints(f, [['btn-a', 'OPEN'], ['dpad', 'MOVE']])
  },

  pair(f, s) {
    f.clear(C.VOID)
    statusBar(f, s)
    const p = s.pair
    title(f, 'PAIR CAMERA', p.phase === 'method' ? 'HOW IS IT CONNECTED?' : p.method === 'usb' ? 'OVER USB CABLE' : 'OVER WI-FI')
    if (p.phase === 'method') {
      row(f, 68, 'USB CABLE', { selected: p.sel === 0, icon: 'usb', h: 36, sub: 'FASTEST. CAMERA ON PTP' })
      row(f, 110, 'WI-FI', { selected: p.sel === 1, icon: 'wifi', h: 36, sub: 'NO CABLE. ABOUT 3X SLOWER' })
      hints(f, [['btn-a', 'NEXT'], ['btn-b', 'BACK']])
    } else if (p.phase === 'scan') {
      // Radar: only the ring that changes is redrawn each frame.
      const cx = W / 2, cy = 150
      for (let r = 12; r <= 60; r += 16) ring(f, cx, cy, r, C.LINE)
      const rr = 8 + ((s.t / 18) % 56)
      ring(f, cx, cy, Math.round(rr), C.SAFE)
      f.sprite(p.method === 'usb' ? 'usb' : 'wifi', cx - 6, cy - 6)
      f.text('LOOKING FOR CAMERAS', W / 2, 228, C.SOFT, { align: 'center' })
      f.text(p.method === 'usb' ? 'TURN THE CAMERA ON' : 'OPEN WI-FI ON THE CAMERA', W / 2, 242, C.DIM, { align: 'center' })
      hints(f, [['btn-b', 'CANCEL']])
    } else if (p.phase === 'found') {
      f.text(`FOUND ${p.found.length}`, 12, 70, C.SOFT)
      p.found.forEach((c, i) => {
        row(f, 84 + i * 42, c.name, { selected: p.sel === i, icon: 'camera', h: 36, sub: c.newCount ? `${c.newCount} NEW PHOTOS` : 'UP TO DATE' })
      })
      hints(f, [['btn-a', 'CONNECT'], ['btn-b', 'BACK']])
    } else if (p.phase === 'code') {
      f.text('CHECK THE CAMERA SCREEN', 12, 74, C.SOFT)
      f.text('IT SHOULD SHOW THIS CODE', 12, 86, C.SOFT)
      f.panel(20, 110, W - 40, 60, C.PANEL, C.SAFE)
      f.text('482 913', W / 2, 128, C.PAPER, { scale: 3, align: 'center' })
      f.text('DIFFERENT CODE? PRESS B', W / 2, 190, C.DIM, { align: 'center' })
      hints(f, [['btn-a', 'IT MATCHES'], ['btn-b', 'BACK']])
    } else if (p.phase === 'done') {
      f.sprite('check', W / 2 - 24, 90, { scale: 4 })
      f.text('CONNECTED', W / 2, 150, C.OK, { scale: 2, align: 'center' })
      f.text(s.cam ? s.cam.name : '', W / 2, 176, C.PAPER, { align: 'center' })
      f.text(s.cam?.newCount ? `${s.cam.newCount} NEW PHOTOS TO SYNC` : 'NOTHING NEW ON THE CARD', W / 2, 190, C.SOFT, { align: 'center' })
      hints(f, [['btn-a', 'DONE']])
    } else if (p.phase === 'fail') {
      f.sprite('warn', W / 2 - 24, 78, { scale: 4 })
      f.text('CAMERA FOUND,', W / 2, 136, C.PAPER, { align: 'center' })
      f.text('BUT IT IS IN STORAGE MODE', W / 2, 148, C.PAPER, { align: 'center' })
      f.panel(12, 166, W - 24, 70, C.PANEL, C.LINE)
      ;['ON THE CAMERA:', 'MENU > CONNECTION >', 'USB MODE > PTP', 'THEN PRESS A'].forEach((l, i) => f.text(l, 22, 176 + i * 13, i ? C.SOFT : C.DIM))
      hints(f, [['btn-a', 'TRY AGAIN'], ['btn-b', 'BACK']])
    }
  },

  sync(f, s) {
    f.clear(C.VOID)
    statusBar(f, s)
    const y = s.sync
    const head = { running: 'SYNCING', paused: 'PAUSED', done: 'ALL SYNCED', error: 'CABLE PULLED' }[y.phase] || 'SYNC'
    f.text(head, 12, 30, y.phase === 'error' ? C.SAFE : y.phase === 'done' ? C.OK : C.PAPER, { scale: 2 })
    f.text(`${y.done}`, 12, 58, C.PAPER, { scale: 4 })
    f.text(`OF ${y.total}`, 16 + measure(`${y.done}`, 4), 80, C.SOFT)
    f.bar(12, 98, W - 24, 8, y.total ? y.done / y.total : 0, y.phase === 'done' ? C.OK : y.phase === 'running' ? C.SAFE : C.DIM)
    const left = y.total - y.done
    const eta = s.cam ? Math.ceil((left * s.cam.sizeMb) / (y.speed || 1) / 60) : 0
    if (y.phase === 'running') f.text(`${y.speed} MB/S   ABOUT ${eta} MIN LEFT`, 12, 112, C.SOFT)
    if (y.phase === 'paused') f.text('PRESS A TO CARRY ON', 12, 112, C.SOFT)
    if (y.phase === 'error') { f.text('PLUG IT BACK IN.', 12, 112, C.SOFT); f.text(`RESUMES FROM PHOTO ${y.errorAt + 1}`, 12, 124, C.SOFT) }
    if (y.phase === 'done') f.text('SAFE TO UNPLUG THE CAMERA', 12, 112, C.SOFT)
    // Latest three photos, newest first. Only the strip changes when a file lands.
    f.text('LATEST', 12, 146, C.DIM)
    for (let i = 0; i < 3; i++) {
      const n = y.done - i
      const x = 12 + i * 74
      f.box(x, 158, 70, 54, C.LINE)
      if (n > 0) {
        thumb(f, x + 1, 159, 68, 52, n)
        f.text(`DSCF${String(4120 + n).padStart(4, '0')}`, x, 216, i === 0 ? C.PAPER : C.DIM)
      }
    }
    f.text(s.cam ? `TO PI CARD /PHOTOS/2027-02-18` : '', 12, 240, C.DIM, { max: W - 24 })
    if (y.phase === 'running') hints(f, [['btn-a', 'PAUSE'], ['btn-b', 'STOP']])
    else if (y.phase === 'done') hints(f, [['btn-a', 'DONE']])
    else hints(f, [['btn-a', s.cam ? 'RESUME' : 'WAITING'], ['btn-b', 'HOME']])
  },

  trigger(f, s) {
    f.clear(C.VOID)
    statusBar(f, s)
    const tr = s.trigger
    if (tr.running) {
      const flash = s.t - (tr.flash || -9999) < 120
      title(f, 'TIME-LAPSE')
      f.text(`SHOT ${tr.taken} OF ${tr.shots}`, 12, 54, C.SOFT)
      const sec = Math.ceil(tr.next / 1000)
      f.panel(20, 80, W - 40, 110, flash ? C.SAFE : C.PANEL, flash ? null : C.LINE)
      f.text(String(sec), W / 2, 108, flash ? C.VOID : C.PAPER, { scale: 8, align: 'center' })
      f.text(flash ? 'CLICK' : 'NEXT SHOT IN', W / 2, 172, flash ? C.VOID : C.DIM, { align: 'center' })
      f.bar(20, 204, W - 40, 6, tr.taken / tr.shots)
      const mins = Math.ceil(((tr.shots - tr.taken) * tr.interval) / 60)
      f.text(`DONE IN ABOUT ${mins} MIN`, 20, 218, C.DIM)
      hints(f, [['btn-b', 'STOP']])
      return
    }
    title(f, 'REMOTE TRIGGER', 'TIME-LAPSE FROM THE PI')
    row(f, 70, 'EVERY', { selected: tr.sel === 0, icon: 'clock', value: `${tr.interval} SEC` })
    row(f, 101, 'SHOTS', { selected: tr.sel === 1, icon: 'image', value: String(tr.shots) })
    f.panel(8, 136, W - 16, 30, tr.sel === 2 ? C.SAFE : C.PANEL, tr.sel === 2 ? null : C.LINE)
    f.sprite('shutter', 18, 145, tr.sel === 2 ? { recolor: { [C.PAPER]: C.VOID, [C.SAFE]: C.VOID } } : undefined)
    f.text('START', 38, 148, tr.sel === 2 ? C.VOID : C.PAPER)
    const mins = Math.ceil((tr.shots * tr.interval) / 60)
    f.text(`TAKES ABOUT ${mins} MIN.`, 12, 180, C.SOFT)
    f.text(`USES ${(tr.shots * (s.cam?.sizeMb || 30) / 1024).toFixed(1)} GB ON THE CAMERA.`, 12, 192, C.SOFT)
    f.text('EACH SHOT SYNCS AS IT LANDS.', 12, 204, C.DIM)
    hints(f, [['btn-a', tr.sel === 2 ? 'START' : 'NEXT'], ['dpad', 'SET']])
  },

  settings(f, s) {
    f.clear(C.VOID)
    statusBar(f, s)
    title(f, 'SETTINGS')
    const top = Math.max(0, s.sel - 5)
    SETTINGS.slice(top, top + 7).forEach((it, i) => {
      const idx = top + i
      const v = it.k === 'bright' ? '|'.repeat(s.settings.bright + 1) : it.values[s.settings[it.k]]
      row(f, 56 + i * 31, it.label, { selected: s.sel === idx, value: v })
    })
    hints(f, [['dpad', 'CHANGE'], ['btn-b', 'BACK']])
  },

  system(f, s) {
    f.clear(C.VOID)
    statusBar(f, s)
    title(f, 'SYSTEM')
    const info = [['DEVICE', 'PI ZERO 2 W'], ['FIRMWARE', '1.4.0'], ['CPU', '48 C'], ['BATTERY', `${[8, 24, 46, 71, 96][s.battery]}%`], ['CARD', `${(s.cardGb - s.cardUsedGb).toFixed(1)} GB FREE`]]
    f.panel(8, 52, W - 16, info.length * 14 + 10, C.PANEL)
    info.forEach(([k, v], i) => { f.text(k, 16, 58 + i * 14, C.DIM); f.text(v, W - 16, 58 + i * 14, C.PAPER, { align: 'right' }) })
    const items = [['UPDATE TO 1.5.0', 'bolt'], ['SAVE LOGS TO CARD', 'card'], ['SHUT DOWN', 'chip']]
    items.forEach(([l, ic], i) => row(f, 140 + i * 31, l, { selected: s.sel === i, icon: ic }))
    hints(f, [['btn-a', 'OPEN'], ['btn-b', 'BACK']])
  },

  off(f, s) {
    f.clear(C.VOID)
    if (s.t < 1600) {
      f.text('SHUTTING DOWN', W / 2, 150, C.SOFT, { align: 'center' })
      f.bar(70, 166, 100, 4, s.t / 1600, C.SOFT)
    } else if (s.t < 4000) {
      f.text('SAFE TO UNPLUG', W / 2, 156, C.DIM, { align: 'center' })
    }
  },
}

function ring(f, cx, cy, r, c) {
  // Midpoint circle, 1px, no anti-aliasing.
  let x = r, y = 0, e = 1 - r
  while (x >= y) {
    for (const [a, b] of [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]]) f.px(cx + a, cy + b, c)
    y++
    if (e < 0) e += 2 * y + 1
    else { x--; e += 2 * (y - x) + 1 }
  }
}

const ALERTS = {
  noCamera: ['camera', 'NO CAMERA YET', ['PLUG IN A USB CABLE OR', 'CHOOSE PAIR CAMERA.'], 'OK'],
  nothingNew: ['check', 'NOTHING NEW', ['EVERY PHOTO ON THE', 'CAMERA IS ON THE PI.'], 'OK'],
  plugged: ['usb', 'CAMERA PLUGGED IN', ['FUJIFILM X-T4', '214 NEW PHOTOS.'], 'OK'],
  camLost: ['warn', 'CAMERA DISCONNECTED', ['NOTHING IS LOST. SYNC', 'RESUMES WHERE IT STOPPED.'], 'OK'],
  lowBattery: ['warn', 'BATTERY 8%', ['ABOUT 10 MIN LEFT.', 'SYNC WILL PAUSE AT 3%.'], 'OK'],
  cardFull: ['warn', 'PI CARD ALMOST FULL', ['1.4 GB FREE. ABOUT 45', 'MORE PHOTOS WILL FIT.'], 'OK'],
  stopSync: ['sync', 'STOP SYNCING?', ['PHOTOS ALREADY COPIED', 'STAY ON THE PI.'], 'STOP', 'KEEP GOING'],
  shutdown: ['chip', 'SHUT DOWN?', ['WAIT FOR THE SCREEN', 'TO GO DARK BEFORE', 'UNPLUGGING POWER.'], 'SHUT DOWN', 'CANCEL'],
  update: ['bolt', 'UPDATE 1.5.0', ['FASTER WI-FI SYNC.', 'NEEDS WI-FI AND 50%', 'BATTERY. TAKES 4 MIN.'], 'LATER'],
  logs: ['check', 'LOGS SAVED', ['/LOGS/HOTSHOE-0218.TXT', 'SEND IT TO SUPPORT.'], 'OK'],
}

function drawAlert(f, s) {
  const a = ALERTS[s.alert.kind]
  if (!a) return
  const [icon, head, lines, ok, cancel] = a
  // No alpha on the device: the scrim is a checkerboard of VOID pixels.
  f.dither(0, 19, W, H - 19, C.VOID)
  const h = 74 + lines.length * 12
  const y = (H - h) / 2
  f.panel(14, y, W - 28, h, C.PANEL, icon === 'warn' ? C.WARN : C.LINE)
  f.sprite(icon, 24, y + 12)
  f.text(head, 42, y + 15, C.PAPER)
  lines.forEach((l, i) => f.text(l, 24, y + 36 + i * 12, C.SOFT))
  const by = y + h - 22
  f.sprite('btn-a', 24, by)
  let x = f.text(ok, 41, by + 3, C.PAPER)
  if (cancel) { f.sprite('btn-b', x + 12, by); f.text(cancel, x + 29, by + 3, C.SOFT) }
}

export function draw(f, s) {
  ;(DRAW[s.screen] || DRAW.home)(f, s)
  if (s.alert) drawAlert(f, s)
}
