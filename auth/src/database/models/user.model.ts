import mongoose, { Document, Model } from "mongoose";

export interface IUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  isVerfied: boolean;
}

export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
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

const UserModel = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default UserModel;
