import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AoBar, Icon, MarginCode, Section, Wordmark } from '../ui/kit.jsx'
import { SiteFooter, SiteNav } from '../ui/SiteChrome.jsx'

const COLOURS = [
  ['Paper', '--paper', '#e2e2e2', 'The ground of every page'],
  ['Paper 2', '--paper-2', '#d6d6d6', 'One step: panels, quiet buttons'],
  ['Paper 3', '--paper-3', '#c9c8c7', 'Two steps: empty marks, dividers in tables'],
  ['Sheet', '--sheet', '#f2f1ef', 'Answer paper: lessons, scripts, app panels'],
  ['Oxblood', '--ox', '#7d0c14', 'The examiner’s pen: marks, the one action, marketing type'],
  ['Oxblood deep', '--ox-deep', '#5c0810', 'Pressed and hover'],
  ['Oxblood tint', '--ox-tint', '#ead6d7', 'The margin, the current sentence, mid values'],
  ['Graphite', '--graphite', '#241618', 'Reading text inside the app and on paper'],
]

const TYPE = [
  ['Display', 'var(--step-display)', 800, 'Train for the paper.'],
  ['Head', 'var(--step-head)', 800, 'See where the marks are'],
  ['Lead', 'var(--step-lead)', 500, 'Learn one topic, answer a real question, see your mark.'],
  ['Body', 'var(--step-body)', 400, 'Price elasticity of demand measures how responsive quantity demanded is to a change in price.'],
  ['Small', 'var(--step-small)', 400, 'Sample extract written for this prototype'],
]

const RULES = [
  ['Red means marks', 'Oxblood is the examiner’s pen. In the app it only appears on marks, on the data that answers the screen’s question, and on the one action.'],
  ['One action a screen', 'Every screen has one filled button. Everything else is a quiet button or a link.'],
  ['Marks are never only a colour', 'Every AO shows its number next to its bar. Margin codes are letters, with their meaning on hover and in the key.'],
  ['Square corners, no shadows', 'Surfaces are separated by a step of grey. Shadows only on things that float: the prototype menu.'],
  ['Write like a good teacher', 'Short sentences, British spelling, no exclamation marks, no dashes. Say what happens next.'],
]

const CSS_VARS = `/* src/index.css in the Lovable project: replace the :root block */
@layer base {
  :root {
    --background: 0 0% 89%;        /* paper  #e2e2e2 */
    --foreground: 351 24% 11%;     /* graphite #241618 */
    --card: 40 10% 94%;            /* sheet  #f2f1ef */
    --card-foreground: 351 24% 11%;
    --popover: 40 10% 94%;
    --popover-foreground: 351 24% 11%;
    --primary: 356 82% 27%;        /* oxblood #7d0c14: marks and the one action */
    --primary-foreground: 0 0% 93%;
    --secondary: 0 0% 84%;         /* paper 2 #d6d6d6: quiet buttons */
    --secondary-foreground: 356 82% 27%;
    --muted: 0 0% 84%;
    --muted-foreground: 349 9% 34%;
    --accent: 357 32% 88%;         /* oxblood tint #ead6d7: the margin */
    --accent-foreground: 356 82% 27%;
    --destructive: 356 82% 27%;
    --destructive-foreground: 0 0% 93%;
    --border: 30 2% 78%;           /* paper 3 #c9c8c7 */
    --input: 30 2% 78%;
    --ring: 356 82% 27%;
    --radius: 0rem;                /* square corners everywhere */
  }
}`

const TW = `// tailwind.config.ts in the Lovable project: add inside theme.extend
fontFamily: {
  sans: ['"Cabinet Grotesk"', 'Helvetica Neue', 'Arial', 'sans-serif'],
},
colors: {
  paper: { DEFAULT: '#e2e2e2', 2: '#d6d6d6', 3: '#c9c8c7' },
  sheet: '#f2f1ef',
  ox: { DEFAULT: '#7d0c14', deep: '#5c0810', tint: '#ead6d7' },
  graphite: { DEFAULT: '#241618', muted: '#5f4f52' },
},
fontSize: {
  small: ['clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)', '1.45'],
  body: ['clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)', '1.5'],
  lead: ['clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)', '1.35'],
  head: ['clamp(2.5rem, 1.2rem + 5vw, 5.5rem)', '0.92'],
  display: ['clamp(4.5rem, 1rem + 11.4vw, 11rem)', '0.86'],
},`

