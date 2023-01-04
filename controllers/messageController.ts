import { Request, Response, NextFunction } from "express";
import { Message } from "../models/Message";
import { body, validationResult } from "express-validator";
import { IUserReq } from "../app";
import { Error } from "mongoose";
import { IUser } from "../models/User";
export const getAllMessages = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  let messageList = await Message.find({}).populate("author");
  res.render("index", { title: "Express", messages: messageList });
};

export const getMessageForm = function (req: Request, res: Response) {
  res.render("message-form");
};

export const postMessage = [
  body("title", "title needs to be between 1 and 30 characters")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("content", "content needs to be between 1 and 300 characters")
    .trim()
    .isLength({ min: 1, max: 300 })
    .escape(),
  function (req: IUserReq, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("message-form", {
        title: req.body.title,
        content: req.body.content,
        errors: errors.array(),
      });
    } else {
      let messageDetails = {
        title: req.body.title,
        content: req.body.content,
        author: req.user!._id,
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

export const deleteMessage = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  Message.findByIdAndDelete(req.params.id, function (err: Error) {
    if (err) {
      next(err);
    }
    res.redirect("back");
  });
};
