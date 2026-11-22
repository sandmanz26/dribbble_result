import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Section } from '../ui/kit.jsx'
import { SiteFooter, SiteNav } from '../ui/SiteChrome.jsx'

// Stage 2 working drawings: the three user flows, then the wireframes the final screens were drawn from.
// Node kinds: page (a screen), act (what the person does), ask (a choice), win (the moment that matters).
const FLOWS = {
  student: {
    name: 'Student',
    goal: 'From a link to a first marked answer, then a reason to come back.',
    rows: [
      [
        ['page', 'Homepage', '/'],
        ['act', 'Mark my first answer'],
        ['page', 'Lesson: learn', '/taster/economics'],
        ['ask', 'Know it already?', null, 'Yes: skip to the question'],
        ['page', 'Three quick checks'],
        ['page', 'The exam question'],
      ],
      [
        ['act', 'Write, or use a sentence starter'],
        ['win', 'Marked: level, AOs, margin'],
        ['ask', 'Rewrite with the next step?', null, 'Yes: back to the question, +marks shown'],
        ['act', 'Save my mark'],
        ['page', 'Sign-up: subjects, board, year, email', '/start?from=taster'],
        ['page', 'Today: next up', '/app'],
      ],
    ],
    out: 'Activation: a second marked answer within 14 days.',
  },
  parent: {
    name: 'Parent',
    goal: 'See whether revision is happening and working, without reading the essays.',
    rows: [
      [
        ['page', 'Homepage: parents', '/#families'],
        ['act', 'See the parent view'],
        ['page', 'Sign-up: I’m a parent', '/start?role=parent'],
        ['ask', 'Child already on ExamAce?', null, 'No: invite by email, they choose what is shared'],
      ],
      [
        ['act', 'Child accepts the link'],
        ['page', 'This week', '/parent'],
        ['win', 'One thing worth asking about'],
        ['page', 'Plan and billing', '/parent#billing'],
      ],
    ],
    out: 'Retention: parents who open the weekly view renew.',
  },
  teacher: {
    name: 'Teacher',
    goal: 'Set practice, let the AI mark first, stay in charge of every mark.',
    rows: [
      [
        ['page', 'Homepage: teachers', '/#families'],
        ['act', 'Set up a class'],
        ['page', 'Sign-up: school email', '/start?role=teacher'],
        ['act', 'Share the class code'],
        ['act', 'Set a question from the spec'],
      ],
      [
        ['page', 'Class: AI marks waiting', '/teacher'],
        ['ask', 'Is the AI sure?', null, 'Yes: release in one click'],
        ['win', 'Check, change, release', '/teacher/review'],
        ['page', 'Class by AO'],
        ['act', 'Set a drill to those at Level 3'],
      ],
    ],
    out: 'Adoption: classes that set a second piece of work.',
  },
}

