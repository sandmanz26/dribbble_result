import { Link } from 'react-router-dom'
import { JURY, catOf } from '../data/awards.js'
import { photo } from '../ui.jsx'

export default function Jury() {
  return (
    <>
      <section className="page-head" aria-labelledby="ph">
        <h1 id="ph" data-rise>Six jurors, all named</h1>
        <p data-rise>Each juror declares their interests before judging opens. Where they have one, they step aside, and the category page says so.</p>
      </section>
      <section className="wrap" style={{ marginTop: 48, paddingBottom: 40 }} aria-label="The jury">
        {JURY.map((j) => (
          <article key={j.slug} id={j.slug} className="jury-row" aria-labelledby={`${j.slug}-h`}>
            <img src={photo(j.photo)} alt={`${j.name}`} width="900" height="1125" loading="lazy" data-rise />
            <div data-rise>
              <h2 id={`${j.slug}-h`}>{j.name}</h2>
              <p className="role">{j.role}, {j.org}</p>
              <p className="bio">{j.bio}</p>
            </div>
            <div className="declare" data-rise>
              <h3>Declared interests</h3>
              <p>{j.declares}</p>
              <h3 style={{ marginTop: 16 }}>Judges</h3>
              <div className="cats">
                {j.judges.map((c) => <Link key={c} to={`/categories/${c}`} className={j.recused.includes(c) ? 'off' : ''} aria-label={j.recused.includes(c) ? `${catOf(c).name}, recused` : catOf(c).name}>{catOf(c).name}</Link>)}
              </div>
              {j.recused.length > 0 && <p className="small muted" style={{ marginTop: 10 }}>Struck through: recused for a declared interest.</p>}
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
