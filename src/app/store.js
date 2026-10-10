import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import eventsReducer from '../features/events/eventsSlice'
import { saveToStorage } from '../utils/storage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
  },
})

let prevAuth = store.getState().auth

store.subscribe(() => {
  const { auth } = store.getState()
  if (auth !== prevAuth) {
    saveToStorage('ems_users', auth.users)
    saveToStorage('ems_session', auth.user)
    prevAuth = auth
  }
})
