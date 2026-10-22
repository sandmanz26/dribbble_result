// Panel hardware. Each part draws itself in four states (idle, hover, drag, dim) and three
// wear stages (mint, worn, busted). `forceState` pins a state for the state sheet and exports.
import { useState } from 'react'
import { chipPath, edgeChips, rng, scratches, wearLevel } from './wear.js'
import { inkFilter } from './Defs.jsx'
import { M } from './materials.js'
import { useControl } from './useControl.js'

const deg = (v) => -135 + v * 270
const polar = (angDeg, r) => {
  const a = ((angDeg - 90) * Math.PI) / 180
  return [Math.cos(a) * r, Math.sin(a) * r]
}
const arc = (r, a0, a1) => {
  const [x0, y0] = polar(a0, r)
  const [x1, y1] = polar(a1, r)
  return `M ${x0} ${y0} A ${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${x1} ${y1}`
}

export function Label({ y, children, wear, p, size = 11, fill = M.ink }) {
  return (
    <text y={y} textAnchor="middle" className="silk" fontSize={size} fill={fill} filter={inkFilter(p, wear)}>
      {children}
    </text>
  )
}

/* ---------- Bakelite knob ---------- */
export function KnobArt({ id, r, value, wear = 'mint', state = 'idle', bipolar, p = 'bz', scale = true, focus }) {
  const a = deg(value)
  const lvl = wearLevel(wear)
  const chips = edgeChips(id, r, wear)
  const scr = scratches(id, r * 1.4, r * 1.4, wear)
  const live = state === 'drag'
  return (
    <g filter={state === 'dim' ? `url(#${p}-dim)` : undefined} opacity={state === 'dim' ? 0.42 : 1}>
      {scale && <KnobTicks r={r} wear={wear} p={p} />}
      {(live || state === 'hover') && (
        <path
          data-layer="value-arc"
          d={bipolar ? arc(r + 8.5, Math.min(0, a), Math.max(0, a)) : arc(r + 8.5, -135, a)}
          stroke={M.accent}
          strokeWidth={live ? 3 : 2}
          strokeOpacity={live ? 1 : 0.45}
          fill="none"
          strokeLinecap="round"
        />
      )}
      <ellipse data-layer="shadow" cx={2} cy={4} rx={r} ry={r * 0.96} fill="#000" opacity={0.28} />
      <circle data-layer="skirt" r={r} fill={`url(#${p}-skirt)`} />
      <g data-layer="rotor" transform={`rotate(${a})`}>
        {Array.from({ length: 28 }, (_, i) => {
          const t = (i * 360) / 28
          const [x0, y0] = polar(t, r - 0.5)
          const [x1, y1] = polar(t, r - Math.max(4, r * 0.14))
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#000" strokeOpacity={0.55} strokeWidth={1.2} />
        })}
        {chips.map((c, i) => (
          <path key={i} d={chipPath(c)} fill={M.bakeliteChip} opacity={0.9} />
        ))}
        <circle r={r * 0.72} fill={`url(#${p}-cap)`} stroke="#000" strokeOpacity={0.4} />
        {scr.map((s, i) => (
          <line key={i} x1={s.x1 - r * 0.7} y1={s.y1 - r * 0.7} x2={s.x2 - r * 0.7} y2={s.y2 - r * 0.7} stroke="#fff" strokeOpacity={s.o * 0.35} strokeWidth={0.6} clipPath={`circle(${r * 0.7}px)`} />
        ))}
        <line
          x1={0}
          y1={-r * 0.18}
          x2={0}
          y2={-r * 0.94}
          stroke={live ? M.accentHot : M.accent}
          strokeWidth={Math.max(2.2, r * 0.09)}
          strokeLinecap="round"
          strokeDasharray={lvl === 2 ? `${r * 0.3} ${r * 0.12} ${r * 0.6}` : lvl === 1 ? `${r * 0.62} ${r * 0.06} ${r}` : undefined}
        />
      </g>
      <ellipse data-layer="gloss" cx={-r * 0.22} cy={-r * 0.3} rx={r * 0.34} ry={r * 0.2} fill="#fff" opacity={[0.22, 0.12, 0.05][lvl]} transform={`rotate(-30 ${-r * 0.22} ${-r * 0.3})`} />
      {(state === 'hover' || live) && <circle data-layer="ring" r={r + 2} fill="none" stroke={M.accent} strokeOpacity={live ? 0.9 : 0.4} strokeWidth={live ? 2 : 1.5} />}
      {focus && <circle r={r + 14} fill="none" stroke={M.ink} strokeWidth={2} strokeDasharray="4 3" />}
    </g>
  )
}

