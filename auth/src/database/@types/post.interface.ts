import { ICompanyDocument } from "./company.interface";

export interface IPostDocument {
  _id?: string,
  companyId?: string | ICompanyDocument;
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