const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const users = require('./routes/users');
const movies = require('./routes/movies');
const bookings = require('./routes/bookings');
const app = express();

// Middleware
app.use(cors({
  origin: 'https://chadnibooking.vercel.app'
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/users', users);
app.use('/api/movies', movies);
app.use('/api/bookings', bookings);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));