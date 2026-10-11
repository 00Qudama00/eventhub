import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import EventGrid from '../components/EventGrid'
import CategoryCard from '../components/CategoryCard'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import {
  fetchCategories,
  fetchUpcomingEvents,
  selectCategories,
  selectUpcoming,
} from '../features/events/eventsSlice'
import { selectCurrentUser } from '../features/auth/authSlice'

function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const upcoming = useSelector(selectUpcoming)
  const categories = useSelector(selectCategories)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    if (upcoming.status === 'idle') dispatch(fetchUpcomingEvents())
    dispatch(fetchCategories())
  }, [dispatch, upcoming.status])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = keyword.trim()
    navigate(q ? `/events?keyword=${encodeURIComponent(q)}` : '/events')
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1>Discover events you&apos;ll love</h1>
          <p>Concerts, sports, theatre, comedy and more - find what&apos;s happening and save your spot.</p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by artist, event or team"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Search</button>
          </form>
          {!user && (
            <p className="hero-note">
              <Link to="/register">Create a free account</Link> to register for events.
            </p>
          )}
        </div>
      </section>

      <div className="container">
        <section className="home-section">
          <div className="section-head">
            <h2>Browse by Category</h2>
            <Link to="/categories" className="small-link">All categories</Link>
          </div>
          {categories.status === 'loading' && <Loader />}
          {categories.status === 'failed' && <ErrorMessage message={categories.error} />}
          {categories.status === 'succeeded' && (
            <div className="category-grid">
              {categories.items.map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </div>
          )}
        </section>

        <section className="home-section">
          <div className="section-head">
            <h2>Upcoming Events</h2>
            <Link to="/events" className="small-link">See all</Link>
          </div>
          {upcoming.status === 'loading' && <Loader text="Loading upcoming events..." />}
          {upcoming.status === 'failed' && (
            <ErrorMessage message={upcoming.error} onRetry={() => dispatch(fetchUpcomingEvents())} />
          )}
          {upcoming.status === 'succeeded' && <EventGrid events={upcoming.items} />}
        </section>
      </div>
    </>
  )
}

export default Home
