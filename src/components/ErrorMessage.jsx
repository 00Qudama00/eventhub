function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box">
      <h3>Oops! Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
