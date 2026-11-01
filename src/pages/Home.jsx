import { useEffect, useState } from 'react'
import { LiaPauseSolid, LiaPlaySolid } from 'react-icons/lia'
import { Link } from 'react-router-dom'
import { Ribbon, photo, Citation } from '../ui.jsx'
import { CATEGORIES, GROUPS, WINNERS, JURY, FEES, NEVER, FAQ, catOf, winnerFor, scoreOf, dateOf, fmtDate, YEAR } from '../data/awards.js'
import { Finder } from './Categories.jsx'

// Days left, from the visitor's own clock.
function daysTo(k) { const d = Math.ceil((dateOf(k) - new Date()) / 86400000); return d }
function Countdown() {
  const close = daysTo('close'); const early = daysTo('early')
  if (close < 0) return <p className="count-line">Entries for {YEAR} are closed. Winners are named on {fmtDate(dateOf('ceremony'))}.</p>
  return (
    <p className="count-line">
      <span><b>{close}</b> {close === 1 ? 'day' : 'days'} left to enter</span>
      {early >= 0 && <span><b>{early}</b> {early === 1 ? 'day' : 'days'} at the early rate</span>}
    </p>
  )
}

const HERO = ['ana-ribeiro', 'marcus-bell', 'mei-lin-zhao', 'yasmin-haddad'].map((s) => WINNERS.find((w) => w.slug === s))

// Signature move: the winners' portraits crossfade slowly beside the card, like light shifting in a room.
// It can be paused (WCAG 2.2.2), and it holds still while a pointer or focus is on it.
function HeroPhoto() {
  const [i, setI] = useState(0)
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [playing, setPlaying] = useState(!reduce)
  const [held, setHeld] = useState(false)
  useEffect(() => {
    if (!playing || held) return
    const id = setInterval(() => { if (!document.hidden) setI((v) => (v + 1) % HERO.length) }, 5600)
    return () => clearInterval(id)
  }, [playing, held])
  const w = HERO[i]
  return (
    <figure className="photo" onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
      <button className="pause" onClick={() => setPlaying((v) => !v)} aria-label={playing ? 'Pause the winners’ portraits' : 'Play the winners’ portraits'}>{playing ? <LiaPauseSolid size={18} aria-hidden="true" /> : <LiaPlaySolid size={18} aria-hidden="true" />}</button>
      <span className={`tick${playing && !held ? ' run' : ''}`} key={`${i}-${playing}-${held}`} aria-hidden="true" />
      {HERO.map((h, k) => <img key={h.slug} src={photo(h.photo)} alt={k === i ? `${h.name}, winner of ${catOf(h.cat).name} 2026` : ''} aria-hidden={k !== i} className={k === i ? 'on' : ''} width="900" height="1125" fetchpriority={k === 0 ? 'high' : 'low'} />)}
      <figcaption aria-live="polite"><Link className="link" to={`/winners/${w.slug}`}>{w.name}, {w.company}</Link><span className="muted">{catOf(w.cat).name}, 2026</span></figcaption>
    </figure>
  )
}

