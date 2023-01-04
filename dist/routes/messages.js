"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const message_controller = require("../controllers/messageController");
router.get("/", message_controller.getMessageForm);
router.post("/", message_controller.postMessage);
router.post("/delete/:id", message_controller.deleteMessage);
exports.default = router;
