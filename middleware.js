const Listing=require("./models/listing.js")

module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.flash("success","You must be logged in to create listing");
    return res.redirect("/login")

  }
  next()
}

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("success","You dont have the authorization to perform this task");
    return res.redirect(`/Listing/${id}`)

  }
  next();
}