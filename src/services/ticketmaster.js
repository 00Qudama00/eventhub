// in development requests go through the vite proxy (see vite.config.js) so they are logged in the terminal
const BASE_URL = import.meta.env.DEV
  ? `${window.location.origin}/tm-api`
  : 'https://app.ticketmaster.com/discovery/v2'
const API_KEY = import.meta.env.VITE_TM_API_KEY

const buildUrl = (path, params = {}) => {
  const url = new URL(`${BASE_URL}/${path}`)
  url.searchParams.set('apikey', API_KEY)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })
  return url.toString()
}

// free plan allows only 2 requests per second, so space them out a little
let lastRequest = 0
const waitForSlot = async () => {
  const now = Date.now()
  const next = Math.max(now, lastRequest + 550)
  lastRequest = next
  if (next > now) await new Promise((r) => setTimeout(r, next - now))
}

const request = async (path, params) => {
  if (!API_KEY) {
    throw new Error('Ticketmaster API key is missing. Add VITE_TM_API_KEY to your .env file.')
  }
  await waitForSlot()
  const url = buildUrl(path, params)
  if (import.meta.env.DEV) {
    console.log('%c[API] GET ' + path, 'color:#4f46e5;font-weight:bold', params || {})
  }
  const res = await fetch(url)
  if (import.meta.env.DEV) {
    console.log(`[API] ${res.status} ${path}`)
  }
  if (res.status === 429) {
    throw new Error('Too many requests to Ticketmaster. Please wait a moment and try again.')
  }
  if (res.status === 404) {
    throw new Error('Event not found.')
  }
  if (!res.ok) {
    throw new Error(`Ticketmaster request failed (${res.status})`)
  }
  return res.json()
}

// Ticketmaster expects dates like 2024-05-01T00:00:00Z (no milliseconds)
export const toApiDate = (date) => date.toISOString().split('.')[0] + 'Z'

export const searchEvents = ({
  keyword,
  segmentId,
  genreId,
  city,
  countryCode,
  startDate,
  endDate,
  sort = 'date,asc',
  page = 0,
  size = 12,
} = {}) => {
  const start = startDate ? new Date(startDate + 'T00:00:00') : new Date()
  return request('events.json', {
    keyword,
    segmentId,
    genreId,
    city,
    countryCode,
    sort,
    page,
    size,
    startDateTime: toApiDate(start),
    endDateTime: endDate ? toApiDate(new Date(endDate + 'T23:59:59')) : undefined,
  })
}

export const getEventById = (id) => request(`events/${id}.json`)

export const getClassifications = () => request('classifications.json', { size: 50 })
