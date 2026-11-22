import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AoBar, Icon, MarginCode, Section } from '../ui/kit.jsx'
import { SiteFooter, SiteNav } from '../ui/SiteChrome.jsx'
import { QUESTION, SAMPLES, SUBJECTS } from '../data/taster.js'
import { markAnswer } from '../data/marker.js'
import Receipt from './Receipt.jsx'

export default function Home() {
  return (
    <div className="site">
      <SiteNav />
      <main id="main">
        <Hero />
        <Route />
        <Margin />
        <Subjects />
        <Examiners />
        <Families />
        <section className="pricing-band" id="pricing" aria-labelledby="pricing-h">
          <Receipt headingId="pricing-h" />
        </section>
        <Faq />
        <Reply />
      </main>
      <SiteFooter />
    </div>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-h">
      <h1 id="hero-h" className="hero-h">
        <span className="line">
          <span>Train for</span>
        </span>
        <span className="line">
          <span>the paper.</span>
        </span>
      </h1>
      <figure className="hero-photo">
        <img className="photo" src="img/student-kitchen.webp" width="1200" height="1600" alt="A sixth-former writing an essay answer by hand at a kitchen table at night" />
      </figure>
      <div className="hero-left">
        <p>
          A-Level Business, Economics, Psychology and Sociology, written by examiners. Learn one topic, answer a real exam question and see your
          mark by assessment objective in about ten minutes.
        </p>
        <Link to="/taster/economics" className="btn">
          Mark my first answer <Icon name="arrowRight" />
        </Link>
      </div>
      <div className="hero-right">
        <p className="hero-fact">No account needed for your first marked answer.</p>
        <p>AQA, Edexcel, OCR and Cambridge.</p>
      </div>
    </section>
  )
}

const STAGES = [
  { clause: 'First you learn it.', note: 'Six minutes, one spec point.' },
  { clause: 'Then you write it.', note: 'A real 9-mark question.' },
  { clause: 'Then it is marked.', note: 'Level, mark and every AO.' },
  { clause: 'Then you write it again.', note: 'One next step, one more mark.' },
]

function Route() {
  return (
    <Section className="route" id="route" aria-labelledby="route-h">
      {STAGES.map((s, i) => (
        <div className={`route-field f${i}`} key={s.clause}>
          {i === 0 && (
            <h2 id="route-h" className="route-h" data-rise>
              Ten minutes to your first mark
            </h2>
          )}
          <div className="route-card" data-ui data-rise>
            <RouteCard stage={i} />
          </div>
          <p className="route-clause" data-rise>
            {s.clause}
            <span>{s.note}</span>
          </p>
        </div>
      ))}
    </Section>
  )
}

function RouteCard({ stage }) {
  return (
    <div className="rc">
      <div className="rc-top">
        <span>Economics · AQA 3.1.3.2</span>
        <span className="tnum">{['6 min', '9 marks', '5 / 9', '7 / 9'][stage]}</span>
      </div>
      <p className="rc-title">{stage === 0 ? 'Price elasticity of demand' : 'Explain why a rise in fuel duty is likely to increase tax revenue.'}</p>
      {stage === 0 && (
        <div className="rc-progress" aria-label="Lesson 3 of 4 parts done">
          <i className="on" />
          <i className="on" />
          <i className="on" />
          <i />
        </div>
      )}
      {stage >= 1 && (
        <p className="rc-answer">
          Petrol is inelastic because people need it to drive to work. If duty goes up the price rises but people still buy it…
        </p>
      )}
      {stage >= 2 && (
        <ul className="rc-aos">
          {[
            ['AO1', stage === 2 ? 2 : 3, 3],
            ['AO2', 2, 2],
            ['AO3', stage === 2 ? 1 : 2, 4],
          ].map(([ao, m, x]) => (
            <li key={ao}>
              <span>{ao}</span>
              <AoBar mark={m} max={x} size="s" />
            </li>
          ))}
        </ul>
      )}
      {stage === 3 && <p className="rc-up">Level 2 to Level 3, +2 marks</p>}
    </div>
  )
}

