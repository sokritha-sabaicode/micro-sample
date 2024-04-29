import mongoose, { Schema, model } from 'mongoose';

const userSchema: Schema = new Schema({
  username: { type: String, index: true },
  email: { type: String, index: true },
  profile: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  phoneNumber: String,
  createdAt: { type: Date }
}, {
  versionKey: false // remove __v from return doc of mongodb
})

const UserModel = model("User", userSchema)

export default UserModel