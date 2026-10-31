import { Link, useParams } from 'react-router-dom'
import { CATEGORIES, GROUPS, JURY, FINALISTS, catOf, winnerFor, dateOf, fmtDate } from '../data/awards.js'
import { Citation, photo, Ribbon, Night } from '../ui.jsx'

export default function Category() {
  const { slug } = useParams()
  const c = catOf(slug)
  if (!c) return <section className="page-head" style={{ paddingBottom: 120 }}><h1>No such category</h1><p><Link className="link" to="/categories">All categories</Link></p></section>
  const g = GROUPS.find((x) => x.key === c.group)
  const w = winnerFor(c.slug)
  const jurors = JURY.filter((j) => j.judges.includes(c.slug))
  const i = CATEGORIES.indexOf(c)
  const next = CATEGORIES[(i + 1) % CATEGORIES.length]
  const prev = CATEGORIES[(i - 1 + CATEGORIES.length) % CATEGORIES.length]
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/categories">Categories</Link><span aria-hidden="true">/</span><Link to={`/categories#${g.key}`}>{g.name}</Link></nav>
      <section className="page-head" style={{ paddingTop: 40 }} aria-labelledby="ph">
        <h1 id="ph" data-rise>{c.name}</h1>
        <p data-rise>{c.for}</p>
      </section>

      <section className="wrap" style={{ marginTop: 56 }}>
        <div className="two">
          <div className="panel" data-rise>
            <h2>How it is scored</h2>
            <p className="muted" style={{ marginTop: 8 }}>Every juror scores each criterion out of 10. The weights decide how much each counts.</p>
            <ul className="weights">
              {c.criteria.map(([name, wt]) => <li key={name}><span>{name}</span><span>{wt}%</span><span className="barline" aria-hidden="true"><span style={{ width: `${wt * 2.5}%` }} /></span></li>)}
            </ul>
          </div>
          <div className="panel" data-rise>
            <h2>Who judges it</h2>
            <ul className="people">
              {jurors.map((j) => {
                const off = j.recused.includes(c.slug)
                return (
                  <li key={j.slug}><Link to={`/jury#${j.slug}`}>
                    <img src={photo(j.photo)} alt="" width="64" height="80" loading="lazy" />
                    <span><b>{j.name}</b><span>{j.org}</span>{off && <span className="recused">Recused from this category</span>}</span>
                  </Link></li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="last-h">
        <div className="two" style={{ alignItems: 'start' }}>
          <div>
            <h2 id="last-h" className="head" data-rise>{w ? 'Last year' : 'New for 2027'}</h2>
            {w && <Link to={`/winners/${w.slug}`} data-rise style={{ display: 'block', marginTop: 28, width: '46%' }}><img src={photo(w.photo)} alt={`${w.name}, ${w.company}`} width="900" height="1125" loading="lazy" style={{ aspectRatio: '4 / 5', objectFit: 'cover', filter: 'grayscale(1)', width: '100%' }} /></Link>}
            {w ? (
              <>
                <p className="lead" style={{ marginTop: 24 }} data-rise>{FINALISTS[c.slug]?.length || 4} finalists, one winner. Turn the card to see how it was scored.</p>
                <ol style={{ marginTop: 28, display: 'grid', gap: 10 }} data-rise>
                  {(FINALISTS[c.slug] || []).map((f, k) => <li key={f} style={{ display: 'flex', justifyContent: 'space-between', background: k === 0 ? 'var(--paper)' : 'var(--surface)', padding: '14px 18px' }}><span>{f}</span><span className="muted">{k === 0 ? 'Winner' : 'Finalist'}</span></li>)}
                </ol>
              </>
            ) : <p className="lead" style={{ marginTop: 24, maxWidth: '34ch' }} data-rise>This award runs for the first time in 2027. Its criteria were set with the jury and published before entries opened.</p>}
          </div>
          <div data-rise>{w ? <Citation w={w} /> : (
            <div className="panel" style={{ padding: 0 }}><Ribbon /><img src={photo('crystal')} alt="Two crystal award trophies" width="1024" height="796" loading="lazy" style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', filter: 'grayscale(1)' }} /><div style={{ padding: 32 }}><p className="cat" style={{ fontWeight: 600 }}>{c.name}, 2027</p><p className="lead" style={{ marginTop: 20 }}>The first winner is named on {fmtDate(dateOf('ceremony'))}. Their scorecard will be printed here the same night.</p></div></div>
          )}</div>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="night-h">
        <h2 id="night-h" className="head" style={{ marginBottom: 32 }} data-rise>Named on {fmtDate(dateOf('ceremony'))}</h2>
        <Night />
      </section>

      <section className="section wrap" aria-labelledby="ent-h">
        <div className="panel enter-row">
          <div><h2 id="ent-h">Enter {c.name}</h2><p className="muted" style={{ marginTop: 6 }}>From $95, refunded if your product is not eligible. Entries close {fmtDate(dateOf('close'))}.</p></div>
          <Link to={`/enter?cat=${c.slug}`} className="btn">Start an entry</Link>
        </div>
        <p style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}><Link className="link" to={`/categories/${prev.slug}`}>Previous: {prev.name}</Link><Link className="link" to={`/categories/${next.slug}`}>Next: {next.name}</Link></p>
      </section>
    </>
  )
}
