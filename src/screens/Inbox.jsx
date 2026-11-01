import { Link } from 'react-router-dom'
import { inbox } from '../data/inbox.js'
import { people } from '../data/people.js'
import { useStore } from '../store.jsx'
import { Avatar } from '../ui/kit.jsx'

const kindLabel = { callsheet: 'Call sheet', message: 'Message', offer: 'Pencil', call: 'Call', wrap: 'Timesheet', challenge: 'Challenge', replies: 'Replies' }

export default function Inbox() {
  const { s } = useStore()
  const items = [...inbox]
  if (s.as === 'crew' && s.challenge === 'offer') {
    items.unshift({ id: 'ch', kind: 'challenge', from: 'milo', when: '05:30', title: 'Halfway House wants to book you', body: 'You are their 2nd pencil. Decide whether to challenge Paper Moon.', to: '/avails', urgent: true })
  }
  if (s.as === 'production') {
    items.unshift({ id: 'g', kind: 'replies', from: 'mara', when: '05:20', title: '4 gaffers replied to Northlight', body: 'Two are free for all 30 days.', to: '/crew/gaffer', urgent: true })
  }
  return (
    <div className="page">
      <header className="mast mast--big"><h1 className="display">Inbox</h1></header>
      <ol className="rows">
        {items.map((m) => (
          <li key={m.id}>
            <Link to={m.to} className={`msg${m.urgent ? ' is-urgent' : ''}`}>
              <span className="msg__when mono">{m.when}</span>
              <span className="msg__main">
                <span className="msg__kind mono">{kindLabel[m.kind]} / {people[m.from].name.split(' ')[0]}</span>
                <span className="msg__title">{m.title}</span>
                <span className="row__s">{m.body}</span>
              </span>
              <Avatar id={m.from} size={36} />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
