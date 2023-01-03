import mongoose, { ObjectId } from "mongoose";
import { IUser } from "./User";
const Schema = mongoose.Schema;

export interface IMessage {
  _id: ObjectId;
  title: string;
  content: string;
  timestamp: Date;
  author: IUser;
}
const MessageSchema = new Schema<IMessage>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Message = mongoose.model<IMessage>("messages", MessageSchema);
