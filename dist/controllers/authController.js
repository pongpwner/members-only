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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const express_validator_1 = require("express-validator");
exports.getSignUpForm = function (req, res, next) {
    res.render("sign-up");
};
exports.signUp = [
    (0, express_validator_1.body)("username", "username must have 1-16 characters")
        .trim()
        .isLength({ min: 1, max: 16 })
        .escape(),
    (0, express_validator_1.body)("password", "password must be betweeen 6 and 20 characters")
        .isLength({ min: 6, max: 20 })
        .escape(),
    function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                //errors found, rerender form with appropriate information
                res.render("sign-up", {
                    errors: errors.array(),
                    username: req.body.username,
                    password: req.body.password,
                });
            }
            else {
                // no errors is valid
                //check for duplicate username
                let duplicateUser = yield User_1.User.find({ username: req.body.username });
                console.log(duplicateUser);
                if (duplicateUser.length > 0) {
                    return res.render("sign-up", {
                        errors: [{ msg: "userrname exists" }],
                        username: req.body.username,
                        password: req.body.password,
                    });
                }
                //hash password
                bcrypt_1.default.hash(req.body.password, 10, function (err, hash) {
                    return __awaiter(this, void 0, void 0, function* () {
                        //check err
                        if (err) {
                            return next(err);
                        }
                        let userDetails = {
                            username: req.body.username,
                            password: hash,
                            membership: false,
                        };
                        let newUser = new User_1.User(userDetails);
                        //save user to database
                        yield newUser.save((err) => {
                            if (err) {
                                return next(err);
                            }
                            res.redirect("/login");
                        });
                    });
                });
            }
        });
    },
];
exports.getLogInForm = function (req, res) {
    res.render("login");
};
exports.logIn = [
    (0, express_validator_1.body)("username").escape(),
    (0, express_validator_1.body)("password").escape(),
    function (req, res, next) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.render("login", {
                password: req.body.password,
                username: req.body.username,
            });
        }
        else {
            next();
        }
    },
    passport_1.default.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    }),
];
exports.logOut = function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};
