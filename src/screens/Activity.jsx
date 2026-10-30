import { useState } from 'react'
import { Lock1 } from 'iconsax-react'
import { useStore } from '../store.jsx'
import { TopBar, Chip, Empty, fmtDate, fmtTime } from '../ui/kit.jsx'

const KINDS = ['All', 'Revealed', 'Edited', 'Exported', 'Viewed']

// Who looked at what. Logging that a record was opened, not only that someone signed in,
// is what makes a student database defensible when a parent asks.
export default function Activity() {
  const { state, user } = useStore()
  const [kind, setKind] = useState('All')
  if (user.role !== 'registrar') {
    return <div className="page"><TopBar title="Access log" back="/more" /><Empty icon={<Lock1 size={28} color="currentColor" />} title="Office only">The access log is kept by the registrar.</Empty></div>
  }
  const rows = state.audit.filter((a) => kind === 'All' || a.action === kind)
  let last = ''
  return (
    <div className="page">
      <TopBar title="Access log" back="/more" />
      <p className="quiet small pad">Every view, reveal, edit and export, with who and when. Kept for 7 years.</p>
      <div className="chips-wrap scroll-x">{KINDS.map((k) => <Chip key={k} on={kind === k} onClick={() => setKind(k)}>{k}</Chip>)}</div>
      {rows.length ? (
        <ol className="timeline">
          {rows.map((a, i) => {
            const day = fmtDate(a.at, { weekday: 'short', day: 'numeric', month: 'short' })
            const head = day !== last ? (last = day) : null
            return (
              <li key={i} className={head ? 'has-day' : ''}>
                {head && <h3>{head}</h3>}
                <b>{a.who}</b> <span>{a.action.toLowerCase()}</span> <b>{a.target}</b>
                <small>{a.detail}</small>
                <time>{fmtTime(a.at)}</time>
              </li>
            )
          })}
        </ol>
      ) : <Empty title="Nothing here yet">No {kind.toLowerCase()} entries.</Empty>}
    </div>
  )
}
