const Notification = require('../models/Notification');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('bookingId');

    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load notifications' });
  }
};

const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ targetRole: 'admin' })
      .sort({ createdAt: -1 })
      .populate('bookingId');

    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load admin notifications' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.json(notification);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update notification' });
  }
};

module.exports = { getMyNotifications, getAdminNotifications, markAsRead };
