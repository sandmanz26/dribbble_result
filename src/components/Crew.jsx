import { crewById } from '../data/crew.js'

export function Avatars({ ids }) {
  return (
    <span className="avatars" aria-label={`With ${ids.map((i) => crewById[i].name).join(', ')}`}>
      {ids.map((i) => <img key={i} className="avatar" src={crewById[i].photo} alt="" loading="lazy" />)}
    </span>
  )
}
