import { createSlice, nanoid } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
  },
  reducers: {
    showToast: {
      reducer(state, action) {
        state.toasts.push(action.payload)
      },
      prepare(message, type = 'success') {
        return { payload: { id: nanoid(), message, type } }
      },
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
  },
})

export const { showToast, removeToast } = uiSlice.actions

export const selectToasts = (state) => state.ui.toasts

export default uiSlice.reducer
