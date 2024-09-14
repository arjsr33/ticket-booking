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
export const signup = (userData) => api.post('/users/signup', userData);
export const login = (credentials) => api.post('/users/login', credentials);
export const getUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, userData) => api.patch(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Movie routes
export const getMovies = () => api.get('/movies');
export const getMovie = (id) => api.get(`/movies/${id}`);
export const createMovie = (movieData) => api.post('/movies', movieData);
export const updateMovie = (id, movieData) => api.patch(`/movies/${id}`, movieData);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);

// Booking routes
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const getUserBookings = () => api.get('/bookings/user');
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);
export const getAllBookings = () => api.get('/bookings');
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

export default api;