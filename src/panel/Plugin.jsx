// The full plugin face at a fixed 12:7 aspect ratio. One SVG holds the hardware; the scope
// canvas and the preset menu are HTML laid over it at the same logical coordinates.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NavArrowDown, NavArrowLeft, NavArrowRight } from 'iconoir-react'
import { CONTROLS, HATCH, JACKS, KNOB_R, MODULES, PADS, PANEL, SCREWS, STEP } from '../data/controls.js'
import { PRESETS } from '../data/presets.js'
import { Crt } from './Crt.jsx'
import { Defs, inkFilter } from './Defs.jsx'
import { M } from './materials.js'
import { Bypass, JackArt, Knob, KnobTicks, Label, Led, Momentary, PadArt, Screw, Selector, SelectorScale, StepArt, Toggle3, useHold, VuMeter, vuPos } from './parts.jsx'
import { scratches, wearLevel } from './wear.js'

const pct = (v, of) => `${(v / of) * 100}%`
const box = (x, y, w, h) => ({ left: pct(x, PANEL.width), top: pct(y, PANEL.height), width: pct(w, PANEL.width), height: pct(h, PANEL.height) })

/* ---------- meter with VU ballistics ---------- */
// Second-order needle: damping 0.8, natural frequency 19 rad/s. Reaches 99% of a step in
// about 300 ms with 1.5% overshoot, the classic VU spec. 0 VU = -18 dBFS RMS.
export const VU_BALLISTICS = { zeta: 0.8, omega: 19, refDbfs: -20, peakDbfs: -1, peakHoldMs: 1500 }

