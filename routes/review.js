const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../Models/review.js");
const Listing=require("../Models/listing.js");
const {isLoggedIn , validateaReview, isReviewAuthor } = require("../middleware.js")

const reviewController = require("../controllers/reviews.js");

//Review Post Route
router.post("/" ,isLoggedIn , validateaReview , wrapAsync(reviewController.createReview));

//Review Delete Route
router.delete("/:reviewId" ,isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;