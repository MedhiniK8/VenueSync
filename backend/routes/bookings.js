const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { adminOnly, allowRoles } = require('../middleware/roleMiddleware');
const {
  approveBooking,
  checkAvailability,
  createBooking,
  getAdminStats,
  getAllBookings,
  getMyBookings,
  getMyStats,
  getVenueBookings,
  rejectBooking
} = require('../controllers/bookingController');

const router = express.Router();

router.use(authMiddleware);
router.post('/check-availability', allowRoles('student', 'teacher'), checkAvailability);
router.post('/', allowRoles('student', 'teacher'), createBooking);
router.get('/my-bookings', allowRoles('student', 'teacher'), getMyBookings);
router.get('/my-stats', allowRoles('student', 'teacher'), getMyStats);
router.get('/venue/:venueId', getVenueBookings);
router.get('/all', adminOnly, getAllBookings);
router.get('/admin-stats', adminOnly, getAdminStats);
router.patch('/:id/approve', adminOnly, approveBooking);
router.patch('/:id/reject', adminOnly, rejectBooking);

module.exports = router;
