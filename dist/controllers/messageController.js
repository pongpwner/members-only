"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.postMessage = exports.getMessageForm = exports.getAllMessages = void 0;
const Message_1 = require("../models/Message");
const express_validator_1 = require("express-validator");
const getAllMessages = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let messageList = yield Message_1.Message.find({}).populate("author");
        res.render("index", { title: "Express", messages: messageList });
    });
};
exports.getAllMessages = getAllMessages;
const getMessageForm = function (req, res) {
    res.render("message-form");
};
exports.getMessageForm = getMessageForm;
exports.postMessage = [
    (0, express_validator_1.body)("title", "title needs to be between 1 and 30 characters")
        .trim()
        .isLength({ min: 1, max: 30 })
        .escape(),
    (0, express_validator_1.body)("content", "content needs to be between 1 and 300 characters")
        .trim()
        .isLength({ min: 1, max: 300 })
        .escape(),
    function (req, res, next) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.render("message-form", {
                title: req.body.title,
                content: req.body.content,
                errors: errors.array(),
            });
        }
        else {
            let messageDetails = {
                title: req.body.title,
                content: req.body.content,
                author: req.user._id,
                timestamp: new Date(),
            };
            let newMessage = new Message_1.Message(messageDetails);
            newMessage.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/");
            });
        }
    },
];
const deleteMessage = function (req, res, next) {
    Message_1.Message.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            next(err);
        }
        res.redirect("back");
    });
};
exports.deleteMessage = deleteMessage;
