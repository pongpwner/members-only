var express = require("express");
var router = express.Router();
const User = require("../models/User");

router.get("/", (req, res) => {
  res.render("membership-form");
});

router.post("/", async (req, res) => {
  if (req.body.code === "1") {
    User.findOneAndUpdate(
      { _id: req.user._id },
      { membership: true },
      { new: true },
      function (err, result) {
        if (err) {
          res.send(err);
        }
        res.redirect("/");
      }
    );
  } else {
    return res.redirect("/");
  }
});

module.exports = router;
