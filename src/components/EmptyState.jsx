function EmptyState({ title, message, children }) {
  return (
    <div className="empty-box">
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {children}
    </div>
  )
}

export default EmptyState
