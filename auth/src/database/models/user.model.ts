import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  isVerfied: boolean;
}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
  }
);

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
