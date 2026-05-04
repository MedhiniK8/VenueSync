const Venue = require('../models/Venue');

const getVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ isActive: true }).sort({ name: 1 });
    return res.json(venues);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load venues' });
  }
};

const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    return res.json(venue);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load venue' });
  }
};

module.exports = { getVenues, getVenueById };
