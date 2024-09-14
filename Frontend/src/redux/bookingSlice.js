import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createBooking, getUserBookings, cancelBooking, getAllBookings, deleteBooking } from '../services/api';

// Async thunks for interacting with the backend API

// Book a ticket
export const bookTicket = createAsyncThunk(
  'bookings/bookTicket',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await createBooking(bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch bookings of the current user
export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserBookings();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Cancel a user's booking
export const cancelUserBooking = createAsyncThunk(
  'bookings/cancelUserBooking',
  async (id, { rejectWithValue }) => {
    try {
      const response = await cancelBooking(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch all bookings (for admin)
export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllBookings();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a booking (admin)
export const removeBooking = createAsyncThunk(
  'bookings/removeBooking',
  async (id, { rejectWithValue }) => {
    try {
      await deleteBooking(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Booking slice definition
const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    userBookings: [], // List of bookings for the current user
    allBookings: [],  // List of all bookings (admin view)
    loading: false,   // Loading state
    error: null,      // Error state
  },
  reducers: {
    clearError: (state) => {
      state.error = null; // Clear the error message
    },
  },
  extraReducers: (builder) => {
    builder
      // Book a ticket
      .addCase(bookTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookTicket.fulfilled, (state, action) => {
        state.userBookings.push(action.payload); // Add the new booking to userBookings
        state.loading = false;
      })
      .addCase(bookTicket.rejected, (state, action) => {
        state.error = action.payload.message; // Set the error message
        state.loading = false;
      })
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.userBookings = action.payload; // Set the fetched bookings to userBookings
        state.loading = false;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.error = action.payload.message; // Set the error message
        state.loading = false;
      })
      // Cancel a user's booking
      .addCase(cancelUserBooking.fulfilled, (state, action) => {
        const index = state.userBookings.findIndex(booking => booking._id === action.payload._id);
        if (index !== -1) {
          state.userBookings[index] = action.payload; // Update the booking status to 'cancelled'
        }
      })
      // Fetch all bookings (admin)
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.allBookings = action.payload; // Set the fetched bookings to allBookings
      })
      // Remove a booking (admin)
      .addCase(removeBooking.fulfilled, (state, action) => {
        state.allBookings = state.allBookings.filter(booking => booking._id !== action.payload); // Remove the booking from allBookings
      });
  },
});

export const { clearError } = bookingSlice.actions;
export default bookingSlice.reducer;
