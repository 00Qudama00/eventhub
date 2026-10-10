import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import FilterBar from '../components/FilterBar'
import EventGrid from '../components/EventGrid'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import Pagination from '../components/Pagination'
import {
  PAGE_SIZE,
  defaultFilters,
  fetchCategories,
  fetchEvents,
  selectCategories,
  selectEventList,
  selectFilters,
  setFilters,
} from '../features/events/eventsSlice'

// API does not allow going deeper than 1000 results
const MAX_PAGES = Math.floor(1000 / PAGE_SIZE)

function Events() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useSelector(selectFilters)
  const { items, page, status, error } = useSelector(selectEventList)
  const categories = useSelector(selectCategories)

  const currentPage = Number(searchParams.get('page')) || 0

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const fromUrl = {}
    Object.keys(defaultFilters).forEach((key) => {
      fromUrl[key] = searchParams.get(key) || defaultFilters[key]
    })
    dispatch(setFilters(fromUrl))
    dispatch(fetchEvents({ filters: fromUrl, page: currentPage }))
  }, [searchParams, currentPage, dispatch])

  const updateParams = (newFilters, newPage = 0) => {
    const params = {}
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== defaultFilters[key]) params[key] = value
    })
    if (newPage > 0) params.page = newPage
    setSearchParams(params)
  }

  const handlePageChange = (p) => {
    updateParams(filters, p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages = page ? Math.min(page.totalPages, MAX_PAGES) : 0
  const activeCategory = categories.items.find((c) => c.id === filters.segmentId)
  const activeGenre = activeCategory?.genres.find((g) => g.id === filters.genreId)
  const heading = activeGenre?.name || activeCategory?.name

  return (
    <div className="container">
      <div className="page-header">
        <h1>{heading ? `${heading} Events` : 'Explore Events'}</h1>
        <p>Find concerts, sports, theatre and more happening around the world.</p>
      </div>

      <FilterBar
        filters={filters}
        categories={categories.items}
        onApply={(f) => updateParams(f)}
        onReset={() => setSearchParams({})}
      />

      {status === 'loading' && <Loader text="Fetching events..." />}

      {status === 'failed' && (
        <ErrorMessage message={error} onRetry={() => dispatch(fetchEvents({ filters, page: currentPage }))} />
      )}

      {status === 'succeeded' && items.length === 0 && (
        <EmptyState
          title="No events found"
          message="Try a different keyword or remove some filters."
        >
          <button className="btn btn-outline" onClick={() => setSearchParams({})}>Clear Filters</button>
        </EmptyState>
      )}

      {status === 'succeeded' && items.length > 0 && (
        <>
          <p className="results-count">
            Showing {currentPage * PAGE_SIZE + 1}-{currentPage * PAGE_SIZE + items.length} of{' '}
            {page.totalElements.toLocaleString()} events
          </p>
          <EventGrid events={items} />
          <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />
        </>
      )}
    </div>
  )
}

export default Events
