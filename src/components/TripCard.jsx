import { Link } from 'react-router-dom'
import Photo from './Photo.jsx'
import { Avatars } from './Crew.jsx'
import { photo, fmtRange } from '../data/trips.js'

export default function TripCard({ trip, layout }) {
  return (
    <Link to={`/trip/${trip.slug}`} className={`trip-card ${layout === 'row' ? 'row' : ''}`}>
      <Photo src={photo(trip.slug, 1280)} alt={`${trip.place}, ${trip.country}`} />
      <div style={{ display: 'grid', gap: 12 }}>
        <span className="meta">{fmtRange(trip.start, trip.end)}, {trip.year} in {trip.country}</span>
        <h3>{trip.title}</h3>
        <p>{trip.summary}</p>
        <Avatars ids={trip.crew} />
      </div>
    </Link>
  )
}
