if(process.env.NODE_ENV !="production" ){
  require('dotenv').config();
}

const express=require("express");
const app=express();
const MongoStore = require('connect-mongo');
const mongoose=require("mongoose");
const Listing = require('./models/listing.js');
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")
const Review = require('./models/review.js');
const listingRouter=require("./routes/listing.js");
const session=require("express-session");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const flash=require("connect-flash");
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")


const dbUrl=process.env.ATLAS_KEY;

main()
  .then(()=>{
    console.log("Connected to DB");
  })
  .catch((err)=>{
    console.log(err);
  })
async function main(){
  await mongoose.connect(dbUrl);
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

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:"mySuperSecert",

  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("Error in MongoStore",err)

})


const sessionOptions={
  store,
  secret:"mySuperSecert",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}

app.use(session(sessionOptions))

app.use(flash());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.currUser=req.user;
  next();
})

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)

// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404,"Page not found"))

// })
// app.use((err,req,res,test)=>{
//   let{statusCode=500,message="something went wrong!"}=err;
// res.status(statusCode).render("error.ejs",{message})
// })



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
// app.get("/",(req,res)=>{
//   res.send("hii,am root")
// })