// Silkscreened scale around a knob. Part of the panel artwork, not the knob filmstrip.
export function KnobTicks({ r, wear = 'mint', p = 'bz' }) {
  return (
    <g data-layer="ticks" filter={inkFilter(p, wear)}>
      {Array.from({ length: 11 }, (_, i) => {
        const t = -135 + i * 27
        const [x0, y0] = polar(t, r + 5)
        const [x1, y1] = polar(t, r + (i % 5 === 0 ? 12 : 9))
        return <line key={t} x1={x0} y1={y0} x2={x1} y2={y1} stroke={M.ink} strokeWidth={i % 5 === 0 ? 1.6 : 1} />
      })}
    </g>
  )
}

export function Readout({ y, text }) {
  const w = Math.max(54, text.length * 7.6 + 14)
  return (
    <g transform={`translate(0 ${y})`} pointerEvents="none">
      <rect x={-w / 2} y={-13} width={w} height={22} rx={2} fill={M.ink} />
      <text y={2} textAnchor="middle" className="mono" fontSize={11} fill={M.cream}>{text}</text>
    </g>
  )
}

export function Knob({ c, r, value, onChange, wear, p, disabled, forceState }) {
  const { handlers, state, focus } = useControl({ value, onChange, def: c.def, disabled })
  const st = forceState || state
  return (
    <g
      transform={`translate(${c.x} ${c.y})`}
      className="ctl"
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={c.label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-valuetext={c.fmt ? c.fmt(value) : undefined}
      aria-disabled={disabled || undefined}
      {...handlers}
    >
      <circle r={r + 16} fill="transparent" />
      <KnobArt id={c.id} r={r} value={value} wear={wear} state={st} bipolar={c.bipolar} p={p} focus={focus} />
      <Label y={r + (r > 40 ? 30 : 22)} wear={wear} p={p} size={r > 40 ? 14 : 11}>{c.label.toUpperCase()}</Label>
      {st === 'drag' && c.fmt && <Readout y={-r - 30} text={c.fmt(value)} />}
    </g>
  )
}

/* ---------- Chicken-head selector ---------- */
const SEL_ANGLES = [-100, -35, 35, 100]
export function SelectorScale({ index, wear = 'mint', p = 'bz', options }) {
  return options.map((o, i) => {
    const [x, y] = polar(SEL_ANGLES[i], 36)
    const [tx, ty] = polar(SEL_ANGLES[i], 19)
    const [tx2, ty2] = polar(SEL_ANGLES[i], 24)
    return (
      <g key={o} filter={inkFilter(p, wear)}>
        <line x1={tx} y1={ty} x2={tx2} y2={ty2} stroke={M.ink} strokeWidth={1.6} />
        <text x={x} y={y + 4} textAnchor="middle" className="silk" fontSize={8.5} fill={i === index ? M.ink : '#5a5246'} fontWeight={i === index ? 800 : 500}>
          {o.toUpperCase()}
        </text>
      </g>
    )
  })
}
export function SelectorArt({ id, index, wear = 'mint', state = 'idle', p = 'bz', options, focus, labels = true }) {
  const a = SEL_ANGLES[index] ?? 0
  const chips = edgeChips(id, 20, wear)
  return (
    <g opacity={state === 'dim' ? 0.42 : 1} filter={state === 'dim' ? `url(#${p}-dim)` : undefined}>
      {labels && <SelectorScale index={index} wear={wear} p={p} options={options} />}
      <ellipse cx={2} cy={4} rx={16} ry={15} fill="#000" opacity={0.28} />
      <circle r={16} fill={`url(#${p}-skirt)`} />
      <g transform={`rotate(${a}) scale(0.8)`}>
        {chips.map((c, i) => <path key={i} d={chipPath(c)} fill={M.bakeliteChip} />)}
        <path d="M -9 8 L -5 -26 Q 0 -31 5 -26 L 9 8 Q 0 13 -9 8 Z" fill={`url(#${p}-cap)`} stroke="#000" strokeOpacity={0.5} />
        <line x1={0} y1={-6} x2={0} y2={-25} stroke={state === 'drag' ? M.accentHot : M.accent} strokeWidth={2.4} strokeLinecap="round" />
      </g>
      {(state === 'hover' || state === 'drag') && <circle r={22} fill="none" stroke={M.accent} strokeOpacity={state === 'drag' ? 0.9 : 0.4} strokeWidth={1.5} />}
      {focus && <circle r={34} fill="none" stroke={M.ink} strokeWidth={2} strokeDasharray="4 3" />}
    </g>
  )
}

function useStepped({ count, index, onChange, disabled }) {
  const { handlers, state, focus } = useControl({
    value: index / (count - 1),
    onChange: (v) => onChange(Math.round(v * (count - 1))),
    def: 0,
    disabled,
  })
  const click = disabled ? {} : { onClick: () => onChange((index + 1) % count) }
  return { handlers: { ...handlers, ...click }, state, focus }
}

export function Selector({ c, index, onChange, wear, p, disabled, forceState }) {
  const { handlers, state, focus } = useStepped({ count: c.options.length, index, onChange, disabled })
  return (
    <g transform={`translate(${c.x} ${c.y})`} className="ctl" role="slider" tabIndex={0} aria-label={c.label} aria-valuemin={0} aria-valuemax={c.options.length - 1} aria-valuenow={index} aria-valuetext={c.options[index]} {...handlers}>
      <circle r={40} fill="transparent" />
      <SelectorArt id={c.id} index={index} wear={wear} state={forceState || state} p={p} options={c.options} focus={focus} />
      <Label y={32} wear={wear} p={p}>{c.label.toUpperCase()}</Label>
    </g>
  )
}

/* ---------- Bat toggle (2 or 3 positions) ---------- */
export function BatArt({ positions = 2, index, wear = 'mint', state = 'idle', p = 'bz', focus }) {
  const throwY = positions === 3 ? [-14, 0, 14][index] : index ? 12 : -12
  const lean = positions === 3 ? [-1, 0, 1][index] : index ? 1 : -1
  const rand = rng('bat')
  return (
    <g opacity={state === 'dim' ? 0.42 : 1} filter={state === 'dim' ? `url(#${p}-dim)` : undefined}>
      <circle r={13} fill={`url(#${p}-metal)`} stroke="#000" strokeOpacity={0.35} />
      <polygon points="-9,-5 0,-10 9,-5 9,5 0,10 -9,5" fill={`url(#${p}-metal)`} stroke="#000" strokeOpacity={0.4} />
      {wearLevel(wear) > 0 && <circle r={13} fill="none" stroke="#3b2a1a" strokeOpacity={0.25 * wearLevel(wear) + rand() * 0.1} strokeWidth={3} />}
      <g transform={`translate(0 ${throwY * 0.15})`}>
        <path d={`M -2.6 0 L ${-3.4 + lean * 2} ${throwY * 1.6} L ${3.4 + lean * 2} ${throwY * 1.6} L 2.6 0 Z`} fill={`url(#${p}-metal)`} stroke="#000" strokeOpacity={0.5} />
        <ellipse cx={lean * 2} cy={throwY * 1.6} rx={5} ry={4} fill="#E4DFD4" stroke="#000" strokeOpacity={0.5} />
      </g>
      {(state === 'hover' || state === 'drag') && <circle r={18} fill="none" stroke={M.accent} strokeOpacity={state === 'drag' ? 0.9 : 0.4} strokeWidth={1.5} />}
      {focus && <circle r={30} fill="none" stroke={M.ink} strokeWidth={2} strokeDasharray="4 3" />}
    </g>
  )
}

export function Toggle3({ c, index, onChange, wear, p, disabled, forceState }) {
  const { handlers, state, focus } = useStepped({ count: 3, index: 2 - index, onChange: (i) => onChange(2 - i), disabled })
  return (
    <g transform={`translate(${c.x} ${c.y})`} className="ctl" role="slider" tabIndex={0} aria-label={c.label} aria-valuemin={0} aria-valuemax={2} aria-valuenow={index} aria-valuetext={c.options[index]} {...handlers}>
      <rect x={-20} y={-34} width={64} height={68} fill="transparent" />
      <BatArt positions={3} index={2 - index} wear={wear} state={forceState || state} p={p} focus={focus} />
      <g filter={inkFilter(p, wear)}>
        {c.options.map((o, i) => (
          <text key={o} x={22} y={[-14, 0, 14][2 - i] + 4} className="mono" fontSize={9.5} fill={i === index ? M.ink : '#6b6152'} fontWeight={i === index ? 700 : 400}>{o}</text>
        ))}
      </g>
      <Label y={34} wear={wear} p={p}>{c.label.toUpperCase()}</Label>
    </g>
  )
}

export function Bypass({ c, on, onChange, wear, p, forceState }) {
  const { handlers, state, focus } = useStepped({ count: 2, index: on ? 1 : 0, onChange: (i) => onChange(i), disabled: false })
  return (
    <g transform={`translate(${c.x} ${c.y})`} className="ctl" role="switch" tabIndex={0} aria-label="Bypass" aria-checked={on} {...handlers}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(on ? 0 : 1) } }}>
      <rect x={-20} y={-30} width={40} height={60} fill="transparent" />
      <BatArt positions={2} index={on ? 1 : 0} wear={wear} state={forceState || state} p={p} focus={focus} />
      <g filter={inkFilter(p, wear)}>
        <text x={-22} y={-14} textAnchor="end" className="silk" fontSize={10} fill={M.cream}>ON</text>
        <text x={-22} y={20} textAnchor="end" className="silk" fontSize={10} fill={M.cream}>BYPASS</text>
      </g>
    </g>
  )
}

