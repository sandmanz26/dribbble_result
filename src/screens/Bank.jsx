import { Link, useParams } from 'react-router-dom'
import { EXERCISES, BANK, exerciseOf } from '../data/exercises.js'
import { AREAS, TYPE_NAME } from '../data/areas.js'
import * as I from '../ui/icons.js'

const photoFor = (t) => AREAS.find((a) => a.type === t)?.photo

export default function Bank() {
  const types = ['putt', 'chip', 'range', 'pitch', 'sim']
  return (
    <div className="home">
      <header className="top is-band"><p className="club"><I.Sync aria-hidden="true" /> {BANK.source}</p><h1>Exercises</h1><p className="band-sub">{EXERCISES.length} drills, each with the layout rules the AI follows.</p></header>
      <div className="note"><I.Link aria-hidden="true" /><p><b>{EXERCISES.length} exercises imported</b> from {BANK.source}, {BANK.imported}. The live link, where new exercises arrive by themselves, comes with version 2.</p></div>
      {types.map((t) => {
        const list = EXERCISES.filter((e) => e.type === t)
        return (
          <section key={t}>
            <h2 className="sec">{TYPE_NAME[t]} <span className="count">{list.length}</span></h2>
            <ul className="ex-list">{list.map((e) => <li key={e.id}><Link className="ex-row" to={`/bank/${e.id}`}>{photoFor(e.type) ? <img className="ex-ph" src={`img/${photoFor(e.type)}.webp`} alt="" /> : <span className="ex-ph is-none"><I.Camera aria-hidden="true" /></span>}<span><b>{e.name}</b><small>{e.minutes} min · {e.players} {e.players === '1' ? 'player' : 'players'} · {e.id}</small></span><I.Right aria-hidden="true" /></Link></li>)}</ul>
          </section>
        )
      })}
    </div>
  )
}

export function Exercise() {
  const { id } = useParams()
  const e = exerciseOf(id)
  if (!e) return <div className="pane"><h1>Not in the bank</h1><Link to="/bank" className="btn">Back</Link></div>
  const area = AREAS.find((a) => a.type === e.type)
  return (
    <div className="home">
      <header className="top"><Link to="/bank" className="crumb"><I.Back aria-hidden="true" /> Exercises</Link><h1>{e.name}</h1><p className="lede">{TYPE_NAME[e.type]} · {e.minutes} min · {e.players} {e.players === '1' ? 'player' : 'players'} · <span className="mono">{e.id}</span></p></header>
      <section className="block"><h2>Goal</h2><p>{e.goal}</p></section>
      <section className="block">
        <h2>Layout rules the AI follows</h2>
        <ul className="rules">{e.rules.map((r) => <li key={r}><I.Check aria-hidden="true" />{r}</li>)}</ul>
        <p className="fine">These come from the exercise in {BANK.source}. Change them there and the next setup uses them. When a rule cannot fit the area, the setup says so instead of bending it quietly.</p>
      </section>
      {e.layout ? <Link className="btn is-primary is-wide" to={`/new?area=${area.id}&exercise=${e.id}`}><I.Camera aria-hidden="true" /> Set it up on the {area.name.toLowerCase()}</Link>
        : <p className="note is-warn"><I.Warn aria-hidden="true" /> {e.needs || `Needs a photo of the ${area.name.toLowerCase()} first.`}</p>}
    </div>
  )
}
