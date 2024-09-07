const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  date: { type: Date, required: true },
  seats: { type: Number, required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' }
});

module.exports = mongoose.model('Booking', BookingSchema);