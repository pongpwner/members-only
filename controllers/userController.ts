import User from "../models/User";

exports.getMembershipForm = (req, res) => {
  res.render("membership-form");
};

exports.submitMemberCode = async (req, res) => {
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
};
