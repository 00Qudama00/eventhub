import { createSlice } from '@reduxjs/toolkit'
import { loadFromStorage } from '../../utils/storage'

const initialState = {
  byUser: loadFromStorage('ems_registrations', {}),
}

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    registerForEvent: {
      reducer(state, action) {
        const { userId, event, registeredAt, bookingId } = action.payload
        const list = state.byUser[userId] || []
        if (list.some((r) => r.id === event.id)) return
        list.push({ ...event, registeredAt, bookingId })
        state.byUser[userId] = list
      },
      prepare(userId, event) {
        return {
          payload: {
            userId,
            event,
            registeredAt: new Date().toISOString(),
            bookingId: 'EH-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
          },
        }
      },
    },
    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload
      const list = state.byUser[userId] || []
      state.byUser[userId] = list.filter((r) => r.id !== eventId)
    },
  },
})

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions

const emptyList = []

export const selectUserRegistrations = (state) => {
  const user = state.auth.user
  if (!user) return emptyList
  return state.registrations.byUser[user.id] || emptyList
}

export const selectIsRegistered = (eventId) => (state) =>
  selectUserRegistrations(state).some((r) => r.id === eventId)

export default registrationsSlice.reducer
