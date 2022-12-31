var express = require("express");
var router = express.Router();
let User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Message = require("../models/Message");
/* GET home page. */
router.get("/", async function (req, res, next) {
  let messageList = await Message.find({}).populate("author");
  res.render("index", { title: "Express", messages: messageList });
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

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
