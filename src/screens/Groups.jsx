import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Empty, Seg } from '../ui/kit.jsx'
import { GroupCard, membersOf } from '../ui/cards.jsx'
import { GROUPS, fmtRange, group } from '../data/groups.js'
import { firstName } from '../data/people.js'
import { place } from '../data/places.js'
import { useState } from 'react'

// Connect: the groups you are in, the ones you asked to join, and the ones you host.
export default function Groups() {
  const { s } = useStore()
  const [view, setView] = useState('mine')
  const all = Object.keys(GROUPS).map(group)
  const mine = all.filter((g) => membersOf(g, s).includes('nadia'))
  const asked = all.filter((g) => ['pending', 'waitlist'].includes(s.requests[g.id]))
  const counts = { mine: mine.length, asked: asked.length, host: s.created.length }

  return (
    <div className="page">
      <header className="pagehead">
        <div><h1>Groups</h1><p className="meta">Who you travel with</p></div>
        <Link to="/groups/new" className="iconbtn" aria-label="Start a group"><Icon name="add" size={22} /></Link>
      </header>

      <Seg label="Show" value={view} onChange={setView} options={[
        ['mine', `Joined ${counts.mine}`], ['asked', `Asked ${counts.asked}`], ['host', `Hosting ${counts.host}`],
      ]} />

      {view === 'mine' && (mine.length ? <div className="stack">{mine.map((g) => <GroupCard key={g.id} g={g} wide />)}</div> : (
        <Empty title="You have not joined a group yet" action={<Link className="btn primary small" to="/">Find a group</Link>} />
      ))}

      {view === 'asked' && (asked.length ? (
        <ul className="rows">
          {asked.map((g) => (
            <li key={g.id}>
              <Link to={`/g/${g.id}`} className="row">
                <span className="row-main"><strong>{g.title}</strong><span className="meta small">{fmtRange(g.start, g.end)} · {s.requests[g.id] === 'waitlist' ? 'On the waitlist' : `Waiting for ${firstName(g.host)}`}</span></span>
                <Icon name="next" />
              </Link>
            </li>
          ))}
        </ul>
      ) : <Empty title="No open requests">When you ask to join a group, it waits here until the host answers.</Empty>)}

      {view === 'host' && (s.created.length ? (
        <ul className="rows">
          {s.created.map((g) => (
            <li key={g.id} className="row">
              <span className="row-main"><strong>{g.title}</strong><span className="meta small">{place(g.place).name} · {fmtRange(g.start, g.end)} · 1 of {g.cap} · no requests yet</span></span>
              <span className="pill">{g.idOnly ? 'ID only' : 'Verified'}</span>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title="You are not hosting a group" action={<Link className="btn primary small" to="/groups/new">Start a group</Link>}>
          Pick a place and dates. You choose who can join, and you approve every request.
        </Empty>
      ))}
    </div>
  )
}
