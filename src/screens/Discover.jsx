import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFetch, useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Empty, Failed, Skeleton } from '../ui/kit.jsx'
import { GroupCard, PlaceTile, membersOf, spots } from '../ui/cards.jsx'
import { Wordmark } from '../ui/Logo.jsx'
import RouteMap from '../map/RouteMap.jsx'
import { place } from '../data/places.js'
import { todos } from './Trips.jsx'
import { GROUPS, TODAY, fmtRange, group, untilStart } from '../data/groups.js'
import { PLACES } from '../data/places.js'
import { NOTIFICATIONS } from '../data/trip.js'

const MONTHS = [['any', 'Any time'], ['2026-10', 'Oct'], ['2026-11', 'Nov'], ['2026-12', 'Dec'], ['2027-02', 'Feb'], ['2027-03', 'Mar'], ['2027-05', 'May']]

// Screen question: is there a group I could join, going somewhere I want, soon?
export default function Discover() {
  const { s } = useStore()
  const [state, retry] = useFetch()
  const [q, setQ] = useState('')
  const [month, setMonth] = useState('any')
  const [open, setOpen] = useState(false)

  const unread = NOTIFICATIONS.filter((n) => !s.read.includes(n.id)).length
  const kg = group('kyoto')
  const next = membersOf(kg, s).includes('nadia') ? kg : null
  const todo = todos(s)
  const needle = q.trim().toLowerCase()

  const groups = useMemo(() => Object.keys(GROUPS).map(group)
    .filter((g) => g.start >= TODAY)
    .filter((g) => !s.blocked.includes(g.host))
    .filter((g) => !s.prefs.idOnly || g.idOnly)
    .filter((g) => month === 'any' || g.start.startsWith(month) || g.end.startsWith(month))
    .filter((g) => !open || spots(g, s) > 0)
    .filter((g) => !needle || [g.title, PLACES[g.place].name, PLACES[g.place].country, ...PLACES[g.place].tags].some((x) => x.toLowerCase().includes(needle)))
    .sort((a, b) => a.start.localeCompare(b.start)), [s, month, open, needle])

  const places = Object.keys(PLACES).filter((id) => !needle || [PLACES[id].name, PLACES[id].country, ...PLACES[id].tags].some((x) => x.toLowerCase().includes(needle)))

  return (
    <div className="page">
      <header className="homehead">
        <Wordmark size={28} />
        <Link to="/notifications" className="iconbtn" aria-label={`Notifications, ${unread} unread`}>
          <Icon name="bell" size={22} />
          {unread > 0 && <i className="dot-count num">{unread}</i>}
        </Link>
      </header>
      <h1 className="greet">Where to next, Nadia?</h1>

      {next && (
        <Link to="/trip/kyoto" className="field" aria-label={`Your next trip: ${next.title}, in ${untilStart(next)} days`}>
          <div className="field-map">
            <RouteMap dest={place(next.place)} people={membersOf(next, s)} w={350} h={168} tone="dark" pad={24} />
          </div>
          <div className="field-body">
            <div className="field-row">
              <div>
                <span className="meta small">Your next trip</span>
                <div className="field-title">{next.title}</div>
                <span className="meta small">{fmtRange(next.start, next.end)} · {membersOf(next, s).length} travellers, {membersOf(next, s).length} home cities</span>
              </div>
              <span className="countdown num">{untilStart(next)}<small>days</small></span>
            </div>
            {todo.length > 0 && <span className="needs"><Icon name="info" size={16} /> {todo.length} {todo.length === 1 ? 'thing needs' : 'things need'} you before you go</span>}
          </div>
        </Link>
      )}

      <label className="search">
        <Icon name="search" size={18} />
        <span className="sr-only">Search places, groups or interests</span>
        <input type="search" placeholder="Kyoto, hiking, food..." value={q} onChange={(e) => setQ(e.target.value)} />
      </label>

      <div className="chips" role="group" aria-label="When">
        {MONTHS.map(([v, l]) => (
          <button key={v} className="chip" aria-pressed={month === v} onClick={() => setMonth(v)}>{l}</button>
        ))}
        <button className="chip" aria-pressed={open} onClick={() => setOpen(!open)}>Has spots</button>
      </div>

      <section aria-labelledby="g-h">
        <div className="sechead">
          <h2 id="g-h">Groups going</h2>
          {state === 'ready' && <span className="meta num">{groups.length}</span>}
        </div>
        {state === 'loading' && <div className="loader" aria-busy="true" aria-label="Loading groups"><i /><i /><i /></div>}
        {state === 'error' && <Failed what="Groups" onRetry={retry} />}
        {state === 'ready' && (groups.length ? (
          <div className="rail">
            {groups.map((g) => <GroupCard key={g.id} g={g} />)}
          </div>
        ) : (
          <Empty title="No group matches yet">
            {s.prefs.idOnly ? 'You are only seeing ID-verified groups. ' : ''}Try another month, or start a group and others can join you.
          </Empty>
        ))}
        {state === 'ready' && (
          <Link to="/groups/new" className="startrow">
            <Icon name="add" />
            <span><strong>Start a group</strong><small>Pick a place and dates, choose who can join</small></span>
            <Icon name="next" />
          </Link>
        )}
      </section>

      <section aria-labelledby="p-h">
        <div className="sechead">
          <h2 id="p-h">Places</h2>
        </div>
        {state === 'loading' && <Skeleton rows={2} tall={160} />}
        {state === 'ready' && (places.length ? (
          <div className="pgrid">{places.map((id) => <PlaceTile key={id} id={id} />)}</div>
        ) : <Empty title={`Nothing for “${q}”`}>Search a city, a country or something you like doing.</Empty>)}
      </section>
    </div>
  )
}
