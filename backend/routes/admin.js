const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllItems,
  getAllRequests,
  deleteUser,
  deleteItem,
  deleteRequest,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);
router.use(admin);

router.route('/users').get(getAllUsers);
router.route('/users/:id').delete(deleteUser);

router.route('/items').get(getAllItems);
router.route('/items/:id').delete(deleteItem);

router.route('/requests').get(getAllRequests);
router.route('/requests/:id').delete(deleteRequest);

module.exports = router;
