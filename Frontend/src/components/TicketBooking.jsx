import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Container, Typography, Box, Button, 
  FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField
} from '@mui/material';
import { fetchMovie, clearCurrentMovie } from '../redux/movieSlice';
import { bookTicket } from '../redux/bookingSlice';

const TicketBooking = () => {
  const { id } = useParams(); // Getting movie ID from URL
  const dispatch = useDispatch();
  const movie = useSelector((state) => state.movies.currentMovie);
  const loading = useSelector((state) => state.bookings.loading);
  const error = useSelector((state) => state.bookings.error);
  const [seats, setSeats] = useState(1);
  const [date, setDate] = useState('');
  const [openConfirmation, setOpenConfirmation] = useState(false);

  useEffect(() => {
    // Fetch movie details by ID
    dispatch(fetchMovie(id));

    // Clear current movie when the component unmounts
    return () => {
      dispatch(clearCurrentMovie());
    };
  }, [dispatch, id]);

  const handleBooking = async () => {
    try {
      
      if (!date) {
        alert('Please select a date.');
        return;
      }
      await dispatch(bookTicket({ movieId: movie._id, seats, date })).unwrap();
      setOpenConfirmation(true);
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!movie) return <Typography>Movie not found</Typography>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Book Tickets for {movie.title}</Typography>
      <Box sx={{ mt: 4 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Number of Seats</InputLabel>
          <Select
            value={seats}
            label="Number of Seats"
            onChange={(e) => setSeats(e.target.value)}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <MenuItem key={num} value={num}>{num}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Select Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Typography variant="body1" gutterBottom>
          Total Price: ₹{seats * 100}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleBooking} fullWidth>
          Book Now
        </Button>
      </Box>

      <Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
        <DialogTitle>Booking Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            You have booked {seats} seat(s) for {movie.title}.
          </Typography>
          <Typography>
            Date: {new Date(date).toLocaleDateString()}
          </Typography>
          <Typography>
            Total Price: ₹{seats * 100}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TicketBooking;
