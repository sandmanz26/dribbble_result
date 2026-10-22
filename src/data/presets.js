// Factory presets. Values are 0..1 for knobs, an index for selectors/toggles.
// steps: 16 values 0..1 (0 = step off). cables: [outJack, inJack] pairs in the service hatch.
const s = (str) => str.split('').map((c) => (c === '.' ? 0 : Number(c) / 9))

export const PRESETS = [
  {
    id: 'init',
    name: 'Init',
    note: 'Clean signal, every section at rest.',
    values: { drive: 0.2, tone: 0.5, mix: 1, output: 0.7, target: 0, division: 1, swing: 0, amount: 0, bits: 1, rate: 0, cutoff: 1, reso: 0.1, depth: 0, speed: 0.3, time: 0.4, feedback: 0 },
    steps: s('9999999999999999'),
    cables: [],
  },
  {
    id: 'fried-tape',
    name: 'Fried Tape',
    note: 'Slow wow, soft drive, dark repeats.',
    values: { drive: 0.55, tone: 0.32, mix: 0.85, output: 0.66, target: 0, division: 0, swing: 0.2, amount: 0.25, bits: 0.8, rate: 0.05, cutoff: 0.62, reso: 0.15, depth: 0.55, speed: 0.22, time: 0.52, feedback: 0.45 },
    steps: s('9.5.9.5.7.3.9.2.'),
    cables: [],
  },
  {
    id: 'dial-tone',
    name: 'Dial Tone',
    note: 'Telephone band, crushed and gated in sixteenths.',
    values: { drive: 0.7, tone: 0.7, mix: 1, output: 0.62, target: 2, division: 1, swing: 0.1, amount: 0.9, bits: 0.35, rate: 0.3, cutoff: 0.55, reso: 0.55, depth: 0.05, speed: 0.6, time: 0.2, feedback: 0.2 },
    steps: s('9.99.9.99.9.9999'),
    cables: [],
  },
  {
    id: 'bucket-choir',
    name: 'Bucket Choir',
    note: 'Fast wobble into long echo, sequencer moves the delay time.',
    values: { drive: 0.3, tone: 0.45, mix: 0.7, output: 0.7, target: 3, division: 0, swing: 0, amount: 0.5, bits: 1, rate: 0, cutoff: 0.75, reso: 0.3, depth: 0.7, speed: 0.75, time: 0.65, feedback: 0.6 },
    steps: s('9357913579135791'),
    cables: [['o-lfo', 'i-cutoff']],
  },
  {
    id: 'breaker-box',
    name: 'Breaker Box',
    note: 'Steps sweep the filter, noise patched into the bit depth.',
    values: { drive: 0.8, tone: 0.55, mix: 1, output: 0.6, target: 0, division: 2, swing: 0.35, amount: 0.85, bits: 0.6, rate: 0.15, cutoff: 0.5, reso: 0.7, depth: 0.1, speed: 0.4, time: 0.3, feedback: 0.35 },
    steps: s('9.3.7.1.9.5.3.8.'),
    cables: [['o-noise', 'i-bits'], ['o-seq', 'i-time']],
  },
]

export const presetById = (id) => PRESETS.find((p) => p.id === id)
