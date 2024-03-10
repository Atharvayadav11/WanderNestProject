const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require('../MajorProject/models/listing.js');
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");


main()
  .then(()=>{
    console.log("Connected to DB");
  })
  .catch((err)=>{
    console.log(err);
  })
async function main(){
  await mongoose.connect("mongodb://127.0.0.1:27017/WanderNest");
}

app.listen(3000,() =>{
  console.log("listening on port 3000");

});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")));

app.post("/Listings",async(req,res)=>{
  
  const newListing=new Listing(req.body.listing)
  await newListing.save()
  res.redirect('/Listings')
})

app.delete("/Listings/:id",async(req,res)=>{
  let {id}=req.params;
  let deletedListing=await Listing.findByIdAndDelete(id);
  console.log(deletedListing)
  res.redirect("/Listings")
})

app.put("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect("/Listings")
})
app.get("/Listings/:id/edit",async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
})
app.get("/Listings/new",(req,res)=>{
  res.render("Listings/new.ejs")
})

app.get("/Listings/:id", async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/show.ejs",{listing})
})



app.get("/Listings", async(req,res)=>{
 const allListings= await Listing.find({});
 res.render("listings/index.ejs",{allListings});

});
// app.get("/testListing",async(req,res)=>{
//   let sampleListing=new Listing({
//     title:"My Villa",
//     description:"By The Beach",
//     price:1222,
//     location:"Goa",
//     country:"India",
//   });
//   await sampleListing.save()
//   console.log("sample was saved");
//   res.send("successful testing")

// })
app.get("/",(req,res)=>{
  res.send("hii,am root")
})