import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import movieReducer from './movieSlice';
import bookingReducer from './bookingSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    movies: movieReducer,
    bookings: bookingReducer,
  },
});