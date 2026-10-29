import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS, SKILLS, EVIDENCE, STRENGTH, PEOPLE, APPLICANTS, readiness, scoreOf } from '../data/bridge.js'
import { Bar, Strength } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

const DEMO = ['bus-stop-heat', 'telegram-rumours', 'wetland-nitrogen'].map((id) => PROJECTS.find((p) => p.id === id))
const KNOBS = [
  { skill: 'py', level: 2, title: 'Data-cleaning task, reviewed' }, { skill: 'gis', level: 2, title: 'GEOG 214 Introduction to GIS' },
  { skill: 'sensors', level: 2, title: 'Sensor calibration lab report' }, { skill: 'stats', level: 2, title: 'Mixed-effects model task' },
  { skill: 'nlp', level: 2, title: 'Labelled 200 posts, agreement 0.81' }, { skill: 'arabic', level: 2, title: 'Arabic reading check' },
  { skill: 'wetlab', level: 1, title: 'Pipetting induction' }, { skill: 'writing', level: 1, title: 'Graded lab report, lead author' },
]
const START = { py: 'verified', gis: 'verified', sensors: 'verified', stats: 'none', nlp: 'linked', arabic: 'claimed', wetlab: 'none', writing: 'claimed' }
const STEPS = [
  ['Show', 'library-carrel', 'Add what you have done: a graded course, a repository, a lab report, a certificate. A TA or the registrar verifies it.'],
  ['Match', 'laptops-pair', 'Every open project lists the skills it needs and how much each matters. You see your readiness and what is missing before you apply.'],
  ['Contribute', 'water-test', 'Work on the project. When it ends, the researcher signs what you did, in the roles journals already use.'],
  ['Carry', 'gps-moor', 'Your passport goes with you: to the next lab, a graduate application, an employer. You decide who sees it.'],
]
const FAQ = [
  ['Is the readiness score a grade?', 'No. It is the share of the skills a project asked for that your evidence covers, weighted by the lab. Every point is listed next to the evidence that earned it, so you and the lab can check it.'],
  ['How is evidence verified?', 'Course results come from the registrar. Lab reports and tasks are confirmed by the TA or researcher who reviewed them. A link to your own work counts at 70% until someone checks it; a statement counts at 30%.'],
  ['What do labs see when I apply?', 'Your readiness, how it is worked out and your evidence for the skills they asked for. Your name and photo stay hidden until they shortlist you, and grades stay hidden unless you show them.'],
  ['Can I apply under 75%?', 'Yes. Labs see the gaps you are closing, and many invite promising applicants to a short reviewed task for the missing skill.'],
  ['What happens to my passport when I graduate?', 'It stays yours. Download it as a PDF or as JSON, and keep the share link for as long as you choose. Each entry carries the researcher’s signature and date.'],
  ['Can I use it without a mouse?', 'Every screen works from the keyboard: Tab through controls, g then a letter to move between screens, / to search projects, ? for the full list. It is set in Atkinson Hyperlegible, a face drawn for low-vision readers.'],
]

