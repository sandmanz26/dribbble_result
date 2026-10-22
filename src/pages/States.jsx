// Every control in every state, for the chosen wear stage. Drawn with the same components as
// the live panel and the exported sprite sheets.
import { useUi, WearPicker } from '../App.jsx'
import { WEAR, WEAR_LABEL } from '../data/controls.js'
import { Defs } from '../panel/Defs.jsx'
import { M } from '../panel/materials.js'
import { BatArt, JackArt, KnobArt, KnobTicks, MomentaryArt, PadArt, SelectorArt, SelectorScale, StepArt } from '../panel/parts.jsx'

const STATES = [
  ['idle', 'Idle'],
  ['hover', 'Hover'],
  ['drag', 'Dragging'],
  ['dim', 'Dimmed'],
]

const ROWS = [
  { name: 'Knob, large', size: 150, draw: (st, w) => <><KnobTicks r={46} wear={w} p="st" /><KnobArt id="knob-lg" r={46} value={0.62} wear={w} state={st} p="st" scale={false} /></> },
  { name: 'Knob, medium', size: 120, draw: (st, w) => <><KnobTicks r={34} wear={w} p="st" /><KnobArt id="knob-md" r={34} value={0.35} wear={w} state={st} p="st" scale={false} /></> },
  { name: 'Knob, small', size: 96, draw: (st, w) => <><KnobTicks r={24} wear={w} p="st" /><KnobArt id="knob-sm" r={24} value={0.8} wear={w} state={st} p="st" scale={false} /></> },
  { name: 'Selector', size: 110, draw: (st, w) => <><SelectorScale index={1} wear={w} p="st" options={['Cut', 'Bits', 'Gate', 'Time']} /><SelectorArt id="selector" index={1} wear={w} state={st} p="st" options={['', '', '', '']} labels={false} /></> },
  { name: 'Bat toggle', size: 90, draw: (st, w) => <BatArt positions={3} index={0} wear={w} state={st} p="st" /> },
  { name: 'Chaos button', size: 110, note: 'Dragging column shows it held.', draw: (st, w) => <MomentaryArt r={30} pressed={st === 'drag'} wear={w} state={st === 'drag' ? 'idle' : st} p="st" /> },
  { name: 'Sequencer step', size: 80, note: 'Dragging column shows it pressed.', draw: (st, w) => <StepArt n={3} level={0.7} wear={w} state={st} p="st" /> },
  { name: 'Patch jack', size: 70, note: 'Dragging column shows it selected.', draw: (st) => <JackArt dir="out" active={st === 'drag'} state={st === 'hover' ? 'hover' : 'idle'} p="st" /> },
  { name: 'Bend contact', size: 70, note: 'Dragging column shows it held.', draw: (st, w) => <PadArt pressed={st === 'drag'} state={st === 'hover' ? 'hover' : 'idle'} wear={w} p="st" /> },
]

function Cell({ size, children, label }) {
  return (
    <svg width="100%" viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} className="state-cell" role="img" aria-label={label}>
      <rect x={-size / 2} y={-size / 2} width={size} height={size} fill={M.enamel} />
      {children}
    </svg>
  )
}

export default function States() {
  const { wear } = useUi()
  return (
    <section className="page wrap">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden><Defs p="st" /></svg>
      <div className="page-head">
        <h1 className="h-lg">Control states</h1>
        <p className="lede">Every control in idle, hover, dragging and dimmed, at each stage of wear. Dimmed means the control has no effect right now: Bypass is on, or the section it feeds is at zero.</p>
        <div className="row"><span className="tool-label">Wear</span><WearPicker /></div>
      </div>

      <div className="tbl-wrap">
        <table className="states-table">
          <thead>
            <tr><th scope="col">Control</th>{STATES.map(([id, label]) => <th key={id} scope="col">{label}</th>)}</tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.name}>
                <th scope="row"><span className="h-sm">{r.name}</span>{r.note && <span className="muted small row-note">{r.note}</span>}</th>
                {STATES.map(([id, label]) => (
                  <td key={id}><Cell size={r.size} label={`${r.name}, ${label}, ${WEAR_LABEL[wear]}`}>{r.draw(id, wear)}</Cell></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rule two">
        <h2 className="h-md">Wear ladder</h2>
        <div className="stack">
          <div className="ladder">
            {WEAR.map((w) => (
              <figure key={w}>
                <Cell size={150} label={`Large knob, ${WEAR_LABEL[w]}`}><KnobTicks r={46} wear={w} p="st" /><KnobArt id="knob-lg" r={46} value={0.62} wear={w} state="idle" p="st" scale={false} /></Cell>
                <figcaption className="h-sm">{WEAR_LABEL[w]}</figcaption>
              </figure>
            ))}
          </div>
          <ul className="dash">
            <li><strong>Mint:</strong> full gloss on the bakelite, solid pointer line, crisp silkscreen.</li>
            <li><strong>Worn:</strong> gloss halved, a few chips on the knob skirt, the pointer line rubbed through once, silkscreen thinning, light grime on the enamel.</li>
            <li><strong>Busted:</strong> gloss nearly gone, deep chips, scratched caps, a broken pointer line, eroded lettering, heavy grime, cracked scope glass and a stained meter face.</li>
            <li>Wear is seeded per control, so the same knob keeps the same scars in the live panel and in every exported frame.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
