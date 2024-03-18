import { IUser } from "../../database/models/user.model";

export interface UserSignUpResult {
  user: IUser;
  token: string;
}