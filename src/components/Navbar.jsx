import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout, selectCurrentUser } from '../features/auth/authSlice'
import Icon from './Icon'

function Navbar() {
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    setOpen(false)
    navigate('/login')
  }

  const close = () => setOpen(false)

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          Event<span>Hub</span>
        </Link>

        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <Icon name={open ? 'close' : 'menu'} size={22} />
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/events" onClick={close}>Events</NavLink>
          <NavLink to="/categories" onClick={close}>Categories</NavLink>
          {user ? (
            <>
              <NavLink to="/my-events" onClick={close}>My Events</NavLink>
              <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Login</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={close}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
