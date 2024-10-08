import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { 
  Container, Typography, Box, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Rating
} from '@mui/material';
import { fetchMovies, addMovie, editMovie, removeMovie } from '../redux/movieSlice';
import { fetchAllBookings } from '../redux/bookingSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { list: movies, loading, error } = useSelector((state) => state.movies);
  const { allBookings } = useSelector((state) => state.bookings);
  const [open, setOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [movieData, setMovieData] = useState({
    title: '',
    category: '',
    language: '',
    description: '',
    cast: '',
    image: '',
  });

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleOpen = (movie = null) => {
    if (movie) {
      setCurrentMovie(movie);
      setMovieData({
        ...movie,
        cast: movie.cast.join(', ')
      });
    } else {
      setCurrentMovie(null);
      setMovieData({
        title: '',
        category: '',
        language: '',
        description: '',
        cast: '',
        image: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentMovie(null);
  };

  const handleChange = (e) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const moviePayload = {
      ...movieData,
      cast: movieData.cast.split(',').map(item => item.trim())
    };
    if (currentMovie) {
      dispatch(editMovie({ id: currentMovie.id, movieData: moviePayload }));
    } else {
      dispatch(addMovie(moviePayload));
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      dispatch(removeMovie(id));
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Movie Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add New Movie
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate('/admin/users')}>
          Manage Users
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate('/admin/bookings')}>
          Manage Bookings
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.category}</TableCell>
                <TableCell>{movie.language}</TableCell>
                <TableCell>
                  <Rating value={movie.rating} readOnly precision={0.1} />
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(movie)}>Edit</Button>
                  <Button onClick={() => handleDelete(movie.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Bookings</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Movie</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allBookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.user.name}</TableCell>
                <TableCell>{booking.movie.title}</TableCell>
                <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell>{booking.seats.join(', ')}</TableCell>
                <TableCell>{booking.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentMovie ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={movieData.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            value={movieData.category}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="language"
            label="Language"
            type="text"
            fullWidth
            value={movieData.language}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={movieData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="cast"
            label="Cast (comma-separated)"
            type="text"
            fullWidth
            value={movieData.cast}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            type="text"
            fullWidth
            value={movieData.image}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{currentMovie ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;