const Pub = require('../models/pub');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
    const { id } = req.params;
    const pub = await Pub.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    pub.reviews.push(review);
    await review.save();
    await pub.save();
    console.log(review);
    req.flash('success', 'Successfully posted new review.');
    res.redirect(`/pubs/${pub._id}`);
};

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    const pub = await Pub.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review.');
    res.redirect(`/pubs/${id}`);
};