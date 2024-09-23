import React, { useEffect, useState } from 'react';
import { getAllBookings, deleteBooking } from '../services/api';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getAllBookings()
      .then(response => setBookings(response.data))
      .catch(error => console.error('Error fetching bookings:', error));
  }, []);

  const handleDelete = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBooking(bookingId)
        .then(() => {
          setBookings(bookings.filter(booking => booking._id !== bookingId));
        })
        .catch(error => console.error('Error deleting booking:', error));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Booking Management</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Movie Title</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Seats</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map(booking => (
                <TableRow key={booking._id}>
                  <TableCell>{booking._id}</TableCell>
                  <TableCell>{booking.movie.title}</TableCell>
                  {/* <TableCell>{booking.user.name}</TableCell> */}
                  <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.seats.join(', ')}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>
                    <Button color="secondary" onClick={() => handleDelete(booking._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default BookingList;
