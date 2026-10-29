import { Link } from 'react-router-dom'
import { AREAS, TYPE_NAME } from '../data/areas.js'
import * as I from '../ui/icons.js'

export default function Club() {
  return (
    <div className="home">
      <header className="top"><p className="club"><span className="mark" aria-hidden="true" />Bogstad, Oslo</p><h1>Oslo Golf Club</h1></header>
      <h2 className="sec">Areas <span className="count">{AREAS.length}</span></h2>
      <ul className="ex-list">
        {AREAS.map((a) => <li key={a.id}><Link className="ex-row" to={`/new?area=${a.id}`}><span><b>{a.name}</b><small>{TYPE_NAME[a.type]} · {a.photo ? `photo ${a.taken.toLowerCase()}` : 'no photo yet'}</small></span><I.Camera aria-hidden="true" /></Link></li>)}
      </ul>
      <h2 className="sec">Your preferences</h2>
      <dl className="prefs">
        <div><dt>Units</dt><dd>Metres</dd></div>
        <div><dt>Putter head width</dt><dd className="mono">12 cm</dd></div>
        <div><dt>Default group size</dt><dd className="mono">4</dd></div>
      </dl>
      <p className="fine">The gate drills use your putter width, so a gate is always 2 cm wider than the club that goes through it.</p>

      <h2 className="sec">Ready for more coaches</h2>
      <div className="block tree">
        <p><b>Version 1</b> is one coach at one club. Everything is already stored under a club and a coach, so a second coach, a second club or a subscription can be added later without moving any data.</p>
        <ul className="tree-list">
          <li><I.Club aria-hidden="true" /> Club: Oslo Golf Club<ul><li><I.People aria-hidden="true" /> Coach: you<ul><li><I.Image aria-hidden="true" /> Areas and their photos</li><li><I.Save aria-hidden="true" /> Saved setups</li></ul></li><li className="is-later"><I.Lock aria-hidden="true" /> More coaches, later</li></ul></li>
          <li><I.Link aria-hidden="true" /> Øvelsesbanken: exercises, shared by every coach</li>
        </ul>
      </div>
      <Link className="btn is-wide" to="/plan"><I.Build aria-hidden="true" /> How version 1 gets built</Link>
      <p className="fine center"><Link to="/credits" className="link">Photo credits</Link></p>
    </div>
  )
}
