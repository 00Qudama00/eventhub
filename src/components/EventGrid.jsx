import EventCard from './EventCard'

function EventGrid({ events }) {
  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

export default EventGrid
