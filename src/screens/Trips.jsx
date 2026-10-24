import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import RouteMap from '../map/RouteMap.jsx'
import { Empty, Faces } from '../ui/kit.jsx'
import { membersOf } from '../ui/cards.jsx'
import { GROUPS, fmtRange, group, untilStart } from '../data/groups.js'
import { place } from '../data/places.js'
import { costs, packing, poll } from '../data/plan.js'
import { firstName } from '../data/people.js'

// Plan Together: the trips you are going on, each with what it still needs from you.
export default function Trips() {
  const { s } = useStore()
  const trips = Object.keys(GROUPS).map(group).filter((g) => membersOf(g, s).includes('nadia')).sort((a, b) => a.start.localeCompare(b.start))

  return (
    <div className="page">
      <header className="pagehead"><div><h1>Trips</h1><p className="meta">Plans you are making together</p></div></header>
      {trips.length === 0 && <Empty title="No trips yet" action={<Link to="/" className="btn primary small">Find a group</Link>}>Join a group and its plan shows up here.</Empty>}
      <div className="stack">
        {trips.map((g) => {
          const kyoto = g.id === 'kyoto'
          const todo = kyoto ? todos(s) : []
          return (
            <Link key={g.id} to={kyoto ? '/trip/kyoto' : `/chats/${g.id}`} className="field">
              <div className="field-map"><RouteMap dest={place(g.place)} people={membersOf(g, s)} w={350} h={150} tone="dark" pad={22} /></div>
              <div className="field-body">
                <div className="field-row">
                  <div>
                    <div className="field-title">{g.title}</div>
                    <span className="meta small">{fmtRange(g.start, g.end)} · {place(g.place).name}</span>
                  </div>
                  <span className="countdown num">{untilStart(g)}<small>days</small></span>
                </div>
                <Faces ids={membersOf(g, s)} max={5} size={26} />
                {kyoto ? (
                  todo.length ? <span className="needs"><Icon name="info" size={16} /> {todo.length} {todo.length === 1 ? 'thing needs' : 'things need'} you</span> : <span className="needs ok"><Icon name="tick" size={16} /> Nothing waiting on you</span>
                ) : <span className="meta small">The host has not started the plan yet</span>}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// What the trip is waiting on from the demo user, in the order it matters.
export function todos(s) {
  const out = []
  const pl = poll(s.pollVotes)
  if (pl.waiting.includes('nadia')) out.push({ to: '/trip/kyoto/dates', text: 'Vote on the dates', sub: 'The poll closes Monday 26 Oct' })
  const c = costs(s.expenses)
  const owe = c.transfers.filter((t) => t.from === 'nadia')
  if (owe.length) out.push({ to: '/trip/kyoto/budget', text: `Settle ${owe.length === 1 ? 'one payment' : `${owe.length} payments`}`, sub: owe.map((t) => `$${t.v.toFixed(2)} to ${firstName(t.to)}`).join(', ') })
  const unvoted = ['i10', 'i11'].filter((id) => !s.itinVotes[id])
  if (unvoted.length) out.push({ to: '/trip/kyoto/plan', text: `${unvoted.length} plan ${unvoted.length === 1 ? 'idea' : 'ideas'} to vote on`, sub: 'Day 6, Thursday 19 Nov' })
  const pk = packing(s.claims, s.mine)
  if (pk.open) out.push({ to: '/trip/kyoto/packing', text: `${pk.open} shared ${pk.open === 1 ? 'item has' : 'items have'} no one bringing ${pk.open === 1 ? 'it' : 'them'}`, sub: 'Claim one so nothing is packed twice' })
  return out
}