/* ---------- Momentary button ---------- */
export function MomentaryArt({ r, pressed, wear = 'mint', state = 'idle', p = 'bz', focus }) {
  const chips = edgeChips('momentary', r * 0.78, wear)
  return (
    <g opacity={state === 'dim' ? 0.42 : 1} filter={state === 'dim' ? `url(#${p}-dim)` : undefined}>
      <circle r={r + 6} fill={`url(#${p}-metal)`} stroke="#000" strokeOpacity={0.35} />
      <circle r={r + 1} fill="#120c08" />
      {pressed && <circle r={r + 2} fill={M.accent} opacity={0.5} filter={`url(#${p}-glow)`} />}
      <g transform={`translate(0 ${pressed ? 2 : 0})`}>
        <circle r={r * 0.82} fill={`url(#${p}-cap)`} />
        <circle r={r * 0.82} fill="none" stroke={pressed ? M.accentHot : M.accent} strokeWidth={3} />
        {chips.map((c, i) => <path key={i} d={chipPath(c)} fill={M.bakeliteChip} />)}
        <ellipse cx={-r * 0.25} cy={-r * 0.3} rx={r * 0.3} ry={r * 0.16} fill="#fff" opacity={[0.2, 0.1, 0.04][wearLevel(wear)]} />
      </g>
      {state === 'hover' && !pressed && <circle r={r + 9} fill="none" stroke={M.accent} strokeOpacity={0.4} strokeWidth={1.5} />}
      {focus && <circle r={r + 14} fill="none" stroke={M.ink} strokeWidth={2} strokeDasharray="4 3" />}
    </g>
  )
}

