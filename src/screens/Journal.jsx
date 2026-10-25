import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Print } from '../ui/Print.jsx'
import { HISTORY, JOURNAL, daySeed, fmtDay } from '../data/history.js'
import { MOODS } from '../data/library.js'

// The journal is the herbarium: one line a day, filed beside that day's print.
export default function Journal() {
  const { s } = useStore()
  const all = [...s.journal, ...JOURNAL]
  const herbOn = (date) => HISTORY.find((d) => d.date === date)?.herb
  return (
    <div className="page">
      <header className="pagehead">
        <div><h1>Journal</h1><p className="meta num">{all.length} lines since September</p></div>
        <Link to="/journal/new" className="iconbtn filled" aria-label="Write an entry"><Icon name="pen" /></Link>
      </header>
      {all.length === 0 ? (
        <div className="empty"><strong>Nothing written yet</strong><p>Finish a ritual and write one line about how it felt.</p><Link to="/journal/new" className="btn primary small">Write the first line</Link></div>
      ) : (
        <ol className="entries">
          {all.map((e) => (
            <li key={e.id}>
              <article className="entry">
                <Print mood={e.mood} herb={herbOn(e.date)} seed={daySeed(e.date)} size="chip" />
                <div className="entry-body">
                  <span className="entry-top">{fmtDay(e.date)} · {MOODS.find((m) => m.id === e.mood)?.label}</span>
                  <p className="entry-prompt">{e.prompt}</p>
                  <p className="entry-text">{e.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
