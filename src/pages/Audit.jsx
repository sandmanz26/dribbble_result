import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Section } from '../ui/kit.jsx'
import { SiteFooter, SiteNav } from '../ui/SiteChrome.jsx'
import { FINDINGS, METRICS, ROUTE_AFTER, ROUTE_BEFORE } from '../data/audit.js'

const WHO = [
  ['all', 'Everyone'],
  ['student', 'Student'],
  ['parent', 'Parent'],
  ['teacher', 'Teacher'],
]
const P = { P1: 'Stops the route', P2: 'Slows or confuses', P3: 'Costs trust' }

export default function Audit() {
  const [who, setWho] = useState('all')
  const list = FINDINGS.filter((f) => who === 'all' || f.who.includes(who))
  const counts = ['P1', 'P2', 'P3'].map((p) => [p, list.filter((f) => f.p === p).length])

  return (
    <div className="site">
      <SiteNav />
      <main id="main" className="audit">
        <section className="page-head audit-head">
          <h1 className="page-h">Where people get stuck</h1>
          <p className="lead">
            Stage 1: a UX audit of examace.co.uk, walked as a student, a parent and a teacher on 22 November 2026. {FINDINGS.length} findings, worst
            first. Each one links to the screen in this prototype that fixes it.
          </p>
        </section>

        <Section className="route-compare" aria-labelledby="rc-h">
          <h2 id="rc-h" className="h-head" data-rise>
            The route to a first mark
          </h2>
          <div className="rc-cols">
            <div className="rc-col is-before" data-rise>
              <h3>Today: {ROUTE_BEFORE.length} steps, then a paywall</h3>
              <ol>
                {ROUTE_BEFORE.map((s, i) => (
                  <li key={s} className={i === 2 || i === ROUTE_BEFORE.length - 1 ? 'is-stop' : ''}>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rc-col is-after" data-rise>
              <h3>Proposed: {ROUTE_AFTER.length} steps, no account, about 10 minutes</h3>
              <ol>
                {ROUTE_AFTER.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <Link to="/taster/economics" className="btn is-paper">
                Walk the new route <Icon name="arrowRight" />
              </Link>
            </div>
          </div>
        </Section>

        <section className="findings" aria-labelledby="f-h">
          <div className="findings-head">
            <h2 id="f-h" className="h-head">
              Findings
            </h2>
            <div className="findings-filter" role="tablist" aria-label="Walked as">
              {WHO.map(([k, l]) => (
                <button key={k} role="tab" aria-selected={who === k} className={`pick${who === k ? ' is-on' : ''}`} onClick={() => setWho(k)}>
                  {l}
                </button>
              ))}
            </div>
            <p className="findings-count tnum">
              {counts.map(([p, n]) => `${n} ${p}`).join(' · ')}
            </p>
          </div>
          <ol className="finding-list">
            {list.map((f) => (
              <li key={f.id} className={`finding is-${f.p.toLowerCase()}`}>
                <div className="finding-meta">
                  <span className="finding-p">{f.p}</span>
                  <span>{P[f.p]}</span>
                  <span className="finding-who">{f.who.map((w) => w[0].toUpperCase() + w.slice(1)).join(', ')}</span>
                </div>
                <div className="finding-body">
                  <h3>{f.title}</h3>
                  <p className="finding-where">{f.where}</p>
                  <dl>
                    <dt>What happens</dt>
                    <dd>{f.seen}</dd>
                    <dt>Why it matters</dt>
                    <dd>{f.why}</dd>
                    <dt>Fix</dt>
                    <dd>{f.fix}</dd>
                  </dl>
                  <Link className="link" to={f.screen[0]}>
                    See it fixed: {f.screen[1]}
                  </Link>
                </div>
                {f.img && (
                  <figure className="finding-img">
                    <img src={f.img} alt={`Screenshot of the live site: ${f.where}`} loading="lazy" />
                    <figcaption>examace.co.uk, 22 Nov 2026</figcaption>
                  </figure>
                )}
              </li>
            ))}
          </ol>
        </section>

        <Section className="metrics" aria-labelledby="m-h">
          <h2 id="m-h" className="h-head" data-rise>
            What to measure
          </h2>
          <p className="lead" data-rise>
            The goal is students signed up and using it. These seven numbers say whether the new route works, in the order a student meets them.
          </p>
          <ol className="metric-list" data-rise>
            {METRICS.map(([m, d]) => (
              <li key={m}>
                <strong>{m}</strong>
                <span>{d}</span>
              </li>
            ))}
          </ol>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
