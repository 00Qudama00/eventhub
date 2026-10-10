import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import Icon from '../components/Icon'
import {
  clearEventDetails,
  fetchEventDetails,
  selectEventDetails,
} from '../features/events/eventsSlice'
import {
  formatDate,
  formatTime,
  getBestImage,
  getCategory,
  getEventDate,
  getLocation,
  getPriceRange,
  getVenue,
  statusLabels,
} from '../utils/eventHelpers'

function InfoItem({ icon, label, children }) {
  return (
    <div className="info-item">
      <span className="info-icon"><Icon name={icon} size={17} /></span>
      <div>
        <p className="info-label">{label}</p>
        <div className="info-value">{children}</div>
      </div>
    </div>
  )
}

function EventDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { event, status, error } = useSelector(selectEventDetails)

  useEffect(() => {
    dispatch(fetchEventDetails(id))
    return () => dispatch(clearEventDetails())
  }, [id, dispatch])

  if (status === 'loading' || status === 'idle') return <Loader text="Loading event details..." />

  if (status === 'failed') {
    return (
      <div className="container">
        <ErrorMessage message={error} onRetry={() => dispatch(fetchEventDetails(id))} />
      </div>
    )
  }

  const venue = getVenue(event)
  const category = getCategory(event)
  const date = getEventDate(event)
  const price = getPriceRange(event)
  const statusCode = event.dates?.status?.code
  const isPast = date && date < new Date()
  const banner = getBestImage(event.images, '16_9')
  const attractions = event._embedded?.attractions || []
  const sales = event.sales?.public
  const address = [venue?.address?.line1, venue?.city?.name, venue?.postalCode].filter(Boolean).join(', ')
  const mapLink = venue?.location
    ? `https://www.google.com/maps?q=${venue.location.latitude},${venue.location.longitude}`
    : null

  return (
    <div className="container details-page">
      <button className="back-link" onClick={() => navigate(-1)}><Icon name="arrowLeft" size={16} /> Back</button>

      <div className="details-banner">
        {banner ? <img src={banner} alt={event.name} /> : <div className="no-image">No Image</div>}
      </div>

      <div className="details-layout">
        <div className="details-main">
          <div className="details-tags">
            <span className="genre-tag">{category.segment}</span>
            {category.genre && <span className="genre-tag">{category.genre}</span>}
            {category.subGenre && <span className="genre-tag">{category.subGenre}</span>}
            {statusCode && (
              <span className={`status-pill ${statusCode}`}>{statusLabels[statusCode] || statusCode}</span>
            )}
          </div>
          <h1 className="details-title">{event.name}</h1>

          <div className="info-grid">
            <InfoItem icon="calendar" label="Date">{formatDate(date)}</InfoItem>
            <InfoItem icon="clock" label="Time">
              {formatTime(event)}
              {event.dates?.timezone && <small> ({event.dates.timezone})</small>}
            </InfoItem>
            <InfoItem icon="venue" label="Venue">{venue?.name || 'Venue TBA'}</InfoItem>
            <InfoItem icon="pin" label="Location">
              {getLocation(venue)}
              {address && <small className="block">{address}</small>}
              {mapLink && (
                <a href={mapLink} target="_blank" rel="noreferrer" className="small-link">View on map</a>
              )}
            </InfoItem>
            {price && <InfoItem icon="tag" label="Price Range">{price}</InfoItem>}
            {sales?.startDateTime && (
              <InfoItem icon="ticket" label="Public Sale">
                {formatDate(new Date(sales.startDateTime), false)}
                {sales.endDateTime && ` - ${formatDate(new Date(sales.endDateTime), false)}`}
              </InfoItem>
            )}
          </div>

          {event.info && (
            <section className="details-section">
              <h3>About this event</h3>
              <p>{event.info}</p>
            </section>
          )}

          {event.pleaseNote && (
            <section className="details-section note">
              <h3>Please note</h3>
              <p>{event.pleaseNote}</p>
            </section>
          )}

          {(event.ticketLimit?.info || event.ageRestrictions?.legalAgeEnforced) && (
            <section className="details-section">
              <h3>Ticket information</h3>
              {event.ticketLimit?.info && <p>{event.ticketLimit.info}</p>}
              {event.ageRestrictions?.legalAgeEnforced && <p>Legal age is enforced for this event.</p>}
            </section>
          )}

          {attractions.length > 0 && (
            <section className="details-section">
              <h3>Lineup</h3>
              <div className="attractions">
                {attractions.map((a) => (
                  <div key={a.id} className="attraction">
                    {getBestImage(a.images, '1_1') || getBestImage(a.images) ? (
                      <img src={getBestImage(a.images, '1_1') || getBestImage(a.images)} alt={a.name} />
                    ) : (
                      <div className="attraction-placeholder">{a.name[0]}</div>
                    )}
                    <span>{a.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {event.seatmap?.staticUrl && (
            <section className="details-section">
              <h3>Seat map</h3>
              <img src={event.seatmap.staticUrl} alt="Seat map" className="seatmap" />
            </section>
          )}
        </div>

        <aside className="details-sidebar">
          <div className="sidebar-card">
            <h3>Attend this event</h3>
            <p className="sidebar-date">{formatDate(date)} &middot; {formatTime(event)}</p>
            {isPast && <div className="alert alert-info">This event has already taken place.</div>}
            {event.url && (
              <a href={event.url} target="_blank" rel="noreferrer" className="btn btn-outline btn-block">
                Buy on Ticketmaster
              </a>
            )}
            <Link to="/events" className="small-link center">Browse more events</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default EventDetails
