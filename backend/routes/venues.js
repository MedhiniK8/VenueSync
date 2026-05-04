const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getVenueById, getVenues } = require('../controllers/venueController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getVenues);
router.get('/:id', getVenueById);

module.exports = router;
