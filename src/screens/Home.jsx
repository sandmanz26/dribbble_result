import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { AREAS, areaOf, TYPE_NAME } from '../data/areas.js'
import { exerciseOf, packList } from '../data/exercises.js'
import Overlay from '../ui/Overlay.jsx'
import * as I from '../ui/icons.js'

export default function Home() {
  const { s } = useStore()
  const ready = AREAS.filter((a) => a.photo).length
  return (
    <div className="home has-hero">
      <header className="hero">
        <img src="img/range-bay.webp" alt="" className="hero-bg" />
        <div className="hero-in">
          <p className="club"><span className="mark" aria-hidden="true" />Oslo Golf Club · Bogstad</p>
          <h1>Set up the next drill in a minute</h1>
          <p className="hero-sub">Photograph the area, pick the exercise, and the setup is drawn on the real photo.</p>
          <Link to="/new" className="btn is-primary is-wide"><I.CameraFill aria-hidden="true" /> New setup</Link>
          <p className="hero-meta"><span><b className="mono">{ready}</b> of {AREAS.length} areas photographed</span><span><b className="mono">{s.setups.length}</b> saved setups</span></p>
        </div>
      </header>

      <div className="sec-row"><h2 className="sec">Your areas</h2><Link to="/club" className="sec-link">Manage</Link></div>
      <ul className="areas" aria-label="Areas">
        {AREAS.map((a) => (
          <li key={a.id}>
            <Link to={`/new?area=${a.id}`} className={`area ${a.photo ? '' : 'is-empty'}`}>
              {a.photo ? <img src={`img/${a.photo}.webp`} alt="" /> : <span className="area-none"><I.Camera aria-hidden="true" /></span>}
              <span className="area-label"><b>{a.name}</b><small>{a.photo ? a.taken : 'Take the first photo'}</small></span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="sec-row"><h2 className="sec">Saved setups <span className="count">{s.setups.length}</span></h2></div>
      {s.setups.length ? (
        <ul className="saved">
          {s.setups.map((x) => {
            const a = areaOf(x.area); const e = exerciseOf(x.exercise)
            const markers = e.layout(a, x.variant).markers
            const pack = packList(markers)
            return (
              <li key={x.id}>
                <Link to={`/setup/${x.id}`} className="saved-card">
                  <span className="saved-photo"><Overlay area={a.id} photo={a.photo} cam={a.cam} markers={markers} overrides={x.overrides} numbers={false} /></span>
                  <span className="saved-body">
                    <span className="saved-head"><b>{e.name}</b><I.Right aria-hidden="true" /></span>
                    <small>{a.name} · {x.group || 'No group'} · {x.created}</small>
                    <span className="tags">
                      <span className="tag"><I.Flag aria-hidden="true" />{TYPE_NAME[a.type]}</span>
                      <span className="tag"><I.Time aria-hidden="true" />{e.minutes} min</span>
                      {pack.slice(0, 1).map(([k, n]) => <span key={k} className="tag"><I.Bag aria-hidden="true" />{n} {k.toLowerCase()}</span>)}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : <p className="empty">No saved setups yet. Make one, and it is here for the next session.</p>}
    </div>
  )
}
