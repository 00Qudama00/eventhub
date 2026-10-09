import { createSlice } from '@reduxjs/toolkit'
import { loadFromStorage } from '../../utils/storage'

// passwords are only encoded, not really secure - this is a frontend simulation
const encode = (text) => btoa(unescape(encodeURIComponent(text)))

const initialState = {
  users: loadFromStorage('ems_users', []),
  user: loadFromStorage('ems_session', null),
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: {
      reducer(state, action) {
        const { name, email, password, id, createdAt } = action.payload
        const exists = state.users.some((u) => u.email === email)
        if (exists) {
          state.error = 'An account with this email already exists.'
          return
        }
        const newUser = { id, name, email, password: encode(password), createdAt }
        state.users.push(newUser)
        state.user = { id, name, email, createdAt }
        state.error = null
      },
      prepare({ name, email, password }) {
        return {
          payload: {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            createdAt: new Date().toISOString(),
          },
        }
      },
    },
    loginUser(state, action) {
      const email = action.payload.email.trim().toLowerCase()
      const found = state.users.find((u) => u.email === email)
      if (!found || found.password !== encode(action.payload.password)) {
        state.error = 'Invalid email or password.'
        return
      }
      state.user = { id: found.id, name: found.name, email: found.email, createdAt: found.createdAt }
      state.error = null
    },
    logout(state) {
      state.user = null
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
})

export const { registerUser, loginUser, logout, clearAuthError } = authSlice.actions

export const selectCurrentUser = (state) => state.auth.user
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer
