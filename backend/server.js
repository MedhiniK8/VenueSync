require('dotenv').config();
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const seed = require('./seed');

const authRoutes = require('./routes/auth');
const venueRoutes = require('./routes/venues');
const bookingRoutes = require('./routes/bookings');
const notificationRoutes = require('./routes/notifications');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    if (process.env.SEED_DB === 'true') {
      await seed();
    }

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
