function Pagination({ current, total, onChange }) {
  if (total <= 1) return null

  const pages = []
  const start = Math.max(0, current - 2)
  const end = Math.min(total - 1, current + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="pagination">
      <button className="page-btn" disabled={current === 0} onClick={() => onChange(current - 1)}>
        Prev
      </button>
      {start > 0 && (
        <>
          <button className="page-btn" onClick={() => onChange(0)}>1</button>
          {start > 1 && <span className="page-dots">...</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          className={`page-btn ${p === current ? 'active' : ''}`}
          onClick={() => onChange(p)}
        >
          {p + 1}
        </button>
      ))}
      {end < total - 1 && (
        <>
          {end < total - 2 && <span className="page-dots">...</span>}
          <button className="page-btn" onClick={() => onChange(total - 1)}>{total}</button>
        </>
      )}
      <button className="page-btn" disabled={current >= total - 1} onClick={() => onChange(current + 1)}>
        Next
      </button>
    </div>
  )
}

export default Pagination
