import { Link } from 'react-router-dom'
import credits from '../data/credits.json'
import * as I from '../ui/icons.js'

export default function Credits() {
  return (
    <div className="home">
      <header className="top"><Link to="/club" className="crumb"><I.Back aria-hidden="true" /> Club</Link><h1>Photo credits</h1><p className="lede">Sample photos stand in for Oslo Golf Club’s own. All from Open Images (Flickr), CC BY 2.0.</p></header>
      <ul className="ex-list">{credits.map((c) => <li key={c.file} className="ex-row is-static"><img className="credit-ph" src={`img/${c.file}`} alt="" /><span><a className="link" href={c.source} target="_blank" rel="noreferrer">{c.title}</a><small>{c.author}</small></span></li>)}</ul>
    </div>
  )
}
