import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MovieDetails from './components/MovieDetails';
import TicketBooking from './components/TicketBooking';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import UserList from './pages/UserList';
import BookingList from './pages/BookingList';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Container>
        <Box sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/book/:id" element={<TicketBooking />} />
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route index element={<CustomerDashboard />} />
            </Route>
            <Route path="/admin" element={<ProtectedRoute adminOnly />}>
              <Route index element={<AdminDashboard />} />
            </Route>
            <Route path="/admin/users" element={<ProtectedRoute adminOnly />}>
              <Route index element={<UserList />} />
            </Route>
            <Route path="/admin/bookings" element={<ProtectedRoute adminOnly />}>
              <Route index element={<BookingList />} />
            </Route>
            <Route path="/profile" element={<ProtectedRoute />}>
              <Route index element={<UserProfile />} />
            </Route>
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
