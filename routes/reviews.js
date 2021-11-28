const express = require('express');
const router = express.Router({ mergeParams: true });
const Pub = require('../models/pub');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const { reviewSchema } = require('../schemas.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../utils/middleware')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
  const { id, reviewId } = req.params;
  const pub = await Pub.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted review.');
  res.redirect(`/pubs/${id}`);
}))

module.exports = router;