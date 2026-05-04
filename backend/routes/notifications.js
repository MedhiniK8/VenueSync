const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const {
  getAdminNotifications,
  getMyNotifications,
  markAsRead
} = require('../controllers/notificationController');

const router = express.Router();

router.use(authMiddleware);
router.get('/mine', getMyNotifications);
router.get('/admin', adminOnly, getAdminNotifications);
router.patch('/:id/read', markAsRead);

module.exports = router;