function Margin() {
  const [pick, setPick] = useState('middle')
  const result = useMemo(() => markAnswer(SAMPLES[pick].text), [pick])
  return (
    <Section className="margin" id="marking" aria-labelledby="margin-h">
      <div className="margin-intro">
        <h2 id="margin-h" className="h-head" data-rise>
          See where the marks are
        </h2>
        <p className="lead" data-rise>
          An examiner reads your answer sentence by sentence and marks each one in the margin. ExamAce does the same, then tells you the one thing
          that moves you up a level.
        </p>
        <div className="margin-picks" role="radiogroup" aria-label="Choose an answer to mark" data-rise>
          {Object.entries(SAMPLES).map(([k, v]) => (
            <button key={k} role="radio" aria-checked={pick === k} className={`pick${pick === k ? ' is-on' : ''}`} onClick={() => setPick(k)}>
              {v.label}
            </button>
          ))}
        </div>
        <p className="margin-q" data-rise>
          <strong>{QUESTION.marks} marks.</strong> {QUESTION.text}
        </p>
      </div>

      <div className="script" data-ui data-rise aria-live="polite">
        <div className="script-head">
          <p>
            <span className="script-level">Level {result.level}</span>
            <span className="script-mark tnum">
              {result.total} / {result.max}
            </span>
          </p>
          <ul className="script-aos">
            {result.aos.map((a) => (
              <li key={a.id}>
                <span>
                  {a.id} {a.name}
                </span>
                <AoBar mark={a.mark} max={a.max} />
              </li>
            ))}
          </ul>
        </div>
        <ol className="script-lines">
          {result.annotated.map((s, i) => (
            <li key={pick + i}>
              <p>{s.text}</p>
              <span className="script-codes">
                {s.codes.map((c) => (
                  <MarginCode key={c} code={c} />
                ))}
              </span>
            </li>
          ))}
        </ol>
        {result.next ? (
          <p className="script-next">
            <strong>Your next step ({result.next.ao}).</strong> {result.next.text}
          </p>
        ) : (
          <p className="script-next">
            <strong>Full marks.</strong> Every AO is met. Try a 25-mark question next.
          </p>
        )}
      </div>
      <p className="margin-foot" data-rise>
        These are three answers to the same question. Want to see yours?{' '}
        <Link className="link" to="/taster/economics">
          Write it in the free lesson
        </Link>
      </p>
    </Section>
  )
}

