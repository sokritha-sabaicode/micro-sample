import mongoose, { Schema, model } from 'mongoose';

const userSchema: Schema = new Schema({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
  username: { type: String, index: true },
  email: { type: String, index: true },
  profile: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  phoneNumber: String,
  createdAt: { type: Date, default: Date.now() }
}, {
  toJSON: {
    transform(_doc, ret) {
      delete ret.authId;
      delete ret.__v;
    },
  },
})

const UserModel = model("User", userSchema)

export default UserModel