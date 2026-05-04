const Booking = require('../models/Booking');

const toMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const normalizeDate = (inputDate) => {
  const date = new Date(inputDate);
  date.setHours(0, 0, 0, 0);
  return date;
};

const checkSlotAvailability = async (venueId, eventDate, startTime, endTime) => {
  const reqStart = toMinutes(startTime);
  const reqEnd = toMinutes(endTime);
  const normalizedDate = normalizeDate(eventDate);

  const existingBookings = await Booking.find({
    venueId,
    eventDate: normalizedDate,
    status: { $in: ['pending', 'approved'] }
  });

  for (const booking of existingBookings) {
    const exStart = toMinutes(booking.startTime);
    const exEnd = toMinutes(booking.endTime);

    if (reqStart < exEnd && reqEnd > exStart) {
      return { available: false, conflictingBooking: booking };
    }
  }

  return { available: true };
};

module.exports = { checkSlotAvailability, normalizeDate, toMinutes };
