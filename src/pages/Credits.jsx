import { credits } from '../data/trips.js'

export default function Credits() {
  const list = credits()
  return (
    <div className="wrap">
      <header className="page-head"><h1>Photo credits</h1></header>
      <p className="muted" style={{ maxWidth: '60ch', marginBottom: 32 }}>Until the gang’s own photos are uploaded, this prototype uses openly licensed images from Wikimedia Commons. Thank you to these photographers.</p>
      <ul className="credits">
        {list.map(([key, c]) => (
          <li key={key}><a href={c.page} target="_blank" rel="noreferrer">{c.title.replace(/\.jpe?g$/i, '')}</a><br />{c.author || 'Unknown author'}, {c.license}</li>
        ))}
      </ul>
    </div>
  )
}
