const Message = require('../models/Message');
const Notification = require('../models/Notification');

// @GET /api/messages/:userId  — get conversation with a specific user
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id },
      ]
    })
      .populate('senderId', 'name profileImage')
      .populate('receiverId', 'name profileImage')
      .sort('timestamp');
    const validMessages = messages.filter(msg => msg.senderId && msg.receiverId);
    res.json(validMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message, requestId } = req.body;
    const msg = await Message.create({
      senderId: req.user._id, receiverId, message, requestId,
    });
    await msg.populate(['senderId', 'receiverId']);

    // Create Notification
    const notification = await Notification.create({
      recipient: receiverId,
      sender: req.user._id,
      type: 'MESSAGE_NEW',
      message: `${req.user.name} sent you a new message`,
      link: `/messages/${req.user._id}`
    });

    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('newNotification', notification);
    }

    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/messages/conversations  — list of unique conversation partners
const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
    }).populate('senderId', 'name profileImage').populate('receiverId', 'name profileImage')
      .sort('-timestamp');

    const seen = new Set();
    const conversationsMap = new Map();
    for (const msg of messages) {
      if (!msg.senderId || !msg.receiverId) continue;
      const other = msg.senderId._id.toString() === req.user._id.toString()
        ? msg.receiverId : msg.senderId;
      if (!seen.has(other._id.toString())) {
        seen.add(other._id.toString());
        conversationsMap.set(other._id.toString(), {
          user: other,
          lastMessage: msg.message,
          timestamp: msg.timestamp,
          lastMessageStatus: msg.status,
          lastMessageSender: msg.senderId._id.toString()
        });
      }
    }

    // Get unread counts
    const conversations = [];
    for (const [otherId, conv] of conversationsMap.entries()) {
      const unreadCount = await Message.countDocuments({
        senderId: otherId,
        receiverId: req.user._id,
        status: { $ne: 'seen' }
      });
      conversations.push({ ...conv, unreadCount });
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, sendMessage, getConversations };
