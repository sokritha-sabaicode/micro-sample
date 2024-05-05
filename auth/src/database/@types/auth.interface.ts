export interface IAuthDocument {
  _id?: string,
  username?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  role?: 'COMPANY' | 'USER';
  isVerified?: boolean;
  googleId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}