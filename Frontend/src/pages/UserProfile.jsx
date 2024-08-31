import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';

const UserProfile = () => {
  // In a real app, this data would come from your state management (e.g., Redux)
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bookings: [
      { id: 1, movie: 'Inception', date: '2023-06-15', seats: 2 },
      { id: 2, movie: 'The Shawshank Redemption', date: '2023-06-20', seats: 1 },
    ],
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>User Profile</Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Personal Information</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography>Name: {user.name}</Typography>
          <Typography>Email: {user.email}</Typography>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Booking History</Typography>
        {user.bookings.map((booking) => (
          <Box key={booking.id} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography>Movie: {booking.movie}</Typography>
            <Typography>Date: {booking.date}</Typography>
            <Typography>Seats: {booking.seats}</Typography>
            <Button variant="outlined" size="small" sx={{ mt: 1 }}>
              Cancel Booking
            </Button>
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default UserProfile;