function Meter({ engine, wear }) {
  const [pos, setPos] = useState(0)
  const [peak, setPeak] = useState(false)
  const st = useRef({ x: 0, v: 0, last: 0, peakUntil: 0 })
  useEffect(() => {
    let raf
    const loop = (now) => {
      const s = st.current
      const dt = Math.min(0.05, s.last ? (now - s.last) / 1000 : 0.016)
      s.last = now
      const d = engine?.read()
      const db = d && d.rms > 0 ? 20 * Math.log10(d.rms) - VU_BALLISTICS.refDbfs : -40
      const target = Math.max(0, vuPos(db))
      const { zeta, omega } = VU_BALLISTICS
      const acc = omega * omega * (target - s.x) - 2 * zeta * omega * s.v
      s.v += acc * dt
      s.x += s.v * dt
      if (d && d.peak > Math.pow(10, VU_BALLISTICS.peakDbfs / 20)) s.peakUntil = now + VU_BALLISTICS.peakHoldMs
      setPos(Math.max(-0.02, Math.min(1.05, s.x)))
      setPeak(now < s.peakUntil)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [engine])
  return <VuMeter x={732} y={136} w={184} h={104} pos={pos} peak={peak} wear={wear} />
}

/* ---------- sequencer row ---------- */
function Step({ i, level, playing, onChange, wear, dim }) {
  const [st, setSt] = useState({ hover: false, drag: false, focus: false })
  const start = useRef(null)
  const x = STEP.x0 + i * STEP.dx
  return (
    <g
      transform={`translate(${x} ${STEP.y})`}
      className="ctl"
      role="slider"
      tabIndex={0}
      aria-label={`Step ${i + 1}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(level * 100)}
      aria-valuetext={level ? `${Math.round(level * 100)}%` : 'Off'}
      onPointerEnter={() => setSt((s) => ({ ...s, hover: true }))}
      onPointerLeave={() => setSt((s) => ({ ...s, hover: false }))}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        start.current = { y: e.clientY, v: level, moved: false }
        setSt((s) => ({ ...s, drag: true }))
      }}
      onPointerMove={(e) => {
        const s = start.current
        if (!s) return
        const dy = s.y - e.clientY
        if (Math.abs(dy) > 3) s.moved = true
        if (s.moved) onChange(Math.min(1, Math.max(0, s.v + dy / 60)))
      }}
      onPointerUp={() => {
        if (start.current && !start.current.moved) onChange(level > 0 ? 0 : 1)
        start.current = null
        setSt((s) => ({ ...s, drag: false }))
      }}
      onKeyDown={(e) => {
        const d = { ArrowUp: 0.1, ArrowDown: -0.1 }[e.key]
        if (d) { e.preventDefault(); onChange(Math.min(1, Math.max(0, level + d))) }
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(level > 0 ? 0 : 1) }
      }}
      onFocus={() => setSt((s) => ({ ...s, focus: true }))}
      onBlur={() => setSt((s) => ({ ...s, focus: false }))}
    >
      <rect x={-22} y={-24} width={44} height={48} fill="transparent" />
      <StepArt n={i} level={level} playing={playing} wear={wear} state={dim ? 'dim' : st.drag ? 'drag' : st.hover ? 'hover' : 'idle'} focus={st.focus} />
    </g>
  )
}

function StepRow({ engine, steps, setSteps, wear, dim }) {
  const [cur, setCur] = useState(-1)
  useEffect(() => {
    let raf
    let last = -2
    const loop = () => {
      const c = engine ? engine.currentStep() : -1
      if (c !== last) { last = c; setCur(c) }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [engine])
  return (
    <g role="group" aria-label="Step sequencer">
      {steps.map((lv, i) => (
        <g key={i}>
          <Led x={STEP.x0 + i * STEP.dx} y={STEP.ledY} on={cur === i} level={1} r={4.5} />
          <text x={STEP.x0 + i * STEP.dx} y={STEP.y + 30} textAnchor="middle" className="mono" fontSize={8.5} fill={i % 4 === 0 ? M.ink : '#6d6455'} filter={inkFilter('bz', wear)}>
            {String(i + 1).padStart(2, '0')}
          </text>
          <Step i={i} level={lv} playing={cur === i} wear={wear} dim={dim} onChange={(v) => setSteps((s) => s.map((x, j) => (j === i ? v : x)))} />
        </g>
      ))}
    </g>
  )
}

/* ---------- patch cables ---------- */
const jackById = (id) => JACKS.find((j) => j.id === id)
function Cable({ from, to, n }) {
  const a = jackById(from)
  const b = jackById(to)
  const sag = 34 + Math.abs(a.x - b.x) * 0.35
  const color = n % 2 ? M.cream : '#151110'
  const d = `M ${a.x} ${a.y} C ${a.x} ${a.y + sag}, ${b.x} ${b.y + sag}, ${b.x} ${b.y}`
  return (
    <g pointerEvents="none">
      <path d={d} stroke="#000" strokeOpacity={0.35} strokeWidth={7} fill="none" transform="translate(2 4)" />
      <path d={d} stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d={d} stroke="#fff" strokeOpacity={0.18} strokeWidth={1.2} fill="none" transform="translate(-1 -1)" />
      {[a, b].map((j, i) => (
        <g key={i} transform={`translate(${j.x} ${j.y})`}>
          <circle r={7.5} fill={`url(#bz-metal)`} stroke="#000" strokeOpacity={0.5} />
          <circle r={3.5} fill={color} />
        </g>
      ))}
    </g>
  )
}

function Pad({ pad, onHold, wear }) {
  const [s, h] = useHold(onHold)
  return (
    <g transform={`translate(${pad.x} ${pad.y})`} className="ctl" role="button" tabIndex={0} aria-label={`${pad.label} contact, hold`} aria-pressed={s.on} {...h}>
      <PadArt pressed={s.on} state={s.hover ? 'hover' : 'idle'} wear={wear} />
      <text y={-17} textAnchor="middle" className="mono" fontSize={8.5} fill={M.cream}>{pad.label.toUpperCase()}</text>
      {s.focus && <rect x={-30} y={-18} width={60} height={36} rx={4} fill="none" stroke={M.cream} strokeWidth={1.5} strokeDasharray="4 3" />}
    </g>
  )
}

/* ---------- preset menu (HTML) ---------- */
function PresetMenu({ presetId, modified, onPick }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const idx = PRESETS.findIndex((p) => p.id === presetId)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])
  const step = (d) => onPick(PRESETS[(idx + d + PRESETS.length) % PRESETS.length].id)
  return (
    <div className="preset" ref={ref}>
      <button type="button" className="preset-step" aria-label="Previous preset" onClick={() => step(-1)}><NavArrowLeft /></button>
      <button
        type="button"
        className="preset-name"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => { setActive(Math.max(0, idx)); setOpen(!open) }}
        onKeyDown={(e) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); setActive(Math.max(0, idx)); setOpen(true) }
          else if (open && e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(PRESETS.length - 1, a + 1)) }
          else if (open && e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
          else if (open && e.key === 'Enter') { e.preventDefault(); onPick(PRESETS[active].id); setOpen(false) }
          else if (e.key === 'Escape') setOpen(false)
        }}
        aria-activedescendant={open ? `preset-${PRESETS[active].id}` : undefined}
        aria-controls="preset-list"
      >
        <span className="preset-no">{String(idx + 1).padStart(2, '0')}</span>
        <span className="preset-label">{PRESETS[idx]?.name}{modified ? ' *' : ''}</span>
        <NavArrowDown className="preset-caret" />
      </button>
      <button type="button" className="preset-step" aria-label="Next preset" onClick={() => step(1)}><NavArrowRight /></button>
      {open && (
        <ul className="preset-list" role="listbox" id="preset-list" aria-label="Presets">
          {PRESETS.map((p, i) => (
            <li
              key={p.id}
              id={`preset-${p.id}`}
              role="option"
              aria-selected={p.id === presetId}
              className={i === active ? 'is-active' : ''}
              onPointerEnter={() => setActive(i)}
              onClick={() => { onPick(p.id); setOpen(false) }}
            >
              <span className="preset-no">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="preset-label">{p.name}</span>
                <span className="preset-note">{p.note}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ---------- module chrome ---------- */
function Module({ m, wear }) {
  return (
    <g>
      <rect x={m.x} y={m.y} width={m.w} height={m.h} fill="none" stroke={M.ink} strokeWidth={1.5} />
      <rect x={m.x} y={m.y} width={m.w} height={24} fill={M.ink} />
      <g filter={inkFilter('bz', wear)}>
        {m.n && <text x={m.x + 8} y={m.y + 16.5} className="mono" fontSize={10} fill={M.accent}>{m.n}</text>}
        <text x={m.x + (m.n ? 30 : 8)} y={m.y + 17} className="slab" fontSize={13} fill={M.cream}>{m.name.toUpperCase()}</text>
      </g>
    </g>
  )
}

// Panel silkscreen for one control: what stays printed on the background asset.
function Silk({ c, wear }) {
  const t = (y, txt, size = 11) => <Label y={y} wear={wear} p="bz" size={size}>{txt}</Label>
  if (c.kind === 'knob') {
    const r = KNOB_R[c.size]
    return <g transform={`translate(${c.x} ${c.y})`}><KnobTicks r={r} wear={wear} />{t(r + (r > 40 ? 30 : 22), c.label.toUpperCase(), r > 40 ? 14 : 11)}</g>
  }
  if (c.kind === 'selector') return <g transform={`translate(${c.x} ${c.y})`}><SelectorScale index={-1} wear={wear} p="bz" options={c.options} />{t(32, c.label.toUpperCase())}</g>
  if (c.kind === 'toggle3') return <g transform={`translate(${c.x} ${c.y})`}>{c.options.map((o, i) => <text key={o} x={22} y={[-14, 0, 14][2 - i] + 4} className="mono" fontSize={9.5} fill="#6b6152">{o}</text>)}{t(34, c.label.toUpperCase())}</g>
  if (c.kind === 'momentary') return <g transform={`translate(${c.x} ${c.y})`}>{t(c.r + 26, c.label.toUpperCase())}</g>
  if (c.kind === 'bat') return <g transform={`translate(${c.x} ${c.y})`}><text x={-22} y={-14} textAnchor="end" className="silk" fontSize={10} fill={M.cream}>ON</text><text x={-22} y={20} textAnchor="end" className="silk" fontSize={10} fill={M.cream}>BYPASS</text></g>
  return null
}

export function Plugin({ layer = 'all', engine, running, wear = 'mint', values, setValue, steps, setSteps, cables, setCables, presetId, modified, onPreset, hatchOpen, setHatchOpen }) {
  const [screws, setScrews] = useState([false, false, false, false])
  const [pickJack, setPickJack] = useState(null)
  const read = useCallback(() => (running ? engine?.read() : null), [engine, running])
  const lvl = wearLevel(wear)
  const panelScr = useMemo(() => scratches('panel', PANEL.width, PANEL.height, wear), [wear])
  const bypass = values.bypass >= 0.5

  useEffect(() => {
    if (screws.every(Boolean)) setHatchOpen(true)
  }, [screws, setHatchOpen])
  useEffect(() => {
    if (!hatchOpen) setScrews([false, false, false, false])
  }, [hatchOpen])

  const dimFor = (id) => {
    if (bypass && id !== 'output') return true
    if (id === 'speed' && values.depth < 0.01) return true
    if (['target', 'division', 'swing'].includes(id) && values.amount < 0.01) return true
    return false
  }

  const control = (c) => {
    const common = { key: c.id, c, wear, p: 'bz', disabled: dimFor(c.id) }
    if (c.kind === 'knob') return <Knob {...common} r={KNOB_R[c.size]} value={values[c.id]} onChange={(v) => setValue(c.id, v)} />
    if (c.kind === 'selector') return <Selector {...common} index={values[c.id]} onChange={(v) => setValue(c.id, v)} />
    if (c.kind === 'toggle3') return <Toggle3 {...common} index={values[c.id]} onChange={(v) => setValue(c.id, v)} />
    if (c.kind === 'momentary') return <Momentary key={c.id} c={c} wear={wear} p="bz" onHold={(on) => engine?.hold('chaos', on)} />
    if (c.kind === 'bat') return <Bypass key={c.id} c={c} on={bypass} onChange={(v) => setValue('bypass', v)} wear={wear} p="bz" />
    return null
  }

  const clickJack = (j) => {
    if (j.dir === 'out') return setPickJack(pickJack === j.id ? null : j.id)
    const existing = cables.find(([, to]) => to === j.id)
    if (!pickJack) {
      if (existing) setCables(cables.filter((c) => c !== existing))
      return
    }
    setCables([...cables.filter(([, to]) => to !== j.id), [pickJack, j.id]])
    setPickJack(null)
  }

  const enamel = [M.enamel, M.enamelWorn, M.enamelBusted][lvl]

  return (
    <div className={`plugin wear-${wear}`}>
      <svg viewBox={`0 0 ${PANEL.width} ${PANEL.height}`} className="plugin-svg" role="group" aria-label="Scrapyard plugin panel">
        <Defs p="bz" />
        <rect width={PANEL.width} height={PANEL.height} rx={10} fill={enamel} />
        {lvl > 0 && <rect width={PANEL.width} height={PANEL.height} rx={10} filter="url(#bz-grime)" opacity={lvl === 1 ? 0.22 : 0.7} />}
        {lvl > 1 && <rect width={PANEL.width} height={PANEL.height} rx={10} filter="url(#bz-speckle)" opacity={0.7} />}
        {panelScr.map((s, i) => <line key={i} {...s} stroke="#fff" strokeOpacity={s.o * 0.5} strokeWidth={0.8} />)}

        {/* header slab */}
        <rect width={PANEL.width} height={84} rx={10} fill={M.ink} />
        <rect y={40} width={PANEL.width} height={44} fill={M.ink} />
        <g filter={inkFilter('bz', wear)}>
          <text x={26} y={57} className="title" fontSize={35} fill={M.cream}>SCRAPYARD</text>
          <polygon points="398,10 424,10 398,74 372,74" fill={M.accent} />
          <text x={444} y={34} className="mono" fontSize={10} fill={M.cream}>BC-01</text>
          <text x={444} y={52} className="mono" fontSize={9} fill="#b9ae97">CIRCUIT-BENT</text>
          <text x={444} y={66} className="mono" fontSize={9} fill="#b9ae97">SIGNAL WRECKER</text>
          <text x={1012} y={30} className="mono" fontSize={8.5} fill="#b9ae97" textAnchor="end">THE BUSTICATED CO.</text>
          <text x={1012} y={70} className="mono" fontSize={9} fill={M.cream} textAnchor="end">POWER</text>
        </g>
        {layer === 'all' && <Led x={1036} y={66} on={running} r={5} />}

        {MODULES.map((m) => <Module key={m.id} m={m} wear={wear} />)}

        {/* scope bezel */}
        <rect x={226} y={128} width={452} height={224} rx={14} fill="#0b0806" />
        <rect x={226} y={128} width={452} height={224} rx={14} fill="none" stroke={M.metalDark} strokeWidth={2} />

        {layer === 'all' ? (
          <>
            <Meter engine={running ? engine : null} wear={wear} />
            <StepRow engine={running ? engine : null} steps={steps} setSteps={setSteps} wear={wear} dim={bypass} />
            {CONTROLS.map(control)}
          </>
        ) : (
          <>
            <VuMeter x={732} y={136} w={184} h={104} pos={0} wear={wear} layer="face" />
            {steps.map((_, i) => (
              <text key={i} x={STEP.x0 + i * STEP.dx} y={STEP.y + 30} textAnchor="middle" className="mono" fontSize={8.5} fill={i % 4 === 0 ? M.ink : '#6d6455'} filter={inkFilter('bz', wear)}>{String(i + 1).padStart(2, '0')}</text>
            ))}
            {CONTROLS.map((c) => <Silk key={c.id} c={c} wear={wear} />)}
          </>
        )}

        {/* service hatch: patch bay underneath, plate on top */}
        {layer === 'all' && <g aria-hidden={!hatchOpen}>
          <rect x={HATCH.x + 6} y={HATCH.y + 28} width={HATCH.w - 12} height={HATCH.h - 34} fill="#1a1410" />
          <text x={HATCH.x + 12} y={HATCH.y + 60} className="mono" fontSize={7} fill="#b9ae97" transform={`rotate(-90 ${HATCH.x + 12} ${HATCH.y + 60})`}>OUT</text>
          <text x={HATCH.x + 12} y={HATCH.y + 118} className="mono" fontSize={7} fill="#b9ae97" transform={`rotate(-90 ${HATCH.x + 12} ${HATCH.y + 118})`}>IN</text>
          {JACKS.map((j) => (
            <g key={j.id} transform={`translate(${j.x} ${j.y})`} className="ctl" role="button" tabIndex={hatchOpen ? 0 : -1}
              aria-label={`${j.dir === 'out' ? 'Output' : 'Input'} jack ${j.label}${pickJack === j.id ? ', selected' : ''}`}
              onClick={() => clickJack(j)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickJack(j) } }}>
              <circle r={18} fill="transparent" />
              <JackArt dir={j.dir} active={pickJack === j.id} />
              <text y={-17} textAnchor="middle" className="mono" fontSize={8} fill={M.cream}>{j.label.toUpperCase()}</text>
            </g>
          ))}
          {PADS.map((pd) => <Pad key={pd.id} pad={pd} wear={wear} onHold={(on) => engine?.hold(pd.id, on)} />)}
        </g>}
        <g className={`hatch-plate${hatchOpen ? ' is-open' : ''}`}>
          <rect x={HATCH.x + 4} y={HATCH.y + 26} width={HATCH.w - 8} height={HATCH.h - 30} fill={enamel} stroke={M.ink} strokeWidth={1.2} />
          {lvl > 0 && <rect x={HATCH.x + 4} y={HATCH.y + 26} width={HATCH.w - 8} height={HATCH.h - 30} filter="url(#bz-grime)" opacity={0.6} />}
          <g filter={inkFilter('bz', wear)}>
            <path d={`M ${HATCH.x + 20} ${HATCH.y + 150} l 24 -60 l 16 0 l -24 60 z`} fill={M.accent} />
            <text x={HATCH.x + 70} y={HATCH.y + 90} className="slab" fontSize={12.5} fill={M.ink}>NO USER</text>
            <text x={HATCH.x + 70} y={HATCH.y + 108} className="slab" fontSize={12.5} fill={M.ink}>SERVICEABLE</text>
            <text x={HATCH.x + 70} y={HATCH.y + 126} className="slab" fontSize={12.5} fill={M.ink}>PARTS</text>
            <text x={HATCH.x + 70} y={HATCH.y + 146} className="mono" fontSize={8} fill="#4d4538">REMOVE 4 SCREWS</text>
          </g>
          {layer === 'all' && SCREWS.map((s, i) => (
            <Screw key={i} x={s.x} y={s.y + 14} out={screws[i]} label={`Screw ${i + 1}${screws[i] ? ', loosened' : ''}`}
              onClick={hatchOpen ? undefined : () => setScrews((x) => x.map((v, j) => (j === i ? !v : v)))} />
          ))}
        </g>
        {hatchOpen && cables.map(([f, t], i) => <Cable key={`${f}-${t}`} from={f} to={t} n={i} />)}
        {hatchOpen && (
          <g className="ctl" role="button" tabIndex={0} aria-label="Close service hatch" transform={`translate(${HATCH.x + HATCH.w - 46} ${HATCH.y + 5})`}
            onClick={() => setHatchOpen(false)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setHatchOpen(false) } }}>
            <rect width={40} height={15} fill={M.accent} rx={1} />
            <text x={20} y={11} textAnchor="middle" className="mono" fontSize={8.5} fill={M.ink}>CLOSE</text>
          </g>
        )}
      </svg>
      {layer === 'all' && (
        <>
          <div className="crt-slot" style={box(240, 142, 424, 196)}>
            <Crt read={read} wear={wear} />
          </div>
          <div className="preset-slot" style={box(580, 22, 320, 40)}>
            <PresetMenu presetId={presetId} modified={modified} onPick={onPreset} />
          </div>
        </>
      )}
    </div>
  )
}
