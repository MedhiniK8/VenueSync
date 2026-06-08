const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const { createVenue, getVenueById, getVenues } = require('../controllers/venueController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getVenues);
router.post('/', adminOnly, createVenue);
router.get('/:id', getVenueById);

module.exports = router;
