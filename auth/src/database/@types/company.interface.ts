
export interface ICompanyDocument {
  _id?: string;
  name?: string;
  description?: string;
  industry?: string[];
  location?: number[];
  website?: string;
  logo?: string;
  username: string;
}