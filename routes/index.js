var express = require("express");
var router = express.Router();
let User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { render } = require("../app");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/sign-up", function (req, res, next) {
  res.render("sign-up");
});
router.post("/sign-up", function (req, res, next) {
  //hash password
  bcrypt.hash(req.body.passwordSignup, 10, function (err, hash) {
    let userDetails = {
      username: req.body.usernameSignup,
      password: hash,
    };
    let newUser = new User(userDetails);
    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
});

router.get("/login", function (req, res) {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
module.exports = router;
