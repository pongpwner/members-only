var express = require("express");
const { render } = require("../app");
var router = express.Router();
const Message = require("../models/Message");

router.get("/", function (req, res) {
  res.render("create-message");
});

router.post("/", function (req, res) {
  //need to sanitize inputs
  console.log(req.user);
  let messageDetails = {
    title: req.body.title,
    content: req.body.content,
    author: req.user._id,
    timestamp: new Date(),
  };
  let newMessage = new Message(messageDetails);
  newMessage.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
