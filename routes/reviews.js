const express = require('express');
const router = express.Router({ mergeParams: true });
const Pub = require('../models/pub');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas.js');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

router.post('/', validateReview, catchAsync(async(req, res) => {
  const { id } = req.params;
  const pub = await Pub.findById(id);
  const review = new Review(req.body.review);
  pub.reviews.push(review);
  await review.save();
  await pub.save();
  console.log(review);
  res.redirect(`/pubs/${pub._id}`);
}))

router.delete('/:reviewId', catchAsync(async(req, res) => {
  const { id, reviewId } = req.params;
  const pub = await Pub.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/pubs/${id}`);
}))

module.exports = router;