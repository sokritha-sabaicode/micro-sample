import APIError from "../../errors/api-error";
import UserModel, { IUser } from "../models/user.model";
import { UserCreateRepository } from "./@types/user-repository.type";

class UserRepository {
  async CreateUser({ username, email, password, phone }: UserCreateRepository) {
    try {
      const user: IUser = new UserModel({
        username,
        email,
        password,
        phone,
      });

      const userResult = await user.save();
      return userResult;
    } catch (error) {
      throw new APIError("Unable to Create User");
    }
  }

  async FindUser({ email }: { email: string }) {
    try {
      const existingUser = await UserModel.findOne({ email: email });
      return existingUser;
    } catch (error) {
      throw new APIError("Unable to Find User");
    }
  }

  async FindUserById({ id }: { id: String }) {
    try {
      const existingUser = await UserModel.findById(id);

      return existingUser
    } catch (error) {
        throw new APIError("Unable to Find User")
    }
  }
}

export default UserRepository;
