"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const MessageSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
});
exports.Message = mongoose_1.default.model("messages", MessageSchema);
