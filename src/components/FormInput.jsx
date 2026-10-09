function FormInput({ label, name, type = 'text', value, onChange, error, ...rest }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={error ? 'input-error' : ''}
        {...rest}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}

export default FormInput
