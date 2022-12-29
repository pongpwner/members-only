var express = require("express");
var router = express.Router();
let User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { render } = require("../app");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", messages: null });
});

router.get("/sign-up", function (req, res, next) {
  res.render("sign-up");
});
router.post("/sign-up", function (req, res, next) {
  //hash password
  bcrypt.hash(req.body.passwordSignup, 10, function (err, hash) {
    //check err
    if (err) {
      return next(err);
    }
    let userDetails = {
      username: req.body.usernameSignup,
      password: hash,
      membership: false,
    };
    let newUser = new User(userDetails);
    //save user to database
    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      //req.session.save();
      res.redirect("/message");
    });
  });
});

router.get("/login", function (req, res) {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/login",
    failureRedirect: "/login",
  })
);
module.exports = router;
