import mongoose, { Document, Model } from "mongoose";

interface IUserDocument extends Document {
  username: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  role?: 'USER' | 'COMPANY',
  isVerified?: boolean;
  googleId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date
}

interface IUserModel extends Model<IUserDocument> { }

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phoneNumber: { type: String },
    role: { type: String, enum: ["USER", "COMPANY"] },
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
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.googleId;
        delete ret.__v;
      },
    },
  }
);

const UserModel = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default UserModel;
