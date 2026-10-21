import { Link } from 'react-router-dom'
import Scene from './Scene.jsx'
import { Avatars } from './Crew.jsx'
import { fmtRange } from '../data/trips.js'

export default function TripCard({ trip }) {
  return (
    <Link to={`/trip/${trip.slug}`} className="postcard">
      <div className="pic">
        <Scene type={trip.scene} palette={trip.palette} seed={trip.slug} label={`Illustration of ${trip.place}`} />
        <span className="stamp">{trip.upcoming ? 'Upcoming' : trip.tag}</span>
      </div>
      <div className="body">
        <div className="meta"><span>{fmtRange(trip.start, trip.end)}, {trip.year}</span><span>· {trip.country}</span></div>
        <h3>{trip.title}</h3>
        <p>{trip.summary}</p>
        <div className="foot">
          <Avatars ids={trip.crew} />
          <span className="meta">{trip.posts.length} {trip.posts.length === 1 ? 'entry' : 'entries'} →</span>
        </div>
      </div>
    </Link>
  )
}
