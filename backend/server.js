require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
});

const onlineUsers = new Map();

// Make io accessible to controllers
app.set('io', io);
app.set('onlineUsers', onlineUsers);

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/', (req, res) => res.json({ message: '🏘️ Neighbourhood API Running' }));

// Socket.io — Real-time chat

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('userOnline', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  });

  socket.on('sendMessage', (data) => {
    const receiverSocket = onlineUsers.get(data.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('receiveMessage', data);
    }
  });

  socket.on('typing', ({ receiverId, senderName, senderId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) io.to(receiverSocket).emit('typing', { senderName, senderId });
  });

  socket.on('markDelivered', async ({ messageId, senderId }) => {
    try {
      await Message.findByIdAndUpdate(messageId, { status: 'delivered' });
      const senderSocket = onlineUsers.get(senderId);
      if (senderSocket) io.to(senderSocket).emit('messageStatus', { messageId, status: 'delivered' });
    } catch (err) {}
  });

  socket.on('markSeen', async ({ senderId, receiverId }) => {
    try {
      await Message.updateMany(
        { senderId, receiverId, status: { $ne: 'seen' } }, 
        { status: 'seen' }
      );
      const senderSocket = onlineUsers.get(senderId);
      if (senderSocket) io.to(senderSocket).emit('messagesSeen', { receiverId });
    } catch (err) {}
  });

  socket.on('disconnect', () => {
    for (const [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
