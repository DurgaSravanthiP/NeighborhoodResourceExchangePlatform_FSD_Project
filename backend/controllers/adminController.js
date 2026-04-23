const User = require('../models/User');
const Item = require('../models/Item');
const BorrowRequest = require('../models/BorrowRequest');

// @GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/admin/items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({}).populate('ownerId', 'name email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/admin/requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({})
      .populate('borrowerId', 'name email')
      .populate('itemId', 'title ownerId');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }
      await User.deleteOne({ _id: user._id });
      // Optionally delete user's items and requests
      await Item.deleteMany({ owner: user._id });
      await BorrowRequest.deleteMany({ requester: user._id });
      res.json({ message: 'User and associated data removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/admin/items/:id
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      await Item.deleteOne({ _id: item._id });
      await BorrowRequest.deleteMany({ item: item._id });
      res.json({ message: 'Item and associated requests removed' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/admin/requests/:id
const deleteRequest = async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (request) {
      await BorrowRequest.deleteOne({ _id: request._id });
      res.json({ message: 'Borrow request removed' });
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllItems,
  getAllRequests,
  deleteUser,
  deleteItem,
  deleteRequest,
};
