export const getBestImage = (images = [], ratio = '16_9') => {
  if (!images.length) return null
  const matching = images.filter((img) => img.ratio === ratio)
  const list = matching.length ? matching : images
  return [...list].sort((a, b) => b.width - a.width)[0].url
}

export const getEventDate = (event) => {
  const start = event?.dates?.start
  if (!start) return null
  if (start.dateTime) return new Date(start.dateTime)
  if (start.localDate) return new Date(`${start.localDate}T${start.localTime || '00:00:00'}`)
  return null
}

export const formatDate = (date, withWeekday = true) => {
  if (!date) return 'Date TBA'
  return date.toLocaleDateString('en-US', {
    weekday: withWeekday ? 'short' : undefined,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const formatTime = (event) => {
  const start = event?.dates?.start
  if (!start || start.timeTBA || start.noSpecificTime || !start.localTime) return 'Time TBA'
  const [h, m] = start.localTime.split(':')
  const d = new Date()
  d.setHours(Number(h), Number(m))
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export const getVenue = (event) => event?._embedded?.venues?.[0] || null

export const getLocation = (venue) => {
  if (!venue) return 'Location TBA'
  const parts = [venue.city?.name, venue.state?.stateCode || venue.state?.name, venue.country?.name]
  return parts.filter(Boolean).join(', ')
}

export const getCategory = (event) => {
  const c = event?.classifications?.find((x) => x.primary) || event?.classifications?.[0]
  if (!c) return { segment: 'Other', genre: null }
  const clean = (v) => (v && v.name && v.name !== 'Undefined' ? v.name : null)
  return {
    segment: clean(c.segment) || 'Other',
    genre: clean(c.genre),
    subGenre: clean(c.subGenre),
  }
}

export const getPriceRange = (event) => {
  const p = event?.priceRanges?.[0]
  if (!p) return null
  const fmt = (n) => `${p.currency || ''} ${Number(n).toFixed(2)}`.trim()
  return p.min === p.max ? fmt(p.min) : `${fmt(p.min)} - ${fmt(p.max)}`
}

export const statusLabels = {
  onsale: 'On Sale',
  offsale: 'Off Sale',
  cancelled: 'Cancelled',
  postponed: 'Postponed',
  rescheduled: 'Rescheduled',
}

// keeps only the fields we need so it can be saved with a registration
export const toEventSummary = (event) => {
  const venue = getVenue(event)
  const date = getEventDate(event)
  return {
    id: event.id,
    name: event.name,
    image: getBestImage(event.images, '3_2') || getBestImage(event.images),
    date: date ? date.toISOString() : null,
    time: formatTime(event),
    venue: venue?.name || 'Venue TBA',
    location: getLocation(venue),
    category: getCategory(event).segment,
    url: event.url,
  }
}
