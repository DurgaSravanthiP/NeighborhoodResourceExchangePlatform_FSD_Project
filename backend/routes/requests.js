const express = require('express');
const router = express.Router();
const { createRequest, getReceivedRequests, getSentRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createRequest);
router.get('/received', protect, getReceivedRequests);
router.get('/sent', protect, getSentRequests);
router.put('/:id/status', protect, updateRequestStatus);

module.exports = router;
