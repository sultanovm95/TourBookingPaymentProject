const Review = require('../models/reviewModel');
const Factory = require('./handlerFactory');

// Check Router, before creating run these checks!
exports.setTourUserIds = (req, res, next) => {
  // if not specified
  if (!req.body.tour) req.body.tour = req.params.tourId;
  // get from protect middleware
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = Factory.getAll(Review);
exports.getReview = Factory.getOne(Review);
exports.createReview = Factory.createOne(Review);
exports.updateReview = Factory.updateOne(Review);
exports.deleteReview = Factory.deleteOne(Review);
