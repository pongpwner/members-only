let User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

exports.getSignUpForm = function (req, res, next) {
  res.render("sign-up");
};

exports.signUp = [
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
      });
    }
  },
];
exports.getLogInForm = function (req, res) {
  res.render("login");
};

exports.logIn = [
  body("username").escape(),
  body("password").escape(),
  function (req, res, next) {
    const errors = validationResult(req);
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
  }),
];
exports.logOut = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
