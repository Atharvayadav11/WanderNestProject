const express=require("express");
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")
const Listing = require('../models/listing.js');
const flash=require("connect-flash"); 
const session=require("express-session");
const {isLoggedIn,isOwner}=require("../middleware.js")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })



router.post("/",upload.single('listing[image]'),wrapAsync(async(req,res,isLoggedIn,next) => {

  let result=listingSchema.validate(req.body)
  console.log(result)
  if(result.error){
    throw new ExpressError(400,result.error)
  }
  const newListing=new Listing(req.body.listing)
  newListing.owner=req.user._id;
  

await newListing.save();

req.flash("success","New Listing Created")
res.redirect('/Listings')
  

}))

router.get("/new",isLoggedIn,(req,res)=>{
  
res.render("Listings/new.ejs")
})

router.get("/:id",wrapAsync( async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
  res.render("listings/show.ejs",{listing})
}))





router.get("/",wrapAsync( async(req,res)=>{
 const allListings= await Listing.find({});
 res.render("listings/index.ejs",{allListings});

}));


router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
  let {id}=req.params;
  let deletedListing=await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted")
  console.log(deletedListing)
  res.redirect("/Listings")
}))

router.put("/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing})

  res.redirect("/Listings")
}))
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  req.flash("success","Listing Updated")
  res.render("listings/edit.ejs",{listing});
}))
 

module.exports=router;