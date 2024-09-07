const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, date, seats } = req.body;
    const booking = new Booking({
      user: req.user.id,
      movie: movieId,
      date,
      seats
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Get all bookings (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Add admin check here
    const bookings = await Booking.find().populate('user', 'name email').populate('movie', 'title');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a booking (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Add admin check here
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;