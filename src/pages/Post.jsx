import { Link, useParams } from 'react-router-dom'
import { CaretRight } from '@phosphor-icons/react'
import Photo from '../components/Photo.jsx'
import NotFound from './NotFound.jsx'
import { crewById } from '../data/crew.js'
import { getTrip, postPhoto, fmtDate } from '../data/trips.js'

export default function Post() {
  const { slug, postId } = useParams()
  const trip = getTrip(slug)
  const posts = trip ? [...trip.posts].sort((a, b) => a.date.localeCompare(b.date)) : []
  const i = posts.findIndex((p) => p.id === postId)
  if (i < 0) return <NotFound />
  const post = posts[i]
  const prev = posts[i - 1]
  const next = posts[i + 1]
  const author = crewById[post.author]

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/calendar">{trip.year} calendar</Link><CaretRight size={12} />
        <Link to={`/trip/${trip.slug}`}>{trip.title}</Link><CaretRight size={12} />
        <span aria-current="page">Day {i + 1}</span>
      </nav>
      <article className="article">
        <p className="meta">{trip.place}, {trip.country}</p>
        <h1>{post.title}</h1>
        <div className="byline">
          <img src={author.photo} alt="" />
          <span><b>{author.name}</b><br /><span className="meta">{fmtDate(post.date)}, {post.read} min read</span></span>
        </div>
        <Photo className="cover" src={postPhoto(trip, post, 1920)} alt={`${trip.place}`} eager />
        {post.body.map((para, n) => <p key={n}>{para}</p>)}
        <div className="pager">
          {prev
            ? <Link to={`/trip/${trip.slug}/${prev.id}`}><span className="meta">Previous post</span><b>{prev.title}</b></Link>
            : <Link to={`/trip/${trip.slug}`}><span className="meta">Back to</span><b>{trip.title}</b></Link>}
          {next
            ? <Link className="next" to={`/trip/${trip.slug}/${next.id}`}><span className="meta">Next post</span><b>{next.title}</b></Link>
            : <Link className="next" to="/subscribe"><span className="meta">That’s the last post</span><b>Subscribe</b></Link>}
        </div>
      </article>
    </div>
  )
}
