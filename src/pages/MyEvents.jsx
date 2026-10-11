import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import RegisteredEventItem from '../components/RegisteredEventItem'
import ConfirmModal from '../components/ConfirmModal'
import EmptyState from '../components/EmptyState'
import { selectCurrentUser } from '../features/auth/authSlice'
import {
  cancelRegistration,
  selectUserRegistrations,
} from '../features/registrations/registrationsSlice'
import { showToast } from '../features/ui/uiSlice'

function MyEvents() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const registrations = useSelector(selectUserRegistrations)
  const [tab, setTab] = useState('upcoming')
  const [toCancel, setToCancel] = useState(null)

  const { upcoming, completed } = useMemo(() => {
    const now = new Date()
    const up = []
    const done = []
    registrations.forEach((r) => {
      if (r.date && new Date(r.date) < now) done.push(r)
      else up.push(r)
    })
    const byDate = (a, b) => new Date(a.date || 0) - new Date(b.date || 0)
    return { upcoming: up.sort(byDate), completed: done.sort(byDate).reverse() }
  }, [registrations])

  const list = tab === 'upcoming' ? upcoming : completed

  const confirmCancel = () => {
    dispatch(cancelRegistration({ userId: user.id, eventId: toCancel.id }))
    dispatch(showToast(`Registration for ${toCancel.name} cancelled.`, 'info'))
    setToCancel(null)
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Events</h1>
        <p>Manage the events you have registered for, {user.name}.</p>
      </div>

      <div className="stats">
        <div className="stat-card">
          <span>{registrations.length}</span>
          <p>Total Registrations</p>
        </div>
        <div className="stat-card">
          <span>{upcoming.length}</span>
          <p>Upcoming</p>
        </div>
        <div className="stat-card">
          <span>{completed.length}</span>
          <p>Completed</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>
          Upcoming ({upcoming.length})
        </button>
        <button className={`tab ${tab === 'completed' ? 'active' : ''}`} onClick={() => setTab('completed')}>
          Completed ({completed.length})
        </button>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title={tab === 'upcoming' ? 'No upcoming events' : 'No completed events yet'}
          message={
            tab === 'upcoming'
              ? 'You have not registered for any upcoming events.'
              : 'Events you attended will show up here.'
          }
        >
          {tab === 'upcoming' && <Link to="/events" className="btn btn-primary">Explore Events</Link>}
        </EmptyState>
      ) : (
        <div className="reg-list">
          {list.map((r) => (
            <RegisteredEventItem
              key={r.id}
              registration={r}
              completed={tab === 'completed'}
              onCancel={setToCancel}
            />
          ))}
        </div>
      )}

      {toCancel && (
        <ConfirmModal
          title="Cancel registration?"
          message={`Are you sure you want to cancel your registration for "${toCancel.name}"?`}
          confirmText="Yes, cancel"
          onConfirm={confirmCancel}
          onCancel={() => setToCancel(null)}
        />
      )}
    </div>
  )
}

export default MyEvents
