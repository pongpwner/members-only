import express from "express";
var router = express.Router();
const message_controller = require("../controllers/messageController");

router.get("/", message_controller.getMessageForm);
router.post("/", message_controller.postMessage);
router.post("/delete/:id", message_controller.deleteMessage);
export default router;
