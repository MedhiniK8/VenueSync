const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetRole: { type: String },
    message: { type: String, required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    read: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('Notification', notificationSchema);
