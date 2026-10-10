import { Link } from 'react-router-dom'
import Icon from './Icon'
import {
  formatDate,
  formatTime,
  getBestImage,
  getCategory,
  getEventDate,
  getLocation,
  getVenue,
} from '../utils/eventHelpers'

function EventCard({ event }) {
  const venue = getVenue(event)
  const category = getCategory(event)
  const image = getBestImage(event.images, '3_2') || getBestImage(event.images)
  const status = event.dates?.status?.code

  return (
    <Link to={`/events/${event.id}`} className="event-card">
      <div className="event-card-img">
        {image ? <img src={image} alt={event.name} loading="lazy" /> : <div className="no-image">No Image</div>}
        <span className="badge badge-category">{category.segment}</span>
        {status && status !== 'onsale' && <span className={`badge badge-status ${status}`}>{status}</span>}
      </div>
      <div className="event-card-body">
        <p className="event-card-date">
          {formatDate(getEventDate(event))} &middot; {formatTime(event)}
        </p>
        <h3 className="event-card-title">{event.name}</h3>
        <p className="event-card-venue"><Icon name="pin" size={15} /> {venue?.name || 'Venue TBA'}</p>
        <p className="event-card-location">{getLocation(venue)}</p>
        {category.genre && <span className="genre-tag">{category.genre}</span>}
      </div>
    </Link>
  )
}

export default EventCard
