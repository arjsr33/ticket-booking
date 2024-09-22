import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Container, Typography, Box, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Paper, Checkbox, FormControlLabel,
  ToggleButton, ToggleButtonGroup, Alert ,Snackbar
} from '@mui/material';
import { fetchMovie, clearCurrentMovie } from '../redux/movieSlice';
import { bookTicket, fetchBookedSeats, clearError, fetchUserBookings } from '../redux/bookingSlice';
import { sendBookingConfirmation } from '../services/api'; // Add this import


const TicketBooking = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movie = useSelector((state) => state.movies.currentMovie);
  const loading = useSelector((state) => state.bookings.loading);
  const error = useSelector((state) => state.bookings.error);
  const bookedSeats = useSelector((state) => state.bookings.bookedSeats);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  useEffect(() => {
    dispatch(fetchMovie(id));
    return () => {
      dispatch(clearCurrentMovie());
      dispatch(clearError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      dispatch(fetchBookedSeats({ movieId: id, date: selectedDate, time: selectedTime }))
        .unwrap()
        .then(() => setFetchError(null))
        .catch((error) => {
          console.error('Error fetching booked seats:', error);
          setFetchError('Failed to fetch booked seats. Please try again.');
        });
    }
  }, [dispatch, id, selectedDate, selectedTime]);

  useEffect(() => {
    if (bookingConfirmed) {
      const sendEmail = async () => {
        try {
          const response = await sendBookingConfirmation({
            movieTitle: movie.title,
            seats: selectedSeats,
            date: selectedDate,
            time: selectedTime,
            totalPrice: selectedSeats.length * 100
          });
          console.log('Email confirmation response:', response);
          setEmailStatus('success');
        } catch (error) {
          console.error('Failed to send confirmation email:', error);
          if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
          }
          setEmailStatus('error');
        }
      };
  
      sendEmail();
    }
  }, [bookingConfirmed, movie, selectedSeats, selectedDate, selectedTime]);


  const handleSeatClick = (seatLabel) => {
    if (!bookedSeats.includes(seatLabel)) {
      setSelectedSeats(prev => 
        prev.includes(seatLabel) ? prev.filter(seat => seat !== seatLabel) : [...prev, seatLabel]
      );
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || selectedSeats.length === 0 || !confirmationChecked) {
      alert('Please ensure all booking details are complete and confirmed.');
      return;
    }

    try {
      const result = await dispatch(bookTicket({
        movieId: movie._id,
        seats: selectedSeats,
        date: selectedDate,
        time: selectedTime
      })).unwrap();
      
      if (result.success) {
        setOpenConfirmation(true);
        setBookingConfirmed(true);
      } else {
        alert('Booking failed. Some seats may have been taken. Please try again.');
        dispatch(fetchBookedSeats({ movieId: id, date: selectedDate, time: selectedTime }));
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('An error occurred while booking. Please try again.');
    }
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
    dispatch(fetchUserBookings()); // Refetch bookings before navigating
    navigate('/profile');
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setEmailStatus(null);
  };


  const renderRow = (row) => (
    <Box key={row} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Typography sx={{ width: 20, mr: 1 }}>{row}</Typography>
      <Grid container spacing={1}>
        {Array.from({ length: 15 }, (_, i) => {
          const seatNumber = i + 1;
          const seatLabel = `${row}${seatNumber.toString().padStart(2, '0')}`;
          const isBooked = bookedSeats.includes(seatLabel);
          const isSelected = selectedSeats.includes(seatLabel);
  
          return (
            <Grid item key={i}>
              <Paper
                elevation={1}
                sx={{
                  width: 25,
                  height: 25,
                  bgcolor: 
                    isBooked ? 'grey.300' :
                    isSelected ? 'primary.main' : 'white',
                  border: '1px solid',
                  borderColor: 'grey.400',
                  cursor: isBooked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  '&:hover': {
                    bgcolor: isBooked ? 'grey.300' : 
                             isSelected ? 'primary.dark' : 'primary.light',
                  },
                }}
                onClick={() => handleSeatClick(seatLabel)}
              >
                <Typography variant="caption">{seatNumber}</Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  const renderSeats = () => {
    const rows = 'ABCDEFGHIJKL';
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Top 3 rows */}
        <Box sx={{ mb: 4 }}>
          {rows.slice(0, 3).split('').map((row) => renderRow(row))}
        </Box>
  
        {/* Middle 6 rows */}
        <Box sx={{ display: 'flex', mb: 4 }}>
          {/* Left 3 seats */}
          <Box sx={{ mr: 2 }}>
            {rows.slice(3, 9).split('').map((row) => (
              <Box key={row} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ width: 20, mr: 1 }}>{row}</Typography>
                <Grid container spacing={1}>
                  {Array.from({ length: 3 }, (_, i) => {
                    const seatNumber = i + 1;
                    const seatLabel = `${row}${seatNumber.toString().padStart(2, '0')}`;
                    return renderSeat(seatLabel, seatNumber);
                  })}
                </Grid>
              </Box>
            ))}
          </Box>
  
          {/* Center 9 seats */}
          <Box>
            {rows.slice(3, 9).split('').map((row) => (
              <Box key={row} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Grid container spacing={1}>
                  {Array.from({ length: 9 }, (_, i) => {
                    const seatNumber = i + 4;
                    const seatLabel = `${row}${seatNumber.toString().padStart(2, '0')}`;
                    return renderSeat(seatLabel, seatNumber);
                  })}
                </Grid>
              </Box>
            ))}
          </Box>
  
          {/* Right 3 seats */}
          <Box sx={{ ml: 2 }}>
            {rows.slice(3, 9).split('').map((row) => (
              <Box key={row} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Grid container spacing={1}>
                  {Array.from({ length: 3 }, (_, i) => {
                    const seatNumber = i + 13;
                    const seatLabel = `${row}${seatNumber.toString().padStart(2, '0')}`;
                    return renderSeat(seatLabel, seatNumber);
                  })}
                </Grid>
              </Box>
            ))}
          </Box>
        </Box>
  
        {/* Bottom 3 rows */}
        <Box>
          {rows.slice(9).split('').map((row) => renderRow(row))}
        </Box>
      </Box>
    );
  };

  const renderSeat = (seatLabel, seatNumber) => {
    const isBooked = bookedSeats.includes(seatLabel);
    const isSelected = selectedSeats.includes(seatLabel);

    return (
      <Grid item key={seatLabel}>
        <Paper
          elevation={1}
          sx={{
            width: 25,
            height: 25,
            bgcolor: 
              isBooked ? 'grey.300' :
              isSelected ? 'primary.main' : 'white',
            border: '1px solid',
            borderColor: 'grey.400',
            cursor: isBooked ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '&:hover': {
              bgcolor: isBooked ? 'grey.300' : 
                       isSelected ? 'primary.dark' : 'primary.light',
            },
          }}
          onClick={() => handleSeatClick(seatLabel)}
        >
          <Typography variant="caption">{seatNumber}</Typography>
        </Paper>
      </Grid>
    );
  };

  const renderDateSelection = () => {
    const today = new Date();
    const dates = [today, new Date(today.getTime() + 86400000), new Date(today.getTime() + 172800000)];
    
    return (
      <ToggleButtonGroup
        value={selectedDate}
        exclusive
        onChange={(e, newDate) => setSelectedDate(newDate)}
        aria-label="date selection"
      >
        {dates.map((date, index) => (
          <ToggleButton 
            key={index} 
            value={date.toISOString().split('T')[0]} 
            aria-label={date.toDateString()}
            sx={{ 
              p: 2, 
              flexDirection: 'column',
              '&.Mui-selected': { bgcolor: 'primary.main', color: 'white' }
            }}
          >
            <Typography variant="body2">{date.toLocaleDateString('en-US', { weekday: 'short' })}</Typography>
            <Typography variant="h6">{date.getDate()}</Typography>
            <Typography variant="body2">{date.toLocaleDateString('en-US', { month: 'short' })}</Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  };

  const renderTimeSelection = () => {
    const timeSlots = ['09:00', '12:00', '15:00', '18:00', '21:00'];
    
    return (
      <ToggleButtonGroup
        value={selectedTime}
        exclusive
        onChange={(e, newTime) => setSelectedTime(newTime)}
        aria-label="time selection"
      >
        {timeSlots.map((time, index) => (
          <ToggleButton 
            key={index} 
            value={time} 
            aria-label={time}
            sx={{ 
              p: 1, 
              '&.Mui-selected': { bgcolor: 'primary.main', color: 'white' }
            }}
          >
            {time}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!movie) return <Typography>Movie not found</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Book Tickets for {movie.title}</Typography>
      {fetchError && (
        <Alert severity="error" onClose={() => setFetchError(null)}>
          {fetchError}
        </Alert>
      )}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Select Date:</Typography>
        {renderDateSelection()}
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Select Time:</Typography>
        {renderTimeSelection()}
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Select Your Seats:</Typography>
        <Box sx={{ mb: 2, overflowX: 'auto' }}>
          {renderSeats()}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ bgcolor: 'grey.200', px: 2, py: 1, borderRadius: 1 }}>
            All eyes this way please!
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Paper sx={{ width: 20, height: 20, bgcolor: 'white', border: '1px solid', borderColor: 'grey.400', mr: 1 }} />
            <Typography variant="body2">Available</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Paper sx={{ width: 20, height: 20, bgcolor: 'primary.main', mr: 1 }} />
            <Typography variant="body2">Selected</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Paper sx={{ width: 20, height: 20, bgcolor: 'grey.300', mr: 1 }} />
            <Typography variant="body2">Sold</Typography>
          </Box>
        </Box>
        <Typography variant="body1" gutterBottom>
          Selected Seats: {selectedSeats.length}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Total Price: ₹{selectedSeats.length * 100}
        </Typography>
        <FormControlLabel
          control={
            <Checkbox 
              checked={confirmationChecked}
              onChange={(e) => setConfirmationChecked(e.target.checked)}
            />
          }
          label="I confirm that I will arrive one hour early and make the payment to confirm my booking."
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleBooking} 
          fullWidth 
          sx={{ mt: 2 }}
          disabled={!confirmationChecked || !selectedDate || !selectedTime || selectedSeats.length === 0}
        >
          Book Now
        </Button>
      </Box>

      <Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
        <DialogTitle>Booking Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            You have booked the following seat(s) for {movie.title}:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {selectedSeats.join(', ')}
          </Typography>
          <Typography>
            Date: {selectedDate && new Date(selectedDate).toLocaleDateString()}
          </Typography>
          <Typography>
            Time: {selectedTime}
          </Typography>
          <Typography>
            Total Price: ₹{selectedSeats.length * 100}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Remember to arrive one hour early and make the payment to confirm your booking.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            A confirmation email will be sent to your registered email address shortly.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={emailStatus !== null}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={emailStatus === 'success' ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {emailStatus === 'success'
            ? 'Confirmation email sent successfully to your registered email address.'
            : 'Failed to send confirmation email. Please check your bookings in your profile.'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TicketBooking;