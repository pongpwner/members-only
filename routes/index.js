var express = require("express");
var router = express.Router();
let User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Message = require("../models/Message");
const { body, validationResult } = require("express-validator");
/* GET home page. */
router.get("/", async function (req, res, next) {
  let messageList = await Message.find({}).populate("author");
  res.render("index", { title: "Express", messages: messageList });
});

router.get("/sign-up", function (req, res, next) {
  res.render("sign-up");
});
router.post(
  "/sign-up",
  body("username", "username must have 1-16 characters")
    .trim()
    .isLength({ min: 1, max: 16 })
    .escape(),

  body("password", "password must be betweeen 6 and 20 characters")
    .isLength({ min: 6, max: 10 })
    .escape(),

  function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty(req)) {
      //errors found, rerender form with appropriate information
      res.render("sign-up", {
        errors: errors.array(),
        username: req.body.username,
        password: req.body.password,
      });
    } else {
      // no errors is valid
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
    }
  }
);

router.get("/login", function (req, res) {
  res.render("login");
});
router.post(
  "/login",
  body("username").escape(),

  body("password").escape(),
  function (req, res, next) {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty(req)) {
      res.render("login", {
        password: req.body.password,
        username: req.body.username,
      });
    } else {
      next();
    }
  },
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
