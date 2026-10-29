import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { Mark } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

const PRINCIPLES = [
  ['Every claim carries its evidence', 'Figures in an AI sentence open the rows they came from. A claim without a source is not shown.'],
  ['Confidence in words, only when it matters', '“Likely, from 8 weeks of sales” or “few sales, a rough guide”, beside the decision it affects.'],
  ['Autonomy per decision, owned by people', 'Suggest, ask first, or act within a rupiah limit and tell. Only the owner raises a level, and it is logged.'],
  ['One shape for every proposal', 'What, why, the effect with its range, what could go wrong. Then approve, edit, or decline with a reason it learns from.'],
  ['It starts from where you are', 'Opened on a piece, it talks about the piece. On a client, the client. On Today, today.'],
  ['It teaches as well as answers', 'For a new advisor, “Show me” points at the real screen while she does the step herself.'],
  ['It never contacts a client', 'It drafts in the advisor’s voice. The advisor sends. Luxury service stays human.'],
  ['It says what it doesn’t know', 'A boutique offline, a forecast on too little data, a question outside your role.'],
]

export default function Case() {
  const { dispatch } = useStore()
  const as = (role) => dispatch({ type: 'role', role })
  return (
    <div className="case">
      <header className="case-top">
        <span className="brand"><Mark /><span className="brand-name">Selvedge</span></span>
        <span className="muted">Case notes</span>
        <Link className="btn is-primary" to="/today" onClick={() => as('owner')}>Open the product <I.Arrow /></Link>
      </header>

      <section className="case-hero">
        <h1>An operating system for a luxury fashion group, with the AI at its edge</h1>
        <p className="case-lede">Selvedge brings stock, selling, clients and decisions into one product for a group of six boutiques in Jakarta, Surabaya and Bali. The AI explains, proposes and teaches, and people stay in charge of every decision that matters.</p>
        <dl className="case-meta">
          <div><dt>Role</dt><dd>Product design and product management</dd></div>
          <div><dt>Client</dt><dd><span className="redact" style={{ width: 96 }} aria-label="Redacted" /> Group, under NDA</dd></div>
          <div><dt>Scope</dt><dd>Research, IA, AI experience, design system, prototype</dd></div>
          <div><dt>Shown here</dt><dd>About 70% of the product, with synthetic data</dd></div>
        </dl>
        <figure className="case-shot">
          <img src="img/case-today.webp" alt="The owner’s Today screen: the morning brief written by Selvedge, decisions waiting, the month against plan and the boutiques." />
          <figcaption>The owner’s morning. The selvedge edge marks everything the AI wrote.</figcaption>
        </figure>
      </section>

      <section className="case-sec">
        <h2>The brief, and the one test for each person</h2>
        <div className="case-people">
          <article><p className="who">Ratna Wijaya, founder</p><h3>Understand the whole company from one screen</h3><p>A morning brief that reads like her best manager talking, every figure traceable, and the decisions only she can take.</p><Link className="link" to="/today" onClick={() => as('owner')}>View as Ratna</Link></article>
          <article><p className="who">Dimas Prakoso, boutique manager</p><h3>See what matters, immediately</h3><p>Five things ranked for today: the VIP at 11:00, the bag about to run out, the hold that ends at 17:00, a broken size run, a new advisor’s first solo client.</p><Link className="link" to="/today?as=manager" onClick={() => as('manager')}>View as Dimas</Link></article>
          <article><p className="who">Sekar Ayuningtyas, day 4</p><h3>Learn the system with little training</h3><p>A briefing before each client, drafts she sends herself, and lessons that use the real screen with “Show me”.</p><Link className="link" to="/today?as=advisor" onClick={() => as('advisor')}>View as Sekar</Link></article>
        </div>
      </section>

      <section className="case-sec">
        <h2>The selvedge edge</h2>
        <p className="case-p">A selvedge is the finished edge of a fabric that keeps it from unravelling. In the interface it is the AI’s mark: a stitched red edge on every sentence, number and proposal Selvedge wrote. The books stay in ink; what the machine added is always visible as such. It is the only colour in the product.</p>
      </section>

      <section className="case-sec">
        <h2>Eight principles for the AI experience</h2>
        <ol className="case-principles">{PRINCIPLES.map(([h, p], i) => <li key={h}><span className="num">{i + 1}</span><div><h3>{h}</h3><p>{p}</p></div></li>)}</ol>
        <p className="case-p muted">Drawn from Microsoft’s guidelines for human-AI interaction, Google PAIR on explainability and trust, and how retail AI tools such as Nextail, Tulip, Copilot for Commerce and Sidekick handle evidence and approval. Research notes are in the repository.</p>
      </section>

      <section className="case-sec">
        <h2>Try these</h2>
        <ul className="case-try">
          <li><Link to="/decisions/D-119" onClick={() => as('owner')}>Choose who is offered two scarce bags</Link><span>The ranking explains; Ratna decides</span></li>
          <li><Link to="/decisions/D-118" onClick={() => as('owner')}>Approve, edit or decline a transfer</Link><span>With evidence, risk and undo</span></li>
          <li><Link to="/today" onClick={() => { as('owner'); dispatch({ type: 'ask', q: 'Why is Tunjungan Plaza under plan?', answer: 'tunjungan', panel: true }) }}>Ask why a boutique is under plan</Link><span>It shows what it looked at</span></li>
          <li><Link to="/stock/laras-mini" onClick={() => { as('advisor'); dispatch({ type: 'guide', guide: { id: 'hold', step: 0 } }) }}>Learn to hold a piece in another boutique</Link><span>“Show me” on the real screen</span></li>
          <li><Link to="/autopilot" onClick={() => as('owner')}>Set how much the AI may do alone</Link><span>Limits, locks and the activity log</span></li>
        </ul>
      </section>

      <section className="case-sec">
        <h2>What is not shown</h2>
        <p className="case-p">Buying and open-to-buy, finance, cash flow, analytics and settings stay with the client. They keep their place in the navigation so the shape of the product is clear. Results and the client’s own data are also under NDA. Everything you see uses synthetic people, products and figures, and real product photographs stand in for the client’s own (<Link className="link" to="/credits">credits</Link>).</p>
      </section>
    </div>
  )
}
