const Listing = require("./Models/listing");
const Review = require("./Models/review");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next)=>
{
  if(!req.isAuthenticated())
  {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be logged in to create listing");
    res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next)=>
{
  if(req.session.redirectUrl)
  {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner =async (req,res,next)=>
{
  let {id}=req.params;
  let listing = await Listing.findById(id);
  if (listing.owner && res.locals.currUser && listing.owner._id && res.locals.currUser._id && !listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error","You are not owner of this listing");
    return res.redirect(`/listings/${id}`);
  } else {
    req.flash("error","Please logged in to Wanderlust");
  }
  // if(!listing.owner._id.equals(res.locals.currUser._id))
  // {
  //   req.flash("error","You are not owner of this listing");
  //   return res.redirect(`/listings/${id}`);
  // }
  next();
};

module.exports.validateaListing = (req,res,next)=>
{
  let {error} = listingSchema.validate(req.body);
    if(error)
    {
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errMsg);
    }
    else {
      next();
    }
};

module.exports.validateaReview = (req,res,next)=>
{
  let {error} = reviewSchema.validate(req.body);
    if(error)
    {
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errMsg);
    }
    else {
      next();
    }
}

module.exports.isReviewAuthor =async (req,res,next)=>
{
  let {id , reviewId}=req.params;
  let review = await Review.findById(reviewId);
  if (review.author && res.locals.currUser && !review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error","You are not author of this review");
    return res.redirect(`/listings/${id}`);
  } else {
    req.flash("error","Please logged in to Wanderlust");
  }
  // if(!review.author._id.equals(res.locals.currUser._id))
  // {
  //   req.flash("error","You are not author of this Review");
  //   return res.redirect(`/listings/${id}`);
  // }
  next();
};