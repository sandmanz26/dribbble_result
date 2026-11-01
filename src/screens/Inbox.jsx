import { Link } from 'react-router-dom'
import { inbox } from '../data/inbox.js'
import { useStore } from '../store.jsx'
import { Avatar } from '../ui/kit.jsx'

export default function Inbox() {
  const { s } = useStore()
  const items = [...inbox]
  if (s.as === 'crew' && s.challenge === 'offer') {
    items.unshift({ id: 'ch', from: 'milo', when: '05:30', title: 'Halfway House wants to book you', body: 'You are on 2nd pencil. Decide whether to challenge Paper Moon.', to: '/avails', urgent: true })
  }
  if (s.as === 'production') {
    items.unshift({ id: 'g', from: 'mara', when: '05:20', title: '4 gaffers replied to Northlight', body: 'Two are free for all 30 days.', to: '/crew/gaffer', urgent: true })
  }
  return (
    <div className="page">
      <header className="top"><h1 className="h1">Inbox</h1></header>
      <ul className="inbox">
        {items.map((m) => (
          <li key={m.id}>
            <Link to={m.to} className={`msg${m.urgent ? ' msg--urgent' : ''}`}>
              <Avatar id={m.from} size={42} />
              <div className="msg__body">
                <p className="msg__title">{m.title}</p>
                <p className="small muted">{m.body}</p>
              </div>
              <span className="msg__when small mono">{m.when}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
