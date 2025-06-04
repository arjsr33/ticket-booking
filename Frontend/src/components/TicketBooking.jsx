import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Container, Typography, Box, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Paper, Checkbox, FormControlLabel,
  ToggleButton, ToggleButtonGroup, Alert, Snackbar,
  Card, CardContent, Chip, Rating, IconButton,
  Fade, alpha, Divider
} from '@mui/material';
import {
  ArrowBack, Star, Schedule, EventSeat, 
  ConfirmationNumber, AccessTime, CalendarToday,
  Payment, Security, CheckCircle
} from '@mui/icons-material';
import { fetchMovie, clearCurrentMovie } from '../redux/movieSlice';
import { bookTicket, fetchBookedSeats, clearError, fetchUserBookings } from '../redux/bookingSlice';
import { sendBookingConfirmation } from '../services/api'; 

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
  const user = useSelector(state => state.user.currentUser);
  const [bookingId, setBookingId] = useState(null);

  // Helper functions for pricing
  const isPremiumSeat = (seatLabel) => {
    const row = seatLabel.charAt(0);
    return ['J', 'K', 'L'].includes(row); // Last 3 rows are premium
  };

  const calculateTotalPrice = () => {
    let total = 0;
    selectedSeats.forEach(seat => {
      total += isPremiumSeat(seat) ? 150 : 100; // Premium: ₹150, Standard: ₹100
    });
    return total;
  };

  const getPricingBreakdown = () => {
    const premiumSeats = selectedSeats.filter(seat => isPremiumSeat(seat));
    const standardSeats = selectedSeats.filter(seat => !isPremiumSeat(seat));
    
    let breakdown = [];
    if (standardSeats.length > 0) {
      breakdown.push(`${standardSeats.length} Standard @ ₹100`);
    }
    if (premiumSeats.length > 0) {
      breakdown.push(`${premiumSeats.length} Premium @ ₹150`);
    }
    
    return breakdown.join(' + ') || 'No seats selected';
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchMovie(id));
    }
    return () => {
      dispatch(clearCurrentMovie());
      dispatch(clearError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedDate && selectedTime && id) {
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
    if (bookingConfirmed && user && bookingId) {
      const sendEmail = async () => {
        try {
          const response = await sendBookingConfirmation({
            bookingId,
            movieTitle: movie.title,
            seats: selectedSeats,
            date: selectedDate,
            time: selectedTime,
            totalPrice: calculateTotalPrice(),
            userEmail: user.email 
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
          alert(`Failed to send confirmation email. Please check your bookings in your profile.`);
        }
      };
  
      sendEmail();
    } else if (bookingConfirmed && !user) {
      console.error('User not logged in, cannot send confirmation email');
      alert('Booking successful, but we couldn\'t send a confirmation email because you\'re not logged in. Please check your bookings in your profile.');
    }
  }, [bookingConfirmed, movie, selectedSeats, selectedDate, selectedTime, user, bookingId]);

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
        time: selectedTime,
        totalPrice: calculateTotalPrice()
      })).unwrap();
      
      if (result.success) {
        setBookingId(result.booking._id);
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
    dispatch(fetchUserBookings()); 
    navigate('/profile');
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setEmailStatus(null);
  };

  const renderSeat = (seatLabel, seatNumber) => {
    const isBooked = bookedSeats.includes(seatLabel);
    const isSelected = selectedSeats.includes(seatLabel);

    return (
      <Paper
        key={seatLabel}
        elevation={isSelected ? 8 : 2}
        sx={{
          width: 28,
          height: 28,
          bgcolor: 
            isBooked ? alpha('#666', 0.8) :
            isSelected ? '#FFD700' : alpha('#fff', 0.1),
          border: `2px solid ${
            isBooked ? alpha('#444', 0.8) :
            isSelected ? '#FFA500' : alpha('#fff', 0.2)
          }`,
          cursor: isBooked ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 1,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          flexShrink: 0,
          '&:hover': !isBooked ? {
            bgcolor: isSelected ? '#FFE55C' : alpha('#FFD700', 0.3),
            transform: 'scale(1.1)',
            boxShadow: `0 4px 12px ${alpha('#FFD700', 0.4)}`,
          } : {},
        }}
        onClick={() => handleSeatClick(seatLabel)}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            color: isBooked ? alpha('#fff', 0.5) : 
                   isSelected ? '#000' : alpha('#fff', 0.8),
            fontWeight: 600,
            fontSize: '0.6rem'
          }}
        >
          {seatNumber}
        </Typography>
      </Paper>
    );
  };

  const renderRow = (row) => (
    <Box key={row} sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 1, 
      gap: 1,
      justifyContent: 'center',
      width: '100%'
    }}>
      <Typography 
        sx={{ 
          width: 24, 
          textAlign: 'center',
          color: '#FFD700',
          fontWeight: 700,
          fontSize: '0.9rem',
          flexShrink: 0
        }}
      >
        {row}
      </Typography>
      <Box sx={{ 
        display: 'flex',
        gap: 0.5,
        justifyContent: 'center',
        flexWrap: 'wrap',
        maxWidth: '500px',
        width: '100%'
      }}>
        {Array.from({ length: 15 }, (_, i) => {
          const seatNumber = i + 1;
          const seatLabel = `${row}${seatNumber.toString().padStart(2, '0')}`;
          return renderSeat(seatLabel, seatNumber);
        })}
      </Box>
    </Box>
  );

  const renderSeats = () => {
    const rows = 'ABCDEFGHIJKL';
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        p: 2,
        background: `linear-gradient(135deg, 
          rgba(0, 0, 0, 0.4) 0%, 
          rgba(26, 26, 46, 0.3) 100%)`,
        borderRadius: 2,
        border: `1px solid ${alpha('#fff', 0.1)}`,
        backdropFilter: 'blur(10px)'
      }}>
        {/* Screen */}
        <Box sx={{ 
          mb: 2, 
          p: 1.5, 
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          borderRadius: 2,
          boxShadow: `0 4px 16px ${alpha('#FFD700', 0.6)}`,
          width: '60%',
          maxWidth: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '40px'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#000', 
              fontWeight: 700,
              textAlign: 'center',
              letterSpacing: '1px',
              fontSize: '0.9rem'
            }}
          >
            🎬 SCREEN 🎬
          </Typography>
        </Box>

        {/* Seats */}
        <Box sx={{ 
          width: '100%', 
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Standard Section */}
          <Box sx={{ mb: 2, width: '100%' }}>
            <Typography variant="body2" sx={{ 
              color: alpha('#fff', 0.7), 
              fontWeight: 600, 
              mb: 1, 
              textAlign: 'center',
              fontSize: '0.8rem'
            }}>
              STANDARD SECTION
            </Typography>
            {rows.slice(0, 9).split('').map((row) => renderRow(row))}
          </Box>

          {/* Premium Section */}
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            border: `1px solid ${alpha('#FFD700', 0.4)}`,
            background: `linear-gradient(135deg, ${alpha('#FFD700', 0.05)} 0%, ${alpha('#FFA500', 0.02)} 100%)`,
            width: '100%',
            backdropFilter: 'blur(5px)'
          }}>
            <Typography variant="body2" sx={{ 
              color: '#FFD700', 
              fontWeight: 700, 
              mb: 1, 
              textAlign: 'center',
              fontSize: '0.8rem'
            }}>
              🌟 PREMIUM SECTION 🌟
            </Typography>
            {rows.slice(9).split('').map((row) => renderRow(row))}
          </Box>
        </Box>

        {/* Seat Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          {[
            { color: alpha('#fff', 0.1), border: alpha('#fff', 0.2), label: 'Available', textColor: alpha('#fff', 0.8) },
            { color: '#FFD700', border: '#FFA500', label: 'Selected', textColor: '#000' },
            { color: alpha('#666', 0.8), border: alpha('#444', 0.8), label: 'Occupied', textColor: alpha('#fff', 0.5) }
          ].map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Paper sx={{ 
                width: 16, 
                height: 16, 
                bgcolor: item.color,
                border: `1px solid ${item.border}`,
                borderRadius: 0.5
              }} />
              <Typography variant="caption" sx={{ color: item.textColor, fontWeight: 500 }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const renderDateSelection = () => {
    const today = new Date();
    const dates = [
      today, 
      new Date(today.getTime() + 86400000), 
      new Date(today.getTime() + 172800000)
    ];
    
    return (
      <ToggleButtonGroup
        value={selectedDate}
        exclusive
        onChange={(e, newDate) => setSelectedDate(newDate)}
        aria-label="date selection"
        sx={{ gap: 1 }}
      >
        {dates.map((date, index) => (
          <ToggleButton 
            key={index} 
            value={date.toISOString().split('T')[0]} 
            aria-label={date.toDateString()}
            sx={{ 
              p: 1, 
              flexDirection: 'column',
              minWidth: 70,
              background: alpha('#fff', 0.05),
              border: `1px solid ${alpha('#fff', 0.2)}`,
              color: alpha('#fff', 0.8),
              borderRadius: 1,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&.Mui-selected': { 
                bgcolor: '#FFD700',
                color: '#000',
                fontWeight: 700,
                boxShadow: `0 2px 8px ${alpha('#FFD700', 0.4)}`,
                '&:hover': {
                  bgcolor: '#FFE55C',
                }
              },
              '&:hover': {
                bgcolor: alpha('#FFD700', 0.1),
              }
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {date.getDate()}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
              {date.toLocaleDateString('en-US', { month: 'short' })}
            </Typography>
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
        sx={{ gap: 1, flexWrap: 'wrap' }}
      >
        {timeSlots.map((time, index) => (
          <ToggleButton 
            key={index} 
            value={time} 
            aria-label={time}
            sx={{ 
              px: 2,
              py: 1,
              background: alpha('#fff', 0.05),
              border: `1px solid ${alpha('#fff', 0.2)}`,
              color: alpha('#fff', 0.8),
              borderRadius: 1,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&.Mui-selected': { 
                bgcolor: '#FFD700',
                color: '#000',
                fontWeight: 700,
                boxShadow: `0 2px 8px ${alpha('#FFD700', 0.4)}`,
                '&:hover': {
                  bgcolor: '#FFE55C',
                }
              },
              '&:hover': {
                bgcolor: alpha('#FFD700', 0.1),
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime sx={{ fontSize: '0.9rem' }} />
              <Typography variant="body2">{time}</Typography>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  };

  if (loading) return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      sx={{
        background: `linear-gradient(135deg, 
          #0a0a0a 0%, 
          #1a1a2e 25%, 
          #16213e 50%, 
          #1a1a2e 75%, 
          #0a0a0a 100%)`
      }}
    >
      <Typography variant="h4" sx={{ 
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Preparing Your Premium Booking Experience...
      </Typography>
    </Box>
  );

  if (error) return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          #0a0a0a 0%, 
          #1a1a2e 25%, 
          #16213e 50%, 
          #1a1a2e 75%, 
          #0a0a0a 100%)`,
        pt: 4
      }}
    >
      <Container>
        <Typography color="error" variant="h5" align="center" sx={{ color: '#ff5252' }}>
          {error}
        </Typography>
      </Container>
    </Box>
  );

  if (!movie) return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          #0a0a0a 0%, 
          #1a1a2e 25%, 
          #16213e 50%, 
          #1a1a2e 75%, 
          #0a0a0a 100%)`,
        pt: 4
      }}
    >
      <Container>
        <Typography variant="h5" align="center" sx={{ color: alpha('#fff', 0.7) }}>
          Movie not found
        </Typography>
      </Container>
    </Box>
  );

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          #0a0a0a 0%, 
          #1a1a2e 25%, 
          #16213e 50%, 
          #1a1a2e 75%, 
          #0a0a0a 100%)`,
        pt: 2,
        pb: 4
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Button 
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ 
              color: alpha('#fff', 0.8),
              mb: 2,
              '&:hover': { 
                color: '#FFD700',
                background: alpha('#FFD700', 0.1)
              }
            }}
          >
            Back to Movie Details
          </Button>

          {/* Compact Movie Header */}
          <Card 
            sx={{
              background: `linear-gradient(135deg, 
                rgba(255, 215, 0, 0.1) 0%, 
                rgba(255, 165, 0, 0.05) 100%)`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha('#FFD700', 0.2)}`,
              borderRadius: 2,
              mb: 2
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={9}>
                  <Typography 
                    variant="h5" 
                    sx={{
                      color: '#FFD700',
                      fontWeight: 700,
                      mb: 1,
                      fontFamily: '"Cinzel", "Georgia", serif',
                    }}
                  >
                    {movie.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip 
                      label={movie.language} 
                      size="small"
                      sx={{ 
                        background: alpha('#FFD700', 0.2),
                        color: '#FFD700',
                        fontWeight: 600
                      }} 
                    />
                    <Chip 
                      label={movie.category} 
                      size="small"
                      sx={{ 
                        background: alpha('#4FC3F7', 0.2),
                        color: '#4FC3F7',
                        fontWeight: 600
                      }} 
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating 
                        value={movie.rating || 4.5} 
                        precision={0.1} 
                        readOnly 
                        size="small"
                        sx={{
                          '& .MuiRating-iconFilled': { color: '#FFD700' },
                          '& .MuiRating-iconEmpty': { color: alpha('#FFD700', 0.3) }
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600 }}>
                        {movie.rating?.toFixed(1) || '4.5'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box 
                    component="img"
                    src={movie.images.poster}
                    alt={movie.title}
                    sx={{
                      width: '100%',
                      maxWidth: 120,
                      height: 'auto',
                      borderRadius: 1,
                      boxShadow: `0 4px 16px ${alpha('#000', 0.3)}`,
                      ml: 'auto',
                      display: 'block'
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {fetchError && (
          <Alert 
            severity="error" 
            onClose={() => setFetchError(null)}
            sx={{ 
              mb: 2,
              background: alpha('#f44336', 0.1),
              color: '#ff5252',
              border: `1px solid ${alpha('#f44336', 0.2)}`
            }}
          >
            {fetchError}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Left Column - Selection */}
          <Grid item xs={12} lg={8}>
            {/* Compact Selection Row */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* Date Selection */}
              <Grid item xs={12} md={4}>
                <Card sx={{ 
                  background: alpha('#fff', 0.05),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha('#fff', 0.1)}`
                }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography variant="body1" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                      <CalendarToday sx={{ fontSize: '1rem' }} />
                      Select Date
                    </Typography>
                    {renderDateSelection()}
                  </CardContent>
                </Card>
              </Grid>

              {/* Time Selection */}
              <Grid item xs={12} md={8}>
                <Card sx={{ 
                  background: alpha('#fff', 0.05),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha('#fff', 0.1)}`
                }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography variant="body1" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                      <Schedule sx={{ fontSize: '1rem' }} />
                      Select Showtime
                    </Typography>
                    {renderTimeSelection()}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Seat Selection */}
            <Card sx={{ 
              background: alpha('#fff', 0.05),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha('#fff', 0.1)}`
            }}>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="body1" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                  <EventSeat sx={{ fontSize: '1rem' }} />
                  Choose Your Premium Seats
                </Typography>
                {renderSeats()}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Booking Summary */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              position: 'sticky',
              top: 20,
              background: `linear-gradient(135deg, 
                rgba(255, 215, 0, 0.1) 0%, 
                rgba(255, 165, 0, 0.05) 100%)`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha('#FFD700', 0.2)}`
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ConfirmationNumber />
                  Booking Summary
                </Typography>

                <Divider sx={{ my: 1.5, borderColor: alpha('#FFD700', 0.2) }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 0.5 }}>
                    Selected Seats: <span style={{ color: '#FFD700', fontWeight: 600 }}>{selectedSeats.length}</span>
                  </Typography>
                  {selectedSeats.length > 0 && (
                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.8) }}>
                      {selectedSeats.join(', ')}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 0.5 }}>
                    Date: <span style={{ color: '#FFD700', fontWeight: 600 }}>
                      {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Not selected'}
                    </span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                    Time: <span style={{ color: '#FFD700', fontWeight: 600 }}>
                      {selectedTime || 'Not selected'}
                    </span>
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5, borderColor: alpha('#FFD700', 0.2) }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 0.5 }}>
                    Total: ₹{calculateTotalPrice()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                    {getPricingBreakdown()}
                  </Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={confirmationChecked}
                      onChange={(e) => setConfirmationChecked(e.target.checked)}
                      sx={{
                        color: alpha('#FFD700', 0.5),
                        '&.Mui-checked': { color: '#FFD700' }
                      }}
                    />
                  }
                  label={
                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.8) }}>
                      I confirm arrival 1 hour early and agree to terms
                    </Typography>
                  }
                  sx={{ mb: 2 }}
                />

                <Button 
                  variant="contained" 
                  fullWidth
                  size="large"
                  startIcon={<Payment />}
                  onClick={handleBooking} 
                  disabled={!confirmationChecked || !selectedDate || !selectedTime || selectedSeats.length === 0}
                  sx={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#000',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '0.9rem',
                    boxShadow: `0 4px 15px ${alpha('#FFD700', 0.4)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FFE55C 0%, #FFB347 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 20px ${alpha('#FFD700', 0.6)}`,
                    },
                    '&:disabled': {
                      background: alpha('#666', 0.3),
                      color: alpha('#fff', 0.3),
                      transform: 'none',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Confirm Booking
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1.5, gap: 0.5 }}>
                  <Security sx={{ color: alpha('#fff', 0.5), fontSize: '0.9rem' }} />
                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.5) }}>
                    Secure payment protected
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <Dialog 
          open={openConfirmation} 
          onClose={handleCloseConfirmation}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: `linear-gradient(135deg, 
                rgba(26, 26, 46, 0.95) 0%, 
                rgba(22, 33, 62, 0.95) 100%)`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha('#FFD700', 0.2)}`,
              borderRadius: 3
            }
          }}
        >
          <DialogTitle sx={{ 
            background: `linear-gradient(135deg, 
              rgba(255, 215, 0, 0.1) 0%, 
              rgba(255, 165, 0, 0.05) 100%)`,
            color: '#FFD700',
            fontWeight: 700,
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <CheckCircle sx={{ color: '#4CAF50', fontSize: '2rem' }} />
            Booking Confirmed!
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Fade in={openConfirmation} timeout={500}>
              <Box>
                <Typography variant="body1" sx={{ color: alpha('#fff', 0.9), mb: 2 }}>
                  🎉 Congratulations! Your premium seats have been successfully booked for:
                </Typography>
                
                <Card sx={{ 
                  background: alpha('#FFD700', 0.1),
                  border: `1px solid ${alpha('#FFD700', 0.3)}`,
                  mb: 3
                }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700, mb: 1 }}>
                      {movie.title}
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                          Booking ID
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#FFD700', fontWeight: 600 }}>
                          {bookingId}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                          Date & Time
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                          {selectedDate && new Date(selectedDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                          {selectedTime}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                          Seats
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                          {selectedSeats.join(', ')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                          Total Amount
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#FFD700', fontWeight: 700 }}>
                          ₹{calculateTotalPrice()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.5) }}>
                          {getPricingBreakdown()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <Alert 
                  severity="info" 
                  icon={<ConfirmationNumber />}
                  sx={{ 
                    background: alpha('#2196F3', 0.1),
                    color: '#64B5F6',
                    border: `1px solid ${alpha('#2196F3', 0.3)}`,
                    mb: 2
                  }}
                >
                  <Typography variant="body2">
                    📧 A confirmation email with your booking details has been sent to your registered email address.
                  </Typography>
                </Alert>

                <Alert 
                  severity="warning" 
                  sx={{ 
                    background: alpha('#FF9800', 0.1),
                    color: '#FFB74D',
                    border: `1px solid ${alpha('#FF9800', 0.3)}`
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ⏰ Important: Please arrive 1 hour early and complete payment at the venue to confirm your booking.
                  </Typography>
                </Alert>
              </Box>
            </Fade>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={handleCloseConfirmation}
              variant="contained"
              fullWidth
              sx={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                fontWeight: 700,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFE55C 0%, #FFB347 100%)',
                }
              }}
            >
              View My Bookings
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Email Status Snackbar */}
        <Snackbar
          open={emailStatus !== null}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={emailStatus === 'success' ? 'success' : 'error'}
            sx={{ 
              width: '100%',
              background: emailStatus === 'success' ? 
                alpha('#4CAF50', 0.9) : alpha('#f44336', 0.9),
              color: 'white'
            }}
          >
            {emailStatus === 'success'
              ? '✅ Confirmation email sent successfully!'
              : '❌ Failed to send confirmation email. Please check your profile for booking details.'}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default TicketBooking;