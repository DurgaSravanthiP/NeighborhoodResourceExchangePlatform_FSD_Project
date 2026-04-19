const Review = require('../models/Review');
const BorrowRequest = require('../models/BorrowRequest');
const Item = require('../models/Item');
const { createNotification } = require('./notificationController');

// @POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { requestId, rating, comment } = req.body;

    // 1. Check if the request exists and if the user is the borrower
    const request = await BorrowRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Borrow request not found' });
    
    if (request.borrowerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the borrower can leave a review' });
    }

    // 2. Check status (must be approved or returned)
    if (!['approved', 'returned'].includes(request.status)) {
      return res.status(400).json({ message: 'You can only review items that are currently borrowed or have been returned' });
    }

    // 3. Check if review already exists for this request
    const existing = await Review.findOne({ requestId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this transaction' });

    // 4. Create review
    const review = await Review.create({
      reviewerId: req.user._id,
      ownerId: request.ownerId,
      itemId: request.itemId,
      requestId,
      rating,
      comment
    });

    res.status(201).json(review);

    // 5. Mark request as reviewed
    request.reviewed = true;
    await request.save();

    // 6. Trigger Notification for owner
    await createNotification(req.app, {
      recipient: request.ownerId,
      sender: req.user._id,
      type: 'REVIEW_NEW',
      message: `${req.user.name} left a review for your ${request.itemId.title} ⭐`,
      link: `/items/${request.itemId._id}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/reviews/item/:itemId
const getItemReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ itemId: req.params.itemId })
      .populate('reviewerId', 'name profileImage')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/reviews/user/:userId (Reviews received by the user as an owner)
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ ownerId: req.params.userId })
      .populate('reviewerId', 'name profileImage')
      .populate('itemId', 'title')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getItemReviews, getUserReviews };
