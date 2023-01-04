import express from "express";
var router = express.Router();
const user_controller = require("../controllers/userController");

router.get("/", user_controller.getMembershipForm);
router.post("/", user_controller.submitMemberCode);

export default router;
