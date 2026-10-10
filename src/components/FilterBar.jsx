import { useEffect, useState } from 'react'
import { COUNTRIES, SORT_OPTIONS } from '../utils/constants'

function FilterBar({ filters, categories, onApply, onReset }) {
  const [form, setForm] = useState(filters)
  const [showMore, setShowMore] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(filters)
  }, [filters])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value, ...(name === 'segmentId' ? { genreId: '' } : {}) })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setError('End date cannot be before start date')
      return
    }
    onApply({ ...form, keyword: form.keyword.trim(), city: form.city.trim() })
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form className="filter-bar" onSubmit={handleSubmit}>
      <div className="search-row">
        <input
          type="text"
          name="keyword"
          className="search-input"
          placeholder="Search events, artists, teams..."
          value={form.keyword}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary">Search</button>
        <button type="button" className="btn btn-outline filter-toggle" onClick={() => setShowMore(!showMore)}>
          {showMore ? 'Hide Filters' : 'Filters'}
        </button>
      </div>

      <div className={`filter-grid ${showMore ? 'show' : ''}`}>
        <div className="form-group">
          <label htmlFor="segmentId">Category</label>
          <select id="segmentId" name="segmentId" value={form.segmentId} onChange={handleChange}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="countryCode">Country</label>
          <select id="countryCode" name="countryCode" value={form.countryCode} onChange={handleChange}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input id="city" name="city" placeholder="e.g. New York" value={form.city} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">From</label>
          <input id="startDate" type="date" name="startDate" min={today} value={form.startDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">To</label>
          <input id="endDate" type="date" name="endDate" min={form.startDate || today} value={form.endDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="sort">Sort By</label>
          <select id="sort" name="sort" value={form.sort} onChange={handleChange}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="filter-actions">
          <button type="submit" className="btn btn-primary btn-sm">Apply</button>
          <button type="button" className="btn btn-outline btn-sm" onClick={onReset}>Reset</button>
        </div>
      </div>
      {error && <p className="field-error">{error}</p>}
    </form>
  )
}

export default FilterBar
