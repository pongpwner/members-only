"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const user_controller = require("../controllers/userController");
router.get("/", user_controller.getMembershipForm);
router.post("/", user_controller.submitMemberCode);
exports.default = router;
