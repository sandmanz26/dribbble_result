import CREDITS from '../data/photos.json'

export default function Credits() {
  return (
    <>
      <div className="title-row"><div><h1>Photo credits</h1><p className="sub">Food photographs stand in for Kirana’s content. All from Open Images under CC BY 2.0, cropped square.</p></div></div>
      <section className="panel" style={{ marginTop: 24 }} aria-label="Credits">
        <ul className="rows">
          {CREDITS.map((c) => (
            <li key={c.file} style={{ display: 'grid', gridTemplateColumns: '48px minmax(0,1fr)', gap: 14, alignItems: 'center', padding: '10px 0' }}>
              <img className="thumb" src={c.file} alt="" width="48" height="48" loading="lazy" />
              <span style={{ overflowWrap: 'anywhere' }}>“{c.title || 'Untitled'}” by {c.author}, <a className="link" href={c.source} target="_blank" rel="noreferrer">source</a>, <a className="link" href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a></span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
