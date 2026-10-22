// Production asset list. Each sheet: rows = frames (top to bottom), columns = states (left to
// right), cell size in 1x pixels. Rendered by /render and saved by scripts/export-assets.mjs.
export const STATES4 = ['idle', 'hover', 'drag', 'dim']

export const ASSETS = [
  { id: 'panel', title: 'Panel background', w: 1200, h: 700, frames: 1, states: ['idle'], note: 'Enamel, silkscreen, module frames, scales and labels. Controls sit on top.' },
  { id: 'knob-lg', title: 'Knob, large (Drive)', w: 128, h: 128, frames: 64, states: STATES4, r: 46, note: '64 frames over 270 degrees. Value arc and ring are baked into hover and drag.' },
  { id: 'knob-md', title: 'Knob, medium', w: 100, h: 100, frames: 64, states: STATES4, r: 34, note: 'Used by Crush, Filter, Wobble, Echo, Mix and Output.' },
  { id: 'knob-sm', title: 'Knob, small', w: 76, h: 76, frames: 64, states: STATES4, r: 24, note: 'Tone, Swing, Amount.' },
  { id: 'selector', title: 'Selector, chicken head', w: 48, h: 48, frames: 4, states: STATES4, note: 'One frame per detent. Scale and option names are on the panel.' },
  { id: 'toggle3', title: 'Bat toggle, 3 position', w: 40, h: 56, frames: 3, states: STATES4, note: 'Frames top to bottom: up, middle, down.' },
  { id: 'bat', title: 'Bat toggle, 2 position', w: 40, h: 56, frames: 2, states: ['idle', 'hover', 'drag'], note: 'Bypass. Frame 0 on, frame 1 bypassed.' },
  { id: 'momentary', title: 'Momentary button (Chaos)', w: 88, h: 88, frames: 2, states: ['idle', 'hover', 'dim'], note: 'Frame 0 up, frame 1 held.' },
  { id: 'step', title: 'Sequencer step', w: 48, h: 48, frames: 9, states: ['idle', 'hover', 'drag', 'dim', 'playing'], note: 'Frames are step level 0 to 8 (0 is off). Playing column is the lit current step.' },
  { id: 'led', title: 'LED', w: 32, h: 32, frames: 2, states: ['idle'], note: 'Frame 0 off, frame 1 on with glow.' },
  { id: 'vu-face', title: 'VU meter face', w: 200, h: 120, frames: 1, states: ['idle'], note: 'Bezel, paper, scale and glass. Needle is a separate strip.' },
  { id: 'vu-needle', title: 'VU needle', w: 200, h: 120, frames: 64, states: ['idle'], note: '64 frames across the scale, aligned to the face.' },
  { id: 'jack', title: 'Patch jack', w: 40, h: 40, frames: 2, states: ['idle', 'hover'], note: 'Frame 0 input, frame 1 output (dashed ring). Selected = hover column.' },
  { id: 'pad', title: 'Bend contact', w: 60, h: 36, frames: 2, states: ['idle', 'hover'], note: 'Frame 0 untouched, frame 1 held.' },
  { id: 'screw', title: 'Hatch screw', w: 24, h: 24, frames: 2, states: ['idle'], note: 'Frame 0 tight, frame 1 loosened.' },
  { id: 'hatch-bay', title: 'Patch bay (behind hatch)', w: 224, h: 188, frames: 1, states: ['idle'], note: 'Revealed when the hatch opens. Jacks and pads go on top.' },
]

export const assetById = (id) => ASSETS.find((a) => a.id === id)
export const fileName = (id, wear, scale) => `${id}-${wear}@${scale}x.png`
