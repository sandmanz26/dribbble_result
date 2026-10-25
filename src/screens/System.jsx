import { Link } from 'react-router-dom'
import Icon from '../ui/Icon.jsx'
import { Mark } from '../ui/kit.jsx'
import { MOODS } from '../data/library.js'

// The design system, milestone one of the brief: tokens, type, fields and the core components.
const CORE = [
  ['--ground', 'Ground', 'Page'], ['--surface', 'Surface', 'Blocks'], ['--text', 'Ink', 'Text'],
  ['--muted', 'Muted', 'Secondary text'], ['--accent', 'Teal', 'The one accent: actions, progress'], ['--line', 'Line', 'Rules and borders'],
]
const FIELDS = [
  ['sky', 'Sky', 'Breath, mornings'], ['sage', 'Sage', 'Herbs'], ['clay', 'Clay', 'Warmth, grounding'],
  ['night', 'Night', 'Evenings, sleep'], ['paper', 'Paper', 'Journal'],
]

export default function System() {
  return (
    <div className="system">
      <header className="sys-head">
        <Link to="/" className="sys-back"><Icon name="back" size={18} /> Back to the prototype</Link>
        <div className="sys-brand"><Mark size={48} /><div><h1 className="serif">Tend design system</h1><p className="meta">Milestone one: tokens, type, fields and the components the three core screens use.</p></div></div>
      </header>

      <section className="sys-sec">
        <h2>Principles</h2>
        <ol className="sys-principles">
          <li><strong>One question at a time.</strong> The check-in is a conversation with tap answers, never a form.</li>
          <li><strong>Explain every choice.</strong> Each step of the ritual can say why it was picked, and herbs say why they were swapped.</li>
          <li><strong>Colour means place, not decoration.</strong> Each practice has its own calm field; the teal accent only marks what to do next.</li>
          <li><strong>No guilt.</strong> No streak counters, no red. Missed days are blank, not broken.</li>
          <li><strong>Safety is designed in.</strong> Herb cautions are checked against the profile before they are shown.</li>
        </ol>
      </section>

      <section className="sys-sec">
        <h2>Colour</h2>
        <div className="sys-swatches">
          {CORE.map(([v, n, use]) => <div key={v} className="sw"><span style={{ background: `var(${v})` }} /><strong>{n}</strong><code>{v}</code><small>{use}</small></div>)}
        </div>
        <h3>Practice fields</h3>
        <div className="sys-fields">
          {FIELDS.map(([id, n, use]) => <div key={id} className={`sysfield f-${id}`}><strong className="serif">{n}</strong><small>{use}</small></div>)}
        </div>
      </section>

      <section className="sys-sec">
        <h2>Type</h2>
        <div className="sys-type">
          <p className="serif t-display">Good morning, Lena.</p><small>Instrument Serif 40/44 · greetings and ritual names</small>
          <p className="serif t-title">Settle the storm</p><small>Instrument Serif 30/34 · screen titles</small>
          <p className="t-body">Breathing out for longer than you breathe in is a simple way to slow down.</p><small>Instrument Sans 16/24 · body</small>
          <p className="t-small">4 in, 6 out · 3 min</p><small>Instrument Sans 13/18 · meta, tabular figures</small>
        </div>
      </section>

      <section className="sys-sec">
        <h2>Components</h2>
        <div className="sys-comp">
          <div><h3>Buttons</h3><div className="sys-row"><button className="btn primary">Start</button><button className="btn soft">Start steeping</button><button className="btn quiet">Look around</button></div></div>
          <div><h3>Mood as weather</h3><div className="weather sys-wx">{MOODS.map((m) => <button key={m.id} className={`wx w-${m.id}`}><Icon name={m.icon} size={24} /><strong>{m.label}</strong><span>{m.line}</span></button>)}</div></div>
          <div><h3>Ritual step</h3>
            <ol className="path"><li className="step f-sky next"><span className="step-n num">1</span><div className="step-body"><span className="step-kind">Breathe · 3 min</span><strong className="serif">Long exhale</strong><span className="step-detail">4 in, 6 out</span><div className="step-actions"><span className="btn small primary">Start</span><span className="btn small text">Why this?</span></div></div></li></ol>
          </div>
          <div><h3>Conversation</h3><ol className="thread sys-thread"><li className="turn"><p className="bubble tend">If today were weather, what would it be?</p><p className="bubble you">Stormy</p></li></ol></div>
        </div>
      </section>

      <section className="sys-sec">
        <h2>Shape, motion, access</h2>
        <ul className="sys-list">
          <li>Radius: 28 on fields and players, 18 on blocks, 999 on buttons and chips.</li>
          <li>Motion follows the breath: the tide rises and falls over the real counts; everything else fades in 200 ms or less. Reduced motion keeps the counts and drops the movement.</li>
          <li>Every colour pair passes 4.5:1. Targets are 44 px or larger. Players announce the phase to screen readers.</li>
        </ul>
      </section>
    </div>
  )
}
