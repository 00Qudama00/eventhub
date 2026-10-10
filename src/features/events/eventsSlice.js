import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getClassifications, getEventById, searchEvents } from '../../services/ticketmaster'

export const PAGE_SIZE = 12

export const defaultFilters = {
  keyword: '',
  segmentId: '',
  genreId: '',
  city: '',
  countryCode: '',
  startDate: '',
  endDate: '',
  sort: 'date,asc',
}

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async ({ filters, page }, { rejectWithValue }) => {
    try {
      const data = await searchEvents({ ...filters, page, size: PAGE_SIZE })
      return {
        items: data._embedded?.events || [],
        page: data.page,
      }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchUpcomingEvents = createAsyncThunk(
  'events/fetchUpcoming',
  async (_, { rejectWithValue }) => {
    try {
      const data = await searchEvents({ sort: 'date,asc', size: 8 })
      return data._embedded?.events || []
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchEventDetails = createAsyncThunk(
  'events/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await getEventById(id)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'events/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getClassifications()
      const list = data._embedded?.classifications || []
      return list
        .filter((c) => c.segment && c.segment.name !== 'Undefined')
        .map((c) => ({
          id: c.segment.id,
          name: c.segment.name,
          genres: (c.segment._embedded?.genres || [])
            .filter((g) => g.name !== 'Undefined')
            .map((g) => ({ id: g.id, name: g.name })),
        }))
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().events.categories
      return status !== 'loading' && status !== 'succeeded'
    },
  }
)

const initialState = {
  filters: defaultFilters,
  list: { items: [], page: null, status: 'idle', error: null, requestId: null },
  upcoming: { items: [], status: 'idle', error: null },
  details: { event: null, status: 'idle', error: null },
  categories: { items: [], status: 'idle', error: null },
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters(state) {
      state.filters = defaultFilters
    },
    clearEventDetails(state) {
      state.details = initialState.details
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state, action) => {
        state.list.status = 'loading'
        state.list.error = null
        state.list.requestId = action.meta.requestId
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        if (state.list.requestId !== action.meta.requestId) return
        state.list.status = 'succeeded'
        state.list.items = action.payload.items
        state.list.page = action.payload.page
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        if (state.list.requestId !== action.meta.requestId) return
        state.list.status = 'failed'
        state.list.error = action.payload || 'Something went wrong'
      })
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.upcoming.status = 'loading'
        state.upcoming.error = null
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.upcoming.status = 'succeeded'
        state.upcoming.items = action.payload
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.upcoming.status = 'failed'
        state.upcoming.error = action.payload || 'Something went wrong'
      })
      .addCase(fetchEventDetails.pending, (state) => {
        state.details.status = 'loading'
        state.details.error = null
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.details.status = 'succeeded'
        state.details.event = action.payload
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        state.details.status = 'failed'
        state.details.error = action.payload || 'Something went wrong'
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categories.status = 'loading'
        state.categories.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.status = 'succeeded'
        state.categories.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.status = 'failed'
        state.categories.error = action.payload || 'Something went wrong'
      })
  },
})

export const { setFilters, resetFilters, clearEventDetails } = eventsSlice.actions

export const selectFilters = (state) => state.events.filters
export const selectEventList = (state) => state.events.list
export const selectUpcoming = (state) => state.events.upcoming
export const selectEventDetails = (state) => state.events.details
export const selectCategories = (state) => state.events.categories

export default eventsSlice.reducer