function Subjects() {
  return (
    <Section className="subjects" id="subjects" aria-labelledby="subjects-h">
      <div className="guest" data-rise>
        <h2 id="subjects-h" className="guest-h">
          Your board, your spec
        </h2>
        <figure className="guest-photo">
          <img className="photo" src="img/exam-hall.webp" width="1600" height="900" loading="lazy" alt="A school sports hall set out with rows of single exam desks" />
        </figure>
        <p className="guest-intro">Lessons follow your specification in its own order and numbering. You only ever see what is in your exam.</p>
        {SUBJECTS.map((s) => (
          <div className="guest-row" key={s.id}>
            <h3>{s.name}</h3>
            <p>{s.boards.join(' · ')}</p>
            <Link className="link" to="/taster/economics">
              Free lesson: {s.taster}
            </Link>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Examiners() {
  return (
    <Section className="examiners" aria-labelledby="ex-h">
      <div className="ex-panel on-ox">
        <h2 id="ex-h" className="ex-h" data-rise>
          Written by examiners
        </h2>
        <figure className="ex-photo" data-rise>
          <img className="photo" src="img/examiner-desk.webp" width="1280" height="1600" loading="lazy" alt="An examiner’s desk: a stack of marked scripts, a red pen and a mark scheme" />
        </figure>
        <div className="ex-text">
          <div data-rise>
            <h3>67 years of teaching and examining</h3>
            <p>
              Jonathan Pledger, Anna White and Charlotte Hopwood write every lesson and every mark scheme rule. All three have examined A-Level for
              the boards they write for.
            </p>
          </div>
          <div data-rise>
            <h3>Why it exists</h3>
            <p>
              “Students knew their content well but still lost marks, because nobody had explained what an examiner is looking for.” Jonathan
              Pledger, founder, 18 years an A-Level examiner.
            </p>
          </div>
          <Link to="/team" className="btn is-paper" data-rise>
            Meet the examiners
          </Link>
        </div>
      </div>
    </Section>
  )
}

function Families() {
  return (
    <Section className="families" id="families" aria-labelledby="fam-h">
      <h2 id="fam-h" className="h-head fam-h" data-rise>
        For the people around them
      </h2>
      <div className="fam-panels">
        <div className="fam-panel p-parent">
          <figure className="fam-photo">
            <img className="photo" src="img/parent.webp" width="1280" height="1600" loading="lazy" alt="A mother and her son looking at a laptop together at the kitchen table" />
          </figure>
          <div className="fam-row" data-rise>
            <div>
              <h3>Parents</h3>
              <p>A free parent view: time revised, marks by level and one thing worth asking about at dinner. Not their essays.</p>
            </div>
            <Link to="/parent" className="btn is-paper is-small">
              See the parent view
            </Link>
          </div>
        </div>
        <div className="fam-panel p-teacher">
          <figure className="fam-photo">
            <img className="photo" src="img/teacher.webp" width="1280" height="1600" loading="lazy" alt="A teacher marking a stack of exam scripts with a red pen after school" />
          </figure>
          <div className="fam-row" data-rise>
            <div>
              <h3>Teachers</h3>
              <p>Set a question, let the AI mark first, then check the answers it is least sure of before anyone sees a mark.</p>
            </div>
            <Link to="/teacher" className="btn is-small">
              See the teacher view
            </Link>
          </div>
        </div>
      </div>
    </Section>
  )
}

const FAQ = [
  [
    'Is the AI marking accurate?',
    'It marks against the level descriptors and assessment objectives for your board, the way an examiner does, and every comment points at a sentence you wrote. It is a guide to your level, not a grade. Teachers can check and change any mark before a student sees it.',
  ],
  [
    'Do I need an account to try it?',
    'No. The free lesson and your first marked answer need nothing from you. If you want to keep the mark and carry on, you make an account with your email, and that takes under a minute.',
  ],
  [
    'Which exam boards do you cover?',
    'AQA, Edexcel, OCR, Cambridge International and Edexcel International, for Business, Economics, Psychology and Sociology. Sociology covers AQA, OCR and Cambridge.',
  ],
  [
    'What can my parents see?',
    'Time spent, lessons done and marks by level. They do not see your answers unless you share one. You choose this when you link accounts.',
  ],
  [
    'Can my teacher use it with a class?',
    'Yes. Teachers set questions from the spec, the AI marks first, and the teacher checks and releases the marks. Schools pay per class; ask us for a price.',
  ],
  ['How do I cancel?', 'From your account, in two clicks, at any time. Each subject is its own subscription, so you can drop one and keep another.'],
]

function Faq() {
  return (
    <Section className="faq" id="faq" aria-labelledby="faq-h">
      <div className="faq-head on-ox">
        <h2 id="faq-h" data-rise>
          Fair questions
        </h2>
      </div>
      {FAQ.map(([q, a], i) => (
        <div className={`faq-band${i % 2 ? ' is-alt' : ''}`} key={q}>
          <h3 data-rise>{q}</h3>
          <p data-rise>{a}</p>
        </div>
      ))}
    </Section>
  )
}

function Reply() {
  return (
    <Section className="reply on-ox" aria-labelledby="reply-h">
      <p className="reply-side" data-rise>
        One topic. One question. One mark, with the step that gets you the next one.
      </p>
      <div className="reply-card" data-rise>
        <h2 id="reply-h">Your first mark is free</h2>
        <p>Economics, price elasticity of demand. About ten minutes, no account.</p>
        <Link to="/taster/economics" className="btn reply-btn">
          Start the free lesson <Icon name="arrowRight" />
        </Link>
      </div>
    </Section>
  )
}
