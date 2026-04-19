const Notification = require('../models/Notification');

// @GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name profileImage')
      .sort('-createdAt')
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to create and emit notification
const createNotification = async (app, data) => {
  try {
    const notification = await Notification.create(data);
    const populated = await notification.populate('sender', 'name profileImage');
    
    const io = app.get('io');
    const onlineUsers = app.get('onlineUsers');
    const recipientSocket = onlineUsers.get(data.recipient.toString());
    
    if (recipientSocket) {
      io.to(recipientSocket).emit('newNotification', populated);
    }
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = { getNotifications, markAsRead, createNotification };