const MAP = [
  ['Button', 'shadcn Button', 'default = oxblood, secondary = quiet, size sm. One default button per screen.'],
  ['Choice (pick, chip)', 'ToggleGroup / RadioGroup', 'Visible options, never a Select for fewer than eight choices.'],
  ['Panel', 'Card', 'No shadow: bg-card on bg-background is the separation.'],
  ['Margin code', 'Badge', 'variant default for earned (K, APP, AN, EV); outline for “?”.'],
  ['AO bar', 'New component: AoBar', 'One cell per mark, aria-label “3 of 4”. Not a Progress bar: marks are counted, not filled.'],
  ['Lesson steps', 'Tabs (controlled)', 'Done steps clickable, future steps disabled.'],
  ['Teacher marks', 'Table + a stepper', 'Least-sure first; Release is the only default button.'],
  ['Tutor reply', 'Collapsible', 'Opens under the mark, not in a separate chat page.'],
]

const PHASES = [
  ['Week 1: tokens', 'Paste the CSS variables and Tailwind extension. Every existing shadcn screen in Lovable takes the new paper, ink and oxblood at once, without rebuilding.'],
  ['Week 1: the route', 'Point every “Try free lessons” link at the taster. Move the account ask to after the first mark. These two changes need no new design.'],
  ['Week 2: homepage, sign-up, taster', 'Rebuild them from these screens, one Lovable prompt per section, using the component map.'],
  ['Week 3: dashboards', 'Student Today, parent view, teacher queue. New data fields: AO marks per answer and the marker’s confidence.'],
]

