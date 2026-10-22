import { Link } from 'react-router-dom'

const BRIEF = [
  ['Full interface at a fixed aspect ratio: about 18 controls, a 16-step sequencer, a waveform display, a meter, a preset menu', '12:7 panel with 18 controls, 16 steps, a phosphor scope, a VU meter and a preset display. Playable.', '/'],
  ['A hidden panel of circuit-bend controls with its reveal', 'Service hatch held by four screws. Behind it: a patch bay with three outputs, three inputs and three touch contacts.', '/'],
  ['Every control in each state (idle, hover, dragging, dimmed) across stages of wear', 'Nine control types x four states x three wear stages, drawn from the same components as the panel.', '/states'],
  ['Motion spec: control travel, reveals and meter ballistics, with frame counts and easing', 'Fifteen motions with frames at 60 fps, cubic-bezier values, plotted curves and two live demos.', '/motion'],
  ['Production assets: @1x/@2x PNG filmstrips and sprite sheets, plus layered sources', '16 sheets x 3 wear stages x 2 scales, layered SVG for the rotating parts, layout.json with every position.', '/assets'],
  ['A style spec for the waveform display and other widgets drawn in code', 'Scope, readout, preset display and meter mapping, with an egui painter sketch.', '/widgets'],
]

const INSPIRATION = [
  ['Vintage test equipment', 'Enamel panel, bakelite knobs with fluted skirts, a paper VU face behind glass, an amber phosphor tube, hex jacks.'],
  ['Circuit bending, hardware hacking', 'The service hatch: unscrew it, patch the sequencer or a noise source into places it was never meant to go, touch copper contacts to starve or freeze the circuit.'],
  ['Perfectly imperfect, worn by hand', 'Three wear stages applied consistently: chips, scratches, rubbed pointers, eroded silkscreen. Scars are seeded, so they stay put.'],
  ['Broken sounds for beautiful songs', 'The demo loop runs through a real signal chain in the browser, so the scars sound like something.'],
  ['Punk, Swiss design, Russian Constructivism, Emory Douglas, screen-printed posters', 'Black title slab with a slanted orange bar, wide condensed type (Anybody), numbered modules on a strict grid, one spot colour like a two-colour print.'],
]

export default function Notes() {
  return (
    <section className="page wrap">
      <div className="page-head">
        <h1 className="h-lg">Notes</h1>
        <p className="lede">Scrapyard BC-01 is a working name for the first effect in the suite: a circuit-bent signal wrecker with a step sequencer. The interface is meant to pull people into playing before they start judging.</p>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead><tr><th scope="col">The brief asks for</th><th scope="col">In this proposal</th></tr></thead>
          <tbody>
            {BRIEF.map(([ask, answer, to]) => (
              <tr key={ask}><td>{ask}</td><td>{answer} <Link to={to}>See it</Link></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rule two">
        <h2 className="h-md">From inspiration to decisions</h2>
        <dl className="pairs">
          {INSPIRATION.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      </div>

      <div className="rule two">
        <h2 className="h-md">Playful, not precious</h2>
        <ul className="dash">
          <li>Sound first: one button starts a loop through the full chain, so every knob is heard the moment it moves.</li>
          <li>Nothing breaks the sound for good. Bend contacts only act while held, cables pull out with one click, and every knob double-clicks home.</li>
          <li>The hidden panel rewards curiosity without hiding anything essential. All core sound shaping stays on the front.</li>
          <li>Dimmed controls tell the truth: when a control cannot change the sound, it says so.</li>
        </ul>
      </div>

      <div className="rule two">
        <h2 className="h-md">Built for egui</h2>
        <ul className="dash">
          <li>Every interactive part is a sprite sheet with a fixed cell size and a centred pivot, so a widget is one texture lookup per frame.</li>
          <li>Hit areas are circles from <code>layout.json</code>, larger than the art for small controls.</li>
          <li>Only the scope, readout and preset text are drawn in code, with a spec and a painter sketch.</li>
          <li>The export is scripted. Change a material or wear rule in one place and regenerate every frame.</li>
        </ul>
      </div>

      <div className="rule two">
        <h2 className="h-md">Questions for the team</h2>
        <ul className="dash">
          <li>Which plugin hosts and window sizes need to be supported, and is resizing free or in fixed steps?</li>
          <li>Should wear be chosen by the user, tied to the preset, or grow with time played?</li>
          <li>What does the sequencer modulate in the real DSP, and does Rate sync to host tempo?</li>
          <li>Are 64 frames enough for knobs on large displays, or is 128 preferred?</li>
        </ul>
      </div>
    </section>
  )
}
