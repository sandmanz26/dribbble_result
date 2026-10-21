import { TopBar } from '../components/ui.jsx'
import { mediaCredits } from '../data/media.js'

export default function Credits() {
  const list = mediaCredits()
  return (
    <div className="screen">
      <TopBar title="Photo credits" />
      <p className="pad muted small" style={{ margin: '8px 0 16px' }}>Portfolio images in this prototype come from Unsplash (via Picsum) and Wikimedia Commons, used under their licences. Profile portraits are from randomuser.me.</p>
      <div className="list">
        {list.map((c) => (
          <a key={c.page} href={c.page} target="_blank" rel="noreferrer" className="list-item" style={{ alignItems: 'flex-start' }}>
            <span className="grow"><span style={{ fontWeight: 600 }}>{c.license === 'Unsplash License' ? `Photo by ${c.author}` : c.title.replace(/\.jpe?g$/i, '')}</span><br /><span className="small muted">{c.author || 'Unknown author'}, {c.license}</span></span>
          </a>
        ))}
      </div>
    </div>
  )
}
