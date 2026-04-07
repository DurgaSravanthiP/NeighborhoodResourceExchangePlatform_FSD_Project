const BorrowRequest = require('../models/BorrowRequest');
const Item = require('../models/Item');
const Message = require('../models/Message');

// @POST /api/requests
const createRequest = async (req, res) => {
  try {
    const { itemId, message } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.availabilityStatus !== 'available')
      return res.status(400).json({ message: 'Item is not available' });
    if (item.ownerId.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'You cannot borrow your own item' });

    const existing = await BorrowRequest.findOne({
      itemId, borrowerId: req.user._id, status: 'pending'
    });
    if (existing) return res.status(400).json({ message: 'Request already sent' });

    const request = await BorrowRequest.create({
      itemId, borrowerId: req.user._id,
      ownerId: item.ownerId, message,
    });

    // Create an associated Chat Message to kick off the conversation
    const chatMsg = message && message.trim().length > 0 ? message : `Hi! I would like to borrow your ${item.title}.`;
    await Message.create({
      senderId: req.user._id,
      receiverId: item.ownerId,
      message: chatMsg,
      requestId: request._id
    });

    await request.populate(['itemId', 'borrowerId', 'ownerId']);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/requests/received  (owner sees requests for their items)
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ ownerId: req.user._id })
      .populate('itemId', 'title image category')
      .populate('borrowerId', 'name email profileImage location')
      .sort('-createdAt');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/requests/sent  (borrower sees own requests)
const getSentRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ borrowerId: req.user._id })
      .populate('itemId', 'title image category')
      .populate('ownerId', 'name email profileImage location')
      .sort('-createdAt');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/requests/:id/status
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    request.status = status;
    await request.save();

    // Update item availability
    if (status === 'approved') {
      await Item.findByIdAndUpdate(request.itemId, { availabilityStatus: 'borrowed' });
    } else if (status === 'returned' || status === 'rejected') {
      await Item.findByIdAndUpdate(request.itemId, { availabilityStatus: 'available' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, getReceivedRequests, getSentRequests, updateRequestStatus };