// Wireframes: blocks in reading order. w = share of width, h = height in rem, tone 0 to 2, note = why it is there.
const WIRES = [
  {
    id: 'home',
    name: 'Homepage',
    to: '/',
    blocks: [
      [{ w: 1, h: 2, t: 0, l: 'Nav: wordmark, 5 links, Sign in, one action' }],
      [{ w: 1, h: 4.5, t: 2, l: 'Headline in two lines' }],
      [{ w: 0.3, h: 5, t: 0, l: 'What it is + the action' }, { w: 0.4, h: 7, t: 1, l: 'Photo rising' }, { w: 0.3, h: 5, t: 0, l: 'No account needed' }],
      [{ w: 0.25, h: 6, t: 1, l: 'Learn' }, { w: 0.25, h: 6, t: 1, l: 'Write' }, { w: 0.25, h: 6, t: 2, l: 'Marked' }, { w: 0.25, h: 6, t: 2, l: 'Rewrite' }],
      [{ w: 0.4, h: 7, t: 0, l: 'Pick a sample answer' }, { w: 0.6, h: 7, t: 1, l: 'Marked script, live' }],
      [{ w: 1, h: 5, t: 2, l: 'Boards and specs card' }],
      [{ w: 0.5, h: 5, t: 1, l: 'Parents' }, { w: 0.5, h: 5, t: 1, l: 'Teachers' }],
      [{ w: 0.6, h: 4, t: 0, l: 'Plan + subjects' }, { w: 0.4, h: 5, t: 1, l: 'Receipt' }],
      [{ w: 1, h: 3, t: 0, l: 'Questions, one band each' }],
    ],
    notes: [
      'One action everywhere: mark my first answer.',
      'The live marked script proves the product before any sign-up.',
      'Parents and teachers get a door each, not a paragraph.',
      'Price is per subject and adds up in front of you.',
    ],
  },
  {
    id: 'taster',
    name: 'Taster lesson',
    to: '/taster/economics',
    blocks: [
      [{ w: 1, h: 1.6, t: 0, l: 'Bar: free lesson, no account, leave' }],
      [{ w: 0.25, h: 1, t: 2, l: 'Learn' }, { w: 0.25, h: 1, t: 1, l: 'Check' }, { w: 0.25, h: 1, t: 1, l: 'Answer' }, { w: 0.25, h: 1, t: 1, l: 'Mark' }],
      [{ w: 1, h: 3.5, t: 0, l: 'Title, time, skip to the question' }],
      [{ w: 0.65, h: 6, t: 1, l: 'The idea + formula' }, { w: 0.35, h: 6, t: 2, l: 'Examiner’s note' }],
      [{ w: 0.65, h: 7, t: 1, l: 'Worked example' }, { w: 0.35, h: 7, t: 0, l: '' }],
      [{ w: 0.6, h: 8, t: 0, l: 'Answer box, starters, timer' }, { w: 0.4, h: 8, t: 1, l: 'Extract + AO split' }],
      [{ w: 0.55, h: 8, t: 1, l: 'Script with margin codes' }, { w: 0.45, h: 8, t: 2, l: 'AOs, next step, tutor, save' }],
    ],
    notes: [
      'Nothing to fill in before learning.',
      'The exam question comes with its extract and its mark split.',
      'Result first, then one next step, then the account.',
      'Rewrite shows the change in marks.',
    ],
  },
  {
    id: 'signup',
    name: 'Sign-up',
    to: '/start',
    blocks: [
      [{ w: 1, h: 1.6, t: 0, l: 'Bar: wordmark, back' }],
      [{ w: 0.6, h: 3, t: 2, l: 'Your mark is waiting' }, { w: 0.4, h: 12, t: 1, l: 'Photo' }],
      [{ w: 0.6, h: 4, t: 0, l: 'Who is it for: 3 choices' }],
      [{ w: 0.6, h: 4, t: 0, l: 'Subjects, board, exam year' }],
      [{ w: 0.6, h: 2.5, t: 1, l: 'Email (no password)' }],
      [{ w: 0.6, h: 3, t: 2, l: 'Check your email' }],
    ],
    notes: ['Role first, so parents and teachers are not sent through a student form.', 'Seven fields became four choices and an email.', 'No password: a sign-in link.'],
  },
  {
    id: 'pricing',
    name: 'Pricing',
    to: '/pricing',
    blocks: [
      [{ w: 1, h: 1.6, t: 0, l: 'Nav' }],
      [{ w: 0.6, h: 4, t: 2, l: 'Pay per subject' }, { w: 0.4, h: 12, t: 1, l: 'Receipt: lines, total, action, inclusions' }],
      [{ w: 0.6, h: 5, t: 0, l: 'Three plans, named by job' }],
      [{ w: 0.6, h: 2.5, t: 0, l: 'Subjects' }],
      [{ w: 1, h: 8, t: 1, l: 'What each plan includes: one table' }],
    ],
    notes: ['One price, said one way.', 'The total updates as subjects are picked.', 'The table answers “what do I lose on Core?”.'],
  },
  {
    id: 'team',
    name: 'Team',
    to: '/team',
    blocks: [
      [{ w: 1, h: 1.6, t: 0, l: 'Nav' }],
      [{ w: 1, h: 4, t: 2, l: 'The examiners' }],
      [{ w: 1, h: 6, t: 1, l: 'Classroom photo' }],
      [{ w: 0.15, h: 4, t: 2, l: 'Mark' }, { w: 0.5, h: 4, t: 0, l: 'Name, role, years, bio' }, { w: 0.35, h: 4, t: 1, l: 'Their exam tip' }],
      [{ w: 0.15, h: 4, t: 2, l: 'Mark' }, { w: 0.5, h: 4, t: 0, l: 'Name, role, years, bio' }, { w: 0.35, h: 4, t: 1, l: 'Their exam tip' }],
      [{ w: 0.5, h: 3.5, t: 1, l: 'How a lesson is made' }, { w: 0.5, h: 3.5, t: 1, l: '' }],
    ],
    notes: ['Credentials as facts, not adjectives.', 'Each examiner gives one tip a student can use today.'],
  },
]

