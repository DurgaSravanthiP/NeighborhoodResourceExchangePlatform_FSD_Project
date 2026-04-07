const Item = require('../models/Item');

// @GET /api/items
const getItems = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (status) query.availabilityStatus = status;
    if (search) query.title = { $regex: search, $options: 'i' };

    const items = await Item.find(query)
      .populate('ownerId', 'name email location profileImage')
      .sort('-createdAt');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/items/:id
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('ownerId', 'name email location profileImage');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/items
const createItem = async (req, res) => {
  try {
    const { title, description, category, location, image } = req.body;
    const item = await Item.create({
      title, description, category, location, image,
      ownerId: req.user._id,
    });
    const populated = await item.populate('ownerId', 'name email location');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/items/:id
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/items/:id
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/items/my-items
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ ownerId: req.user._id }).sort('-createdAt');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem, getMyItems };
