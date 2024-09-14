import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { getUser, getUserBookings } from '../services/api';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        const userBookings = await getUserBookings();
        setUser(userData);
        setBookings(userBookings);
      } catch (error) {
        setError('Failed to load user data');
      }
    };
    fetchUserData();
  }, []);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4">{user.name}'s Profile</Typography>
      <Box mt={4}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h6">Email: {user.email}</Typography>
          <Typography variant="h6">Bookings:</Typography>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <Box key={booking.id} mt={2}>
                <Typography>
                  Movie: {booking.movie.title} | Date: {booking.date} | Seats: {booking.seats}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No bookings found.</Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default UserProfile;
