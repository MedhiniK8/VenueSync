const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Venue = require('../models/Venue');
const User = require('../models/User');
const { parsePositiveInteger } = require('../utils/validation');
const { checkSlotAvailability, normalizeDate, toMinutes } = require('../utils/checkAvailability');

const bookingPopulation = [
  { path: 'venueId', select: 'name capacity type imageUrl' },
  { path: 'userId', select: 'name email role department phone' }
];

const createNotification = async ({ userId, targetRole, message, bookingId }) => {
  await Notification.create({ userId, targetRole, message, bookingId });
};

const checkAvailability = async (req, res) => {
  try {
    const { venueId, eventDate, startTime, endTime } = req.body;
    if (!venueId || !eventDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required availability fields' });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ message: 'End Time must be after Start Time' });
    }

    const result = await checkSlotAvailability(venueId, eventDate, startTime, endTime);
    if (!result.available) {
      return res.json({
        available: false,
        message: 'This slot is already booked',
        conflictingBooking: result.conflictingBooking
      });
    }

    return res.json({ available: true });
  } catch (error) {
    return res.status(500).json({ message: 'Availability check failed' });
  }
};

const createBooking = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const venue = await Venue.findById(req.body.venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const capacityRequired = parsePositiveInteger(req.body.capacityRequired || req.body.capacity);
    const expectedCrowd = parsePositiveInteger(req.body.expectedCrowd);

    if (!capacityRequired) {
      return res.status(400).json({ message: 'Capacity required must be a number greater than zero' });
    }

    if (!expectedCrowd) {
      return res.status(400).json({ message: 'Expected number of participants must be a number greater than zero' });
    }

    if (capacityRequired > venue.capacity) {
      return res.status(400).json({ message: 'Capacity required cannot exceed venue capacity' });
    }

    if (req.body.startTime >= req.body.endTime) {
      return res.status(400).json({ message: 'End Time must be after Start Time' });
    }

    const availability = await checkSlotAvailability(req.body.venueId, req.body.eventDate, req.body.startTime, req.body.endTime);

    if (!availability.available) {
      const conflictingBooking = availability.conflictingBooking;

      if (conflictingBooking.status === 'approved') {
        return res.status(409).json({ message: 'This slot is already booked' });
      }

      const incomingPriority = req.user.role === 'teacher' ? 2 : 1;
      if (incomingPriority <= Number(conflictingBooking.priority || 1)) {
        return res.status(409).json({ message: 'This slot is already booked' });
      }

      const normalizedDate = normalizeDate(req.body.eventDate);
      const reqStart = toMinutes(req.body.startTime);
      const reqEnd = toMinutes(req.body.endTime);

      const lowerPriorityConflicts = await Booking.find({
        venueId: req.body.venueId,
        eventDate: normalizedDate,
        status: 'pending'
      });

      const overrideTargets = lowerPriorityConflicts.filter((booking) => {
        const exStart = toMinutes(booking.startTime);
        const exEnd = toMinutes(booking.endTime);
        return reqStart < exEnd && reqEnd > exStart && Number(booking.priority || 1) < incomingPriority;
      });

      if (overrideTargets.length === 0) {
        return res.status(409).json({ message: 'This slot is already booked' });
      }

      const booking = await Booking.create({
        ...req.body,
        eventDate: normalizedDate,
        userId: req.user.userId,
        userRole: req.user.role,
        priority: incomingPriority,
        capacityRequired,
        expectedCrowd,
        status: 'pending'
      });

      await Promise.all(
        overrideTargets.map(async (conflict) => {
          conflict.status = 'rejected';
          conflict.adminRemarks = `Overridden by a higher-priority booking (${user.role === 'teacher' ? 'Teacher' : 'Student'})`;
          await conflict.save();
          await createNotification({
            userId: conflict.userId,
            message: `Your booking for this venue has been rejected. Reason: ${conflict.adminRemarks}`,
            bookingId: conflict._id
          });
        })
      );

      await createNotification({
        targetRole: 'admin',
        message: `${user.name} requested ${venue.name} on ${normalizedDate.toISOString().split('T')[0]} at ${req.body.startTime}`,
        bookingId: booking._id
      });

      return res.status(201).json(booking);
    }

    const booking = await Booking.create({
      ...req.body,
      eventDate: normalizeDate(req.body.eventDate),
      userId: req.user.userId,
      userRole: req.user.role,
      priority: req.user.role === 'teacher' ? 2 : 1,
      capacityRequired,
      expectedCrowd,
      status: 'pending'
    });

    await createNotification({
      targetRole: 'admin',
      message: `${user.name} requested ${venue.name} on ${normalizeDate(req.body.eventDate).toISOString().split('T')[0]} at ${req.body.startTime}`,
      bookingId: booking._id
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create booking' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate(bookingPopulation);

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load bookings' });
  }
};

const getMyStats = async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      Booking.countDocuments({ userId: req.user.userId }),
      Booking.countDocuments({ userId: req.user.userId, status: 'pending' }),
      Booking.countDocuments({ userId: req.user.userId, status: 'approved' }),
      Booking.countDocuments({ userId: req.user.userId, status: 'rejected' })
    ]);

    return res.json({ total, pending, approved, rejected });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load stats' });
  }
};

const getVenueBookings = async (req, res) => {
  try {
    const query = { venueId: req.params.venueId };
    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await Booking.find(query)
      .sort({ eventDate: 1, startTime: 1 })
      .populate(bookingPopulation);

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load venue bookings' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .populate(bookingPopulation);

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load bookings' });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const today = normalizeDate(new Date());
    const [totalBookings, pendingRequests, approvedToday, rejectedTotal] = await Promise.all([
      Booking.countDocuments({}),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'approved', createdAt: { $gte: today } }),
      Booking.countDocuments({ status: 'rejected' })
    ]);

    const recentActivity = await Booking.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate(bookingPopulation);

    return res.json({ totalBookings, pendingRequests, approvedToday, rejectedTotal, recentActivity });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load admin stats' });
  }
};

const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('venueId userId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'approved';
    booking.adminRemarks = undefined;
    await booking.save();

    await createNotification({
      userId: booking.userId._id,
      message: `Your booking for ${booking.venueId.name} on ${booking.eventDate.toISOString().split('T')[0]} has been approved!`,
      bookingId: booking._id
    });

    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to approve booking' });
  }
};

const rejectBooking = async (req, res) => {
  try {
    const { remarks } = req.body;
    if (!remarks) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const booking = await Booking.findById(req.params.id).populate('venueId userId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'rejected';
    booking.adminRemarks = remarks;
    await booking.save();

    await createNotification({
      userId: booking.userId._id,
      message: `Your booking for ${booking.venueId.name} on ${booking.eventDate.toISOString().split('T')[0]} has been rejected. Reason: ${remarks}`,
      bookingId: booking._id
    });

    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to reject booking' });
  }
};

module.exports = {
  checkAvailability,
  createBooking,
  getMyBookings,
  getMyStats,
  getVenueBookings,
  getAllBookings,
  getAdminStats,
  approveBooking,
  rejectBooking
};