function Matcher() {
  const [ev, setEv] = useState(START)
  const evidence = useMemo(() => KNOBS.filter((k) => ev[k.skill] !== 'none').map((k, i) => ({ id: `k${i}`, skill: k.skill, level: k.level, strength: ev[k.skill], kind: '', title: k.title, by: '' })), [ev])
  const scored = DEMO.map((p) => ({ p, r: readiness(p, evidence) }))
  return (
    <div className="frag matcher" data-ui>
      <div className="frag-col">
        <p className="frag-h">Lina’s evidence</p>
        <ul className="knobs">
          {KNOBS.map((k) => (
            <li key={k.skill}>
              <span className="knob-t"><b>{SKILLS[k.skill]}</b><small>{k.title}</small></span>
              <span className="seg is-small" role="radiogroup" aria-label={`${SKILLS[k.skill]} evidence`}>
                {['none', 'claimed', 'linked', 'verified'].map((x) => (
                  <label key={x} className={ev[k.skill] === x ? 'is-on' : ''}><input type="radio" name={`k-${k.skill}`} checked={ev[k.skill] === x} onChange={() => setEv({ ...ev, [k.skill]: x })} />{x === 'none' ? 'None' : STRENGTH[x].label}</label>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="frag-col">
        <p className="frag-h">Readiness for three open projects</p>
        <ul className="scores" aria-live="polite">
          {scored.map(({ p, r }) => (
            <li key={p.id}>
              <span className="sc-t"><b>{p.title}</b><small>{PEOPLE[p.pi].lab}</small></span>
              <span className="sc-r"><Bar value={r.score} /><b>{r.score}%</b></span>
              <span className="sc-m">{r.missing.length ? <>Missing: {r.missing.map((m) => <span key={m.skill} className="miss-chip">{SKILLS[m.skill]} +{Math.round(m.gap)}</span>)}</> : <span className="ready-chip">Fully evidenced</span>}</span>
            </li>
          ))}
        </ul>
        <button className="link" onClick={() => setEv(START)}>Reset Lina’s evidence</button>
      </div>
    </div>
  )
}

function LabFragment() {
  const p = PROJECTS[0]
  const rows = APPLICANTS.filter((a) => a.project === p.id && a.state !== 'declined').map((a) => ({ a, score: scoreOf(a) })).sort((x, y) => y.score - x.score).slice(0, 5)
  return (
    <div className="frag" data-ui>
      <p className="frag-h">{p.title}: applicants, names hidden</p>
      <table className="tbl small">
        <thead><tr><th>Applicant</th>{p.reqs.map((r) => <th key={r.skill}>{SKILLS[r.skill].split(' ')[0]}</th>)}<th className="num">Ready</th></tr></thead>
        <tbody>{rows.map(({ a, score }) => <tr key={a.id}><td>{a.id}</td>{a.scores.map((v, i) => <td key={i}><Strength s={v} short /></td>)}<td className="num"><b>{score}%</b></td></tr>)}</tbody>
      </table>
    </div>
  )
}

function PassportFragment() {
  return (
    <div className="frag book is-frag" data-ui>
      <div className="book-cover"><span className="book-kind">Contribution Passport</span><p className="book-name">Lina Haddad</p><p>BSc Environmental Science, Northgate University</p></div>
      <div className="book-page">
        <div className="stamp is-ok">
          <div className="stamp-head"><b>Campus air-quality pilot</b><span>Urban Climate Lab · Mar 2026 to Jun 2026 · 96 h</span></div>
          <ul className="roles"><li className="hl">Data curation</li><li className="hl">Investigation</li><li className="hl">Software</li></ul>
          <p className="stamp-by"><I.Verified size={16} aria-hidden="true" /> Verified by Dr. Amara Okonkwo on 2 July 2026</p>
        </div>
      </div>
    </div>
  )
}

function useLpReveal() {
  useEffect(() => {
    const els = [...document.querySelectorAll('.lp [data-rise]')]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return }
    document.documentElement.classList.add('js-rise')
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { [...x.target.children].forEach((c, i) => c.style.setProperty('--d', `${i * 80}ms`)); x.target.classList.add('is-in'); io.unobserve(x.target) } }), { rootMargin: '0px 0px -10% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
}

export default function Landing() {
  useLpReveal()
  const [mail, setMail] = useState('')
  const [sent, setSent] = useState(null)
  const lina = readiness(PROJECTS[0], EVIDENCE).score
  return (
    <div className="lp">
      <a className="skip" href="#content">Skip to content</a>
      <header className="lp-nav">
        <Link to="/" className="brand"><span className="mark" aria-hidden="true"><span /></span><span><b>Bridge</b><small>Skill-to-Research</small></span></Link>
        <nav aria-label="Sections"><a href="#how">How it works</a><a href="#match">Students</a><a href="#labs">Labs</a><a href="#passport">Passport</a><a href="#faq">Questions</a></nav>
        <Link to="/app" className="btn is-primary">Open the demo</Link>
      </header>

      <main id="content">
        <section className="lp-hero" aria-labelledby="hero-h">
          <h1 id="hero-h" className="lp-h1">
            <span className="l1">Show the work,</span>
            <span className="l2"><span className="slot"><img src="photos/microscope-class.webp" alt="Students recording results at microscopes" width="1024" height="683" fetchpriority="high" /></span>join the research.</span>
          </h1>
          <div className="lp-hero-foot">
            <p className="lp-lead">Skill-to-Research Bridge matches what university students can show they can do with open research projects: how ready you are for each, what is missing, and a passport of what you contributed.</p>
            <div className="lp-acts"><a href="#match" className="btn is-primary is-big">See what you’re ready for <I.Right size={18} /></a><Link to="/lab" className="link-arrow">I run a lab <I.Right size={16} /></Link></div>
          </div>
        </section>

        <section id="match" className="lp-sec lp-match" aria-labelledby="match-h">
          <div className="lp-say" data-rise>
            <h2 id="match-h" className="lp-h2">Readiness, worked out in the open</h2>
            <p className="lp-lead">Change Lina’s evidence and the three projects re-score. Every point comes from one piece of evidence and the weight the lab gave that skill, so nothing is a black box.</p>
            <p className="lp-note">Lina is {lina}% ready for the bus-stop heat project. The missing 10 points are regression at working level: one reviewed three-hour task closes it.</p>
            <Link to="/app/projects/bus-stop-heat" className="link-arrow">Open her full breakdown <I.Right size={16} /></Link>
          </div>
          <Matcher />
        </section>

        <section id="how" className="verbs" aria-labelledby="how-h">
          <h2 id="how-h" className="sr">How it works</h2>
          {STEPS.map(([v, ph, t]) => (
            <div key={v} className="verb">
              <img src={`photos/${ph}.webp`} alt="" width="1024" height="768" loading="lazy" />
              <div className="verb-in" data-rise><p className="verb-w" aria-hidden="true">{v}.</p><h3 className="sr">{v}</h3><p className="verb-t">{t}</p></div>
            </div>
          ))}
        </section>

        <section className="fields" aria-label="Principles">
          <div className="field-c is-navy" data-rise><p className="field-p">Labs see what you can show, not your name or photo, until they shortlist you. It levels the field for students without a professor’s introduction.</p><h2 className="field-h">Evidence before names.</h2></div>
          <div className="field-c is-lime" data-rise><p className="field-p">When a skill is missing you get the shortest honest way to show it: a reviewed task, a workshop, a record to upload. Then the score moves.</p><h2 className="field-h">Gaps you can close.</h2></div>
          <div className="field-c is-paper" data-rise><p className="field-p">Your profile is visible only to labs you apply to. You choose what your passport link shows, see who opened it, and can download or delete everything.</p><h2 className="field-h">Private by default.</h2></div>
        </section>

        <section id="labs" className="lp-sec lp-split is-flip" aria-labelledby="labs-h">
          <div className="lp-say" data-rise>
            <h2 id="labs-h" className="lp-h2">For labs: a shortlist you can defend</h2>
            <p className="lp-lead">Set the skills a project needs and how much each matters. Applicants arrive ranked by evidence, names hidden, with the gap in your pool named, and one click sends a reviewed task to the near misses.</p>
            <Link to="/lab" className="link-arrow">Open the researcher view <I.Right size={16} /></Link>
          </div>
          <LabFragment />
        </section>

        <section id="passport" className="lp-sec lp-split" aria-labelledby="pass-h">
          <div className="lp-say" data-rise>
            <h2 id="pass-h" className="lp-h2">A passport for what you did</h2>
            <p className="lp-lead">Each project ends with the researcher signing your contribution in CRediT roles, the taxonomy journals use: data curation, software, investigation. It is yours to carry, as a link, a PDF or JSON.</p>
            <Link to="/app/passport" className="link-arrow">See Lina’s passport <I.Right size={16} /></Link>
          </div>
          <PassportFragment />
        </section>

        <section id="faq" className="lp-sec lp-faq" aria-labelledby="faq-h">
          <h2 id="faq-h" className="lp-h2 is-wide">Questions before you start</h2>
          <div className="qa">{FAQ.map(([q, a]) => <details key={q}><summary><span>{q}</span><I.Down size={20} aria-hidden="true" /></summary><p>{a}</p></details>)}</div>
        </section>

        <section className="lp-sec lp-cta" aria-labelledby="cta-h">
          <h2 id="cta-h" className="sr">Get new projects by email</h2>
          {sent ? <p className="cta-done" role="status">Done. New projects go to <b>{sent}</b> every Monday.</p> : (
            <form className="cta-line" onSubmit={(e) => { e.preventDefault(); if (/^\S+@\S+\.\S+$/.test(mail)) setSent(mail) }}>
              <span>Email new projects to</span>
              <label className="sr" htmlFor="cta-mail">Your university email</label>
              <input id="cta-mail" type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="you@northgate.edu" required />
              <button className="cta-go">weekly.</button>
            </form>
          )}
          <p className="lp-note">One email each Monday with projects that match your evidence. Unsubscribe in one click.</p>
        </section>
      </main>

      <footer className="lp-foot">
        <div className="foot-top"><p>Skill-to-Research Bridge. A prototype with sample data: Northgate University, its labs and its people are invented.</p><a href="#content" className="link">Back to top</a></div>
        <Link to="/lab" className="foot-big">Run a pilot in your faculty</Link>
        <div className="foot-meta"><span><Link to="/app">Student view</Link> · <Link to="/lab">Researcher view</Link> · <Link to="/credits">Photo credits</Link></span><span>Set in Atkinson Hyperlegible Next</span><span>2026</span></div>
      </footer>
    </div>
  )
}
