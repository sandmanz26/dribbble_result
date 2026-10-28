import { Link } from 'react-router-dom'
import credits from '../data/credits.json'
import * as I from '../ui/icons.js'

// Photographs are from Open Images (Flickr), CC BY 2.0. Each is credited to its author here.
export default function Credits() {
  return (
    <div className="credits">
      <div className="order-top"><Link className="icon-btn" to="/" aria-label="Back"><I.Back size={22} /></Link><span>Photo credits</span></div>
      <p className="lede">Food photographs from the Open Images dataset, published on Flickr under Creative Commons Attribution 2.0. They stand in for the shop&apos;s own photos.</p>
      <ul>{credits.map((c) => <li key={c.file}><img src={`food/${c.file}`} alt="" /><span><b>{c.title || 'Untitled'}</b><span>{c.author} · CC BY 2.0</span></span></li>)}</ul>
    </div>
  )
}
