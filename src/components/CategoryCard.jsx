import { Link } from 'react-router-dom'

function CategoryCard({ category }) {
  const count = category.genres.length
  return (
    <Link to={`/events?segmentId=${category.id}`} className="category-card">
      <span className="cat-accent" />
      <h3>{category.name}</h3>
      <p>{count} {count === 1 ? 'genre' : 'genres'}</p>
    </Link>
  )
}

export default CategoryCard