export default function System() {
  const [tab, setTab] = useState('css')
  return (
    <div className="site">
      <SiteNav />
      <main id="main" className="system">
        <section className="page-head">
          <h1 className="page-h">Design system</h1>
          <p className="lead">
            One family, one red, square corners. The idea: the page is an answer sheet and the red is the examiner’s pen, so colour always means
            marks.
          </p>
        </section>

        <Section className="sys-block" aria-labelledby="sc-h">
          <h2 id="sc-h" className="sys-h" data-rise>
            Colour
          </h2>
          <ul className="swatches" data-rise>
            {COLOURS.map(([n, v, hex, use]) => (
              <li key={v}>
                <span className="swatch" style={{ background: `var(${v})` }} />
                <strong>{n}</strong>
                <code>{hex}</code>
                <span>{use}</span>
              </li>
            ))}
          </ul>
          <p className="sys-note" data-rise>
            Contrast: oxblood on paper 8.4:1, graphite on sheet 15.5:1, light text on oxblood 9.2:1, muted text on paper 5.6:1. All pass WCAG AA for small text.
          </p>
        </Section>

        <Section className="sys-block" aria-labelledby="st-h">
          <h2 id="st-h" className="sys-h" data-rise>
            Type: Cabinet Grotesk
          </h2>
          <div className="type-specimens">
            {TYPE.map(([n, size, w, s]) => (
              <div key={n} className="spec-row" data-rise>
                <p className="spec-label">
                  {n} · {w}
                </p>
                <p style={{ fontSize: size, fontWeight: w, lineHeight: n === 'Display' || n === 'Head' ? 0.92 : 1.4, letterSpacing: n === 'Display' ? '-0.045em' : n === 'Head' ? '-0.035em' : 0 }}>{s}</p>
              </div>
            ))}
          </div>
          <p className="sys-note" data-rise>
            Five sizes, fluid between phone and desktop. Headlines in two lines or fewer at every width. Figures tabular wherever marks line up.
          </p>
        </Section>

        <Section className="sys-block" aria-labelledby="scomp-h">
          <h2 id="scomp-h" className="sys-h" data-rise>
            Components
          </h2>
          <div className="comp-grid">
            <div className="comp" data-rise>
              <p className="comp-name">Buttons</p>
              <div className="comp-row">
                <button className="btn">
                  Mark my answer <Icon name="arrowRight" />
                </button>
                <button className="btn is-quiet">Back</button>
                <button className="btn is-small">Start</button>
                <button className="btn" disabled>
                  Disabled
                </button>
              </div>
            </div>
            <div className="comp" data-rise>
              <p className="comp-name">Margin codes</p>
              <div className="comp-row">
                <MarginCode code="K" />
                <MarginCode code="APP" />
                <MarginCode code="AN" />
                <MarginCode code="EV" />
                <MarginCode code="?" />
                <MarginCode code="EV?" />
              </div>
              <p className="comp-desc">What the examiner writes in the margin. Filled: earned. Outlined: a claim not yet supported.</p>
            </div>
            <div className="comp" data-rise>
              <p className="comp-name">AO bar</p>
              <div className="comp-stack">
                <span>
                  AO1 Knowledge <AoBar mark={3} max={3} />
                </span>
                <span>
                  AO3 Analysis <AoBar mark={2} max={4} />
                </span>
                <span>
                  AO4 Evaluation <AoBar mark={3} max={8} size="s" />
                </span>
              </div>
              <p className="comp-desc">One cell per mark, so a 4-mark AO and an 8-mark AO read honestly side by side.</p>
            </div>
            <div className="comp" data-rise>
              <p className="comp-name">Choices</p>
              <div className="comp-row">
                <button className="pick is-on">Economics</button>
                <button className="pick">Business</button>
                <button className="pick">Psychology</button>
              </div>
              <p className="comp-desc">Every choice is a visible button, never a browser dropdown.</p>
            </div>
            <div className="comp" data-rise>
              <p className="comp-name">Field</p>
              <label className="field">
                <span>Your email</span>
                <input placeholder="you@example.com" />
                <small>We send a sign-in link. No password.</small>
              </label>
            </div>
            <div className="comp is-ox on-ox" data-rise>
              <p className="comp-name">Wordmark</p>
              <Wordmark light />
              <p className="comp-desc">A tick in a square: the mark an examiner gives.</p>
            </div>
          </div>
        </Section>

        <Section className="sys-block" aria-labelledby="snav-h">
          <h2 id="snav-h" className="sys-h" data-rise>
            Navigation
          </h2>
          <dl className="nav-spec" data-rise>
            <div>
              <dt>Site</dt>
              <dd>Wordmark, five links, Sign in, and one action: Mark my first answer. On a phone: wordmark, the action, a menu.</dd>
            </div>
            <div>
              <dt>Lesson</dt>
              <dd>Wordmark, “Free lesson. No account needed.”, Leave. Four steps across the top: Learn, Check, Answer, Your mark.</dd>
            </div>
            <div>
              <dt>App</dt>
              <dd>A side rail of four places per role on desktop, a bottom bar of the same four on a phone. The title row says the screen’s one finding.</dd>
            </div>
          </dl>
        </Section>

        <Section className="sys-block" aria-labelledby="lv-h">
          <h2 id="lv-h" className="sys-h" data-rise>
            Keep it in Lovable
          </h2>
          <p className="sys-note" data-rise>
            ExamAce is built in Lovable, which uses React, Tailwind and shadcn/ui. This system is written to drop into that stack: the colours are shadcn
            variables, the type scale is Tailwind sizes, and every component maps to a shadcn part. No rebuild, no new framework.
          </p>
          <div className="handoff" data-rise>
            <div className="findings-filter" role="tablist" aria-label="Handoff file">
              <button role="tab" aria-selected={tab === 'css'} className={`pick${tab === 'css' ? ' is-on' : ''}`} onClick={() => setTab('css')}>
                index.css
              </button>
              <button role="tab" aria-selected={tab === 'tw'} className={`pick${tab === 'tw' ? ' is-on' : ''}`} onClick={() => setTab('tw')}>
                tailwind.config.ts
              </button>
            </div>
            <pre className="code">
              <code>{tab === 'css' ? CSS_VARS : TW}</code>
            </pre>
          </div>
          <table className="compare-table map-table" data-rise>
            <thead>
              <tr>
                <th scope="col">ExamAce part</th>
                <th scope="col">Build it with</th>
                <th scope="col">Rule</th>
              </tr>
            </thead>
            <tbody>
              {MAP.map(([a, b, c]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td>{b}</td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <dl className="phases" data-rise>
            {PHASES.map(([t, d]) => (
              <div key={t}>
                <dt>{t}</dt>
                <dd>{d}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section className="sys-block" aria-labelledby="sr-h">
          <h2 id="sr-h" className="sys-h" data-rise>
            Rules
          </h2>
          <dl className="process-list">
            {RULES.map(([t, d]) => (
              <div key={t} data-rise>
                <dt>{t}</dt>
                <dd>{d}</dd>
              </div>
            ))}
          </dl>
          <Link to="/audit" className="btn" data-rise>
            Read the audit behind it <Icon name="arrowRight" />
          </Link>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
