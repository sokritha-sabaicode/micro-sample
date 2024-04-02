import mongoose, { Document, Model } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  phone?: string;
  isVerified?: boolean;
}

export interface IUserDocument extends Document {
  username: string;
  email: string;
  password?: string;
  phone?: string;
  isVerified?: boolean;
  googleId?: string;
}

export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    isVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.googleId;
        delete ret.__v;
      },
    },
  }
);

const UserModel = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default UserModel;
