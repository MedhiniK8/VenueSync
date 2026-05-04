const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    type: {
      type: String,
      enum: ['auditorium', 'seminar_hall', 'sports_arena', 'amphitheatre'],
      required: true
    },
    amenities: [{ type: String }],
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Venue', venueSchema);
