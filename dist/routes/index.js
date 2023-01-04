"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller = require("../controllers/authController");
const message_controller = require("../controllers/messageController");
var router = express_1.default.Router();
/* GET home page. */
router.get("/", message_controller.getAllMessages);
router.get("/sign-up", auth_controller.getSignUpForm);
router.post("/sign-up", auth_controller.signUp);
router.get("/login", auth_controller.getLogInForm);
router.post("/login", auth_controller.logIn);
router.post("/logout", auth_controller.logOut);
exports.default = router;
