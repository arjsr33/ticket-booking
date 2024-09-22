import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../redux/userSlice';
import { fetchUserBookings, cancelUserBooking } from '../redux/bookingSlice';
import { Typography, Card, CardContent, Button, Grid, CircularProgress } from '@mui/material';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { userBookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchUserProfile());
    }
    dispatch(fetchUserBookings());
  }, [dispatch, currentUser]);

  const handleCancelBooking = (bookingId) => {
    dispatch(cancelUserBooking(bookingId));
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!currentUser) {
    return <Typography>Loading user profile...</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>User Profile</Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Name: {currentUser.name}</Typography>
          <Typography variant="body1">Email: {currentUser.email}</Typography>
          <Typography variant="body1">Role: {currentUser.role}</Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" style={{ marginTop: '2rem' }}>Booking History</Typography>
      {userBookings && userBookings.length > 0 ? (
        <Grid container spacing={2}>
          {userBookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{booking.movie?.title || 'Movie title unavailable'}</Typography>
                  <Typography>Booking ID: {booking._id}</Typography>
                  <Typography>Date: {new Date(booking.date).toLocaleDateString()}</Typography>
                  <Typography>Time: {booking.time}</Typography>
                  <Typography>Seats: {booking.seats?.join(', ') || 'N/A'}</Typography>
                  <Typography>Status: {booking.status}</Typography>
                  {booking.status === 'active' && (
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => handleCancelBooking(booking._id)}
                      style={{ marginTop: '1rem' }}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No bookings found.</Typography>
      )}
    </div>
  );
};

export default UserProfile;