export function Momentary({ c, onHold, wear, p, forceState }) {
  const [pressed, setPressed] = useHold(onHold)
  const st = forceState || (pressed.on ? 'drag' : pressed.hover ? 'hover' : 'idle')
  return (
    <g transform={`translate(${c.x} ${c.y})`} className="ctl" role="button" tabIndex={0} aria-label={`${c.label}, hold`} aria-pressed={pressed.on} {...setPressed}>
      <MomentaryArt r={c.r} pressed={st === 'drag'} wear={wear} state={st} p={p} focus={pressed.focus} />
      <Label y={c.r + 26} wear={wear} p={p}>{c.label.toUpperCase()}</Label>
    </g>
  )
}

export function useHold(onHold) {
  const [s, set] = useState({ on: false, hover: false, focus: false })
  const on = (v) => {
    set((x) => ({ ...x, on: v }))
    onHold(v)
  }
  return [
    s,
    {
      onPointerDown: (e) => { e.currentTarget.setPointerCapture(e.pointerId); on(true) },
      onPointerUp: () => on(false),
      onPointerCancel: () => on(false),
      onPointerEnter: () => set((x) => ({ ...x, hover: true })),
      onPointerLeave: () => set((x) => ({ ...x, hover: false })),
      onKeyDown: (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); on(true) } },
      onKeyUp: (e) => { if (e.key === ' ' || e.key === 'Enter') on(false) },
      onFocus: () => set((x) => ({ ...x, focus: true })),
      onBlur: () => { set((x) => ({ ...x, focus: false })); if (s.on) on(false) },
    },
  ]
}

