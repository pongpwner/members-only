"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    membership: { type: Boolean, required: true },
    admin: { type: Boolean },
});
exports.User = mongoose_1.default.model("User", UserSchema);
