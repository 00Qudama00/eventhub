import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import FormInput from '../components/FormInput'
import { clearAuthError, registerUser, selectAuthError } from '../features/auth/authSlice'

const emptyForm = { name: '', email: '', password: '', confirmPassword: '' }

function Register() {
  const dispatch = useDispatch()
  const location = useLocation()
  const authError = useSelector(selectAuthError)
  const [form, setForm] = useState(emptyForm)
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
    if (!form.name.trim()) errs.name = 'Name is required'
    else if (form.name.trim().length < 3) errs.name = 'Name should be at least 3 characters'
    else if (!/^[a-zA-Z\s.'-]+$/.test(form.name.trim())) errs.name = 'Name can only contain letters'

    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'

    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    else if (!/\d/.test(form.password) || !/[a-zA-Z]/.test(form.password))
      errs.password = 'Password must contain letters and numbers'

    if (form.confirmPassword !== form.password) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      dispatch(registerUser(form))
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create an account</h2>
        <p className="auth-subtitle">Sign up to start registering for events.</p>

        {authError && <div className="alert alert-error">{authError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="John Doe"
          />
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
            placeholder="At least 6 characters"
          />
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Re-enter password"
          />
          <button type="submit" className="btn btn-primary btn-block">Register</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login" state={location.state}>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
