import { Link } from 'react-router-dom'
import Icon from '../ui/Icon.jsx'
import { Mark } from '../ui/kit.jsx'
import { Print } from '../ui/Print.jsx'
import { HERBS, MOODS } from '../data/library.js'
import { DECISIONS } from '../data/decisions.js'

// The design system, milestone one of the brief: tokens, type, the print and the core components.
const CORE = [
  ['--paper', 'Paper', 'Ground'], ['--sheet', 'Sheet', 'Raised blocks, the label'], ['--ink', 'Ink', 'Text'],
  ['--muted', 'Muted ink', 'Secondary text'], ['--blue', 'Prussian blue', 'The one accent: the next action'], ['--line', 'Rule', 'Lists and fields'],
]
const PLATES = { bright: 'peppermint', steady: 'peppermint', heavy: 'ginger', stormy: 'lemonbalm', tired: 'chamomile' }

export default function System() {
  return (
    <div className="system">
      <header>
        <Link to="/" className="sys-back"><Icon name="back" size={18} /> Back to the prototype</Link>
        <div className="sys-brand"><Mark size={52} /><div><h1>Tend design system</h1><p className="meta">Milestone one: tokens, type, the print and the components the three core screens use.</p></div></div>
      </header>

      <section className="sys-sec">
        <h2>The idea</h2>
        <p style={{ maxWidth: '62ch' }}>Each day is a cyanotype. A sun print is exposed by the day’s light, so the weather given in the check-in sets how deep the blue goes, and the herb in today’s cup is printed on it as a white silhouette. Two weeks of check-ins become a row of prints, and the journal files each line beside its print, like a herbarium.</p>
        <div className="sys-ex">
          <figure><Print mood="none" herb="chamomile" seed={3} size="mid" /><figcaption><b>Not exposed</b>Before the check-in</figcaption></figure>
          {MOODS.map((m, i) => (
            <figure key={m.id}><Print mood={m.id} herb={PLATES[m.id]} seed={i + 4} size="mid" /><figcaption><b>{m.label}</b>{HERBS[PLATES[m.id]].name}</figcaption></figure>
          ))}
        </div>
      </section>

      <section className="sys-sec">
        <h2>Principles</h2>
        <ol className="sys-principles">
          <li><strong>One question at a time.</strong> The check-in asks five things with tap answers, and each answer is added to today’s print as you go.</li>
          <li><strong>Explain every choice.</strong> Each step of the ritual can say why it was picked, and herbs say why they were swapped.</li>
          <li><strong>One hue, five depths.</strong> Prussian blue is the only colour. The five weathers are its exposures; the next action wears it at full strength.</li>
          <li><strong>No guilt.</strong> No streak counters, no red. A missed day is an empty frame, not a broken chain.</li>
          <li><strong>Safety is designed in.</strong> Herb cautions are checked against the profile before they are shown.</li>
        </ol>
      </section>

      <section className="sys-sec">
        <h2>Decisions, and why</h2>
        <ol className="sys-decisions">
          {DECISIONS.map((d) => (
            <li key={d.title}>
              <span className="meta small">{d.area}</span>
              <strong>{d.title}</strong>
              <dl>
                <div><dt>What we saw</dt><dd>{d.saw}</dd></div>
                <div><dt>What we did</dt><dd>{d.did}</dd></div>
                <div><dt>Why</dt><dd>{d.why}</dd></div>
              </dl>
            </li>
          ))}
        </ol>
      </section>

      <section className="sys-sec">
        <h2>Colour</h2>
        <div className="sys-swatches">
          {CORE.map(([v, n, use]) => <div key={v} className="swatch"><span style={{ background: `var(${v})` }} /><strong>{n}</strong><code>{v}</code><small>{use}</small></div>)}
        </div>
      </section>

      <section className="sys-sec">
        <h2>Type</h2>
        <div className="sys-type">
          <p className="display" style={{ fontSize: 34, lineHeight: '38px' }}>Settle the storm</p><small>Besley 500, 34/38 · ritual names and what Tend says to you</small>
          <p className="display" style={{ fontSize: 26, lineHeight: '32px' }}>How long did you sleep last night?</p><small>Besley 500, 26/32 · questions</small>
          <p style={{ fontSize: 16, lineHeight: '24px' }}>Breathing out for longer than you breathe in is a simple way to slow down.</p><small>Hanken Grotesk 400, 16/24 · body</small>
          <p className="num" style={{ fontSize: 13, lineHeight: '18px', fontWeight: 600 }}>4 in, 6 out · 3 min</p><small>Hanken Grotesk 600, 13/18 · labels, tabular figures</small>
        </div>
      </section>

      <section className="sys-sec">
        <h2>Components</h2>
        <div className="sys-comp">
          <div><h3>Buttons</h3><div className="sys-row"><button className="btn primary">Start</button><button className="btn quiet">Look around</button><button className="btn text">Why this?</button></div></div>
          <div><h3>Weather, as exposures</h3>
            <ul className="wx-list">{MOODS.slice(0, 3).map((m) => <li key={m.id}><button className={`wx ex-${m.id}`}><span className="sw" /><span><strong>{m.label}</strong><small>{m.line}</small></span><Icon name="next" size={18} /></button></li>)}</ul>
          </div>
          <div><h3>Ritual step</h3>
            <ol className="steps" style={{ padding: 0 }}><li className="st next"><span className="st-min"><b className="num">3</b><small>min</small></span><div className="st-body"><span className="st-kind">Now · Breathe</span><strong>Long exhale</strong><span className="st-detail">4 in, 6 out</span><p className="why"><b>Why this</b>You said you feel stormy, so the exhale is longer than the inhale.</p></div><span /></li></ol>
          </div>
          <div><h3>Herbarium chip</h3>
            <div className="herbarium" style={{ maxWidth: 360 }}>{MOODS.map((m, i) => <Print key={m.id} mood={m.id} herb={PLATES[m.id]} seed={20 + i} size="chip" />)}</div>
          </div>
        </div>
      </section>

      <section className="sys-sec">
        <h2>Shape, motion, access</h2>
        <ul className="sys-list">
          <li>Corners: 6 px on every block, button and field, cut like paper. Prints have a brushed edge instead of a radius.</li>
          <li>Motion follows the breath: the tide rises and falls over the real counts; the print deepens over 420 ms when the weather is chosen. Reduced motion keeps the counts and drops the movement.</li>
          <li>Text pairs pass 4.5:1, including white on the four deep exposures and ink on the pale one. Targets are 44 px or larger. Players announce the phase to screen readers.</li>
        </ul>
      </section>
    </div>
  )
}
