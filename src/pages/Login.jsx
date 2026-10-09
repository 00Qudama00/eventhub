import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import FormInput from '../components/FormInput'
import { clearAuthError, loginUser, selectAuthError } from '../features/auth/authSlice'

function Login() {
  const dispatch = useDispatch()
  const location = useLocation()
  const authError = useSelector(selectAuthError)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    return () => dispatch(clearAuthError())
  }, [dispatch])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    if (authError) dispatch(clearAuthError())
  }

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      dispatch(loginUser(form))
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Login to register for events and manage your bookings.</p>

        {location.state?.from && (
          <div className="alert alert-info">Please login to continue.</div>
        )}
        {authError && <div className="alert alert-error">{authError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Your password"
          />
          <button type="submit" className="btn btn-primary btn-block">Login</button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register" state={location.state}>Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
