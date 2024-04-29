import { IUserDocument } from "@users/database/@types/user.interface";
import { ObjectId } from "mongoose";

export interface ICompanyDocument {
  _id?: string | ObjectId;
  name?: string;
  description?: string;
  industry?: string[];
  location?: number[];
  website?: string;
  logo?: string;
  userId?: string | ObjectId | IUserDocument
}