var express = require("express");
var router = express.Router();
const Message = require("../models/Message");
const { body, validationResult } = require("express-validator");
router.get("/", function (req, res) {
  console.log(req.session);
  console.log(req.user);
  res.render("create-message");
});

router.post(
  "/",
  body("title", "title needs to be between 1 and 30 characters")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("content", "content needs to be between 1 and 300 characters")
    .trim()
    .isLength({ min: 1, max: 300 })
    .escape(),

  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty(req)) {
      res.render("create-message", {
        title: req.body.title,
        content: req.body.content,
        errors: errors.array(),
      });
    } else {
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
    }
  }
);

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
