import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { AREAS, areaOf, TYPE_NAME } from '../data/areas.js'
import { exerciseOf } from '../data/exercises.js'
import Overlay from '../ui/Overlay.jsx'
import * as I from '../ui/icons.js'

export default function Home() {
  const { s } = useStore()
  return (
    <div className="home">
      <header className="top">
        <p className="club"><span className="mark" aria-hidden="true" />Oslo Golf Club</p>
        <h1>Setups</h1>
      </header>
      <Link to="/new" className="cta"><I.Camera aria-hidden="true" /><span><b>New setup</b><small>Photo, exercise, done</small></span><I.Right aria-hidden="true" /></Link>

      <h2 className="sec">Your areas</h2>
      <ul className="areas">
        {AREAS.map((a) => (
          <li key={a.id}>
            <Link to={`/new?area=${a.id}`} className="area">
              {a.photo ? <img src={`img/${a.photo}.webp`} alt="" /> : <span className="area-none"><I.Camera aria-hidden="true" /></span>}
              <span className="area-name">{a.name}</span>
              <span className="area-meta">{a.photo ? `Photo ${a.taken.toLowerCase()}` : 'No photo yet'}</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="sec">Saved setups <span className="count">{s.setups.length}</span></h2>
      {s.setups.length ? (
        <ul className="saved">
          {s.setups.map((x) => {
            const a = areaOf(x.area); const e = exerciseOf(x.exercise)
            return (
              <li key={x.id}>
                <Link to={`/setup/${x.id}`} className="saved-row">
                  <span className="thumb"><Overlay area={a.id} photo={a.photo} cam={a.cam} markers={e.layout(a, x.variant).markers} overrides={x.overrides} numbers={false} /></span>
                  <span className="saved-text"><b>{e.name}</b><small>{a.name} · {TYPE_NAME[a.type]}</small><small>{x.group ? `${x.group} · ` : ''}{x.created}</small></span>
                  <I.Right aria-hidden="true" />
                </Link>
              </li>
            )
          })}
        </ul>
      ) : <p className="empty">No saved setups yet. Make one, and it is here for the next session.</p>}
    </div>
  )
}
