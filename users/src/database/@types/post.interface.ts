import { ICompanyDocument } from "@users/database/@types/company.interface";
import { ObjectId } from "mongoose";

export interface IPostDocument {
  _id?: string | ObjectId,
  companyId?: string | ObjectId | ICompanyDocument;
  title?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  location?: number[];
  duration?: number;
  gender?: string;
  type?: string[];
  availablePosition?: number;
  languages?: string[];
  deadline?: Date | string;
  salaries?: number[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}