/* ---------- Sequencer step ---------- */
export function StepArt({ size = 34, level, playing, wear = 'mint', state = 'idle', p = 'bz', focus, n }) {
  const h = size
  const lvl = wearLevel(wear)
  const rand = rng(`step${n}`)
  const worn = lvl > 0 && rand() < [0, 0.35, 0.7][lvl]
  const lit = level > 0
  return (
    <g opacity={state === 'dim' ? 0.42 : 1} filter={state === 'dim' ? `url(#${p}-dim)` : undefined}>
      <rect x={-h / 2 + 2} y={-h / 2 + 3} width={h} height={h} rx={4} fill="#000" opacity={0.3} />
      <g transform={`translate(0 ${state === 'drag' ? 1.5 : 0})`}>
        <rect x={-h / 2} y={-h / 2} width={h} height={h} rx={4} fill="#1d1612" stroke="#000" strokeOpacity={0.6} />
        <rect x={-h / 2 + 3} y={-h / 2 + 3} width={h - 6} height={h - 6} rx={2.5} fill={worn ? '#2c231d' : '#251c17'} />
        {lit && (
          <rect x={-h / 2 + 6} y={h / 2 - 6 - (h - 12) * level} width={h - 12} height={(h - 12) * level} rx={1.5} fill={M.accent} opacity={playing ? 1 : 0.55} />
        )}
        {worn && <rect x={-h / 2 + 3} y={-h / 2 + 3} width={h - 6} height={(h - 6) * 0.35} rx={2.5} fill="#fff" opacity={0.05} />}
      </g>
      {(state === 'hover' || state === 'drag') && <rect x={-h / 2 - 3} y={-h / 2 - 3} width={h + 6} height={h + 6} rx={6} fill="none" stroke={M.accent} strokeOpacity={state === 'drag' ? 0.9 : 0.45} strokeWidth={1.5} />}
      {focus && <rect x={-h / 2 - 7} y={-h / 2 - 7} width={h + 14} height={h + 14} rx={8} fill="none" stroke={M.ink} strokeWidth={2} strokeDasharray="4 3" />}
    </g>
  )
}

export function Led({ x, y, on, level = 1, p = 'bz', r = 5 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Lamp-like decay: on in one frame, off over 9 frames (see motion spec). */}
      <circle r={r * 2.6} fill={`url(#${p}-led)`} opacity={on ? 0.55 * level : 0} style={{ transition: on ? 'none' : 'opacity 150ms ease-out' }} />
      <circle r={r} fill={M.ledOff} stroke="#000" strokeOpacity={0.5} />
      <circle r={r} fill={M.accent} opacity={on ? 0.5 + 0.5 * level : 0} style={{ transition: on ? 'none' : 'opacity 150ms ease-out' }} />
      <circle cx={-r * 0.3} cy={-r * 0.35} r={r * 0.35} fill="#fff" opacity={on ? 0.6 : 0.15} />
    </g>
  )
}

/* ---------- Hatch hardware ---------- */
export function Screw({ x, y, out, onClick, p = 'bz', label }) {
  const rot = out ? 200 : 25
  return (
    <g transform={`translate(${x} ${y})`} className={onClick ? 'ctl' : undefined} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} aria-label={label}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined}>
      <circle r={onClick ? 16 : 7} fill="transparent" />
      {out && <ellipse cx={1.5} cy={3.5} rx={7} ry={6} fill="#000" opacity={0.35} />}
      <g transform={`translate(0 ${out ? -2 : 0}) rotate(${rot})`} className="screw-head">
        <circle r={7} fill={`url(#${p}-metal)`} stroke="#000" strokeOpacity={0.45} />
        <line x1={-5} y1={0} x2={5} y2={0} stroke="#2a2620" strokeWidth={1.6} />
      </g>
    </g>
  )
}

export function JackArt({ dir, active, state = 'idle', p = 'bz' }) {
  return (
    <g>
      <polygon points="-11,-6.4 0,-12.7 11,-6.4 11,6.4 0,12.7 -11,6.4" fill={`url(#${p}-metal)`} stroke="#000" strokeOpacity={0.45} />
      <circle r={6.5} fill="#0b0806" />
      <circle r={3} fill="#2a241e" />
      {dir === 'out' && <circle r={15} fill="none" stroke={M.ink} strokeWidth={1.2} strokeDasharray="2 2" />}
      {(active || state !== 'idle') && <circle r={17} fill="none" stroke={M.accent} strokeOpacity={active ? 1 : 0.5} strokeWidth={1.8} />}
    </g>
  )
}

