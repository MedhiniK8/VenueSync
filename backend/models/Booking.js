const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userRole: { type: String },
    priority: { type: Number, default: 1 },
    eventName: { type: String, required: true },
    eventType: { type: String, enum: ['Workshop', 'Seminar', 'Hackathon', 'Meeting', 'Fest', 'Other'] },
    organizerName: { type: String, required: true },
    department: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    expectedCrowd: { type: Number, required: true },
    audienceType: { type: String, enum: ['Students', 'Faculty', 'External Guests', 'Mixed'] },
    purpose: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminRemarks: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('Booking', bookingSchema);
