import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import MapArt from '../map/MapArt.jsx'
import { Faces } from './kit.jsx'
import { place } from '../data/places.js'
import { fmtRange, nights, untilStart, usd } from '../data/groups.js'
import { firstName } from '../data/people.js'
import { useStore } from '../store.jsx'

export function membersOf(g, s) {
  return s.requests[g.id] === 'member' && !g.members.includes('nadia') ? [...g.members, 'nadia'] : g.members
}

export function spots(g, s) {
  return g.cap - membersOf(g, s).length
}

export function GroupCard({ g, wide = false }) {
  const { s } = useStore()
  const p = place(g.place)
  const left = spots(g, s)
  const mine = membersOf(g, s).includes('nadia')
  const soon = untilStart(g)
  return (
    <Link to={`/g/${g.id}`} className={`gcard ${wide ? 'wide' : ''}`}>
      <div className="gcard-map">
        <MapArt place={p} w={wide ? 340 : 260} h={wide ? 150 : 120} />
        {g.idOnly && <span className="gcard-flag"><Icon name="verified" size={14} /> ID verified only</span>}
      </div>
      <div className="gcard-body">
        <strong>{g.title}</strong>
        <span className="meta">{fmtRange(g.start, g.end)} · {nights(g)} nights{soon <= 14 && soon >= 0 ? ` · in ${soon} days` : ''}</span>
        <div className="gcard-foot">
          <Faces ids={membersOf(g, s)} max={4} size={24} />
          <span className="meta">
            {mine ? 'You are in' : left <= 0 ? 'Full, waitlist open' : `${left} of ${g.cap} spots left`}
          </span>
          <span className="gcard-budget num">{usd(g.budget)}<small> pp</small></span>
        </div>
        <span className="meta small">Hosted by {firstName(g.host)} · {g.pace}</span>
      </div>
    </Link>
  )
}

export function PlaceTile({ id }) {
  const p = place(id)
  return (
    <Link to={`/d/${id}`} className="ptile">
      <MapArt place={p} w={170} h={120} label={false} />
      <div className="ptile-body">
        <strong>{p.name}</strong>
        <span className="meta">{p.country}</span>
        <span className="meta small num">${p.day[0]} to ${p.day[1]} a day</span>
      </div>
    </Link>
  )
}
