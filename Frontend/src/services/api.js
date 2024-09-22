import axios from 'axios';

const API_URL = 'https://chandnimovies.vercel.app/api'
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
export const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    console.log("API login response:", response.data);
    return response.data; // Return only the data part of the response
  } catch (error) {
    console.error("Login error:", error.response ? error.response.data : error.message);
    throw error;
  }
};
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
export const getBookedSeats = (movieId, date, time) => 
  api.get(`/bookings/movie/${movieId}`, { params: { date, time } });
export const sendBookingConfirmation = async (bookingDetails) => {
  try {
    const response = await api.post('/bookings/send-confirmation', bookingDetails);
    return response.data;
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw error;
  }
};

export default api;