import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFetch, useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Empty, Failed, Skeleton } from '../ui/kit.jsx'
import { GroupCard, PlaceTile, spots } from '../ui/cards.jsx'
import { GROUPS, TODAY, group } from '../data/groups.js'
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
      <header className="pagehead">
        <div>
          <h1>Discover</h1>
          <p className="meta">Groups heading out, and places worth going</p>
        </div>
        <Link to="/notifications" className="iconbtn" aria-label={`Notifications, ${unread} unread`}>
          <Icon name="bell" size={22} />
          {unread > 0 && <i className="dot-count num">{unread}</i>}
        </Link>
      </header>

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
        {state === 'loading' && <Skeleton rows={2} tall={220} />}
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
