import { crewById } from '../data/crew.js'

export function Avatar({ id, large }) {
  const c = crewById[id]
  return <span className={`avatar ${large ? 'lg' : ''}`} style={{ '--c': c.color }} title={c.name}>{c.name[0]}</span>
}

export function Avatars({ ids }) {
  return <span className="avatars" aria-label={`With ${ids.map((i) => crewById[i].name).join(', ')}`}>{ids.map((i) => <Avatar key={i} id={i} />)}</span>
}
