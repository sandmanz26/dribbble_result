// Export surface. /render?asset=knob-lg&wear=worn draws one sprite sheet on a transparent
// page: rows are frames, columns are states. scripts/export-assets.mjs screenshots #sheet.
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { assetById, ASSETS } from '../data/assets.js'
import { DEFAULTS, HATCH } from '../data/controls.js'
import { Defs } from '../panel/Defs.jsx'
import { M } from '../panel/materials.js'
import { BatArt, JackArt, KnobArt, Led, MomentaryArt, PadArt, Screw, SelectorArt, StepArt, VuMeter } from '../panel/parts.jsx'
import { Plugin } from '../panel/Plugin.jsx'

function Cell({ a, f, state, wear }) {
  const v = a.frames > 1 ? f / (a.frames - 1) : 0
  switch (a.id) {
    case 'knob-lg':
    case 'knob-md':
    case 'knob-sm':
      return <KnobArt id={a.id} r={a.r} value={v} wear={wear} state={state} scale={false} />
    case 'selector':
      return <SelectorArt id="selector" index={f} wear={wear} state={state} options={['', '', '', '']} labels={false} />
    case 'toggle3':
      return <BatArt positions={3} index={f} wear={wear} state={state} />
    case 'bat':
      return <BatArt positions={2} index={f} wear={wear} state={state} />
    case 'momentary':
      return <MomentaryArt r={30} pressed={f === 1} wear={wear} state={state} />
    case 'step':
      return <StepArt n={0} level={f / 8} playing={state === 'playing'} wear={wear} state={state === 'playing' ? 'idle' : state} />
    case 'led':
      return <Led x={0} y={0} on={f === 1} r={5} />
    case 'vu-face':
      return <VuMeter x={-92} y={-52} w={184} h={104} pos={0} wear={wear} layer="face" />
    case 'vu-needle':
      return <VuMeter x={-92} y={-52} w={184} h={104} pos={v} wear={wear} layer="needle" />
    case 'jack':
      return <JackArt dir={f ? 'out' : 'in'} active={state === 'hover'} />
    case 'pad':
      return <PadArt pressed={f === 1} state={state} wear={wear} />
    case 'screw':
      return <Screw x={0} y={0} out={f === 1} />
    case 'hatch-bay':
      return <rect x={-HATCH.w / 2 + 6} y={-HATCH.h / 2 + 28} width={HATCH.w - 12} height={HATCH.h - 34} fill="#1a1410" />
    default:
      return null
  }
}

export default function Render() {
  const [q] = useSearchParams()
  const a = assetById(q.get('asset')) || ASSETS[1]
  const wear = q.get('wear') || 'mint'
  useEffect(() => {
    document.documentElement.classList.add('render-mode')
    return () => document.documentElement.classList.remove('render-mode')
  }, [])

  if (a.id === 'panel') {
    return (
      <div id="sheet" style={{ width: a.w, height: a.h }}>
        <Plugin layer="background" wear={wear} values={{ ...DEFAULTS, bypass: 0 }} steps={Array(16).fill(0)} cables={[]} hatchOpen={false} setHatchOpen={() => {}} />
      </div>
    )
  }

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <Defs p="bz" />
      </svg>
      <div id="sheet" style={{ display: 'grid', gridTemplateColumns: `repeat(${a.states.length}, ${a.w}px)`, gridAutoRows: `${a.h}px`, width: a.w * a.states.length }}>
        {Array.from({ length: a.frames }, (_, f) =>
          a.states.map((st) => (
            <svg key={`${f}-${st}`} width={a.w} height={a.h} viewBox={`${-a.w / 2} ${-a.h / 2} ${a.w} ${a.h}`} data-frame={f} data-state={st} style={{ display: 'block', overflow: 'hidden', color: M.ink }}>
              <Cell a={a} f={f} state={st} wear={wear} />
            </svg>
          )),
        )}
      </div>
    </>
  )
}
