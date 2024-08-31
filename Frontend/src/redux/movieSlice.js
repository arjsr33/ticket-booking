import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, { rejectWithValue }) => {
    try {
      const movies = await api.getMovies();
      return movies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMovie = createAsyncThunk(
  'movies/addMovie',
  async (movieData, { rejectWithValue }) => {
    try {
      const newMovie = await api.addMovie(movieData);
      return newMovie;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async ({ id, movieData }, { rejectWithValue }) => {
    try {
      const updatedMovie = await api.updateMovie(id, movieData);
      return updatedMovie;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMovie = createAsyncThunk(
  'movies/deleteMovie',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteMovie(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        const index = state.list.findIndex(movie => movie.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.list = state.list.filter(movie => movie.id !== action.payload);
      });
  },
});

export default movieSlice.reducer;