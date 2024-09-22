import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMovies, getMovie, createMovie, updateMovie, deleteMovie } from '../services/api';

// Async thunks for interacting with the backend API

// Fetch all movies from the backend
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMovies(); // Calls the getMovies API function
      return response.data; // Return the movie data
    } catch (error) {
      // Handle errors returned by the backend
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Fetch a single movie by ID from the backend
export const fetchMovie = createAsyncThunk(
  'movies/fetchMovie',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getMovie(id); 
      return response.data; 
    } catch (error) {
      // Handle errors returned by the backend
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Add a new movie to the backend
export const addMovie = createAsyncThunk(
  'movies/addMovie',
  async (movieData, { rejectWithValue }) => {
    try {
      const response = await createMovie(movieData); 
      return response.data; 
    } catch (error) {
      
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Update an existing movie in the backend
export const editMovie = createAsyncThunk(
  'movies/editMovie',
  async ({ id, movieData }, { rejectWithValue }) => {
    try {
      const response = await updateMovie(id, movieData); 
      return response.data; 
    } catch (error) {
    
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Delete a movie from the backend
export const removeMovie = createAsyncThunk(
  'movies/removeMovie',
  async (id, { rejectWithValue }) => {
    try {
      await deleteMovie(id); 
      return id; 
    } catch (error) {
      
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    list: [], // List of movies
    currentMovie: null, // Details of the currently selected movie
    loading: false, // Loading state
    error: null, // Error state
  },
  reducers: {
    clearError: (state) => {
      state.error = null; // Clear the error message
    },
    clearCurrentMovie: (state) => {
      state.currentMovie = null; // Clear the current movie data
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.list = action.payload; // Update the movie list
        state.loading = false;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.error = action.payload.message; // Set error message
        state.loading = false;
      })
      // Fetch a single movie
      .addCase(fetchMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovie.fulfilled, (state, action) => {
        state.currentMovie = action.payload; // Set the current movie data
        state.loading = false;
      })
      .addCase(fetchMovie.rejected, (state, action) => {
        state.error = action.payload.message; // Set error message
        state.loading = false;
      })
      // Add a new movie
      .addCase(addMovie.fulfilled, (state, action) => {
        state.list.push(action.payload); // Add the new movie to the list
      })
      // Edit an existing movie
      .addCase(editMovie.fulfilled, (state, action) => {
        const index = state.list.findIndex(movie => movie._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload; // Update the movie in the list
        }
      })
      // Remove a movie
      .addCase(removeMovie.fulfilled, (state, action) => {
        state.list = state.list.filter(movie => movie._id !== action.payload); // Remove the movie from the list
      });
  },
});

export const { clearError, clearCurrentMovie } = movieSlice.actions;
export default movieSlice.reducer;