export default function Home() {
  const slips = WINNERS.slice(0, 6)
  const heights = [38, 30, 44, 34, 41, 28]
  const tilt = [0, -1.5, 0, 1.2, 0, -1]
  const featured = WINNERS.find((w) => w.slug === 'ana-ribeiro')
  return (
    <>
      <section className="hero" aria-labelledby="hero-h">
        <div className="card">
          <Ribbon />
          <div className="card-body">
            <p className="year" data-rise>Tech Leader Awards {YEAR}</p>
            <h1 id="hero-h" data-rise>Awards judged in the open</h1>
            <p className="say" data-rise>Twelve awards for software companies and the people who lead them. Named jurors, flat fees, and every winner’s scorecard published. Winners are named in New York on {fmtDate(dateOf('ceremony'))}.</p>
            <div data-rise><Countdown /></div>
            <Link to="/enter" className="btn" data-rise>Enter by {fmtDate(dateOf('close'), true)}</Link>
          </div>
          <p className="facts"><Link className="link" to="/categories">See the 12 categories</Link><Link className="link" to="/jury">Meet the jury</Link><Link className="link" to="/judging">How judging works</Link></p>
        </div>
        <HeroPhoto />
      </section>

      <section className="showcase section" aria-labelledby="sc-h">
        <img src={photo('hall')} alt="A ceremony hall with a lit stage and a full audience" width="1800" height="1350" loading="lazy" className="drift" />
        <div className="words">
          <h2 id="sc-h" data-rise>Read on stage</h2>
          <p data-rise>Every 2026 winner was named with one sentence saying why. The same sentence is printed on their card, and their scores are on the back.</p>
        </div>
        <div className="slips">
          {slips.map((w, k) => (
            <Link key={w.slug} to={`/winners/${w.slug}`} className="slip" style={{ minHeight: `${heights[k]}svh`, transform: `rotate(${tilt[k]}deg)` }}>
              <b>{catOf(w.cat).name}</b>
              <span className="typed" aria-hidden="true">- - - - - - - - - - - - - - - - - - - -</span>
              <span className="who">{w.name}</span><br />{w.company}<br /><br />
              {w.citation[0].toUpperCase() + w.citation.slice(1)}<br /><br />
              Score {scoreOf(w).total.toFixed(1)}
            </Link>
          ))}
        </div>
      </section>

      <section className="cats section wrap" id="categories" aria-labelledby="cats-h">
        <div className="giant"><h2 id="cats-h" data-rise>Categories</h2></div>
        <div className="cols">
          <Finder />
          <div className="bars" data-rise>
            {GROUPS.map((g, gi) => {
              const list = CATEGORIES.filter((c) => c.group === g.key)
              return (
                <details key={g.key} open={gi === 0}>
                  <summary>{g.name}<span className="count">{list.length} awards</span><span className="plus" aria-hidden="true" /></summary>
                  <div className="panel">
                    {list.map((c) => { const w = winnerFor(c.slug); return <Link key={c.slug} to={`/categories/${c.slug}`}><b>{c.name}</b><span>{w ? `2026: ${w.company}` : 'New for 2027'}</span></Link> })}
                  </div>
                </details>
              )
            })}
          </div>
        </div>
      </section>

      <section className="judging section" aria-labelledby="jg-h">
        <div className="copy">
          <h2 id="jg-h" className="head" data-rise>How a winner is chosen</h2>
          <p data-rise>At least two named jurors score every entry on the category’s published criteria. Jurors declare their interests first and step aside where they have one. The highest weighted total wins, and the scores are printed for everyone to check.</p>
          <Link to="/judging" className="btn ink" data-rise>Read the rules</Link>
        </div>
        <div className="receipt" data-rise aria-label="The judging timeline">
          <h3 data-rise>November to February</h3>
          <p className="row" data-rise><span>Entries open, one fee per category</span><i className="dots" /><span className="v">{fmtDate(dateOf('open'), true)}</span></p>
          <p className="row" data-rise><span>Early entry closes</span><i className="dots" /><span className="v">{fmtDate(dateOf('early'), true)}</span></p>
          <p className="row" data-rise><span>Entries close</span><i className="dots" /><span className="v">{fmtDate(dateOf('close'), true)}</span></p>
          <h3 data-rise>March</h3>
          <p className="row" data-rise><span>Eligibility checked, fees refunded if not</span><i className="dots" /><span className="v">10 days</span></p>
          <p className="row" data-rise><span>Jurors declare interests and recuse</span><i className="dots" /><span className="v">1 week</span></p>
          <p className="row" data-rise><span>Each entry scored by two jurors or more</span><i className="dots" /><span className="v">3 weeks</span></p>
          <h3 data-rise>April to June</h3>
          <p className="row" data-rise><span>Shortlists published with scores so far</span><i className="dots" /><span className="v">{fmtDate(dateOf('shortlist'), true)}</span></p>
          <p className="row" data-rise><span>Finalists demo to the full jury</span><i className="dots" /><span className="v">May</span></p>
          <p className="final" data-rise><span>Winner, citation and scorecard published</span><span>{fmtDate(dateOf('ceremony'), true)}</span></p>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="letter-h">
        <div className="letter-wrap">
          <div className="letter" data-rise>
            <p className="from"><img src={photo('p-05')} alt="" width="48" height="48" loading="lazy" /><span>From the jury chair</span></p>
            <h2 id="letter-h">Why we publish the scores</h2>
            <p>Most awards ask you to trust the result. We would rather show it. Every winner’s card has the jury’s scores on the back, criterion by criterion, juror by juror.</p>
            <p>That changes how we judge. A score you know will be read has to be one you can defend. It also changes what we ask of entrants: <mark>we score the product, not the essay about it</mark>, so a demo account counts for more than adjectives.</p>
            <p>Six of us judge this year. You can read what each of us has worked on, who we have advised, and which entries we will not score because of it.</p>
            <p>If a result looks wrong to you, write to us. We will answer, and if we made a mistake we will say so on the winner’s page.</p>
            <p className="sign">Renée Thomas</p>
            <p className="muted small">Jury chair, Tech Leader Awards</p>
          </div>
          <div aria-labelledby="jury-h">
            <h2 id="jury-h" className="sr-only">The jury</h2>
            <div className="jury-plates">
              {JURY.map((j) => (
                <Link key={j.slug} to={`/jury#${j.slug}`} className="plate" data-rise>
                  <img src={photo(j.photo)} alt={`${j.name}, ${j.role}`} width="900" height="1125" loading="lazy" />
                  <b>{j.name}</b><span>{j.org}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="win-h">
        <div className="two" style={{ alignItems: 'start' }}>
          <div>
            <h2 id="win-h" className="head" data-rise>Turn the card over</h2>
            <p className="lead" style={{ marginTop: 24, maxWidth: '30ch' }} data-rise>This is how Ana Ribeiro won Most User-Friendly in 2026. Three jurors, four criteria, every score.</p>
            <img src={photo(featured.photo)} alt={`${featured.name}, ${featured.role} at ${featured.company}`} width="900" height="1125" loading="lazy" style={{ marginTop: 32, width: '62%', aspectRatio: '4 / 5', objectFit: 'cover', filter: 'grayscale(1)' }} data-rise />
          </div>
          <div data-rise><Citation w={featured} /></div>
        </div>
      </section>

      <section className="section wrap" id="fees" aria-labelledby="fees-h">
        <div className="fees">
          <div className="side">
            <h2 id="fees-h" data-rise>Fees, in full</h2>
            <img src={photo('crystal')} alt="Two crystal award trophies" width="1024" height="796" loading="lazy" data-rise />
          </div>
          <div className="menu">
            {FEES.map((g) => (
              <div key={g.group} data-rise>
                <h3>{g.group}</h3>
                {g.items.map(([name, price, note]) => (
                  <div className="item" key={name}><p className="line"><span>{name}</span><span>{price ? `$${price.toLocaleString('en-US')}` : 'Free'}</span></p><p>{note}</p></div>
                ))}
              </div>
            ))}
            <div className="never" data-rise>
              <h3>What no fee or sponsorship buys</h3>
              <ul>{NEVER.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="faq section" aria-labelledby="faq-h">
        <div>
          <h2 id="faq-h" data-rise>Questions</h2>
          <div className="facts" data-rise>
            <p>Entries close {fmtDate(dateOf('close'))}, 11:59 pm Eastern</p>
            <p>Ceremony {fmtDate(dateOf('ceremony'))}, 6:30 pm, [Venue], New York, and free to watch online</p>
            <p>From $95 a category, refunded if not eligible</p>
          </div>
          {FAQ.map(([q, a], i) => (
            <details key={q} open={i === 0}><summary>{q}<i aria-hidden="true" /></summary><p>{a}</p></details>
          ))}
          <div className="close"><Link to="/enter" className="btn">Enter your product</Link><Link className="link" to="/judging">All the rules</Link></div>
        </div>
        <div className="pics">
          <img className="tall" src={photo('auditorium')} alt="A full auditorium facing a lit stage" width="1024" height="768" loading="lazy" />
          <img className="sq" src={photo('front-row')} alt="Guests in the front rows during a ceremony" width="1024" height="810" loading="lazy" />
        </div>
      </section>

      <section className="reply" aria-labelledby="reply-h">
        <p className="note" data-rise>Seven awards were given in 2026, and all seven scorecards are public. In 2027 there are twelve.</p>
        <div className="rcard" data-rise>
          <h2 id="reply-h">Enter by {fmtDate(dateOf('close'))}</h2>
          <p>One flat fee a category, a demo account for the jury, and an answer within ten days on whether you are eligible.</p>
          <Link to="/enter" className="btn ink">Start an entry</Link>
        </div>
      </section>
    </>
  )
}
