var express = require("express");
var router = express.Router();
const Message = require("../models/Message");

router.get("/", function (req, res) {
  console.log(req.session);
  console.log(req.user);
  res.render("create-message");
});

router.post("/", function (req, res, next) {
  //need to sanitize inputs
  console.log("message");
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

router.post("/delete/:id", function (req, res, next) {
  console.log(req.params.id);
  Message.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      next(err);
    }
    res.redirect("back");
  });
});
module.exports = router;
