var express = require("express");
var router = express.Router();
let User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", messages: null });
});

router.get("/sign-up", function (req, res, next) {
  res.render("sign-up");
});
router.post("/sign-up", function (req, res, next) {
  //hash password
  bcrypt.hash(req.body.password, 10, async function (err, hash) {
    //check err
    if (err) {
      return next(err);
    }
    let userDetails = {
      username: req.body.username,
      password: hash,
      membership: false,
    };
    let newUser = new User(userDetails);
    //save user to database
    await newUser.save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect("/login");
    });

    // passport.authenticate("local", {
    //   successRedirect: "/message",
    //   failureRedirect: "/login",
    // });
  });
});

router.get("/login", function (req, res) {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
module.exports = router;
