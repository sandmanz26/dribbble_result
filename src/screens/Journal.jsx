import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { MoodIcon } from '../ui/kit.jsx'
import { JOURNAL, fmtDay } from '../data/history.js'
import { MOODS } from '../data/library.js'

// The journal keeps one line a day, each with the weather it was written in.
export default function Journal() {
  const { s } = useStore()
  const all = [...s.journal, ...JOURNAL]
  return (
    <div className="page">
      <header className="pagehead">
        <div><h1 className="serif">Journal</h1><p className="meta">{all.length} entries since September</p></div>
        <Link to="/journal/new" className="iconbtn filled" aria-label="Write an entry"><Icon name="pen" /></Link>
      </header>
      {all.length === 0 ? (
        <div className="empty"><strong>Nothing written yet</strong><p>Finish a ritual and write one line about how it felt.</p><Link to="/journal/new" className="btn primary small">Write the first line</Link></div>
      ) : (
        <ol className="entries">
          {all.map((e) => (
            <li key={e.id} className={`entry m-${e.mood}`}>
              <div className="entry-top"><MoodIcon mood={e.mood} size={18} /><span className="meta small">{fmtDay(e.date)} · {MOODS.find((m) => m.id === e.mood)?.label}</span></div>
              <p className="entry-prompt meta small">{e.prompt}</p>
              <p className="entry-text serif">{e.text}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
