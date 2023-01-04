import express from "express";
const auth_controller = require("../controllers/authController");
const message_controller = require("../controllers/messageController");
var router = express.Router();

/* GET home page. */
router.get("/", message_controller.getAllMessages);
router.get("/sign-up", auth_controller.getSignUpForm);
router.post("/sign-up", auth_controller.signUp);
router.get("/login", auth_controller.getLogInForm);
router.post("/login", auth_controller.logIn);
router.post("/logout", auth_controller.logOut);
export default router;
