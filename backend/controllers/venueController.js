const Venue = require('../models/Venue');
const { parsePositiveInteger } = require('../utils/validation');

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

const createVenue = async (req, res) => {
  try {
    const { name, capacity, type, amenities, imageUrl, isActive } = req.body;

    if (!name || !capacity || !type || !imageUrl) {
      return res.status(400).json({ message: 'Name, capacity, type, amenities, and image URL are required' });
    }

    const parsedCapacity = parsePositiveInteger(capacity);
    if (!parsedCapacity) {
      return res.status(400).json({ message: 'Capacity must be a number greater than zero' });
    }

    if (!['auditorium', 'seminar_hall', 'sports_arena', 'amphitheatre'].includes(type)) {
      return res.status(400).json({ message: 'Invalid venue type selected' });
    }

    const parsedAmenities = Array.isArray(amenities)
      ? amenities.map((item) => String(item).trim()).filter(Boolean)
      : String(amenities || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);

    if (parsedAmenities.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one amenity' });
    }

    try {
      new URL(imageUrl);
    } catch (error) {
      return res.status(400).json({ message: 'Please provide a valid image URL' });
    }

    const venue = await Venue.create({
      name: String(name).trim(),
      capacity: parsedCapacity,
      type,
      amenities: parsedAmenities,
      imageUrl: String(imageUrl).trim(),
      isActive: typeof isActive === 'boolean' ? isActive : true
    });

    return res.status(201).json({ message: 'Venue added successfully', venue });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add venue' });
  }
};

module.exports = { createVenue, getVenues, getVenueById };
