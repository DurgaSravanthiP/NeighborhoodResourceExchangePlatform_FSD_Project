const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Tools', 'Books', 'Electronics', 'Appliances', 'Sports', 'Garden', 'Kitchen', 'Other'],
    required: true
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  availabilityStatus: { type: String, enum: ['available', 'borrowed'], default: 'available' },
  image: { type: String, default: '' },
  location: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
