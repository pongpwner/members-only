import mongoose, { ObjectId } from "mongoose";
const Schema = mongoose.Schema;

export interface IUser {
  _id: ObjectId;
  username: string;
  password: string;
  membership: boolean;
  admin?: boolean;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  membership: { type: Boolean, required: true },
  admin: { type: Boolean },
});
export const User = mongoose.model<IUser>("User", UserSchema);
