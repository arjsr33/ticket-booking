import { mockMovies, mockUsers } from './mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  login: async (credentials) => {
    await delay(500); // Simulate network delay
    const user = mockUsers.find(u => u.email === credentials.email);
    if (user && credentials.password === 'password') { // Simple password check
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    throw new Error('Invalid credentials');
  },

  signup: async (userData) => {
    await delay(500);
    const newUser = { 
      ...userData, 
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      role: 'user',
      bookings: []
    };
    mockUsers.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  getMovies: async () => {
    await delay(500);
    return mockMovies;
  },

  getMovie: async (id) => {
    await delay(300);
    const movie = mockMovies.find(m => m.id === id);
    if (!movie) throw new Error('Movie not found');
    return movie;
  },

  addMovie: async (movieData) => {
    await delay(500);
    const newMovie = { 
      ...movieData, 
      id: Math.max(...mockMovies.map(m => m.id)) + 1,
      reviews: [],
      rating: 0
    };
    mockMovies.push(newMovie);
    return newMovie;
  },

  updateMovie: async (id, movieData) => {
    await delay(500);
    const index = mockMovies.findIndex(movie => movie.id === id);
    if (index !== -1) {
      mockMovies[index] = { ...mockMovies[index], ...movieData };
      return mockMovies[index];
    }
    throw new Error('Movie not found');
  },

  deleteMovie: async (id) => {
    await delay(500);
    const index = mockMovies.findIndex(movie => movie.id === id);
    if (index !== -1) {
      mockMovies.splice(index, 1);
      return true;
    }
    throw new Error('Movie not found');
  },

  bookTicket: async (userId, movieId, seats, date) => {
    await delay(500);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    
    const booking = {
      id: Math.max(...user.bookings.map(b => b.id), 0) + 1,
      movieId,
      date,
      seats
    };
    user.bookings.push(booking);
    return booking;
  },

  getUserBookings: async (userId) => {
    await delay(500);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return user.bookings.map(booking => ({
      ...booking,
      movie: mockMovies.find(m => m.id === booking.movieId)
    }));
  }
};