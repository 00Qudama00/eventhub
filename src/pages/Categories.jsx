import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import { fetchCategories, selectCategories } from '../features/events/eventsSlice'

function Categories() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector(selectCategories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <div className="container">
      <div className="page-header">
        <h1>Event Categories</h1>
        <p>Browse events by category and genre.</p>
      </div>

      {status === 'loading' && <Loader text="Loading categories..." />}
      {status === 'failed' && <ErrorMessage message={error} onRetry={() => dispatch(fetchCategories())} />}

      {status === 'succeeded' && (
        <div className="segment-list">
          {items.map((segment) => (
            <div key={segment.id} className="segment-block">
              <div className="segment-head">
                <h2>{segment.name}</h2>
                <Link to={`/events?segmentId=${segment.id}`} className="small-link">
                  View all
                </Link>
              </div>
              <div className="genre-list">
                {segment.genres.map((g) => (
                  <Link
                    key={g.id}
                    to={`/events?segmentId=${segment.id}&genreId=${g.id}`}
                    className="genre-chip"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Categories
