import { Link, useParams, Navigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import MapArt from '../map/MapArt.jsx'
import { Empty, TopBar } from '../ui/kit.jsx'
import { GroupCard } from '../ui/cards.jsx'
import { PLACES, place } from '../data/places.js'
import { GROUPS, TODAY, group } from '../data/groups.js'

const ALL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Screen question: is this a good place for me, and is anyone going?
export default function Place() {
  const { id } = useParams()
  const { s, set, notify } = useStore()
  if (!PLACES[id]) return <Navigate to="/" replace />
  const p = place(id)
  const saved = s.saved.includes(id)
  const going = Object.keys(GROUPS).map(group).filter((g) => g.place === id && g.start >= TODAY && !s.blocked.includes(g.host))
  const toggle = () => {
    set({ saved: saved ? s.saved.filter((x) => x !== id) : [...s.saved, id] })
    notify({ text: saved ? `${p.name} removed from saved` : `${p.name} saved. We will tell you when a group forms.` })
  }

  return (
    <div className="page detail">
      <TopBar title={p.name} sub={p.country} right={
        <button className="iconbtn" aria-pressed={saved} aria-label={saved ? 'Saved' : 'Save'} onClick={toggle}>
          <Icon name="save" size={22} stroke={saved ? 2.4 : 1.6} />
        </button>
      } />
      <div className="hero-map">
        <MapArt place={p} w={360} h={230} zoom={0.55} />
      </div>
      <p className="lede">{p.line}</p>

      <div className="facts">
        <div>
          <span className="meta small">A typical day</span>
          <strong className="num">${p.day[0]} to ${p.day[1]}</strong>
          <span className="meta small">per person, sample range</span>
        </div>
        <div>
          <span className="meta small">Weather</span>
          <strong>{p.weather.slice(p.weather.indexOf(':') + 1).trim()}</strong>
          <span className="meta small">In {p.weather.slice(0, p.weather.indexOf(':'))}</span>
        </div>
      </div>

      <section aria-labelledby="when-h">
        <div className="sechead"><h2 id="when-h">Best months</h2></div>
        <ol className="months" aria-label={`Best months: ${p.best.join(', ')}`}>
          {ALL.map((m) => <li key={m} className={p.best.includes(m) ? 'on' : ''}><span>{m[0]}</span><small>{m}</small></li>)}
        </ol>
        <div className="tags">{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
      </section>

      <section aria-labelledby="go-h">
        <div className="sechead"><h2 id="go-h">Groups going to {p.name}</h2><span className="meta num">{going.length}</span></div>
        {going.length ? (
          <div className="stack">{going.map((g) => <GroupCard key={g.id} g={g} wide />)}</div>
        ) : (
          <Empty title="No group is going yet" action={<Link className="btn primary small" to={`/groups/new?place=${id}`}>Start one</Link>}>
            Save {p.name} and we will tell you when a group forms.
          </Empty>
        )}
      </section>
    </div>
  )
}
