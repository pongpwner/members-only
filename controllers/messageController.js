const Message = require("../models/Message");
const { body, validationResult } = require("express-validator");

exports.getAllMessages = async function (req, res, next) {
  let messageList = await Message.find({}).populate("author");
  res.render("index", { title: "Express", messages: messageList });
};

exports.getMessageForm = function (req, res) {
  res.render("message-form");
};

exports.postMessage = [
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
      res.render("message-form", {
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
  },
];

exports.deleteMessage = function (req, res, next) {
  Message.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      next(err);
    }
    res.redirect("back");
  });
};
