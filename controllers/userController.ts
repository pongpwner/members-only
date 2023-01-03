import { Request, Response } from "express";
import { User, IUser } from "../models/User";
import { IUserReq } from "../app";
exports.getMembershipForm = (req: Request, res: Response) => {
  res.render("membership-form");
};

exports.submitMemberCode = async (req: IUserReq, res: Response) => {
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
