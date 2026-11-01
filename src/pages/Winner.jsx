import { Link, useParams } from 'react-router-dom'
import { WINNERS, catOf, winnerOf, jurorOf, scoreOf, FINALISTS } from '../data/awards.js'
import { Citation, Scorecard, photo, Night, Mark } from '../ui.jsx'

export default function Winner() {
  const { slug } = useParams()
  const w = winnerOf(slug)
  if (!w) return <section className="page-head" style={{ paddingBottom: 120 }}><h1>No such winner</h1><p><Link className="link" to="/winners">All 2026 winners</Link></p></section>
  const c = catOf(w.cat)
  const r = scoreOf(w)
  const i = WINNERS.indexOf(w)
  const next = WINNERS[(i + 1) % WINNERS.length]
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/winners">Winners 2026</Link><span aria-hidden="true">/</span><Link to={`/categories/${c.slug}`}>{c.name}</Link></nav>
      <section className="winner-top" aria-label={`${w.name}, ${c.name}`}>
        <figure className="portrait" data-rise><img src={photo(w.photo)} alt={`${w.name}, ${w.role} at ${w.company}`} width="900" height="1125" style={{ viewTransitionName: `w-${w.slug}` }} /></figure>
        <div data-rise><Citation w={w} headingLevel={1} /></div>
      </section>

      <section className="section wrap" aria-labelledby="prod-h">
        <div className="two">
          <div>
            <h2 id="prod-h" className="head" data-rise>{w.company}</h2>
            <p className="lead" style={{ marginTop: 24, maxWidth: '34ch' }} data-rise>{w.product}</p>
          </div>
          <dl style={{ display: 'grid', gap: 6, alignContent: 'start' }} data-rise>
            {w.facts.map(([k, v]) => <div key={k} className="panel" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '18px 22px' }}><dt className="muted">{k}</dt><dd style={{ fontSize: 'var(--step-lead)', letterSpacing: '-0.02em' }}>{v}</dd></div>)}
            <p className="muted" style={{ marginTop: 8 }}>Figures as submitted by the entrant and checked by the jury against the evidence attached.</p>
          </dl>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="night-h">
        <h2 id="night-h" className="head" style={{ marginBottom: 32 }} data-rise>New York, 3 June 2026</h2>
        <Night />
      </section>

      <section className="section wrap" aria-labelledby="sc-h">
        <div className="two" style={{ alignItems: 'start' }}>
          <div>
            <h2 id="sc-h" className="head" data-rise>The scorecard</h2>
            <p className="lead" style={{ marginTop: 24, maxWidth: '32ch' }} data-rise>{r.jurors.length} jurors scored this entry, alone and before they met. Here is what each of them gave, criterion by criterion.</p>
            <ul className="people" style={{ marginTop: 32 }} data-rise>
              {r.jurors.map((j) => { const J = jurorOf(j); return <li key={j}><Link to={`/jury#${j}`}><img src={photo(J.photo)} alt="" width="64" height="80" loading="lazy" /><span><b>{J.name}</b><span>{J.org}</span></span></Link></li> })}
            </ul>
          </div>
          <div className="panel" data-rise>
            <h3 style={{ fontWeight: 600 }}>{c.name}, 2026</h3>
            <Scorecard w={w} />
            <p className="muted" style={{ marginTop: 16 }}>Finalists: {(FINALISTS[c.slug] || []).join(', ')}. Finalists’ own scores are shared with them privately.</p>
          </div>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="mark-h">
        <div className="two w48">
          <div>
            <h2 id="mark-h" className="head" data-rise>The winner’s mark</h2>
            <p style={{ marginTop: 20, maxWidth: '36ch' }} data-rise>{w.company} may use this mark on its site, in sales material and in the product, linked to this page so anyone can read the scorecard behind it.</p>
          </div>
          <div className="badges">
            <div className="badge" data-rise><Mark size={44} /><span><b>Winner, {c.name}</b>Tech Leader Awards 2026</span></div>
            <div className="badge dark" data-rise><Mark size={44} /><span><b>Winner, {c.name}</b>Tech Leader Awards 2026</span></div>
            <p className="muted" data-rise>Free to use, never sold. The mark always names the category and the year.</p>
          </div>
        </div>
        <p style={{ marginTop: 48, textAlign: 'right' }}><Link className="link" to={`/winners/${next.slug}`}>Next winner: {next.name}, {catOf(next.cat).name}</Link></p>
      </section>
    </>
  )
}
