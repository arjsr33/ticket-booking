import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, Typography, Box, Button, 
  FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';

const TicketBooking = ({ movies }) => {
  const { id } = useParams();
  const movie = movies.find(m => m.id === parseInt(id));
  const [seats, setSeats] = useState(1);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  if (!movie) return <Typography>Movie not found</Typography>;

  const handleBooking = () => {
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

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
        <Typography variant="body1" gutterBottom>
          Total Price: ${seats * 10} {/* Assume $10 per seat */}
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
            Total Price: ${seats * 10}
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