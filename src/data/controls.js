// Panel layout in logical units (1x). The same table drives the React panel, the asset export
// and the developer manifest, so positions in the handoff always match what is drawn.
export const PANEL = { width: 1200, height: 700 }

export const MODULES = [
  { id: 'input', n: '01', name: 'Input', x: 16, y: 96, w: 180, h: 268 },
  { id: 'scope', n: '', name: 'Scope', x: 212, y: 96, w: 480, h: 268 },
  { id: 'meter', n: '', name: 'Level', x: 708, y: 96, w: 232, h: 268 },
  { id: 'out', n: '07', name: 'Out', x: 956, y: 96, w: 228, h: 268 },
  { id: 'steps', n: '06', name: 'Steps', x: 16, y: 376, w: 1168, h: 108 },
  { id: 'crush', n: '02', name: 'Crush', x: 16, y: 496, w: 220, h: 188 },
  { id: 'filter', n: '03', name: 'Filter', x: 252, y: 496, w: 220, h: 188 },
  { id: 'wobble', n: '04', name: 'Wobble', x: 488, y: 496, w: 220, h: 188 },
  { id: 'echo', n: '05', name: 'Echo', x: 724, y: 496, w: 220, h: 188 },
  { id: 'hatch', n: '', name: 'Service', x: 960, y: 496, w: 224, h: 188 },
]

// kind: knob (size lg 46 / md 34 / sm 24 radius), selector, toggle3, bat, momentary.
// fmt turns 0..1 into the readout shown while dragging.
const pct = (v) => `${Math.round(v * 100)}%`
const hz = (lo, hi) => (v) => {
  const f = lo * Math.pow(hi / lo, v)
  return f >= 1000 ? `${(f / 1000).toFixed(1)} kHz` : `${Math.round(f)} Hz`
}

export const CONTROLS = [
  { id: 'drive', label: 'Drive', module: 'input', kind: 'knob', size: 'lg', x: 106, y: 196, def: 0.35, fmt: (v) => `${(v * 24).toFixed(1)} dB` },
  { id: 'tone', label: 'Tone', module: 'input', kind: 'knob', size: 'sm', x: 106, y: 300, def: 0.5, bipolar: true, fmt: (v) => `${v < 0.5 ? 'Dark' : 'Bright'} ${Math.abs(Math.round((v - 0.5) * 24))}` },
  { id: 'chaos', label: 'Chaos', module: 'meter', kind: 'momentary', x: 824, y: 298, r: 30 },
  { id: 'mix', label: 'Mix', module: 'out', kind: 'knob', size: 'md', x: 1070, y: 172, def: 1, fmt: pct },
  { id: 'output', label: 'Output', module: 'out', kind: 'knob', size: 'md', x: 1070, y: 290, def: 0.7, fmt: (v) => `${((v - 0.7) * 30).toFixed(1)} dB` },
  { id: 'target', label: 'Target', module: 'steps', kind: 'selector', x: 74, y: 446, def: 0, options: ['Cut', 'Bits', 'Gate', 'Time'] },
  { id: 'division', label: 'Rate', module: 'steps', kind: 'toggle3', x: 176, y: 438, def: 1, options: ['1/8', '1/16', '1/32'] },
  { id: 'swing', label: 'Swing', module: 'steps', kind: 'knob', size: 'sm', x: 262, y: 434, def: 0, fmt: pct },
  { id: 'amount', label: 'Amount', module: 'steps', kind: 'knob', size: 'sm', x: 348, y: 434, def: 0.6, fmt: pct },
  { id: 'bits', label: 'Bits', module: 'crush', kind: 'knob', size: 'md', x: 76, y: 598, def: 1, fmt: (v) => `${Math.round(2 + v * 14)} bit` },
  { id: 'rate', label: 'Rate', module: 'crush', kind: 'knob', size: 'md', x: 176, y: 598, def: 0, fmt: (v) => `1/${Math.round(1 + v * 31)}` },
  { id: 'cutoff', label: 'Cutoff', module: 'filter', kind: 'knob', size: 'md', x: 312, y: 598, def: 0.8, fmt: hz(80, 16000) },
  { id: 'reso', label: 'Reso', module: 'filter', kind: 'knob', size: 'md', x: 412, y: 598, def: 0.2, fmt: pct },
  { id: 'depth', label: 'Depth', module: 'wobble', kind: 'knob', size: 'md', x: 548, y: 598, def: 0.15, fmt: pct },
  { id: 'speed', label: 'Speed', module: 'wobble', kind: 'knob', size: 'md', x: 648, y: 598, def: 0.3, fmt: (v) => `${(0.1 * Math.pow(80, v)).toFixed(2)} Hz` },
  { id: 'time', label: 'Time', module: 'echo', kind: 'knob', size: 'md', x: 784, y: 598, def: 0.4, fmt: (v) => `${Math.round(30 + v * 770)} ms` },
  { id: 'feedback', label: 'Repeats', module: 'echo', kind: 'knob', size: 'md', x: 884, y: 598, def: 0.3, fmt: pct },
  { id: 'bypass', label: 'Bypass', module: 'header', kind: 'bat', x: 1144, y: 46, def: 0 },
]

export const KNOB_R = { lg: 46, md: 34, sm: 24 }

export const STEP = { x0: 440, dx: 48, y: 452, ledY: 406, size: 34 }

// Hidden circuit-bend panel behind the service hatch.
export const HATCH = { x: 960, y: 496, w: 224, h: 188 }
export const JACKS = [
  { id: 'o-seq', label: 'Steps', dir: 'out', x: 1004, y: 552 },
  { id: 'o-noise', label: 'Noise', dir: 'out', x: 1072, y: 552 },
  { id: 'o-lfo', label: 'Wobble', dir: 'out', x: 1140, y: 552 },
  { id: 'i-time', label: 'Time', dir: 'in', x: 1004, y: 610 },
  { id: 'i-cutoff', label: 'Cutoff', dir: 'in', x: 1072, y: 610 },
  { id: 'i-bits', label: 'Bits', dir: 'in', x: 1140, y: 610 },
]
export const PADS = [
  { id: 'freeze', label: 'Freeze', x: 1004, y: 662 },
  { id: 'starve', label: 'Starve', x: 1072, y: 662 },
  { id: 'spit', label: 'Spit', x: 1140, y: 662 },
]
export const SCREWS = [
  { x: 974, y: 510 }, { x: 1170, y: 510 }, { x: 974, y: 670 }, { x: 1170, y: 670 },
]

export const DEFAULTS = Object.fromEntries(CONTROLS.filter((c) => 'def' in c).map((c) => [c.id, c.def]))

export const WEAR = ['mint', 'worn', 'busted']
export const WEAR_LABEL = { mint: 'Mint', worn: 'Worn', busted: 'Busted' }
