const Review = require('../models/reviewModel');

// Submit a review
const submitReview = async (req, res) => {
  const { serviceId, rating, comment } = req.body;

  try {
    const newReview = new Review({ serviceId, rating, comment });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ message: 'Error submitting review', error: err.message });
  }
};

// Get all reviews for a specific service
const getReviews = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const reviews = await Review.find({ serviceId });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true } // This ensures that the updated review is returned
    );

    if (!updatedReview) return res.status(404).json({ message: 'Review not found' });

    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: 'Error updating review', error: err.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review', error: err.message });
  }
};

module.exports = {
  submitReview,
  getReviews,
  updateReview,  // Export updateReview function
  deleteReview,
};
