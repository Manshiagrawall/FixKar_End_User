const express = require('express');
const {
  submitReview,
  getReviews,
  updateReview,  // Include the update review function
  deleteReview,
} = require('../controllers/reviewController');

const router = express.Router();

// Submit a review
router.post('/submit-review', submitReview);

// Get reviews for a specific service
router.get('/getReviews/:serviceId', getReviews);

// Update a review
router.put('/updateReview/:reviewId', updateReview);  // Add PUT route for updating review

// Delete a review
router.delete('/deleteReview/:reviewId', deleteReview);

module.exports = router;
