const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    // req.file.path contains the uploaded Cloudinary URL
    res.status(200).json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

module.exports = router;
