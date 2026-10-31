import CREDITS from '../data/photos.json'

export default function Credits() {
  return (
    <>
      <section className="page-head" aria-labelledby="ph">
        <h1 id="ph" data-rise>Photo credits</h1>
        <p data-rise>All photographs are from Open Images, licensed CC BY 2.0. Portraits are placeholders: the people shown are not the people named on this site, and every name, company and score is a sample.</p>
      </section>
      <section className="wrap" style={{ marginTop: 48, paddingBottom: 40 }} aria-label="Credits">
        <ul className="credits">
          {CREDITS.map((c) => (
            <li key={c.file} className="panel" data-rise>
              <img src={c.file} alt="" width="160" height="200" loading="lazy" />
              <span>“{c.title || 'Untitled'}” by {c.author}, <a className="link" href={c.source} rel="noreferrer" target="_blank">source</a>, <a className="link" href="https://creativecommons.org/licenses/by/2.0/" rel="noreferrer" target="_blank">CC BY 2.0</a>. Cropped and shown in black and white.</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
