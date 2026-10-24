import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Avatar, Empty, Seg, Trust } from '../ui/kit.jsx'
import { membersOf } from '../ui/cards.jsx'
import { CHATS } from '../data/trip.js'
import { GROUPS, group } from '../data/groups.js'
import { PEOPLE } from '../data/people.js'
import { place } from '../data/places.js'

// Chats. Messages from people outside your groups who are not fully verified wait in
// Requests, unread and without read receipts, until you accept them.
export default function Chats() {
  const { s, messagesFor } = useStore()
  const [view, setView] = useState('all')

  const joined = Object.keys(GROUPS).map(group).filter((g) => membersOf(g, s).includes('nadia'))
  const groupChats = joined.map((g) => ({ id: g.id, title: g.title, sub: place(g.place).name, kind: 'group', last: messagesFor(g.id).at(-1) }))
  const direct = Object.entries(CHATS).filter(([, c]) => c.kind === 'direct' || (c.kind === 'request' && s.accepted.includes(c.with)))
    .filter(([, c]) => !s.blocked.includes(c.with))
    .map(([id, c]) => ({ id, title: PEOPLE[c.with].name, person: c.with, kind: 'direct', last: messagesFor(id).at(-1) }))
  const requests = Object.entries(CHATS).filter(([, c]) => c.kind === 'request' && !s.accepted.includes(c.with) && !s.blocked.includes(c.with))
    .map(([id, c]) => ({ id, title: PEOPLE[c.with].name, person: c.with, kind: 'request', last: messagesFor(id).at(-1) }))

  const list = view === 'requests' ? requests : [...groupChats, ...direct]

  return (
    <div className="page">
      <header className="pagehead"><div><h1>Chats</h1><p className="meta">Groups and people you travel with</p></div></header>
      <Seg label="Show" value={view} onChange={setView} options={[['all', 'Chats'], ['requests', `Requests ${requests.length}`]]} />
      {view === 'requests' && requests.length > 0 && (
        <p className="note"><Icon name="shield" /> These people are not in your groups and have not verified everything. They cannot see that you read their message.</p>
      )}
      {list.length === 0 ? (
        <Empty title={view === 'requests' ? 'No message requests' : 'No chats yet'}>{view === 'requests' ? 'Messages from people outside your groups land here first.' : 'Join a group to start talking.'}</Empty>
      ) : (
        <ul className="rows chats">
          {list.map((c) => (
            <li key={c.id}>
              <Link to={`/chats/${c.id}`} className="row">
                {c.person ? <Avatar id={c.person} size={46} /> : <span className="group-mark" aria-hidden="true"><Icon name="groups" size={22} /></span>}
                <span className="row-main">
                  <strong>{c.title}{c.person && <Trust id={c.person} compact />}</strong>
                  <span className="meta small clamp">{c.last ? `${c.last.from === 'nadia' ? 'You: ' : c.kind === 'group' ? `${PEOPLE[c.last.from]?.name.split(' ')[0]}: ` : ''}${c.last.text}` : `You joined. Say hello to the group.`}</span>
                </span>
                <span className="meta small">{c.last?.at.replace('Today ', '') || ''}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
