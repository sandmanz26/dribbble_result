import { Link } from 'react-router-dom'
import PHOTOS from '../data/photos.json'

export default function Credits() {
  return (
    <main className="lp credits-page" id="content">
      <Link to="/" className="crumb">Back to Bridge</Link>
      <h1 className="lp-h2">Photo credits</h1>
      <p className="lp-lead">Real photographs from the Open Images set on Flickr, licensed CC BY 2.0. They show research and study in general, not this product’s users.</p>
      <ul className="credit-list">
        {PHOTOS.map((p) => <li key={p.file}><img src={`photos/${p.file}.webp`} alt="" width="96" height="72" loading="lazy" /><span><b>{p.title}</b><small>{p.author} · <a href={p.src} target="_blank" rel="noreferrer">Flickr</a> · {p.lic}</small></span></li>)}
      </ul>
    </main>
  )
}
