const mongoose = require('mongoose');
const Tour = require('./tourModel');

// review / rating / createdAt / ref to tour / ref to user

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // hide createdAt from users
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong tou a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belond to a user'],
    },
  },
  // unhide virtuals
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// avoid duplicate reviews! one user=one tour=one review!
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'user',
  //     select: 'name',
  //   }).populate({
  //     path: 'tour',
  //     select: 'name photo',
  //   });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// Static Method
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  //console.log(stats); // stats is array, check if it is not null!
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// update avg rating each time 'save'
reviewSchema.post('save', function () {
  // this points to current review
  // constructor here is Review, but it is not declared yet!
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // we can not run this function with post, only pre, to get review
  this.r = await this.findOne();
  // console.log(this.r);
});

// getting tour id from this.r and updating in post!
reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); doesn't work here, query has already executed!
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

// Creating Model with Schema tourSchema
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
