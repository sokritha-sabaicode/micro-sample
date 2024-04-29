import { IPostDocument } from "@users/database/@types/post.interface";
import { ObjectId } from "mongoose";

export interface IUserDocument {
  _id?: string | ObjectId,
  username?: string;
  email?: string;
  profile?: string;
  favorites?: string | ObjectId | IPostDocument[];
  createdAt?: Date | string;
  phoneNumber?: string;
}