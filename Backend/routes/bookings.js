const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const { sendBookingConfirmationEmail } = require('../utils/emailService');


// Create a new booking
router.post('/', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { movieId, date, time, seats } = req.body;

    // Check if any of the seats are already booked
    const existingBookings = await Booking.find({
      movie: movieId,
      date: new Date(date),
      time,
      seats: { $in: seats },
      status: 'active'
    }).session(session);

    if (existingBookings.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Some seats are already booked' });
    }

    const booking = new Booking({
      user: req.user.id,
      movie: movieId,
      date: new Date(date),
      time,
      seats
    });

    await booking.save({ session });
    await session.commitTransaction();

    res.status(201).json({ success: true, booking });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
});

// Get all bookings for a user
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('movie');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel a booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get booked seats for a movie on a specific date and time
router.get('/movie/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { date, time } = req.query;

    if (!movieId || !date || !time) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const bookings = await Booking.find({ 
      movie: movieId, 
      date: new Date(date), 
      time, 
      status: 'active' 
    });

    const bookedSeats = bookings.reduce((acc, booking) => [...acc, ...booking.seats], []);
    res.json(bookedSeats);
  } catch (error) {
    console.error('Error in /movie/:movieId route:', error);
    res.status(500).json({ message: 'An error occurred while fetching booked seats' });
  }
});

// Get all bookings (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').populate('movie', 'title');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a booking (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Route to send booking confirmation
router.post('/send-confirmation', auth, async (req, res) => {
  try {
    const { movieTitle, seats, date, time, totalPrice } = req.body;
    const userEmail = req.user.email; // Assuming you have the user's email from auth middleware

    const emailSent = await sendBookingConfirmationEmail(userEmail, {
      movieTitle,
      seats,
      date,
      time,
      totalPrice
    });

    if (emailSent) {
      res.status(200).json({ message: 'Confirmation email sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send confirmation email' });
    }
  } catch (error) {
    console.error('Error in send-confirmation route:', error);
    res.status(500).json({ message: 'Server error while sending confirmation email' });
  }
});

module.exports = router;