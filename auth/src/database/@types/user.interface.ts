import { IPostDocument } from "./post.interface";

export interface IUserDocument {
  _id?: string,
  username?: string;
  email?: string;
  profile?: string;
  favorites?: string[] | IPostDocument[];
  createdAt?: Date | string;
  phoneNumber?: string;
}