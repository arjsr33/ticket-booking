import axios from 'axios';

const API_URL = '/api'; // This will use the proxy set up in vite.config.js

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User routes
export const signup = (userData) => api.post('/api/users/signup', userData);
export const login = async (credentials) => {
  try {
    const response = await api.post('/api/users/login', credentials);
    console.log("API login response:", response.data);
    return response.data; // Return only the data part of the response
  } catch (error) {
    console.error("Login error:", error.response ? error.response.data : error.message);
    throw error;
  }
};
export const getUsers = () => api.get('/api/users');
export const getUser = (id) => api.get(`/api/users/${id}`);
export const updateUser = (id, userData) => api.patch(`/api/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/api/users/${id}`);

// Movie routes
export const getMovies = () => api.get('/api/movies');
export const getMovie = (id) => api.get(`/api/movies/${id}`);
export const createMovie = (movieData) => api.post('/api/movies', movieData);
export const updateMovie = (id, movieData) => api.patch(`/api/movies/${id}`, movieData);
export const deleteMovie = (id) => api.delete(`/api/movies/${id}`);

// Booking routes
export const createBooking = (bookingData) => api.post('/api/bookings', bookingData);
export const getUserBookings = () => api.get('/api/bookings/user');
export const cancelBooking = (id) => api.patch(`/api/bookings/${id}/cancel`);
export const getAllBookings = () => api.get('/api/bookings');
export const deleteBooking = (id) => api.delete(`/api/bookings/${id}`);
export const getBookedSeats = (movieId, date, time) => 
  api.get(`/api/bookings/movie/${movieId}`, { params: { date, time } });
export const sendBookingConfirmation = (bookingDetails) => 
  api.post('/api/bookings/send-confirmation', bookingDetails);

export default api;