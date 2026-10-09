import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { selectCurrentUser } from '../features/auth/authSlice'

function GuestRoute() {
  const user = useSelector(selectCurrentUser)
  const location = useLocation()

  if (user) {
    return <Navigate to={location.state?.from || '/events'} replace />
  }
  return <Outlet />
}

export default GuestRoute
