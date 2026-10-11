import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ConfirmModal from './ConfirmModal'
import Icon from './Icon'
import { selectCurrentUser } from '../features/auth/authSlice'
import {
  cancelRegistration,
  registerForEvent,
  selectIsRegistered,
} from '../features/registrations/registrationsSlice'
import { showToast } from '../features/ui/uiSlice'
import { toEventSummary } from '../utils/eventHelpers'

function RegisterButton({ event, isPast }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(selectCurrentUser)
  const isRegistered = useSelector(selectIsRegistered(event.id))
  const [confirming, setConfirming] = useState(false)

  const status = event.dates?.status?.code
  const unavailable = status === 'cancelled' || isPast

  if (!user) {
    return (
      <button
        className="btn btn-primary btn-block"
        onClick={() => navigate('/login', { state: { from: location.pathname } })}
      >
        Login to Register
      </button>
    )
  }

  const handleRegister = () => {
    if (isRegistered) {
      dispatch(showToast('You are already registered for this event.', 'info'))
      return
    }
    dispatch(registerForEvent(user.id, toEventSummary(event)))
    dispatch(showToast(`You're registered for ${event.name}!`))
  }

  const handleCancel = () => {
    dispatch(cancelRegistration({ userId: user.id, eventId: event.id }))
    dispatch(showToast('Your registration has been cancelled.', 'info'))
    setConfirming(false)
  }

  if (isRegistered) {
    return (
      <>
        <div className="registered-box">
          <span><Icon name="check" size={16} /> You are registered</span>
          <Link to="/my-events" className="small-link">View in My Events</Link>
        </div>
        {!isPast && (
          <button className="btn btn-danger btn-block" onClick={() => setConfirming(true)}>
            Cancel Registration
          </button>
        )}
        {confirming && (
          <ConfirmModal
            title="Cancel registration?"
            message={`Are you sure you want to cancel your registration for "${event.name}"?`}
            confirmText="Yes, cancel"
            onConfirm={handleCancel}
            onCancel={() => setConfirming(false)}
          />
        )}
      </>
    )
  }

  return (
    <button className="btn btn-primary btn-block" disabled={unavailable} onClick={handleRegister}>
      {status === 'cancelled' ? 'Event Cancelled' : isPast ? 'Registration Closed' : 'Register for Event'}
    </button>
  )
}

export default RegisterButton
