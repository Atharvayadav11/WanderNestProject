const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {


  try {
    let { username, email, password } = req.body;


    const newUser = new User({ username, email });

    const registeredUser = await User.register(newUser, password);

    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);

      }
      req.flash("success", "User registered successfully. Welcome to WanderNest!");
      res.redirect("/Listings");
    })


  } catch (error) {

    console.error(error);
    req.flash("success", error.message);
    res.redirect("/signup");
  }
});


router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
  req.flash("success", "Welcome back to WanderNest")
  res.redirect("/Listings")

})

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);

    }
    req.flash("success", "Logged you out")
    res.redirect("/listings")
  })

})

module.exports = router;
