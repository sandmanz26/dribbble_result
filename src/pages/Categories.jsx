import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, GROUPS, WINNERS, catOf, winnerFor, scoreOf } from '../data/awards.js'
import { photo } from '../ui.jsx'

const POPULAR = ['best-ai-agent', 'most-user-friendly', 'best-fintech-innovation']
const SUGGEST = ['payments', 'AI agent', 'onboarding', 'clinics', 'security', 'founder']

// Where does my product fit? Words are matched against what each category is for.
export function match(q) {
  const words = q.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1)
  if (!words.length) return []
  return CATEGORIES.map((c) => {
    const hay = `${c.name} ${c.for} ${c.keys}`.toLowerCase()
    const score = words.reduce((s, w) => s + (c.keys.split(' ').includes(w) ? 3 : 0) + (hay.includes(w) ? 1 : 0) + (c.name.toLowerCase().includes(w) ? 2 : 0), 0)
    return { c, score }
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 3)
}

export function Finder({ autoFocus = false }) {
  const [q, setQ] = useState('')
  const hits = useMemo(() => match(q), [q])
  return (
    <div className="finder" data-rise>
      <label htmlFor="finder">What does your product do?</label>
      <input id="finder" value={q} onChange={(e) => setQ(e.target.value)} placeholder="For example: invoices for small suppliers" autoComplete="off" autoFocus={autoFocus} aria-describedby="finder-out" />
      <div className="chips" aria-label="Try a word">{SUGGEST.map((s) => <button key={s} type="button" onClick={() => setQ(s)}>{s}</button>)}</div>
      <div id="finder-out" className="hits" aria-live="polite" key={hits.map((h) => h.c.slug).join() || (q.trim().length > 1 ? 'none' : 'idle')}>
        {q.trim().length > 1 && (hits.length ? hits.map(({ c }) => (
          <Link key={c.slug} to={`/categories/${c.slug}`}><b>{c.name}</b><span>{c.for}</span></Link>
        )) : <p className="muted">No category matches “{q}”. Try a plainer word for what your product does, or browse the groups.</p>)}
        {q.trim().length <= 1 && (
          <>
            <p className="muted small" style={{ marginBottom: 6 }}>Type a few words and the closest categories appear here. Most entered in 2026:</p>
            {POPULAR.map((s) => { const c = CATEGORIES.find((x) => x.slug === s); return <Link key={s} to={`/categories/${s}`}><b>{c.name}</b><span>{c.for}</span></Link> })}
          </>
        )}
      </div>
    </div>
  )
}

export default function Categories({ winners = false }) {
  if (winners) return <Winners />
  return (
    <>
      <section className="page-head" aria-labelledby="ph">
        <h1 id="ph" data-rise>Twelve awards, four groups</h1>
        <p data-rise>Each category says what it rewards and how it is scored. Pick the one your product would win on evidence, not on wording.</p>
      </section>
      <section className="wrap" style={{ marginTop: 56 }} aria-labelledby="strip-h">
        <h2 id="strip-h" className="sr-only">The 2026 winners</h2>
        <div className="strip">
          {WINNERS.map((w) => <Link key={w.slug} to={`/winners/${w.slug}`} data-rise><img src={photo(w.photo)} alt={`${w.name}, ${catOf(w.cat).name} 2026`} width="900" height="1125" loading="lazy" style={{ viewTransitionName: `w-${w.slug}` }} /><b>{w.name}</b><span>{catOf(w.cat).name}</span></Link>)}
        </div>
      </section>
      <section className="section wrap" style={{ marginTop: 96 }} aria-label="Find a category">
        <div className="two"><Finder /><div className="panel" data-rise><h2>Entering more than one?</h2><p style={{ marginTop: 10 }}>One product can enter up to three categories. Each entry is written for its category and scored separately, against that category’s criteria only.</p><p style={{ marginTop: 10 }} className="muted">Most products fit one category clearly. If two look equally right, enter the one where your evidence is strongest.</p></div></div>
      </section>
      <section className="wrap" style={{ marginTop: 48, paddingBottom: 40 }} aria-label="All categories">
        {GROUPS.map((g) => (
          <div key={g.key} className="group-row" id={g.key}>
            <div data-rise><h2>{g.name}</h2><p>{g.says}</p></div>
            <div className="cat-list" data-rise>
              {CATEGORIES.filter((c) => c.group === g.key).map((c) => {
                const w = winnerFor(c.slug)
                return (
                  <Link key={c.slug} to={`/categories/${c.slug}`}>
                    <b>{c.name}</b>
                    <span className="for">{c.for}</span>
                    <span className="won">{w ? <><span>2026 winner<br />{w.name}</span><img src={photo(w.photo)} alt="" width="44" height="55" loading="lazy" /></> : <span>New for 2027</span>}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}

function Winners() {
  const [g, setG] = useState('all')
  const list = WINNERS.filter((w) => g === 'all' || catOf(w.cat).group === g)
  return (
    <>
      <section className="page-head" aria-labelledby="ph">
        <h1 id="ph" data-rise>The 2026 winners</h1>
        <p data-rise>Seven awards, named in New York on 3 June 2026. Open any winner to read the citation and the full scorecard.</p>
      </section>
      <section className="wrap" style={{ marginTop: 56, paddingBottom: 40 }} aria-label="Winners">
        <div className="filter" role="group" aria-label="Show winners from">
          {[['all', 'All seven'], ...GROUPS.map((x) => [x.key, x.name])].map(([k, l]) => <button key={k} type="button" aria-pressed={g === k} onClick={() => setG(k)}>{l} <span>{k === 'all' ? WINNERS.length : WINNERS.filter((w) => catOf(w.cat).group === k).length}</span></button>)}
        </div>
        <p className="muted" style={{ marginTop: 16 }} aria-live="polite">{g === 'all' ? 'The awards were first given in 2026, so this is the whole archive so far.' : `${list.length} ${list.length === 1 ? 'winner' : 'winners'} in ${GROUPS.find((x) => x.key === g).name}.`}</p>
        <ul className="win-list" style={{ marginTop: 28 }} key={g}>
          {list.map((w) => (
            <li key={w.slug} data-rise>
              <Link to={`/winners/${w.slug}`}>
                <img src={photo(w.photo)} alt={`${w.name}, ${w.role} at ${w.company}`} width="900" height="1125" loading="lazy" style={{ viewTransitionName: `w-${w.slug}` }} />
                <span className="t">
                  <b>{w.name}</b>
                  <span className="o"><span className="c">{catOf(w.cat).name}</span>, {w.company}, {w.city}. Jury score {scoreOf(w).total.toFixed(1)}</span>
                  <span className="q">{w.citation[0].toUpperCase() + w.citation.slice(1)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
