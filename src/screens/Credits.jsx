import credits from '../data/credits.json'

export default function Credits() {
  return (
    <div className="page">
      <header className="title-row"><div><h1>Photo credits</h1><p>Product photographs stand in for the client’s own, which are under NDA. All are from Open Images (Flickr), licensed CC BY 2.0.</p></div></header>
      <section className="card is-flush">
        <ul className="rows">
          {credits.map((c) => (
            <li key={c.file} className="row-static">
              <img className="ph is-sm" src={`img/${c.file}`} alt="" />
              <span className="cell-2"><a className="link" href={c.source} target="_blank" rel="noreferrer">{c.title || 'Untitled'}</a><small>{c.author}, {c.license}</small></span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
