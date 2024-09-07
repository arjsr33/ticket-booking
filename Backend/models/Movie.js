const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  images: {
    poster: String,
    cover: String,
    square: String
  },
  category: String,
  language: String,
  description: String,
  cast: [String],
  reviews: [String],
  rating: Number
});

module.exports = mongoose.model('Movie', MovieSchema);