export function PadArt({ pressed, state = 'idle', p = 'bz', wear = 'mint' }) {
  return (
    <g>
      <rect x={-24} y={-12} width={48} height={24} rx={2} fill={`url(#${p}-copper)`} opacity={[1, 0.85, 0.7][wearLevel(wear)]} stroke="#000" strokeOpacity={0.45} />
      <circle cx={-16} cy={0} r={3} fill={`url(#${p}-metal)`} />
      <circle cx={16} cy={0} r={3} fill={`url(#${p}-metal)`} />
      {wearLevel(wear) > 0 && <rect x={-24} y={-12} width={48} height={24} rx={2} fill="#2e5a3e" opacity={0.18 * wearLevel(wear)} />}
      {(pressed || state === 'hover') && <rect x={-27} y={-15} width={54} height={30} rx={3} fill="none" stroke={M.accent} strokeWidth={pressed ? 2.4 : 1.4} strokeOpacity={pressed ? 1 : 0.5} />}
    </g>
  )
}

/* ---------- VU meter ---------- */
const VU_MARKS = [-20, -10, -7, -5, -3, -1, 0, 1, 3]
// VU scale is not linear: map dB to the needle's 0..1 travel the way classic VU faces do.
export const vuPos = (db) => {
  const v = Math.pow(10, db / 20)
  const lo = Math.pow(10, -20 / 20)
  const hi = Math.pow(10, 3 / 20)
  return Math.min(1.05, Math.max(-0.02, (v - lo) / (hi - lo)))
}

export function VuMeter({ x, y, w, h, pos, peak, wear = 'mint', p = 'bz', layer = 'all' }) {
  const face = layer !== 'needle'
  const needle = layer !== 'face'
  const pivotY = h + 28
  const R = h + 6
  const toAng = (t) => -48 + t * 96
  const lvl = wearLevel(wear)
  return (
    <g transform={`translate(${x} ${y})`}>
      {face && <rect x={-6} y={-6} width={w + 12} height={h + 12} rx={4} fill="#120c08" />}
      <svg x={0} y={0} width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="hidden">
        {face && <rect width={w} height={h} fill={M.paper} />}
        {face && lvl > 0 && <rect width={w} height={h} fill="#C9A866" opacity={0.18 * lvl} />}
        <g transform={`translate(${w / 2} ${pivotY})`} display={face ? undefined : 'none'}>
          <path d={arc(R - 18, toAng(vuPos(0)), toAng(1))} stroke={M.accent} strokeWidth={6} fill="none" />
          <path d={arc(R - 18, toAng(0), toAng(vuPos(0)))} stroke={M.ink} strokeWidth={1.2} fill="none" />
          {VU_MARKS.map((m) => {
            const a = toAng(vuPos(m))
            const [x0, y0] = polar(a, R - 21)
            const [x1, y1] = polar(a, R - 30)
            const [tx, ty] = polar(a, R - 8)
            return (
              <g key={m}>
                <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={M.ink} strokeWidth={1.2} />
                <text x={tx} y={ty + 3} textAnchor="middle" className="mono" fontSize={8.5} fill={m >= 0 ? M.accent : M.ink}>{m > 0 ? `+${m}` : m}</text>
              </g>
            )
          })}
          <text y={-R * 0.42} textAnchor="middle" className="silk" fontSize={13} fill={M.ink}>VU</text>
        </g>
        {needle && (
          <g transform={`translate(${w / 2} ${pivotY})`}>
            <line x1={0} y1={0} x2={polar(toAng(pos), R - 12)[0]} y2={polar(toAng(pos), R - 12)[1]} stroke="#111" strokeWidth={1.4} />
          </g>
        )}
        {face && lvl === 2 && <ellipse cx={w * 0.72} cy={h * 0.7} rx={w * 0.22} ry={h * 0.2} fill="#7A5A2A" opacity={0.14} />}
        {face && <rect width={w} height={h} fill={`url(#${p}-glass)`} />}
        {face && lvl === 2 && <line x1={w * 0.1} y1={h * 0.15} x2={w * 0.42} y2={h * 0.9} stroke="#fff" strokeOpacity={0.35} strokeWidth={0.8} />}
      </svg>
      {layer === 'all' && <Led x={w - 10} y={h + 18} on={peak} p={p} r={4} />}
      {face && <text x={w - 22} y={h + 21} textAnchor="end" className="mono" fontSize={8.5} fill={M.ink}>PEAK</text>}
    </g>
  )
}
