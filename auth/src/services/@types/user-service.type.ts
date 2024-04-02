import { IUserDocument } from "../../database/models/user.model";

export interface UserSignUpResult extends IUserDocument {}
export interface UserSignInResult extends IUserDocument {}

export interface UserSignUpParams {
  username: string;
  email: string;
  password?: string;
  phone?: string;
  isVerified?: boolean;
  googleId?: string;
}
