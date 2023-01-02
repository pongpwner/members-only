var express = require("express");
const auth_controller = require("../controllers/authController");
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

router.get("/sign-up", auth_controller.getSignUpForm);
router.post("/sign-up", auth_controller.signUp);
router.get("/login", auth_controller.getLogInForm);
router.post("/login", auth_controller.logIn);
router.post("/logout", auth_controller.logOut);
module.exports = router;
