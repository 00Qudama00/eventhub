import { Link } from 'react-router-dom'
import Icon from './Icon'
import { formatDate } from '../utils/eventHelpers'

function RegisteredEventItem({ registration, completed, onCancel }) {
  const date = registration.date ? new Date(registration.date) : null

  return (
    <div className={`reg-item ${completed ? 'completed' : ''}`}>
      <div className="reg-img">
        {registration.image ? <img src={registration.image} alt={registration.name} /> : <div className="no-image">No Image</div>}
      </div>

      <div className="reg-info">
        <span className={`reg-status ${completed ? 'done' : 'upcoming'}`}>
          {completed ? 'Completed' : 'Upcoming'}
        </span>
        <Link to={`/events/${registration.id}`} className="reg-title">{registration.name}</Link>
        <p className="reg-line"><Icon name="calendar" size={15} /> {formatDate(date)} &middot; {registration.time}</p>
        <p className="reg-line"><Icon name="pin" size={15} /> {registration.venue}, {registration.location}</p>
        <p className="reg-meta">
          Booking ID: <strong>{registration.bookingId}</strong> &middot; Registered on{' '}
          {formatDate(new Date(registration.registeredAt), false)}
        </p>
      </div>

      <div className="reg-actions">
        <Link to={`/events/${registration.id}`} className="btn btn-outline btn-sm">Details</Link>
        {!completed && (
          <button className="btn btn-danger btn-sm" onClick={() => onCancel(registration)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

export default RegisteredEventItem
