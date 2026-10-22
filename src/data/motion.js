// Motion spec. Frames are at 60 fps. Easing is CSS cubic-bezier, which maps directly to
// egui's emath easing or a hand-written curve. The hatch, screws, LEDs, meter and scope in the
// live prototype run these numbers; the rest are specified for the native build.
export const FPS = 60

export const MOTION = [
  { id: 'knob-drag', group: 'Control travel', name: 'Knob drag', frames: null, easing: 'none (direct)', detail: '200 px of vertical drag covers the full 270 degrees, 1.35 degrees per px. Shift: 0.1x. Wheel: 2% per notch. No smoothing while dragging; the pointer leads, the knob follows the same frame.' },
  { id: 'knob-reset', group: 'Control travel', name: 'Double-click reset', frames: 12, easing: '0.33, 1, 0.68, 1', detail: 'Returns to the default value. Ease-out cubic so it lands softly.' },
  { id: 'selector-detent', group: 'Control travel', name: 'Selector detent', frames: 6, easing: '0.34, 1.56, 0.64, 1', detail: 'Snaps to the next position with about 4 degrees of overshoot, like a spring detent.' },
  { id: 'toggle-throw', group: 'Control travel', name: 'Bat toggle throw', frames: 3, easing: 'linear', detail: 'Three frames between positions, then one frame 1 px past and back.' },
  { id: 'step-press', group: 'Control travel', name: 'Step press', frames: 2, easing: 'linear', detail: 'Cap sinks 1.5 px in 2 frames, returns in 3 frames ease-out.' },
  { id: 'hover-ring', group: 'Feedback', name: 'Hover ring', frames: 6, easing: '0.5, 1, 0.89, 1', detail: 'Ring fades to 40% in 6 frames, out in 10.' },
  { id: 'dim', group: 'Feedback', name: 'Dim a section', frames: 12, easing: 'linear', detail: 'Opacity to 42% and saturation to 15% together. Used when Bypass is on or a control has no effect.' },
  { id: 'led-on', group: 'Feedback', name: 'Step LED', frames: 1, easing: 'step', detail: 'On in 1 frame. Off over 9 frames with exponential decay, like a lamp filament, so fast patterns still read.' },
  { id: 'chaos-press', group: 'Feedback', name: 'Chaos press', frames: 1, easing: 'step', detail: 'Cap 2 px down in 1 frame. Glow rises over 4 frames and holds while pressed.' },
  { id: 'screw', group: 'Hidden panel', name: 'Screw loosen', frames: 8, easing: '0.45, 0, 0.55, 1', detail: 'Each screw turns 175 degrees and lifts 2 px. Any order.' },
  { id: 'hatch', group: 'Hidden panel', name: 'Hatch slide', frames: 26, easing: '0.2, 0.8, 0.2, 1', detail: 'After the fourth screw: 4 frame hold, then the plate slides down by its own height and fades in the last 6 frames.' },
  { id: 'cable', group: 'Hidden panel', name: 'Cable drop', frames: 18, easing: 'spring, damping 0.5', detail: 'Sag settles with one visible bounce.' },
  { id: 'vu', group: 'Meter', name: 'VU needle', frames: 18, easing: 'spring, damping 0.8, 19 rad/s', detail: '99% of a step in about 300 ms with 1.5% overshoot, the classic VU response. 0 VU = -20 dBFS RMS.' },
  { id: 'peak', group: 'Meter', name: 'Peak LED', frames: 90, easing: 'hold', detail: 'Lights above -1 dBFS sample peak, holds 90 frames (1.5 s), then off over 9 frames.' },
  { id: 'crt', group: 'Scope', name: 'Phosphor persistence', frames: 9, easing: 'exponential', detail: 'Each frame washes the screen with 22% background, so a trace falls to about 10% in 9 frames.' },
]

export function bezier(p1x, p1y, p2x, p2y) {
  // Sample a CSS cubic-bezier for plotting: returns y for x in [0,1].
  const cx = 3 * p1x
  const bx = 3 * (p2x - p1x) - cx
  const ax = 1 - cx - bx
  const cy = 3 * p1y
  const by = 3 * (p2y - p1y) - cy
  const ay = 1 - cy - by
  const sx = (t) => ((ax * t + bx) * t + cx) * t
  const sy = (t) => ((ay * t + by) * t + cy) * t
  return (x) => {
    let t = x
    for (let i = 0; i < 8; i++) {
      const d = sx(t) - x
      const dx = (3 * ax * t + 2 * bx) * t + cx
      if (Math.abs(d) < 1e-5 || !dx) break
      t -= d / dx
    }
    return sy(Math.min(1, Math.max(0, t)))
  }
}

export function spring(zeta, omega, seconds = 0.6, steps = 120) {
  const out = []
  let x = 0
  let v = 0
  const dt = seconds / steps
  for (let i = 0; i <= steps; i++) {
    out.push(x)
    const a = omega * omega * (1 - x) - 2 * zeta * omega * v
    v += a * dt
    x += v * dt
  }
  return out
}
