function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  )
}

export default Loader
