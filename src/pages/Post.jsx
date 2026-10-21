import { Link, useParams } from 'react-router-dom'
import Scene from '../components/Scene.jsx'
import { Avatar } from '../components/Crew.jsx'
import NotFound from './NotFound.jsx'
import { crewById } from '../data/crew.js'
import { getTrip, fmtDate } from '../data/trips.js'

export default function Post() {
  const { slug, postId } = useParams()
  const trip = getTrip(slug)
  const posts = trip ? [...trip.posts].sort((a, b) => a.date.localeCompare(b.date)) : []
  const i = posts.findIndex((p) => p.id === postId)
  if (i < 0) return <NotFound />
  const post = posts[i]; const prev = posts[i - 1]; const next = posts[i + 1]
  const author = crewById[post.author]

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to={`/trip/${trip.slug}`}>{trip.title}</Link> / Day {i + 1}</nav>
      <article className="article">
        <span className="eyebrow">{trip.place}, {trip.country}</span>
        <h1>{post.title}</h1>
        <div className="byline">
          <Avatar id={author.id} large />
          <div><b>{author.name}</b> · {author.role}<br /><span className="meta">{fmtDate(post.date)} · {post.read} min read</span></div>
        </div>
        <div className="cover"><Scene type={post.scene} palette={trip.palette} seed={post.id} label={`Illustration for ${post.title}`} /></div>
        {post.body.map((para, n) => <p key={n}>{para}</p>)}
        <div className="pager">
          {prev ? <Link to={`/trip/${trip.slug}/${prev.id}`}><small>← Earlier</small><strong>{prev.title}</strong></Link> : <Link to={`/trip/${trip.slug}`}><small>← Back</small><strong>All entries from {trip.place}</strong></Link>}
          {next ? <Link className="next" to={`/trip/${trip.slug}/${next.id}`}><small>Next entry →</small><strong>{next.title}</strong></Link> : <Link className="next" to="/subscribe"><small>Want more?</small><strong>Subscribe for the next trip →</strong></Link>}
        </div>
      </article>
    </div>
  )
}
