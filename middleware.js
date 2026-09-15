const Listing = require("./models/listing");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }else{
        res.locals.redirectUrl = "/listings";
    }
    next();
};

module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    if(!listing.owner.equals(req.user._id)){
        req.flash("error", "You are not authorized to edit this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>el.message.join(","));
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>el.message.join(","));
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};


module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review){
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You are not authorized to delete this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
