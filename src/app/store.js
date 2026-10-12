import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import eventsReducer from '../features/events/eventsSlice'
import registrationsReducer from '../features/registrations/registrationsSlice'
import uiReducer from '../features/ui/uiSlice'
import { saveToStorage } from '../utils/storage'

const logger = (storeApi) => (next) => (action) => {
  const result = next(action)
  if (import.meta.env.DEV) {
    console.groupCollapsed(`[Redux] ${action.type}`)
    console.log('payload:', action.payload)
    console.log('new state:', storeApi.getState())
    console.groupEnd()
  }
  return result
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
    ui: uiReducer,
  },
  middleware: (getDefault) => getDefault().concat(logger),
})

let prevAuth = store.getState().auth
let prevRegistrations = store.getState().registrations

store.subscribe(() => {
  const { auth, registrations } = store.getState()
  if (auth !== prevAuth) {
    saveToStorage('ems_users', auth.users)
    saveToStorage('ems_session', auth.user)
    prevAuth = auth
  }
  if (registrations !== prevRegistrations) {
    saveToStorage('ems_registrations', registrations.byUser)
    prevRegistrations = registrations
  }
})