export default function Flows() {
  const [who, setWho] = useState('student')
  const [wire, setWire] = useState('home')
  const f = FLOWS[who]
  const w = WIRES.find((x) => x.id === wire)
  return (
    <div className="site">
      <SiteNav />
      <main id="main" className="flows">
        <section className="page-head">
          <h1 className="page-h">Flows and wireframes</h1>
          <p className="lead">The working drawings for stage 2. Three people, three routes, then the wireframes each final screen was drawn from.</p>
        </section>

        <Section className="flow-sec" aria-labelledby="uf-h">
          <div className="flow-head">
            <h2 id="uf-h" className="h-head" data-rise>
              User flows
            </h2>
            <div className="findings-filter" role="tablist" aria-label="Flow for" data-rise>
              {Object.entries(FLOWS).map(([k, v]) => (
                <button key={k} role="tab" aria-selected={who === k} className={`pick${who === k ? ' is-on' : ''}`} onClick={() => setWho(k)}>
                  {v.name}
                </button>
              ))}
            </div>
          </div>
          <p className="flow-goal" data-rise>
            <strong>{f.name}.</strong> {f.goal}
          </p>
          <div className="flowmap" key={who}>
            {f.rows.map((row, ri) => (
              <ol className="flowrow" key={ri}>
                {row.map(([kind, label, to, branch], i) => (
                  <li key={label} className={`fnode is-${kind}`} style={{ animationDelay: `${(ri * row.length + i) * 50}ms` }}>
                    <span className="fnode-kind">{{ page: 'Screen', act: 'Action', ask: 'Choice', win: 'The moment' }[kind]}</span>
                    {to ? (
                      <Link to={to} className="fnode-label">
                        {label}
                      </Link>
                    ) : (
                      <span className="fnode-label">{label}</span>
                    )}
                    {branch && <span className="fnode-branch">{branch}</span>}
                    {i < row.length - 1 && <Icon name="arrowRight" size={18} className="fnode-arrow" />}
                  </li>
                ))}
              </ol>
            ))}
          </div>
          <p className="flow-out" data-rise>
            <Icon name="target" size={20} /> {f.out}
          </p>
          <ul className="flow-key" aria-label="Key">
            <li className="is-page">Screen</li>
            <li className="is-act">Action</li>
            <li className="is-ask">Choice</li>
            <li className="is-win">The moment that matters</li>
          </ul>
        </Section>

        <Section className="wire-sec" aria-labelledby="wf-h">
          <div className="flow-head">
            <h2 id="wf-h" className="h-head" data-rise>
              Wireframes
            </h2>
            <div className="findings-filter" role="tablist" aria-label="Wireframe" data-rise>
              {WIRES.map((x) => (
                <button key={x.id} role="tab" aria-selected={wire === x.id} className={`pick${wire === x.id ? ' is-on' : ''}`} onClick={() => setWire(x.id)}>
                  {x.name}
                </button>
              ))}
            </div>
          </div>
          <div className="wire-grid" key={wire}>
            <div className="wire" aria-label={`${w.name} wireframe`}>
              {w.blocks.map((row, ri) => (
                <div className="wire-row" key={ri}>
                  {row.map((b, bi) => (
                    <div key={bi} className={`wire-b t${b.t}`} style={{ flexGrow: b.w, minHeight: `${b.h}rem` }}>
                      {b.l}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="wire-notes">
              <h3>Why it is laid out this way</h3>
              <ul>
                {w.notes.map((n) => (
                  <li key={n}>
                    <Icon name="check" size={18} />
                    {n}
                  </li>
                ))}
              </ul>
              <Link to={w.to} className="btn">
                See the final {w.name.toLowerCase()} <Icon name="arrowRight" />
              </Link>
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
